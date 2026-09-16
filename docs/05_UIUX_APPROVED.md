# Free Traveler — UI/UX 승인본

**Document ID:** UIUX-APPROVED-001
**기반 문서:** `02_SRS_BASELINE.md.md`, `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`, `design-reference/DESIGN_MANIFEST.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
**짝 문서:** `docs/06_SRS_UIUX_REVISED.md`(SRS Route 인벤토리 개정), `docs/UIUX_TRACEABILITY.md`(요구사항 114개 전체 추적)

본 문서는 승인된 5개 디자인 Screen(SCR-001~SCR-005)과 프로젝트 범위(`PROJECT_SCOPE.md`)를 연결해, SRS Baseline이 원래 가정했던 다중 공개 Route 구조를 5개 Screen의 탭·패널·모달 구조로 통합했음을 공식화한다. **REQ-FUNC-001~080, REQ-NF-001~034는 어느 것도 삭제하지 않았다** — 요구사항 재배치·추적은 `docs/UIUX_TRACEABILITY.md`에서 1:1로 확인할 수 있다.

---

## 1. 승인 요약

| 항목 | 값 |
|---|---|
| Design Version | D-001 (`design-reference/D-001/DESIGN.md`), Status: LOCKED |
| Stitch Project | `12226533151143086463` (https://stitch.withgoogle.com/projects/12226533151143086463) |
| 승인 Screen | SCR-001~SCR-005 (5개, `docs/STITCH_VALIDATION_REPORT.md` 최종 판정 기준) |
| Mobile 변형 승인 | SCR-001, SCR-003 |
| UI 구현 계약 | `design-reference/UI_CONTRACT.md` |
| Route 계약(기계 판독용) | `design-reference/SCREEN_ROUTE_CONTRACT.json` (`schema_version: traveler-screen-route-v1`) |

---

## 2. 레거시 Route → 승인 Screen 통합 매핑

SRS Baseline(`02_SRS_BASELINE.md.md` §3.5)은 16개 공개 Route를 가정했다. 승인된 디자인은 이를 **5개 Screen**으로 통합하며, 개별 Route가 사라지는 것이 아니라 해당 Screen 내부의 **탭·패널·Drawer·Modal**로 재배치된다.

| SRS Baseline 원래 Route | 통합 대상 Screen | 통합 방식 |
|---|---|---|
| `/` | SCR-001 `/` | 그대로 유지(Hero + 통합 목록) |
| `/destinations` | SCR-001 `/` | 국내·해외 Card Grid Section으로 통합, 별도 Route 없음 |
| `/destinations/domestic` | SCR-001 `/` | "국내 인기 여행지" Section(탭 대신 Section 분리) |
| `/destinations/overseas` | SCR-001 `/` | "해외 인기 여행지" Section |
| `/destinations/[slug]` | SCR-001 `/` | 여행지 상세 **Drawer/Modal**(카드 클릭 시 오픈, 별도 페이지 없음) |
| `/flights` | SCR-003 `/travel-tools` | **항공편 탭** |
| `/hotels` | SCR-003 `/travel-tools` | **숙소 탭** |
| `/safety` | SCR-001 `/` | "국가별 주의사항" Card Grid Section |
| `/safety/[countryCode]` | SCR-001 `/` | 안전정보 상세 **Drawer/Modal**(여행지 상세 Drawer와 연결) |
| `/mates` | SCR-004 `/mates` | 그대로 유지(목록) |
| `/mates/[id]` | SCR-004 `/mates` | 목록+상세 **Split 패널**(Desktop) / 상세 **Drawer**(Mobile), 별도 Route 없음 |
| `/mates/new` | SCR-003 `/travel-tools` | **동행 구하기 탭**의 작성 Form |
| `/about` | SCR-002 `/about` | 그대로 유지 |
| `/auth/*` | SCR-005 `/account` | Guest 상태 탭(로그인/가입/재설정 카드) + 기술 Route `/auth/callback`(세션 콜백만) |
| `/my/*` | SCR-005 `/account` | Member 상태 탭(프로필/내 글/참가 요청/차단 목록) |
| `/admin/*` | SCR-005 `/account` | Admin 상태 탭(신고 상태 변경, 외부 URL 설정) — 간소화 범위(`PROJECT_SCOPE.md` §2) |

**결과:** 16개 Route → **5개 Screen Route + 3종 기술 Route(인증 콜백/API/오류 바운더리)**. 모든 기능은 유지되며, 접근 경로만 탭·패널·모달로 재구성된다.

---

## 3. UI Route Contract

정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다(`schema_version: traveler-screen-route-v1`, `framework: nextjs-app-router`). 요약:

### 3.1 디자인 Screen (정확히 5개)

| Screen ID | Route | Page Entry | Tier |
|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 핵심(core) |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 보조(secondary) |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심(core) |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심(core) |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심(core) |

핵심 4개(SCR-001/003/004/005) · 보조 1개(SCR-002)로 구분한다. 전 Screen에 `page_owner_task_required=true`, `preview_required=true`를 적용하며, SCR-001에는 `starter_template_forbidden=true`를 적용해 `create-next-app` 기본 템플릿으로 되돌리는 것을 금지한다.

### 3.2 기술 Route (Screen 수에 미포함)

| 구분 | Route | 목적 |
|---|---|---|
| 인증 콜백 | `/auth/callback` | Supabase 인증 리다이렉트 |
| API Route | `/api/mates`, `/api/mates/[id]/requests`, `/api/mates/[id]/report`, `/api/account/blocklist`, `/api/admin/reports`, `/api/admin/external-links` | 동행 CRUD·참가요청·신고·차단·관리자 처리 |
| 오류 바운더리 | `not_found`(`src/app/not-found.tsx`), `error_boundary`(`src/app/error.tsx`) | 404/500 |

### 3.3 필수 이동 관계(요약)

SCR-001 ↔ SCR-002/003/004/005, SCR-002 → SCR-001/003/004, SCR-003 → SCR-004/005, SCR-004 → SCR-003/005, SCR-005 → SCR-003/004. 전체 14건은 `SCREEN_ROUTE_CONTRACT.json`의 `required_navigation`에 기록되어 있다.

### 3.4 완료 조건 검증 결과

| 조건 | 결과 |
|---|---|
| Route 중복 없음 | 충족 (`node` 검증: `unique routes: true`) |
| Page Entry 중복 없음 | 충족 (`node` 검증: `unique entries: true`) |
| Screen 수 5 | 충족 |
| 핵심 4개·보조 1개 구분 존재 | 충족 (`tier_summary.core_count=4`, `secondary_count=1`) |

---

## 4. Release Acceptance Criteria

아래 조건을 **모두** 충족해야 5개 Screen 기반 릴리스가 승인 가능하다. 2026-09-15 기준 어느 항목도 충족되지 않았으며(§5 참조), 이는 의도된 정직한 현황 기록이다.

### 4.1 Screen 완전성
- [ ] SCR-001~005 각 Screen이 `design-reference/UI_CONTRACT.md`에 정의된 영역 순서를 전부 렌더링한다(예: SCR-001 7개 Section, SCR-002 7개 Section, SCR-003/004 6개 Section).
- [ ] SCR-001, SCR-003의 Mobile 변형(390px)이 승인된 Stitch 화면과 동일한 정보 구조로 구현된다.
- [ ] Card·Timeline·Gallery 최소 콘텐츠 수(`design-reference/D-001/DESIGN.md` §18)를 충족한다(예: SCR-002 Timeline 6개↑, Gallery 8개↑, 방문국가 Chip 30개↑).

### 4.2 요구사항 커버리지
- [ ] `docs/UIUX_TRACEABILITY.md` 기준 REQ-FUNC-001~080, REQ-NF-001~034 중 `IMPLEMENT` 계열 요구사항(89건)이 모두 `Status=DONE`이다.
- [ ] `EXCLUDED`로 분류된 요구사항(25건)이 어떤 화면에도 임의로 복원되지 않았다.

### 4.3 Route·이동 무결성
- [ ] `SCREEN_ROUTE_CONTRACT.json`의 5개 Route, `required_navigation` 14건이 실제 앱에서 끊김 없이 동작한다.
- [ ] 레거시 16-Route 인벤토리(§2)의 모든 기능이 통합 대상 Screen에서 접근 가능하다(사라진 기능 없음).
- [ ] 기술 Route(인증 콜백, API 6종, 404/500)가 Screen 카운트와 분리되어 존재한다.

### 4.4 디자인 잠금 준수
- [ ] 구현이 `design-reference/D-001/DESIGN.md` 토큰(색상·타이포·간격·반경·그림자)만 사용한다 — 정의되지 않은 임의 색상 없음.
- [ ] Airbnb 상표 요소, 구매·예약·결제 UI, Proprietary 폰트 파일이 어디에도 없다.
- [ ] `design-reference/DESIGN_MANIFEST.md`의 비승인 Screen(중복 SCR-001 2개, 범위 외 화면 1개)이 구현 참조에 사용되지 않았다.

### 4.5 품질 게이트
- [ ] `npm run lint`, `npm run build` 통과.
- [ ] REQ-NF-023/025(접근성 best-effort) 핵심 흐름 키보드 점검 통과.
- [ ] REQ-NF-017(항공·호텔 원시값 미저장) 네트워크/DB 로그 검사 통과.

이 체크리스트가 100% 충족되기 전에는 "구현 완료"를 어떤 문서에도 기록하지 않는다.

---

## 5. 현재 구현 현실 점검 (2026-09-15 기준, 정직한 기록)

저장소 `src/` 직접 확인 결과:

| 항목 | 실제 상태 |
|---|---|
| `src/app/page.tsx` (SCR-001) | Hero Section 1개만 존재. 국내/해외 카드, 테마 Chip, 안전정보, 동행글, 대표 소개 Section은 미구현 |
| `src/app/about/page.tsx` (SCR-002) | 파일 없음 |
| `src/app/travel-tools/page.tsx` (SCR-003) | 파일 없음 |
| `src/app/mates/page.tsx` (SCR-004) | 파일 없음 |
| `src/app/account/page.tsx` (SCR-005) | 파일 없음 |
| `src/components/layout/header.tsx`, `footer.tsx` | 구현됨 — 4-link nav, 코랄 포인트 워드마크, 모바일 햄버거 시트, 3열 Footer가 `design-reference/UI_CONTRACT.md` 공통 규칙과 일치 |
| `src/data/*` | 디렉터리 없음(여행지·안전정보·대표 소개 정적 데이터 미작성) |
| `src/app/api/*`, `src/app/auth/*` | 없음 |
| `src/app/not-found.tsx`, `src/app/error.tsx` | 없음 |
| 테스트 코드(Playwright 등) | 없음 |

상세 요구사항별 현황은 `docs/UIUX_TRACEABILITY.md`를 참조한다. 요약하면 **IN_PROGRESS 8건, UI_SCAFFOLD 1건, NOT_STARTED 80건, EXCLUDED 25건, DONE 0건**이다.

---

## 6. EXCLUDED 확인

본 문서는 `docs/PROJECT_SCOPE.md`에서 `EXCLUDED`로 분류된 요구사항(REQ-FUNC-042·045·055·056·067·071~076, REQ-NF-004·005·007~011·018·020~022·024·032·033, 총 25건)을 승인된 5개 Screen 어디에도 기능으로 복원하지 않는다. 이들은 `docs/UIUX_TRACEABILITY.md`에 `Implementation Status=EXCLUDED`, `Status=EXCLUDED`로 계속 기록되며 삭제되지 않는다.
