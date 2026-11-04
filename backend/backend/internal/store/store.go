package store

import (
	"crypto/rand"
	"encoding/hex"
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
	mu      sync.RWMutex
	byID    map[string]*Inbox
	byLocal map[string]*Inbox
	ttl     time.Duration
	domain  string
}

func New(domain string, ttl time.Duration) *Store {
	s := &Store{
		byID:    map[string]*Inbox{},
		byLocal: map[string]*Inbox{},
		ttl:     ttl,
		domain:  domain,
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
	return clone(in), nil
}

func (s *Store) Get(id string) (*Inbox, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	in, ok := s.byID[id]
	if !ok {
		return nil, false
	}
	if time.Now().After(in.ExpiresAt) && in.Status == StatusWaiting {
		in.Status = StatusExpired
	}
	return clone(in), true
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
			} else if now.After(in.ExpiresAt) && in.Status == StatusWaiting {
				in.Status = StatusExpired
			}
		}
		s.mu.Unlock()
	}
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
