-- MAIC Self-Paced examinations: 100 source-verified MCQs, strictly forward-only.
-- Existing student enrollments and materials remain unchanged.
CREATE TABLE IF NOT EXISTS learning_exam_banks (
 course_id TEXT NOT NULL,
 version TEXT NOT NULL,
 source_sha256 TEXT NOT NULL CHECK(length(source_sha256)=64),
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','approved','withdrawn')),
 question_count INTEGER NOT NULL DEFAULT 0 CHECK(question_count BETWEEN 0 AND 100),
 approved_by TEXT,
 approved_at TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(course_id,version)
);
CREATE TABLE IF NOT EXISTS learning_exam_questions (
 course_id TEXT NOT NULL,
 version TEXT NOT NULL,
 ordinal INTEGER NOT NULL CHECK(ordinal BETWEEN 1 AND 100),
 stem TEXT NOT NULL,
 option_a TEXT NOT NULL,option_b TEXT NOT NULL,option_c TEXT NOT NULL,option_d TEXT NOT NULL,
 correct_mask INTEGER NOT NULL CHECK(correct_mask BETWEEN 1 AND 15),
 source_page INTEGER NOT NULL CHECK(source_page BETWEEN 1 AND 999),
 rationale TEXT NOT NULL,
 PRIMARY KEY(course_id,version,ordinal),
 FOREIGN KEY(course_id,version) REFERENCES learning_exam_banks(course_id,version)
);
CREATE TABLE IF NOT EXISTS learning_exam_active (
 course_id TEXT PRIMARY KEY,
 version TEXT NOT NULL,
 activated_at TEXT NOT NULL,
 FOREIGN KEY(course_id,version) REFERENCES learning_exam_banks(course_id,version)
);
CREATE TABLE IF NOT EXISTS learning_exam_attempts (
 id TEXT PRIMARY KEY,
 student_id TEXT NOT NULL REFERENCES learning_students(id),
 course_id TEXT NOT NULL,
 version TEXT NOT NULL,
 source_sha256 TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'in_progress' CHECK(state IN ('in_progress','submitted','void')),
 current_question INTEGER NOT NULL DEFAULT 1 CHECK(current_question BETWEEN 1 AND 101),
 correct_count INTEGER CHECK(correct_count BETWEEN 0 AND 100),
 score_percent REAL CHECK(score_percent BETWEEN 0 AND 100),
 started_at TEXT NOT NULL,
 submitted_at TEXT,
 UNIQUE(student_id,course_id,version),
 FOREIGN KEY(course_id,version) REFERENCES learning_exam_banks(course_id,version)
);
CREATE INDEX IF NOT EXISTS idx_maic_exam_student ON learning_exam_attempts(student_id,course_id,state);
CREATE TABLE IF NOT EXISTS learning_exam_answers (
 attempt_id TEXT NOT NULL REFERENCES learning_exam_attempts(id),
 ordinal INTEGER NOT NULL CHECK(ordinal BETWEEN 1 AND 100),
 selected_mask INTEGER NOT NULL CHECK(selected_mask BETWEEN 1 AND 15),
 is_correct INTEGER NOT NULL CHECK(is_correct IN (0,1)),
 answered_at TEXT NOT NULL,
 PRIMARY KEY(attempt_id,ordinal)
);
-- No public answer key. The whole test is graded only on final submission.
