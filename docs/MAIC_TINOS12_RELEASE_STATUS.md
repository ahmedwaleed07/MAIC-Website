# MAIC — Tinos 12 content release status (2 November 2026)

## Approved format
- The student study manual is black-and-white with genuine Tinos 12 pt body text (Regular and Bold as needed).
- Preserve MAIC's original crest and approved academy wordmark, including the permanent English motto.
- MAIC approved replacing Times New Roman with Tinos on 2 November 2026. Never mislabel Tinos as TNR.
- No standalone font binaries are distributed.

## Candidate manuals
- 36 revised English PDFs generated, 12 pages each, packaged outside GitHub for review.
- Pages 2–12 retain the exact text and lines from the earlier format proofs. Cover and footers were redesigned and proof-only labels removed.
- All 36 PDFs passed automated text preservation, Tinos font and page-count checks; no claim of full scholarly/legal approval is made.
- 36 old study-material PDFs are still active in D1. New candidate PDFs have not been uploaded or activated.
- MAIC Admin now has /admin/course-material.html to promote one reviewer-approved PDF at a time, with SHA-256 version tracking, revision audit, PDF checks and a block on active learner enrollments or running exams.

## Question banks
- 600 questions across six private draft banks; none is approved in live D1.
- The draft hashes in the private review pack were reconciled with the final-format candidate PDFs, preserving previous source hashes.
- Operations Strategy: 601 high-similarity stem PAIRS; Strategic Planning: 691 high-similarity stem PAIRS. Those banks reuse generic question templates and need substantial rewriting.
- Other four banks show substantially fewer similar pairs but still need human academic review.
- 30 other course question banks remain unwritten.
- The admin importer rejects mass-recycled opening stem templates even if all 100 questions otherwise pass schema validation.
- A simulated local SQLite exam with a synthetic student returned 70/100 after question 100 and rejected stale/backward submission. This is NOT a student account test on the website.

## Explicit promotion sequence
1. Human reviewer checks 12-page PDF for subject accuracy, source citations, rights, approved crest and Tinos typography.
2. Owner uploads PDF in /admin/course-material.html after review signoff.
3. Owner verifies new D1 SHA-256, then checks the corresponding bank against that exact file.
4. Academic reviewer approves all 100 questions, solutions, distractors, and page references.
5. Admin imports approved bank in /admin/exam-banks.html.
6. Perform a real isolated learner-account end-to-end test on staging before inviting real students.
7. Keep real certificates subject to MAIC's separate certificate eligibility and signed artwork approvals.

**No bank, trial student or certificate was created in the live D1 database by this branch.**
