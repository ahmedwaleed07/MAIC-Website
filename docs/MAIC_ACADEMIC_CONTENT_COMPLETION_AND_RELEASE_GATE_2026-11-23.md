# MAIC — academic content completion and release gate, 23 November 2026

## Summary of verified status

- Live Cloudflare D1: **78** catalog items: **20 published**, **50 preparing**, **8 archived**.
- Live production material registry: **36** PDFs; live active exams: **20**.
- Among the 50 preparing, **16** have registered production materials plus 100-item source-matched editorial exam drafts in D1, still not activated. Academic approval fields on those drafts remain null.
- The other **34** preparing courses now all have original 12-page PDF **academic review candidates**, original source manuscripts and 100-item **offline editorial draft banks** in GitHub. **None of those 34** is newly registered as a live production material.
- The latest work completed **18** additional manuscripts and banks, bringing the original 34-course content queue to **34/34 candidate sets**, or **3,400 questions** total.
- In the latest final CI run, GitHub Actions manual render/build completed successfully (run **45076618375**), and examination bank structural audit passed (run **45076633726**). Automated QA confirms schema and rendering, **not independent academic correctness**.
- Downloaded generated PDF candidate archive and verified programmatically: **34 PDFs, each 12 pages, all page text extractable, no blank content pages**. Visually sampled cover, middle and last pages of multiple newly created books. No final reviewer signature is asserted.

## The 18 final first-draft course packages

| # | Course | Catalog ID | Study hours | Source / question draft |
|---:|---|---|---:|---|
| 17 | Product Design and UX/UI Fundamentals | `product-design-ux-ui-fundamentals` | 8 | `data/course-manuscripts/product-design-ux-ui-fundamentals.md` / `data/exam-drafts/product-design-ux-ui-fundamentals-100mcq.json` |
| 18 | Sustainable Product Design for Engineers | `sustainable-product-design-for-engineers` | 8 | `data/course-manuscripts/sustainable-product-design-for-engineers.md` / `data/exam-drafts/sustainable-product-design-for-engineers-100mcq.json` |
| 19 | AutoCAD 3D Design: Modeling and Visualization | `autocad-3d-modeling-visualization` | 10 | `data/course-manuscripts/autocad-3d-modeling-visualization.md` / `data/exam-drafts/autocad-3d-modeling-visualization-100mcq.json` |
| 20 | Blueprint to Brilliance Through Interior Design | `blueprint-to-brilliance-interior-design` | 8 | `data/course-manuscripts/blueprint-to-brilliance-interior-design.md` / `data/exam-drafts/blueprint-to-brilliance-interior-design-100mcq.json` |
| 21 | SketchUp Fundamentals for Interior Space Planning | `sketchup-interior-space-planning` | 8 | `data/course-manuscripts/sketchup-interior-space-planning.md` / `data/exam-drafts/sketchup-interior-space-planning-100mcq.json` |
| 22 | AutoCAD Architectural Design & Residential Planning | `autocad-architecture-residential-planning` | 10 | `data/course-manuscripts/autocad-architecture-residential-planning.md` / `data/exam-drafts/autocad-architecture-residential-planning-100mcq.json` |
| 23 | BIM Fundamentals: Smarter Building Design & Planning | `bim-fundamentals-building-design` | 8 | `data/course-manuscripts/bim-fundamentals-building-design.md` / `data/exam-drafts/bim-fundamentals-building-design-100mcq.json` |
| 24 | Design and Visualize Landscape Gardens Using SketchUp | `sketchup-landscape-garden-design` | 8 | `data/course-manuscripts/sketchup-landscape-garden-design.md` / `data/exam-drafts/sketchup-landscape-garden-design-100mcq.json` |
| 25 | Sustainable Cities | `sustainable-cities` | 8 | `data/course-manuscripts/sustainable-cities.md` / `data/exam-drafts/sustainable-cities-100mcq.json` |
| 26 | Fashion as Design: Craft and Sustainability | `fashion-design-craft-sustainability` | 8 | `data/course-manuscripts/fashion-design-craft-sustainability.md` / `data/exam-drafts/fashion-design-craft-sustainability-100mcq.json` |
| 27 | Master Motion Graphics in After Effects: Create & Animate | `after-effects-motion-graphics` | 10 | `data/course-manuscripts/after-effects-motion-graphics.md` / `data/exam-drafts/after-effects-motion-graphics-100mcq.json` |
| 28 | A Masterclass in Animation | `masterclass-in-animation` | 10 | `data/course-manuscripts/masterclass-in-animation.md` / `data/exam-drafts/masterclass-in-animation-100mcq.json` |
| 29 | Introduction to Game Design | `introduction-to-game-design` | 8 | `data/course-manuscripts/introduction-to-game-design.md` / `data/exam-drafts/introduction-to-game-design-100mcq.json` |
| 30 | Character Design for Video Games | `video-game-character-design` | 8 | `data/course-manuscripts/video-game-character-design.md` / `data/exam-drafts/video-game-character-design-100mcq.json` |
| 31 | 3D Models for Virtual Reality | `3d-models-for-virtual-reality` | 8 | `data/course-manuscripts/3d-models-for-virtual-reality.md` / `data/exam-drafts/3d-models-for-virtual-reality-100mcq.json` |
| 32 | Design Thinking for Innovation | `design-thinking-for-innovation` | 8 | `data/course-manuscripts/design-thinking-for-innovation.md` / `data/exam-drafts/design-thinking-for-innovation-100mcq.json` |
| 33 | ITIL 5 Service Design, Transition, and Delivery | `itil-5-service-design-transition-delivery` | 10 | `data/course-manuscripts/itil-5-service-design-transition-delivery.md` / `data/exam-drafts/itil-5-service-design-transition-delivery-100mcq.json` |
| 34 | Instructional Design Foundations and Applications | `instructional-design-foundations-applications` | 8 | `data/course-manuscripts/instructional-design-foundations-applications.md` / `data/exam-drafts/instructional-design-foundations-applications-100mcq.json` |

