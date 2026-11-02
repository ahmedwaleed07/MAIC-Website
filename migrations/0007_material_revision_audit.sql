-- Auditable, review-gated promotion of an academic study-manual PDF.
-- Do not change enrollments or existing learning_materials columns.
CREATE TABLE IF NOT EXISTS learning_material_revisions(
 id TEXT PRIMARY KEY,
 course_id TEXT NOT NULL,
 previous_sha256 TEXT,
 new_sha256 TEXT NOT NULL,
 previous_version TEXT,
 new_version TEXT NOT NULL,
 pages INTEGER NOT NULL CHECK(pages=12),
 bytes INTEGER NOT NULL CHECK(bytes BETWEEN 1000 AND 1250000),
 reviewed_by TEXT NOT NULL,
 content_reviewed INTEGER NOT NULL CHECK(content_reviewed=1),
 black_white_tinos12_verified INTEGER NOT NULL CHECK(black_white_tinos12_verified=1),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_maic_manual_revisions ON learning_material_revisions(course_id,created_at);
