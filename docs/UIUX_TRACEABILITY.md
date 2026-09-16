# UI/UX Traceability Matrix

**Document ID:** TRACE-TRAVEL-001
**기반 문서:** `02_SRS_BASELINE.md.md`(REQ-FUNC-001~080, REQ-NF-001~034), `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`

본 매트릭스는 SRS 전체 요구사항 114개(REQ-FUNC 80 + REQ-NF 34)를 **삭제 없이** 1회씩 기록하며, 각 요구사항을 승인된 5개 Screen(`design-reference/SCREEN_ROUTE_CONTRACT.json`)에 연결한다. **Status 열은 2026-09-15 기준 저장소 실제 상태(`src/app`, `src/components`, `src/lib` 직접 확인)를 반영하며, 아직 만들어지지 않은 기능을 구현된 것으로 기록하지 않는다.**

## 열 정의

| 열 | 의미 |
|---|---|
| **Requirement** | SRS 요구사항 ID(괄호 안은 `03_UI_COVERAGE_ANALYSIS.md` 비고 요약) |
| **Implementation Status** | `PROJECT_SCOPE.md`의 범위 분류 — `IMPLEMENT`, `IMPLEMENT(best-effort)`, `IMPLEMENT(간소화)`, `IMPLEMENT(대체)`, `IMPLEMENT(부분)`, `IMPLEMENT(참고치)`, `EXCLUDED` |
| **Screen** | 연결된 승인 Screen ID(SCR-001~005), `GLOBAL`(5개 Screen 공통), 또는 `N/A`(화면 요소 아님) |
| **Route** | App Router 경로, 외부 링크(`EXTERNAL_LINK`), 기술 Route, 또는 `N/A` |
| **Page Entry** | 실제/예정 소스 파일 경로 |
| **Task** | 구현 착수 작업 식별자 — Task 생성 전이므로 IMPLEMENT 계열은 전부 `PENDING_TASK_GENERATION`, EXCLUDED는 `NOT_APPLICABLE` |
| **Test** | `02_SRS_BASELINE.md.md` §5의 계획 테스트 ID(1:1 대응). 저장소에 테스트 코드가 없으므로 전부 `(NOT_WRITTEN)`으로 표기하고, EXCLUDED는 `N/A(EXCLUDED)` |
| **Status** | 실제 코드 상태 — `NOT_STARTED`(미착수) · `UI_SCAFFOLD`(정적 마크업만 존재, 데이터/로직 없음) · `IN_PROGRESS`(부분 구현) · `DONE`(계약 충족) · `EXCLUDED`(범위 제외) |

**확인한 실제 코드:** `src/app/layout.tsx`(전역 Header/Footer 삽입, 루트 metadata), `src/app/page.tsx`(SCR-001 Hero Section 1개만 존재), `src/components/layout/header.tsx`·`footer.tsx`(4-link nav·3열 Footer 구현), `src/lib/nav.ts`. `/about`, `/travel-tools`, `/mates`, `/account`, `src/data`, `src/app/api/*`, `src/app/auth/*`, `not-found.tsx`, `error.tsx`, 테스트 코드는 아직 존재하지 않는다.

---

## F1. Destination Guide (SCR-001 `/`)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-001 (국내/해외 탭) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-001 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-002 (필터바) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-002 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-003 (키워드 검색) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-003 (NOT_WRITTEN) | UI_SCAFFOLD |
| REQ-FUNC-004 (상세 Drawer 필수 콘텐츠) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-004 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-005 (빈 결과 안내·초기화) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-005 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-006 (상세 Drawer 내 안전정보 링크) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-006 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-007 (이미지 alt/출처 메타) | IMPLEMENT | SCR-001 | `/` | `src/data/destinations.ts`(예정) | PENDING_TASK_GENERATION | TC-FUNC-007 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-008 (콘텐츠 수량 확보) | IMPLEMENT | N/A(데이터) | N/A | `src/data/destinations.ts`(예정) | PENDING_TASK_GENERATION | TC-FUNC-008 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-009 (관련 여행지) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-009 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-010 (필터 상태 URL 동기화) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-010 (NOT_WRITTEN) | NOT_STARTED |

