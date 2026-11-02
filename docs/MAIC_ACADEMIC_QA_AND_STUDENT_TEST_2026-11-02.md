# MAIC academic preflight and isolated learner integration (2 November 2026)

## No visual identity changes
This work changes **only** exam validation, isolated tests and quality notes. No MAIC logo, original seal, color, certificate artwork, user interface, layout, typography or public-site imagery is modified.

## Real student-function integration, isolated from production
GitHub Actions calls the actual Cloudflare Pages learner material, study and exam Functions against an ephemeral in-memory SQLite fixture, with a synthetic student and session. It verifies:
- authentication and same-origin checks;
- private PDF retrieval and recorded opening;
- rejection of premature study-complete confirmation;
- explicit study acknowledgement;
- the exam state transitions from pending to study-required to ready;
- 100 questions presented one per turn with four options;
- exact-match grading of both selected correct options, a 70/100 deterministic result;
- no score or answer key before item 100;
- rejection of backtracking/stale answers even after reload;
- access denied once enrollment is revoked.

These tests **do not** create an actual production student or establish browser-based/Cloudflare preview end-to-end completion; those remain separate release gates.

## Candidate material QA
Automated local inspection of all 36 candidate 12-page Tinos PDFs passed font-family, page count and off-page text checks. The original grayscale MAIC crest appears on the cover. Layout preflight is not a substitute for substantive academic, copyright, source or clarity review.

## Draft question quality
Six private academic banks contain 600 structurally valid questions. Each private draft's source SHA-256 currently matches its corresponding local candidate PDF, but not yet the older PDF stored in the live D1 database. No bank is approved in production.
- Project Management: 2 highly similar stem pairs (character-trigram Dice >= 0.85).
- Management Foundations: 0.
- Human Resources: 0.
- Digital Marketing: 0.
- Operations Strategy: 395; requires extensive rewriting.
- Strategic Planning: 353; requires extensive rewriting.

These are technical *pair counts*, not numbers of defective questions. The import API now rejects excessive near-duplicate stems (more than 12 pairs at Dice similarity >=0.85) as well as repeated identical stem openings. An independent academic reviewer must still verify every answer, rationale and page reference.

## Promotion policy
1. Finish a human academic review and sign-off of each Tinos PDF.
2. Promote its exact bytes through owner-only MAIC manual approval, with D1 revision audit. Preserve old learning data and do not swap documents under active student enrollments.
3. Independently review and approve all 100 questions against that promoted PDF source hash.
4. Enable a nonproduction browser-based student-account test and verify accessibility, interruption recovery, no-back behavior and final-only scoring before inviting students.
5. Preserve six-path MAIC certificate requirements and leave official issuance feature-gated until separately approved.

This is a safeguard and quality update, not an assertion that academic content or live exams are launch-ready.


## Editorial progress update — 2 November 2026, second batch

The two reworded private 100-question banks (Operations & Service Strategy and Strategic Planning & Execution) have now received a **manual, scenario-specific editorial rewrite of all four answer options on items 1–40 of each bank**: 80 rewritten items, 320 rewritten answer choices. Items 41–100 of each bank still require this pass.

Review metrics for **pairs sharing at least three exactly identical answer choices**:
- Operations Strategy: **74 → 44** pairs.
- Strategic Planning: **75 → 45** pairs.
- Stem similarity at character-trigram Dice >=85% remains 0 pairs in both, but this does NOT prove concept diversity or correctness.

Each bank remains 100 items, with the original draft answer key positions **preserved but NOT verified**. Both have SHA-256 identifiers matching their locally regenerated Tinos 12 manuals; the production D1 PDFs still use older versions, so do not activate these draft banks.

Internal academic review artifacts were prepared **outside the public repository**: two confidential 100-item PDF review booklets (with clearly marked draft answer keys and reviewer decision lines), the 80-question change log, two private answer-key JSON files, and candidate source-passage excerpts. A lexical passage finder surfaced 55 candidate matches and 25 weak matches; these are only finding aids, not evidence of correctness.

**Nonnegotiable release gates:** independently validate each correct choice and distractor against its complete source page; finish items 41–100; reduce excessive option reuse and semantic duplication; approve the exact Tinos PDF and promote it; then stage and separately approve the 100-item bank under the two-stage workflow. Finally complete a nonproduction browser-based learner test. No draft answer keys are stored in GitHub or published to students, and no original MAIC identity asset has been modified.
