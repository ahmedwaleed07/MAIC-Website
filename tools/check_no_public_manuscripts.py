#!/usr/bin/env python3
"""Ensure full academic book source text is not committed to MAIC public Git."""
from pathlib import Path

root=Path(__file__).resolve().parents[1]
folder=root/"data"/"course-manuscripts"
books=[p for p in folder.glob("*.md") if p.name!="README.md"]
if books:
    raise SystemExit("FAIL: Private MAIC manuscripts in public Git: "+", ".join(p.name for p in books))
if not (folder/"README.md").is_file():
    raise SystemExit("FAIL: Missing private-manuscript storage policy")
print("PASS: No complete editorial course manuscript in the current public source tree.")
print("Public Git history requires separate remediation; current-tree removal is not erasure.")
