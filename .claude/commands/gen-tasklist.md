---
description: Generate or update TASKS/00_TASK_LIST.md from the locked Free Traveler UI/UX contract
---

Load the `traveler-project-pipeline` skill before doing anything else in this command.

**Pipeline-wide principles (apply to this command too):** use the `traveler-project-pipeline` skill; read the actual files on disk (Read/Glob), never rely on memory of an earlier turn; do not write any application/implementation code — this command only produces `TASKS/00_TASK_LIST.md`, a Task-definition document; do not skip or soften a validation failure.

## Step 1 — Validate inputs

Run:

```
python scripts/validate_inputs.py
```

If it exits non-zero, **stop** and report the failures to the user. Do not write or update `TASKS/00_TASK_LIST.md` on a failed validation. Fix the underlying input doc/contract issue (or ask the user) and re-run validation before continuing.

## Step 2 — Read the canonical sources fresh

Do not rely on prior context for these — re-read them in this run:

- `design-reference/SCREEN_ROUTE_CONTRACT.json` (Screen list source of truth)
- `design-reference/UI_CONTRACT.md`
- `design-reference/D-001/DESIGN.md`
- `docs/PROJECT_SCOPE.md` (requirement classification source of truth — IMPLEMENT/EXCLUDED)
- `docs/06_SRS_UIUX_REVISED.md`
- `TASKS/00_TASK_LIST.md` **if it already exists** — read it in full before changing anything (see Step 3, update mode)
- The actual `src/app/**`, `src/components/**`, `src/lib/**`, `src/data/**`, `supabase/**` file tree (via Glob — not memory) to determine which `Expected Files` already exist ("extend" vs "create")

## Step 3 — Create or update `TASKS/00_TASK_LIST.md`

### If `TASKS/00_TASK_LIST.md` does not exist (first run)

Build it from scratch following every convention in `.claude/skills/traveler-project-pipeline/SKILL.md`:

- Exactly 5 `PAGE_OWNER` tasks (`PAGE-SCR001`..`PAGE-SCR005`), one per Screen in `SCREEN_ROUTE_CONTRACT.json` — no more, no fewer.
- Break each Screen's `UI_CONTRACT.md` "주요 Component" list into `COMPONENT` tasks (`C-SCR00N-<slug>` or `C-GLOBAL-<slug>`); every Page Owner's Depends On must list every Component task sharing its Screen.
- `PAGE-SCR001` includes the starter-template-removal Acceptance Criterion.
- `PAGE-SCR003` assembles all three tabs — 항공편/숙소/동행 구하기.
- `PAGE-SCR005` assembles Guest/Member/Admin.
- Destination/Safety/About content become `DATA-<slug>` tasks writing to `src/data/` — never a DB table.
- Supabase schema/RLS/access/seed become `DB-<slug>` tasks citing only the 6 canonical tables: `profiles`, `mate_posts`, `mate_applications`, `blocks`, `reports`, `external_links`.
- Each `technical_routes.api_routes` entry in `SCREEN_ROUTE_CONTRACT.json` becomes one `API-<slug>` task.
- Flight/hotel link-out component and Page Owner tasks explicitly state no server/DB/URL-query transmission of input values.
- Exactly one Playwright task category (`E2E_TEST`), Chromium-only smoke — do not create Firefox/WebKit/visual/load-test tasks.
- No auto-merge, EC2, or AWS tasks.
- Every one of the 114 requirement ids from `docs/PROJECT_SCOPE.md` is accounted for with its `IMPLEMENT`/`EXCLUDED` status: `IMPLEMENT` ids get a Task row (§2), `EXCLUDED` ids get an entry in the §4 NON_IMPLEMENTATION table instead — never both, never neither.

### If `TASKS/00_TASK_LIST.md` already exists (update mode — the normal case)

**Do not blindly regenerate and overwrite.** The existing file may hold decisions (task splits, dependency choices, priority calls) made deliberately in an earlier session. Instead:

1. Diff the canonical inputs (Step 2) against what the existing §2/§4 tables already encode.
2. If nothing in the canonical inputs changed since the file was last written, make no changes and report that the Task List is already current.
3. If something did change (e.g. `docs/PROJECT_SCOPE.md` reclassified a requirement, or `SCREEN_ROUTE_CONTRACT.json` changed a route), apply the minimal edit needed to keep the table accurate — add/remove/relabel only the affected rows, and add a short changelog note near the top of the file (mirroring the style of `docs/DECISION_LOG.md`: what changed, why, source).
4. Never renumber `Seq` or rename existing Task IDs that are unaffected — other files (`TASKS/TASK-<ID>.md`, `TASKS/TASK_MANIFEST.csv`) reference them by id.

## Step 4 — Self-check before writing

Before saving, verify by hand (this is what `scripts/audit_tasks.py` will later re-check mechanically, but catching it now saves an audit-fail round trip):

- No duplicate Task IDs.
- No `Depends On` cell references a Task ID that isn't in the table.
- No dependency cycle.
- Every row has all 16 cells present (a missing cell shifts every following cell — this exact defect has happened before in the `PAGE_OWNER` rows' Expected Files cell; count cells when in doubt).
- §2 total (IMPLEMENT-classified requirement ids covered) + §4 total (EXCLUDED ids) = 114.

## Step 5 — Report

Tell the user: whether this was a first-generation or an update, total task count and counts by Category, confirmation that `scripts/validate_inputs.py` passed, and — if in update mode — exactly which rows changed and why. Remind them the next step is `/gen-task-details` (only for Task IDs that don't yet have a `TASKS/TASK-<ID>.md`, or whose row changed).
