#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
check_screen_contract.py

Screen/Route Contract Guard for the Free Traveler pipeline. Validates that
the 5 fixed Screens (SCR-001..SCR-005) stay exactly as defined in
`design-reference/SCREEN_ROUTE_CONTRACT.json`, that `TASKS/TASK_MANIFEST.csv`
assigns each Screen exactly one Page Owner Task, that technical Routes are
never miscounted as user Screens, that SCR-003 covers both 여행 입력 and
동행 작성, and (depending on --mode) that the implementation on disk and the
Preview Checkpoint records match.

Inputs (read-only):
  - design-reference/SCREEN_ROUTE_CONTRACT.json
  - TASKS/TASK_MANIFEST.csv
  - src/app/ (mode=ci / mode=release only)
  - docs/preview-checks/SCR-00N.md (mode=release only)

Modes:
  --mode=plan     Page Owner Task 배정과 경로 계획만 검사 (파일시스템 미검사)
  --mode=ci       plan 검사 + 구현된 Page 파일 존재 + src/app 공개 경로 스캔
  --mode=release  ci 검사 + docs/preview-checks/SCR-001.md..SCR-005.md 존재 확인

Exit code: 0 on SCREEN_CONTRACT_PASS, 1 on any failed check.
No third-party dependencies — stdlib only.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SCREEN_CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = REPO_ROOT / "TASKS" / "TASK_MANIFEST.csv"
SRC_APP_DIR = REPO_ROOT / "src" / "app"
PREVIEW_CHECKS_DIR = REPO_ROOT / "docs" / "preview-checks"

FIXED_SCREENS: dict[str, str] = {
    "SCR-001": "/",
    "SCR-002": "/about",
    "SCR-003": "/travel-tools",
    "SCR-004": "/mates",
    "SCR-005": "/account",
}

# 기술 경로 — 5개 화면 수에 포함하지 않는다.
ALLOWED_TECHNICAL_ROUTE_PREFIXES = ("/auth/callback", "/api/")
ALLOWED_TECHNICAL_ROUTE_EXACT = {"not-found", "not_found", "error_boundary"}

# 여행지 상세 / 안전정보(국가별)는 SCR-001 Drawer 컴포넌트로만 존재해야 하며,
# 별도 Page(경로 segment)로 만들면 안 된다. `safety-guide`(안전수칙 정적 페이지,
# C-GLOBAL-POLICY-SAFETY-GUIDE)는 별개 개념이므로 예외로 둔다.
FORBIDDEN_PAGE_SEGMENTS = [
    re.compile(r"^destinations?$"),
    re.compile(r"^destination-detail$"),
    re.compile(r"^countries$"),
    re.compile(r"^country-safety$"),
    re.compile(r"^safety-detail$"),
    re.compile(r"^safety-info$"),
    re.compile(r"^safety$"),
]
ALLOWED_SAFETY_SEGMENT = "safety-guide"

MODES = ["plan", "ci", "release"]


def reconfigure_streams() -> None:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")


class Report:
    def __init__(self, mode: str) -> None:
        self.mode = mode
        self.checks: list[tuple[int, str, bool, str]] = []
        self.errors: list[str] = []

    def check(self, num: int, name: str, passed: bool, detail: str) -> None:
        self.checks.append((num, name, passed, detail))

    def error(self, file: str, screen_id: str, message: str, hint: str) -> None:
        self.errors.append(
            f"FAIL: file={file} | screen={screen_id} | {message} | Hint: {hint}"
        )

    @property
    def ok(self) -> bool:
        return all(c[2] for c in self.checks) and not self.errors


