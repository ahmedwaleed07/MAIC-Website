# MAIC Enrollment & Agent Payment Policy — implementation contract

Decision owner: MAIC project owner, October 2026.
Current website stage: PRE-LAUNCH PREVIEW. This document specifies the intended future secure back end; it does not assert that student accounts, payments, agent authorization contracts, or access grants are operational today.

## Non-negotiable business rules

1. **Students never pay MAIC through the website.** All course fees are collected exclusively by the student's assigned MAIC agent.
2. The learner's country of residence selects a configured, active in-country agent.
3. **Unity Bridge Services LLC is the US agent and the international fallback agent.** It is the same entity in both capacities, not a second office or alternate company.
4. If no local country-specific agent is configured as active, route the learner to Unity Bridge Services LLC.
5. MAIC's current planned country assignment includes ASAS 360° for Iraq. All public contact details, agency agreements, commercial terms and formal authorization remain subject to independent administrative verification before live enrollment.
6. When an agent reports payment, the learner becomes **pending MAIC review**. Only an authorized MAIC administrator can approve and activate enrollment.
7. Agents cannot activate a course, grant or extend access, certify completion, or issue MAIC certificates.

## Student journey

Choose course and learning format → create verified learner account → country assignment → enrollment request → agent payment instructions (delivered by authorized agent) → agent confirms received funds with receipt reference → MAIC administrator verifies → MAIC grants course access → learning dashboard and progress → certificate of completion eligibility after requirements met.

For group and one-on-one courses, MAIC-approved schedules and seat or instructor availability must be confirmed before a paid reservation is finalized. Agent payment status is not proof of seat availability.

## Minimum secure server-side entities

- `learner_profiles`: `user_id` (Auth UID), first/last names, email verification, country code, preferred language, created/updated dates.
- `agents`: stable agent ID, legal entity, home country, `active`, official authorization status, audit timestamps.
- `agent_territories`: country code → active agent ID; unique active territory; US: Unity Bridge; Iraq: ASAS 360° when formally authorized.
- `courses`: course ID, learning format, catalog status (`preparing`, `published`, `archived`), availability, language, prices, instructor, prerequisites and certificate policy.
- `enrollments`: learner ID, course ID, country snapshot, assigned agent ID snapshot, status, creation time, terms consent and immutable history.
- `agent_payment_reports`: enrollment ID, reporting agent, amount/currency, external receipt reference, when funds were received, evidence metadata, review status. Receipts must be unique per agent.
- `enrollment_decisions`: admin ID, enrollment ID, approval/rejection action, reason, timestamp.
- `course_access_grants`: enrollment ID, approved admin ID, course ID, start/end, active or revoked state.
- `audit_events`: actor, role, action, affected record, timestamp, old/new state metadata.

## State machine

`draft` → `awaiting_agent_payment` → `agent_payment_reported` → `pending_maic_review` → `approved_and_activated`.

Additional explicit terminal/reversible statuses: `rejected`, `cancelled`, `refund_under_review`, `refunded_and_revoked`, `completed`.

Only a server-side privileged MAIC review action can transition to `approved_and_activated` and create an access grant, atomically. A client form, agent dashboard or payment report cannot independently write this state.

## Authorization

- Student: read only their own profiles, requests, status, course access and certificates; submit or cancel permissible requests. Cannot submit trusted payment-confirmation events.
- Agent: read assigned enrollment requests only, verify funds received, submit receipt metadata and view resulting statuses. Cannot reassign requests, adjust course access or invoke MAIC approval.
- MAIC admin: approve/reject/cancel and activate/revoke access with full audit. MFA and minimal administrator roles recommended.
- Server: verifies country assignment at enrollment time and saves the agent ID; never trusts agent ID, amount, status, or permissions submitted by the browser. Use strict row-level and role-level security.

## Website preview guardrails

The existing site is a static, demonstrative prototype. `#enrollment` displays an **in-browser preview** of the journey only. It does not submit PII, save payment receipts, create an account, make a payment or grant course access. The three course catalogs are currently `preparing` and do not offer enrollment.
Do not enable a live submit button until a MAIC-specific backend, verified authentication, agent credentialing, signed agency agreements, privacy policy, secure receipt storage, transactional admin approval, notifications and end-to-end authorization tests have been completed.

## Administrative publication checklist

- Confirm company identities and explicit authority to act as MAIC enrollment/payment agents.
- Approve country assignments, payment currencies, acceptable methods, reconciliation and refunds under applicable law.
- Publish verified agent contact details or authenticated instructions, not unverified account numbers.
- Publish approved course syllabi, fees, cohorts, instructor and refund terms.
- Require consent to privacy and terms; account for minor learners if allowed.
- Confirm relevant US and local laws, tax duties, sanctions and consumer disclosures.
