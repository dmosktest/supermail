package smtpd

import (
	"bufio"
	"bytes"
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"fmt"
	"io"
	"log"
	"math/big"
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
	tlsCfg, err := selfSignedTLS(domain)
	if err != nil {
		return fmt.Errorf("smtp tls: %w", err)
	}
	log.Printf("supermail-smtp listening on %s domain=%s", addr, domain)
	for {
		conn, err := ln.Accept()
		if err != nil {
			return err
		}
		go handle(conn, st, domain, tlsCfg)
	}
}

func handle(conn net.Conn, st *store.Store, domain string, tlsCfg *tls.Config) {
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
	log.Printf("smtp connect from %s", remoteIP)

	var (
		raw net.Conn = conn
		br           = bufio.NewReader(conn)
		bw           = bufio.NewWriter(conn)
		usingTLS     bool
	)
	writeLine := func(s string) {
		_, _ = bw.WriteString(s + "\r\n")
		_ = bw.Flush()
	}
	writeLine("220 " + domain + " ESMTP supermail")

	helo := ""
	mailFrom := ""
	toLocal := ""
	for {
		_ = raw.SetDeadline(time.Now().Add(2 * time.Minute))
		line, err := br.ReadString('\n')
		if err != nil {
			return
		}
		line = strings.TrimRight(line, "\r\n")
		if line == "" {
			continue
		}
		cmd := strings.ToUpper(line)
		verb := cmd
		if i := strings.IndexByte(verb, ' '); i > 0 {
			verb = verb[:i]
		}
		switch {
		case strings.HasPrefix(cmd, "EHLO ") || strings.HasPrefix(cmd, "HELO "):
			parts := strings.SplitN(line, " ", 2)
			if len(parts) == 2 {
				helo = strings.TrimSpace(parts[1])
			}
			if strings.HasPrefix(cmd, "EHLO ") {
				writeLine("250-" + domain)
				writeLine("250-SIZE 2097152")
				writeLine("250-8BITMIME")
				if !usingTLS {
					writeLine("250-STARTTLS")
				}
				writeLine("250 OK")
			} else {
				writeLine("250 " + domain)
			}
		case cmd == "NOOP" || strings.HasPrefix(cmd, "NOOP "):
			writeLine("250 OK")
		case cmd == "RSET":
			mailFrom = ""
			toLocal = ""
			writeLine("250 OK")
		case strings.HasPrefix(cmd, "MAIL FROM:"):
			mailFrom = extractAddr(line[len("MAIL FROM:"):])
			toLocal = ""
			writeLine("250 OK")
		case strings.HasPrefix(cmd, "VRFY ") || cmd == "VRFY":
			writeLine("252 Cannot VRFY user, but will accept message and attempt delivery")
		case strings.HasPrefix(cmd, "EXPN ") || cmd == "EXPN":
			writeLine("252 Cannot EXPN, but will accept message and attempt delivery")
		case cmd == "STARTTLS":
			if usingTLS {
				writeLine("503 TLS already active")
				continue
			}
			if tlsCfg == nil {
				writeLine("454 TLS not available")
				continue
			}
			writeLine("220 Ready to start TLS")
			tlsConn := tls.Server(raw, tlsCfg)
			if err := tlsConn.Handshake(); err != nil {
				log.Printf("smtp STARTTLS handshake fail from %s: %v", remoteIP, err)
				return
			}
			raw = tlsConn
			br = bufio.NewReader(tlsConn)
			bw = bufio.NewWriter(tlsConn)
			usingTLS = true
			mailFrom = ""
			toLocal = ""
			log.Printf("smtp STARTTLS ok from %s", remoteIP)
		case strings.HasPrefix(cmd, "RCPT TO:"):
			addr := extractAddr(line[len("RCPT TO:"):])
			local, host, ok := splitMailbox(addr)
			if !ok || !strings.EqualFold(host, domain) {
				log.Printf("smtp RCPT reject from %s addr=%q", remoteIP, addr)
				writeLine("550 unknown recipient domain")
				continue
			}
			toLocal = local
			log.Printf("smtp RCPT accept from %s to=%s@%s", remoteIP, local, domain)
			writeLine("250 OK")
		case cmd == "DATA":
			if toLocal == "" {
				writeLine("503 no valid recipients")
				continue
			}
			writeLine("354 End data with <CR><LF>.<CR><LF>")
			rawMsg, err := readData(br)
			if err != nil {
				writeLine("554 message read failed")
				return
			}
			if len(rawMsg) > 2<<20 {
				writeLine("552 message too large")
				continue
			}
			if _, found := st.LookupLocal(toLocal); !found {
				log.Printf("discard mail for unknown/expired %s@%s from %s (%d bytes)", toLocal, domain, remoteIP, len(rawMsg))
				writeLine("250 OK")
				mailFrom = ""
				toLocal = ""
				continue
			}
			rawMsg = stampReceived(rawMsg, domain, remoteIP, helo, usingTLS)
			ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
			rep := analyze.Run(ctx, rawMsg, remoteIP, helo, mailFrom, usingTLS)
			cancel()
			if ok := st.Complete(toLocal, rep, len(rawMsg)); !ok {
				log.Printf("discard mail for unavailable %s@%s from %s (%d bytes)", toLocal, domain, remoteIP, len(rawMsg))
				writeLine("250 OK")
				mailFrom = ""
				toLocal = ""
				continue
			}
			log.Printf("accepted mail for %s@%s from %s (%d bytes)", toLocal, domain, remoteIP, len(rawMsg))
			writeLine("250 OK")
			mailFrom = ""
			toLocal = ""
		case strings.HasPrefix(cmd, "QUIT"):
			writeLine("221 Bye")
			return
		default:
			log.Printf("smtp unknown cmd from %s: %s", remoteIP, verb)
			writeLine("502 command not implemented")
		}
	}
}

