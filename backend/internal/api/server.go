package api

import (
	"context"
	"encoding/json"
	"net"
	"net/http"
	"strings"
	"time"

	"supermail/internal/analyze"
	"supermail/internal/rate"
	"supermail/internal/store"
)

type Server struct {
	store   *store.Store
	limiter *rate.Limiter
	mux     *http.ServeMux
}

func New(st *store.Store) *Server {
	s := &Server{
		store:   st,
		limiter: rate.New(10 * time.Second),
		mux:     http.NewServeMux(),
	}
	s.mux.HandleFunc("GET /health", s.health)
	s.mux.HandleFunc("GET /api/v1/health", s.health)
	s.mux.HandleFunc("POST /api/v1/inbox", s.createInbox)
	s.mux.HandleFunc("GET /api/v1/inbox/{id}", s.getInbox)
	s.mux.HandleFunc("POST /api/v1/inbox/{id}/retest", s.retestInbox)
	return s
}

func (s *Server) Handler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		s.mux.ServeHTTP(w, r)
	})
}

func (s *Server) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) createInbox(w http.ResponseWriter, r *http.Request) {
	in, err := s.store.Create(clientIP(r))
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "server_error", "Could not create inbox")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"id":        in.ID,
		"address":   in.Address,
		"status":    in.Status,
		"expiresAt": in.ExpiresAt.Format(time.RFC3339),
		"pollUrl":   "/api/v1/inbox/" + in.ID,
	})
}

func (s *Server) getInbox(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	in, ok := s.store.Get(id)
	if !ok {
		writeErr(w, http.StatusNotFound, "not_found", "Inbox not found")
		return
	}
	writeJSON(w, http.StatusOK, in)
}

func (s *Server) retestInbox(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	ip := clientIP(r)
	if ok, wait := s.limiter.Allow("retest:" + ip); !ok {
		w.Header().Set("Retry-After", strings.TrimSuffix(wait.Round(time.Second).String(), "s"))
		writeErr(w, http.StatusTooManyRequests, "rate_limited", "Too many retests; wait and retry")
		return
	}
	raw, mailCtx, ok := s.store.LoadRaw(id)
	if !ok {
		writeErr(w, http.StatusConflict, "retest_unavailable", "No stored message to retest; send a new letter after updating the service")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 25*time.Second)
	defer cancel()
	rep := analyze.Run(ctx, raw, mailCtx.RemoteIP, mailCtx.Helo, mailCtx.MailFrom, mailCtx.InboundTLS)
	in, ok := s.store.ReplaceReport(id, rep)
	if !ok {
		writeErr(w, http.StatusConflict, "retest_unavailable", "Inbox is not ready for retest")
		return
	}
	writeJSON(w, http.StatusOK, in)
}

func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		parts := strings.Split(xff, ",")
		return strings.TrimSpace(parts[0])
	}
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return strings.TrimSpace(xri)
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]string{"error": code, "message": message})
}