## F2. Flight Link-out (SCR-003 `/travel-tools` 항공편 탭)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-011 (입력 폼) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-011 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-012 (국가→지역 종속 선택) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-012 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-013 (날짜 검증 차단) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-013 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-014 (요약 화면) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-014 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-015 (비전달 고지 문구) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-015 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-016 (외부 이동 버튼) | IMPLEMENT | SCR-003 → EXTERNAL_LINK | `/travel-tools` → 외부(새 탭) | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-016 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-017 (서버 미저장) | IMPLEMENT | N/A(클라이언트 상태) | N/A | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-017 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-018 (이동 실패 오류 UI) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-018 (NOT_WRITTEN) | NOT_STARTED |

## F3. Hotel Link-out (SCR-003 `/travel-tools` 숙소 탭)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-019 (입력 폼) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-019 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-020 (국가→지역 종속 선택) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-020 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-021 (날짜 검증 차단) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-021 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-022 (요약 화면) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-022 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-023 (비전달 고지 문구) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-023 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-024 (외부 이동 버튼) | IMPLEMENT | SCR-003 → EXTERNAL_LINK | `/travel-tools` → 외부(새 탭) | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-024 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-025 (서버 미저장) | IMPLEMENT | N/A(클라이언트 상태) | N/A | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-025 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-026 (이동 실패 오류 UI) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-026 (NOT_WRITTEN) | NOT_STARTED |

## F4. Travel Mate (SCR-003 작성 탭 / SCR-004 목록·상세 / SCR-005 계정·관리)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-027 (미인증 시 리다이렉트) | IMPLEMENT | SCR-003, SCR-004 → SCR-005 | `/travel-tools`, `/mates` → `/account` | `src/app/travel-tools/page.tsx`, `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-027 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-028 (성인확인 체크·시각 저장) | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-028 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-029 (프로필 필드) | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-029 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-030 (필터·차단 사용자 제외) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-030 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-031 (작성 폼 필수 필드) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-031 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-032 (연락처 패턴 탐지·차단) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-032 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-033 (연락처 비노출 렌더링) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-033 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-034 (참가 요청 폼) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-034 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-035 (중복 요청 차단 오류) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-035 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-036 (승인/거절 버튼) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-036 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-037 (조회 시 CLOSED 계산) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-037 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-038 (수동 마감/수정/삭제) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-038 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-039 (신고 버튼/모달) | IMPLEMENT | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-039 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-040 (차단 실행/관리) | IMPLEMENT | SCR-004 → SCR-005 | `/mates` → `/account` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-040 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-041 (관리자 신고 상태 필터·변경) | IMPLEMENT(간소화) | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-041 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-042 (경고·숨김·계정제한) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-FUNC-043 (Toast 알림 대체) | IMPLEMENT(대체) | SCR-003, SCR-004 (GLOBAL 컴포넌트) | `/travel-tools`, `/mates` | `src/components/`(예정 Toast) | PENDING_TASK_GENERATION | TC-FUNC-043 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-044 (Supabase RLS) | IMPLEMENT | N/A(백엔드) | N/A | Supabase RLS policies(예정) | PENDING_TASK_GENERATION | TC-FUNC-044 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-045 (탈퇴 버튼만, 정식 삭제 파이프라인 제외) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |

## F5. Country Safety (SCR-001 안전정보 패널)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-046 (해외국가 커버리지) | IMPLEMENT | N/A(데이터) | N/A | `src/data/safety.ts`(예정) | PENDING_TASK_GENERATION | TC-FUNC-046 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-047 (8개 안전 카테고리) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-047 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-048 (출처·확인일 표시) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-048 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-049 (외교부 링크) | IMPLEMENT | SCR-001 → EXTERNAL_LINK | `/` → 외부(새 탭) | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-049 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-050 (stale 계산) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-050 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-051 (중대 경보 상단 표시) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-051 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-052 (국가/지역 범위 구분) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-052 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-053 (긴급연락처) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-053 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-054 (공식 판단 대체 불가 고지) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-054 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-055 (편집·검수·게시 워크플로) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-FUNC-056 (변경 이력 보존) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |

## F6. About free_traveler (SCR-002 `/about`)

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-057 (대표명·수치 카드) | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-057 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-058 (소개문·철학) | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-058 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-059 (방문 권역/국가 목록) | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-059 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-060 (여행 타임라인) | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-060 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-061 (이미지 메타) | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-061 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-062 (문의·SNS 링크) | IMPLEMENT | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-062 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-063 (추천 여행지 6개 연결) | IMPLEMENT | SCR-002 → SCR-001 | `/about` → `/` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-063 (NOT_WRITTEN) | NOT_STARTED |

