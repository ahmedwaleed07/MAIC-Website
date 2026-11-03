-- Explicit review of each exam item, linked to its immutable content fingerprint.
-- Draft items are not automatically academically approved.
CREATE TABLE IF NOT EXISTS learning_exam_item_reviews (
 course_id TEXT NOT NULL,
 version TEXT NOT NULL,
 ordinal INTEGER NOT NULL CHECK(ordinal BETWEEN 1 AND 100),
 reviewed_by TEXT NOT NULL,
 verdict TEXT NOT NULL CHECK(verdict IN ('approved','revise')),
 review_notes TEXT NOT NULL CHECK(length(review_notes) BETWEEN 25 AND 2000),
 item_sha256 TEXT NOT NULL CHECK(length(item_sha256)=64),
 source_confirmed INTEGER NOT NULL CHECK(source_confirmed IN (0,1)),
 key_confirmed INTEGER NOT NULL CHECK(key_confirmed IN (0,1)),
 distractors_confirmed INTEGER NOT NULL CHECK(distractors_confirmed IN (0,1)),
 reviewed_at TEXT NOT NULL,
 PRIMARY KEY(course_id,version,ordinal),
 FOREIGN KEY(course_id,version,ordinal) REFERENCES learning_exam_questions(course_id,version,ordinal)
);
CREATE INDEX IF NOT EXISTS idx_maic_exam_item_review_verdict ON learning_exam_item_reviews(course_id,version,verdict);
