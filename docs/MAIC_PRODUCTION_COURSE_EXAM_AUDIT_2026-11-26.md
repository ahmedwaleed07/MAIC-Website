# MAIC — Production Course and Exam Verification (26 November 2026)

**Scope:** read-only verification of the official MAIC catalog, Cloudflare D1 material/exam metadata, protected learner-access logic and stored quality indicators. **This report is a technical audit, not independent academic approval or proof of a successful student-browser test.** No student personal information, private exam answers, confidential manuscripts or login secrets are included.

## Executive findings

- The production catalog contains **78 courses**: **49 published**, **21 preparing**, **8 archived**. Publishing in the catalog is not equivalent to academic release approval.
- **70 registered PDF manuals**, each declared as 12 pages, with valid PDF first-chunk signatures and valid complete base64 chunk sizes; none is an orphaned material. The recorded PDF metadata does not prove individual page layout or factual accuracy.
- **49 active exam banks**, each with exactly 100 stored questions and a source SHA-256 matching its current PDF: **4,900 active questions**. Their **technical** status is approved.
- **21 preparing courses** each have a PDF and a matching 100-question editorial draft, but no activated exam. Their drafts require independent review.
- **0/70 recorded independent academic PDF signoffs**, **0 recorded approved item-level academic reviews**, and **0 recorded independent exam-bank review signoffs**. Thus **none of the 49 technically active exams is verified for independent academic release**.
- **34** private source manuscripts (12 sections each, text lengths approximately 16,002–21,169 characters) and **34** private exam candidates recorded as unreviewed. Previous public Git history exposed earlier draft questions/keys; never treat those drafts as confidential release banks.
- **49/49 active exams** have complete ordinal sequences, and no exact duplicate stems within the same active bank. **11 short-stem items** (under 30 characters) occur across **8 active exams** and need editorial correction.
- Automated heuristics identified **12 active banks with answer-length cues**, **6 banks with repeated multi-option answer sets**, and **3 banks with excessive near-duplicate stems**. These are flags requiring human investigation, not proof of incorrect keys.
- Active banks show **0 stored open blocking issues**, but this does **not** override the missing academic review evidence. Historical draft/withdrawn banks retain **9,918 open blocker records**. A single exact active-stem match was detected against earlier publicly exposed private candidates for `design-and-make-infographics`; replace and review it.
- A real enrolled learner exists in production. User identity and session data are intentionally excluded from this report. A complete authenticated end-to-end 100-question learner attempt has **not** been performed.

## Current course-by-course state

The **Academic signoff** and **Reviewed items** columns are zero for every course in the current D1 snapshot; tables below focus on readiness indicators and specific flagged short stems.

### Listed in catalog (published) — 49

