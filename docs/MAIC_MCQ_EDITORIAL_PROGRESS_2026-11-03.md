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