Each manuscript is original English-language MAIC educational content with a cover plus eleven teaching pages, applied exercises, a final project and an evaluation rubric. The 100-item banks each have distinct stems, four options, page references and draft rationales. Automated answer-position distribution is 25 each for A, B, C and D. In the separate **International Law for Professionals** D1 draft, 18 questions use legitimate **two-correct-answer bitmasks**; the learner examination interface explicitly supports multiple-correct checkbox questions. These were not rewritten or invalidated simply for having two correct options.

## Release gating — do not mistake a source candidate for a published learner course

1. **Academic review** of each manuscript and assessment item, with a named reviewer, source version and dated signoff. Review educational depth, factual claims, calculation correctness, distractor plausibility, relevant technical standards and originality. Special attention to tools and standards that change over time, e.g. Figma, Adobe, Autodesk, SketchUp, ITIL (Version 5), buildingSMART IFC, EU ESPR/PPWR.
2. **Production registration** of the approved 34 source PDFs, retaining the file hashes, approval record, page count and controlled access. GitHub Actions artifacts are review candidates, not production course materials.
3. **Source-matched exam installation** into D1, preserving each approved source hash, exact key masks and reviewer outcomes. Do not mark a bank `approved` without a verified review record. Do not change multi-select items to force single-choice keys.
4. **End-to-end learner acceptance**: authenticated enrollment and course access; content stays in MAIC; exam eligibility, start and navigation, option selection and score correctness, completion criteria, certificate issuance and QR verification; test on phone and desktop. Check languages and visual identity.
5. **Controlled catalog release**: only after gates 1–4, update status `preparing` -> `published`, remove “Under Preparation,” record the responsible release actor and validate student-visible output. For the 16 already registered D1 drafts, gates 1 and 3–5 remain.
6. Do not suggest that independently authored MAIC courses carry product-vendor certifications or regulatory approval; a course called `ITIL 5...` is not an official PeopleCert certificate course.

## Current completion interpretation

- **Academic-review content prepared:** 34 new course PDF candidates + 34 offline question banks (3,400 questions), along with 16 existing D1 source materials/draft banks and 20 published active courses.
- **Actually live/published and active:** still **20**, not 70 or 78.
- **Waiting for actual approval and deployment:** all **50** preparing courses.
- **Archived:** 8, excluded unless the owner separately restores them.

This report is a status and QA record, not an academic reviewer signature. 
