# Free Traveler — Task List

**Document ID:** TASKS-TRAVEL-001
**생성 기준:** `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, 실제 `src/app`/`src/components`/`src/lib` 파일 트리
**선행 검사:** `python scripts/validate_inputs.py` → `VALIDATE_INPUTS_PASS`(검사 수: 11) 확인 후 작성함(2026-09-15 기준).
**범위:** 본 문서는 Task 목록만 정의한다. 구현 코드·Branch·Commit·Issue는 생성하지 않았다.

---

## 0. 요약

| 항목 | 값 |
|---|---:|
| 전체 Task 수 | **76** |
| Page Owner Task | 5 |
| Component Task | 42 |
| Data Task | 3 |
| DB Task | 4 |
| API Task | 7 |
| Unit Test Task | 3 |
| Integration Test Task | 1 |
| E2E(Playwright) Task | 3 |
| Manual Check Task | 5 |
| Release Check Task | 3 |

### Category별 개수

| Category | 개수 |
|---|---:|
| PAGE_OWNER | 5 |
| COMPONENT | 42 |
| DATA | 3 |
| DB | 4 |
| API | 7 |
| UNIT_TEST | 3 |
| INTEGRATION_TEST | 1 |
| E2E_TEST | 3 |
| MANUAL_CHECK | 5 |
| RELEASE_CHECK | 3 |
| **합계** | **76** |

### 요구사항 커버리지 요약

| 구분 | 개수 | 비고 |
|---|---:|---|
| REQ-FUNC-001~080 | 80 | 전부 아래 §3(구현) 또는 §4(NON_IMPLEMENTATION)에 존재 |
| REQ-NF-001~034 | 34 | 전부 아래 §3 또는 §4에 존재 |
| **합계** | **114** | `docs/UIUX_TRACEABILITY.md`와 IMPLEMENT/EXCLUDED 분류 일치(IMPLEMENT 89, EXCLUDED 25) |
| 누락 Requirement ID | **0건** | §3 구현 매핑 + §4 NON_IMPLEMENTATION 매핑을 합쳐 114개 전수 확인 완료(§5 검증 체크 참조) |

이 문서는 "완료"로 보고되지 않는다 — Task는 아직 하나도 실행되지 않았다(모든 Task의 실행 상태는 `NOT_STARTED`이며, Task List 문서 자체의 작성만 완료되었다).

---

## 1. Task ID 네이밍

| 접두사 | Category |
|---|---|
| `PAGE-SCR00N` | PAGE_OWNER |
| `C-SCR00N-<slug>` | COMPONENT(Screen 전용) |
| `C-GLOBAL-<slug>` | COMPONENT(공용) |
| `DATA-<slug>` | DATA |
| `DB-<slug>` | DB |
| `API-<slug>` | API |
| `UNIT-<slug>` | UNIT_TEST |
| `TEST-<slug>` | INTEGRATION_TEST |
| `E2E-<slug>` | E2E_TEST |
| `MANUAL-<slug>` | MANUAL_CHECK |
| `RELEASE-<slug>` | RELEASE_CHECK |

---

## 2. Task List

열: **Seq · Task ID · 제목 · Category · Implementation Status · Requirement Ref · Screen · Route · Page Entry · Depends On · Expected Files · Functional AC · Visual AC · Security/Privacy AC · Verify · Priority**

### 2.1 Page Owner (5)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | PAGE-SCR001 | SCR-001 `/` Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-001~010,068,069 | SCR-001 | `/` | `src/app/page.tsx` | C-SCR001-HERO-SEARCH; C-SCR001-DEST-GRIDS; C-SCR001-THEME-CHIPS; C-SCR001-DEST-DETAIL-DRAWER; C-SCR001-SAFETY-GRID; C-SCR001-SAFETY-DETAIL-DRAWER; C-SCR001-MATES-PREVIEW; C-SCR001-FOUNDER-SPLIT; DATA-DESTINATIONS; DATA-SAFETY; DATA-REPRESENTATIVE; API-MATES; C-GLOBAL-SEO-HELPER | Section 순서를 Hero→국내 6→해외 6→여행 동기 6→국가별 주의사항 6→최근 동행글 3/Empty→free_traveler 소개 순으로 정확히 조립; 각 Section 데이터 출처는 `src/data/destinations.ts`(국내/해외/동기/관련여행지), `src/data/safety.ts`(주의사항), API 동행 목록(최근 동행글), `src/data/about.ts`(소개 요약)로 명시; 최소 Card 수 국내 6·해외 6·주의사항 6, 동행글 3 또는 완성형 Empty State; create-next-app 스타터 마크업을 전부 교체(잔존 스타터 텍스트/로고 0건) | Desktop 1240px 컨테이너, Hero ≈560px(다음 Section 일부 노출), Mobile 390px 1열 스택, Chip 2열; 반응형 콘텐츠 밀도는 D-001 §15 규칙 준수 | 안전정보 stale 계산은 클라이언트 렌더링 시점 계산(REQ-FUNC-050), 즐겨찾기는 localStorage만 사용, 서버 전송 없음 | E2E-PUBLIC-SMOKE; MANUAL-RESPONSIVE-VISUAL | P0 |
| 2 | PAGE-SCR002 | SCR-002 `/about` Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-057~063 | SCR-002 | `/about` | `src/app/about/page.tsx` | C-SCR002-PROFILE-HERO; C-SCR002-INTRO-PHILOSOPHY; C-SCR002-TIMELINE; C-SCR002-COUNTRY-CHIPS; C-SCR002-GALLERY; C-SCR002-MEMORABLE-CTA; C-SCR002-CONTACT-LINKS; DATA-REPRESENTATIVE; DATA-DESTINATIONS; C-GLOBAL-SEO-HELPER | Section 순서를 Profile Hero→여행 지표→소개·철학→Timeline 6→방문 국가 30→Gallery 8→기억에 남는 여행지 4+CTA 순으로 조립; 데이터 출처는 전부 `src/data/about.ts`(방문 국가만 `src/data/about.ts`의 countries 필드, 기억에 남는 여행지는 `src/data/destinations.ts` 교차참조); 최소 Timeline 6개, 방문 국가 Chip 30개, Gallery 8장, 기억에 남는 여행지 카드 4개 | Desktop Hero ≈480px, Gallery 3열/Mobile 2열, 국가 Chip 권역별 그룹 헤딩 | 없음(정적 콘텐츠, 개인정보 미수집) | E2E-PUBLIC-SMOKE; MANUAL-RESPONSIVE-VISUAL; MANUAL-CONTENT-REVIEW | P0 |
| 3 | PAGE-SCR003 | SCR-003 `/travel-tools` Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-011~026,027,028,031,032,080 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | C-SCR003-INTRO-TABS; C-SCR003-FLIGHT-FORM; C-SCR003-HOTEL-FORM; C-SCR003-MATE-COMPOSER; C-SCR003-NONTRANSMIT-TIPS; API-MATES; C-GLOBAL-TOAST; C-GLOBAL-POLICY-TERMS; C-GLOBAL-POLICY-SAFETY-GUIDE; C-GLOBAL-SEO-HELPER | Section 순서를 Intro→탭(항공편/숙소/동행 구하기)→여행정보 Form→입력 요약·외부 이동→찾기 Tip 3→동행 작성 또는 로그인 안내·안전 안내 순으로 조립; 항공편·숙소·동행 구하기 3개 탭을 실제로 한 페이지에서 조립하고 탭 전환 시 각 탭의 입력·검증·완료 상태가 독립적으로 유지됨을 보장; 탭별 데이터 출처는 클라이언트 세션 상태(항공/숙소)와 API(동행 구하기 게시) | Desktop 2열 Form, Mobile 3분할 탭(가로 스크롤 없음), 요약→Action Card 세로 스택(Mobile) | 항공·호텔 입력값을 서버/DB/URL 쿼리로 전송하지 않음(REQ-FUNC-017,025); 동행 작성 폼은 연락처 패턴 탐지 시 제출 자체를 차단 | E2E-TRAVEL-TOOLS; E2E-MATE-AUTH; MANUAL-EXTERNAL-LINKS | P0 |
| 4 | PAGE-SCR004 | SCR-004 `/mates` Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-030,033~040 | SCR-004 | `/mates` | `src/app/mates/page.tsx` | C-SCR004-INTRO-CTA; C-SCR004-FILTER-SUMMARY; C-SCR004-LIST-GRID; C-SCR004-DETAIL-PANEL; C-SCR004-PARTICIPATE-FLOW; C-SCR004-REPORT-MODAL; C-SCR004-BLOCK-ACTION; C-SCR004-STEPS-SAFETY; API-MATES; API-MATE-REQUESTS; API-MATE-REPORT; API-BLOCKLIST; C-GLOBAL-TOAST; C-GLOBAL-SEO-HELPER | Section 순서를 Intro→Filter·결과 요약→동행 목록→상세→신청 방법 3단계→안전·신고·차단 안내와 CTA 순으로 조립; 데이터 출처는 API(`/api/mates`, `/api/mates/[id]/requests`); 목록 최대 8개 카드 우선 노출+"더 보기", 결과 0건이어도 조건 완화 안내+CTA 2개(필터 초기화/작성하기) | Desktop 좌40%목록+우60%상세 Split 고정, Mobile 목록 1열+하단 Drawer 상세 | 카드·상세 어디에도 이메일·전화번호·메신저 ID를 렌더링하지 않음(REQ-FUNC-033); 참가/승인/신고/차단은 인증된 세션에서만 서버 검증 | E2E-MATE-AUTH; MANUAL-RESPONSIVE-VISUAL | P0 |
| 5 | PAGE-SCR005 | SCR-005 `/account` Page Owner | PAGE_OWNER | IMPLEMENT | REQ-FUNC-028,029,040,041,066,077 | SCR-005 | `/account` | `src/app/account/page.tsx` | C-SCR005-AUTH-GUEST; C-SCR005-PROFILE; C-SCR005-MY-ACTIVITY; C-SCR005-ADMIN-REPORTS; C-SCR005-ADMIN-EXTERNAL-URL; C-SCR005-ROLE-GATE; API-AUTH-CALLBACK; API-ADMIN-REPORTS; API-ADMIN-EXTERNAL-LINKS; API-BLOCKLIST; C-GLOBAL-POLICY-TERMS; C-GLOBAL-POLICY-PRIVACY; C-GLOBAL-SEO-HELPER | Guest·Member·Admin 중 현재 역할의 Intro→핵심 작업→도움말/다음 행동을 실제로 조립하고, 역할에 없는 관리 영역(예: 비Admin 사용자에게 신고/외부URL 탭)은 렌더링 자체를 생략; 데이터 출처는 Supabase Auth 세션 + `/api/admin/*`; 내 글/참가 요청/차단/신고 목록은 0건이어도 완성형 Empty State | 탭 상단 고정, Desktop Form 2열, Mobile 탭 스크롤 1행+Form 1열 | 성인확인은 `is_adult`+`adult_verified_at`만 저장(생년월일 미저장); role 미달 시 Admin 탭 URL 직접 접근해도 "권한 없음" 안내로 대체(서버 RLS로도 재검증) | E2E-MATE-AUTH; MANUAL-A11Y-KEYBOARD | P0 |

### 2.2 SCR-001 Component (8)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | C-SCR001-HERO-SEARCH | Hero 검색 입력 로직 연결 | COMPONENT | IMPLEMENT | REQ-FUNC-003,010 | SCR-001 | `/` | `src/app/page.tsx`(사용처) | DATA-DESTINATIONS | `src/components/home/hero-search.tsx` | 기존 정적 검색 인풋에 부분 일치 키워드 검색·빈 결과 상태를 연결하고 필터 상태를 URL query로 동기화·복원 | 기존 pill 검색바 스타일 유지 | 없음 | UNIT-TRAVEL-DATES(해당없음); E2E-PUBLIC-SMOKE | P0 |
| 7 | C-SCR001-DEST-GRIDS | 국내/해외 여행지 Card Grid | COMPONENT | IMPLEMENT | REQ-FUNC-001,002,004,005,009 | SCR-001 | `/` | `src/app/page.tsx`(사용처) | DATA-DESTINATIONS | `src/components/home/destination-grids.tsx` | 국내 6개·해외 6개 카드(16:10 이미지) 렌더링, 국가·도시·계절·테마·기간 AND 필터, 결과 0건 시 조건완화 안내+초기화 버튼, 카드 클릭 시 상세 Drawer 오픈 | Desktop 3열, Mobile 1열 스택, 가로 스크롤 캐러셀 금지 | 없음 | E2E-PUBLIC-SMOKE; MANUAL-CONTENT-REVIEW | P0 |
| 8 | C-SCR001-THEME-CHIPS | 여행 동기 Chip 필터 | COMPONENT | IMPLEMENT | REQ-FUNC-002 | SCR-001 | `/` | `src/app/page.tsx`(사용처) | C-SCR001-DEST-GRIDS | `src/components/home/theme-chips.tsx` | 6개 테마 Chip, 선택 시 Grid 필터 결과로 스크롤 이동, 선택 상태 coral-soft | Desktop 1행, Mobile 2열 그리드 | 없음 | E2E-PUBLIC-SMOKE | P1 |
| 9 | C-SCR001-DEST-DETAIL-DRAWER | 여행지 상세 Drawer(즐겨찾기·공유 포함) | COMPONENT | IMPLEMENT | REQ-FUNC-004,006,007,009,068,069 | SCR-001 | `/` | `src/app/page.tsx`(사용처) | DATA-DESTINATIONS; C-SCR001-SAFETY-DETAIL-DRAWER | `src/components/home/destination-detail-drawer.tsx` | 소개·명소 5개↑·추천시기·1일/3일 일정·예산·교통·음식 3개↑·에티켓·출처·수정일 전부 표시, 안전정보 패널 링크, 관련 여행지 최대 6개, 즐겨찾기 토글(localStorage, 중복 방지), URL 공유(Web Share API 실패 시 URL 복사 폴백) | Desktop 우측 슬라이드 480~560px, Mobile 하단 Bottom Sheet(80%까지 확장, drag handle) | 즐겨찾기는 서버 전송 없이 localStorage만 사용 | E2E-PUBLIC-SMOKE; MANUAL-A11Y-KEYBOARD | P0 |
| 10 | C-SCR001-SAFETY-GRID | 국가별 주의사항 Card Grid | COMPONENT | IMPLEMENT | REQ-FUNC-047,048,050,051,052; REQ-NF-028 | SCR-001 | `/` | `src/app/page.tsx`(사용처) | DATA-SAFETY | `src/components/home/safety-grid.tsx` | 6개국 카드, 경보 단계 배지(텍스트+아이콘)+최종 확인일, stale(7일 경과) 렌더링 시점 계산해 재확인 경고 표시, 국가/지역 범위 구분 | Desktop 3열, Mobile 1열 | 없음 | E2E-PUBLIC-SMOKE | P0 |
| 11 | C-SCR001-SAFETY-DETAIL-DRAWER | 안전정보 상세 Drawer | COMPONENT | IMPLEMENT | REQ-FUNC-049,053,054 | SCR-001 | `/` | `src/app/page.tsx`(사용처) | DATA-SAFETY | `src/components/home/safety-detail-drawer.tsx` | 8개 안전 카테고리 전체, 외교부 원문 링크(새 탭, `noopener,noreferrer`), 긴급연락처(현지+영사콜센터), "공식 판단 대체 불가" 고지 상단 노출 | Desktop/Mobile Drawer 패턴 재사용 | 외부 링크는 `rel="noopener noreferrer"` 필수 | MANUAL-EXTERNAL-LINKS | P0 |
| 12 | C-SCR001-MATES-PREVIEW | 최근 동행글 미리보기 | COMPONENT | IMPLEMENT | REQ-FUNC-069(부분) | SCR-001 | `/` | `src/app/page.tsx`(사용처) | API-MATES | `src/components/home/mates-preview.tsx` | 데이터 있으면 3개 카드(국가·기간·모집상태), 없으면 완성형 Empty State("아직 등록된 동행글이 없어요..." + 동행글 작성하기 CTA) — Lorem ipsum·준비 중·정보 확인 필요·빈 카드 금지 | Desktop/Mobile 카드 그리드 공통 패턴 | 카드에 연락처 미노출(REQ-FUNC-033과 동일 규칙 적용) | E2E-PUBLIC-SMOKE | P1 |
| 13 | C-SCR001-FOUNDER-SPLIT | free_traveler 소개 요약 Split | COMPONENT | IMPLEMENT | REQ-FUNC-057(부분) | SCR-001 | `/` | `src/app/page.tsx`(사용처) | DATA-REPRESENTATIVE | `src/components/home/founder-split.tsx` | 소개문 2~3문장 + `50+ Trips`/`30+ Countries` 지표, "대표 이야기 더 보기" → `/about` CTA | Desktop 좌우분할, Mobile 세로 스택(사진→텍스트→CTA) | 없음 | MANUAL-CONTENT-REVIEW | P1 |

### 2.3 SCR-002 Component (7)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 14 | C-SCR002-PROFILE-HERO | Profile Hero + 여행 지표 카드 | COMPONENT | IMPLEMENT | REQ-FUNC-057 | SCR-002 | `/about` | `src/app/about/page.tsx`(사용처) | DATA-REPRESENTATIVE | `src/components/about/profile-hero.tsx` | 대표 사진+이름+한 문장 소개, `50+ Trips`/`30+ Countries` 지표 카드 2개 이상, 홈 소개 카드와 수치 일치 | Desktop 정방형 사진+텍스트, Mobile 세로 스택, Hero ≈480px | 없음 | E2E-PUBLIC-SMOKE | P1 |
| 15 | C-SCR002-INTRO-PHILOSOPHY | 소개·철학 Split | COMPONENT | IMPLEMENT | REQ-FUNC-058 | SCR-002 | `/about` | `src/app/about/page.tsx`(사용처) | DATA-REPRESENTATIVE | `src/components/about/intro-philosophy.tsx` | 자기소개/여행을 시작한 이유/여행 철학 목차형 소제목 + 2~4문단 본문 | Desktop 좌목차+우본문, Mobile 세로 스택 | 없음 | MANUAL-CONTENT-REVIEW | P1 |
| 16 | C-SCR002-TIMELINE | 여행 Timeline | COMPONENT | IMPLEMENT | REQ-FUNC-060 | SCR-002 | `/about` | `src/app/about/page.tsx`(사용처) | DATA-REPRESENTATIVE | `src/components/about/timeline.tsx` | 최소 6개 항목, 각 연도·장소명·1문장 요약 | Desktop 세로 타임라인, Mobile 폭만 축소 | 없음 | MANUAL-CONTENT-REVIEW | P1 |
| 17 | C-SCR002-COUNTRY-CHIPS | 방문 국가 Chip(권역별) | COMPONENT | IMPLEMENT | REQ-FUNC-059 | SCR-002 | `/about` | `src/app/about/page.tsx`(사용처) | DATA-REPRESENTATIVE | `src/components/about/country-chips.tsx` | 최소 30개국, 권역별(아시아/유럽/북미/오세아니아 등) 그룹 헤딩, 관련 여행지 있으면 SCR-001 이동·없으면 비활성 스타일 | Desktop 권역별 가로 배치, Mobile 세로 스택 | 없음 | MANUAL-CONTENT-REVIEW | P1 |
| 18 | C-SCR002-GALLERY | 여행 Gallery | COMPONENT | IMPLEMENT | REQ-FUNC-061; REQ-NF-006,029 | SCR-002 | `/about` | `src/app/about/page.tsx`(사용처) | DATA-REPRESENTATIVE | `src/components/about/gallery.tsx` | 최소 8장, 실제 장소·구도를 설명하는 alt 문장, 출처/작가 캡션, `next/image` responsive+lazy load | Desktop 3열, Mobile 2열 | 없음 | MANUAL-CONTENT-REVIEW; MANUAL-PERF-LIGHTHOUSE | P1 |
| 19 | C-SCR002-MEMORABLE-CTA | 기억에 남는 여행지 + CTA Banner | COMPONENT | IMPLEMENT | REQ-FUNC-063 | SCR-002 | `/about` | `src/app/about/page.tsx`(사용처) | DATA-DESTINATIONS | `src/components/about/memorable-cta.tsx` | 카드 4개, 비공개 여행지는 자동 제외+대체 후보, 하단 CTA Banner 버튼 2개(`/travel-tools`,`/mates`) | Desktop 카드+Banner, Mobile 1열 스택+Banner | 없음 | E2E-PUBLIC-SMOKE | P1 |
| 20 | C-SCR002-CONTACT-LINKS | 문의·SNS 링크 | COMPONENT | IMPLEMENT | REQ-FUNC-062 | SCR-002 | `/about` | `src/app/about/page.tsx`(사용처) | DATA-REPRESENTATIVE | `src/components/about/contact-links.tsx` | 관리자 설정 기반 링크, 빈 값은 렌더링하지 않음, 허용 프로토콜(mailto/https)만 오픈 | 아이콘+텍스트 인라인 링크 | 허용 프로토콜 외 링크 차단 | MANUAL-EXTERNAL-LINKS | P2 |

### 2.4 SCR-003 Component (5)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 21 | C-SCR003-INTRO-TABS | Intro Banner + Tabs Shell | COMPONENT | IMPLEMENT | (조립 전용, 요구사항 없음) | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx`(사용처) | 없음 | `src/components/travel-tools/intro-tabs.tsx` | 목적+이용 순서(입력→요약확인→이동) 배너, 항공편/숙소/동행 구하기 3개 밑줄형 탭, 탭 전환 시 다른 탭 상태 보존 | Desktop 3탭 1행, Mobile 3분할(가로 스크롤 없음) | 없음 | E2E-TRAVEL-TOOLS | P0 |
| 22 | C-SCR003-FLIGHT-FORM | 항공 조건 입력·요약·외부 이동 | COMPONENT | IMPLEMENT | REQ-FUNC-011~018; REQ-NF-017 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx`(사용처) | C-GLOBAL-TOAST | `src/components/travel-tools/flight-form.tsx`, `src/lib/validation/travel-dates.ts` | 국가·지역·출발일·귀국일 필수 입력, 국가 변경 시 지역 초기화, 날짜 역전/과거 출발일 차단, 유효 입력 후 요약 표시(세션 유지), 비전달 고지 문구, 외부 URL `noopener,noreferrer` 새 탭(목적지·날짜 query 없음), URL 미설정/허용목록 밖이면 오류+재시도 | Desktop 2열 Form, Mobile 1열 | 입력값을 서버 API·로그·분석에 저장하지 않음(클라이언트 상태만) | UNIT-TRAVEL-DATES; E2E-TRAVEL-TOOLS; MANUAL-EXTERNAL-LINKS | P0 |
| 23 | C-SCR003-HOTEL-FORM | 숙소 조건 입력·요약·외부 이동 | COMPONENT | IMPLEMENT | REQ-FUNC-019~026; REQ-NF-017 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx`(사용처) | C-GLOBAL-TOAST | `src/components/travel-tools/hotel-form.tsx` | 국가·지역·체크인·체크아웃 필수 입력, 국가 변경 시 지역 초기화, 체크인 과거/체크아웃≤체크인 차단, 요약이 입력값과 정확히 일치, 비전달 고지, 외부 URL `noopener,noreferrer`, 오류 시 이동 차단+입력값 유지 | Desktop 2열 Form, Mobile 1열 | 입력값을 서버 API·로그·분석에 저장하지 않음 | UNIT-TRAVEL-DATES; E2E-TRAVEL-TOOLS; MANUAL-EXTERNAL-LINKS | P0 |
| 24 | C-SCR003-MATE-COMPOSER | 동행 모집글 작성 Form(인증 게이트) | COMPONENT | IMPLEMENT | REQ-FUNC-027,028,031,032,080 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx`(사용처) | API-MATES; C-GLOBAL-POLICY-SAFETY-GUIDE | `src/components/travel-tools/mate-composer-form.tsx`, `src/lib/validation/contact-detection.ts` | 미인증/미성년 시 로그인·성인확인 안내 CTA Banner로 폼 자체를 렌더하지 않음; 인증 완료 시 제목·국가·기간·모집인원·스타일·설명·안전수칙 동의 Form(필수값·날짜역전·과거종료일 차단); 본문 전화번호/이메일/메신저ID 패턴 탐지 시 제출 차단+수정 안내 | Desktop/Mobile Form 1열 공통 | 연락처 패턴 탐지율 기준 테스트셋 95%↑/오탐 5%↓ 목표, 안전수칙 동의(버전·시각) 기록 | UNIT-CONTACT-DETECTION; E2E-MATE-AUTH | P0 |
| 25 | C-SCR003-NONTRANSMIT-TIPS | 비전달 고지 + Tip 3개 | COMPONENT | IMPLEMENT | REQ-FUNC-015,023 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx`(사용처) | 없음 | `src/components/travel-tools/nontransmit-tips.tsx` | "입력값은 외부 사이트로 전달되지 않습니다" 정보 배너 + 실질적 도움 되는 팁 카드 3개(빈 카드 금지) | Desktop/Mobile 3장 카드(Desktop 가로/Mobile 세로) | 없음 | E2E-TRAVEL-TOOLS | P1 |

### 2.5 SCR-004 Component (8)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 26 | C-SCR004-INTRO-CTA | Intro CTA Banner | COMPONENT | IMPLEMENT | (조립 전용) | SCR-004 | `/mates` | `src/app/mates/page.tsx`(사용처) | 없음 | `src/components/mates/intro-cta.tsx` | "믿을 수 있는 동행을 찾아보세요" + 설명 1문장 + 우측 상단 "동행글 작성하기" CTA(비인증 시 로그인 유도로 전환) | Desktop 우측 고정, Mobile 전체폭 버튼 | 없음 | E2E-MATE-AUTH | P1 |
| 27 | C-SCR004-FILTER-SUMMARY | Filter + 결과 요약 | COMPONENT | IMPLEMENT | REQ-FUNC-030 | SCR-004 | `/mates` | `src/app/mates/page.tsx`(사용처) | API-MATES | `src/components/mates/filter-summary.tsx` | 국가·지역·기간·연령대·성별·스타일·모집상태 필터(AND), 차단 사용자 글 제외, "조건에 맞는 동행글 N개" 텍스트 결과 | Desktop 1행, Mobile 접이식 패널 | 없음 | E2E-MATE-AUTH | P0 |
| 28 | C-SCR004-LIST-GRID | 동행글 목록 Card Grid | COMPONENT | IMPLEMENT | REQ-FUNC-030,033,037 | SCR-004 | `/mates` | `src/app/mates/page.tsx`(사용처) | API-MATES | `src/components/mates/list-grid.tsx` | 최대 8개 카드 우선 노출+"더 보기", 종료일 경과 글은 조회 시 CLOSED 표시, 카드에 연락처 미노출, 0건 시 완성형 Empty State(문구+필터초기화+작성하기) | Desktop 좌40% 목록, Mobile 1열 | 연락처 필드 HTML/JSON 응답 미포함 | E2E-MATE-AUTH | P0 |
| 29 | C-SCR004-DETAIL-PANEL | 목록+상세 Split/Drawer, 작성자 액션 | COMPONENT | IMPLEMENT | REQ-FUNC-034,036,037,038,069(부분) | SCR-004 | `/mates` | `src/app/mates/page.tsx`(사용처) | API-MATES; API-MATE-REQUESTS; C-SCR004-PARTICIPATE-FLOW | `src/components/mates/detail-panel.tsx` | 카드 클릭 시 상세 갱신, 작성자에게 승인/거절·수동 마감/수정/삭제 버튼(비작성자 403), 승인 요청자 있으면 일정 변경 전 경고, URL 공유 | Desktop 우60% 고정 패널, Mobile 하단 Drawer(80%까지, drag handle) | 비작성자의 관리 액션은 서버 RLS로도 거부 | E2E-MATE-AUTH | P0 |
| 30 | C-SCR004-PARTICIPATE-FLOW | 참가 요청 제출(중복 차단) | COMPONENT | IMPLEMENT | REQ-FUNC-034,035 | SCR-004 | `/mates` | `src/app/mates/page.tsx`(사용처) | API-MATE-REQUESTS | `src/components/mates/participate-request-form.tsx` | 최대 500자 비공개 참가 메시지, 제출 시 PENDING 저장, 동일 사용자의 동일 글 중복 PENDING/ACCEPTED 제출 시 UI 오류 표시 | Detail Panel 내 임베드 | 메시지는 작성자·요청자만 열람(RLS) | UNIT-MATE-STATE; E2E-MATE-AUTH | P0 |
| 31 | C-SCR004-REPORT-MODAL | 신고 버튼/모달 | COMPONENT | IMPLEMENT | REQ-FUNC-039; REQ-NF-019 | SCR-004 | `/mates` | `src/app/mates/page.tsx`(사용처) | API-MATE-REPORT | `src/components/mates/report-modal.tsx` | 사유 코드+설명 입력, 접수 시 신고 ID·접수 시각 3초 이내 표시 | Modal(D-001 Drawer/Modal 규칙 준용) | 신고 내용은 작성자에게 공개되지 않음 | E2E-MATE-AUTH | P1 |
| 32 | C-SCR004-BLOCK-ACTION | 차단 실행 버튼 | COMPONENT | IMPLEMENT | REQ-FUNC-040 | SCR-004 | `/mates` | `src/app/mates/page.tsx`(사용처) | API-BLOCKLIST | `src/components/mates/block-button.tsx` | 차단 실행 후 상호 글·프로필·요청 노출 즉시 차단, 차단 해제는 SCR-005에서 관리 | Detail Panel 내 버튼 | 차단 상태는 RLS로 서버 측에서도 강제 | E2E-MATE-AUTH | P1 |
| 33 | C-SCR004-STEPS-SAFETY | 신청 방법 3단계 + 안전 안내 CTA | COMPONENT | IMPLEMENT | (콘텐츠 Section, 요구사항 간접) | SCR-004 | `/mates` | `src/app/mates/page.tsx`(사용처) | 없음 | `src/components/mates/steps-safety-banner.tsx` | "①조건에 맞는 글 찾기→②참가 메시지 보내기→③작성자 승인 기다리기" 3카드, 안전 안내 Banner(공개 연락처 금지·신고·차단 안내)+`/travel-tools` CTA | Desktop 3카드 가로, Mobile 세로 스택 | 없음 | E2E-MATE-AUTH | P1 |

### 2.6 SCR-005 Component (6)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 34 | C-SCR005-AUTH-GUEST | Guest 로그인/가입/재설정 카드 | COMPONENT | IMPLEMENT | REQ-FUNC-066 | SCR-005 | `/account` | `src/app/account/page.tsx`(사용처) | API-AUTH-CALLBACK | `src/components/account/auth-guest.tsx` | 로그인/가입/비밀번호 재설정 3개 Form 진입 카드, 보안 안내("암호화 저장")+개인정보처리방침 링크 | Desktop/Mobile 카드 3개 스택 | 인증되지 않은 이메일은 동행 쓰기 권한 없음 | E2E-MATE-AUTH; MANUAL-A11Y-KEYBOARD | P0 |
| 35 | C-SCR005-PROFILE | Member 프로필 Form + 성인확인 배지 | COMPONENT | IMPLEMENT | REQ-FUNC-028,029 | SCR-005 | `/account` | `src/app/account/page.tsx`(사용처) | DB-SCHEMA-BASE | `src/components/account/profile-form.tsx` | 닉네임·연령대·여행스타일 필수, 성별 선택, 성인확인 상태 요약 배지("성인 인증 완료 · YYYY-MM-DD") | Desktop Form 2열, Mobile 1열 | 정확한 생년월일 미저장, `is_adult`+`adult_verified_at`만 저장 | E2E-MATE-AUTH | P0 |
| 36 | C-SCR005-MY-ACTIVITY | 내 글·참가 요청·차단 목록 | COMPONENT | IMPLEMENT | REQ-FUNC-040(관리) | SCR-005 | `/account` | `src/app/account/page.tsx`(사용처) | API-MATES; API-BLOCKLIST | `src/components/account/my-activity.tsx` | 내 글/참가 요청/차단 목록 각각 Card Grid, 0건이면 완성형 Empty State(각각 지정 문구+CTA) | Desktop 목록형, Mobile 1열 | 본인 데이터만 조회(RLS) | E2E-MATE-AUTH | P0 |
| 37 | C-SCR005-ADMIN-REPORTS | 관리자 신고 상태 변경 | COMPONENT | IMPLEMENT(간소화) | REQ-FUNC-041 | SCR-005 | `/account` | `src/app/account/page.tsx`(사용처) | API-ADMIN-REPORTS | `src/components/account/admin-reports.tsx` | OPEN/RESOLVED/DISMISSED 필터+상태 변경, Moderator/Admin에게만 탭 노출, 처리할 신고 없으면 "현재 처리할 신고가 없어요" | Filter+List 패턴 | Moderator/Admin 외 접근 시 렌더링 자체 생략(서버 재검증) | E2E-MATE-AUTH | P1 |
| 38 | C-SCR005-ADMIN-EXTERNAL-URL | 관리자 외부 URL 설정 | COMPONENT | IMPLEMENT | REQ-FUNC-077 | SCR-005 | `/account` | `src/app/account/page.tsx`(사용처) | API-ADMIN-EXTERNAL-LINKS | `src/components/account/admin-external-links.tsx` | 항공·호텔 외부 URL을 허용목록 내 HTTPS로만 저장, 저장 성공 시 인라인 확인 메시지 | Form(단일 컬럼) | HTTP·javascript·data URL 저장 거부 | E2E-TRAVEL-TOOLS | P1 |
| 39 | C-SCR005-ROLE-GATE | 역할별 탭 렌더링/차단 로직 | COMPONENT | IMPLEMENT | (조립·보안 로직, REQ-FUNC-044 연계) | SCR-005 | `/account` | `src/app/account/page.tsx`(사용처) | DB-RLS-BASE | `src/components/account/role-gate.tsx` | 비로그인→Guest, 로그인→Member 탭, Moderator/Admin만 Admin 탭 노출; 권한 없는 사용자가 Admin URL 직접 접근 시 "접근 권한이 없어요"+홈 이동 CTA | 없음(로직 컴포넌트) | 클라이언트 role 표시는 서버 RLS 검증과 항상 일치 | TEST-RLS-BASIC; E2E-MATE-AUTH | P0 |

### 2.7 공용(GLOBAL) Component (8)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 40 | C-GLOBAL-TOAST | Toast/알림 컴포넌트 | COMPONENT | IMPLEMENT(대체) | REQ-FUNC-043 | GLOBAL | 없음(오버레이) | N/A | 없음 | `src/components/ui/toast.tsx` | 참가요청 접수/승인/거절/신고처리 결과를 Toast로 표시(이메일 대체), 4초 자동 소멸+수동 닫기, 성공/오류/정보 타입 구분(색상+아이콘+텍스트) | Desktop 우하단 고정, Mobile 상단 고정 | 없음 | E2E-MATE-AUTH | P1 |
| 41 | C-GLOBAL-SEO-HELPER | SEO 메타데이터 헬퍼 | COMPONENT | IMPLEMENT | REQ-FUNC-070; REQ-NF-030 | GLOBAL | 없음 | N/A | 없음 | `src/lib/seo.ts` | title/description/canonical/OpenGraph 빌더 유틸(각 Page Owner가 자신의 `page.tsx`에서 호출해 `export const metadata`로 사용); 본 Task는 `src/lib/seo.ts`만 소유하며 어떤 Page Entry도 직접 소유하지 않음(rule 16) | 해당 없음 | 없음 | MANUAL-PERF-LIGHTHOUSE | P1 |
| 42 | C-GLOBAL-NOT-FOUND | 404 오류 화면 | COMPONENT | IMPLEMENT | REQ-FUNC-078 | N/A(기술 Route) | `not_found` | `src/app/not-found.tsx` | 없음 | `src/app/not-found.tsx` | 홈 이동 CTA 최소 1개 제공 | D-001 토큰 재사용 | 없음 | E2E-PUBLIC-SMOKE | P1 |
| 43 | C-GLOBAL-ERROR-BOUNDARY | 500/런타임 오류 바운더리 | COMPONENT | IMPLEMENT | REQ-FUNC-078 | N/A(기술 Route) | `error_boundary` | `src/app/error.tsx` | 없음 | `src/app/error.tsx` | 재시도 버튼 최소 1개 제공, 외부 연결 실패 시 "현재 외부 사이트에 연결할 수 없어요" 패턴 재사용 | D-001 토큰 재사용 | 없음 | E2E-TRAVEL-TOOLS | P1 |
| 44 | C-GLOBAL-NAV-FOOTER-EXTEND | Header/Footer 확장(신규 Route 반영) | COMPONENT | IMPLEMENT | REQ-FUNC-064,065,079 | GLOBAL | 전체 5개 Route | `src/app/layout.tsx`(사용처) | 없음 | `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`(기존 파일 확장, 신규 생성 아님) | 5개 Screen 모두에서 동일 Header/Footer 노출 확인, 핵심 기능 2회 이내 이동 검증, ARIA/포커스 트랩 기존 구현 유지·확장 | Desktop 72px/Mobile 56px sticky 기존 유지 | 없음 | E2E-PUBLIC-SMOKE; MANUAL-A11Y-KEYBOARD | P0 |
| 45 | C-GLOBAL-POLICY-TERMS | 이용약관 정적 페이지 | COMPONENT | IMPLEMENT | REQ-FUNC-080 | N/A(정책 콘텐츠) | `/terms` | `src/app/terms/page.tsx` | 없음 | `src/app/terms/page.tsx` | Footer "이용약관" 링크가 실제 콘텐츠로 연결 | D-001 토큰, 본문형 레이아웃 | 없음 | MANUAL-CONTENT-REVIEW | P2 |
| 46 | C-GLOBAL-POLICY-PRIVACY | 개인정보 처리방침 정적 페이지 | COMPONENT | IMPLEMENT | REQ-FUNC-080 | N/A(정책 콘텐츠) | `/privacy` | `src/app/privacy/page.tsx` | 없음 | `src/app/privacy/page.tsx` | Footer/보안 안내 링크가 실제 콘텐츠로 연결 | D-001 토큰, 본문형 레이아웃 | 없음 | MANUAL-CONTENT-REVIEW | P2 |
| 47 | C-GLOBAL-POLICY-SAFETY-GUIDE | 동행 안전수칙 정적 페이지 | COMPONENT | IMPLEMENT | REQ-FUNC-080 | N/A(정책 콘텐츠) | `/safety-guide` | `src/app/safety-guide/page.tsx` | 없음 | `src/app/safety-guide/page.tsx` | 동행 작성 폼 동의 체크박스가 참조하는 실제 안전수칙 본문 제공, 버전 표기 | D-001 토큰, 본문형 레이아웃 | 없음 | MANUAL-CONTENT-REVIEW | P2 |

### 2.8 Data (3, 필수)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 48 | DATA-DESTINATIONS | 여행지 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-001,002,004,005,007,008,009,010; REQ-NF-026,029 | SCR-001, SCR-002 | N/A | N/A | 없음 | `src/data/destinations.ts` | 국내 10개↑·해외 15개국 30개 도시↑, 각 항목 소개·명소5개↑·추천시기·1일/3일 일정·예산·교통·음식3개↑·에티켓·출처·수정일 스키마 강제(TypeScript 타입으로 필수 필드 미충족 시 컴파일 오류); 이미지 alt/출처/작가/라이선스 필드 포함 | 해당 없음(데이터 파일) | 없음 | MANUAL-CONTENT-REVIEW | P0 |
| 49 | DATA-SAFETY | 국가 안전정보 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-046,047,048,052,053; REQ-NF-027 | SCR-001 | N/A | N/A | DATA-DESTINATIONS | `src/data/safety.ts` | 게시되는 모든 해외 국가에 안전정보 1건 이상, 8개 카테고리(치안/사기/법규/교통/재난·기후/보건/문화·복장/긴급연락처) 스키마 강제, 출처명·URL·최종확인일·편집자 필드, `scope_type`/`scope_text` | 해당 없음 | 없음 | MANUAL-CONTENT-REVIEW | P0 |
| 50 | DATA-REPRESENTATIVE | 대표 소개 정적 데이터 | DATA | IMPLEMENT | REQ-FUNC-057~062; REQ-NF-029 | SCR-002 | N/A | N/A | 없음 | `src/data/about.ts` | 대표명·`50+ Trips`·`30+ Countries`(단일 소스, 홈/대표 페이지 공통 참조), 소개문·철학, 방문 국가 30개↑(권역 포함), Timeline 6개↑, Gallery 8장↑(alt/출처/작가/라이선스), 문의/SNS 링크 | 해당 없음 | 없음 | MANUAL-CONTENT-REVIEW | P0 |

### 2.9 DB (4, 필수)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 51 | DB-SCHEMA-BASE | Supabase 스키마(6개 테이블) | DB | IMPLEMENT | REQ-FUNC-028,029,031,035,040,041,044,066,077 | N/A(백엔드) | N/A | N/A | 없음 | `supabase/migrations/0001_schema.sql` | 정확히 6개 테이블만 생성: `profiles`, `mate_posts`, `mate_applications`, `blocks`, `reports`, `external_links`(7번째 테이블 생성 금지); `mate_applications`에 동일 사용자·동일 글 중복 PENDING/ACCEPTED 방지 unique 제약 | 해당 없음 | 비밀키 없이 스키마 자체는 공개 가능 | TEST-RLS-BASIC | P0 |
| 52 | DB-RLS-BASE | Row Level Security 정책 | DB | IMPLEMENT | REQ-FUNC-044; REQ-NF-013 | N/A(백엔드) | N/A | N/A | DB-SCHEMA-BASE | `supabase/migrations/0002_rls.sql` | 본인 글/요청, 요청 대상 작성자, Moderator/Admin만 비공개 데이터 열람; 권한별 부정 접근 시나리오가 전부 403 또는 빈 결과 | 해당 없음 | 6개 테이블 전부 RLS 활성화(RLS 비활성 테이블 0건) | TEST-RLS-BASIC | P0 |
| 53 | DB-ACCESS | 서버 데이터 접근 레이어 | DB | IMPLEMENT | REQ-FUNC-044; REQ-NF-014,015 | N/A(백엔드) | N/A | N/A | DB-SCHEMA-BASE; DB-RLS-BASE | `src/lib/supabase/queries.ts` | 모든 API Route가 이 레이어를 통해서만 DB 접근, 입력 검증(zod 등)으로 저장 XSS 차단 | 해당 없음 | CSRF/SameSite 쿠키 기본값 사용, 비밀키는 환경변수로만 참조 | TEST-RLS-BASIC | P0 |
| 54 | DB-SEED-BASE | 개발·테스트 Seed 데이터 | DB | IMPLEMENT | (테스트 지원, 요구사항 간접) | N/A(백엔드) | N/A | N/A | DB-SCHEMA-BASE | `supabase/seed.sql` | E2E/RLS 테스트에 필요한 최소 사용자 3역할(Adult Member/Moderator/Admin)·동행글·신고 샘플 데이터 | 해당 없음 | Seed 데이터는 실제 개인정보 미포함(가상 데이터만) | TEST-RLS-BASIC; E2E-MATE-AUTH | P1 |

### 2.10 API (7)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 55 | API-MATES | 동행글 목록·생성 API | API | IMPLEMENT | REQ-FUNC-030,031 | SCR-003, SCR-004 | `/api/mates` | `src/app/api/mates/route.ts` | DB-SCHEMA-BASE; DB-RLS-BASE; DB-ACCESS | `src/app/api/mates/route.ts` | GET: 필터 조건(AND)·차단 사용자 제외 후 목록 반환; POST: 인증+성인확인 세션 필수(401/리다이렉트), 연락처 패턴 서버측 재검증 | 해당 없음 | 미인증 POST 100% 차단 | UNIT-MATE-STATE; TEST-RLS-BASIC | P0 |
| 56 | API-MATE-REQUESTS | 참가 요청·승인/거절 API | API | IMPLEMENT | REQ-FUNC-034,035,036,037,038 | SCR-004 | `/api/mates/[id]/requests` | `src/app/api/mates/[id]/requests/route.ts` | API-MATES; DB-ACCESS | `src/app/api/mates/[id]/requests/route.ts` | POST: 중복 PENDING/ACCEPTED 차단(DB unique+애플리케이션 검증); PATCH: 작성자만 승인/거절(비작성자 403); 종료일 경과 글은 조회 시 CLOSED로 표시 | 해당 없음 | 참가 메시지는 작성자·요청자만 조회 가능 | UNIT-MATE-STATE; TEST-RLS-BASIC | P0 |
| 57 | API-MATE-REPORT | 신고 접수 API | API | IMPLEMENT | REQ-FUNC-039; REQ-NF-019 | SCR-004 | `/api/mates/[id]/report` | `src/app/api/mates/[id]/report/route.ts` | DB-ACCESS | `src/app/api/mates/[id]/report/route.ts` | 사유 코드+설명 저장, 신고 ID·접수 시각 응답(목표 p95 3초 이내) | 해당 없음 | 신고 대상에게 신고자 식별정보 미노출 | TEST-RLS-BASIC | P1 |
| 58 | API-BLOCKLIST | 차단 실행/해제 API | API | IMPLEMENT | REQ-FUNC-040 | SCR-004, SCR-005 | `/api/account/blocklist` | `src/app/api/account/blocklist/route.ts` | DB-ACCESS | `src/app/api/account/blocklist/route.ts` | POST 차단/DELETE 해제, 차단 후 상호 글·프로필·요청 노출 즉시 차단 | 해당 없음 | 본인 세션의 차단만 생성/해제 가능(RLS) | TEST-RLS-BASIC | P1 |
| 59 | API-ADMIN-REPORTS | 관리자 신고 상태 변경 API | API | IMPLEMENT(간소화) | REQ-FUNC-041 | SCR-005 | `/api/admin/reports` | `src/app/api/admin/reports/route.ts` | DB-ACCESS | `src/app/api/admin/reports/route.ts` | GET 필터(OPEN/RESOLVED/DISMISSED), PATCH 상태 변경, Moderator/Admin 외 403 | 해당 없음 | role 서버 재검증(클라이언트 role 신뢰 금지) | TEST-RLS-BASIC | P1 |
| 60 | API-ADMIN-EXTERNAL-LINKS | 관리자 외부 URL 설정 API | API | IMPLEMENT | REQ-FUNC-077 | SCR-005 | `/api/admin/external-links` | `src/app/api/admin/external-links/route.ts` | DB-ACCESS | `src/app/api/admin/external-links/route.ts` | PATCH: HTTPS+허용목록 검증, HTTP/javascript/data URL 저장 거부, Admin 외 403 | 해당 없음 | 허용목록 밖 URL 저장 0건 | TEST-RLS-BASIC | P1 |
| 61 | API-AUTH-CALLBACK | Supabase 인증 콜백 | API | IMPLEMENT | REQ-FUNC-066,027 | SCR-005 | `/auth/callback` | `src/app/auth/callback/route.ts` | DB-SCHEMA-BASE | `src/app/auth/callback/route.ts` | 가입/로그인/비밀번호 재설정 리다이렉트 처리, 세션 발급 후 `/account`로 복귀 | 해당 없음 | 인증되지 않은 이메일은 동행 쓰기 권한 미부여 | E2E-MATE-AUTH | P0 |

### 2.11 Unit Test (3, 필수)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 62 | UNIT-TRAVEL-DATES | 날짜 검증 단위 테스트 | UNIT_TEST | IMPLEMENT | REQ-FUNC-013,021 | SCR-003 | N/A | N/A | C-SCR003-FLIGHT-FORM; C-SCR003-HOTEL-FORM | `src/lib/validation/travel-dates.test.ts` | 항공(과거 출발일/역전 귀국일)·숙소(과거 체크인/체크아웃≤체크인) 경계값 테스트에서 잘못된 조합 100% 차단 | 해당 없음 | 없음 | RELEASE-CI-GATES | P0 |
| 63 | UNIT-CONTACT-DETECTION | 연락처 탐지 단위 테스트 | UNIT_TEST | IMPLEMENT | REQ-FUNC-032 | SCR-003 | N/A | N/A | C-SCR003-MATE-COMPOSER | `src/lib/validation/contact-detection.test.ts` | 기준 테스트셋 기준 탐지율 95%↑, 오탐 5%↓ | 해당 없음 | 없음 | RELEASE-CI-GATES | P0 |
| 64 | UNIT-MATE-STATE | 모집 상태·요청 상태 전이 단위 테스트 | UNIT_TEST | IMPLEMENT | REQ-FUNC-035,036,037 | SCR-004 | N/A | N/A | API-MATE-REQUESTS | `src/lib/mates/status.test.ts` | PENDING→ACCEPTED/REJECTED 전이, 중복 PENDING/ACCEPTED 차단, 종료일 경과→CLOSED 계산 전부 테스트로 검증 | 해당 없음 | 없음 | RELEASE-CI-GATES | P0 |

### 2.12 Integration Test (1, 필수)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 65 | TEST-RLS-BASIC | RLS 정책 기본 통합 테스트 | INTEGRATION_TEST | IMPLEMENT | REQ-FUNC-044; REQ-NF-013 | N/A(백엔드) | N/A | N/A | DB-RLS-BASE; DB-SEED-BASE | `tests/rls/rls.spec.ts` | 역할별(비회원/Adult Member/타인/작성자/Moderator/Admin) 부정 접근 시나리오가 전부 403 또는 빈 결과로 귀결되는지 자동 검증 | 해당 없음 | 이 Task 자체가 보안 검증 Task | RELEASE-CI-GATES | P0 |

### 2.13 E2E(Playwright) (3, 필수 — Chromium 전용 Smoke)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 66 | E2E-PUBLIC-SMOKE | 공개 흐름 Chromium Smoke(2개 흐름) | E2E_TEST | IMPLEMENT | REQ-FUNC-001,004,006,046~054,057~063,064,065,078 | SCR-001, SCR-002 | `/`, `/about` | N/A | PAGE-SCR001; PAGE-SCR002 | `playwright.config.ts`, `tests/e2e/public-smoke.spec.ts` | Chromium 단일 브라우저로 ①여행지 탐색→필터→상세→안전정보 Drawer, ②대표 소개 열람→SCR-001 이동, 2개 핵심 흐름의 happy path만 검증(비회원, 로그인 불필요) | 해당 없음 | 없음 | RELEASE-CI-GATES | P0 |
| 67 | E2E-TRAVEL-TOOLS | 여행 준비 Chromium Smoke(2개 흐름) | E2E_TEST | IMPLEMENT | REQ-FUNC-011~026 | SCR-003 | `/travel-tools` | N/A | PAGE-SCR003 | `tests/e2e/travel-tools.spec.ts` | Chromium 단일 브라우저로 ①항공 조건 입력→요약→외부 이동 새 탭 오픈 확인(네트워크 탭에 목적지·날짜 query 없음 assert), ②숙소 조건 동일 흐름, 2개 핵심 흐름 happy path만 검증 | 해당 없음 | 입력값이 어떤 네트워크 요청 body/query에도 나타나지 않음을 자동 assert | RELEASE-CI-GATES | P0 |
| 68 | E2E-MATE-AUTH | 동행·인증 Chromium Smoke(3개 흐름) | E2E_TEST | IMPLEMENT | REQ-FUNC-027,028,034,036,039,040,066 | SCR-003, SCR-004, SCR-005 | `/travel-tools`, `/mates`, `/account` | N/A | PAGE-SCR003; PAGE-SCR004; PAGE-SCR005 | `tests/e2e/mate-auth.spec.ts` | Chromium 단일 브라우저로 ①로그인→성인확인→동행 작성, ②참가 요청→작성자 승인, ③신고/차단 실행, 3개 핵심 흐름 happy path만 검증(Seed 계정 사용) | 해당 없음 | 미인증 상태에서 쓰기 액션 전부 차단됨을 assert | RELEASE-CI-GATES | P0 |

### 2.14 Manual Check (5)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 69 | MANUAL-CONTENT-REVIEW | 콘텐츠 완전성·출처 수동 검수 | MANUAL_CHECK | IMPLEMENT | REQ-FUNC-007,008,046,061; REQ-NF-026,027,029 | SCR-001, SCR-002 | N/A | N/A(코드 파일 없음) | DATA-DESTINATIONS; DATA-SAFETY; DATA-REPRESENTATIVE | 없음(수동 점검, 코드 파일 없음) | 국내 10개↑/해외 15개국 30개 도시↑/전체 해외국가 안전정보 커버리지 100%/모든 공개 이미지 alt·출처·작가·라이선스 100% 육안 검수 후 체크리스트 서명 | 해당 없음 | 없음 | 자기완결(본 Task가 곧 Verify) | P1 |
| 70 | MANUAL-A11Y-KEYBOARD | 키보드·스크린리더 수동 점검 | MANUAL_CHECK | IMPLEMENT(부분) | REQ-FUNC-079; REQ-NF-023,025 | SCR-001~005 | N/A | N/A(코드 파일 없음) | PAGE-SCR001; PAGE-SCR002; PAGE-SCR003; PAGE-SCR004; PAGE-SCR005 | 없음(수동 점검, 코드 파일 없음) | 핵심 UC(여행지 탐색, 항공/숙소 입력, 동행 참가, 로그인) 100% 키보드만으로 완주, 포커스 링 가시성, Drawer/Modal 포커스 트랩 확인 | 해당 없음 | 없음 | 자기완결 | P1 |
| 71 | MANUAL-RESPONSIVE-VISUAL | Desktop/Mobile 시각·리듬 점검 | MANUAL_CHECK | IMPLEMENT | REQ-FUNC-064,065 | SCR-001~005 | N/A | N/A(코드 파일 없음) | PAGE-SCR001; PAGE-SCR002; PAGE-SCR003; PAGE-SCR004; PAGE-SCR005 | 없음(수동 점검, 코드 파일 없음) | 1440px/390px 육안 확인: Hero 높이 규칙(다음 Section 일부 노출), Section 패턴 반복 금지 리듬, 카드 그리드 1열 Mobile 전환, 빈 여백·Placeholder 문구 부재 | 해당 없음 | 없음 | 자기완결 | P0 |
| 72 | MANUAL-PERF-LIGHTHOUSE | Lighthouse 수동 실행 | MANUAL_CHECK | IMPLEMENT(best-effort) | REQ-NF-001,002,003,006 | SCR-001~005 | N/A | N/A(코드 파일 없음) | PAGE-SCR001; PAGE-SCR002; PAGE-SCR003; PAGE-SCR004; PAGE-SCR005 | 없음(수동 점검, 코드 파일 없음) | 중급 모바일/4G 기준 LCP/INP/CLS 목표치 best-effort 측정 및 기록(자동 CI 게이트 아님) | 해당 없음 | 없음 | 자기완결 | P2 |
| 73 | MANUAL-EXTERNAL-LINKS | 외부 링크·미전송 수동 점검 | MANUAL_CHECK | IMPLEMENT | REQ-FUNC-016,018,024,026,049; REQ-NF-017 | SCR-001, SCR-003 | N/A | N/A(코드 파일 없음) | C-SCR003-FLIGHT-FORM; C-SCR003-HOTEL-FORM; C-SCR001-SAFETY-DETAIL-DRAWER | 없음(수동 점검, 코드 파일 없음) | 항공/숙소/외교부 외부 링크 실제 열림 확인, 새 탭 `noopener,noreferrer`, 네트워크 탭에서 입력값 미전송 육안 재확인 | 해당 없음 | 없음 | 자기완결 | P0 |

### 2.15 Release Check (3, 필수)

| Seq | Task ID | 제목 | Category | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 74 | RELEASE-CI-GATES | CI 파이프라인(lint/build/test) | RELEASE_CHECK | IMPLEMENT | REQ-NF-031 | N/A | N/A | N/A | UNIT-TRAVEL-DATES; UNIT-CONTACT-DETECTION; UNIT-MATE-STATE; TEST-RLS-BASIC; E2E-PUBLIC-SMOKE; E2E-TRAVEL-TOOLS; E2E-MATE-AUTH | `.github/workflows/ci.yml` | `npm run lint`, `npm run build`, Unit/Integration/E2E 전체가 main 병합 전 CI에서 통과해야 병합 가능 | 해당 없음 | 없음 | 자기완결 | P0 |
| 75 | RELEASE-VERCEL-DEPLOY-CHECK | Vercel 배포·환경변수 확인 | RELEASE_CHECK | IMPLEMENT | REQ-NF-012,016,034 | N/A | N/A | N/A | RELEASE-CI-GATES | 없음(환경 설정 확인, 코드 파일 없음) | TLS 1.2+ 기본 적용 확인, 비밀키가 클라이언트 번들에 미포함(빌드 산출물 검사), 무료/저비용 티어 요금 참고치 확인 | 해당 없음 | 비밀키 클라이언트 노출 0건 | 자기완결 | P1 |
| 76 | RELEASE-SUPABASE-CHECK | Supabase 프로젝트·RLS·Auth 확인 | RELEASE_CHECK | IMPLEMENT | REQ-NF-013,014 | N/A | N/A | N/A | DB-RLS-BASE; DB-SCHEMA-BASE | 없음(환경 설정 확인, 코드 파일 없음) | 운영 프로젝트에서도 6개 테이블 전부 RLS 활성 상태 확인, CSRF/SameSite 쿠키 기본 설정 확인 | 해당 없음 | 개발/운영 프로젝트 키 분리 확인 | 자기완결 | P1 |

---

## 3. Requirement Ref 인덱스(§2 표에서 참조된 IMPLEMENT 요구사항 → Task ID, 89개 전수)

| Requirement | Implementation Status | Task ID(s) | Verify |
|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | PAGE-SCR001, C-SCR001-DEST-GRIDS | E2E-PUBLIC-SMOKE |
| REQ-FUNC-002 | IMPLEMENT | C-SCR001-DEST-GRIDS, C-SCR001-THEME-CHIPS | E2E-PUBLIC-SMOKE |
| REQ-FUNC-003 | IMPLEMENT | C-SCR001-HERO-SEARCH | E2E-PUBLIC-SMOKE |
| REQ-FUNC-004 | IMPLEMENT | PAGE-SCR001, C-SCR001-DEST-GRIDS, C-SCR001-DEST-DETAIL-DRAWER, DATA-DESTINATIONS | E2E-PUBLIC-SMOKE |
| REQ-FUNC-005 | IMPLEMENT | C-SCR001-DEST-GRIDS | E2E-PUBLIC-SMOKE |
| REQ-FUNC-006 | IMPLEMENT | PAGE-SCR001, C-SCR001-DEST-DETAIL-DRAWER | E2E-PUBLIC-SMOKE |
| REQ-FUNC-007 | IMPLEMENT | DATA-DESTINATIONS | MANUAL-CONTENT-REVIEW |
| REQ-FUNC-008 | IMPLEMENT | DATA-DESTINATIONS | MANUAL-CONTENT-REVIEW |
| REQ-FUNC-009 | IMPLEMENT | C-SCR001-DEST-GRIDS, C-SCR001-DEST-DETAIL-DRAWER | E2E-PUBLIC-SMOKE |
| REQ-FUNC-010 | IMPLEMENT | PAGE-SCR001, C-SCR001-HERO-SEARCH | E2E-PUBLIC-SMOKE |
| REQ-FUNC-011~018 | IMPLEMENT | PAGE-SCR003, C-SCR003-FLIGHT-FORM | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS |
| REQ-FUNC-019~026 | IMPLEMENT | PAGE-SCR003, C-SCR003-HOTEL-FORM | UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS |
| REQ-FUNC-027 | IMPLEMENT | PAGE-SCR003, C-SCR003-MATE-COMPOSER, C-SCR005-AUTH-GUEST, API-AUTH-CALLBACK | E2E-MATE-AUTH |
| REQ-FUNC-028 | IMPLEMENT | PAGE-SCR003, PAGE-SCR005, C-SCR003-MATE-COMPOSER, C-SCR005-PROFILE | E2E-MATE-AUTH |
| REQ-FUNC-029 | IMPLEMENT | PAGE-SCR005, C-SCR005-PROFILE | E2E-MATE-AUTH |
| REQ-FUNC-030 | IMPLEMENT | PAGE-SCR004, C-SCR004-FILTER-SUMMARY, C-SCR004-LIST-GRID, API-MATES | E2E-MATE-AUTH |
| REQ-FUNC-031 | IMPLEMENT | PAGE-SCR003, C-SCR003-MATE-COMPOSER, API-MATES | E2E-MATE-AUTH |
| REQ-FUNC-032 | IMPLEMENT | PAGE-SCR003, C-SCR003-MATE-COMPOSER | UNIT-CONTACT-DETECTION |
| REQ-FUNC-033 | IMPLEMENT | C-SCR004-LIST-GRID, C-SCR004-DETAIL-PANEL | E2E-MATE-AUTH |
| REQ-FUNC-034 | IMPLEMENT | PAGE-SCR004, C-SCR004-DETAIL-PANEL, C-SCR004-PARTICIPATE-FLOW, API-MATE-REQUESTS | E2E-MATE-AUTH |
| REQ-FUNC-035 | IMPLEMENT | C-SCR004-PARTICIPATE-FLOW, API-MATE-REQUESTS, DB-SCHEMA-BASE | UNIT-MATE-STATE |
| REQ-FUNC-036 | IMPLEMENT | PAGE-SCR004, C-SCR004-DETAIL-PANEL, API-MATE-REQUESTS | UNIT-MATE-STATE, E2E-MATE-AUTH |
| REQ-FUNC-037 | IMPLEMENT | PAGE-SCR004, C-SCR004-LIST-GRID, C-SCR004-DETAIL-PANEL, API-MATE-REQUESTS | UNIT-MATE-STATE |
| REQ-FUNC-038 | IMPLEMENT | PAGE-SCR004, C-SCR004-DETAIL-PANEL | E2E-MATE-AUTH |
| REQ-FUNC-039 | IMPLEMENT | C-SCR004-REPORT-MODAL, API-MATE-REPORT | E2E-MATE-AUTH |
| REQ-FUNC-040 | IMPLEMENT | C-SCR004-BLOCK-ACTION, C-SCR005-MY-ACTIVITY, PAGE-SCR005, API-BLOCKLIST | E2E-MATE-AUTH |
| REQ-FUNC-041 | IMPLEMENT(간소화) | PAGE-SCR005, C-SCR005-ADMIN-REPORTS, API-ADMIN-REPORTS | E2E-MATE-AUTH |
| REQ-FUNC-043 | IMPLEMENT(대체) | C-GLOBAL-TOAST | E2E-MATE-AUTH |
| REQ-FUNC-044 | IMPLEMENT | DB-RLS-BASE, C-SCR005-ROLE-GATE, API-MATES, API-MATE-REQUESTS | TEST-RLS-BASIC |
| REQ-FUNC-046 | IMPLEMENT | DATA-SAFETY | MANUAL-CONTENT-REVIEW |
| REQ-FUNC-047 | IMPLEMENT | C-SCR001-SAFETY-GRID, DATA-SAFETY | E2E-PUBLIC-SMOKE |
| REQ-FUNC-048 | IMPLEMENT | C-SCR001-SAFETY-GRID, DATA-SAFETY | E2E-PUBLIC-SMOKE |
| REQ-FUNC-049 | IMPLEMENT | C-SCR001-SAFETY-DETAIL-DRAWER | MANUAL-EXTERNAL-LINKS |
| REQ-FUNC-050 | IMPLEMENT | C-SCR001-SAFETY-GRID | E2E-PUBLIC-SMOKE |
| REQ-FUNC-051 | IMPLEMENT | C-SCR001-SAFETY-GRID | E2E-PUBLIC-SMOKE |
| REQ-FUNC-052 | IMPLEMENT | C-SCR001-SAFETY-GRID, DATA-SAFETY | E2E-PUBLIC-SMOKE |
| REQ-FUNC-053 | IMPLEMENT | C-SCR001-SAFETY-DETAIL-DRAWER, DATA-SAFETY | MANUAL-EXTERNAL-LINKS |
| REQ-FUNC-054 | IMPLEMENT | C-SCR001-SAFETY-DETAIL-DRAWER | E2E-PUBLIC-SMOKE |
| REQ-FUNC-057 | IMPLEMENT | PAGE-SCR001, PAGE-SCR002, C-SCR001-FOUNDER-SPLIT, C-SCR002-PROFILE-HERO, DATA-REPRESENTATIVE | E2E-PUBLIC-SMOKE |
| REQ-FUNC-058 | IMPLEMENT | C-SCR002-INTRO-PHILOSOPHY, DATA-REPRESENTATIVE | MANUAL-CONTENT-REVIEW |
| REQ-FUNC-059 | IMPLEMENT | C-SCR002-COUNTRY-CHIPS, DATA-REPRESENTATIVE | MANUAL-CONTENT-REVIEW |
| REQ-FUNC-060 | IMPLEMENT | C-SCR002-TIMELINE, DATA-REPRESENTATIVE | MANUAL-CONTENT-REVIEW |
| REQ-FUNC-061 | IMPLEMENT | C-SCR002-GALLERY, DATA-REPRESENTATIVE | MANUAL-CONTENT-REVIEW |
| REQ-FUNC-062 | IMPLEMENT | C-SCR002-CONTACT-LINKS, DATA-REPRESENTATIVE | MANUAL-EXTERNAL-LINKS |
| REQ-FUNC-063 | IMPLEMENT | PAGE-SCR002, C-SCR002-MEMORABLE-CTA | E2E-PUBLIC-SMOKE |
| REQ-FUNC-064 | IMPLEMENT | C-GLOBAL-NAV-FOOTER-EXTEND | E2E-PUBLIC-SMOKE, MANUAL-RESPONSIVE-VISUAL |
| REQ-FUNC-065 | IMPLEMENT | C-GLOBAL-NAV-FOOTER-EXTEND | MANUAL-RESPONSIVE-VISUAL |
| REQ-FUNC-066 | IMPLEMENT | PAGE-SCR005, C-SCR005-AUTH-GUEST, API-AUTH-CALLBACK | E2E-MATE-AUTH |
| REQ-FUNC-068 | IMPLEMENT | C-SCR001-DEST-DETAIL-DRAWER | E2E-PUBLIC-SMOKE |
| REQ-FUNC-069 | IMPLEMENT | C-SCR001-DEST-DETAIL-DRAWER, C-SCR004-DETAIL-PANEL | E2E-PUBLIC-SMOKE |
| REQ-FUNC-070 | IMPLEMENT | C-GLOBAL-SEO-HELPER | MANUAL-PERF-LIGHTHOUSE |
| REQ-FUNC-077 | IMPLEMENT | PAGE-SCR005, C-SCR005-ADMIN-EXTERNAL-URL, API-ADMIN-EXTERNAL-LINKS | E2E-TRAVEL-TOOLS |
| REQ-FUNC-078 | IMPLEMENT | C-GLOBAL-NOT-FOUND, C-GLOBAL-ERROR-BOUNDARY | E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS |
| REQ-FUNC-079 | IMPLEMENT | C-GLOBAL-NAV-FOOTER-EXTEND | MANUAL-A11Y-KEYBOARD |
| REQ-FUNC-080 | IMPLEMENT | C-SCR003-MATE-COMPOSER, C-GLOBAL-POLICY-TERMS, C-GLOBAL-POLICY-PRIVACY, C-GLOBAL-POLICY-SAFETY-GUIDE | MANUAL-CONTENT-REVIEW |
| REQ-NF-001 | IMPLEMENT(best-effort) | (전체 Page Owner, best-effort 성능 목표) | MANUAL-PERF-LIGHTHOUSE |
| REQ-NF-002 | IMPLEMENT(best-effort) | (전체 Page Owner) | MANUAL-PERF-LIGHTHOUSE |
| REQ-NF-003 | IMPLEMENT(best-effort) | (전체 Page Owner) | MANUAL-PERF-LIGHTHOUSE |
| REQ-NF-006 | IMPLEMENT | C-SCR001-DEST-GRIDS, C-SCR002-GALLERY | MANUAL-PERF-LIGHTHOUSE |
| REQ-NF-012 | IMPLEMENT | RELEASE-VERCEL-DEPLOY-CHECK | RELEASE-VERCEL-DEPLOY-CHECK |
| REQ-NF-013 | IMPLEMENT | DB-RLS-BASE, DB-ACCESS, RELEASE-SUPABASE-CHECK | TEST-RLS-BASIC |
| REQ-NF-014 | IMPLEMENT | DB-ACCESS, RELEASE-SUPABASE-CHECK | TEST-RLS-BASIC |
| REQ-NF-015 | IMPLEMENT | DB-ACCESS, C-SCR003-MATE-COMPOSER | RELEASE-CI-GATES |
| REQ-NF-016 | IMPLEMENT | RELEASE-VERCEL-DEPLOY-CHECK | RELEASE-VERCEL-DEPLOY-CHECK |
| REQ-NF-017 | IMPLEMENT | C-SCR003-FLIGHT-FORM, C-SCR003-HOTEL-FORM | MANUAL-EXTERNAL-LINKS |
| REQ-NF-019 | IMPLEMENT(best-effort) | API-MATE-REPORT | E2E-MATE-AUTH |
| REQ-NF-023 | IMPLEMENT(best-effort) | C-GLOBAL-NAV-FOOTER-EXTEND | MANUAL-A11Y-KEYBOARD |
| REQ-NF-025 | IMPLEMENT(부분) | (핵심 UC 컴포넌트 전반) | MANUAL-A11Y-KEYBOARD |
| REQ-NF-026 | IMPLEMENT | DATA-DESTINATIONS | MANUAL-CONTENT-REVIEW |
| REQ-NF-027 | IMPLEMENT | DATA-SAFETY | MANUAL-CONTENT-REVIEW |
| REQ-NF-028 | IMPLEMENT | C-SCR001-SAFETY-GRID | E2E-PUBLIC-SMOKE |
| REQ-NF-029 | IMPLEMENT | DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE | MANUAL-CONTENT-REVIEW |
| REQ-NF-030 | IMPLEMENT | C-GLOBAL-SEO-HELPER | MANUAL-PERF-LIGHTHOUSE |
| REQ-NF-031 | IMPLEMENT | RELEASE-CI-GATES | RELEASE-CI-GATES |
| REQ-NF-034 | IMPLEMENT(참고치) | RELEASE-VERCEL-DEPLOY-CHECK | RELEASE-VERCEL-DEPLOY-CHECK |

> 표기가 `REQ-FUNC-011~018`/`REQ-FUNC-019~026`처럼 범위로 묶인 행은 8개 ID 각각(011,012,013,014,015,016,017,018 / 019,020,021,022,023,024,025,026)이 동일한 Task 집합에 연결됨을 의미하며, 개별 ID 누락은 없다(§5 검증 체크에서 展開 확인).

---

## 4. NON_IMPLEMENTATION (EXCLUDED, 25개 — `docs/PROJECT_SCOPE.md` 근거 그대로 유지, 삭제 없음)

| Requirement | 근거(PROJECT_SCOPE.md) | 후속 방향 |
|---|---|---|
| REQ-FUNC-042 | 경고·콘텐츠 숨김·계정 일시 제한 등 정교한 제재 조치는 제외. 관리자는 신고 상태값 변경만 수행(REQ-FUNC-041로 대체) | 향후 운영 규모가 커지면 별도 Moderation 서비스로 확장 검토, 현재는 C-SCR005-ADMIN-REPORTS 범위 밖으로 유지 |
| REQ-FUNC-045 | 30일 내 개인정보 삭제 등 정식 보존·삭제 파이프라인은 범용 거버넌스 영역으로 제외. Supabase Auth 계정 삭제로 최소 대응 | 법무·개인정보 검토 확정 후 별도 Task(예: `DATA-RETENTION-PIPELINE`)로 재평가 |
| REQ-FUNC-055 | Editor/Admin 작성·검수·게시·보관 워크플로는 전체 콘텐츠 CMS로 제외. 안전정보는 개발자가 `src/data`를 직접 갱신 | 콘텐츠 편집 빈도가 높아지면 Headless CMS 도입 검토 |
| REQ-FUNC-056 | 변경 이력(이전값·사유·담당자·시각) 보존은 범용 감사 로그로 제외 | REQ-FUNC-076과 함께 감사 로그 도입 시 재평가 |
| REQ-FUNC-067 | 여행지+안전정보 통합검색(결과유형 라벨·하이라이트)은 검색 인프라 고도화로 제외. 여행지 키워드 검색(REQ-FUNC-003)으로 최소 기능 충족 | 콘텐츠 규모 증가 시 Algolia/Meilisearch 등 검색 인프라 도입 검토 |
| REQ-FUNC-071 | 정교한 이벤트 스키마·분석 파이프라인 구축은 제외(모니터링 인프라 제외 범위) | 트래픽 확보 후 최소 이벤트 스키마부터 단계적 도입 검토 |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기(전체 콘텐츠 CMS)는 제외. 콘텐츠는 정적 데이터 파일로 관리 | REQ-FUNC-055와 동일 후속 방향 |
| REQ-FUNC-073 | 미디어 업로드 시 출처·라이선스 필수 입력 워크플로 제외. 이미지는 일반 URL + alt 텍스트만 사용 | 자체 미디어 라이브러리 필요 시 Supabase Storage 업로드 워크플로 별도 Task화 |
| REQ-FUNC-074 | 자동 완전성 게이트(CMS 상태 전이)는 제외. 정적 데이터 작성 규칙과 MANUAL-CONTENT-REVIEW로 대체 | 콘텐츠 수 증가 시 스키마 기반 자동 게이트(예: zod 검증 CI 스텝) 도입 검토 |
| REQ-FUNC-075 | stale 현황 대시보드(운영 도구)는 제외. stale 여부는 상세 페이지 렌더링 시 계산해 표시(REQ-FUNC-050) | 운영자 수 증가 시 대시보드 별도 Task화 |
| REQ-FUNC-076 | 관리자 변경·신고 처리·권한 변경 감사 로그는 범용 감사 로그로 제외 | REQ-FUNC-056과 함께 재평가 |
| REQ-NF-004 | 동시 사용자 50명 부하 테스트는 제외. 필터 기능 자체는 REQ-FUNC-002로 구현 | 트래픽 급증 신호 발생 시 k6/Artillery 부하 테스트 도입 검토 |
| REQ-NF-005 | 부하 조건 하 API 응답시간 측정은 제외 | REQ-NF-004와 함께 재평가 |
| REQ-NF-007 | Lighthouse CI 성능 게이트 미구축(자동 부하/모니터링 제외 범위). MANUAL-PERF-LIGHTHOUSE로 대체 | CI 리소스 확보 시 `lighthouse-ci` GitHub Action 추가 검토 |
| REQ-NF-008 | 가용성 모니터링/SLA 측정은 자동 백업·장애 알림 제외 범위 | 유료 모니터링 플랜(Vercel/Sentry 등) 도입 시 재평가 |
| REQ-NF-009 | 5xx 비율 모니터링은 자동 장애 알림 제외 범위 | REQ-NF-008과 함께 재평가 |
| REQ-NF-010 | DB 자동 백업 RPO/RTO 목표는 자동 백업 제외 범위(Supabase 기본 백업에 의존) | 유료 Supabase 플랜의 PITR 활성화 시 재평가 |
| REQ-NF-011 | 주 1회 자동 링크 검사·관리자 알림은 자동 장애 알림 제외 범위. MANUAL-EXTERNAL-LINKS로 대체 | Cron 기반 링크 체커 도입 시 재평가 |
| REQ-NF-018 | 개인정보 내보내기/삭제 전용 파이프라인은 범용 거버넌스 영역으로 제외. Supabase Auth 계정 삭제로 최소 대응 | REQ-FUNC-045와 동일 후속 방향 |
| REQ-NF-020 | 24시간 SLA 측정·모니터링 체계는 제외. 신고 처리 자체는 REQ-FUNC-041로 구현 | 운영 인력 확보 시 SLA 대시보드 재평가 |
| REQ-NF-021 | 속도 제한(rate limiting) 인프라는 제외. 중복 요청 차단(REQ-FUNC-035)으로 일부 대응 | 어뷰징 신호 발생 시 Vercel Edge Middleware rate limit 도입 검토 |
| REQ-NF-022 | Moderator 조치 추적성(범용 감사 로그)은 제외 | REQ-FUNC-076과 함께 재평가 |
| REQ-NF-024 | axe 자동 검사 CI 파이프라인은 제외. MANUAL-A11Y-KEYBOARD로 대체 | CI 리소스 확보 시 `@axe-core/playwright` RELEASE-CI-GATES에 추가 검토 |
| REQ-NF-032 | 구조화 로그 파이프라인(request_id 등)은 모니터링 인프라 제외 범위 | 유료 로그 서비스 도입 시 재평가 |
| REQ-NF-033 | 5xx>1% 또는 외부링크 실패 5분 이내 알림은 자동 장애 알림 제외 범위 | REQ-NF-008/009와 함께 재평가 |

---

## 5. 검증 체크

- REQ-FUNC-001~080(80개), REQ-NF-001~034(34개) = 총 **114개** 전수가 §3(IMPLEMENT 89개, 범위 표기 展開 포함) 또는 §4(EXCLUDED 25개)에 정확히 1회씩 등장한다. **누락 Requirement ID 없음.**
- 승인된 5개 Screen(SCR-001~005) 각각 Page Owner Task가 정확히 1개다(§2.1).
- 모든 Page Owner의 Expected Files는 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 자신의 `page_entry`를 포함한다.
- 모든 Page Owner의 Depends On은 같은 Screen의 Component/Data/API Task를 포함한다(§2.1 Depends On 열).
- SCR-003 Page Owner는 항공(C-SCR003-FLIGHT-FORM)·숙소(C-SCR003-HOTEL-FORM)·동행 작성(C-SCR003-MATE-COMPOSER) 3개를 별도 Component Task로 분리했다.
- SCR-004 Page Owner는 목록(C-SCR004-LIST-GRID)·필터(C-SCR004-FILTER-SUMMARY)·상세(C-SCR004-DETAIL-PANEL)·참가(C-SCR004-PARTICIPATE-FLOW)·신고(C-SCR004-REPORT-MODAL)·차단(C-SCR004-BLOCK-ACTION)을 분리했다.
- SCR-005 Page Owner는 Auth(C-SCR005-AUTH-GUEST)·Profile(C-SCR005-PROFILE)·My Activity(C-SCR005-MY-ACTIVITY)·Admin(C-SCR005-ADMIN-REPORTS, C-SCR005-ADMIN-EXTERNAL-URL)을 분리했다.
- DB Schema(DB-SCHEMA-BASE)·RLS(DB-RLS-BASE)·Access(DB-ACCESS)를 별도 Task로 만들었고, 정확히 6개 테이블(`profiles`,`mate_posts`,`mate_applications`,`blocks`,`reports`,`external_links`)로 제한했다.
- 날짜 검증(UNIT-TRAVEL-DATES)·연락처 탐지(UNIT-CONTACT-DETECTION)·상태 전이(UNIT-MATE-STATE) Unit Test Task를 각각 만들었다.
- Playwright는 5~7개 핵심 흐름(공개 2개 + 여행준비 2개 + 동행·인증 3개 = 7개)을 3개 Task(E2E-PUBLIC-SMOKE, E2E-TRAVEL-TOOLS, E2E-MATE-AUTH)로 묶었으며 전부 Chromium 전용 Smoke다.
- CI(RELEASE-CI-GATES)와 Vercel(RELEASE-VERCEL-DEPLOY-CHECK)/Supabase(RELEASE-SUPABASE-CHECK) 확인 Task를 만들었다.
- 하나의 Task가 여러 Page Entry를 동시에 소유하지 않는다 — 5개 Page Owner는 각자 자신의 `page.tsx` 1개만 소유하고, 다른 모든 Component/Data/DB/API Task는 `src/components/**`, `src/data/**`, `src/lib/**`, `supabase/**`, `src/app/api/**/route.ts`, 또는 5-Screen 계약 밖의 개별 기술/정책 라우트 파일(`not-found.tsx`, `error.tsx`, `terms/page.tsx`, `privacy/page.tsx`, `safety-guide/page.tsx`, `auth/callback/route.ts`) 중 정확히 1개 파일 그룹만 소유한다.
- Page Owner Acceptance Criteria(§2.1 Functional AC 열)에 Section 순서·Section별 데이터 출처·최소 Card/Timeline/Gallery 수·반응형 콘텐츠 밀도를 전부 기록했다.
- Page Owner Acceptance Criteria에 Lorem ipsum·준비 중·정보 확인 필요·내용 없는 Card 금지, 그리고 데이터 0건 시에도 완성형 Empty State(상황 설명+이용 방법+CTA)를 요구하는 문구를 전부 포함했다(§2.1 Functional AC 열 각 행).
- 구현 코드·Branch·Commit·Issue는 생성하지 않았다. `TASKS/00_TASK_LIST.md` 한 개 파일만 작성했다.
