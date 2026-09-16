#!/usr/bin/env python
"""
validate_inputs.py

Pre-flight check for the Traveler Task Generation Pipeline (see
.claude/skills/traveler-project-pipeline/SKILL.md). Run BEFORE /gen-tasklist
writes anything.

Runs exactly 11 checks:
 1. package.json declares a Next.js dependency.
 2. src/app/page.tsx and src/app/layout.tsx exist.
 3. PRD / SRS / Project Scope / UI docs exist.
 4. design-reference/D-001/DESIGN.md exists and DESIGN_MANIFEST.md is LOCKED.
 5. SCREEN_ROUTE_CONTRACT.json parses as JSON.
 6. Screen count is exactly 5.
 7. SCR-001..SCR-005 are all present.
 8. Route set is exactly {/, /about, /travel-tools, /mates, /account}.
 9. Every Page Entry matches the Next.js App Router path format.
10. PROJECT_SCOPE.md mentions all 80 REQ-FUNC and all 34 REQ-NF ids.
11. AWS/EC2 are not defined as active technology (only as excluded items, if at all).

On success: prints `VALIDATE_INPUTS_PASS` and the number of checks run, exit 0.
On failure: prints the missing files / Screens / Requirement ids, exit 1.

Stdlib only — runs as `python scripts/validate_inputs.py`.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        _stream.reconfigure(encoding="utf-8")

TOTAL_CHECKS = 11

EXPECTED_ROUTES = {"/", "/about", "/travel-tools", "/mates", "/account"}
EXPECTED_SCREEN_IDS = {f"SCR-{i:03d}" for i in range(1, 6)}
EXPECTED_FUNC_COUNT = 80
EXPECTED_NF_COUNT = 34

PAGE_ENTRY_PATTERN = re.compile(r"^src/app/(?:[A-Za-z0-9_\-\[\]]+/)*page\.tsx$")

DOC_GROUPS: dict[str, list[str]] = {
    "PRD": ["01_PRD.md.md"],
    "SRS": ["02_SRS_BASELINE.md.md"],
    "Project Scope": ["docs/PROJECT_SCOPE.md"],
    "UI 문서": [
        "docs/03_UI_COVERAGE_ANALYSIS.md",
        "docs/04_UIUX_PLAN.md",
        "design-reference/UI_CONTRACT.md",
    ],
}

SCREEN_CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
DESIGN_MD_PATH = REPO_ROOT / "design-reference" / "D-001" / "DESIGN.md"
MANIFEST_PATH = REPO_ROOT / "design-reference" / "DESIGN_MANIFEST.md"
PROJECT_SCOPE_PATH = REPO_ROOT / "docs" / "PROJECT_SCOPE.md"
PACKAGE_JSON_PATH = REPO_ROOT / "package.json"

REQ_ID_PATTERN = re.compile(r"\bREQ-(FUNC|NF)-(\d{3})\b")


class Result:
    def __init__(self) -> None:
        self.log: list[str] = []
        self.passed = 0
        self.missing_files: list[str] = []
        self.missing_screens: list[str] = []
        self.missing_requirements: list[str] = []
        self.other_failures: list[str] = []

    def ok(self, msg: str) -> None:
        self.log.append(f"OK:   {msg}")
        self.passed += 1

    def fail(self, msg: str) -> None:
        self.log.append(f"FAIL: {msg}")

    @property
    def has_failure(self) -> bool:
        return any(line.startswith("FAIL:") for line in self.log)


def check_1_nextjs_dependency(r: Result) -> None:
    if not PACKAGE_JSON_PATH.is_file():
        r.fail("package.json not found")
        r.missing_files.append("package.json")
        return
    try:
        pkg = json.loads(PACKAGE_JSON_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        r.fail(f"package.json is not valid JSON: {exc}")
        return
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    if "next" in deps:
        r.ok(f"[1] package.json declares Next.js dependency (next@{deps['next']})")
    else:
        r.fail("[1] package.json has no 'next' dependency")


def check_2_app_router_entrypoints(r: Result) -> None:
    page = REPO_ROOT / "src" / "app" / "page.tsx"
    layout = REPO_ROOT / "src" / "app" / "layout.tsx"
    missing = []
    if not page.is_file():
        missing.append("src/app/page.tsx")
    if not layout.is_file():
        missing.append("src/app/layout.tsx")
    if missing:
        r.fail(f"[2] missing App Router entrypoint file(s): {missing}")
        r.missing_files.extend(missing)
    else:
        r.ok("[2] src/app/page.tsx and src/app/layout.tsx both exist")


def check_3_baseline_docs(r: Result) -> None:
    group_ok = True
    for group, candidates in DOC_GROUPS.items():
        found = [c for c in candidates if (REPO_ROOT / c).is_file()]
        missing = [c for c in candidates if not (REPO_ROOT / c).is_file()]
        if missing:
            r.fail(f"[3] {group} document(s) missing: {missing}")
            r.missing_files.extend(missing)
            group_ok = False
        else:
            r.ok(f"[3] {group} document(s) present: {found}")
    if group_ok:
        r.ok("[3] PRD / SRS / Project Scope / UI 문서 all present")


def check_4_design_locked(r: Result) -> None:
    if not DESIGN_MD_PATH.is_file():
        r.fail(f"[4] missing {DESIGN_MD_PATH.relative_to(REPO_ROOT)}")
        r.missing_files.append(str(DESIGN_MD_PATH.relative_to(REPO_ROOT)))
        return
    r.ok(f"[4] {DESIGN_MD_PATH.relative_to(REPO_ROOT)} exists")

    if not MANIFEST_PATH.is_file():
        r.fail(f"[4] missing {MANIFEST_PATH.relative_to(REPO_ROOT)}")
        r.missing_files.append(str(MANIFEST_PATH.relative_to(REPO_ROOT)))
        return

    text = MANIFEST_PATH.read_text(encoding="utf-8")
    if re.search(r"\bStatus:\*{0,2}\s*LOCKED\b", text) or "Status: LOCKED" in text:
        r.ok("[4] DESIGN_MANIFEST.md declares Status: LOCKED")
    else:
        r.fail("[4] DESIGN_MANIFEST.md does not declare 'Status: LOCKED'")
        r.other_failures.append("DESIGN_MANIFEST.md missing 'Status: LOCKED'")


def load_screen_contract(r: Result) -> dict | None:
    if not SCREEN_CONTRACT_PATH.is_file():
        r.fail(f"[5] missing {SCREEN_CONTRACT_PATH.relative_to(REPO_ROOT)}")
        r.missing_files.append(str(SCREEN_CONTRACT_PATH.relative_to(REPO_ROOT)))
        return None
    try:
        data = json.loads(SCREEN_CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        r.fail(f"[5] SCREEN_ROUTE_CONTRACT.json is not valid JSON: {exc}")
        return None
    r.ok("[5] SCREEN_ROUTE_CONTRACT.json parses as JSON")
    return data


def check_6_screen_count(data: dict, r: Result) -> list[dict]:
    screens = data.get("screens", [])
    if not isinstance(screens, list):
        r.fail("[6] 'screens' is missing or not a list")
        return []
    if len(screens) == 5:
        r.ok("[6] Screen count is exactly 5")
    else:
        r.fail(f"[6] Screen count is {len(screens)}, expected exactly 5")
    return screens


def check_7_screen_ids(screens: list[dict], r: Result) -> None:
    actual_ids = {s.get("screen_id") for s in screens}
    missing = sorted(EXPECTED_SCREEN_IDS - actual_ids)
    extra = sorted(actual_ids - EXPECTED_SCREEN_IDS)
    if missing:
        r.fail(f"[7] missing Screen id(s): {missing}")
        r.missing_screens.extend(missing)
    if extra:
        r.fail(f"[7] unexpected Screen id(s): {extra}")
    if not missing and not extra:
        r.ok("[7] SCR-001..SCR-005 are all present")


def check_8_routes(screens: list[dict], r: Result) -> None:
    actual_routes = {s.get("route") for s in screens}
    if actual_routes == EXPECTED_ROUTES:
        r.ok(f"[8] Route set is exactly {sorted(EXPECTED_ROUTES)}")
        return
    missing = sorted(EXPECTED_ROUTES - actual_routes)
    extra = sorted(actual_routes - EXPECTED_ROUTES)
    if missing:
        r.fail(f"[8] missing Route(s): {missing}")
    if extra:
        r.fail(f"[8] unexpected Route(s): {extra}")


def check_9_page_entry_format(screens: list[dict], r: Result) -> None:
    bad = []
    for s in screens:
        entry = s.get("page_entry", "")
        if not PAGE_ENTRY_PATTERN.match(entry or ""):
            bad.append((s.get("screen_id"), entry))
    if bad:
        r.fail(f"[9] Page Entry value(s) not in Next.js App Router path format (src/app/.../page.tsx): {bad}")
        r.other_failures.extend(f"{sid}: {entry}" for sid, entry in bad)
    else:
        r.ok("[9] every Page Entry matches the Next.js App Router path format")


def check_10_requirement_coverage(r: Result) -> None:
    if not PROJECT_SCOPE_PATH.is_file():
        r.fail("[10] docs/PROJECT_SCOPE.md not found, cannot check requirement coverage")
        r.missing_files.append("docs/PROJECT_SCOPE.md")
        return

    text = PROJECT_SCOPE_PATH.read_text(encoding="utf-8")
    found_ids = {f"REQ-{m.group(1)}-{m.group(2)}" for m in REQ_ID_PATTERN.finditer(text)}

    func_ids = {f"REQ-FUNC-{i:03d}" for i in range(1, EXPECTED_FUNC_COUNT + 1)}
    nf_ids = {f"REQ-NF-{i:03d}" for i in range(1, EXPECTED_NF_COUNT + 1)}

    missing_func = sorted(func_ids - found_ids)
    missing_nf = sorted(nf_ids - found_ids)
    missing = missing_func + missing_nf

    if missing:
        r.fail(
            f"[10] docs/PROJECT_SCOPE.md is missing {len(missing)} requirement id(s) "
            f"(REQ-FUNC missing={len(missing_func)}, REQ-NF missing={len(missing_nf)}): "
            f"{missing[:15]}{' ...' if len(missing) > 15 else ''}"
        )
        r.missing_requirements.extend(missing)
    else:
        r.ok(
            f"[10] docs/PROJECT_SCOPE.md mentions all {EXPECTED_FUNC_COUNT} REQ-FUNC "
            f"and all {EXPECTED_NF_COUNT} REQ-NF ids"
        )


def check_11_no_active_aws_ec2(r: Result) -> None:
    """
    AWS/EC2 may appear ONLY as an explicitly excluded/replaced item (e.g. inside
    PROJECT_SCOPE.md's '제외 기능' table, phrased as replaced by Vercel/Supabase).
    A line mentioning AWS or EC2 without an exclusion/replacement qualifier nearby
    is treated as declaring it active technology, which is forbidden.
    """
    exclusion_markers = ["제외", "EXCLUDED", "대체", "배제", "범위 밖", "제외 범위"]
    offending: list[str] = []

    docs_to_scan = [PROJECT_SCOPE_PATH, REPO_ROOT / "02_SRS_BASELINE.md.md"]
    for doc in docs_to_scan:
        if not doc.is_file():
            continue
        for lineno, line in enumerate(doc.read_text(encoding="utf-8").splitlines(), start=1):
            if re.search(r"\b(AWS|EC2)\b", line):
                if not any(marker in line for marker in exclusion_markers):
                    offending.append(f"{doc.relative_to(REPO_ROOT)}:{lineno}: {line.strip()}")

    if offending:
        r.fail(f"[11] AWS/EC2 referenced as active technology (no exclusion qualifier found): {offending}")
        r.other_failures.extend(offending)
    else:
        r.ok("[11] AWS/EC2 are not defined as active technology")


def main() -> int:
    r = Result()

    check_1_nextjs_dependency(r)
    check_2_app_router_entrypoints(r)
    check_3_baseline_docs(r)
    check_4_design_locked(r)

    data = load_screen_contract(r)
    if data is not None:
        screens = check_6_screen_count(data, r)
        check_7_screen_ids(screens, r)
        check_8_routes(screens, r)
        check_9_page_entry_format(screens, r)
    else:
        r.other_failures.append("SCREEN_ROUTE_CONTRACT.json unreadable — checks 6-9 skipped")

    check_10_requirement_coverage(r)
    check_11_no_active_aws_ec2(r)

    print("=== validate_inputs.py ===")
    for line in r.log:
        print(line)
    print("---")

    if not r.has_failure:
        print("VALIDATE_INPUTS_PASS")
        print(f"검사 수: {TOTAL_CHECKS}")
        return 0

    if r.missing_files:
        print(f"누락 파일: {sorted(set(r.missing_files))}")
    if r.missing_screens:
        print(f"누락 Screen: {sorted(set(r.missing_screens))}")
    if r.missing_requirements:
        print(f"누락 Requirement ID: {sorted(set(r.missing_requirements))}")
    if r.other_failures:
        print(f"기타 실패: {r.other_failures}")

    fail_count = sum(1 for line in r.log if line.startswith("FAIL:"))
    print(f"VALIDATE_INPUTS_FAIL ({fail_count}/{TOTAL_CHECKS} check group(s) failed)")
    return 1


if __name__ == "__main__":
    sys.exit(main())
