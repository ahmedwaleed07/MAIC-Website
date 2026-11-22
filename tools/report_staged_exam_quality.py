#!/usr/bin/env python3
"""Quality preflight for MAIC offline assessment drafts.

Produces aggregate reviewer triage only: no student-facing questions or answer
keys in reports. Structural pass is NOT independent academic approval.
"""
import argparse
import json
import re
from collections import Counter
from pathlib import Path


def norm(value):
    return re.sub(r"\s+", " ", str(value).casefold().strip())


def analyze(bank):
    questions = bank.get("questions", [])
    if len(questions) != 100:
        return {"questions": len(questions), "blocked": True,
                "reasons": ["incomplete_or_invalid_bank"]}
    overlaps = 0
    option_sets = [set(map(norm, q.get("options", []))) for q in questions]
    for i, first in enumerate(option_sets):
        for second in option_sets[i + 1:]:
            if len(first.intersection(second)) >= 3:
                overlaps += 1

    prefixes = Counter(norm(q.get("rationale", ""))[:24] for q in questions)
    repeated_rationale_prefix = max(prefixes.values(), default=0)
    longest = shortest = singles = 0
    for q in questions:
        mask = q.get("correct_mask")
        if mask not in (1, 2, 4, 8):
            continue
        choices = q.get("options", [])
        if len(choices) != 4:
            continue
        singles += 1
        correct = (mask.bit_length() - 1)
        lengths = list(map(lambda x: len(str(x).strip()), choices))
        other = [lengths[j] for j in range(4) if j != correct]
        longest += int(lengths[correct] > max(other))
        shortest += int(lengths[correct] < min(other))
    longest_pct = round(100 * longest / singles, 1) if singles else 0
    shortest_pct = round(100 * shortest / singles, 1) if singles else 0

    reasons = []
    if overlaps > 12:
        reasons.append("repeated_three_or_more_options")
    if singles >= 20 and (longest_pct > 55 or shortest_pct > 55):
        reasons.append("answer_length_cue")
    if repeated_rationale_prefix >= 80:
        reasons.append("formulaic_rationale_prefix")
    if bank.get("approval_status") != "editorial_draft_pending_independent_review":
        reasons.append("unexpected_review_state")

    # The current public GitHub repository stores candidate answer keys.
    # They must be re-authored and protected before formal student assessment.
    reasons.append("publicly_exposed_draft_keys_require_replacement")
    reasons.append("independent_academic_review_missing")
    return {
        "questions": len(questions), "option_overlap_pairs": overlaps,
        "largest_shared_rationale_prefix": repeated_rationale_prefix,
        "correct_uniquely_longest_pct": longest_pct,
        "correct_uniquely_shortest_pct": shortest_pct,
        "blocked": True, "reasons": reasons,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default="data/exam-drafts")
    parser.add_argument("--output", default="dist/maic-qa")
    args = parser.parse_args()
    src, dest = Path(args.source), Path(args.output)
    paths = sorted(src.glob("*-100mcq.json"))
    if not paths:
        raise SystemExit("No staged banks found")
    dest.mkdir(parents=True, exist_ok=True)
    rows = []
    for path in paths:
        data = json.loads(path.read_text(encoding="utf-8"))
        item = analyze(data)
        item["course_id"] = data.get("course_id") or path.stem.replace("-100mcq", "")
        rows.append(item)
    output = {
        "scope": "Unapproved offline MAIC draft banks, NOT live exams",
        "course_count": len(rows),
        "question_count": sum(r["questions"] for r in rows),
        "blocked_count": sum(r["blocked"] for r in rows),
        "academic_approval": False,
        "rows": rows,
    }
    (dest / "academic-readiness-summary.json").write_text(
        json.dumps(output, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# MAIC offline exam draft: academic quality triage",
        "",
        "**DO NOT PUBLISH AS A STUDENT EXAM.** These are unapproved drafts.",
        "The repository hosting this source is public; its draft answers must",
        "be replaced and securely stored before any formal assessment release.",
        "Structural validation of 100 items is insufficient academic validation.",
        "",
        f"Courses: {output['course_count']}; draft items: {output['question_count']};",
        f"release-blocked: {output['blocked_count']}.",
        "",
        "| Course | Questions | Reused option-set pairs (3+) | Repeated rationale prefix | Length cue: longest/shortest | Release |",
        "|---|---:|---:|---:|---:|---|",
    ]
    for r in rows:
        lines.append(
            f"| `{r['course_id']}` | {r['questions']} | {r['option_overlap_pairs']} | "
            f"{r['largest_shared_rationale_prefix']} | "
            f"{r['correct_uniquely_longest_pct']}% / {r['correct_uniquely_shortest_pct']}% | BLOCKED |"
        )
    lines.extend([
        "", "## Release criteria",
        "",
        "1. Remove student exam keys from public source and rotate the exposed banks.",
        "2. Rewrite repetitive distractors and generic justifications into distinct, relevant alternatives.",
        "3. Match every item to the final reviewed PDF and verify the correct answer independently.",
        "4. Stage privately; require 100 documented independent item reviews, approved bank,",
        "   matching PDF hash, and end-to-end learner access tests.",
        "",
        "This report deliberately omits the questions and answer keys.",
    ])
    (dest / "academic-readiness-summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Preflight: {len(rows)} draft banks; {output['blocked_count']} blocked for release.")
    print(f"Reports: {dest / 'academic-readiness-summary.md'}")


if __name__ == "__main__":
    main()
