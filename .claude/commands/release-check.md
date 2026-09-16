---
description: Whole-repo pre-release gate — Task/Wave completion, 5 Page Owners, CI, Playwright Smoke, Supabase 6-table/RLS record, Vercel Preview Checkpoints, EXCLUDED integrity. Read-only; never modifies any file.
---

## What this command is

A single project-wide readiness gate, run once all Waves are believed finished (`TASKS/WAVE_STATE.json` mostly `"done"`) and before anyone actually deploys to Vercel production or merges to `main`. It is **read-only** — like `/audit-tasks` and `/prepare-task`, it never edits `TASKS/**`, `src/**`, `docs/**`, `supabase/**`, and never runs a mutating git command. It only reads, runs read-only verification commands (`gh run view`, `npx playwright test`, `python scripts/audit_tasks.py`), and reports.

There is no per-Task input — this checks the whole repo's current state. If given a target (branch/commit), default to the current `HEAD` on the current branch.

Run all 7 checks every time, even after an early failure — report every failure found, not just the first (unlike `/prepare-task`'s single-status priority order, `RELEASE_READY` requires **all** checks green, so partial information is more useful here than a first-blocker-only report).

---

## The 7 checks

### 1. Task·Wave 상태

- Run `python scripts/audit_tasks.py`. It must exit 0 (`AUDIT_PASS`) — if not, this alone fails the check and every subsequent check that depends on `TASKS/00_TASK_LIST.md`/`TASKS/TASK-*.md` being structurally sound should be treated as unreliable and reported as such.
- Read `TASKS/WAVE_PLAN.md` and `TASKS/WAVE_STATE.json`. Every Wave listed in `WAVE_PLAN.md`'s Wave 목록 must show `status: "done"` in its `WAVE_STATE.json` entry — `"pending"`, `"in_progress"`, `"waiting_for_preview"`, or any `"blocked_*"` value fails this check.
- Every Task ID in `TASKS/00_TASK_LIST.md` §2 must show `"done"` in its owning Wave's `tasks` map in `WAVE_STATE.json`. Any `"pending"`/`"in_progress"`/`"blocked_*"`, or a Task ID with no entry at all, fails this check — list every such Task ID.
- If `TASKS/WAVE_PLAN.md` or `TASKS/WAVE_STATE.json` doesn't exist yet → fails this check outright ("Wave 파이프라인이 아직 시작되지 않았다 — `python scripts/build_waves.py`를 먼저 실행해야 한다").

### 2. 5개 Page Owner DONE

Independently of check 1's aggregate pass (so a `WAVE_PLAN.md` that accidentally omitted a Screen doesn't hide this): confirm `PAGE-SCR001`, `PAGE-SCR002`, `PAGE-SCR003`, `PAGE-SCR004`, `PAGE-SCR005` all show `"done"` in their owning Wave's `tasks` map in `TASKS/WAVE_STATE.json`, and each has a recorded `commit` SHA. Missing any one of the 5 fails this check by itself, regardless of how check 1 turned out.

### 3. CI PASS

- Determine the current commit: `git rev-parse HEAD`.
- If the GitHub CLI is available and authenticated (`gh auth status`), find the most recent GitHub Actions run for this commit/branch: `gh run list --branch <current branch> --limit 5` and match the commit SHA, or `gh run view <run-id>`. The run's `RELEASE-CI-GATES` workflow (`.github/workflows/ci.yml`) must show `conclusion: success` for lint, build, and test jobs.
- If `.github/workflows/ci.yml` doesn't exist yet, or `gh` isn't available/authenticated, or no run is found for the current commit → fails this check; **do not** substitute a local `npm run lint && npm run build` pass as equivalent to "CI PASS" — report that CI status specifically could not be confirmed, rather than silently downgrading the bar.

### 4. Playwright Smoke PASS

- Prefer the CI run's Playwright job result from check 3, if it separately reports one.
- If that's not resolvable (no CI run found, or CI doesn't separate out a Playwright job), run it locally as a fallback: `npx playwright test --project=chromium`. All specs from the `E2E_TEST` category Tasks (`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`) must pass. State clearly in the report which source (CI vs local fallback) the result came from.
- `playwright.config.ts` missing, or any spec failing/erroring → fails this check.

