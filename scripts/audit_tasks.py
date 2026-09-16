#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
audit_tasks.py

Final audit for the Free Traveler TASKS/ pipeline (TASKS/00_TASK_LIST.md +
TASKS/TASK-*.md). This replaces the earlier version of this script, which
checked the older `.claude/tasks/` pipeline (tasklist.json + details/) —
that pipeline has been superseded by TASKS/00_TASK_LIST.md.

Inputs (read-only):
  - TASKS/00_TASK_LIST.md              (Task List source of truth, §2 tables + §4 EXCLUDED table)
  - TASKS/TASK-*.md                    (one detail file per implemented Task ID)
  - docs/PROJECT_SCOPE.md              (REQ-FUNC-*/REQ-NF-* IMPLEMENT/EXCLUDED classification)
  - design-reference/SCREEN_ROUTE_CONTRACT.json  (Screen/Route/Page Entry source of truth)

Outputs (written by this script):
  - TASKS/TASK_MANIFEST.csv
  - TASKS/TASK_AUDIT_REPORT.md

Exit code: 0 on AUDIT_PASS, 1 on any failed check.
No third-party dependencies — stdlib only.
"""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = REPO_ROOT / "TASKS"
TASK_LIST_PATH = TASKS_DIR / "00_TASK_LIST.md"
PROJECT_SCOPE_PATH = REPO_ROOT / "docs" / "PROJECT_SCOPE.md"
SCREEN_CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
REPORT_PATH = TASKS_DIR / "TASK_AUDIT_REPORT.md"

EXPECTED_SCREEN_IDS = {f"SCR-{i:03d}" for i in range(1, 6)}
CANONICAL_DB_TABLES = {
    "profiles",
    "mate_posts",
    "mate_applications",
    "blocks",
    "reports",
    "external_links",
}
FORBIDDEN_KEYWORDS = [
    "ec2", "aws", "auto-merge", "automerge",
    "무인 자동 merge", "무인 병합", "자동 병합",
]
FORBIDDEN_PLAYWRIGHT_SCOPE = ["firefox", "webkit", "visual regression", "load test", "부하 테스트"]

COLUMNS = [
    "seq", "id", "title", "category", "impl_status", "req_ref", "screen",
    "route", "page_entry", "depends_on", "expected_files", "functional_ac",
    "visual_ac", "security_ac", "verify", "priority",
]

REQ_ID_RE = re.compile(r"REQ-(FUNC|NF)-(\d{3}(?:~\d{3})?(?:,\d{3}(?:~\d{3})?)*)")


# ------------------------------------------------------------------
# result accumulator
# ------------------------------------------------------------------
class Results:
    def __init__(self):
        self.checks: list[tuple[int, str, bool, str]] = []  # (num, name, passed, detail)

    def add(self, num: int, name: str, passed: bool, detail: str):
        self.checks.append((num, name, passed, detail))

    @property
    def all_passed(self) -> bool:
        return all(c[2] for c in self.checks)


# ------------------------------------------------------------------
# parsing: TASKS/00_TASK_LIST.md §2 task tables
# ------------------------------------------------------------------
def split_cell_list(raw: str) -> list[str]:
    raw = raw.strip()
    if raw in ("없음", "", "-"):
        return []
    parts = re.split(r"[;,]\s*", raw)
    return [p.strip() for p in parts if p.strip() and p.strip() != "없음"]


def expand_req_refs(text: str) -> list[str]:
    """Extract REQ-FUNC-*/REQ-NF-* ids from a Requirement Ref cell, expanding
    '~' ranges and prefix-sharing comma chains (e.g. 'REQ-FUNC-001~010,068,069')."""
    ids: list[str] = []
    for m in REQ_ID_RE.finditer(text):
        prefix = m.group(1)
        chain = m.group(2)
        for token in chain.split(","):
            token = token.strip()
            if "~" in token:
                start_s, end_s = token.split("~")
                start, end = int(start_s), int(end_s)
            else:
                start = end = int(token)
            for n in range(start, end + 1):
                ids.append(f"REQ-{prefix}-{n:03d}")
    return ids


def parse_task_list(messages: list[str]) -> list[dict]:
    if not TASK_LIST_PATH.is_file():
        messages.append(f"FAIL: {TASK_LIST_PATH.relative_to(REPO_ROOT)} not found")
        return []
    text = TASK_LIST_PATH.read_text(encoding="utf-8")
    lines = text.split("\n")

    tasks: list[dict] = []
    in_table = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("| Seq | Task ID |"):
            in_table = True
            continue
        if in_table and stripped.startswith("|---"):
            continue
        if in_table:
            if not stripped.startswith("|"):
                in_table = False
                continue
            cells = [c.strip() for c in stripped.strip("|").split("|")]
            # Known source defect: PAGE_OWNER rows in §2.1 are sometimes missing the
            # Expected Files cell entirely. Repair using the row's own Page Entry cell
            # (matches this document's own §5 invariant: "Page Owner의 Expected Files는
            # 자신의 page_entry를 포함한다"), and record it as a WARN, not a silent fix.
            if len(cells) == len(COLUMNS) - 1 and len(cells) > 8 and cells[3] == "PAGE_OWNER":
                page_entry = cells[8]
                cells = cells[:10] + [page_entry] + cells[10:]
                messages.append(
                    f"WARN: {cells[1]} row was missing the Expected Files cell in "
                    f"{TASK_LIST_PATH.name} — repaired using its own Page Entry ({page_entry})"
                )
            if len(cells) != len(COLUMNS):
                messages.append(f"WARN: skipped malformed table row ({len(cells)} cells, expected {len(COLUMNS)}): {stripped[:80]}")
                continue
            row = dict(zip(COLUMNS, cells))
            if not row["seq"].isdigit():
                continue
            row["req_ids"] = expand_req_refs(row["req_ref"])
            row["depends_on_ids"] = split_cell_list(row["depends_on"])
            row["expected_files_list"] = split_cell_list(row["expected_files"]) if "없음" not in row["expected_files"] else []
            tasks.append(row)
    return tasks


def parse_excluded_table(messages: list[str]) -> set[str]:
    """§4 NON_IMPLEMENTATION table: '| REQ-FUNC-042 | ... | ... |' rows."""
    if not TASK_LIST_PATH.is_file():
        return set()
    text = TASK_LIST_PATH.read_text(encoding="utf-8")
    excluded: set[str] = set()
    in_section = False
    for line in text.split("\n"):
        if line.strip().startswith("## 4. NON_IMPLEMENTATION"):
            in_section = True
            continue
        if in_section and line.strip().startswith("## 5."):
            break
        if in_section:
            m = re.match(r"\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|", line.strip())
            if m:
                excluded.add(m.group(1))
    return excluded


def parse_project_scope_statuses(messages: list[str]) -> dict[str, str]:
    if not PROJECT_SCOPE_PATH.is_file():
        messages.append(f"FAIL: {PROJECT_SCOPE_PATH.relative_to(REPO_ROOT)} not found — cannot cross-check requirement coverage")
        return {}
    text = PROJECT_SCOPE_PATH.read_text(encoding="utf-8")
    statuses: dict[str, str] = {}
    single_id_re = re.compile(r"^REQ-(FUNC|NF)-(\d{3})$")
    for line in text.split("\n"):
        if "|" not in line:
            continue
        m = single_id_re.match(line.strip().strip("|").split("|")[0].strip())
        if not m:
            continue
        req_id = f"REQ-{m.group(1)}-{m.group(2)}"
        if req_id in statuses:
            continue
        if "EXCLUDED" in line:
            statuses[req_id] = "EXCLUDED"
        elif "IMPLEMENT" in line:
            statuses[req_id] = "IMPLEMENT"
    return statuses


def load_screen_contract(messages: list[str]) -> dict | None:
    if not SCREEN_CONTRACT_PATH.is_file():
        messages.append(f"FAIL: {SCREEN_CONTRACT_PATH.relative_to(REPO_ROOT)} not found")
        return None
    try:
        data = json.loads(SCREEN_CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        messages.append(f"FAIL: SCREEN_ROUTE_CONTRACT.json is not valid JSON: {exc}")
        return None
    return {s["screen_id"]: s for s in data.get("screens", [])}


def detail_file_path(task_id: str) -> Path:
    return TASKS_DIR / f"TASK-{task_id}.md"


def detail_text(task_id: str) -> str:
    p = detail_file_path(task_id)
    return p.read_text(encoding="utf-8") if p.is_file() else ""


# ------------------------------------------------------------------
# checks
# ------------------------------------------------------------------
def run_checks(tasks: list[dict], excluded_reqs: set[str], scope_statuses: dict[str, str],
                contract_screens: dict | None, results: Results) -> None:
    by_id = {t["id"]: t for t in tasks}
    all_ids = set(by_id.keys())

    # 1. Task List 구현 ID <-> 상세 Task 파일 1:1
    expected_files_names = {f"TASK-{tid}.md" for tid in all_ids}
    on_disk = {p.name for p in TASKS_DIR.glob("TASK-*.md")}
    missing = sorted(expected_files_names - on_disk)
    orphans = sorted(on_disk - expected_files_names)
    ok1 = not missing and not orphans
    detail1 = f"{len(all_ids)} task ids, {len(on_disk)} files on disk"
    if missing:
        detail1 += f"; missing detail files: {missing}"
    if orphans:
        detail1 += f"; orphan detail files: {orphans}"
    results.add(1, "Task List 구현 ID와 상세 Task 파일 1:1", ok1, detail1)

    # 2. 중복 Task ID 0
    seen: dict[str, int] = {}
    for t in tasks:
        seen[t["id"]] = seen.get(t["id"], 0) + 1
    dupes = sorted(tid for tid, c in seen.items() if c > 1)
    results.add(2, "중복 Task ID 0", not dupes, f"duplicates: {dupes}" if dupes else "no duplicates")

    # 3. Depends On 누락 0
    dangling = []
    for t in tasks:
        for d in t["depends_on_ids"]:
            if d not in all_ids:
                dangling.append((t["id"], d))
    results.add(3, "Depends On 누락 0", not dangling,
                f"dangling refs: {dangling}" if dangling else "all depends_on ids resolve")

    # 4. Dependency Cycle 0
    cycle_path = find_cycle(all_ids, {t["id"]: t["depends_on_ids"] for t in tasks})
    results.add(4, "Dependency Cycle 0", cycle_path is None,
                f"cycle found: {' -> '.join(cycle_path)}" if cycle_path else "no cycle (DFS over depends_on graph)")

    # 5. Screen 5개 모두 Page Owner 정확히 1개
    owners = [t for t in tasks if t["category"] == "PAGE_OWNER"]
    owners_by_screen: dict[str, dict] = {}
    dup_screen_owners = []
    for o in owners:
        s = o["screen"]
        if s in owners_by_screen:
            dup_screen_owners.append(s)
        owners_by_screen[s] = o
    missing_screens = sorted(EXPECTED_SCREEN_IDS - set(owners_by_screen.keys()))
    ok5 = len(owners) == 5 and not missing_screens and not dup_screen_owners
    results.add(5, "Screen 5개 모두 Page Owner 정확히 1개", ok5,
                f"{len(owners)} PAGE_OWNER tasks, missing screens: {missing_screens}, duplicate screens: {dup_screen_owners}")

    # 6. Route·Page Entry·Expected Files 일치
    mismatches = []
    if contract_screens is not None:
        for screen_id, owner in owners_by_screen.items():
            c = contract_screens.get(screen_id)
            if c is None:
                mismatches.append(f"{screen_id}: no contract entry")
                continue
            owner_route = owner["route"].strip("`")
            owner_entry = owner["page_entry"].strip("`")
            if owner_route != c.get("route"):
                mismatches.append(f"{owner['id']}: route {owner_route!r} != contract {c.get('route')!r}")
            if owner_entry != c.get("page_entry"):
                mismatches.append(f"{owner['id']}: page_entry {owner_entry!r} != contract {c.get('page_entry')!r}")
            dtext = detail_text(owner["id"])
            if c.get("page_entry") and c.get("page_entry") not in dtext:
                mismatches.append(f"{owner['id']}: detail file Expected Files does not contain contract page_entry {c.get('page_entry')!r}")
    else:
        mismatches.append("SCREEN_ROUTE_CONTRACT.json unavailable")
    results.add(6, "Route·Page Entry·Expected Files 일치", not mismatches,
                "; ".join(mismatches) if mismatches else "all 5 Page Owners match SCREEN_ROUTE_CONTRACT.json and their own detail file")

    # 7. Component-only Screen 0 (a screen with COMPONENT tasks but no Page Owner)
    component_screens = {t["screen"] for t in tasks if t["category"] == "COMPONENT" and t["screen"].startswith("SCR-")}
    orphan_screens = sorted(s for s in component_screens if s not in owners_by_screen)
    results.add(7, "Component-only Screen 0", not orphan_screens,
                f"screens with Components but no Page Owner: {orphan_screens}" if orphan_screens else "every Component screen has a Page Owner")

    # 8. SCR-001 Starter 제거 AC 존재
    scr001 = owners_by_screen.get("SCR-001")
    ok8 = False
    detail8 = "no PAGE_OWNER task for SCR-001"
    if scr001:
        text8 = detail_text(scr001["id"]).lower()
        ok8 = "starter" in text8 or "create-next-app" in text8
        detail8 = f"{scr001['id']} detail file {'contains' if ok8 else 'MISSING'} starter-template removal AC"
    results.add(8, "SCR-001 Starter 제거 AC 존재", ok8, detail8)

    # 9. SCR-003 세 탭 조립 AC 존재
    scr003 = owners_by_screen.get("SCR-003")
    ok9 = False
    detail9 = "no PAGE_OWNER task for SCR-003"
    if scr003:
        text9 = detail_text(scr003["id"])
        required_terms = ["항공", "숙소", "동행"]
        missing9 = [term for term in required_terms if term not in text9]
        ok9 = not missing9
        detail9 = f"{scr003['id']} detail file {'covers' if ok9 else 'is missing'} tab terms {missing9 or required_terms}"
    results.add(9, "SCR-003 세 탭 조립 AC 존재", ok9, detail9)

    # 10. SCR-005 역할별 상태 조립 AC 존재
    scr005 = owners_by_screen.get("SCR-005")
    ok10 = False
    detail10 = "no PAGE_OWNER task for SCR-005"
    if scr005:
        text10 = detail_text(scr005["id"])
        required_terms = ["Guest", "Member", "Admin"]
        missing10 = [term for term in required_terms if term not in text10]
        ok10 = not missing10
        detail10 = f"{scr005['id']} detail file {'covers' if ok10 else 'is missing'} role terms {missing10 or required_terms}"
    results.add(10, "SCR-005 역할별 상태 조립 AC 존재", ok10, detail10)

    # 11. DB Schema·RLS·Access·Seed Task 존재
    required_db_ids = ["DB-SCHEMA-BASE", "DB-RLS-BASE", "DB-ACCESS", "DB-SEED-BASE"]
    missing_db = [d for d in required_db_ids if d not in all_ids]
    results.add(11, "DB Schema·RLS·Access·Seed Task 존재", not missing_db,
                f"missing: {missing_db}" if missing_db else f"all present: {required_db_ids}")

    # 12. DB Table 범위가 6개 기본 테이블을 크게 넘지 않음
    db_task = by_id.get("DB-SCHEMA-BASE")
    ok12 = True
    detail12 = "DB-SCHEMA-BASE not found"
    if db_task:
        haystack = db_task["functional_ac"] + " " + detail_text("DB-SCHEMA-BASE")
        mentioned = set(re.findall(r"`([a-z_]+)`", haystack))
        table_like = {m for m in mentioned if "_" in m or m in CANONICAL_DB_TABLES}
        extra = sorted(table_like - CANONICAL_DB_TABLES)
        ok12 = len(extra) == 0
        detail12 = f"tables mentioned: {sorted(table_like)}; extra beyond the 6 canonical: {extra}"
    results.add(12, "DB Table 범위가 6개 기본 테이블을 크게 넘지 않음", ok12, detail12)

    # 13. 외부 입력 비저장 AC 존재 (flight/hotel non-transmission/non-storage)
    relevant_ids = [t["id"] for t in tasks if
                    any(k in t["title"] for k in ("항공", "숙소", "Flight", "Hotel")) or
                    any(r in t["req_ids"] for r in ("REQ-FUNC-017", "REQ-FUNC-025", "REQ-NF-017"))]
    no_storage_markers = [
        "저장하지 않", "미저장", "전달되지 않", "전송하지 않", "미전송", "나타나지 않", "노출되지 않",
        "not stored", "not sent", "not transmit",
    ]
    missing13 = []
    for tid in relevant_ids:
        text13 = t_functional_and_detail(by_id[tid])
        if not any(marker in text13 for marker in no_storage_markers):
            missing13.append(tid)
    results.add(13, "외부 입력 비저장 AC 존재", not missing13,
                f"{len(relevant_ids)} flight/hotel-related tasks checked; missing the constraint: {missing13}" if missing13
                else f"{len(relevant_ids)} flight/hotel-related tasks all state the non-storage/non-transmission constraint")

    # 14. Auth·성인·기본 RLS AC 존재
    rls_task = by_id.get("DB-RLS-BASE")
    ok14 = False
    detail14 = "DB-RLS-BASE not found"
    if rls_task:
        text14 = t_functional_and_detail(rls_task)
        rls_ok = "RLS" in text14
        adult_covered = any("성인" in t_functional_and_detail(t) for t in tasks)
        auth_covered = any(("Auth" in t_functional_and_detail(t)) or ("인증" in t_functional_and_detail(t)) for t in tasks)
        ok14 = rls_ok and adult_covered and auth_covered
        detail14 = (f"DB-RLS-BASE mentions RLS: {rls_ok}; some task states adult-verification AC: {adult_covered}; "
                    f"some task states auth AC: {auth_covered}")
    results.add(14, "Auth·성인·기본 RLS AC 존재", ok14, detail14)

    # 15. Playwright Chromium Smoke Task 존재
    negation_markers = ["않", "금지", "forbid", "never", "제외", "no ", "not "]
    e2e_tasks = [t for t in tasks if t["category"] == "E2E_TEST"]
    bad_e2e = []
    for t in e2e_tasks:
        combined = (t["title"] + " " + detail_text(t["id"])).lower()
        if "chromium" not in combined or "smoke" not in combined:
            bad_e2e.append(t["id"])
        for line in combined.split("\n"):
            for bad in FORBIDDEN_PLAYWRIGHT_SCOPE:
                if bad in line and not any(neg in line for neg in negation_markers):
                    bad_e2e.append(f"{t['id']} (forbidden scope: {bad})")
    ok15 = bool(e2e_tasks) and not bad_e2e
    results.add(15, "Playwright Chromium Smoke Task 존재", ok15,
                f"{len(e2e_tasks)} E2E_TEST task(s): {[t['id'] for t in e2e_tasks]}; issues: {bad_e2e}" if bad_e2e
                else f"{len(e2e_tasks)} E2E_TEST task(s), all Chromium-only smoke: {[t['id'] for t in e2e_tasks]}")

    # 16. AWS·EC2·자동 Merge 구현 Task 0
    offenders = []
    for t in tasks:
        haystack = " ".join([t["id"], t["title"], t["category"], t["screen"]]).lower()
        for kw in FORBIDDEN_KEYWORDS:
            if kw in haystack:
                offenders.append((t["id"], kw))
    results.add(16, "AWS·EC2·자동 Merge 구현 Task 0", not offenders,
                f"offenders: {offenders}" if offenders else "no forbidden infra keyword found")

    # 17. REQ-FUNC 80개 + REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재
    all_func = [f"REQ-FUNC-{i:03d}" for i in range(1, 81)]
    all_nf = [f"REQ-NF-{i:03d}" for i in range(1, 35)]
    all_114 = all_func + all_nf
    referenced: dict[str, list[str]] = {}
    for t in tasks:
        for r in t["req_ids"]:
            referenced.setdefault(r, []).append(t["id"])
    covered_or_excluded = []
    uncovered = []
    for r in all_114:
        if r in referenced or r in excluded_reqs:
            covered_or_excluded.append(r)
        else:
            uncovered.append(r)
    results.add(17, "REQ-FUNC 80개 + REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재", not uncovered,
                f"114/114 accounted for" if not uncovered else f"missing from both Task List and EXCLUDED table: {uncovered}")

    # 18. EXCLUDED 상세 구현 파일이 생성되지 않음
    excluded_with_task = sorted(r for r in excluded_reqs if r in referenced)
    results.add(18, "EXCLUDED 상세 구현 파일이 생성되지 않음", not excluded_with_task,
                f"EXCLUDED reqs wrongly referenced by a task: {[(r, referenced[r]) for r in excluded_with_task]}" if excluded_with_task
                else f"none of the {len(excluded_reqs)} EXCLUDED requirements are referenced by any Task")

    # cross-check §4 EXCLUDED table against docs/PROJECT_SCOPE.md, informational
    scope_excluded = {r for r, s in scope_statuses.items() if s == "EXCLUDED"}
    if scope_excluded and scope_excluded != excluded_reqs:
        only_in_scope = sorted(scope_excluded - excluded_reqs)
        only_in_tasklist = sorted(excluded_reqs - scope_excluded)
        results.checks.append((0, "(informational) TASKS/00_TASK_LIST.md §4 vs docs/PROJECT_SCOPE.md EXCLUDED set", True,
                                f"only in PROJECT_SCOPE.md: {only_in_scope}; only in 00_TASK_LIST.md §4: {only_in_tasklist}"))


def t_functional_and_detail(t: dict) -> str:
    return t["functional_ac"] + " " + t.get("security_ac", "") + " " + detail_text(t["id"])


def find_cycle(all_ids: set[str], edges: dict[str, list[str]]) -> list[str] | None:
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in all_ids}
    path: list[str] = []

    def dfs(node: str) -> list[str] | None:
        color[node] = GRAY
        path.append(node)
        for nxt in edges.get(node, []):
            if nxt not in all_ids:
                continue  # dangling refs are reported by check 3, not here
            if color[nxt] == GRAY:
                cycle_start = path.index(nxt)
                return path[cycle_start:] + [nxt]
            if color[nxt] == WHITE:
                result = dfs(nxt)
                if result:
                    return result
        path.pop()
        color[node] = BLACK
        return None

    for tid in sorted(all_ids):
        if color[tid] == WHITE:
            result = dfs(tid)
            if result:
                return result
    return None


# ------------------------------------------------------------------
# output writers
# ------------------------------------------------------------------
def write_manifest(tasks: list[dict]) -> None:
    fieldnames = ["seq", "id", "title", "category", "impl_status", "req_ref", "screen",
                  "route", "page_entry", "depends_on", "expected_files", "verify", "priority"]
    with open(MANIFEST_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for t in sorted(tasks, key=lambda x: int(x["seq"])):
            writer.writerow({k: t[k] for k in fieldnames})


def write_report(results: Results, tasks: list[dict], excluded_reqs: set[str]) -> None:
    lines = []
    lines.append("# Task Audit Report")
    lines.append("")
    lines.append(f"**Source:** `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md` ({len(tasks)} tasks), "
                  f"`docs/PROJECT_SCOPE.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`")
    lines.append("")
    lines.append("## Checks")
    lines.append("")
    lines.append("| # | Check | Result | Detail |")
    lines.append("|---|---|---|---|")
    for num, name, passed, detail in results.checks:
        if num == 0:
            mark = "INFO"
        else:
            mark = "PASS" if passed else "FAIL"
        detail_short = detail if len(detail) <= 300 else detail[:297] + "..."
        num_disp = "—" if num == 0 else num
        lines.append(f"| {num_disp} | {name} | {mark} | {detail_short} |")
    lines.append("")

    real_checks = [c for c in results.checks if c[0] != 0]
    passed_count = sum(1 for c in real_checks if c[2])
    failed_count = len(real_checks) - passed_count
    lines.append("## Summary")
    lines.append("")
    lines.append(f"- Total checks: {len(real_checks)}")
    lines.append(f"- Passed: {passed_count}")
    lines.append(f"- Failed: {failed_count}")
    lines.append(f"- Task count: {len(tasks)}")
    lines.append(f"- EXCLUDED requirement count: {len(excluded_reqs)}")
    lines.append(f"- **RESULT: {'AUDIT_PASS' if failed_count == 0 else 'AUDIT_FAIL'}**")
    lines.append("")

    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


# ------------------------------------------------------------------
# main
# ------------------------------------------------------------------
def main() -> int:
    messages: list[str] = []
    results = Results()

    tasks = parse_task_list(messages)
    excluded_reqs = parse_excluded_table(messages)
    scope_statuses = parse_project_scope_statuses(messages)
    contract_screens = load_screen_contract(messages)

    print("=== audit_tasks.py ===")
    for m in messages:
        print(m)

    if not tasks:
        print("RESULT: FAIL — no tasks parsed from TASKS/00_TASK_LIST.md")
        return 1

    run_checks(tasks, excluded_reqs, scope_statuses, contract_screens, results)

    for num, name, passed, detail in results.checks:
        if num == 0:
            print(f"INFO: {name}: {detail}")
            continue
        tag = "OK  " if passed else "FAIL"
        print(f"{tag}: [{num}] {name} — {detail}")

    write_manifest(tasks)
    write_report(results, tasks, excluded_reqs)
    print(f"Wrote: {MANIFEST_PATH.relative_to(REPO_ROOT)}")
    print(f"Wrote: {REPORT_PATH.relative_to(REPO_ROOT)}")

    real_checks = [c for c in results.checks if c[0] != 0]
    failed = [c for c in real_checks if not c[2]]
    print("---")
    print(f"검사 수: {len(real_checks)}, 실패: {len(failed)}")
    if not failed:
        print("AUDIT_PASS")
        return 0
    print("AUDIT_FAIL")
    return 1


if __name__ == "__main__":
    for _stream in (sys.stdout, sys.stderr):
        if hasattr(_stream, "reconfigure"):
            _stream.reconfigure(encoding="utf-8")
    sys.exit(main())
