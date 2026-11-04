# supermail

Mail domain quality check: MX, SPF / DKIM / DMARC / BIMI, DNSBL, reverse DNS, light SMTP probe (banner / STARTTLS), and starter DNS records. Grade A–F with plain-language findings and copy-paste fixes. Outbound message spam scoring (one-time inbox) is planned for a later release.

**Live (prod):** https://supermail.dmosk.net/  
**Version:** `0.1.0`

## Stack

- UI: Vite + TypeScript (static build served by nginx in production)  
- API: Go — DNS lookups, DNSBL, SMTP probe, in-memory rate limit

## API

- `GET /health`
- `POST /api/v1/check` — JSON `{ "domain", "selector?", "ip?" }`
- `GET /api/v1/check?domain=&selector=&ip=`

## Mirror note

This GitHub tree is a public mirror of application source. Docker/Compose/stand config live in the private monorepo. Brand link: [dmosk.net](https://dmosk.net/).

## License

MIT — see `LICENSE`.
