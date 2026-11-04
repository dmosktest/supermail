package store

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"
)

type Status string

const (
	StatusWaiting Status = "waiting"
	StatusReady   Status = "ready"
	StatusExpired Status = "expired"
)

type Inbox struct {
	ID        string    `json:"id"`
	LocalPart string    `json:"localPart"`
	Address   string    `json:"address"`
	Status    Status    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
	ExpiresAt time.Time `json:"expiresAt"`
	Report    any       `json:"report,omitempty"`
	RawSize   int       `json:"rawSize,omitempty"`
}

type Store struct {
	mu        sync.RWMutex
	byID      map[string]*Inbox
	byLocal   map[string]*Inbox
	ttl       time.Duration
	reportTTL time.Duration
	domain    string
	dataDir   string
}

func New(domain string, ttl, reportTTL time.Duration, dataDir string) *Store {
	if reportTTL <= 0 {
		reportTTL = 7 * 24 * time.Hour
	}
	s := &Store{
		byID:      map[string]*Inbox{},
		byLocal:   map[string]*Inbox{},
		ttl:       ttl,
		reportTTL: reportTTL,
		domain:    domain,
		dataDir:   dataDir,
	}
	if dataDir != "" {
		if err := os.MkdirAll(dataDir, 0o755); err != nil {
			log.Printf("store: mkdir %s: %v", dataDir, err)
		} else {
			s.loadFromDisk()
		}
	}
	go s.reaper()
	return s
}

func (s *Store) Domain() string { return s.domain }

func (s *Store) Create() (*Inbox, error) {
	id, err := randomHex(8)
	if err != nil {
		return nil, err
	}
	local, err := randomHex(6)
	if err != nil {
		return nil, err
	}
	now := time.Now().UTC()
	in := &Inbox{
		ID:        id,
		LocalPart: local,
		Address:   local + "@" + s.domain,
		Status:    StatusWaiting,
		CreatedAt: now,
		ExpiresAt: now.Add(s.ttl),
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.byID[id] = in
	s.byLocal[local] = in
	s.persistLocked(in)
	return clone(in), nil
}

func (s *Store) Get(id string) (*Inbox, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	in, ok := s.byID[id]
	if !ok {
		return nil, false
	}
	cp := clone(in)
	if time.Now().After(in.ExpiresAt) && (cp.Status == StatusWaiting || cp.Status == StatusReady) {
		cp.Status = StatusExpired
		if in.Status == StatusReady {
			cp.Report = nil
		}
	}
	return cp, true
}

func (s *Store) LookupLocal(local string) (*Inbox, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	in, ok := s.byLocal[local]
	if !ok {
		return nil, false
	}
	if time.Now().After(in.ExpiresAt) {
		return nil, false
	}
	if in.Status != StatusWaiting {
		return nil, false
	}
	return in, true
}

func (s *Store) Complete(local string, report any, rawSize int) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	in, ok := s.byLocal[local]
	if !ok || in.Status != StatusWaiting || time.Now().After(in.ExpiresAt) {
		return false
	}
	in.Status = StatusReady
	in.Report = report
	in.RawSize = rawSize
	in.ExpiresAt = time.Now().UTC().Add(s.reportTTL)
	s.persistLocked(in)
	return true
}

func (s *Store) reaper() {
	t := time.NewTicker(2 * time.Minute)
	for range t.C {
		now := time.Now()
		s.mu.Lock()
		for id, in := range s.byID {
			if now.After(in.ExpiresAt.Add(10 * time.Minute)) {
				delete(s.byID, id)
				delete(s.byLocal, in.LocalPart)
				s.removeFileLocked(id)
				continue
			}
			if now.After(in.ExpiresAt) && in.Status == StatusWaiting {
				in.Status = StatusExpired
				s.persistLocked(in)
			} else if now.After(in.ExpiresAt) && in.Status == StatusReady {
				in.Status = StatusExpired
				in.Report = nil
				s.persistLocked(in)
			}
		}
		s.mu.Unlock()
	}
}

func (s *Store) loadFromDisk() {
	entries, err := os.ReadDir(s.dataDir)
	if err != nil {
		log.Printf("store: read dir %s: %v", s.dataDir, err)
		return
	}
	now := time.Now()
	loaded := 0
	for _, e := range entries {
		if e.IsDir() || filepath.Ext(e.Name()) != ".json" {
			continue
		}
		path := filepath.Join(s.dataDir, e.Name())
		b, err := os.ReadFile(path)
		if err != nil {
			log.Printf("store: read %s: %v", path, err)
			continue
		}
		var in Inbox
		if err := json.Unmarshal(b, &in); err != nil {
			log.Printf("store: decode %s: %v", path, err)
			continue
		}
		if in.ID == "" || in.LocalPart == "" {
			continue
		}
		if now.After(in.ExpiresAt.Add(10 * time.Minute)) {
			_ = os.Remove(path)
			continue
		}
		if now.After(in.ExpiresAt) {
			in.Status = StatusExpired
			in.Report = nil
		}
		cp := in
		s.byID[cp.ID] = &cp
		s.byLocal[cp.LocalPart] = &cp
		loaded++
	}
	log.Printf("store: loaded %d inbox(es) from %s", loaded, s.dataDir)
}

func (s *Store) persistLocked(in *Inbox) {
	if s.dataDir == "" || in == nil {
		return
	}
	b, err := json.Marshal(in)
	if err != nil {
		log.Printf("store: encode %s: %v", in.ID, err)
		return
	}
	path := filepath.Join(s.dataDir, in.ID+".json")
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, b, 0o644); err != nil {
		log.Printf("store: write %s: %v", tmp, err)
		return
	}
	if err := os.Rename(tmp, path); err != nil {
		log.Printf("store: rename %s: %v", path, err)
		_ = os.Remove(tmp)
	}
}

func (s *Store) removeFileLocked(id string) {
	if s.dataDir == "" || id == "" {
		return
	}
	_ = os.Remove(filepath.Join(s.dataDir, id+".json"))
}

func clone(in *Inbox) *Inbox {
	cp := *in
	return &cp
}

func randomHex(n int) (string, error) {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
