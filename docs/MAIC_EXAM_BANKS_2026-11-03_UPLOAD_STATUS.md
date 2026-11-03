# MAIC academic exam question upload status — 3 November 2026

**This is a private academic-data workflow; never upload correct-answer files to public GitHub or a learner-visible route.**

## Uploaded to Cloudflare D1

Ten complete 100-question MCQ banks are now stored directly in MAIC's existing D1 academic exam tables as `draft` records, each with a documented preparer and separate academic review requirement:

| Course ID | Questions in D1 | Status | PDF source match against CURRENT published D1 material |
|---|---:|---|---|
| applied-problem-solving | 100 | draft | No |
| business-finance-accounting | 100 | draft | No |
| digital-marketing | 100 | draft | No |
| digital-project-delivery | 100 | draft | No |
| human-resources | 100 | draft | No |
| management-foundations | 100 | draft | No |
| operations-strategy | 100 | draft | No |
| project-management | 100 | draft | No |
| risk-for-managers | 100 | draft | No |
| strategic-planning | 100 | draft | No |

**Verified aggregate from D1:** 36 live material records, 10 stored draft banks, 1,000 stored exam questions, 0 active exams, 0 learner records. Each stored candidate is matched to a different Tinos12 review PDF by SHA-256 than the older material currently in the live database. Approval therefore remains impossible until the correct reviewed Tinos12 PDF is promoted.

Newly completed: Risk-Aware Management Decisions now has 100 source-linked draft questions, including 76 new items; 42 one-answer, 17 two-answer, and 41 three-answer questions. The answers are provisional and **not independently reviewed**.

## Still unwritten (26 banks × 100 questions)

- collaborative-leadership
- competitive-advantage
- digital-transformation
- economics-for-decisions
- financial-decision-making
- global-institutions
- innovation-go-to-market
- innovation-leadership
- innovation-management
- international-business-economics
- international-law
- international-relations
- inventory-transport-planning
- investment-evaluation
- it-service-management
- managerial-accounting
- marketing-communications
- organizational-change
- organizational-leadership
- procurement-sourcing
- professional-communication-practice
- supply-chain-analytics
- supply-chain-foundations
- sustainable-supply-chains
- time-workload-management
- workplace-team-collaboration

Total substantive MAIC academic test target: 36 × 100 = 3,600; completed 10 × 100 = 1,000 draft questions (27.78%), leaving 2,600 questions. **Do not generate copied, repeated or trivial filler items merely to reach the number.** Each bank needs its own original, source-based cases, assessment design, correct key, explanations, page references and independent academic review.

## Academic and operational gates

1. Review and approve each Tinos12 source PDF for MAIC visual identity, accurate course content, fonts, rights and exact-page quality.
2. Promote the approved PDF through MAIC Admin; match its SHA-256 with its corresponding bank.
3. Independently review all 100 questions and answer keys in the protected admin interface. Reviewer must not be the preparer.
4. Check duplication and source references, then explicitly approve. The website must not allow draft banks for learners.
5. Conduct end-to-end testing with a nonproduction learner account, including 100 next-only submissions and final-only evaluation; no actual certificates until MAIC eligibility checks are satisfied.
6. Continue course-specific authoring for the 26 incomplete banks rather than inventing academic review.

The existing logo, MAIC color palette, multilingual public UI, certificate art, and crest were not modified.

## Course-specific authored additions on 3 November 2026

Three more 100-item banks were written from the actual 12-page Tinos source manuals and uploaded as restricted D1 drafts: Applied Problem Solving, Business Finance & Accounting, and Digital Project Delivery. Their provisional answer keys are stored in D1 and in private review files only. The three banks contain exactly 300 course-based MCQs, with zero near-identical question-stem pairs at 85% Dice similarity; the three-option-overlap check returns 0, 0 and 0 respectively. Numerical finance examples were recalculated in their worked explanations. **No independent academic signoff has occurred and some answer interpretations may still need correction.**

To prevent low-quality automated question sets from being approved, the academic QA gate now counts questions whose *stems* simply ask what is written on an identified source page; more than 12 of these location-recall items blocks final approval. This complements stem and option-reuse checking and does not substitute for academic review.

All ten bank source SHA-256 values still differ from corresponding currently published PDFs; these are candidate sources and no exam has been activated. Do not replace the existing MAIC crest, brand colors, course menu styling or official certificate artwork.
