# MAIC Admin Studio — October 2026

Visit `/admin/` on the MAIC Pages preview. This is an **interactive local-draft studio**, not a production CMS or authenticated administration system. The link is not included in the public menu. No privileged API keys or passwords are shipped to visitors.

## Capabilities implemented

- **Courses:** Add, edit, duplicate, archive, remove, and assign formats (self-paced, group class, one-to-one), bilingual labels, descriptions, subject, duration and preview-only publication state.
- **Agents:** Edit official display details, circular logo path, website, contact email, telephone, country, city and state; assign active agents per country. Keep Unity Bridge active as US and default agent; Iraq currently uses ASAS 360° in project's planned assignments.
- **Structure:** Reorder, rename and hide primary menu items in the local preview, without deleting the built-in page source.
- **Pages:** Add, edit or delete bilingual simple-text custom pages in the local preview.
- **Settings:** Export/import JSON, reset local drafts, open preview of the public site locally using `?cms-preview=1`.

Data is stored only in `localStorage` using key `maic_studio_draft_v1`. The public website reads this data **only** when the preview query flag is explicitly set and a valid local draft exists. Other visitors and public pages remain unchanged. Clearing browser storage clears drafts unless a JSON backup exists.

## Security and deployment boundary

The studio is publicly readable UI, but has **no server-side write endpoint**, no learner account access, no student PII, no payment processing, and no real publishing. **Do not interpret its appearance as access control.** Admin login and role-based access require a secure backend before production.

To enable live publishing later, implement:
1. Authenticate administrators with verified accounts and MFA; enforce authorization on the server.
2. Durable MAIC content store (e.g. D1 with Cloudflare Pages Functions) and write API behind admin authorization.
3. Validated input, server-side normalization, per-action audit log, versioned drafts, preview, and publish/revert operations.
4. Public read endpoint serving *approved published* content, with the current static defaults as migration seed.
5. Secure image upload and independent confirmation of agency authorization, course material licenses and instructor availability.

Do not add an unauthenticated write API, frontend-only hardcoded password, client-side secret, or anonymous publishing token.
