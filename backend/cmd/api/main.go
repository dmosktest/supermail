package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"supermail/internal/api"
	"supermail/internal/smtpd"
	"supermail/internal/store"
)

func main() {
	mailDomain := env("MAIL_DOMAIN", "inbox.supermail.dmosk.net")
	httpAddr := env("HTTP_ADDR", ":8080")
	smtpAddr := env("SMTP_ADDR", ":2525")
	ttl := 30 * time.Minute

	st := store.New(mailDomain, ttl)
	go func() {
		if err := smtpd.ListenAndServe(smtpAddr, st, mailDomain); err != nil {
			log.Fatal(err)
		}
	}()

	srv := &http.Server{
		Addr:              httpAddr,
		Handler:           api.New(st).Handler(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      35 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
	go func() {
		log.Printf("supermail-api listening on %s mailDomain=%s", httpAddr, mailDomain)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()
	_ = srv.Shutdown(ctx)
}

func env(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