func selfSignedTLS(domain string) (*tls.Config, error) {
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, err
	}
	serial, err := rand.Int(rand.Reader, big.NewInt(1<<62))
	if err != nil {
		return nil, err
	}
	tmpl := &x509.Certificate{
		SerialNumber: serial,
		Subject:      pkix.Name{CommonName: domain, Organization: []string{"supermail"}},
		NotBefore:    time.Now().Add(-time.Hour),
		NotAfter:     time.Now().Add(365 * 24 * time.Hour),
		KeyUsage:     x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
		ExtKeyUsage:  []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		DNSNames:     []string{domain, "dmosk.net", "mksrv.dmosk.ru"},
	}
	der, err := x509.CreateCertificate(rand.Reader, tmpl, tmpl, &key.PublicKey, key)
	if err != nil {
		return nil, err
	}
	cert := tls.Certificate{
		Certificate: [][]byte{der},
		PrivateKey:  key,
	}
	return &tls.Config{
		Certificates: []tls.Certificate{cert},
		MinVersion:   tls.VersionTLS12,
	}, nil
}

func stampReceived(raw []byte, domain, remoteIP, helo string, usingTLS bool) []byte {
	proto := "ESMTP"
	if usingTLS {
		proto = "ESMTPS"
	}
	fromHost := strings.TrimSpace(helo)
	if fromHost == "" {
		fromHost = "unknown"
	}
	ip := strings.TrimSpace(remoteIP)
	if ip == "" {
		ip = "unknown"
	}
	line := fmt.Sprintf(
		"Received: from %s (%s) by %s with %s id supermail; %s\r\n",
		fromHost, ip, domain, proto, time.Now().UTC().Format(time.RFC1123Z),
	)
	return append([]byte(line), raw...)
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

func readData(br *bufio.Reader) ([]byte, error) {
	var buf bytes.Buffer
	for {
		line, err := br.ReadBytes('\n')
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
