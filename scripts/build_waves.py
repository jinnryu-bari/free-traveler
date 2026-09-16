#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
build_waves.py

Splits the 76-Task graph in TASKS/TASK_MANIFEST.csv into Waves and writes the
static Wave/Task assignment that `/prepare-task` and `/run-wave` read from.
This script never touches application code — it only reads Task metadata and
writes Wave-planning documents.

Inputs (read-only):
  - TASKS/TASK_MANIFEST.csv                      (Task metadata: category, screen,
                                                    depends_on, expected_files)
  - TASKS/TASK-*.md                               (detail files; read only to confirm
                                                    each manifest row has one, not parsed
                                                    for content — TASK_MANIFEST.csv is the
                                                    structured source for this script)
  - design-reference/SCREEN_ROUTE_CONTRACT.json   (canonical SCR-00N ids, for validating
                                                    the manifest's `screen` column)

Outputs (written by this script):
  - TASKS/TASK_DAG.md          (full dependency graph: per-Task deps/dependents,
                                  global topological order, cycle count)
  - TASKS/WAVE_PLAN.md         (static Wave list + Task assignment — read by
                                  `/prepare-task` Check 2 and `/run-wave`)
  - TASKS/WAVE_STATE.json      (initial dynamic Wave/Task status ledger)
  - TASKS/TASK_MANIFEST.csv    (rewritten in place with an added `wave_id` column)

NOTE ON FORMAT: `.claude/commands/run-wave.md` and `.claude/commands/prepare-task.md`,
as written before this script existed, describe `TASKS/WAVE_STATE.md` as a Markdown
table. This script produces `TASKS/WAVE_STATE.json` instead, per this run's explicit
spec. The two command files have not been updated to match — that is a known follow-up,
not something this script silently papers over. See this script's own final report.

Exit code: 0 on success (0 cycles, every Task assigned to a Wave, no ordering
violation). 1 if a dependency cycle is found or a Wave-ordering violation would
result — in either case no output file is written.
No third-party dependencies — stdlib only.
"""

from __future__ import annotations

import csv
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = REPO_ROOT / "TASKS"
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
SCREEN_CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
DAG_PATH = TASKS_DIR / "TASK_DAG.md"
WAVE_PLAN_PATH = TASKS_DIR / "WAVE_PLAN.md"
WAVE_STATE_PATH = TASKS_DIR / "WAVE_STATE.json"

WAVE_STATE_SCHEMA = "traveler-wave-state-v1"
MIN_WAVE_SIZE = 4
MAX_WAVE_SIZE = 7

# The 10 Wave Group definitions, in the fixed order given for this run. Group 1
# ("Scaffold, 문서, Harness 확인") has no dedicated Task ID in the current 76-Task
# set — that groundwork (CLAUDE.md, the Skill, scripts/validate_harness.py, etc.)
# was produced directly, outside the Task pipeline, in an earlier step of this
# project. This script does not invent a Task to fill Group 1; it reports the
# group as empty rather than fabricating coverage.
GROUP_TITLES = {
    1: "Scaffold, 문서, Harness 확인",
    2: "Airbnb 스타일 공통 UI, 정적 데이터, Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS",
    4: "SCR-001 메인 Component와 Page Owner",
    5: "SCR-002 대표 소개 Component와 Page Owner",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner",
    7: "SCR-004 동행 목록·상세·신청 Component와 Page Owner",
    8: "SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}
SCREEN_TO_GROUP = {"SCR-001": 4, "SCR-002": 5, "SCR-003": 6, "SCR-004": 7, "SCR-005": 8}


# ------------------------------------------------------------------
# manifest parsing
# ------------------------------------------------------------------
def split_ids(raw: str) -> list[str]:
    raw = (raw or "").strip()
    if raw in ("", "없음", "N/A"):
        return []
    parts = re.split(r"[;,]\s*", raw)
    return [p.strip("` ") for p in parts if p.strip() and p.strip() not in ("없음", "N/A")]


def split_files(raw: str) -> list[str]:
    raw = (raw or "").strip()
    if not raw or raw.startswith("없음"):
        return []
    parts = re.split(r",\s*(?=`)", raw)
    out = []
    for p in parts:
        p = p.strip()
        m = re.search(r"`([^`]+)`", p)
        if m:
            out.append(m.group(1))
    return out


def single_screen(raw: str) -> str | None:
    """Return the one SCR-00N this task belongs to, or None for GLOBAL / N/A /
    multi-screen (cross-cutting) rows — those are grouped by category rules
    instead of by screen."""
    ids = re.findall(r"SCR-\d{3}", raw or "")
    uniq = sorted(set(ids))
    return uniq[0] if len(uniq) == 1 else None


def load_manifest() -> list[dict]:
    if not MANIFEST_PATH.is_file():
        print(f"FAIL: {MANIFEST_PATH.relative_to(REPO_ROOT)} not found — run scripts/audit_tasks.py first")
        return []
    rows = []
    with open(MANIFEST_PATH, encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for r in reader:
            r["seq"] = int(r["seq"])
            r["depends_on_ids"] = split_ids(r.get("depends_on", ""))
            r["expected_files_list"] = split_files(r.get("expected_files", ""))
            r["single_screen"] = single_screen(r.get("screen", ""))
            rows.append(r)
    return rows


def load_screen_ids() -> set[str]:
    if not SCREEN_CONTRACT_PATH.is_file():
        return set(SCREEN_TO_GROUP.keys())
    try:
        data = json.loads(SCREEN_CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return set(SCREEN_TO_GROUP.keys())
    return {s["screen_id"] for s in data.get("screens", [])}


# ------------------------------------------------------------------
# cycle detection (same DFS approach as scripts/audit_tasks.py)
# ------------------------------------------------------------------
def find_cycle(all_ids: set[str], edges: dict[str, list[str]]) -> list[str] | None:
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in all_ids}
    path: list[str] = []

    def dfs(node: str) -> list[str] | None:
        color[node] = GRAY
        path.append(node)
        for nxt in edges.get(node, []):
            if nxt not in all_ids:
                continue
            if color[nxt] == GRAY:
                start = path.index(nxt)
                return path[start:] + [nxt]
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


def kahn_order(node_ids: list[str], edges: dict[str, list[str]]) -> list[str]:
    """Stable topological sort restricted to `node_ids`, considering only
    edges whose both endpoints are in `node_ids`. Ties broken by the order
    `node_ids` was given in (which callers pass pre-sorted by manifest seq)."""
    node_set = set(node_ids)
    indegree = {n: 0 for n in node_ids}
    deps_of = {n: [d for d in edges.get(n, []) if d in node_set] for n in node_ids}
    dependents_of: dict[str, list[str]] = {n: [] for n in node_ids}
    for n in node_ids:
        for d in deps_of[n]:
            indegree[n] += 1
            dependents_of[d].append(n)

    order_index = {n: i for i, n in enumerate(node_ids)}
    ready = sorted([n for n in node_ids if indegree[n] == 0], key=lambda n: order_index[n])
    result: list[str] = []
    while ready:
        ready.sort(key=lambda n: order_index[n])
        node = ready.pop(0)
        result.append(node)
        for dep in dependents_of[node]:
            indegree[dep] -= 1
            if indegree[dep] == 0:
                ready.append(dep)
    return result


# ------------------------------------------------------------------
# grouping
# ------------------------------------------------------------------
def assign_groups(tasks: list[dict]) -> dict[str, int]:
    by_id = {t["id"]: t for t in tasks}
    dependents: dict[str, list[str]] = {t["id"]: [] for t in tasks}
    for t in tasks:
        for d in t["depends_on_ids"]:
            dependents.setdefault(d, []).append(t["id"])

    group: dict[str, int] = {}
    deferred_api: list[str] = []

    for t in tasks:
        tid, cat, screen = t["id"], t["category"], t["single_screen"]
        if cat == "DATA":
            group[tid] = 2
        elif cat == "COMPONENT" and screen is None:
            # GLOBAL components (SEO helper, toast, not-found, error boundary,
            # nav/footer extension, policy pages) — shared layout/UI, Group 2.
            group[tid] = 2
        elif cat == "DB":
            group[tid] = 3
        elif tid == "API-AUTH-CALLBACK":
            group[tid] = 3
        elif cat in ("PAGE_OWNER", "COMPONENT") and screen in SCREEN_TO_GROUP:
            group[tid] = SCREEN_TO_GROUP[screen]
        elif cat == "API":
            deferred_api.append(tid)
        elif cat in ("UNIT_TEST", "INTEGRATION_TEST", "E2E_TEST", "MANUAL_CHECK"):
            group[tid] = 9
        elif cat == "RELEASE_CHECK":
            group[tid] = 9 if tid == "RELEASE-CI-GATES" else 10
        else:
            # Should not happen given the 10 known categories; fail loudly
            # rather than silently mis-placing a Task.
            raise ValueError(f"{tid}: unrecognized category {cat!r} / screen {t.get('screen')!r} for grouping")

    # API tasks (other than AUTH-CALLBACK): placed in the earliest Screen
    # group among their PAGE_OWNER/COMPONENT dependents, so the API Task's
    # own Wave always precedes every Wave that needs it (Rule 2). Falls back
    # to Group 9 if no such dependent exists yet.
    for tid in deferred_api:
        candidate_groups = [
            group[dep] for dep in dependents.get(tid, [])
            if dep in group and by_id[dep]["category"] in ("PAGE_OWNER", "COMPONENT")
            and group[dep] in SCREEN_TO_GROUP.values()
        ]
        group[tid] = min(candidate_groups) if candidate_groups else 9

    return group


# ------------------------------------------------------------------
# chunking (Rule 3: 4-7 Tasks per Wave; Rule 4: Page Owner last; Rule 5: file-conflict split)
# ------------------------------------------------------------------
def chunk_sizes(n: int) -> list[int]:
    if n == 0:
        return []
    if n <= MAX_WAVE_SIZE:
        return [n]
    for size in range(MAX_WAVE_SIZE, MIN_WAVE_SIZE - 1, -1):
        full, rem = divmod(n, size)
        if rem == 0:
            return [size] * full
        if rem >= MIN_WAVE_SIZE:
            return [size] * full + [rem]
    # Fallback (shouldn't trigger for n > MIN_WAVE_SIZE): one oversized chunk.
    return [n]


def split_by_file_conflict(chunk: list[dict]) -> list[list[dict]]:
    """Rule 5: if two Tasks in the same chunk both touch overlapping Expected
    Files, they cannot share a Wave — peel the later one into a follow-on
    sub-chunk (repeats until no chunk has an internal conflict)."""
    result: list[list[dict]] = []
    remaining = list(chunk)
    while remaining:
        current: list[dict] = []
        used_files: set[str] = set()
        leftover: list[dict] = []
        for t in remaining:
            files = set(t["expected_files_list"])
            if files & used_files:
                leftover.append(t)
            else:
                current.append(t)
                used_files |= files
        result.append(current)
        remaining = leftover
    return result


def build_group_waves(group_num: int, group_tasks: list[dict], edges: dict[str, list[str]]) -> list[list[dict]]:
    if not group_tasks:
        return []
    ordered_ids = kahn_order([t["id"] for t in sorted(group_tasks, key=lambda t: t["seq"])], edges)
    by_id = {t["id"]: t for t in group_tasks}
    ordered = [by_id[i] for i in ordered_ids]

    # Rule 4: each screen group's PAGE_OWNER task must be the group's last Task.
    owners = [t for t in ordered if t["category"] == "PAGE_OWNER"]
    if owners:
        non_owners = [t for t in ordered if t["category"] != "PAGE_OWNER"]
        ordered = non_owners + owners

    sizes = chunk_sizes(len(ordered))
    chunks: list[list[dict]] = []
    idx = 0
    for size in sizes:
        chunks.append(ordered[idx:idx + size])
        idx += size

    waves: list[list[dict]] = []
    for chunk in chunks:
        waves.extend(split_by_file_conflict(chunk))
    return waves


# ------------------------------------------------------------------
# global ordering validation (Rule 2)
# ------------------------------------------------------------------
def validate_wave_order(wave_of: dict[str, int], position_of: dict[str, int], edges: dict[str, list[str]]) -> list[str]:
    violations = []
    for tid, deps in edges.items():
        if tid not in wave_of:
            continue
        for d in deps:
            if d not in wave_of:
                continue  # dangling ref — not this script's job (see audit_tasks.py check 3)
            if wave_of[d] > wave_of[tid]:
                violations.append(f"{tid} (Wave {wave_of[tid]}) depends on {d} (Wave {wave_of[d]}) — dependency placed in a LATER Wave")
            elif wave_of[d] == wave_of[tid] and position_of[d] > position_of[tid]:
                violations.append(f"{tid} depends on {d} — both in Wave {wave_of[tid]} but {d} is ordered after {tid}")
    return violations


# ------------------------------------------------------------------
# writers
# ------------------------------------------------------------------
def write_dag(tasks: list[dict], edges: dict[str, list[str]], global_order: list[str], cycle: list[str] | None) -> None:
    by_id = {t["id"]: t for t in tasks}
    dependents: dict[str, list[str]] = {t["id"]: [] for t in tasks}
    for t in tasks:
        for d in t["depends_on_ids"]:
            if d in dependents:
                dependents[d].append(t["id"])

    lines = ["# Task Dependency Graph", "",
             f"**Source:** `TASKS/TASK_MANIFEST.csv` ({len(tasks)} tasks)", "",
             f"**Dependency cycles found:** {0 if cycle is None else 1}"]
    if cycle:
        lines.append(f"**Cycle:** {' -> '.join(cycle)}")
    lines += ["", "## Global topological order", "",
              "(one valid linear ordering of all 76 Tasks respecting every Depends On edge — "
              "informational; actual execution order within a Wave follows `TASKS/WAVE_PLAN.md`)", ""]
    for i, tid in enumerate(global_order, 1):
        lines.append(f"{i}. `{tid}`")
    lines += ["", "## Per-Task dependencies / dependents", "",
              "| Task ID | Category | Depends On | Depended On By |",
              "|---|---|---|---|"]
    for t in sorted(tasks, key=lambda x: x["seq"]):
        deps = ", ".join(f"`{d}`" for d in t["depends_on_ids"]) or "—"
        deps_by = ", ".join(f"`{d}`" for d in dependents.get(t["id"], [])) or "—"
        lines.append(f"| `{t['id']}` | {t['category']} | {deps} | {deps_by} |")
    lines.append("")
    DAG_PATH.write_text("\n".join(lines), encoding="utf-8")


def write_wave_plan(wave_records: list[dict]) -> None:
    lines = ["# Wave Plan", "",
             "Static Wave -> Task assignment, generated by `scripts/build_waves.py`. "
             "Canonical per `.claude/commands/run-wave.md` / `.claude/commands/prepare-task.md`. "
             "Do not hand-edit — re-run `scripts/build_waves.py` after `TASKS/TASK_MANIFEST.csv` changes.",
             "", "## Wave 목록", "", "| Wave ID | Preview Checkpoint | 설명 |", "|---|---|---|"]
    for w in wave_records:
        cp = "yes" if w["checkpoint_required"] else "no"
        lines.append(f"| {w['wave_id']} | {cp} | {w['title']} |")
    lines += ["", "## Task 배정", "", "| Wave ID | Task ID |", "|---|---|"]
    for w in wave_records:
        for tid in w["task_ids"]:
            lines.append(f"| {w['wave_id']} | {tid} |")
    lines.append("")
    group1_note = ("## 참고\n\n"
                    "Group 1(\"Scaffold, 문서, Harness 확인\")에 대응하는 Task가 `TASKS/TASK_MANIFEST.csv`에 "
                    "없어 이 그룹은 어떤 Wave에도 배정되지 않았다 — 해당 작업(CLAUDE.md, Skill, "
                    "`scripts/validate_harness.py` 등)은 이미 Task 파이프라인 밖에서 완료되어 있다.\n")
    lines.append(group1_note)
    WAVE_PLAN_PATH.write_text("\n".join(lines), encoding="utf-8")


def write_wave_state(wave_records: list[dict]) -> None:
    state = {
        "schema_version": WAVE_STATE_SCHEMA,
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "waves": [
            {
                "wave_id": w["wave_id"],
                "title": w["title"],
                "task_ids": w["task_ids"],
                "status": "pending",
                "checkpoint_required": w["checkpoint_required"],
                "checkpoint_result": None,
            }
            for w in wave_records
        ],
    }
    WAVE_STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def rewrite_manifest_with_wave_id(tasks: list[dict], wave_of: dict[str, int], wave_id_str: dict[str, str]) -> None:
    fieldnames = ["seq", "id", "title", "category", "impl_status", "req_ref", "screen",
                  "route", "page_entry", "depends_on", "expected_files", "verify", "priority", "wave_id"]
    with open(MANIFEST_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for t in sorted(tasks, key=lambda x: x["seq"]):
            row = {k: t[k] for k in fieldnames if k != "wave_id"}
            row["wave_id"] = wave_id_str.get(t["id"], "")
            writer.writerow(row)


# ------------------------------------------------------------------
# main
# ------------------------------------------------------------------
def main() -> int:
    print("=== build_waves.py ===")
    tasks = load_manifest()
    if not tasks:
        print("RESULT: FAIL — no tasks parsed from TASKS/TASK_MANIFEST.csv")
        return 1

    known_screens = load_screen_ids()
    unknown_screen_refs = sorted({t["single_screen"] for t in tasks
                                   if t["single_screen"] and t["single_screen"] not in known_screens})
    if unknown_screen_refs:
        print(f"WARN: screen id(s) not found in SCREEN_ROUTE_CONTRACT.json: {unknown_screen_refs}")

    all_ids = {t["id"] for t in tasks}
    edges = {t["id"]: t["depends_on_ids"] for t in tasks}

    cycle = find_cycle(all_ids, edges)
    if cycle:
        print(f"FAIL: dependency cycle found: {' -> '.join(cycle)}")
        print("순환 의존성 수: 1")
        print("RESULT: FAIL — no output written")
        return 1
    print("OK  : no dependency cycle")

    dangling = sorted({(t["id"], d) for t in tasks for d in t["depends_on_ids"] if d not in all_ids})
    if dangling:
        print(f"FAIL: dangling depends_on reference(s): {dangling}")
        print("RESULT: FAIL — no output written (run scripts/audit_tasks.py first)")
        return 1

    try:
        group_of = assign_groups(tasks)
    except ValueError as exc:
        print(f"FAIL: {exc}")
        return 1

    global_order = kahn_order([t["id"] for t in sorted(tasks, key=lambda t: t["seq"])], edges)

    by_id = {t["id"]: t for t in tasks}
    wave_records: list[dict] = []
    wave_counter = 0
    for group_num in sorted(GROUP_TITLES):
        group_tasks = sorted([t for t in tasks if group_of[t["id"]] == group_num], key=lambda t: t["seq"])
        group_waves = build_group_waves(group_num, group_tasks, edges)
        n_sub = len(group_waves)
        for sub_idx, wave_tasks in enumerate(group_waves, 1):
            wave_counter += 1
            wave_id = f"W{wave_counter:02d}"
            title = GROUP_TITLES[group_num]
            if n_sub > 1:
                title = f"{title} ({sub_idx}/{n_sub})"
            has_owner = any(t["category"] == "PAGE_OWNER" for t in wave_tasks)
            is_last_overall_candidate = (group_num == 10)  # confirmed after loop; placeholder here
            wave_records.append({
                "wave_id": wave_id,
                "group": group_num,
                "title": title,
                "task_ids": [t["id"] for t in wave_tasks],
                "checkpoint_required": has_owner,
            })

    if wave_records:
        wave_records[-1]["checkpoint_required"] = True  # final Wave = overall release checkpoint

    wave_of: dict[str, int] = {}
    position_of: dict[str, int] = {}
    wave_id_str: dict[str, str] = {}
    for idx, w in enumerate(wave_records, 1):
        for pos, tid in enumerate(w["task_ids"]):
            wave_of[tid] = idx
            position_of[tid] = pos
            wave_id_str[tid] = w["wave_id"]

    unassigned = sorted(all_ids - set(wave_of.keys()))
    if unassigned:
        print(f"FAIL: Task(s) not assigned to any Wave: {unassigned}")
        return 1

    violations = validate_wave_order(wave_of, position_of, edges)
    if violations:
        print("FAIL: Wave ordering violates Rule 2 (선행 Task가 뒤 Wave에 배치됨):")
        for v in violations:
            print(f"  - {v}")
        print("RESULT: FAIL — no output written")
        return 1
    print("OK  : every dependency's Wave <= its dependent's Wave (Rule 2 satisfied)")

    write_dag(tasks, edges, global_order, cycle)
    write_wave_plan(wave_records)
    write_wave_state(wave_records)
    rewrite_manifest_with_wave_id(tasks, wave_of, wave_id_str)

    print(f"Wrote: {DAG_PATH.relative_to(REPO_ROOT)}")
    print(f"Wrote: {WAVE_PLAN_PATH.relative_to(REPO_ROOT)}")
    print(f"Wrote: {WAVE_STATE_PATH.relative_to(REPO_ROOT)}")
    print(f"Wrote: {MANIFEST_PATH.relative_to(REPO_ROOT)} (added wave_id column)")

    print("---")
    print("순환 의존성 수: 0")
    print(f"Wave 수: {len(wave_records)}")
    for w in wave_records:
        print(f"  {w['wave_id']} [{w['title']}]: {len(w['task_ids'])} Task(s)" +
              (" — checkpoint required" if w["checkpoint_required"] else ""))
    print("Page Owner 위치:")
    for t in tasks:
        if t["category"] == "PAGE_OWNER":
            w = wave_records[wave_of[t["id"]] - 1]
            is_last = w["task_ids"][-1] == t["id"]
            print(f"  {t['id']}: {w['wave_id']} ({'마지막 Task' if is_last else 'WARNING: 마지막 Task 아님'})")
    if not any(group_of[t["id"]] == 1 for t in tasks):
        print("Group 1(Scaffold/문서/Harness)에 대응하는 Task 없음 — Wave 미생성 (TASKS/WAVE_PLAN.md 참고 섹션 참조)")

    print("BUILD_WAVES_PASS")
    return 0


if __name__ == "__main__":
    for _stream in (sys.stdout, sys.stderr):
        if hasattr(_stream, "reconfigure"):
            _stream.reconfigure(encoding="utf-8")
    sys.exit(main())
