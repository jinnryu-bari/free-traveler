---
description: Run scripts/audit_tasks.py against TASKS/00_TASK_LIST.md + TASKS/TASK-*.md and report pass/fail with actionable fixes
---

Load the `traveler-project-pipeline` skill before doing anything else in this command.

**Pipeline-wide principles (apply to this command too):** use the `traveler-project-pipeline` skill; read the actual script output, not a summary from memory; this command never writes application/implementation code — it only runs the audit and reports; never soften, skip, or reinterpret an audit failure as a pass.

## Step 1 — Run the audit

```
python scripts/audit_tasks.py
```

This reads `TASKS/00_TASK_LIST.md`, every `TASKS/TASK-*.md`, `docs/PROJECT_SCOPE.md`, and `design-reference/SCREEN_ROUTE_CONTRACT.json`, and writes `TASKS/TASK_MANIFEST.csv` + `TASKS/TASK_AUDIT_REPORT.md` as a side effect regardless of pass/fail.

## Step 2 — Report

- **If it exits 0 (`AUDIT_PASS`):** report the summary line (검사 수, 실패 0), and point to `TASKS/TASK_AUDIT_REPORT.md`/`TASKS/TASK_MANIFEST.csv` as the durable record. State the pipeline is complete for this run.
- **If it exits non-zero:** report every `FAIL:` line from the script's stdout, each tagged with its check number (1–18, see `.claude/skills/traveler-project-pipeline/SKILL.md` → "The 18 audit checks"). For each failure, propose the specific fix in terms of the actual file and row/section to edit — e.g. "`TASKS/00_TASK_LIST.md` Seq 29 (`C-SCR004-DETAIL-PANEL`) Depends On is missing `API-MATE-REQUESTS`", "`TASKS/TASK-DB-SCHEMA-BASE.md` mentions a 7th table `notifications` — not one of the 6 canonical tables, remove it or fold it into an existing table". Also surface any `WARN:` lines (e.g. a repaired malformed row) even when the run otherwise passes — those indicate a defect in `TASKS/00_TASK_LIST.md` itself that should be fixed at the source, not just auto-repaired every run.

## Step 3 — Do not self-declare success

Never tell the user the task pipeline is "done" or "ready" based on task count, vibes, or a partial read of `TASKS/00_TASK_LIST.md` — only `scripts/audit_tasks.py` printing `AUDIT_PASS` and exiting 0 is evidence of completion. If the user asks "is it done?" or "감사 통과했어?", re-run the script rather than answering from memory of an earlier run — `TASKS/00_TASK_LIST.md` or a `TASKS/TASK-<ID>.md` file may have changed since.

## Step 4 — If asked to fix failures

If the user asks you to fix what the audit found, edit only `TASKS/00_TASK_LIST.md` and/or `TASKS/TASK-<ID>.md` files (never application code) to resolve the specific failure, then go back to Step 1 and re-run — repeat until `AUDIT_PASS`. If a failure can't be resolved without a scope decision only the user can make (e.g. check 17 finds a requirement id that's in neither IMPLEMENT nor EXCLUDED in `docs/PROJECT_SCOPE.md` itself), stop and ask instead of guessing a classification.
