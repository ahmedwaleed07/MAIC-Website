# MAIC — Unified Course, Graduate, and Certificate Model
Version 1.0 — 2026-11-01 · Feature branch specification. **Not a production issuance announcement.**

## Approved identity and legal boundaries
Keep the original MAIC Academic Crest, midnight navy / antique gold / ivory identity, fixed English institutional name and “Innovate. Create. Lead.” Maintain the original three-signature certificate artwork (President, Department Head, Authorized Agent). Certificates are **Completion** or **Participation**, not degrees, academic credit or governmental recognition.

## A. One course, three selectable delivery methods
Shared course data: unique course ID, title, summary, goals, level, subject, languages, prerequisites, detailed syllabus, resources, duration, fee per format, syllabus version, instructor/department, activation agent, conditions of award.

| Type (stored value) | Learning delivery | Required completion evidence |
| --- | --- | --- |
| Self-Paced Online (\`self-paced\`) | Asynchronous lessons/modules and resources, progress saves, assignments/tests | Required modules finished and a course-configured passing result; completion must be verified |
| Live Group Classroom (\`group\`) | Instructor-led scheduled live sessions, class roster, attendance, submissions | Course-configured attendance threshold, assignments and instructor verification |
| One-on-One Private (\`one-on-one\`) | Instructor-specific booked sessions, individual syllabus, progress notes | Agreed sessions fulfilled, outcomes assessed and instructor verification |

Do not define a universal 70% grade or attendance percentage. Admin configures evidence/rules per course and mode. Existing MAIC enrollment and agent payment approval stay mandatory; the current database identifies an enrollment by (student_id, course_id), so multi-mode concurrent enrollment requires a deliberate later key migration.

## B. Verified certificate issuance
1. Learner enrolls. Fee is paid **to their designated agent**, not MAIC website.
2. Agent confirms; MAIC administrator activates access.
3. Learner studies; required evidence recorded per mode.
4. Instructor/course system marks **completed**, then MAIC authorized admin marks **verified**. An opened PDF alone never grants a certificate.
5. On authorized issuance, take an immutable snapshot of: full legal name (including middle name), course title, mode, certificate type, country, agent name, issued date and unique number.
6. Create a cryptographically random, unguessable verification token, canonical link /graduates/{token}, and QR pointing to that link.
7. Generate the PDF **only** using the approved original certificate artwork with its three signatures, embedded QR, and unique number. Save privately. Offer it in “My Certificates” after issuance. A database record without its approved PDF must not show a working Download button.
8. Allow correction or revocation through an auditable administrator workflow. QR verification must reflect current certificate status.

## C. Graduate verification and public listing
Canonical URL shape: \`https://www.maic-edu.org/graduates/{random-token}\`. One graduate can have several certificates, with **one independent QR and URL per certificate**. The directory /graduates/ contains only opt-in public records. A graduate may be listed under multiple credentials.
Publicly display only the full graduate name, course title, certificate type, country, authorized agent, issue date, certificate ID and status. Never expose DOB, email, phone, grade, login, enrollment/payment details, delivery address or order tracking. Require explicit learner publication consent before public lookup/listing. Consent revocation removes public disclosure without changing academic validity. Public pages are not themselves certificates.

## D. “My Certificates” — authenticated learner area
Each issued certificate card: original approved certificate preview, course, type, issue date, certificate ID, Verify/Share and Download PDF (only when PDF exists), Request Printed Original.
Request Printed Original securely collects recipient name, phone, destination country, full postal address and optional postal code. Send a **queued agent notification** bound to the agent ID captured at certificate issuance. Do not mark notification delivered until an actual agent channel receives it. Agent quotes printing/postage fees in local currency; learner pays agent; agent confirms payment, then the admin authorizes printing/dispatch. Request statuses: Awaiting Quote → Awaiting Payment → Payment Confirmed → Printing → Shipped → Delivered; cancellation is separate. No MAIC website payment processing.

## E. Permissions and operational controls
- Public: verify only opted-in certificate facts, no personal or shipment details; restrict index to published records.
- Learner: read/request only their own certificate and shipping request; HTTP-only sessions and CSRF Origin checks.
- Agent: read only their assigned shipping requests and alert queue, confirm service charges and shipment; requires a genuine agent login/notification channel not yet implemented.
- MAIC Admin: verify completions, issue/correct/revoke certificates, approve physical original and audit records.
- Store PDF and shipping information privately, rate-limit writes, maintain auditable events, encrypt sensitive data where appropriate; never embed shipping details in QR.
- Original shipping fee and delivery rules are configurable by destination and agent; no universal price is assumed.

## F. Current repository state and rollout gate
The repository already has MAIC D1, learner login, account registration, admin activation, private learning materials and course mode labels. It **does not yet have proven** course completion tracking, certified PDF generation, a certificate-signing service, a secure agent portal, live notifications, delivery quotes, payment confirmation or real dispatched printed certificates.

This implementation includes the additive D1 schema, course delivery-mode persistence, graduate verification, downloadable QR SVG generation, approved-PDF upload/secure SHA-256 checked download, basic admin completion verification and shipping order administration. **Authorized Completion certificate preparation is now available in Admin** after course completion and verification, unless explicitly paused with `MAIC_CERTIFICATE_ISSUANCE_ENABLED=false`. The certificate is NOT publicly valid, listed, or downloadable before its three-signature PDF is committed. Use the Admin template preview, renderer, and signed PDF upload workflow. **Do not claim fully automated certificate issuance until:** (1) migration applied; (2) completed/verified rules tested; (3) canonical PDF rendered using original artwork + QR and accessible only to owner; (4) sample verification and revocation passes; (5) agent authentication and actual notification delivery passes; (6) privacy consent and data deletion policy passes; (7) multilingual QA passes; (8) E2E test covers three delivery modes, completion, original requests and billing.

## Deployment state (2026-11-01)
D1 migrations 0003, 0004 and 0005 were applied to MAIC's existing production D1 database. The site still needs GitHub branch merge and a confirmed successful Cloudflare Pages deployment. The MAIC Completion artwork was approved on 1 November 2026 and a version with a completely empty QR box is committed. The browser admin renderer composes the PDF with actual graduate fields and unique QR, but requires authorized signature images for finalization; no actual student's certificate has been generated or tested end to end. Agent notification delivery is still not implemented. R2 service is not enabled. There are no test graduate records created by these changes.

## G. Approved artwork integration (1 Nov 2026)
- Official template: `assets/maic-certificate-official-blank-qr.webp`; 1536×1024. Preserves the user's previously approved crest, navy / gold identity, Michigan and US imagery and three signature lines; the static QR field is deliberately blank.
- Admin template viewing: `/admin/certificate-template.html`. Per-student rendering uses `admin/certificate-renderer.js` and `/admin/completions.html`.
- On a real certificate record, the local QR generator serializes a unique verification URL `/graduates/{64-hex-token}` and the PDF embeds a **crisp vector QR**, plus a clickable hotspot. There is no reusable/static QR in the source template.
- Drafts are watermarked. To finalize, an authorized administrator must supply genuine President, Head of Department and Authorized Agent signature images; the signed final PDF is securely uploaded to D1 and checked by SHA-256 on download. No dummy signatories or blank signatures are treated as valid certificates.
- The public verification page and graduates directory must not show a credential as valid until its signed final PDF is present. Student's My Certificates must likewise exclude unfinalized records.
- This approved template covers only Certificate of Completion. Participation needs its own approved artwork.
- Current Pages hostname is maic-website.pages.dev; use the live request origin to form QR links, until maic-edu.org is connected.
