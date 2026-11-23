#!/usr/bin/env python3
"""Refuse to publish raw answer-bearing MAIC question banks in public Git.

The earlier 34 original 100-item draft banks have been migrated into
learning_exam_private_candidates in MAIC D1 with academic_status=unreviewed.
Prior Git history still exposes historical versions. Replace these questions
before any live student exam.
"""
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
sensitive = list((root / "data" / "exam-drafts").glob("*-100mcq.json"))
sensitive += list((root / "data" / "exam-drafts").glob("*-answer*.json"))
if sensitive:
    raise SystemExit(
        "FAIL: Exam answer keys must not live in the public repository: " +
        ", ".join(str(p.relative_to(root)) for p in sensitive)
    )
notice = root / "data" / "exam-drafts" / "README.md"
if not notice.exists():
    raise SystemExit("FAIL: protected draft directory policy missing")
print("PASS: No live exam answer-key draft files on the public source branch.")
print("Historical Git commits and released keys still require rotation.")
