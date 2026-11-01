-- MAIC course delivery, verified completion, certificates, and physical originals.
-- Safe additive schema. Deployment requires a separate D1 migration and validation.
CREATE TABLE IF NOT EXISTS learning_course_formats (
 course_id TEXT NOT NULL, mode TEXT NOT NULL CHECK(mode IN ('self-paced','group','one-on-one')),
 curriculum_json TEXT NOT NULL DEFAULT '[]',
 requirements_json TEXT NOT NULL DEFAULT '{}',
 completion_rules_json TEXT NOT NULL DEFAULT '{}',
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(course_id,mode)
);
CREATE TABLE IF NOT EXISTS learning_course_runs (
 id TEXT PRIMARY KEY, course_id TEXT NOT NULL,
 mode TEXT NOT NULL CHECK(mode IN ('group','one-on-one')),
 instructor_name TEXT NOT NULL DEFAULT '',
 schedule_json TEXT NOT NULL DEFAULT '[]',
 status TEXT NOT NULL CHECK(status IN ('draft','scheduled','active','finished','cancelled')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS learning_completions (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES learning_students(id),
 course_id TEXT NOT NULL, mode TEXT NOT NULL CHECK(mode IN ('self-paced','group','one-on-one')),
 run_id TEXT REFERENCES learning_course_runs(id),
 status TEXT NOT NULL CHECK(status IN ('in_progress','completed','verified','rejected')),
 evidence_ref TEXT NOT NULL DEFAULT '', score REAL,
 completed_at TEXT, verified_at TEXT, verified_by TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(student_id,course_id,mode,run_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_maic_completions_self_run ON learning_completions(student_id,course_id,mode) WHERE run_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_maic_completions_student ON learning_completions(student_id);
CREATE TABLE IF NOT EXISTS learning_certificates (
 id TEXT PRIMARY KEY, certificate_number TEXT NOT NULL UNIQUE,
 completion_id TEXT NOT NULL UNIQUE REFERENCES learning_completions(id),
 student_id TEXT NOT NULL REFERENCES learning_students(id),
 course_id TEXT NOT NULL,
 course_mode TEXT NOT NULL CHECK(course_mode IN ('self-paced','group','one-on-one')),
 certificate_type TEXT NOT NULL CHECK(certificate_type IN ('completion','participation')),
 graduate_full_name TEXT NOT NULL, course_title TEXT NOT NULL,
 graduate_country TEXT NOT NULL, agent_id TEXT NOT NULL, agent_name TEXT NOT NULL,
 verification_token TEXT NOT NULL UNIQUE,
 status TEXT NOT NULL DEFAULT 'issued' CHECK(status IN ('issued','revoked','corrected')),
 public_consent INTEGER NOT NULL DEFAULT 0 CHECK(public_consent IN (0,1)),
 consent_at TEXT,
 issued_at TEXT NOT NULL,
 revoked_at TEXT, revocation_reason TEXT NOT NULL DEFAULT '',
 pdf_storage_key TEXT, pdf_generated_at TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_maic_certificates_student ON learning_certificates(student_id,issued_at);
CREATE INDEX IF NOT EXISTS idx_maic_certificates_public ON learning_certificates(public_consent,issued_at);
CREATE TABLE IF NOT EXISTS learning_original_requests (
 id TEXT PRIMARY KEY,certificate_id TEXT NOT NULL REFERENCES learning_certificates(id),
 student_id TEXT NOT NULL REFERENCES learning_students(id),
 agent_id TEXT NOT NULL, 
 recipient_name TEXT NOT NULL, recipient_phone TEXT NOT NULL,
 shipping_country TEXT NOT NULL, shipping_address TEXT NOT NULL, postal_code TEXT NOT NULL DEFAULT '',
 fee_amount TEXT, fee_currency TEXT,
 agent_payment_reference TEXT,
 status TEXT NOT NULL DEFAULT 'awaiting_agent_quote' CHECK(status IN ('awaiting_agent_quote','awaiting_payment','payment_confirmed','printing','shipped','delivered','cancelled')),
 tracking_reference TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_maic_original_single_open ON learning_original_requests(certificate_id,student_id) WHERE status NOT IN ('delivered','cancelled');
CREATE INDEX IF NOT EXISTS idx_maic_original_requests_agent ON learning_original_requests(agent_id,status);
CREATE TABLE IF NOT EXISTS learning_agent_notifications (
 id TEXT PRIMARY KEY,agent_id TEXT NOT NULL, request_id TEXT NOT NULL REFERENCES learning_original_requests(id),
 category TEXT NOT NULL DEFAULT 'original_certificate_request',
 status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','delivered','acknowledged')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, delivered_at TEXT, acknowledged_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_maic_agent_notifications ON learning_agent_notifications(agent_id,status);