## F7. Common, Admin, Governance

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-064 (내비게이션·푸터) | IMPLEMENT | GLOBAL(5개 Screen 공통) | `/`, `/about`, `/travel-tools`, `/mates`, `/account` | `src/app/layout.tsx`, `src/components/layout/header.tsx`, `src/components/layout/footer.tsx` | PENDING_TASK_GENERATION | TC-FUNC-064 (NOT_WRITTEN) | IN_PROGRESS |
| REQ-FUNC-065 (반응형 레이아웃) | IMPLEMENT | GLOBAL | 전체 5개 Route | `src/app/layout.tsx`, `src/components/layout/*` | PENDING_TASK_GENERATION | TC-FUNC-065 (NOT_WRITTEN) | IN_PROGRESS |
| REQ-FUNC-066 (가입/로그인/로그아웃/재설정) | IMPLEMENT | SCR-005 | `/account` (+ 기술 Route `/auth/callback`) | `src/app/account/page.tsx`, `src/app/auth/callback/route.ts`(예정) | PENDING_TASK_GENERATION | TC-FUNC-066 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-067 (통합검색) | EXCLUDED | SCR-001(대체: 키워드 검색 003으로 축소) | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-FUNC-068 (즐겨찾기 localStorage) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-068 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-069 (URL 공유) | IMPLEMENT | SCR-001, SCR-004 | `/`, `/mates` | `src/app/page.tsx`, `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-069 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-070 (SEO 메타데이터) | IMPLEMENT | GLOBAL | 전체 5개 Route | `src/app/layout.tsx`(루트 metadata 존재), 각 `page.tsx`(예정) | PENDING_TASK_GENERATION | TC-FUNC-070 (NOT_WRITTEN) | IN_PROGRESS |
| REQ-FUNC-071 (행동 분석 이벤트) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-FUNC-072 (콘텐츠 CRUD) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-FUNC-073 (미디어 업로드 워크플로) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-FUNC-074 (완전성 게이트 자동화) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-FUNC-075 (stale 대시보드) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-FUNC-076 (감사 로그) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-FUNC-077 (관리자 외부 URL 설정) | IMPLEMENT | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-077 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-078 (오류 화면) | IMPLEMENT | N/A(기술 Route) | `not_found`, `error_boundary` | `src/app/not-found.tsx`(예정), `src/app/error.tsx`(예정) | PENDING_TASK_GENERATION | TC-FUNC-078 (NOT_WRITTEN) | NOT_STARTED |
| REQ-FUNC-079 (ARIA·시맨틱) | IMPLEMENT | GLOBAL | 전체 5개 Route | `src/components/layout/header.tsx`(일부 적용), 나머지 컴포넌트 예정 | PENDING_TASK_GENERATION | TC-FUNC-079 (NOT_WRITTEN) | IN_PROGRESS |
| REQ-FUNC-080 (약관/정책/안전수칙 동의) | IMPLEMENT | SCR-003(동의 체크), SCR-005(정책 열람) | `/travel-tools`, `/account` | `src/app/travel-tools/page.tsx`, `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-080 (NOT_WRITTEN) | NOT_STARTED |

---

## NFR — Performance

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-001 (LCP) | IMPLEMENT(best-effort) | GLOBAL | 전체 5개 Route | `src/app/*/page.tsx` | PENDING_TASK_GENERATION | TC-NF-001 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-002 (INP) | IMPLEMENT(best-effort) | GLOBAL | 전체 5개 Route | `src/app/*/page.tsx` | PENDING_TASK_GENERATION | TC-NF-002 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-003 (CLS) | IMPLEMENT(best-effort) | GLOBAL | 전체 5개 Route | `src/app/*/page.tsx` | PENDING_TASK_GENERATION | TC-NF-003 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-004 (필터 응답 p95) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-NF-005 (쓰기 API 응답 p95) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-NF-006 (이미지 최적화) | IMPLEMENT | GLOBAL | 전체 5개 Route | `next/image` 사용 예정 | PENDING_TASK_GENERATION | TC-NF-006 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-007 (Lighthouse CI 게이트) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |

## NFR — Reliability and Recovery

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-008 (가용성 모니터링) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-NF-009 (5xx 모니터링) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-NF-010 (자동 백업) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-NF-011 (자동 링크 검사·알림) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |

