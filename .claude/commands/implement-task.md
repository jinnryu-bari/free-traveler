---
description: Implement exactly one Task that prepare-task has confirmed READY_TO_IMPLEMENT — Expected Files only, AC-driven, no auto commit/push/PR
---

## Inputs

Same as `/prepare-task`: `WAVE_ID`, `TASK_ID`, and the detail file `TASKS/TASK-<TASK_ID>.md`.

This command implements `CLAUDE.md`'s Task 완료 순서 steps "구현 → 관련 포맷·Unit Test → (필요 시) Playwright → Diff 확인 → 완료 보고". The preceding steps ("Task 읽기 → 입력 확인") are `/prepare-task`'s job — do not re-derive them from scratch here, but do re-run the gate (Step 0 below), since state can go stale between preparation and now.

## Step 0 — Re-confirm READY_TO_IMPLEMENT (rule 1)

Run `/prepare-task` for this exact `WAVE_ID`/`TASK_ID` now, even if it was already checked earlier in the conversation. **Do not implement from a cached/remembered result.**

- If the result is anything other than `READY_TO_IMPLEMENT` → stop. Report the blocking status and its reason (from `/prepare-task`'s output) and do not touch any file.
- If `READY_TO_IMPLEMENT` → continue. Carry forward its Expected Files (create vs extend) and required env var names into this run.

## Step 0.5 — Category with no Expected Files

If the Task's Category is `MANUAL_CHECK` or `RELEASE_CHECK` (Expected Files = `없음`), there is nothing to implement — these are human-attested checklist Tasks, not code Tasks. Stop here, tell the user this Task needs a manual sign-off (per its Functional AC) rather than implementation, and do not write any file.

## Step 1 — Implement exactly this one Task, inside Expected Files only (rules 1, 2)

- Touch only the files listed in the detail file's **Expected Files** section. Do not edit, create, or delete any other file.
- Do not start a second Task's work in the same pass, even if it looks convenient (e.g. don't also flesh out a sibling Component while implementing a Page Owner). One Task per run of this command.
- Follow the **Design Ref** section (exact `design-reference/D-001/DESIGN.md` / `UI_CONTRACT.md` sections cited) for tokens, spacing, Section order — never invent a color/spacing/radius value outside `D-001/DESIGN.md` §2–§6.

### Per-Category implementation shape

| Category | What "구현" means here |
|---|---|
| `PAGE_OWNER` | **Assemble only** (rule 4). Import and compose the Components its Depends On already implemented into the real Page Entry (`src/app/**/page.tsx`). Do not write new Component logic (a card, a form, a filter widget) inline in the page file — if something is missing, that's a gap in an earlier Task, stop and report it rather than filling it in here. `PAGE-SCR001` also removes any remaining `create-next-app` starter markup. Server Component by default (`docs/ARCHITECTURE.md` §3) — do not add `"use client"` to the page file itself. |
| `COMPONENT` | Implement the one component per its Functional/Visual AC and Design Ref. Client Component (`"use client"`) only if it truly needs interactivity/state (`docs/ARCHITECTURE.md` §3) — otherwise Server Component. |
| `DATA` | Write the static TypeScript data file(s) under `src/data/`, matching the schema and minimum record counts in the AC. No DB table, no CMS. |
| `DB` | Write SQL migration file(s) under `supabase/migrations/` by hand — no ORM, no Prisma schema (rule 7 / `CLAUDE.md` rule 17). Only the 6 canonical tables. |
| `API` | Write the `route.ts` handler at the exact path from `design-reference/SCREEN_ROUTE_CONTRACT.json`'s `technical_routes`, going through the server Supabase client / access layer (`docs/ARCHITECTURE.md` §9/§11), never a direct ORM call. |
| `UNIT_TEST` / `INTEGRATION_TEST` | Write the test file(s) per Expected Files, covering exactly the scenarios in Functional AC. |
| `E2E_TEST` | Write the Playwright spec, Chromium-only, smoke-level happy path only — do not add Firefox/WebKit/visual-regression/load-test scope. |

