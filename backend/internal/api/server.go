package api

import (
	"context"
	"encoding/json"
	"net"
	"net/http"
	"strings"
	"time"

	"supermail/internal/check"
	"supermail/internal/rate"
)

type Server struct {
	limiter *rate.Limiter
	mux     *http.ServeMux
}

func New() *Server {
	s := &Server{
		limiter: rate.New(15 * time.Second),
		mux:     http.NewServeMux(),
	}
	s.mux.HandleFunc("GET /health", s.health)
	s.mux.HandleFunc("GET /api/v1/health", s.health)
	s.mux.HandleFunc("POST /api/v1/check", s.check)
	s.mux.HandleFunc("GET /api/v1/check", s.checkGET)
	return s
}

func (s *Server) Handler() http.Handler {
	return s.withCORS(s.mux)
}

func (s *Server) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) checkGET(w http.ResponseWriter, r *http.Request) {
	req := check.Request{
		Domain:   r.URL.Query().Get("domain"),
		Selector: r.URL.Query().Get("selector"),
		IP:       r.URL.Query().Get("ip"),
	}
	s.runCheck(w, r, req)
}

func (s *Server) check(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	var req check.Request
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_json", "Invalid JSON body")
		return
	}
	s.runCheck(w, r, req)
}

func (s *Server) runCheck(w http.ResponseWriter, r *http.Request, req check.Request) {
	ip := clientIP(r)
	if ok, wait := s.limiter.Allow(ip); !ok {
		w.Header().Set("Retry-After", strings.TrimSuffix(wait.Round(time.Second).String(), "s"))
		writeErr(w, http.StatusTooManyRequests, "rate_limited", "Too many checks; wait and retry")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 25*time.Second)
	defer cancel()
	rep, err := check.Run(ctx, req)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_domain", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, rep)
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

func (s *Server) withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
