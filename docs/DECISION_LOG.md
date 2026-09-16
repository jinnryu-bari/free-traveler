# Free Traveler — Decision Log

**Document ID:** DECLOG-TRAVEL-001
**작성일:** 2026-09-16
**범위:** 이 문서는 Free Traveler 프로젝트 진행 중 확정된 결정 14건을 기록한다. 각 결정은 근거 문서 또는 대화(채팅) 확정 시점을 출처로 남기며, 번복 시 새 항목을 추가하고 이 문서의 기존 항목을 지우지 않는다(Superseded 표기로 이력을 남긴다).

---

## 요약

| ID | 결정 | 상태 |
|---|---|---|
| DEC-001 | 실제 개발 루트는 `traveler/app` | Active |
| DEC-002 | 디자인 Screen은 핵심 4개·보조 1개 | Active |
| DEC-003 | `/travel-tools`에 항공·숙소·동행 작성을 통합 | Active |
| DEC-004 | 여행지·안전·대표는 정적 TypeScript Data | Active |
| DEC-005 | Supabase는 Auth와 동행 기능 중심 | Active |
| DEC-006 | DB는 6개 Table로 제한 | Active |
| DEC-007 | 항공·숙소 입력은 Browser Memory에만 유지 | Active |
| DEC-008 | Airbnb DESIGN.md는 vendor 참고본, D-001이 실제 정본 | Active |
| DEC-009 | Playwright는 Chromium Smoke만 필수 | Active |
| DEC-010 | 사용자의 개발 실행 단위는 Wave | Active |
| DEC-011 | Single Agent가 Wave 내부 Task를 순차 수행 | Active |
| DEC-012 | PR·Merge는 사용자가 수동 수행 | Active |
| DEC-013 | EC2·AWS는 사용하지 않음 | Active |
| DEC-014 | 제외 기능은 EXCLUDED로 관리 | Active |

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

- **상태:** Active
- **결정일:** 2026-09-11
- **결정:** 코드 작업은 `C:\AI_SERVICE`가 아니라 `C:\AI_SERVICE\traveler\app`(Next.js 프로젝트 루트)을 기준으로 수행한다.
- **근거:** `C:\AI_SERVICE`는 여러 프로젝트(qaboard, PRD_SRS 등)가 공존하는 상위 작업 폴더이며, `traveler/app`에 `create-next-app` 스캐폴드·PRD/SRS·`.git` 저장소가 이미 구성되어 있었다. 세션 시작 시 사용자가 이 경로로 작업 디렉토리를 전환할 것을 직접 확인했다.
- **출처:** 대화 확정(2026-09-11 세션).
- **영향:** 이후 모든 문서 경로(`docs/`, `design-reference/`, `TASKS/`, `src/`)는 `traveler/app`을 루트로 한 상대 경로로 표기한다.

---

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