## Step 2 — Follow Functional / Visual / Security AC exactly (rule 3)

Treat the detail file's three AC sections as the acceptance bar, not a suggestion:

- **Functional AC** — every bullet must be true of the finished code.
- **Visual AC** — Desktop/Mobile behavior, spacing, breakpoints as specified; reuse existing tokens/components, don't approximate.
- **Security/Privacy AC** — especially anything about non-transmission (rule 12 in `CLAUDE.md`), RLS, or minimal data collection; if the AC says an input value must never leave the browser, verify that by inspecting what you wrote (no `fetch`/API call/`console.log` of that value), not just by intent.

Also honor the detail file's **Forbidden** section and rule 7 of this command: do not add AWS/EC2 infrastructure, do not add Prisma or any other ORM, do not add an auto-merge/auto-PR mechanism, and do not implement anything listed as `EXCLUDED` in `docs/PROJECT_SCOPE.md` even if it would be a natural-seeming addition.

## Step 3 — 관련 Unit Test 실행 (rule 5)

- If this Task **is** a `UNIT_TEST`/`INTEGRATION_TEST` Task: run the test you just wrote (`npx vitest run <file>`) and confirm it passes.
- If this Task is some other Category but existing Unit Tests already cover the logic you touched (e.g. implementing `C-SCR003-FLIGHT-FORM` and `UNIT-TRAVEL-DATES` already exists) — run those existing tests against your change (`npx vitest run <matching file>`).
- Also run `npm run lint` and `npm run build` (or `tsc --noEmit` if build is slow) as the baseline format/type check — this is the "관련 포맷" half of `CLAUDE.md`'s Task 완료 순서 step 4.
- Any failure here blocks completion — fix it before moving to Step 4, or stop and report if the fix would require touching a file outside Expected Files.

## Step 4 — Playwright Smoke, only if Page Owner or E2E Task (rule 6)

- Category `PAGE_OWNER` or `E2E_TEST` → run the relevant Chromium smoke spec (`npx playwright test <spec> --project=chromium`) named in this Task's **Verify** section.
- Any other Category → **do not** run Playwright at all in this command, even if a Component "feels" ready for it. E2E coverage happens later, when the owning `PAGE_OWNER`/`E2E_TEST` Task runs.

## Step 5 — Diff 확인

Run `git status --short` and `git diff --stat`. Confirm the changed-file set is **exactly** the Expected Files (nothing extra, nothing missing). If it isn't, fix the discrepancy (revert an accidental out-of-scope edit, or add a file that should have been touched but wasn't) before reporting completion.

## Step 6 — 완료 보고 (rule 8)

Report, every time, regardless of outcome:

- **변경 파일** — the exact list from Step 5, each marked create/extend.
- **검증 결과** — lint/build/type-check result, which Unit Tests ran and their result, whether Playwright ran (and its result) or was correctly skipped per Step 4's rule.
- **남은 제약사항** — anything from the AC not fully verifiable by automation (e.g. a Visual AC needing human eyes on a screenshot), any `WARN`-level note carried over from `/prepare-task`, and which Task(s) this one's completion unblocks (its reverse-dependents, if known).

## Commit · Push · PR

- **Default: do none of these.** This command's job ends at Step 6's report. Leave the changes uncommitted in the working tree.
- **If the user explicitly asks for a commit**, you may create **one commit scoped to exactly this Task's Expected Files** (`git add <expected files>` — never `git add -A`/`git add .` — then `git commit`), with the Task ID in the commit message. This is the ceiling: never push and never open a PR as part of honoring that request, even implicitly — those need their own explicit ask.
- Never run a destructive git command (`reset --hard`, `push --force`, `clean -f`, `checkout .`, `branch -D`, etc.) from this command (`CLAUDE.md` rule 20).
- Never trigger an automatic merge (`CLAUDE.md` rule 21, `docs/DECISION_LOG.md` DEC-012) — merging is always a separate, human, manual action.
