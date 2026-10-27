# MAIC Admin Studio — authenticated content publishing

MAIC uses **Cloudflare Pages Functions** and its separate **US-jurisdiction D1** database (`maic-content`) for centrally published website content.

**Administrator URL:** https://maic-website.pages.dev/admin/

## Owner authentication

- An administrator password is validated server-side by salted PBKDF2 SHA-256; it is not embedded in website scripts or repository files.
- Session authentication uses a signed, short-lived (8h), `Secure; HttpOnly; SameSite=Strict` cookie. There is an origin check for state-changing requests, and a D1-backed rate limit on login attempts.
- The admin screen remains hidden until a valid authenticated session is confirmed.
- Cloudflare Access has not been enabled for this account. This is a standalone login; MAIC can later add Zero Trust/MFA for higher assurance. Rotate/bootstrap credentials by updating Cloudflare Pages secrets.

## Editorial workflow

1. Owner logs in to `/admin/`.
2. Load the current published content (base revision).
3. Add, edit, duplicate or remove courses; edit agents; reorder and hide menu items; create bilingual simple-text custom pages.
4. Save draft to local browser; preview with `?cms-preview=1` or export JSON.
5. Click **Publish**. The owner-only endpoint validates the content, checks the expected revision to avoid overwrites, stores it in D1, and writes a revision history entry.
6. The public site reads `GET /api/content` on load; after refresh, visitors get the latest published version. If the service is unavailable, the original repository catalog remains as a fallback.

**Important:** This CMS publishes catalog information and website layout, **not** student account activation, enrollment receipt verification, payment, group-class availability, Zoom links or certificates. All of those are still separate development work.

## API routes

- `GET /api/content`: public published content only
- `POST /api/admin/login`: rate-limited owner password login
- `GET /api/admin/session`: check authenticated status
- `POST /api/admin/logout`: clear owner session
- `GET /api/admin/content`: owner-only current document
- `PUT /api/admin/content`: owner-only, validated revision-controlled publishing

## Operational safeguards

- Do not commit admin passwords, cookie-signing secrets, or service API tokens to GitHub.
- Back up the JSON before making major changes.
- Use Cloudflare Pages environment secrets and the `MAIC_DB` D1 binding for production.
- Review the website after publishing; custom pages currently support plain text only, not rich text or arbitrary HTML.
- Do not issue payments or accept students before authorized agents, courses, refund/terms and a secure LMS are approved.
