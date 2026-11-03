-- Audit substantive corrections to private draft MCQs before independent review.
CREATE TABLE IF NOT EXISTS learning_exam_item_corrections (
 id TEXT PRIMARY KEY,
 course_id TEXT NOT NULL,
 version TEXT NOT NULL,
 ordinal INTEGER NOT NULL CHECK(ordinal BETWEEN 1 AND 100),
 previous_sha256 TEXT NOT NULL CHECK(length(previous_sha256)=64),
 revised_sha256 TEXT NOT NULL CHECK(length(revised_sha256)=64),
 editor TEXT NOT NULL,
 reason TEXT NOT NULL,
 corrected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(course_id,version,ordinal) REFERENCES learning_exam_questions(course_id,version,ordinal)
);
CREATE INDEX IF NOT EXISTS idx_maic_mcq_correction_audit ON learning_exam_item_corrections(course_id,version,ordinal);
