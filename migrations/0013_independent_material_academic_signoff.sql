-- Separate independent human academic approval from automated PDF checks.
-- A 34-course import used "OpenAI Codex" as reviewed_by for technical checks.
-- That does not constitute independent academic sign-off.
CREATE TABLE IF NOT EXISTS learning_material_academic_signoffs (
 course_id TEXT NOT NULL,
 source_sha256 TEXT NOT NULL CHECK(LENGTH(source_sha256)=64),
 reviewer_name TEXT NOT NULL CHECK(LENGTH(TRIM(reviewer_name))>=3),
 reviewer_review_date TEXT NOT NULL,
 review_notes TEXT NOT NULL CHECK(LENGTH(TRIM(review_notes))>=60),
 owner_attested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(course_id,source_sha256),
 FOREIGN KEY(course_id) REFERENCES learning_materials(course_id)
);
CREATE INDEX IF NOT EXISTS idx_maic_material_human_signoff
 ON learning_material_academic_signoffs(course_id,owner_attested_at);
