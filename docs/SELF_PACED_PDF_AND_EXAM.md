# MAIC Self-Paced — official course manual and 100 MCQ examination (2026-11-01)

## Approved learning pathway
1. MAIC prepares an academically reviewed PDF for each course, without competitor-branded content.
2. PDFs are black and white, including the official MAIC crest rendered in grayscale. Cover and academy headings retain the official MAIC wordmark and approved brand typeface. Body text must be genuine Times New Roman 12 pt; licensed font files are supplied at build time, never committed to GitHub. Do not substitute Tinos/Times-Roman and call it TNR.
3. Teach substantive concepts, objectives, applied examples, case studies, and exercises. The earlier 12-page guideline remains; do not pad pages or repeat content to hit page count.
4. The learner's designated agent confirms payment and MAIC activates enrollment. The learner opens the private PDF, confirms reviewing it, and then receives access to a fully approved exam bank matching the PDF's SHA-256.
5. The exam contains exactly 100 MCQs. Each question displays four options and permits one or more correct options. Show checkboxes without disclosing the number of correct responses; every item must have defensible source-based wording and strong, but not ambiguous, distractors.
6. The learner submits each answer by pressing Next. The server atomically saves the selection and advances exactly one step. Prior questions cannot be reopened or changed by back, reload, separate tabs, or stale requests.
7. Each answer earns 1 point only for an exact match to the complete correct-option set. No score, explanation or correct key is shown until the answer to question 100 is submitted. Final result: correct answers out of 100 and percentage; no unapproved passing threshold is invented.
8. Certificate issuance stays separate, under the academic requirements for the selected certificate type. Completion of the MCQ exam is not itself proof of an automatically issued credential.
9. No bank is activated without a human academic review against the actual manual including all answer keys, explanations, four distinct choices and source page references.

## Database and endpoints
- Migration: migrations/0006_self_paced_exam.sql
- Reading evidence: learning_material_study and /api/learner/study. A material update resets study confirmation.
- Versioned banks: learning_exam_banks, learning_exam_questions, learning_exam_active.
- Protected attempts: learning_exam_attempts and learning_exam_answers.
- Learner: /learner/exam.html?course=... and /api/learner/exam
- Owner-only bank upload: /admin/exam-banks.html and /api/admin/exam-banks
- No correct answers or rationales are returned to browser code.
- One attempt per approved question-bank version is recorded pending an approved retake policy.
- The server verifies a current self-paced enrollment and the exact material SHA before starting or advancing an examination.

## JSON bank structure
{
  "format": "maic-mcq-v1",
  "questions": [
    {
      "stem": "An academically valid, unambiguous question of at least 30 characters.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": [0, 2],
      "page": 5,
      "rationale": "An explanation citing the precise source for why A and C are correct."
    }
  ]
}
The example is not a usable exam. The file MUST contain 100 reviewed questions. The correct array uses indices 0 to 3 and may contain one to four choices.

## PDF production and rollout
The script tools/create_maic_course_pdf.py creates black-and-white MAIC PDFs from reviewed course content JSON. It requires properly licensed true Times New Roman regular and bold font files, the original MAIC logo typeface, and the original crest image. It is a formatting tool, not a content author or independent academic fact checker.

The existing 36 English 12-page PDFs are stored in D1 but have not been reissued in this exact style and must not be claimed compliant without verification. No bank of 100 questions has been written or approved as part of the platform implementation. Keep tests unavailable until both source materials and question banks are reviewed.

## Testing gate
Check no access without enrollment, 100 source-reviewed items per bank, no answer keys in HTTP response, exact scoring on multi-select questions, no backwards movement by browser Back or forged requests, correct resumption after refresh, grade revealed only after #100, and no eligibility after revoked enrollment or source-PDF revision. Test with nonproduction accounts before opening to actual learners.
