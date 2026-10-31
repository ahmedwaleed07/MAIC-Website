# Private learner materials

Learners register at `/learner/`, sign in, save a course request, and contact their assigned agent. Registration never grants material access. The existing owner signs into `/admin/`, opens **الطلاب وتفعيل المواد**, checks identity against the agent confirmation, records a confirmation reference and activates a specific course. Revocation is checked on each new PDF request, including existing sessions.

The authenticated material endpoint checks the learner session, per-course enrollment and current catalogue status before serving any bytes. It supports a single HTTP byte range and uses private/no-store responses. PDFs are not committed to the public repository or placed in static assets. Downloaded copies cannot be recalled: access control is not DRM.

Materials currently use private D1 metadata and bounded chunks because R2 is not enabled in this account. Material and learner tables are separate from the public CMS document. Migrate file storage to private object storage as usage grows. Importing PDFs never activates enrollment. A temporary token-protected import worker is deleted after all 36 file digests are checked.

Apply `migrations/0002_learner_materials.sql` and retain the `nodejs_compat` flag on Pages production and preview. The existing `MAIC_DB`, owner key and owner session settings remain. Owner login uses the same existing PBKDF2-derived key through a two-minute single-use HMAC challenge. Derivation runs in the owner's browser, avoiding the Workers PBKDF2 iteration ceiling without changing the credential. No password or derived key is stored by the browser. Learner password derivation uses a domain-separated server-keyed HMAC followed by 100,000-iteration salted PBKDF2, within the runtime limit. Changing the server session secret requires a deliberate password-recovery plan for learners because it also protects their password hashes.

Identity and agent receipt verification remain manual owner checks. Account creation alone is not verified identity. No automatic payment confirmation, email verification, certificate issuance or completion tracking is claimed. No payment-card details are collected. Learner UI supports English, Arabic and Kurdish; the catalogue access labels are localized for the site's 29 locales. Course PDFs stay English.

Run `node tests/learner-access.mjs` and `node tests/owner-challenge.mjs`, plus existing catalogue regressions. Protected requests, cross-course denial, revocation and downloaded PDF digests should also be checked on the deployed site with isolated disposable test records.