# ------------------------------------------------------------------
# loaders
# ------------------------------------------------------------------
def load_contract(r: Report) -> dict | None:
    if not SCREEN_CONTRACT_PATH.is_file():
        r.error(
            str(SCREEN_CONTRACT_PATH.relative_to(REPO_ROOT)), "N/A",
            "SCREEN_ROUTE_CONTRACT.json이 없다",
            "design-reference/SCREEN_ROUTE_CONTRACT.json을 정본대로 복원한다",
        )
        return None
    try:
        return json.loads(SCREEN_CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        r.error(
            str(SCREEN_CONTRACT_PATH.relative_to(REPO_ROOT)), "N/A",
            f"JSON 파싱 실패: {exc}",
            "JSON 문법 오류를 수정한다",
        )
        return None


def split_screens_cell(raw: str) -> list[str]:
    return [s.strip() for s in re.split(r"[;,]\s*", raw or "") if s.strip().startswith("SCR-")]


def load_manifest(r: Report) -> list[dict]:
    if not MANIFEST_PATH.is_file():
        r.error(
            str(MANIFEST_PATH.relative_to(REPO_ROOT)), "N/A",
            "TASK_MANIFEST.csv가 없다",
            "scripts/audit_tasks.py를 먼저 실행해 TASK_MANIFEST.csv를 생성한다",
        )
        return []
    rows: list[dict] = []
    with open(MANIFEST_PATH, encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            row["screen_ids"] = split_screens_cell(row.get("screen", ""))
            rows.append(row)
    return rows


# ------------------------------------------------------------------
# checks
# ------------------------------------------------------------------
def check_1_fixed_screens(contract: dict, r: Report) -> list[dict]:
    screens = contract.get("screens", [])
    by_id = {s.get("screen_id"): s for s in screens}
    missing = sorted(set(FIXED_SCREENS) - set(by_id))
    extra = sorted(set(by_id) - set(FIXED_SCREENS))
    route_mismatches = [
        f"{sid}: route {by_id[sid].get('route')!r} != {route!r}"
        for sid, route in FIXED_SCREENS.items()
        if sid in by_id and by_id[sid].get("route") != route
    ]
    ok = not missing and not extra and not route_mismatches and len(screens) == 5
    if missing:
        for sid in missing:
            r.error(
                str(SCREEN_CONTRACT_PATH.relative_to(REPO_ROOT)), sid,
                "고정 화면이 SCREEN_ROUTE_CONTRACT.json에 없다",
                f"{sid} ({FIXED_SCREENS[sid]}) Screen 항목을 추가한다",
            )
    if extra:
        for sid in extra:
            r.error(
                str(SCREEN_CONTRACT_PATH.relative_to(REPO_ROOT)), sid,
                "정의되지 않은 6번째 이상의 화면이 존재한다",
                "고정 화면 5개(SCR-001~005) 밖의 Screen 항목을 제거하거나 병합한다",
            )
    if route_mismatches:
        for m in route_mismatches:
            r.error(
                str(SCREEN_CONTRACT_PATH.relative_to(REPO_ROOT)), m.split(":")[0],
                f"Route 불일치: {m}",
                "고정 Route 표( SCR-001 `/`, SCR-002 `/about`, SCR-003 `/travel-tools`, "
                "SCR-004 `/mates`, SCR-005 `/account` )와 일치시킨다",
            )
    r.check(1, "고정 화면 5개가 정확히 존재한다", ok,
            f"contract screens: {sorted(by_id)}" if by_id else "no screens found")
    return screens


def check_2_page_owner_exactly_one(tasks: list[dict], r: Report) -> dict[str, dict]:
    owners_by_screen: dict[str, list[dict]] = {sid: [] for sid in FIXED_SCREENS}
    for t in tasks:
        if t.get("category") != "PAGE_OWNER":
            continue
        for sid in t["screen_ids"]:
            if sid in owners_by_screen:
                owners_by_screen[sid].append(t)

    ok = True
    for sid, owners in owners_by_screen.items():
        if len(owners) == 0:
            ok = False
            r.error(
                str(MANIFEST_PATH.relative_to(REPO_ROOT)), sid,
                "Page Owner Task가 하나도 없다",
                f"{sid}용 PAGE_OWNER Task(예: PAGE-{sid.replace('SCR-', 'SCR')})를 TASK_MANIFEST.csv에 추가한다",
            )
        elif len(owners) > 1:
            ok = False
            r.error(
                str(MANIFEST_PATH.relative_to(REPO_ROOT)), sid,
                f"Page Owner Task가 {len(owners)}개로 중복된다: {[o['id'] for o in owners]}",
                "화면당 Page Owner Task를 정확히 1개로 합친다",
            )
    r.check(2, "각 화면 Page Owner Task가 정확히 하나다", ok,
            "; ".join(f"{sid}={len(v)}" for sid, v in owners_by_screen.items()))
    return {sid: v[0] for sid, v in owners_by_screen.items() if len(v) == 1}


def check_3_technical_routes_not_counted(contract: dict, tasks: list[dict], r: Report) -> None:
    tech = contract.get("technical_routes", {})
    tech_routes: set[str] = set()
    for group in ("auth_callback", "api_routes"):
        for item in tech.get(group, []):
            if item.get("route"):
                tech_routes.add(item["route"])
    for group in ("error_boundaries",):
        for item in tech.get(group, []):
            if item.get("route"):
                tech_routes.add(item["route"])

    screen_routes = {s.get("route") for s in contract.get("screens", [])}
    collisions = sorted(tech_routes & screen_routes)

    # Only a PAGE_OWNER Task's OWN route matters here — an API/DB Task may
    # legitimately list a technical route as its own `route` while also being
    # *consumed by* one or more Screens (its `screen` column), which is a
    # usage relationship, not a claim that the technical route IS a Screen.
    manifest_bad = []
    for t in tasks:
        if t.get("category") != "PAGE_OWNER":
            continue
        route = (t.get("route") or "").strip("`")
        if route in ALLOWED_TECHNICAL_ROUTE_EXACT or any(
            route.startswith(p) for p in ALLOWED_TECHNICAL_ROUTE_PREFIXES
        ):
            for sid in t["screen_ids"] or ["N/A"]:
                manifest_bad.append((t["id"], sid, route))

    ok = not collisions and not manifest_bad
    if collisions:
        for c in collisions:
            r.error(
                str(SCREEN_CONTRACT_PATH.relative_to(REPO_ROOT)), "N/A",
                f"기술 경로 {c!r}가 Screen route와 충돌한다",
                "technical_routes와 screens[].route가 겹치지 않게 분리한다",
            )
    if manifest_bad:
        for tid, sid, route in manifest_bad:
            r.error(
                str(MANIFEST_PATH.relative_to(REPO_ROOT)), sid,
                f"Task {tid}가 기술 경로 {route!r}를 화면 {sid}로 계산한다",
                "기술 경로(Task screen 값)를 N/A(기술 Route)로 바꾸고 화면 카운트에서 제외한다",
            )
    r.check(3, "기술 경로를 사용자 화면으로 세지 않는다", ok,
            f"technical routes: {sorted(tech_routes)}")


def scan_app_page_files() -> list[Path]:
    if not SRC_APP_DIR.is_dir():
        return []
    return sorted(SRC_APP_DIR.rglob("page.tsx"))


def is_forbidden_detail_page(rel_path: Path) -> bool:
    parts = rel_path.parts  # relative to src/app, e.g. ('destinations', '[id]', 'page.tsx')
    segments = [p for p in parts[:-1] if not (p.startswith("[") and p.endswith("]"))]
    for seg in segments:
        if seg == ALLOWED_SAFETY_SEGMENT:
            continue
        if any(pat.match(seg) for pat in FORBIDDEN_PAGE_SEGMENTS):
            return True
    return False


def check_4_no_new_detail_pages(tasks: list[dict], mode: str, r: Report) -> None:
    offenders: list[str] = []

    # Manifest-level (all modes): no PAGE_OWNER/COMPONENT row may declare a
    # page_entry under a forbidden destination/safety-detail path.
    for t in tasks:
        page_entry = (t.get("page_entry") or "").strip("`")
        if not page_entry.startswith("src/app/") or not page_entry.endswith("page.tsx"):
            continue
        rel = Path(page_entry[len("src/app/"):])
        if is_forbidden_detail_page(rel):
            offenders.append(f"manifest:{t['id']} -> {page_entry}")
            r.error(
                page_entry, t["screen_ids"][0] if t["screen_ids"] else "N/A",
                f"Task {t['id']}가 여행지 상세/안전정보를 새 Page로 계획한다",
                "여행지 상세·안전정보는 SCR-001의 Drawer 컴포넌트로만 구현하고 별도 page.tsx를 만들지 않는다",
            )

    # Filesystem-level (mode=ci / mode=release only): scan actual src/app tree.
    if mode in ("ci", "release"):
        for page_file in scan_app_page_files():
            rel = page_file.relative_to(SRC_APP_DIR)
            if is_forbidden_detail_page(rel):
                offenders.append(f"fs:{rel.as_posix()}")
                r.error(
                    f"src/app/{rel.as_posix()}", "SCR-001",
                    "여행지 상세/안전정보 전용 Page 파일이 실제로 생성되어 있다",
                    "해당 page.tsx를 삭제하고 SCR-001 Drawer 컴포넌트로 흡수한다",
                )

    r.check(4, "여행지 상세·안전정보를 새 Page로 만들지 않았다", not offenders,
            "no forbidden page" if not offenders else f"offenders: {offenders}")


def check_5_scr003_covers_both(tasks: list[dict], r: Report) -> None:
    scr003_ids = {t["id"] for t in tasks if "SCR-003" in t["screen_ids"]}
    has_travel_input = any(
        ("FLIGHT-FORM" in tid or "HOTEL-FORM" in tid) for tid in scr003_ids
    )
    has_mate_composer = any("MATE-COMPOSER" in tid for tid in scr003_ids)
    ok = has_travel_input and has_mate_composer
    if not has_travel_input:
        r.error(
            str(MANIFEST_PATH.relative_to(REPO_ROOT)), "SCR-003",
            "SCR-003에 여행 입력(항공/숙소) Task가 없다",
            "C-SCR003-FLIGHT-FORM / C-SCR003-HOTEL-FORM Task를 SCR-003에 배정한다",
        )
    if not has_mate_composer:
        r.error(
            str(MANIFEST_PATH.relative_to(REPO_ROOT)), "SCR-003",
            "SCR-003에 동행 작성 Task가 없다",
            "C-SCR003-MATE-COMPOSER Task를 SCR-003에 배정한다",
        )
    r.check(5, "SCR-003이 여행 입력과 동행 작성을 모두 포함한다", ok,
            f"travel_input={has_travel_input}, mate_composer={has_mate_composer}, tasks={sorted(scr003_ids)}")


def check_ci_page_files_exist(owners_by_screen: dict[str, dict], r: Report) -> None:
    missing = []
    for sid, owner in owners_by_screen.items():
        page_entry = (owner.get("page_entry") or "").strip("`")
        if not page_entry or not (REPO_ROOT / page_entry).is_file():
            missing.append((sid, page_entry))
            r.error(
                page_entry or "N/A", sid,
                "Page Owner의 구현된 page.tsx 파일이 디스크에 없다",
                f"{page_entry or FIXED_SCREENS.get(sid, '')} 파일을 구현하고 커밋한다",
            )
    r.check(6, "구현된 Page 파일이 존재한다 (mode=ci/release)", not missing,
            "all 5 page files exist" if not missing else f"missing: {missing}")


def check_release_preview_checkpoints(r: Report) -> None:
    missing = []
    for sid in FIXED_SCREENS:
        p = PREVIEW_CHECKS_DIR / f"{sid}.md"
        if not p.is_file():
            missing.append(sid)
            r.error(
                str(p.relative_to(REPO_ROOT)), sid,
                "Preview Checkpoint 기록 파일이 없다",
                f"사람이 Vercel Preview를 확인한 뒤 docs/preview-checks/{sid}.md를 작성한다",
            )
    r.check(7, "release 모드: Preview Checkpoint 5개 존재 (SCR-001..SCR-005)", not missing,
            "all 5 preview-check files exist" if not missing else f"missing: {missing}")


# ------------------------------------------------------------------
# main
# ------------------------------------------------------------------
def main() -> int:
    reconfigure_streams()
    parser = argparse.ArgumentParser(description="Screen/Route Contract Guard")
    parser.add_argument("--mode", choices=MODES, default="plan",
                         help="plan (기본값) | ci | release")
    args = parser.parse_args()

    r = Report(args.mode)
    print(f"=== check_screen_contract.py (mode={args.mode}) ===")

    contract = load_contract(r)
    tasks = load_manifest(r)

    if contract is not None:
        check_1_fixed_screens(contract, r)
    if tasks:
        owners_by_screen = check_2_page_owner_exactly_one(tasks, r)
    else:
        owners_by_screen = {}
    if contract is not None and tasks:
        check_3_technical_routes_not_counted(contract, tasks, r)
    if tasks:
        check_4_no_new_detail_pages(tasks, args.mode, r)
        check_5_scr003_covers_both(tasks, r)

    if args.mode in ("ci", "release") and owners_by_screen:
        check_ci_page_files_exist(owners_by_screen, r)

    if args.mode == "release":
        check_release_preview_checkpoints(r)

    for num, name, passed, detail in r.checks:
        tag = "OK  " if passed else "FAIL"
        print(f"{tag}: [{num}] {name} — {detail}")
    if r.errors:
        print("---")
        for line in r.errors:
            print(line)

    print("---")
    if r.ok:
        print("SCREEN_CONTRACT_PASS")
        print(f"mode={args.mode}, 검사 수: {len(r.checks)}")
        return 0

    print("SCREEN_CONTRACT_FAIL")
    print(f"mode={args.mode}, 검사 수: {len(r.checks)}, 오류 수: {len(r.errors)}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
