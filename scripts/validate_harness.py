#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
validate_harness.py

Validates the Free Traveler "harness" itself — CLAUDE.md, the
traveler-project-pipeline Skill, and the 7 pipeline Command files — rather
than the Task List or its inputs (that's `validate_inputs.py`/`audit_tasks.py`).
This checks that the governance layer an Agent session relies on
(`/gen-tasklist`, `/gen-task-details`, `/audit-tasks`, `/prepare-task`,
`/implement-task`, `/run-wave`, `/release-check`) is actually present and
encodes the required rules — not that any Task work has been done.

No third-party dependencies — stdlib only.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CLAUDE_MD = REPO_ROOT / "CLAUDE.md"
SKILL_MD = REPO_ROOT / ".claude" / "skills" / "traveler-project-pipeline" / "SKILL.md"
COMMANDS_DIR = REPO_ROOT / ".claude" / "commands"
REQUIRED_COMMANDS = [
    "gen-tasklist.md",
    "gen-task-details.md",
    "audit-tasks.md",
    "prepare-task.md",
    "implement-task.md",
    "run-wave.md",
    "release-check.md",
]
DESIGN_PATH_REL = "design-reference/D-001/DESIGN.md"
SCREEN_CONTRACT_REL = "design-reference/SCREEN_ROUTE_CONTRACT.json"
HARNESS_SCHEMA = "traveler-screen-route-v1"
CANONICAL_DB_TABLES = ["profiles", "mate_posts", "mate_applications", "blocks", "reports", "external_links"]

results: list[tuple[int, str, bool, str]] = []  # (num, name, passed, detail)


def check(num: int, name: str, passed: bool, detail: str) -> None:
    results.append((num, name, passed, detail))


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.is_file() else ""


def existing_command_files() -> dict[str, Path]:
    return {name: COMMANDS_DIR / name for name in REQUIRED_COMMANDS}


def harness_corpus() -> str:
    """CLAUDE.md + SKILL.md + every present Command file, concatenated, for
    prose-rule checks (4–10, 13) that may legitimately live in more than one
    of these files rather than being pinned to exactly one."""
    parts = [read(CLAUDE_MD), read(SKILL_MD)]
    for path in existing_command_files().values():
        parts.append(read(path))
    return "\n".join(parts)


def main() -> int:
    claude_text = read(CLAUDE_MD)
    skill_text = read(SKILL_MD)
    corpus = harness_corpus()

    # 1. CLAUDE.md 존재
    check(1, "CLAUDE.md 존재", CLAUDE_MD.is_file(),
          f"{CLAUDE_MD.relative_to(REPO_ROOT)}" if CLAUDE_MD.is_file() else f"missing: {CLAUDE_MD.relative_to(REPO_ROOT)}")

    # 2. Claude Code Skill 파일 존재
    check(2, "Claude Code Skill 파일 존재", SKILL_MD.is_file(),
          f"{SKILL_MD.relative_to(REPO_ROOT)}" if SKILL_MD.is_file() else f"missing: {SKILL_MD.relative_to(REPO_ROOT)}")

    # 3. 7개 Command 존재
    cmd_files = existing_command_files()
    missing_cmds = [name for name, p in cmd_files.items() if not p.is_file()]
    check(3, "7개 Command 존재", not missing_cmds,
          "all 7 present" if not missing_cmds else f"missing: {[f'.claude/commands/{m}' for m in missing_cmds]}")

    # 4. traveler-screen-route-v1 Marker 존재
    marker_in_claude = f"HARNESS_SCHEMA={HARNESS_SCHEMA}" in claude_text
    contract_schema_ok = False
    contract_path = REPO_ROOT / SCREEN_CONTRACT_REL
    if contract_path.is_file():
        try:
            data = json.loads(contract_path.read_text(encoding="utf-8"))
            contract_schema_ok = data.get("schema_version") == HARNESS_SCHEMA
        except json.JSONDecodeError:
            contract_schema_ok = False
    check(4, "traveler-screen-route-v1 Marker 존재", marker_in_claude and contract_schema_ok,
          f"CLAUDE.md HARNESS_SCHEMA marker: {marker_in_claude}; "
          f"{SCREEN_CONTRACT_REL} schema_version == {HARNESS_SCHEMA!r}: {contract_schema_ok}")

    # 5. D-001 DESIGN 경로 일치
    design_marker_ok = f"DESIGN_PATH={DESIGN_PATH_REL}" in claude_text
    design_file = REPO_ROOT / DESIGN_PATH_REL
    design_file_ok = design_file.is_file()
    design_version_ok = False
    if design_file_ok:
        head = design_file.read_text(encoding="utf-8")[:400]
        design_version_ok = bool(re.search(r"^version:\s*D-001\s*$", head, re.MULTILINE))
    check(5, "D-001 DESIGN 경로 일치", design_marker_ok and design_file_ok and design_version_ok,
          f"CLAUDE.md DESIGN_PATH marker: {design_marker_ok}; file exists: {design_file_ok}; "
          f"front matter 'version: D-001': {design_version_ok}")

    # 6. Screen Contract 경로 일치
    contract_marker_ok = f"SCREEN_CONTRACT={SCREEN_CONTRACT_REL}" in claude_text
    check(6, "Screen Contract 경로 일치", contract_marker_ok and contract_path.is_file() and contract_schema_ok,
          f"CLAUDE.md SCREEN_CONTRACT marker: {contract_marker_ok}; file exists: {contract_path.is_file()}; "
          f"schema_version match: {contract_schema_ok}")

    # 7. Page Owner 5개 규칙 존재
    po_assemble = bool(re.search(r"page\s*owner.{0,60}(조립|assemble)", corpus, re.IGNORECASE | re.DOTALL))
    po_five = bool(re.search(r"(5개.{0,20}page[_ ]owner|page[_ ]owner.{0,20}5개|정확히\s*5개)", corpus, re.IGNORECASE))
    check(7, "Page Owner 5개 규칙 존재", po_assemble and po_five,
          f"'Page Owner...조립' pattern found: {po_assemble}; '5개 Page Owner' pattern found: {po_five}")

    # 8. DB Table 6개 기본 범위 존재
    all_tables_named = all(t in corpus for t in CANONICAL_DB_TABLES)
    six_table_mention = bool(re.search(r"6개.{0,10}(table|테이블)|정확히\s*6개", corpus, re.IGNORECASE))
    check(8, "DB Table 6개 기본 범위 존재", all_tables_named and six_table_mention,
          f"all 6 canonical table names present in harness text: {all_tables_named}; "
          f"'6개 테이블' style mention found: {six_table_mention}")

    # 9. 외부 입력 비저장 규칙 존재
    nontransmit = bool(re.search(
        r"(항공|숙소|flight|hotel).{0,80}(비저장|저장하지\s*않|전송하지\s*않|전달되지\s*않|미저장|미전송|not\s+(stored|sent|transmit))",
        corpus, re.IGNORECASE | re.DOTALL))
    check(9, "외부 입력 비저장 규칙 존재", nontransmit,
          f"항공/숙소 입력값 비저장·비전송 표현 발견: {nontransmit}")

    # 10. Playwright Chromium Smoke 규칙 존재
    chromium_smoke_marker = "PLAYWRIGHT_SCOPE=chromium-smoke" in claude_text
    chromium_smoke_prose = bool(re.search(r"chromium.{0,40}smoke|smoke.{0,40}chromium", corpus, re.IGNORECASE | re.DOTALL))
    check(10, "Playwright Chromium Smoke 규칙 존재", chromium_smoke_marker and chromium_smoke_prose,
          f"CLAUDE.md PLAYWRIGHT_SCOPE marker: {chromium_smoke_marker}; "
          f"'Chromium...Smoke' prose found elsewhere in harness: {chromium_smoke_prose}")

    # 11. AUTO_MERGE=false
    auto_merge_false = "AUTO_MERGE=false" in claude_text
    auto_merge_true_anywhere = bool(re.search(r"AUTO_MERGE\s*=\s*true", corpus, re.IGNORECASE))
    check(11, "AUTO_MERGE=false", auto_merge_false and not auto_merge_true_anywhere,
          f"CLAUDE.md has 'AUTO_MERGE=false': {auto_merge_false}; "
          f"no contradictory 'AUTO_MERGE=true' anywhere in harness: {not auto_merge_true_anywhere}")

    # 12. AWS_ENABLED=false
    aws_false = "AWS_ENABLED=false" in claude_text
    aws_true_anywhere = bool(re.search(r"AWS_ENABLED\s*=\s*true", corpus, re.IGNORECASE))
    check(12, "AWS_ENABLED=false", aws_false and not aws_true_anywhere,
          f"CLAUDE.md has 'AWS_ENABLED=false': {aws_false}; "
          f"no contradictory 'AWS_ENABLED=true' anywhere in harness: {not aws_true_anywhere}")

    # 13. EXCLUDED 보호 규칙 존재
    excluded_rule = bool(re.search(r"EXCLUDED.{0,60}(임의로\s*구현하지\s*않|구현하지\s*않는다|do\s+not\s+implement)",
                                    corpus, re.IGNORECASE | re.DOTALL))
    check(13, "EXCLUDED 보호 규칙 존재", excluded_rule,
          f"'EXCLUDED...구현하지 않는다' 표현 발견: {excluded_rule}")

    print("=== validate_harness.py ===")
    for num, name, passed, detail in results:
        tag = "OK  " if passed else "FAIL"
        print(f"{tag}: [{num}] {name} — {detail}")
    print("---")

    failed = [r for r in results if not r[2]]
    if not failed:
        print("VALIDATE_HARNESS_PASS")
        print(f"검사 수: {len(results)}")
        return 0

    print("VALIDATE_HARNESS_FAIL")
    print(f"검사 수: {len(results)}, 실패: {len(failed)}")
    print("실패한 검사와 누락된 규칙:")
    for num, name, _passed, detail in failed:
        print(f"  [{num}] {name}: {detail}")
    return 1


if __name__ == "__main__":
    for _stream in (sys.stdout, sys.stderr):
        if hasattr(_stream, "reconfigure"):
            _stream.reconfigure(encoding="utf-8")
    sys.exit(main())