## NFR — Security and Privacy

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-012 (TLS) | IMPLEMENT | N/A(인프라) | N/A | Vercel 배포 설정(예정) | PENDING_TASK_GENERATION | TC-NF-012 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-013 (인증·RLS 서버 검증) | IMPLEMENT | N/A(백엔드) | N/A | Supabase RLS policies(예정) | PENDING_TASK_GENERATION | TC-NF-013 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-014 (CSRF/SameSite) | IMPLEMENT | N/A(백엔드) | N/A | `src/app/api/*/route.ts`(예정) | PENDING_TASK_GENERATION | TC-NF-014 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-015 (입력 검증/XSS 방지) | IMPLEMENT | N/A(백엔드/폼) | N/A | 각 Form 컴포넌트(예정) | PENDING_TASK_GENERATION | TC-NF-015 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-016 (환경변수 비밀키) | IMPLEMENT | N/A(인프라) | N/A | Vercel 환경변수(예정) | PENDING_TASK_GENERATION | TC-NF-016 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-017 (항공·호텔 원시값 미저장) | IMPLEMENT | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-NF-017 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-018 (정식 내보내기/삭제 파이프라인) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |

## NFR — Safety and Moderation

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-019 (신고 접수 응답 속도) | IMPLEMENT(best-effort) | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-NF-019 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-020 (SLA 모니터링) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-NF-021 (Rate limiting) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-NF-022 (Moderator 조치 추적성) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |

## NFR — Accessibility

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-023 (WCAG 2.2 AA 목표) | IMPLEMENT(best-effort) | GLOBAL | 전체 5개 Route | `src/components/layout/header.tsx`(일부 적용) | PENDING_TASK_GENERATION | TC-NF-023 (NOT_WRITTEN) | IN_PROGRESS |
| REQ-NF-024 (axe 자동 CI 검사) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-NF-025 (키보드/스크린리더 수동 점검) | IMPLEMENT(부분) | GLOBAL | 전체 5개 Route | `src/components/layout/header.tsx`(Esc/포커스 처리 일부 적용) | PENDING_TASK_GENERATION | TC-NF-025 (NOT_WRITTEN) | IN_PROGRESS |

## NFR — Content, Freshness, SEO, Copyright

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-026 (여행지 콘텐츠 완전성) | IMPLEMENT | N/A(데이터) | N/A | `src/data/destinations.ts`(예정) | PENDING_TASK_GENERATION | TC-NF-026 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-027 (안전정보 커버리지) | IMPLEMENT | N/A(데이터) | N/A | `src/data/safety.ts`(예정) | PENDING_TASK_GENERATION | TC-NF-027 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-028 (stale 표시) | IMPLEMENT | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-NF-028 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-029 (미디어 메타데이터) | IMPLEMENT | N/A(데이터) | N/A | `src/data/*.ts`(예정) | PENDING_TASK_GENERATION | TC-NF-029 (NOT_WRITTEN) | NOT_STARTED |
| REQ-NF-030 (SEO 메타데이터) | IMPLEMENT | GLOBAL | 전체 5개 Route | `src/app/layout.tsx`(루트만 존재) | PENDING_TASK_GENERATION | TC-NF-030 (NOT_WRITTEN) | IN_PROGRESS |

## NFR — Maintainability, Monitoring, Cost

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-031 (타입·lint·테스트 게이트) | IMPLEMENT | N/A(레포지토리 전체) | N/A | `package.json`(`lint`/`build` 스크립트 존재), Playwright 미구성 | PENDING_TASK_GENERATION | TC-NF-031 (NOT_WRITTEN) | IN_PROGRESS |
| REQ-NF-032 (구조화 로그) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-NF-033 (장애 알림) | EXCLUDED | N/A | N/A | N/A | NOT_APPLICABLE | N/A(EXCLUDED) | EXCLUDED |
| REQ-NF-034 (인프라 비용) | IMPLEMENT(참고치) | N/A(운영) | N/A | Vercel/Supabase 요금제(예정) | PENDING_TASK_GENERATION | TC-NF-034 (NOT_WRITTEN) | NOT_STARTED |

---

## 검증 요약

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계(삭제 없음)** | **114** |

| Status | 개수 |
|---|---:|
| DONE | 0 |
| IN_PROGRESS | 8 |
| UI_SCAFFOLD | 1 |
| NOT_STARTED | 80 |
| EXCLUDED | 25 |

Task 열은 EXCLUDED 25건을 제외한 89건 전부 `PENDING_TASK_GENERATION`이다(Task 생성 프로세스가 아직 실행되지 않음). Test 열은 114건 전부 `(NOT_WRITTEN)` 또는 `N/A(EXCLUDED)`이며, 저장소에 테스트 코드가 존재하지 않는 현재 상태를 그대로 반영한다.
