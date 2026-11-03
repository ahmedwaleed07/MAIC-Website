# MAIC academic assessment quality review — 3 November 2026

**Decision: DO NOT APPROVE THE 36 DRAFT EXAM BANKS YET.** The 3,600 items are present and pass basic database/schema checks, but academic readiness has not been established.

## Verified figures
- 36 banks, 100 MCQs per bank, 3,600 total, all still in draft status.
- SHA-256 of each bank matches the candidate source PDF in the private 36-bank review ZIP; 36/36 match.
- **0/36 bank hashes match the PDF versions currently published in the production D1 database**. No exam is activated.
- 26 new automated banks contain 2,600 machine-structured questions. 2,518 of these have stems longer than 300 characters.
- Across their 10,400 answer option placements, there are 4,748 duplicated option occurrences within the corresponding bank (5652 unique normalized option texts).
- All 2,600 generated source excerpts were located verbatim on the cited local PDF page. That is **not** sufficient proof that each keyed option is correct.
- The generated rationales repeat a common generic pattern and contain explicit AI draft disclaimers.
- In those 26 banks, a simple option-prefix cue heuristic plus reversal for negative questions agrees with the stored correct-option membership in **10,388 out of 10,400 option choices (99.88%)**. This is an analysis of generation style, not a blind test with real students, but demonstrates high risk of guessing without subject mastery.
- Ten earlier banks have more varied stems and options, but all 1,000 corresponding keyed answers still need a documented academic check. For example, Project Management Q27 asks for a violated *response* but supplies primarily descriptions; Q80 is a textbook-location prompt rather than a workplace decision.

## Corrective requirements
1. Retain all 36 banks as drafts and do not issue exam-based achievements yet.
2. **Substantively rebuild the 26 template-driven banks**: distinct source-based cases, plausible but incorrect options, realistic distractors, removal of self-evident negative phrasing and generic draft disclaimers. Merely reordering options or deleting the disclaimer does not restore academic validity.
3. Independently check all 3,600 selected keys and every rationale against the precise cited academic text. Each question must support one or more correct choices without ambiguity; note any unverifiable or inaccurate ones.
4. Approve and upload exact Tinos12 materials after scientific, copyright and branding review; match source SHA-256 before examination approval.
5. Complete the named independent MAIC academic signoff workflow for each bank and test the student journey separately in a nonproduction account.
6. Preserve MAIC original crest, midnight navy, antique gold, certificate layouts and pre-existing identity.

## Safeguards added in this commit
The approval endpoint now detects original template-draft rationales and multiple conspicuously flawed option openings, and blocks approval until they have been meaningfully corrected. Admin staff can review the number of flagged items. This is an early-warning gate, not a substitute for academic signoff or a guaranteed psychometric test.

The private full report and 36-course editorial priority index are provided in the conversation's downloadable file package **MAIC_3600_MCQ_QUALITY_VERIFICATION_REPORT_2026-11-03.zip**. No private answer keys were committed to the public GitHub tree.
