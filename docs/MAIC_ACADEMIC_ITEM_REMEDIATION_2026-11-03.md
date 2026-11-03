# MAIC — Academic Correction Queue and Release Blockers (3 November 2026)

## Status as verified in Cloudflare D1

- 36 private exam-bank drafts, 3,600 questions. **Zero exams active.**
- 26 machine-templated banks (2,600 questions) require substantive redevelopment, not mere wording swaps.
- Open blocking issue records created from the full bank audit:
  - `TEMPLATE_BASED_ASSESSMENT`: **2,600** individual issues
  - `AI_DRAFT_RATIONALE`: **2,600** individual issues
  - `OVERLONG_QUESTION_STEM`: **2,518** individual issues
  - Total: **7,718** defect flags on 2,600 questions. Multiple flags may attach to one question.
- The 36 academic bank source PDF SHA-256 values currently differ from the 36 legacy published PDF records; no bank can be approved yet.
- Independent academic item signoffs: none. The fact that an item has a stored answer key does **not** mean that key is academically correct.
- Seven documented, substantive project-management question corrections have been applied to draft items **6, 20, 27, 34, 55, 65, 80**. All seven amendment entries exist in `learning_exam_item_corrections`; this is editorial correction, NOT independent academic signoff. Their previous and corrected keys are preserved privately in the `Project_Management_7_Substantive_Corrections_PRIVATE.json` review artifact.

## Technical remediation deployed or prepared

1. Bank approval now requires 100 **individual** independent source/key/distractor attestations, with SHA-256 of the entire question content. Editing an option or correct answer invalidates the old signoff.
2. Owner-only `/api/admin/exam-edit` allows amendments of specific draft items, with optimistic concurrency SHA, rationale, source page, exact multi-select key, mandatory editorial reason and persisted audit trail.
3. Each of the 2,600 machine-formatted questions is annotated as a blocked academic-quality issue. Additional flags identify generic AI draft rationales and overlong stems.
4. An issue can only be closed after a **real, recorded content correction** and independent academic recheck. The server rejects resolutions of unchanged questions, obvious template cues, or overlong stems.
5. The existing MAIC admin interface exposes each question's open issues, editor, independent reviewer and a progress summary. There is no change to the official MAIC crest, color palette, layout or certificate art.
6. Neither item review nor issue clearance alone can activate an exam. The exact current Tinos PDF must match the bank source, all 100 items must be independently signed, all blocking flags resolved, and the other bank-level academic rules must pass.

## Scientific limitations and next release gate

No automated check can validate 3,600 nuanced multi-select answer keys from 12-page course books to the level of human academic assessment. The 26 machine-generated banks in particular were shown by a style-cue classifier to reveal answers without subject knowledge at almost 99.9% of option selections. They need **2,600 substantive rewrites**, each followed by source, key and distractor verification. Earlier 1,000 draft questions also need independent item-by-item review.

MAIC must not falsely claim that the 3,600 exams are approved. Draft records remain private and must never be shown to learners or used for certificate-of-achievement grading until these release gates are passed.

## Quality protocol

- For every problematic MCQ: read cited source page, write a realistic course-specific case, select defensible correct choice(s), and create **plausible yet wrong** distractors rather than obvious negative cues.
- Avoid generic boilerplate in the stem, repeated option prefixes and rationale that just repeats the stem.
- When several answers are correct, confirm *all* applicable answers and document why each distractor is wrong.
- Use `/admin/exam-banks.html` to record the change, close applicable flags after independent academic review and sign each item. 
- Only promote Tinos12 PDFs after separate scientific, rights, branding and clarity review, then run a real browser-based student test in a nonproduction environment.

All original MAIC visual assets and existing learner materials remain intact.
