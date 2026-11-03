-- Quality issues remain open until a substantive correction and independent academic signoff.
CREATE TABLE IF NOT EXISTS learning_exam_quality_issues (
 course_id TEXT NOT NULL,
 version TEXT NOT NULL,
 ordinal INTEGER NOT NULL CHECK(ordinal BETWEEN 1 AND 100),
 issue_code TEXT NOT NULL,
 severity TEXT NOT NULL DEFAULT 'blocker' CHECK(severity IN ('blocker','warning')),
 detail TEXT NOT NULL,
 detected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 resolved_at TEXT,
 resolved_by TEXT,
 resolution_notes TEXT,
 PRIMARY KEY(course_id,version,ordinal,issue_code),
 FOREIGN KEY(course_id,version,ordinal) REFERENCES learning_exam_questions(course_id,version,ordinal)
);
CREATE INDEX IF NOT EXISTS idx_maic_exam_open_issues ON learning_exam_quality_issues(course_id,version,severity,resolved_at);
