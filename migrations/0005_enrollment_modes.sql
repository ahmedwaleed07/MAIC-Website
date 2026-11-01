-- Enrollment course mode without changing the legacy learning_enrollments primary key or INSERT syntax.
CREATE TABLE IF NOT EXISTS learning_enrollment_modes (
 student_id TEXT NOT NULL,
 course_id TEXT NOT NULL,
 delivery_mode TEXT NOT NULL CHECK(delivery_mode IN ('self-paced','group','one-on-one')),
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(student_id,course_id),
 FOREIGN KEY(student_id,course_id) REFERENCES learning_enrollments(student_id,course_id) ON DELETE CASCADE
);
