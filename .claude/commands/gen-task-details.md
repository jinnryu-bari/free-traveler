---
description: Generate one detail Markdown file per Task in TASKS/00_TASK_LIST.md (1:1, at TASKS/TASK-<ID>.md)
---

Load the `traveler-project-pipeline` skill before doing anything else in this command.

**Pipeline-wide principles (apply to this command too):** use the `traveler-project-pipeline` skill; read the actual files on disk, never rely on memory; do not write any application/implementation code, Branch, or Commit — this command only produces `TASKS/TASK-<ID>.md` Task-definition documents; do not skip or soften an audit failure at the end of this command.

## Preconditions

- `TASKS/00_TASK_LIST.md` must already exist. If it does not, tell the user to run `/gen-tasklist` first and stop.
- Re-read `design-reference/UI_CONTRACT.md`, `design-reference/D-001/DESIGN.md`, and `docs/PROJECT_SCOPE.md` fresh — do not paraphrase from memory when filling in Acceptance Criteria; quote the actual Section order, minimum content counts, and implementation-method wording.

## Step 1 — Parse `TASKS/00_TASK_LIST.md` §2 and §4

Read the file and extract every §2 row (16 columns: Seq · Task ID · 제목 · Category · Implementation Status · Requirement Ref · Screen · Route · Page Entry · Depends On · Expected Files · Functional AC · Visual AC · Security/Privacy AC · Verify · Priority) and the §4 EXCLUDED table.

**Known source defect to watch for:** some `PAGE_OWNER` rows have been missing the Expected Files cell entirely in past edits (16 columns collapsing to 15), which silently shifts every cell after it. Before trusting a row, count its cells. If a `PAGE_OWNER` row is missing Expected Files, repair it using that row's own Page Entry cell (per the document's own §5 invariant: "모든 Page Owner의 Expected Files는 자신의 page_entry를 포함한다") and flag the repair to the user — this is a defect in `TASKS/00_TASK_LIST.md` worth fixing at the source, not just working around silently every time.

Do not generate a detail file for anything in the §4 EXCLUDED table — those requirement ids have no Task ID at all.

## Step 2 — For every §2 Task, write `TASKS/TASK-<ID>.md`

Use the detail file template in the skill (`SKILL.md` → "Detail file template", 14 sections in order: Context, Project Scope, Requirement Ref, Screen/Route/Page Entry, Design Ref, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Test Cases, Verify, Definition of Done, Forbidden).

Rules that apply per Category:

- **PAGE_OWNER**: Acceptance Criteria MUST include, sourced from `design-reference/D-001/DESIGN.md` §18:
  - The Screen's full Section order (e.g. SCR-004: Intro → Filter+결과요약 → 목록 → 상세(Split/Drawer) → 3단계 안내 → 안전 CTA).
  - Minimum content counts for that Screen's Cards/Timeline/Gallery/Chips (e.g. SCR-002 Timeline ≥6, Gallery ≥8, visited-country chips ≥30; SCR-001 destination grids = 6 cards each; SCR-004 list up to 8 cards + "더 보기").
  - A no-large-empty-region / no-placeholder rule: forbid "Lorem ipsum", "준비 중", "정보 확인 필요", visually empty cards.
  - For any Section that can legitimately have zero data, require the full 3-part Empty State: situation sentence + how-to-use/relax-condition sentence + CTA button — not a bare icon or single line.
  - `PAGE-SCR001` specifically: an explicit starter-template-removal Acceptance Criterion.
  - `PAGE-SCR003` specifically: explicit assembly of all three tabs — 항공/숙소/동행.
  - `PAGE-SCR005` specifically: explicit Guest/Member/Admin role assembly.
- **COMPONENT**: Acceptance Criteria reference the specific `UI_CONTRACT.md` component spec (states, Desktop/Mobile behavior) it implements, and the Depends On / parent Page Owner relationship.
- **DATA**: Acceptance Criteria specify the TypeScript shape under `src/data/`, minimum record counts where `docs/PROJECT_SCOPE.md` specifies them, and that no CMS/admin UI is implied.
- **DB**: Acceptance Criteria name only the 6 canonical tables relevant to that Task and state the RLS access rule from `docs/PROJECT_SCOPE.md` (e.g. REQ-FUNC-044).
- **API**: Acceptance Criteria name the exact route from `SCREEN_ROUTE_CONTRACT.json`'s `technical_routes.api_routes` and the request/response contract implied by the Task List row.
- **UNIT_TEST / INTEGRATION_TEST**: Acceptance Criteria state what pure logic or integration scenario is covered, with no network/DB dependency for UNIT_TEST.
- **E2E_TEST**: Acceptance Criteria explicitly say "Chromium" and "Smoke", name the Playwright config file it depends on, and explicitly rule out Firefox/WebKit/visual-regression/load-test scope (state the exclusion, don't just omit it — this is what audit check 15 looks for).
- **MANUAL_CHECK / RELEASE_CHECK**: Acceptance Criteria state the checklist is self-attested (no code file), and what evidence closes it out.

Every detail file's **Forbidden** section must explicitly name any `EXCLUDED` requirement id that touches the same area (see the `EXCLUDED_BY_AREA` grouping pattern already used for this — content/CMS, search, moderation, account privacy, rate limiting, audit log, perf monitoring, a11y automation), so nobody mistakenly implements it later, plus a blanket statement that this Task does not create implementation code/branch/commit and does not violate `design-reference/D-001/DESIGN.md` §20 Do Not.

Every detail file's **Expected Files** section must state that no file outside that list is created or modified by this Task.

## Step 3 — Verify 1:1 coverage

After writing files, confirm every §2 Task ID has exactly one file at `TASKS/TASK-<ID>.md`, and that no extra `TASKS/TASK-*.md` file exists without a matching §2 row. If a mismatch exists, fix it before proceeding — do not leave orphans, and do not leave a §2 row undocumented.

## Step 4 — Run the audit

Run:

```
python scripts/audit_tasks.py
```

This is mandatory — a Task-detail generation run is not complete until this exits 0 (`AUDIT_PASS`). If it fails, fix the flagged `TASKS/00_TASK_LIST.md` row or `TASKS/TASK-<ID>.md` detail file and re-run — do not report completion while `scripts/audit_tasks.py` exits non-zero, and do not tell the user the work is "done" based on Step 3's manual check alone. Report the final audit output (all 18 checks) to the user, and note that `TASKS/TASK_MANIFEST.csv` and `TASKS/TASK_AUDIT_REPORT.md` were (re)written as a side effect.
