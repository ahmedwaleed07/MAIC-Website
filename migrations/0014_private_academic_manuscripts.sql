-- Private staging of original MAIC academic manuscript source text.
-- Public GitHub/source-code distribution must not expose entire unapproved books.
-- Content here is separate from the approved protected learner PDF in D1.
CREATE TABLE IF NOT EXISTS learning_material_private_manuscripts (
 course_id TEXT PRIMARY KEY,
 source_filename TEXT NOT NULL,
 source_git_blob_sha TEXT NOT NULL,
 content_markdown TEXT NOT NULL,
 section_count INTEGER NOT NULL CHECK(section_count=12),
 imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 access_status TEXT NOT NULL DEFAULT 'admin_only'
  CHECK(access_status='admin_only')
);
