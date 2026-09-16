# SRS UI/UX Revision — Free Traveler

**Document ID:** SRS-UIUX-REV-001
**개정 대상:** `02_SRS_BASELINE.md.md` §3.5(Page and Route Inventory), §3.6(Use Cases의 화면 매핑 관점)
**개정 범위:** 본 문서는 Baseline SRS의 **Route/화면 구조만** 개정한다. `02_SRS_BASELINE.md.md`의 REQ-FUNC-001~080, REQ-NF-001~034 요구사항 본문·우선순위·Acceptance Criteria는 **하나도 변경·삭제하지 않는다.** Baseline SRS는 계속 유효하며, 본 문서는 그 위에 승인된 UI/UX(`design-reference/D-001/DESIGN.md`, `docs/STITCH_VALIDATION_REPORT.md`)를 반영한 addendum이다.

---

## 1. 개정 근거

`02_SRS_BASELINE.md.md` §3.5는 16개 공개 Route(`/`, `/destinations`, `/destinations/domestic`, `/destinations/overseas`, `/destinations/[slug]`, `/flights`, `/hotels`, `/mates`, `/mates/[id]`, `/mates/new`, `/safety`, `/safety/[countryCode]`, `/about`, `/auth/*`, `/my/*`, `/admin/*`)를 가정했다. 이후 `docs/03_UI_COVERAGE_ANALYSIS.md`가 5개 고정 디자인 Screen(SCR-001~005)으로 범위를 확정했고, Stitch에서 해당 5개 Screen(+Mobile 변형 2개)이 생성·검증(`docs/STITCH_VALIDATION_REPORT.md`)되어 `design-reference/D-001/DESIGN.md`로 잠겼다(LOCKED). 본 문서는 이 확정 사실을 SRS Route 인벤토리에 반영한다.

---

## 2. §3.5 Page and Route Inventory — 개정본

Baseline §3.5의 16-Route 표는 아래 표로 **대체**한다(요구사항 자체는 변경 없음 — 기능은 §4 통합 매핑을 통해 5개 Screen 내부로 재배치될 뿐이다).

### 2.1 디자인 Screen (5개, App Router)

| Route | Screen | Page | Access | 비고 |
|---|---|---|---|---|
| `/` | SCR-001 | 메인 | Public | 여행지 탐색 + 국가 안전정보 패널 + 동행글 미리보기 통합 |
| `/about` | SCR-002 | 대표 소개 | Public | |
| `/travel-tools` | SCR-003 | 통합 여행 준비 | Public(동행 탭은 Adult Member 게이트) | 항공편·숙소·동행 구하기 3탭 |
| `/mates` | SCR-004 | 동행 조회 | Public 열람 / Adult Member 쓰기 | 목록+상세 Split/Drawer |
| `/account` | SCR-005 | 계정·관리 | Public(Guest)/Member/Role Restricted(Admin) | 역할별 탭(Guest/Member/Admin) |

### 2.2 기술 Route (Screen 수 미포함)

| Route | Access | 목적 |
|---|---|---|
| `/auth/callback` | Public | Supabase 인증 콜백(가입/로그인/재설정 리다이렉트) |
| `/api/mates`, `/api/mates/[id]/requests`, `/api/mates/[id]/report`, `/api/account/blocklist`, `/api/admin/reports`, `/api/admin/external-links` | Role Restricted(API Route별 상이) | 동행 CRUD, 참가 요청, 신고, 차단, 관리자 처리 |
| `not_found`, `error_boundary` | Public | 404 / 500 |

### 2.3 사라진 것처럼 보이는 기능의 실제 위치

Baseline §3.5의 개별 Route는 삭제된 것이 아니라 아래처럼 통합 Screen 내부 요소로 재배치된다(전체 매핑은 `docs/05_UIUX_APPROVED.md` §2 참조).

| Baseline Route | 재배치 위치 |
|---|---|
| `/destinations`, `/destinations/domestic`, `/destinations/overseas`, `/destinations/[slug]` | SCR-001 Card Grid Section + 상세 Drawer/Modal |
| `/safety`, `/safety/[countryCode]` | SCR-001 안전정보 Card Grid Section + 상세 Drawer/Modal |
| `/flights` | SCR-003 항공편 탭 |
| `/hotels` | SCR-003 숙소 탭 |
| `/mates/new` | SCR-003 동행 구하기 탭 |
| `/mates/[id]` | SCR-004 목록+상세 Split(Desktop)/Drawer(Mobile) |
| `/auth/*` | SCR-005 Guest 탭 + 기술 Route `/auth/callback` |
| `/my/*` | SCR-005 Member 탭(프로필/내 글/참가 요청/차단 목록) |
| `/admin/*` | SCR-005 Admin 탭(신고 상태 변경, 외부 URL 설정 — `PROJECT_SCOPE.md` §2 간소화 범위) |