### 5. Supabase 6개 Table·기본 RLS 확인 기록

- Confirm `RELEASE-SUPABASE-CHECK` shows `"done"` in `TASKS/WAVE_STATE.json` — this Task's own Functional AC (`TASKS/TASK-RELEASE-SUPABASE-CHECK.md`) is exactly the "운영 프로젝트에서도 6개 테이블 전부 RLS 활성 상태 확인" record this check is looking for; do not re-derive it from scratch, read that Task's recorded completion.
- As a secondary structural cross-check (no live DB connection needed), confirm `DB-SCHEMA-BASE` and `DB-RLS-BASE` also show `DONE`, and that `scripts/audit_tasks.py`'s check 12 output (from check 1's run) reported no table beyond the 6 canonical ones.
- Any of the three (`RELEASE-SUPABASE-CHECK`, `DB-SCHEMA-BASE`, `DB-RLS-BASE`) not `DONE`, or check 12 flagging an extra table, fails this check.

### 6. Vercel Preview Checkpoint

- Confirm `RELEASE-VERCEL-DEPLOY-CHECK` shows `"done"` in `TASKS/WAVE_STATE.json`.
- Confirm every Wave in `WAVE_PLAN.md` marked Preview Checkpoint `yes` shows `status: "done"` (not `"waiting_for_preview"`) in `TASKS/WAVE_STATE.json` — a Wave stuck at `"waiting_for_preview"` means a human never actually confirmed that Screen's Vercel Preview (`CLAUDE.md` rule 22), and that fails this check even if every Task under it individually shows `"done"`.
- Missing `RELEASE-VERCEL-DEPLOY-CHECK` completion, or any Preview-Checkpoint Wave still `WAITING_FOR_PREVIEW`, fails this check.

### 7. EXCLUDED 목록

- Re-use check 1's `scripts/audit_tasks.py` run: its checks 17 (114/114 accounted for) and 18 (no EXCLUDED requirement referenced by a Task) must both show `OK`. If check 1 already failed for other reasons but checks 17/18 specifically passed, still report checks 17/18's individual result here.
- Read `TASKS/00_TASK_LIST.md` §4 and confirm its count is still 25 and its ids are unchanged from `docs/PROJECT_SCOPE.md`'s EXCLUDED set (same cross-check `scripts/audit_tasks.py` already does as an informational row) — if the two disagree, that's a fail even though `audit_tasks.py` itself only reports it as `INFO`, because a release gate should be stricter than a routine pipeline audit.
- Any drift → fails this check, naming exactly which requirement id(s) drifted and how.

---

## Verdict

- **All 7 checks pass → `RELEASE_READY`.** Report a one-line confirmation per check plus: current commit SHA, which CI run was checked, and the count of Tasks/Waves confirmed `DONE`.
- **Any check fails → `RELEASE_BLOCKED`.** Report every failing check (not just the first), each with the exact artifact/file/Task ID that needs to change, and what evidence would flip it to pass (e.g. "Wave `W04`는 `WAITING_FOR_PREVIEW` — 사용자가 Preview를 확인한 뒤 `/run-wave resume`으로 해제해야 한다", "`RELEASE-CI-GATES`에 대응하는 GitHub Actions 실행을 찾지 못했다 — `gh auth login` 또는 실행 자체가 없는지 확인 필요").

Never round `RELEASE_BLOCKED` up to `RELEASE_READY` based on "close enough" or a partial re-check — re-run this command in full after every fix, the same way `/audit-tasks` insists on a fresh `AUDIT_PASS` rather than trusting memory of an earlier run.

This command makes no code, Task, Wave, or git-state changes under any circumstance, including when asked to "fix" a `RELEASE_BLOCKED` finding — route that request to the specific fixing command instead (`/run-wave resume` for a Preview Checkpoint, `/implement-task` for an incomplete Task, a manual `gh`/Vercel dashboard action for CI/deploy config, etc.).
