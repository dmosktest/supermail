package smtpd

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"net"
	"strings"
	"time"

	"supermail/internal/analyze"
	"supermail/internal/store"
)

func ListenAndServe(addr string, st *store.Store, domain string) error {
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}
	log.Printf("supermail-smtp listening on %s domain=%s", addr, domain)
	for {
		conn, err := ln.Accept()
		if err != nil {
			return err
		}
		go handle(conn, st, domain)
	}
}

func handle(conn net.Conn, st *store.Store, domain string) {
	defer conn.Close()
	_ = conn.SetDeadline(time.Now().Add(2 * time.Minute))
	remoteIP := ""
	if ra := conn.RemoteAddr(); ra != nil {
		host, _, err := net.SplitHostPort(ra.String())
		if err == nil {
			remoteIP = host
		} else {
			remoteIP = ra.String()
		}
	}
	rw := bufio.NewReadWriter(bufio.NewReader(conn), bufio.NewWriter(conn))
	writeLine(rw, "220 "+domain+" ESMTP supermail")

	helo := ""
	mailFrom := ""
	toLocal := ""
	for {
		_ = conn.SetDeadline(time.Now().Add(2 * time.Minute))
		line, err := rw.ReadString('\n')
		if err != nil {
			return
		}
		line = strings.TrimRight(line, "\r\n")
		cmd := strings.ToUpper(line)
		switch {
		case strings.HasPrefix(cmd, "EHLO ") || strings.HasPrefix(cmd, "HELO "):
			parts := strings.SplitN(line, " ", 2)
			if len(parts) == 2 {
				helo = strings.TrimSpace(parts[1])
			}
			if strings.HasPrefix(cmd, "EHLO ") {
				writeLine(rw, "250-"+domain)
				writeLine(rw, "250-SIZE 2097152")
				writeLine(rw, "250-8BITMIME")
				writeLine(rw, "250 OK")
			} else {
				writeLine(rw, "250 "+domain)
			}
		case cmd == "NOOP" || strings.HasPrefix(cmd, "NOOP "):
			writeLine(rw, "250 OK")
		case cmd == "RSET":
			mailFrom = ""
			toLocal = ""
			writeLine(rw, "250 OK")
		case strings.HasPrefix(cmd, "MAIL FROM:"):
			mailFrom = extractAddr(line[len("MAIL FROM:"):])
			toLocal = ""
			writeLine(rw, "250 OK")
		case strings.HasPrefix(cmd, "RCPT TO:"):
			addr := extractAddr(line[len("RCPT TO:"):])
			local, host, ok := splitMailbox(addr)
			if !ok || !strings.EqualFold(host, domain) {
				writeLine(rw, "550 unknown recipient domain")
				continue
			}
			if _, found := st.LookupLocal(local); !found {
				writeLine(rw, "550 unknown mailbox")
				continue
			}
			toLocal = local
			writeLine(rw, "250 OK")
		case cmd == "DATA":
			if toLocal == "" {
				writeLine(rw, "503 no valid recipients")
				continue
			}
			writeLine(rw, "354 End data with <CR><LF>.<CR><LF>")
			raw, err := readData(rw)
			if err != nil {
				writeLine(rw, "554 message read failed")
				return
			}
			if len(raw) > 2<<20 {
				writeLine(rw, "552 message too large")
				continue
			}
			ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
			rep := analyze.Run(ctx, raw, remoteIP, helo, mailFrom)
			cancel()
			if ok := st.Complete(toLocal, rep, len(raw)); !ok {
				writeLine(rw, "550 mailbox unavailable")
				continue
			}
			log.Printf("accepted mail for %s@%s from %s (%d bytes)", toLocal, domain, remoteIP, len(raw))
			writeLine(rw, "250 OK")
			mailFrom = ""
			toLocal = ""
		case cmd == "QUIT":
			writeLine(rw, "221 Bye")
			return
		default:
			writeLine(rw, "502 command not implemented")
		}
	}
}

func writeLine(rw *bufio.ReadWriter, s string) {
	_, _ = rw.WriteString(s + "\r\n")
	_ = rw.Flush()
}

func extractAddr(s string) string {
	s = strings.TrimSpace(s)
	if i := strings.Index(s, ">"); i >= 0 {
		s = s[:i+1]
	}
	s = strings.Trim(s, "<> ")
	if i := strings.IndexAny(s, " \t"); i >= 0 {
		s = s[:i]
	}
	return strings.Trim(s, "<>")
}

func splitMailbox(addr string) (local, host string, ok bool) {
	addr = strings.ToLower(strings.TrimSpace(addr))
	parts := strings.SplitN(addr, "@", 2)
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return "", "", false
	}
	return parts[0], parts[1], true
}

func readData(rw *bufio.ReadWriter) ([]byte, error) {
	var buf bytes.Buffer
	for {
		line, err := rw.ReadBytes('\n')
		if err != nil {
			if err == io.EOF && buf.Len() > 0 {
				break
			}
			return nil, err
		}
		if bytes.Equal(line, []byte(".\r\n")) || bytes.Equal(line, []byte(".\n")) {
			break
		}
		if bytes.HasPrefix(line, []byte("..")) {
			line = line[1:]
		}
		if _, err := buf.Write(line); err != nil {
			return nil, err
		}
		if buf.Len() > 2<<20 {
			return nil, fmt.Errorf("too large")
		}
	}
	return buf.Bytes(), nil
}
