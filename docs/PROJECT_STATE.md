# Free Traveler — Project State

**Document ID:** STATE-TRAVEL-001
**Last Updated:** 2026-09-16
**갱신 주체:** `/run-wave`(Task/Wave 진행 시), `/release-check`(릴리스 게이트 실행 시), 또는 사람이 직접. 이 문서는 "지금 실제로 어디까지 왔는가"의 단일 스냅샷이며, 계획 문서(`TASKS/00_TASK_LIST.md`, `docs/ARCHITECTURE.md`)와는 역할이 다르다 — 값이 바뀌면 이 문서를 갱신하고, 낙관적으로 앞서가지 않는다.

---

## 필드

| 필드 | 값 |
|---|---|
| **Harness Schema** | `traveler-screen-route-v1` |
| **Design Version** | `D-001` (status: LOCKED, `design-reference/D-001/DESIGN.md`) |
| **Scope Mode** | MVP — `docs/PROJECT_SCOPE.md` 기준 IMPLEMENT 89 / EXCLUDED 25 (114개 전수 분류 완료) |
| **Current Wave** | 없음 — `TASKS/WAVE_PLAN.md`가 아직 작성되지 않아 Wave 실행이 시작되지 않았다 |
| **Current Task** | 없음 — 같은 이유로 `/run-wave` 실행 이력 없음 |
| **Completed Tasks** | 0 / 76 (Task 파이프라인 기준 공식 DONE 없음 — `TASKS/WAVE_STATE.md` 자체가 아직 없음). 단, Task 파이프라인 도입 이전에 작성된 코드가 일부 Task의 착수점 역할을 한다: `src/app/layout.tsx`, `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`, `src/lib/nav.ts`(대략 `C-GLOBAL-HEADER`/`C-GLOBAL-FOOTER`에 해당하는 초안), `src/app/page.tsx`(SCR-001 Hero Section 1개만, `PAGE-SCR001`의 극히 일부). `/prepare-task`·`/run-wave`로 정식 완료 처리된 것은 없다. |
| **Blocked Tasks** | 추적 없음 — `TASKS/WAVE_STATE.md` 부재로 `BLOCKED_*` 상태가 기록된 Task 없음 |
| **Latest CI** | 없음 — `.github/workflows/ci.yml` 미생성(`RELEASE-CI-GATES` 착수 전) |
| **Supabase State** | 미생성 — `supabase/` 디렉토리 없음, `.env.local` 없음, 프로젝트 연결 전(`DB-SCHEMA-BASE`/`DB-RLS-BASE` 착수 전) |
| **Vercel Preview URL** | 없음 — `.vercel/` 프로젝트 연결 없음, 배포 이력 없음 |
| **Screen Checkpoints** | 아래 표 참조 — 전부 `PENDING` |
| **Playwright State** | 미설치 — `package.json`에 `@playwright/test` 없음, `playwright.config.ts` 없음(`I-PLAYWRIGHT-SETUP` 상당 작업 착수 전) |
| **Deferred Items** | ① EXCLUDED 요구사항 25건 — `TASKS/00_TASK_LIST.md` §4, `docs/PROJECT_SCOPE.md` §3 참조(구현 보류가 아니라 범위 제외로 확정된 항목). ② `TASKS/WAVE_PLAN.md` 작성 — Wave 분할 기준 자체가 아직 확정되지 않음(`docs/DECISION_LOG.md` DEC-010 참조). ③ CMS·외부 이메일 공급자·모니터링 인프라 — `docs/ARCHITECTURE.md` §14에 따라 범위 밖으로 확정, 재검토 대상 아님. ④ **미해결 — `app_settings` vs `external_links` 명명 확인 필요**: 외부 URL 설정을 저장하는 6번째 테이블 이름으로 세션 중 `app_settings`를 지시받은 적이 두 차례 있었으나(2026-09-16, 2026-09-18), 현재 확정 정본(`CLAUDE.md` 규칙 13, `TASKS/00_TASK_LIST.md`, `API-ADMIN-EXTERNAL-LINKS` Task)은 전부 `external_links`를 사용 중이다. 사용자 요청에 따라 테이블명은 변경하지 않았고, 어느 쪽이 맞는지 사람 확인이 필요한 상태로 남겨둔다. |
| **Next Action** | `TASKS/WAVE_PLAN.md` 작성(Wave 분할 확정) → `/run-wave W01`로 첫 Wave 착수. 그 전에 `docs/ARCHITECTURE.md` §15의 착수 차단 항목(Supabase 패키지·env·마이그레이션, Playwright 설치, CI 워크플로) 중 첫 Wave가 실제로 필요로 하는 것부터 해소 필요. |

---

## Screen Checkpoints

`CLAUDE.md` 규칙 22("사람이 Preview를 확인한 뒤에만 다음 화면 Wave로 진행한다")에 대응하는 화면별 사람 확인 체크포인트다. 값은 `PENDING`(대기) → `WAITING_FOR_PREVIEW`(Wave 완료, 사람 확인 대기 — `/run-wave`가 세팅) → `CONFIRMED`(사람이 확인 완료) 순으로만 전진하며, 되돌리지 않는다(재작업이 필요하면 새 항목으로 남기고 이 값을 임의로 `PENDING`으로 되돌리지 않는다).

| Checkpoint | Route | Status |
|---|---|---|
| SCR-001 | `/` | CONFIRMED (2026-09-18, `TASKS/WAVE_STATE.json` W05 checkpoint_result) |
| SCR-002 | `/about` | CONFIRMED (2026-09-18, `TASKS/WAVE_STATE.json` W07 checkpoint_result) |
| SCR-003 | `/travel-tools` | PENDING — 미구현(`PAGE-SCR003`, W08 예정) |
| SCR-004 | `/mates` | PENDING — 미구현(`PAGE-SCR004`, W10 예정) |
| SCR-005 | `/account` | PENDING — 미구현(`PAGE-SCR005`, W12 예정) |
| FINAL | (전체 통합 — `/release-check` `RELEASE_READY`) | PENDING |
