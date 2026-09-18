# CLAUDE.md — Free Traveler 루트 Agent 규칙

이 파일은 `traveler/app`에서 작업하는 모든 Agent 세션에 적용되는 규칙을 직접 기록한다. 다른 규칙 파일을 참조(import)하지 않는다 — 필요한 모든 규칙은 이 문서 안에 있다. (`AGENTS.md`는 `next dev`가 자동으로 재생성하는 별개 파일이며, 이 문서가 그 내용을 대체하지 않는다. Next.js 관련 확인은 아래 규칙 1을 따른다.)

---

## Harness Marker

이 프로젝트의 파이프라인 스크립트(`scripts/audit_tasks.py` 등)와 계약 문서가 참조하는 고정값이다. 값을 임의로 바꾸지 않는다.

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

---

## 정본 문서 (Source of Truth)

| 구분 | 정본 |
|---|---|
| SRS(Route/화면 구조 개정본) | `docs/06_SRS_UIUX_REVISED.md` — Baseline SRS(`02_SRS_BASELINE.md.md`) 위에 Route/Screen 구조만 개정한 addendum. 요구사항 본문(REQ-FUNC/REQ-NF)은 여전히 Baseline SRS가 원문이며, 이 문서가 대체하는 것은 화면 구조뿐이다. |
| Scope 분류(IMPLEMENT/EXCLUDED) | `docs/PROJECT_SCOPE.md` |
| 디자인 토큰·규칙 | `design-reference/D-001/DESIGN.md` (status: LOCKED) — Airbnb 참고본(`design-reference/vendor/airbnb/`)은 방법론 참고 자료일 뿐 구현 근거가 아니다. |
| Screen/Route/Page Entry | `design-reference/SCREEN_ROUTE_CONTRACT.json` — `UI_CONTRACT.md`와 상충하면 이 JSON이 이긴다. |
| Task 정의 | `TASKS/00_TASK_LIST.md`(Task List), `TASKS/TASK-<ID>.md`(Task별 상세) |
| 감사 규칙 | `scripts/audit_tasks.py` |

---

## 필수 규칙 (1~24)

### 착수 전 확인

1. **작업 전 `package.json`과 현재 설치된 Next.js 버전의 문서(`node_modules/next/dist/docs/`)를 확인한다.** 이 프로젝트의 Next.js 버전은 학습 데이터 시점과 API·컨벤션이 다를 수 있다 — 코드를 쓰기 전에 관련 가이드를 읽는다.
2. **SRS 정본은 `docs/06_SRS_UIUX_REVISED.md`다.**
3. **Scope 분류 정본은 `docs/PROJECT_SCOPE.md`다.**
4. **디자인 정본은 `design-reference/D-001/DESIGN.md`다.**
5. **Screen 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다.**

### 실행 단위

6. **`/run-wave WXX`를 표준 개발 명령으로 사용한다.**
7. **Wave 내부 Task는 Depends On 순서로, 한 번에 하나만 구현한다.** 여러 Task를 동시에 병렬로 시작하지 않는다.
8. **현재 Task의 Expected Files 밖 파일은 수정하지 않는다.** 다른 Task의 소유 파일을 건드리지 않는다.
9. **Page Owner Task는 Page Entry(`page.tsx`)에서 이미 존재하는 Component를 실제로 조립하는 것만 범위로 한다.** Page Owner Task 안에서 새 Component를 직접 구현하지 않는다.

### 화면별 필수 조건

10. **SCR-001 완료 시 Next.js Starter(create-next-app 기본 마크업/로고/문구)를 전부 제거한다.**
11. **SCR-003은 항공편·숙소·동행 구하기 3개 탭을 전부 한 페이지에 조립한다.** 하나라도 빠뜨리거나 별도 페이지로 분리하지 않는다.

### 데이터·보안 경계