- **상태:** Active
- **결정일:** 2026-09-15
- **결정:** 승인된 디자인 Screen은 정확히 5개(SCR-001~005)이며, 그중 핵심(core) 4개는 SCR-001 `/`, SCR-003 `/travel-tools`, SCR-004 `/mates`, SCR-005 `/account`이고 보조(secondary) 1개는 SCR-002 `/about`이다.
- **근거:** `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `tier_summary`(`core: [SCR-001, SCR-003, SCR-004, SCR-005]`, `secondary: [SCR-002]`)가 정본이며, `design-reference/UI_CONTRACT.md`·`design-reference/DESIGN_MANIFEST.md`가 동일 구조를 재확인한다.
- **출처:** `design-reference/SCREEN_ROUTE_CONTRACT.json`, `design-reference/DESIGN_MANIFEST.md`.
- **영향:** 6번째 Screen을 추가하지 않으며, `docs/ARCHITECTURE.md` §2, `TASKS/00_TASK_LIST.md` §2.1(Page Owner 5개)이 이 결정을 그대로 따른다.

---

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

- **상태:** Active
- **결정일:** 2026-09-15
- **결정:** Baseline SRS(`02_SRS_BASELINE.md.md`)가 가정했던 개별 Route(`/flights`, `/hotels`, `/mates/new`)를 만들지 않고, 하나의 화면 `/travel-tools`(SCR-003) 안에 항공편·숙소·동행 구하기 3개 탭으로 통합한다. 3개 탭은 항상 동시에 존재하며 각 탭은 독립된 입력·검증·완료 상태를 유지한다.
- **근거:** `docs/06_SRS_UIUX_REVISED.md` §2.3("사라진 것처럼 보이는 기능의 실제 위치")이 이 재배치를 명시적으로 문서화했고, `design-reference/UI_CONTRACT.md` SCR-003 절이 3탭 구조를 구현 계약으로 확정했다.
- **출처:** `docs/06_SRS_UIUX_REVISED.md` §2.3, `design-reference/UI_CONTRACT.md` SCR-003.
- **영향:** `TASKS/00_TASK_LIST.md`의 `PAGE-SCR003`이 3개 탭 조립을 Functional AC로 명시하며, `scripts/audit_tasks.py` 검사 9가 이를 기계적으로 확인한다.

---

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

- **상태:** Active
- **결정일:** 2026-09-10 (`docs/PROJECT_SCOPE.md` 최초 작성 시점)
- **결정:** 여행지(`src/data/destinations.ts`), 국가별 안전정보(`src/data/safety.ts`), 대표 소개(`src/data/about.ts`)는 CMS나 DB 테이블이 아니라 정적 TypeScript 데이터 파일로 관리한다. 필수 필드는 TypeScript 타입으로 강제하고, 관리자 편집 UI는 만들지 않는다.
- **근거:** 콘텐츠 CRUD·검수·게시 워크플로를 갖춘 CMS를 구축하는 대신, 개발자가 파일을 직접 갱신하는 방식이 MVP 범위에 맞다는 판단(`docs/PROJECT_SCOPE.md` §2, §3).
- **출처:** `docs/PROJECT_SCOPE.md` §2 구현 방식 요약, §3 제외 기능(전체 콘텐츠 CMS).
- **영향:** REQ-FUNC-072~076(CMS 관련)이 EXCLUDED로 분류되며(DEC-014 참조), `TASKS/00_TASK_LIST.md`의 `DATA-DESTINATIONS`/`DATA-SAFETY`/`DATA-REPRESENTATIVE`가 이 결정을 구현 단위로 구체화한다.

---

## DEC-005 — Supabase는 Auth와 동행 기능 중심

- **상태:** Active
- **결정일:** 2026-09-10
- **결정:** Supabase(PostgreSQL + Auth + RLS)는 인증과 동행(Travel Mate) 기능 범위에 한정해서 사용한다. 여행지·안전정보·대표 소개(DEC-004)는 Supabase를 거치지 않는다.
- **근거:** 인증·성인확인·동행 모집/참가/신고/차단처럼 사용자별 쓰기·권한 통제가 필요한 데이터만 백엔드가 필요하고, 나머지 콘텐츠는 정적 데이터로 충분하다는 범위 판단.
- **출처:** `docs/PROJECT_SCOPE.md` §2, `docs/ARCHITECTURE.md` §7.
- **영향:** DEC-006(6개 테이블)·DEC-007(항공·숙소 비영속)과 함께 백엔드 범위를 확정한다.

---

## DEC-006 — DB는 6개 Table로 제한

- **상태:** Active
- **결정일:** 2026-09-15
- **결정:** Supabase 스키마는 정확히 6개 테이블(`profiles`, `mate_posts`, `mate_applications`, `blocks`, `reports`, `external_links`)로 제한한다. 감사 로그·알림 큐·이벤트 분석 등을 위한 7번째 테이블을 만들지 않는다.
- **근거:** REQ-FUNC-043(알림은 Toast로 대체)·REQ-FUNC-056/076(감사 로그 EXCLUDED)이 별도 테이블 없이도 충족 가능하다는 범위 판단.
- **출처:** `docs/PROJECT_SCOPE.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`(API Route가 참조하는 테이블 범위), `TASKS/00_TASK_LIST.md`(`DB-SCHEMA-BASE`), `scripts/audit_tasks.py`(`CANONICAL_DB_TABLES`, 검사 12).
- **영향:** `docs/ARCHITECTURE.md` §8이 이 표를 그대로 인용하며, 이후 어떤 Task도 이 6개 밖의 테이블을 생성할 수 없다(`scripts/audit_tasks.py` 검사 12가 기계적으로 막는다).

---

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

- **상태:** Active
- **결정일:** 2026-09-10
- **결정:** 항공·숙소 조건 입력값(국가·지역·날짜 등)은 Client Component의 React state(브라우저 메모리)에만 유지하며, API·DB·URL query·로그 등 서버 측 어디로도 전송·저장하지 않는다.
- **근거:** 실제 예약·가격 비교 기능이 없는 "정리 후 외부 이동" 제품이므로, 사용자가 입력한 여행 조건을 서버가 보유할 이유가 없고 개인정보 최소 수집 원칙에도 부합한다.
- **출처:** `docs/PROJECT_SCOPE.md`(REQ-FUNC-016/017/024/025), `docs/ARCHITECTURE.md` §4·§5.
- **영향:** 관련 Task(`C-SCR003-FLIGHT-FORM`, `C-SCR003-HOTEL-FORM`)의 Security/Privacy AC와 `E2E-TRAVEL-TOOLS`의 자동 assert(네트워크 요청에 입력값 미포함)로 강제된다.

---

## DEC-008 — Airbnb `DESIGN.md`는 vendor 참고본, D-001이 실제 정본

- **상태:** Active
- **결정일:** 2026-09-15
- **결정:** `design-reference/vendor/airbnb/DESIGN-airbnb.md`(Airbnb 참고 분석본)는 **방법론 참고 자료**(사진 중심 카드, 여백 리듬, 단일 강조색 원칙 등)로만 취급하고, 실제 구현 시 토큰·규칙의 유일한 정본은 `design-reference/D-001/DESIGN.md`(status: LOCKED)다. Airbnb의 상표 요소(워드마크, 3-프로덕트 nav, NEW 배지, 별점, Cereal 폰트, Rausch 토큰 네이밍)는 그대로 가져오지 않는다.
- **근거:** `design-reference/DESIGN_MANIFEST.md`가 "Vendor Reference... methodology reference only... never a direct implementation source"라고 명시하고, `design-reference/D-001/DESIGN.md` 자체 서문도 "Method는 Airbnb 참고 분석에서 적용했지만, 모든 토큰·용어·컴포넌트는 Free Traveler 고유"라고 밝힌다.
- **출처:** `design-reference/DESIGN_MANIFEST.md`, `design-reference/D-001/DESIGN.md`(front matter).
- **영향:** 모든 Component/Page Owner Task의 Design Ref는 `design-reference/D-001/DESIGN.md`(및 `UI_CONTRACT.md`)만 인용하며, vendor 파일을 직접 구현 근거로 인용하지 않는다.

---

## DEC-009 — Playwright는 Chromium Smoke만 필수

- **상태:** Active
- **결정일:** 2026-09-15
- **결정:** E2E 테스트는 Playwright의 Chromium 프로젝트 하나만 사용하는 Smoke(핵심 흐름 happy path) 테스트로 한정한다. Firefox/WebKit 크로스 브라우저 테스트, 시각적 회귀 테스트, 부하 테스트는 만들지 않는다.
- **근거:** MVP 단계에서 브라우저 호환성 매트릭스·시각 회귀·부하 테스트까지 자동화하는 것은 과도한 투자라는 범위 판단이며, 대신 `MANUAL-RESPONSIVE-VISUAL`·`MANUAL-PERF-LIGHTHOUSE` 같은 수동 점검으로 나머지를 커버한다.
- **출처:** `TASKS/00_TASK_LIST.md` §2.13, `scripts/audit_tasks.py`(`FORBIDDEN_PLAYWRIGHT_SCOPE`, 검사 15).
- **영향:** `docs/ARCHITECTURE.md` §12가 이 결정을 인용하며, `scripts/audit_tasks.py` 검사 15가 Firefox/WebKit/시각 회귀/부하 테스트 관련 Task 생성을 기계적으로 차단한다.

---

## DEC-010 — 사용자의 개발 실행 단위는 Wave

- **상태:** Active
- **결정일:** 2026-09-16
- **결정:** 이후 구현 진행은 `TASKS/00_TASK_LIST.md`의 개별 Task를 한 번에 하나씩 처리하는 대신, 여러 Task를 묶은 **Wave** 단위로 실행한다. Wave의 구체적 구성(어떤 Task를 어느 Wave에 배정하는지)은 별도 산출물(예: Wave 계획 문서)로 후속 정의한다.
- **근거:** 이전 문서(`TASKS/00_TASK_LIST.md`, `docs/PROJECT_SCOPE.md` 등)에는 "Wave" 개념이 존재하지 않았다 — 이번이 최초 도입이다.
- **출처:** 대화 확정(2026-09-16).
- **영향:** 향후 Wave 계획 문서 작성 시 이 결정을 전제로 삼는다. Wave 분할 기준(화면 단위/우선순위 단위 등)은 아직 별도로 확정되지 않았으며, 확정되면 새 DEC 항목으로 추가한다.

---

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

- **상태:** Active
- **결정일:** 2026-09-16
- **결정:** 하나의 Wave 안에 포함된 여러 Task는 여러 Agent가 병렬로 나눠 처리하지 않고, **단일 Agent(Single Agent)가 순차적으로** 하나씩 수행한다.
- **근거:** 이전 문서에 근거 없음 — 이번이 최초 도입이며, DEC-010(Wave 단위 실행)과 짝을 이루는 실행 방식 결정이다.
- **출처:** 대화 확정(2026-09-16).
- **영향:** Task 간 `depends_on` 순서가 곧 실행 순서가 되며, 병렬 실행을 전제로 한 조율(락, 동시 편집 충돌 방지 등)은 설계하지 않는다.

---

## DEC-012 — PR·Merge는 사용자가 수동 수행

- **상태:** Active
- **결정일:** 2026-09-10 (원칙 최초 명시), 2026-09-16 (재확인)
- **결정:** Pull Request 생성과 병합(Merge)은 자동화하지 않고 항상 사용자가 직접 검토한 뒤 수동으로 수행한다. 무인 자동 Merge Runner를 만들지 않는다.
- **근거:** `docs/PROJECT_SCOPE.md` §3이 "무인 자동 Merge Runner"를 제외 항목으로 명시했고("모든 병합은 수동 검토 후 진행"), 오늘 대화에서 Wave/Single Agent 실행 방식(DEC-010, DEC-011)을 확정하면서도 이 원칙은 변경하지 않았다.
- **출처:** `docs/PROJECT_SCOPE.md` §3, 대화 재확인(2026-09-16).
- **영향:** `docs/ARCHITECTURE.md` §13("병합은 항상 사람이 PR을 검토한 뒤 수동으로 진행"), `TASKS/00_TASK_LIST.md`의 `RELEASE-CI-GATES`(CI 통과는 병합의 필요조건이지 충분조건이 아님)와 일치한다.

---

## DEC-013 — EC2·AWS는 사용하지 않음

- **상태:** Active
- **결정일:** 2026-09-10
- **결정:** 인프라는 Vercel(호스팅) + Supabase(DB/Auth)만 사용하며, EC2·AWS 관련 인프라·설정·Task를 만들지 않는다.
- **근거:** 운영 복잡도를 낮추고 MVP 배포 속도를 우선하는 범위 판단.
- **출처:** `docs/PROJECT_SCOPE.md` §3, `design-reference/SCREEN_ROUTE_CONTRACT.json`(`prohibited_features_global`에 준하는 기술 스택 제약), `docs/ARCHITECTURE.md` §14.
- **영향:** `scripts/audit_tasks.py`(`FORBIDDEN_KEYWORDS`에 "ec2", "aws" 포함, 검사 16)가 EC2/AWS 관련 Task 생성을 기계적으로 차단한다.

---

## DEC-014 — 제외 기능은 EXCLUDED로 관리

- **상태:** Active
- **결정일:** 2026-09-10
- **결정:** 범위에서 제외하는 요구사항(REQ-FUNC-*/REQ-NF-*)은 삭제하지 않고 **EXCLUDED로 명시적으로 분류해 계속 추적**한다. 114개(REQ-FUNC 80 + REQ-NF 34) 요구사항 전수가 IMPLEMENT 또는 EXCLUDED 둘 중 하나로 1회씩 기록되어야 하며, 어느 쪽에도 없는 "누락" 상태를 허용하지 않는다.
- **근거:** 요구사항을 조용히 빠뜨리는 대신, 제외 사실과 그 사유·후속 방향을 문서에 남겨 나중에 재검토할 수 있게 하려는 추적성 원칙.
- **출처:** `docs/PROJECT_SCOPE.md` §3~§5, `TASKS/00_TASK_LIST.md` §4(NON_IMPLEMENTATION, 25건) 및 §5 검증 체크, `scripts/audit_tasks.py`(검사 17: 114개 전수 존재, 검사 18: EXCLUDED 항목에 구현 Task가 붙지 않음).
- **영향:** 새 요구사항이 추가되거나 재검토될 때도 이 원칙(삭제 대신 EXCLUDED 분류)을 유지한다.
