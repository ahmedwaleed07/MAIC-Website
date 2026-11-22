# MAIC — Course Content and Exam Readiness Audit

Date: 2026-11-22
Repository: ahmedwaleed07/MAIC-Website
Production database: Cloudflare D1 `maic-content`
Prepared from live catalog and database queries; this is a work log, not approval to publish or certify.

## Verified live state

- 78 catalog entries: 20 published, 50 preparing, 8 archived.
- 36 course PDFs in `learning_materials`, each logged as 12 pages.
- 20 exams are presently active in `learning_exam_active`.
- The other 16 PDFs now each have a source-matching, 100-question `editorial-draft-20261122-...` bank.
- Every one of those 16 has a pending independent academic item review. An automated structural QA pass does **not** establish an academic approval.
- The newly prepared banks were not activated for students.
- The 34 remaining **preparing** catalog entries below lack a PDF in `learning_materials`; they require original English learning materials, content checks, then course-specific 100-question exams, item review and activation.
- Eight additional archived catalog entries lack materials and should remain outside the release queue unless explicitly restored.

## Editorial drafts linked to current source (16)

1. global-institutions
2. international-law
3. international-relations
4. investment-evaluation
5. managerial-accounting
6. financial-decision-making
7. professional-communication-practice
8. workplace-team-collaboration
9. supply-chain-foundations
10. inventory-transport-planning
11. procurement-sourcing
12. supply-chain-analytics
13. sustainable-supply-chains
14. competitive-advantage
15. economics-for-decisions
16. strategic-planning

## Pending original course materials (34; catalog order)

1. Diploma in Journalism — `diploma-in-journalism` — 12 h
2. Fundamentals of Journalism — `fundamentals-of-journalism` — 6 h
3. Understanding Digital Journalism — `understanding-digital-journalism` — 6 h
4. Understanding the Essentials of Video Production — `essentials-of-video-production` — 6 h
5. Video Editing Using iMovie and DaVinci Resolve — `video-editing-imovie-davinci-resolve` — 8 h
6. Media Studies – Entertainment and Broadcast Media — `entertainment-and-broadcast-media` — 6 h
7. Diploma in Social Media Marketing and Strategy — `diploma-in-social-media-marketing-and-strategy` — 12 h
8. Fundamentals of Graphic Design — `graphic-design-fundamentals` — 6 h
9. Brand New Brand — `brand-new-brand` — 6 h
10. Introduction to Typography — `introduction-to-typography` — 6 h
11. Advanced Guide to Adobe InDesign CC: Tables & Effects — `adobe-indesign-tables-effects` — 8 h
12. Design and Make Infographics (Project-Centered Course) — `design-and-make-infographics` — 6 h
13. Packaging Design for the Circular Economy — `packaging-design-circular-economy` — 6 h
14. UI / UX Design — `ui-ux-design` — 6 h
15. Apply UI/UX Design with Figma for Modern Interfaces — `ui-ux-figma-modern-interfaces` — 8 h
16. Build Dynamic User Interfaces (UI) for Websites — `dynamic-website-ui-design` — 8 h
17. Product Design and UX/UI Fundamentals — `product-design-ux-ui-fundamentals` — 6 h
18. Sustainable Product Design for Engineers — `sustainable-product-design-for-engineers` — 6 h
19. AutoCAD 3D Design: Modeling and Visualization — `autocad-3d-modeling-visualization` — 8 h
20. Blueprint to Brilliance Through Interior Design — `blueprint-to-brilliance-interior-design` — 6 h
21. SketchUp Fundamentals for Interior Space Planning — `sketchup-interior-space-planning` — 8 h
22. AutoCAD Architectural Design & Residential Planning — `autocad-architecture-residential-planning` — 8 h
23. BIM Fundamentals: Smarter Building Design & Planning — `bim-fundamentals-building-design` — 8 h
24. Design and Visualize Landscape Gardens Using SketchUp — `sketchup-landscape-garden-design` — 8 h
25. Sustainable Cities — `sustainable-cities` — 6 h
26. Fashion as Design: Craft and Sustainability — `fashion-design-craft-sustainability` — 6 h
27. Master Motion Graphics in After Effects: Create & Animate — `after-effects-motion-graphics` — 8 h
28. A Masterclass in Animation — `masterclass-in-animation` — 8 h
29. Introduction to Game Design — `introduction-to-game-design` — 6 h
30. Character Design for Video Games — `video-game-character-design` — 8 h
31. 3D Models for Virtual Reality — `3d-models-for-virtual-reality` — 8 h
32. Design Thinking for Innovation — `design-thinking-for-innovation` — 6 h
33. ITIL 5 Service Design, Transition, and Delivery — `itil-5-service-design-transition-delivery` — 6 h
34. Instructional Design Foundations and Applications — `instructional-design-foundations-applications` — 6 h

## Release gate — never skip

1. Upload original 12-page English MAIC study manual matching the approved visual identity; confirm file hash, text legibility and student access.
2. Create a matching 100-item MCQ bank with four options, unambiguous key, explanation and valid source page for each item; check question variety, accuracy and response cues.
3. Complete independent question-level academic reviews with verified reviewer identity and source/evidence checks; address every blocker rather than marking it resolved without substantive review.
4. Approve and activate the bank only after the real review is finished, then test actual eligible-student access and exam submission.
5. Confirm catalog status, estimated study hours, and completion/certificate eligibility before listing as published.

## Execution order

Complete the 34 missing-material courses in the listed catalog order. First: `diploma-in-journalism`. Do not change archived courses automatically. Do not treat this work log as academic sign-off.

## Progress note — 2026-11-22 (verified after initial audit)

