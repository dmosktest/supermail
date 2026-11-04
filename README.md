# supermail

Spam-test your outbound email: the site gives a one-time `@inbox.supermail.dmosk.net` address, you send a message from your SMTP, and you get an A–F report (SPF/DKIM/DMARC, DNSBL, PTR, content / stop-words).

**Live (prod):** https://supermail.dmosk.net/  
**Version:** `0.2.0`

## Stack

- UI: Vite + TypeScript  
- API + SMTP receiver: Go

## API

- `POST /api/v1/inbox` — create mailbox  
- `GET /api/v1/inbox/{id}` — `waiting` | `ready` | `expired`

## Mirror note

Application source only. Docker/Compose/stand config live in the private monorepo. Brand: [dmosk.net](https://dmosk.net/).

## License

MIT — see `LICENSE`.
