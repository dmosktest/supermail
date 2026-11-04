# supermail

Spam-test your outbound email: one-time `@supermail.dmosk.net` inbox, send from your SMTP, get an **A–F** grade plus heuristic spam score. Checks cover crypto DKIM verify, SPF evaluation by connecting IP, DMARC alignment (rua/ruf), MTA-STS / TLS-RPT / BIMI DNS, DKIM DNS key, MX, DNSBL, PTR↔HELO, subject/body, MIME and more. The report includes raw headers, a DNS wizard with TXT drafts, JSON + Print/PDF export, All / Errors / Passed filters, and downloadable Markdown briefs for an AI agent and a mail administrator (23 UI languages). Ready report links last about 7 days.

**Live (prod):** https://supermail.dmosk.net/  
**Privacy:** https://supermail.dmosk.net/en/privacy/  
**Version:** `0.3.4`

## Stack

- UI: Vite + TypeScript  
- API + SMTP receiver: Go

## Public API

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | healthcheck |
| `POST` | `/api/v1/inbox` | create inbox → `{ id, address, expiresAt, … }` |
| `GET` | `/api/v1/inbox/{id}` | `waiting` / `ready` (+ `report`) / `expired` |

Waiting inbox ~30 minutes; ready report retention ~7 days on disk (survives restarts). Create-inbox rate limit ~10s per IP. Report fields include `findings`, `headers`, `dnsHints`, scores and blacklist.

## Mirror note

Application source only. Docker/Compose/stand config live in the private monorepo. Brand: [dmosk.net](https://dmosk.net/).

## License

MIT — see `LICENSE`.