---

## 3. §3.6 Use Case → Screen 매핑 개정

| Use Case | Baseline Actor | Related Requirements | 개정 Screen |
|---|---|---|---|
| UC-01 여행지 검색·필터·상세 열람 | Guest/Member | REQ-FUNC-001~010 | SCR-001 |
| UC-02 항공 조건 입력·요약·외부 이동 | Guest/Member | REQ-FUNC-011~018 | SCR-003(항공편 탭) |
| UC-03 호텔 조건 입력·요약·외부 이동 | Guest/Member | REQ-FUNC-019~026 | SCR-003(숙소 탭) |
| UC-04 동행 모집글 작성·마감 | Adult Member | REQ-FUNC-027~033, 037~038 | SCR-003(동행 구하기 탭 — 작성) / SCR-004(마감 등 관리) |
| UC-05 동행 참가 요청·승인·거절 | Adult Member | REQ-FUNC-034~036, 043 | SCR-004 |
| UC-06 신고·차단·운영 처리 | Adult Member/Moderator | REQ-FUNC-039~045 | SCR-004(신고·차단) / SCR-005(관리자 탭) |
| UC-07 국가별 안전정보 확인 | Guest/Member | REQ-FUNC-046~056 | SCR-001(안전정보 패널) |
| UC-08 대표 소개 확인 | Guest/Member | REQ-FUNC-057~063 | SCR-002 |
| UC-09 콘텐츠·외부 URL 관리 | Editor/Admin | REQ-FUNC-072~077 | SCR-005(Admin 탭, REQ-FUNC-072~076은 EXCLUDED — §5 참조) |

---

## 4. UI Route Contract

정본: `design-reference/SCREEN_ROUTE_CONTRACT.json`(`schema_version: traveler-screen-route-v1`, `framework: nextjs-app-router`). Screen 배열은 정확히 5개(SCR-001~005)이며 Route·Page Entry 중복이 없다(검증 결과는 `docs/05_UIUX_APPROVED.md` §3.4 참조). 요구사항별 Screen/Route/Page Entry 대응은 `docs/UIUX_TRACEABILITY.md`에서 REQ-FUNC-001~080, REQ-NF-001~034 전체 114건에 대해 1:1로 기록되어 있다.

---

## 5. Release Acceptance Criteria

본 개정 SRS 기준 릴리스는 `docs/05_UIUX_APPROVED.md` §4의 Release Acceptance Criteria(Screen 완전성 / 요구사항 커버리지 / Route·이동 무결성 / 디자인 잠금 준수 / 품질 게이트)를 전부 충족해야 승인된다. 이 기준은 Baseline SRS §5 Traceability Matrix의 수용 기준을 대체하지 않고 그 위에 추가되는 UI/Route 계층 기준이다 — REQ-FUNC/REQ-NF 각 항목의 원래 Acceptance Criteria(`02_SRS_BASELINE.md.md` §4)는 그대로 유효하다.

---

## 6. 요구사항 보존 확인

- `02_SRS_BASELINE.md.md`의 REQ-FUNC-001~080(80개), REQ-NF-001~034(34개) 문구·우선순위·Acceptance Criteria는 본 문서에서 수정하지 않았다.
- `docs/PROJECT_SCOPE.md`에서 `EXCLUDED`로 분류된 25건(REQ-FUNC-042·045·055·056·067·071~076, REQ-NF-004·005·007~011·018·020~022·024·032·033)은 본 개정에서도 동일하게 `EXCLUDED`로 유지하며, 어떤 Screen에도 기능으로 복원하지 않는다.
- 나머지 89건(`IMPLEMENT` 계열)은 §2.3의 재배치 매핑에 따라 5개 Screen 중 하나 이상에 연결되어 있으며, 상세 대응은 `docs/UIUX_TRACEABILITY.md`에서 확인한다.
- 본 문서 작성 시점(2026-09-15)까지 실제로 구현된 요구사항은 없다(`Status=DONE` 0건) — 이는 `docs/UIUX_TRACEABILITY.md`와 `docs/05_UIUX_APPROVED.md` §5에 기록된 정직한 현재 상태이며, 본 문서가 구현 완료를 주장하지 않는다.
