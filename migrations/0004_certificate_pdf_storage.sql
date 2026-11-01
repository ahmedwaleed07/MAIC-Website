-- Private, access-controlled PDF storage in D1 (no R2 account activation required).
CREATE TABLE IF NOT EXISTS learning_certificate_pdfs(
 certificate_id TEXT PRIMARY KEY REFERENCES learning_certificates(id),
 version TEXT NOT NULL, bytes INTEGER NOT NULL,sha256 TEXT NOT NULL,
 chunk_count INTEGER NOT NULL,uploaded_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS learning_certificate_pdf_chunks(
 certificate_id TEXT NOT NULL REFERENCES learning_certificates(id),
 version TEXT NOT NULL,part INTEGER NOT NULL,payload TEXT NOT NULL,
 PRIMARY KEY(certificate_id,version,part)
);
CREATE TABLE IF NOT EXISTS learning_certificate_events(
 id TEXT PRIMARY KEY,certificate_id TEXT NOT NULL REFERENCES learning_certificates(id),
 action TEXT NOT NULL,performed_by TEXT NOT NULL,
 notes TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_maic_certificate_events ON learning_certificate_events(certificate_id,created_at);