| Course | PDF | Active 100-MCQ exam | Matching 100-item draft | Short-stem flags |
|---|---|---|---|---:|
| Accounting for Managerial Decisions (`managerial-accounting`) | Yes (12 pages) | Yes | No | 0 |
| Advanced Guide to Adobe InDesign CC: Tables & Effects (`adobe-indesign-tables-effects`) | Yes (12 pages) | Yes | No | 0 |
| Applied Problem Solving (`applied-problem-solving`) | Yes (12 pages) | Yes | No | 0 |
| Brand New Brand (`brand-new-brand`) | Yes (12 pages) | Yes | No | 2 |
| Bringing New Ideas to Market (`innovation-go-to-market`) | Yes (12 pages) | Yes | No | 0 |
| Business Finance & Reporting (`business-finance-accounting`) | Yes (12 pages) | Yes | No | 0 |
| Business Marketing Communications (`marketing-communications`) | Yes (12 pages) | Yes | No | 0 |
| Collaborative Leadership & Teamwork (`collaborative-leadership`) | Yes (12 pages) | Yes | No | 0 |
| Competitive Advantage & Performance (`competitive-advantage`) | Yes (12 pages) | Yes | Yes | 0 |
| Design and Make Infographics (Project-Centered Course) (`design-and-make-infographics`) | Yes (12 pages) | Yes | No | 0 |
| Digital Project Delivery (`digital-project-delivery`) | Yes (12 pages) | Yes | No | 0 |
| Diploma in Journalism (`diploma-in-journalism`) | Yes (12 pages) | Yes | No | 0 |
| Diploma in Social Media Marketing and Strategy (`diploma-in-social-media-marketing-and-strategy`) | Yes (12 pages) | Yes | No | 3 |
| Economic Thinking for Managers (`economics-for-decisions`) | Yes (12 pages) | Yes | Yes | 1 |
| Economics for International Business (`international-business-economics`) | Yes (12 pages) | Yes | No | 0 |
| Financial Concepts for Decision Makers (`financial-decision-making`) | Yes (12 pages) | Yes | No | 1 |
| Fundamentals of Graphic Design (`graphic-design-fundamentals`) | Yes (12 pages) | Yes | No | 0 |
| Fundamentals of Journalism (`fundamentals-of-journalism`) | Yes (12 pages) | Yes | No | 0 |
| Global Institutions & Governance (`global-institutions`) | Yes (12 pages) | Yes | No | 0 |
| Human Resources Foundations (`human-resources`) | Yes (12 pages) | Yes | No | 0 |
| Innovation Management in Practice (`innovation-management`) | Yes (12 pages) | Yes | No | 0 |
| International Law for Professionals (`international-law`) | Yes (12 pages) | Yes | No | 0 |
| Introduction to Typography (`introduction-to-typography`) | Yes (12 pages) | Yes | No | 1 |
| Inventory & Transportation Planning (`inventory-transport-planning`) | Yes (12 pages) | Yes | No | 0 |
| Investment Evaluation Essentials (`investment-evaluation`) | Yes (12 pages) | Yes | No | 0 |
| Leadership in Organizations (`organizational-leadership`) | Yes (12 pages) | Yes | No | 0 |
| Leading Innovative Teams (`innovation-leadership`) | Yes (12 pages) | Yes | No | 0 |
| Management Foundations (`management-foundations`) | Yes (12 pages) | Yes | No | 0 |
| Managing IT Services (`it-service-management`) | Yes (12 pages) | Yes | No | 0 |
| Managing Organizational Change (`organizational-change`) | Yes (12 pages) | Yes | No | 0 |
| Marketing Foundations (`digital-marketing`) | Yes (12 pages) | Yes | No | 0 |
| Media Studies – Entertainment and Broadcast Media (`entertainment-and-broadcast-media`) | Yes (12 pages) | Yes | No | 0 |
| Operations & Service Strategy (`operations-strategy`) | Yes (12 pages) | Yes | No | 0 |
| Packaging Design for the Circular Economy (`packaging-design-circular-economy`) | Yes (12 pages) | Yes | No | 0 |
| Planning Digital Transformation (`digital-transformation`) | Yes (12 pages) | Yes | No | 0 |
| Professional Communication in Practice (`professional-communication-practice`) | Yes (12 pages) | Yes | No | 1 |
| Project Management Foundations (`project-management`) | Yes (12 pages) | Yes | No | 0 |
| Risk-Aware Management Decisions (`risk-for-managers`) | Yes (12 pages) | Yes | No | 0 |
| Strategic Planning & Execution (`strategic-planning`) | Yes (12 pages) | Yes | Yes | 0 |
| Strategic Procurement & Sourcing (`procurement-sourcing`) | Yes (12 pages) | Yes | No | 0 |
| Supply Chain & Logistics Foundations (`supply-chain-foundations`) | Yes (12 pages) | Yes | No | 1 |
| Supply Chain Analytics & KPIs (`supply-chain-analytics`) | Yes (12 pages) | Yes | No | 0 |
| Sustainable & Global Supply Networks (`sustainable-supply-chains`) | Yes (12 pages) | Yes | No | 0 |
| Time & Workload Management (`time-workload-management`) | Yes (12 pages) | Yes | No | 0 |
| Understanding Digital Journalism (`understanding-digital-journalism`) | Yes (12 pages) | Yes | Yes | 0 |
| Understanding International Relations (`international-relations`) | Yes (12 pages) | Yes | No | 0 |
| Understanding the Essentials of Video Production (`essentials-of-video-production`) | Yes (12 pages) | Yes | No | 0 |
| Video Editing Using iMovie and DaVinci Resolve (`video-editing-imovie-davinci-resolve`) | Yes (12 pages) | Yes | No | 1 |
| Workplace Collaboration Skills (`workplace-team-collaboration`) | Yes (12 pages) | Yes | No | 0 |

### Preparing — PDFs present, exams not active — 21

