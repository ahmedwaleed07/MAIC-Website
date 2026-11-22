#!/usr/bin/env python3
"""Structural audit for offline MAIC editorial exam banks.

This is only a gate for obvious data defects, never academic sign-off.
"""
import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path


def git_blob_sha(content: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(content)).encode() + b"\0" + content).hexdigest()


def audit(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    errors = []
    course = data.get("course_id")
    if not isinstance(course, str) or not re.fullmatch(r"[a-z0-9-]{2,80}", course):
        errors.append("course_id invalid")
    if data.get("approval_status") != "editorial_draft_pending_independent_review":
        errors.append("editorial drafts must retain academic-review-pending status")
    if data.get("source_pdf_sha256") is not None:
        errors.append("staged manuscript bank must not claim an approved PDF source")
    src = Path(data.get("source_manuscript", ""))
    if not src.is_file():
        errors.append("source manuscript is missing")
    else:
        actual = git_blob_sha(src.read_bytes())
        if data.get("source_manuscript_blob_sha") != actual:
            errors.append("manuscript blob SHA mismatch (content changed)")
        if src.stem != course:
            errors.append("source filename does not match course ID")
        sections = src.read_text(encoding="utf-8").split("<!-- MAIC-PAGE -->")
        if len(sections) != 12:
            errors.append(f"source has {len(sections)} sections, expected 12")
    q = data.get("questions")
    if not isinstance(q, list) or len(q) != 100 or data.get("number_of_questions") != 100:
        errors.append("exactly 100 questions required")
        q = q if isinstance(q, list) else []
    stems = set()
    counts = Counter()
    for i, item in enumerate(q, 1):
        if item.get("ordinal") != i:
            errors.append(f"question {i}: inconsistent ordinal")
        stem = str(item.get("stem", "")).strip()
        if not (20 <= len(stem) <= 350):
            errors.append(f"question {i}: stem length invalid")
        canon = re.sub(r"\s+", " ", stem.casefold())
        if canon in stems:
            errors.append(f"question {i}: duplicate stem")
        stems.add(canon)
        choices = item.get("options")
        if not isinstance(choices, list) or len(choices) != 4:
            errors.append(f"question {i}: four options required")
        elif len(set(re.sub(r"\s+", " ", str(x).strip().casefold()) for x in choices)) != 4:
            errors.append(f"question {i}: duplicate option")
        elif any(len(str(x).strip()) < 3 for x in choices):
            errors.append(f"question {i}: empty or invalid option")
        key = item.get("correct_mask")
        if key not in [1, 2, 4, 8]:
            errors.append(f"question {i}: invalid answer key")
        counts[key] += 1
        p = item.get("source_page")
        if not isinstance(p, int) or not 2 <= p <= 12:
            errors.append(f"question {i}: source page out of range")
        if len(str(item.get("rationale", "")).strip()) < 65:
            errors.append(f"question {i}: rationale insufficient")
    if len(q) == 100 and sorted(counts.get(k, 0) for k in (1, 2, 4, 8)) != [25,25,25,25]:
        errors.append("answer keys are not evenly distributed")
    return course, errors


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("files", nargs="*", default=[])
    args = parser.parse_args()
    paths = [Path(x) for x in args.files] or sorted(Path("data/exam-drafts").glob("*-100mcq.json"))
    if not paths:
        raise SystemExit("No exam drafts found")
    total = 0
    for path in paths:
        course, errors = audit(path)
        if errors:
            print("FAIL", path, course, "; ".join(errors))
            total += len(errors)
        else:
            print("PASS", course, "100 structurally valid draft questions (academic review still pending)")
    if total:
        raise SystemExit(f"{total} structural issues detected")
    print("All staged editorial exam banks passed structural validation.")


if __name__ == "__main__":
    main()