12. **항공·숙소 입력값은 서버·DB·URL·로그·분석 어디로도 전송하지 않는다.** Client Component의 일시 상태로만 유지한다.
13. **Supabase 쓰기(write)는 Auth·동행(mate_posts/mate_applications)·신고(reports)·차단(blocks)·외부 URL 설정(external_links) 범위로 제한한다.** 이 5개 성격 밖의 새 쓰기 대상을 만들지 않는다.
14. **RLS를 우회하는 Client 코드를 작성하지 않는다.** 권한 판단을 클라이언트에서만 하고 서버(RLS)로 재검증하지 않는 코드를 만들지 않는다.
15. **Service Role Key(`SUPABASE_SERVICE_ROLE_KEY`)를 Client Component·클라이언트 번들에서 사용하지 않는다.** 서버 전용 코드에서만 참조한다.
16. **여행지·안전정보·대표 소개는 정적 데이터(`src/data/*.ts`)를 사용한다.** DB 테이블이나 CMS로 대체하지 않는다.
17. **Prisma·다른 ORM·AWS·EC2를 추가하지 않는다.** Supabase JS 클라이언트로 직접 쿼리하고, 호스팅은 Vercel만 사용한다.

### 테스트·범위

18. **Playwright는 핵심 흐름 Smoke Test만 작성한다.** Chromium 단일 브라우저(`PLAYWRIGHT_SCOPE=chromium-smoke`)만 사용하고, Firefox/WebKit·시각적 회귀·부하 테스트를 추가하지 않는다.
19. **EXCLUDED로 분류된 기능을 임의로 구현하지 않는다.** `docs/PROJECT_SCOPE.md`/`TASKS/00_TASK_LIST.md` §4에서 EXCLUDED인 요구사항은 복원하지 않는다 — 필요하다고 판단되면 구현하지 말고 사용자에게 먼저 확인한다.
24. **이 프로젝트는 수업 실습용이다.** 교재의 핵심 기능 구현과 기본 동작 확인을 우선하고, 과도한 정교화(edge-case 전용 방어 로직 추가, 근본 원인이 바로 드러나지 않는 이슈를 깊게 파고드는 것 등)나 같은 자동 테스트를 장시간 반복 실행하는 작업은 피한다. 원인 조사가 짧은 시도로 끝나지 않으면 중단하고, 그 시점까지 확인한 사실과 확인하지 못한 부분을 구분해 보고한 뒤 사용자 판단을 구한다. 통과하지 않았거나 확인되지 않은 검사를 통과로 표시하지 않는다 — "구현 완료"와 "검증 완료"는 항상 구분해서 기록한다.

### Git·병합·보고

20. **destructive Git 명령(`reset --hard`, `push --force`, `clean -f`, `checkout .` 등)을 임의로 사용하지 않는다.** 꼭 필요하면 먼저 사용자에게 확인한다.
21. **자동 PR 생성·자동 Merge를 실행하지 않는다.** PR·Merge는 사람이 수동으로 수행한다(`AUTO_MERGE=false`).
22. **사람이 Preview를 확인한 뒤에만 다음 화면 Wave로 진행한다.** 확인 없이 다음 Wave를 임의로 시작하지 않는다.
23. **작업 완료 시 변경된 파일 목록, 검증 결과(lint/build/test), 남은 제한사항(미해결·수동 확인 필요 항목)을 보고한다.**

---

## Task 완료 순서

Task 하나를 구현할 때는 항상 이 순서를 따른다:

**Task 읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → (필요 시) Playwright → Diff 확인 → 완료 보고**

1. **Task 읽기** — `TASKS/TASK-<ID>.md`의 Context/Requirement Ref/Design Ref/Depends On/Expected Files/Functional·Visual·Security AC/Forbidden을 전부 읽는다.
2. **입력 확인** — Depends On의 선행 Task가 완료 상태인지, 참조할 정본 문서(위 표)의 관련 절을 확인한다.
3. **구현** — Expected Files 안에서만 코드를 작성·수정한다.
4. **관련 포맷·Unit Test** — 관련된 포맷/린트(`npm run lint`, `npm run build`)와 해당 Task의 Unit Test(있는 경우)를 실행한다.
5. **(필요 시) Playwright** — 이 Task가 E2E Smoke 대상이면 Chromium Smoke를 실행한다(규칙 18).
6. **Diff 확인** — 변경된 파일이 Expected Files와 정확히 일치하는지 확인한다(규칙 8).
7. **완료 보고** — 규칙 23에 따라 변경 파일·검증 결과·남은 제한사항을 보고한다.
