# MAIC — Academic MCQ Editorial Progress (3 November 2026)

## Progress in the two previously repetitive exam banks

- **Operations & Service Strategy:** 100 of 100 question stems/options have received an editorial review and case-specific rewrite.
- **Strategic Planning & Execution:** 100 of 100 question stems/options have received an editorial review and case-specific rewrite.
- Earlier editorial batch: 40 items per bank; subsequent 3 November batch: 60 remaining items per bank.
- Each bank still contains exactly 100 questions, each with four unique options, one or more provisional correct choices, an explanation, and the cited source page.
- Local Tinos 12 course candidate PDF hashes match those referenced in both private draft banks.
- Automated checks on each revised bank: **zero** question-stem pairs at 85% or higher trigram similarity, and **zero** pairs sharing three or more identical answer choices. These checks do not assess semantic duplication or substantive academic correctness.
- Provisional answer-key indices have **not** been changed relative to the previous draft. This is **not** independent verification that the keys are correct.
- Some question stems were clarified to distinguish prevention from detection, evidence from decisions, and case-specific versus system-level outcomes.
- Private outputs in the project's ChatGPT conversation: `MAIC_200_QUESTION_EDITORIAL_REVIEW_PRIVATE_2026-11-03.zip`, `MAIC_TWO_COURSE_EDITORIAL_QA_REPORT.pdf`, two 101-page internal reviewer booklets, source manuals, complete draft JSON files and a 200-item review checklist. **Do not upload answer-key files into the public GitHub repository.**

## Academic authorization remains pending

1. An independent academic reviewer must examine **each of the 200 items**, including all correct and incorrect choices, references, fairness of wording, and conceptual duplication. The current draft rationales are **editorial explanations**, not scholarly signoffs.
2. The corresponding 12-page Tinos 12 PDFs must be reviewed for source accuracy, permissions, completeness and visual formatting and then individually approved in MAIC's secure admin workflow.
3. The PDF currently stored on production Cloudflare D1 may differ in SHA-256 from the locally regenerated Tinos 12 PDF. Do not stage a bank against the wrong PDF version.
4. MAIC's two-stage draft and independent-review process must be completed before any bank is marked active.
5. Test the approved assessment in isolated browser-based staging with a synthetic student. The existing in-memory function integration is not a real-browser end-to-end test.
6. Four other 100-question draft banks still require academic verification; thirty other course banks remain to be authored.

## Brand and access protection

No original MAIC crest, approved colors, certificate template or existing public website layout is altered by this editorial pass. Draft answer keys must remain private to authorized MAIC academic reviewers. Do not automatically issue certificates.

## Technical preflight of the four other 100-question draft banks (3 November 2026)

A fresh audit of the existing private draft JSON against the locally regenerated Tinos 12 source PDFs found:

| Course | Questions | Stem pairs ≥ 85% similarity | Pairs reusing ≥ 3 options | Candidate PDF SHA-256 match |
| --- | ---: | ---: | ---: | --- |
| Project Management | 100 | 2 (39/81 and 52/80) | 0 | Yes |
| Management Foundations | 100 | 0 | 0 | Yes |
| Human Resources | 100 | 0 | 0 | Yes |
| Digital Marketing | 100 | 0 | 4 (67/89, 67/90, 67/94 and 90/94) | Yes |

This is **structural and lexical preflight only**; none of these four banks is academically approved. The project-specific details and source bank answer keys remain only in the private review package, not on GitHub. MAIC's Cloudflare D1 was checked after this update: **36 existing learning material records, zero approved material revisions, zero exam banks, zero active exams, and zero learner accounts**. No approved PDF or examination was promoted to production.


## Follow-on editorial package — 3 November 2026

### Four-bank confidential revision and verification

The current 100-question **Project Management**, **Management Foundations**, **Human Resources** and **Digital Marketing** drafts were checked against the **exact matching 12-page Tinos 12 PDF candidate bytes** (400 total items). Nine individual stems, options and rationales were corrected after reading the cited source pages, including a substantive defect in Digital Marketing item 73 in which the formerly marked “correct” options did not answer the requested experimental-control question.

Results of the structural and lexical checks **after this editorial pass**:
- Project Management: 2 revised questions; high-similarity stem pairs **2 → 0**; repeated 3+-option pairs remain **0**.
- Management Foundations: **0** changes; high-similarity stem pairs **0**; repeated 3+-option pairs **0**.
- Human Resources: **0** changes; high-similarity stem pairs **0**; repeated 3+-option pairs **0**.
- Digital Marketing: **7** revised questions; high-similarity stem pairs remain **0**; repeated 3+-option pairs **4 → 0**.
- All 400 items have four distinct options, nonempty provisional answer sets, a rationale and a valid cited page. **This is not academic approval of 400 answer keys**; only nine items received new page-specific editorial checks this pass.

Confidential deliverable: `MAIC_FOUR_BANK_EDITORIAL_REVIEW_PRIVATE_2026-11-03.zip`. It includes four draft JSON banks, four matching reference PDFs, reviewer PDFs for Project Management and Digital Marketing, source-evidence correction logs, a quality report, and a 400-row independent reviewer checklist. **Do not upload these answer keys to public GitHub or learner pages.**

### Starter bank for the seventh course

The `risk-for-managers` course (Risk-Aware Management Decisions) has its first **24 source-linked original MCQs** across textbook pages 3–11, with four answer options, source-page rationale and provisional one-or-more-answer keys. A private reviewer booklet, JSON, reference Tinos 12 PDF and 24-item signoff checklist were produced in `MAIC_Risk_Management_24MCQ_Partial_Private_2026-11-03.zip`. The starter bank has zero stem pairs at >=85% trigram similarity and zero pairs with 3+ identical answer options, but still needs **76 more questions** and separate academic review; it **must not** pass the 100-question publication gate.

### Publishing remains blocked

The Cloudflare production D1 was verified to have 36 existing learning materials, **zero revised PDF promotions, zero exam banks, zero active examinations, zero learner accounts**. The new private candidate-PDF SHA-256 hashes do not automatically change the files in production. Approved manuals must first be promoted individually, then a second academic reviewer must sign off each full 100-question bank, and the browser-based student staging run must pass. MAIC's official visual identity has not been changed.