- **All 16 of the 36 courses with source PDFs but inactive exams now have 100-item current-source editorial drafts** in Cloudflare D1; 1,600 questions total. These drafts are not independently approved and are not active for students.
- The 20 previously active exams were not modified during this content preparation.
- Original English `Diploma in Journalism` training manuscript saved as `data/course-manuscripts/diploma-in-journalism.md` (12 substantive sections, estimated guided study: 12 hours).
- The independent review candidate PDF was successfully rendered in GitHub Actions run 45046808095, with the approved MAIC crest, a Michigan/US backdrop on the cover and Tinos 12-point instructional text. The workflow validated a 12-page output. This does **not** mean the PDF has been uploaded to the production `learning_materials` table or exposed to students.
- Remaining missing production PDFs: 34 preparing courses (including Diploma in Journalism pending upload) and 8 archived courses. Do not count a manuscript or review candidate as an active student manual.
- The next sequence after review of the Journalism candidate is source registration/upload, item-writing and independent approval; then Fundamentals of Journalism and subsequent missing-material courses.

## Continuation: journalism and video production editorial staging (2026-11-22)

- Original **Diploma in Journalism** manuscript and 12-page candidate PDF generated and visually reviewed. Its separate **100-item MCQ draft** is at `data/exam-drafts/diploma-in-journalism-100mcq.json`.
- Original **Fundamentals of Journalism** manuscript and 12-page candidate PDF generated and visually reviewed. Its separate **100-item MCQ draft** is at `data/exam-drafts/fundamentals-of-journalism-100mcq.json`.
- Original **Understanding Digital Journalism** manuscript and 12-page candidate PDF generated and visually reviewed. Its separate **100-item MCQ draft** is at `data/exam-drafts/understanding-digital-journalism-100mcq.json`.
- Original **Understanding the Essentials of Video Production** manuscript saved at `data/course-manuscripts/essentials-of-video-production.md`; a 12-page PDF candidate was built, and its multiline cover required a renderer spacing fix. Its unapproved **100-item editorial draft bank** is saved at `data/exam-drafts/essentials-of-video-production-100mcq.json` and requires independent item-level academic review.
- Reusable renderer: `tools/render_maic_manuscript.py`; CI PDF builder: `.github/workflows/maic-manuscripts.yml`. Academic review candidates are ZIP artifacts and **not** student-published PDFs.
- Draft bank structural checker: `tools/audit_staged_exam_drafts.py`; GitHub Actions `.github/workflows/maic-draft-bank-audit.yml`. The latest three-bank audit succeeded after correcting short-question and numeric-option lint edge cases. Structural QA is **not** academic approval.
- None of the four newly authored manuscripts has been uploaded as an approved production learning material; there are still **36 registered production PDFs, 20 active exams**, and the 16 prior inactive courses with source-matched editorial banks. The new offline MCQ drafts are not D1 approved exams, and no new catalog course is marked published.
- The multiline video-production cover spacing was corrected and a new 12-page PDF candidate rendered successfully. Next: begin `video-editing-imovie-davinci-resolve` and retain independent reviewer signoffs before activation.

## Continuation — Four additional original course packages (2026-11-22)

Four more courses in strict unprepared catalog order now have **original English manuscripts, CI-generated 12-page PDF academic review candidates and 100-question offline editorial MCQ banks**:

| Course | Course ID | Study hours | MCQ draft |
|---|---|---:|---|
| Video Editing Using iMovie and DaVinci Resolve | `video-editing-imovie-davinci-resolve` | 8 | `data/exam-drafts/video-editing-imovie-davinci-resolve-100mcq.json` |
| Media Studies - Entertainment and Broadcast Media | `entertainment-and-broadcast-media` | 6 | `data/exam-drafts/entertainment-and-broadcast-media-100mcq.json` |
| Diploma in Social Media Marketing and Strategy | `diploma-in-social-media-marketing-and-strategy` | 12 | `data/exam-drafts/diploma-in-social-media-marketing-and-strategy-100mcq.json` |
| Fundamentals of Graphic Design | `graphic-design-fundamentals` | 6 | `data/exam-drafts/graphic-design-fundamentals-100mcq.json` |

Editorial manuscript locations are `data/course-manuscripts/<course_id>.md`. All four new 100-item banks have 100 unique stems and 25 correct answers in each A/B/C/D position; the latest GitHub Actions bank audit passed (run `45049198047`, before the final draft addition, plus the next run for the last bank). PDF artifacts were generated successfully and reviewed for page count, visible content and layout. Feature-specific references: Apple Support and Blackmagic's own materials for editing workflows; UNESCO media literacy and U.S. sponsorship rules for broadcasting; FTC influencer disclosures and Google Analytics measurement for marketing; W3C WCAG 2.2 contrast guidance for digital graphics. All new instructional wording and practice cases were independently authored.

**Important production boundary verified against live Cloudflare D1 in this continuation:** Exactly **36 material records**, **20 active exams**, and **16 source-matched D1 editorial draft banks** still exist. None of the newly prepared four or the previous four offline course manuscripts is present in the production `learning_materials` table; their exam drafts are on GitHub, not installed as active D1 exam banks. This distinction is deliberate: reviewed-source registration and independent academic answer signoff are required before student activation. No independent review has been asserted or fabricated.

**Overall offline editorial progress:** Eight of the 34 initial preparing courses with no production PDFs have a first original 12-section manuscript, PDF review candidate and staged 100-item bank. The remaining **26 preparing courses lack original course manuals**. Eight archived entries remain outside this queue. The next initial-preparation item is **Brand New Brand** (`brand-new-brand`).
