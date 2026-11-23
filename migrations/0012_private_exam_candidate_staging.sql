-- Confidential editorial staging for original MAIC question banks.
-- Staging is separate from approved learning_exam_banks and cannot activate an exam.
-- Repository-staged keys were exposed in the historical public GitHub tree:
-- they MUST be replaced before student assessment even after private import.
CREATE TABLE IF NOT EXISTS learning_exam_private_candidates (
  course_id TEXT PRIMARY KEY,
  bank_version TEXT NOT NULL,
  source_manuscript TEXT NOT NULL,
  source_manuscript_blob_sha TEXT NOT NULL,
  source_pdf_sha256 TEXT,
  question_count INTEGER NOT NULL CHECK (question_count=100),
  questions_json TEXT NOT NULL,
  academic_status TEXT NOT NULL DEFAULT 'unreviewed'
    CHECK (academic_status='unreviewed'),
  imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  import_note TEXT NOT NULL DEFAULT 'Exposed public draft: do not use for live exams'
);
CREATE INDEX IF NOT EXISTS idx_maic_candidate_imported
  ON learning_exam_private_candidates(imported_at);
