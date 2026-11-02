-- Required separation between examination preparation and independent academic review.
CREATE TABLE IF NOT EXISTS learning_exam_review_signoffs (
 course_id TEXT NOT NULL,
 version TEXT NOT NULL,
 prepared_by TEXT NOT NULL,
 prepared_at TEXT NOT NULL,
 reviewed_by TEXT,
 reviewed_at TEXT,
 review_notes TEXT,
 PRIMARY KEY (course_id,version),
 FOREIGN KEY (course_id,version) REFERENCES learning_exam_banks(course_id,version)
);
CREATE INDEX IF NOT EXISTS idx_maic_exam_review_state ON learning_exam_review_signoffs(prepared_at,reviewed_at);
