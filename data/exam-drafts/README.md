# MAIC confidential assessment candidates — no public answer keys

This directory intentionally contains **no** raw 100-item examination banks or correct-answer keys.

On 23 November 2026, the original 34 editorial exam candidate JSON files (3,400 draft questions in total) were staged in the MAIC Cloudflare D1 database table `learning_exam_private_candidates`, separately from the 20 active exams. All candidates retain `academic_status='unreviewed'` and are **not approved for students**.

These original draft answer keys were exposed in the earlier **public Git history**. Removing the current files does not erase that history or make their contents safe. Any eventual live exam must use **replacement and verified confidential questions/keys** following independent source and item review, 100 source-linked questions, approved PDFs and end-to-end tests. Do not import the old draft keys unchanged as production exam questions.

Review the staged inventory only through the authenticated MAIC owner dashboard at `/admin/exam-candidates.html`. Keys are never returned via a public or student endpoint.

CI enforces this policy through `tools/check_no_public_exam_keys.py`. If further academic draft assessments are needed, store them in private D1 staging or another restricted private storage, never public GitHub or Pages assets.