| Course | PDF | Active 100-MCQ exam | Matching 100-item draft | Short-stem flags |
|---|---|---|---|---:|
| 3D Models for Virtual Reality (`3d-models-for-virtual-reality`) | Yes (12 pages) | No | Yes | 0 |
| A Masterclass in Animation (`masterclass-in-animation`) | Yes (12 pages) | No | Yes | 0 |
| Apply UI/UX Design with Figma for Modern Interfaces (`ui-ux-figma-modern-interfaces`) | Yes (12 pages) | No | Yes | 0 |
| AutoCAD 3D Design: Modeling and Visualization (`autocad-3d-modeling-visualization`) | Yes (12 pages) | No | Yes | 0 |
| AutoCAD Architectural Design & Residential Planning (`autocad-architecture-residential-planning`) | Yes (12 pages) | No | Yes | 0 |
| BIM Fundamentals: Smarter Building Design & Planning (`bim-fundamentals-building-design`) | Yes (12 pages) | No | Yes | 0 |
| Blueprint to Brilliance Through Interior Design (`blueprint-to-brilliance-interior-design`) | Yes (12 pages) | No | Yes | 0 |
| Build Dynamic User Interfaces (UI) for Websites (`dynamic-website-ui-design`) | Yes (12 pages) | No | Yes | 0 |
| Character Design for Video Games (`video-game-character-design`) | Yes (12 pages) | No | Yes | 0 |
| Design Thinking for Innovation (`design-thinking-for-innovation`) | Yes (12 pages) | No | Yes | 0 |
| Design and Visualize Landscape Gardens Using SketchUp (`sketchup-landscape-garden-design`) | Yes (12 pages) | No | Yes | 0 |
| Fashion as Design: Craft and Sustainability (`fashion-design-craft-sustainability`) | Yes (12 pages) | No | Yes | 0 |
| ITIL 5 Service Design, Transition, and Delivery (`itil-5-service-design-transition-delivery`) | Yes (12 pages) | No | Yes | 0 |
| Instructional Design Foundations and Applications (`instructional-design-foundations-applications`) | Yes (12 pages) | No | Yes | 0 |
| Introduction to Game Design (`introduction-to-game-design`) | Yes (12 pages) | No | Yes | 0 |
| Master Motion Graphics in After Effects: Create & Animate (`after-effects-motion-graphics`) | Yes (12 pages) | No | Yes | 0 |
| Product Design and UX/UI Fundamentals (`product-design-ux-ui-fundamentals`) | Yes (12 pages) | No | Yes | 0 |
| SketchUp Fundamentals for Interior Space Planning (`sketchup-interior-space-planning`) | Yes (12 pages) | No | Yes | 0 |
| Sustainable Cities (`sustainable-cities`) | Yes (12 pages) | No | Yes | 0 |
| Sustainable Product Design for Engineers (`sustainable-product-design-for-engineers`) | Yes (12 pages) | No | Yes | 0 |
| UI / UX Design (`ui-ux-design`) | Yes (12 pages) | No | Yes | 0 |

### Archived — not in release queue — 8

| Course | PDF | Active 100-MCQ exam | Matching 100-item draft | Short-stem flags |
|---|---|---|---|---:|
| Business English Communication (`business-english`) | No | No | No | 0 |
| Business Strategy Coaching (`business-strategy`) | No | No | No | 0 |
| Entrepreneurship & Innovation (`entrepreneurship`) | No | No | No | 0 |
| Introduction to Python (`python-fundamentals`) | No | No | No | 0 |
| Leadership & Team Development (`leadership`) | No | No | No | 0 |
| Private Project Management Coaching (`project-coaching`) | No | No | No | 0 |
| Professional Communication Skills (`professional-communication`) | No | No | No | 0 |
| Professional Development Coaching (`career-coaching`) | No | No | No | 0 |

## Active-exam editorial flags requiring attention

- **Too-short stems (11 items, 8 banks):** `diploma-in-social-media-marketing-and-strategy` (3), `brand-new-brand` (2), `economics-for-decisions`, `financial-decision-making`, `introduction-to-typography`, `professional-communication-practice`, `supply-chain-foundations`, `video-editing-imovie-davinci-resolve` (1 each).
- **Excessive near-duplicate pairs:** `economics-for-decisions`, `procurement-sourcing`, `sustainable-supply-chains`.
- **Excessive repeated groups of three or more identical answer options:** `competitive-advantage`, `economics-for-decisions`, `procurement-sourcing`, `strategic-planning`, `supply-chain-analytics`, `sustainable-supply-chains`.
- **Answer-length cue above 55% on single-answer items:** `adobe-indesign-tables-effects`, `brand-new-brand`, `design-and-make-infographics`, `diploma-in-journalism`, `diploma-in-social-media-marketing-and-strategy`, `fundamentals-of-journalism`, `global-institutions`, `graphic-design-fundamentals`, `introduction-to-typography`, `packaging-design-circular-economy`, `professional-communication-practice`, `workplace-team-collaboration`.
- **Previously exposed candidate overlap:** `design-and-make-infographics` contains one exact question stem match with the previously staged public-history candidate. An independently authored replacement is required before trusting the confidentiality of that item.

## Next actions — do not falsely mark complete

1. Correct the short, near-duplicated and highly cue-prone active questions. Replace the overlapping publicly exposed question. Re-run automated checks, and maintain a documented correction trail.
2. Assign a real independent academic reviewer to each exact-source PDF; record identified reviewer, date, notes and owner attestation only after actual inspection.
3. Review each exam item and its source page, answer key, distractors, question quality and original wording; approve all 100 per bank, with separate independent bank signoff. Do not record fabricated review results.
4. Keep the 21 preparing courses as preparing until these academic gates are met and their exams can be safely activated.
5. Use an explicitly authorized learner test session (not impersonation or D1 token-hash recovery) for a full browser examination: PDF opening, study confirmation, one-way question navigation, no early score, final submission, result, and eligibility checks.
6. Distinguish catalog visibility, technically enabled exams, academic release readiness and certificate issuance as different states. Never infer certificates from exam activation.

**Provenance:** Cloudflare Pages project `maic-website`, production D1 database `maic-content`, GitHub repository `ahmedwaleed07/MAIC-Website`, catalog document version 49, queries and application-review inspection conducted on 26 November 2026. All SQL reads were read-only and no production learner records or exams were altered by this verification.
