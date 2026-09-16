# UI Contract — Next.js App Router 구현 계약

**기반 문서:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`
**대상:** 승인된 5개 Screen(SCR-001~SCR-005)만을 구현 대상으로 한다. 기술 Route(인증 콜백, API Route, 404/500)는 이 계약에서 별도 표기하며 Screen 수에 포함하지 않는다.
**짝 문서:** `design-reference/SCREEN_ROUTE_CONTRACT.json` (기계 판독용 동일 계약)

---

## SCR-001 — 메인

- **Screen ID:** SCR-001
- **Route:** `/`
- **Page Entry:** `src/app/page.tsx`
- **Tier:** 핵심 (core)

**영역 순서** (D-001 §18 고정):
1. Hero(검색 + 보조 CTA)
2. 국내 인기 여행지 — Card Grid 6개
3. 해외 인기 여행지 — Card Grid 6개
4. 여행 동기·테마 — Chip 6개
5. 국가별 주의사항 — Card Grid 6개국(경보 배지 + 최종 확인일)
6. 최근 동행글 — Card Grid 3개 또는 완성형 Empty State
7. free_traveler 소개 — Split + `/about` CTA

**주요 Component:**
- 전역 Header/Footer(4-link nav, 계정 진입점)
- 검색 Input(pill), 필터바(국가·도시·계절·테마·기간)
- Destination Card(국내/해외), Safety Info Card(경보 배지+출처+확인일)
- Chip(테마 선택)
- Mate Post Card(요약, 최대 3개) / Empty State
- 여행지 상세 Drawer/Modal(소개·일정·예산·교통·음식·에티켓·출처 + 안전정보 패널 링크)
- 즐겨찾기 토글(localStorage), URL 공유 버튼

**상태:**
- 필터 상태(URL query 동기화) — REQ-FUNC-010
- Drawer/Modal 열림·닫힘
- 즐겨찾기 상태(localStorage) — REQ-FUNC-068
- 안전정보 stale 계산(렌더링 시 7일 경과 판단) — REQ-FUNC-050
- Loading(카드 skeleton) / Success / Empty(Section 6만) / Error("여행지 정보를 불러오지 못했어요, 다시 시도")

**사용자 행동:**
- 여행지 검색·필터링, 카드 클릭 → 상세 Drawer 오픈
- 테마 Chip 선택 → 필터 결과로 스크롤 이동
- 안전정보 카드 클릭 → 안전정보 Drawer 오픈, 외교부 링크(새 탭, 기술 Route) 이동
- 즐겨찾기 토글, 상세 URL 공유
- Empty State CTA 클릭 → SCR-003 동행 탭 이동

**다른 화면으로의 이동:**
- → SCR-003 `/travel-tools` (Hero 보조 CTA, 동행글 Empty/CTA)
- → SCR-002 `/about` (Section 7 CTA)
- → SCR-004 `/mates` (Header 상시 링크)
- → SCR-005 `/account` (Header 계정 진입점, 비로그인 시)

**Desktop·Mobile 규칙:**
- Desktop: 1240px 컨테이너, 3열 카드 그리드, Hero 높이 ≈560px(다음 Section 일부 노출)
- Mobile(390px): 모든 카드 그리드 1열 스택, 가로 스크롤 캐러셀 금지, Chip 2열 그리드, Hero는 48px 섹션 패딩으로 축소
- Mobile 변형 승인 완료: `screens/72dc8eb15eb44d2fbd4c6caf273cd765`

**금지 기능:**
- Airbnb 상표 요소(워드마크, 3-프로덕트 nav, NEW 배지, 별점 위젯) 사용 금지
- 목적지/여행지 카드에 별점·리뷰 점수·가격 표시 금지
- 통합검색(REQ-FUNC-067, EXCLUDED) — 본 화면의 키워드 검색으로 대체, 별도 통합검색 UI 만들지 않음
- 행동분석 이벤트 파이프라인(REQ-FUNC-071, EXCLUDED) 연동 금지
- CMS 편집 UI(REQ-FUNC-072/073/074/075/076, EXCLUDED) 노출 금지

---

## SCR-002 — 대표 소개

- **Screen ID:** SCR-002
- **Route:** `/about`
- **Page Entry:** `src/app/about/page.tsx`
- **Tier:** 보조 (secondary)

**영역 순서** (D-001 §18 고정):
1. Hero(대표 사진 + 한 문장 소개)
2. 여행 지표 — 소형 카드 2개 이상(`50+ Trips` / `30+ Countries`)
3. 소개 — Split(목차 + 본문)
4. 여행 Timeline — 6개 이상(연도·장소·요약)
5. 방문 국가 — 권역별 Chip 목록 30개 이상
6. 여행 Gallery — 8장 이상
7. 기억에 남는 여행지 — 카드 4개 + CTA Banner

**주요 Component:**
- 전역 Header/Footer
- Metric Card(지표), Timeline Item, Country Chip(권역 그룹 헤딩 포함)
- Gallery Grid(캡션·alt 포함), Destination Card(추천 여행지 4개)
- CTA Banner(2개 버튼: `/travel-tools`, `/mates`)

**상태:**
- 정적 콘텐츠 렌더링(대부분 서버 컴포넌트로 충분)
- 추천 여행지 비공개 여부에 따른 자동 제외 렌더링
- Loading(초기 skeleton) / Success / Error("대표 소개 정보를 불러오지 못했어요, 다시 시도") — Empty/Unauthorized 해당 없음

**사용자 행동:**
- Timeline/Gallery 스크롤 열람, 국가 Chip 클릭(관련 여행지 있으면 이동, 없으면 비활성)
- 기억에 남는 여행지 카드 클릭 → SCR-001 상세로 이동
- CTA Banner 버튼 클릭

**다른 화면으로의 이동:**
- → SCR-001 `/` (추천 여행지 카드 클릭, 국가 Chip 클릭)
- → SCR-003 `/travel-tools` (CTA Banner)
- → SCR-004 `/mates` (CTA Banner)

**Desktop·Mobile 규칙:**
- Desktop: Hero 높이 ≈480px, Gallery 3열, 국가 Chip 권역별 그룹 헤딩 + 가로 배치
- Mobile: 전 Section 세로 스택, Gallery 2열, 국가 Chip 그룹별 세로 스택
- Mobile 변형 별도 승인 없음(Desktop-only 범위로 확정, `DESIGN_MANIFEST.md` 참조)

**금지 기능:**
- Airbnb 상표 요소 금지
- 예약/결제 UI 금지(대표 소개는 순수 콘텐츠 화면)
- 방문 국가/여행지에 가격·별점 표시 금지

---

## SCR-003 — 통합 여행 준비

- **Screen ID:** SCR-003
- **Route:** `/travel-tools`
- **Page Entry:** `src/app/travel-tools/page.tsx`
- **Tier:** 핵심 (core)

**영역 순서** (D-001 §18 고정):
1. Intro Banner(목적 + 이용 순서)
2. Tabs — 항공편 / 숙소 / 동행 구하기 (3개 항상 존재)
3. 조건 입력 Form(국가·지역·날짜)
4. 요약 + 외부 이동 Action Card — Split
5. 비전달 고지 + Tip 카드 3개 이상
6. 동행 탭 콘텐츠 — Form(인증 완료) 또는 CTA Banner(미인증)

**주요 Component:**
- 전역 Header/Footer
- Tabs(밑줄형, 3개, 탭별 독립 상태)
- 조건 입력 Form(국가→지역 종속 선택, 날짜 Picker)
- 요약 카드, Action Card(외부 이동 버튼, 새 탭 아이콘)
- 정보 배너(비전달 고지), Tip Card ×3
- 동행 모집글 작성 Form(제목·국가·기간·모집 인원·스타일·설명·안전수칙 동의), 연락처 패턴 인라인 차단 안내
- 로그인/성인확인 게이트 CTA Banner

**상태:**
- 탭별 독립 상태 머신(입력값 → 검증 → 완료), 다른 탭 이동 시에도 유지
- 날짜 검증(역전 시 인라인 오류) — REQ-FUNC-013/021
- 항공·숙소 입력값은 비영속(브라우저 세션 한정) — REQ-FUNC-017/025
- 연락처 패턴 탐지·제출 차단 — REQ-FUNC-032
- 로그인/성인확인 가드에 따른 리다이렉트 — REQ-FUNC-027
- Loading: 없음(클라이언트 즉시 렌더) / Success(Section 4) / Error(날짜 검증, 외부 URL 이동 실패) / Unauthorized(Section 6)

**사용자 행동:**
- 탭 전환, 조건 입력 후 요약 확인
- "항공편/숙소 보러 가기" 클릭 → 외부 사이트 새 탭(기술 Route, 앱 내 Route 아님)
- 동행 탭: 로그인 유도 클릭 또는 모집글 작성·제출

**다른 화면으로의 이동:**
- → 외부 일반 페이지(새 탭, 항공/숙소 — 앱 내 이동 아님)
- → SCR-004 `/mates` (동행 작성 완료 시, 작성된 모집글 상세로)
- → SCR-005 `/account` (미인증 시 로그인/성인확인 유도)

**Desktop·Mobile 규칙:**
- Desktop: 2열 Form 배치, Split(요약/Action Card)
- Mobile: 3분할 탭(가로 스크롤 없음), Form 1열, 요약→Action Card 세로 스택
- Mobile 변형 승인 완료: `screens/990d6f5dc54b4edea1655799b7781460`

**금지 기능:**
- Airbnb 예약/결제 UI, 별점, 가격 비교 UI 일체 금지
- 실시간 항공권/호텔 가격 표시 금지 — 외부 사이트로 링크아웃만 수행
- 입력값 서버 저장 금지(REQ-FUNC-017/025 NON_UI, 클라이언트 세션 한정)
- 동행 작성 폼에 연락처 노출 허용 금지(패턴 탐지 시 제출 자체 차단)

---

## SCR-004 — 동행 조회

- **Screen ID:** SCR-004
- **Route:** `/mates`
- **Page Entry:** `src/app/mates/page.tsx`
- **Tier:** 핵심 (core)

**영역 순서** (D-001 §18 고정):
1. Intro — CTA Banner
2. Filter + 결과 요약(국가·지역·기간·모집상태)
3. 동행글 목록 — Card Grid(최대 8개 우선, "더 보기") 또는 완성형 Empty State
4. 목록 + 상세 — Split(Desktop 40/60) / Drawer(Mobile)
5. 동행 신청 방법 — 3단계 안내
6. 안전 안내 — CTA Banner(신고·차단 안내 + `/travel-tools` CTA)

**주요 Component:**
- 전역 Header/Footer
- Filter Chip/Select(국가·지역·기간·연령대·성별·스타일·모집상태)
- Mate Post Card(국가·기간·모집인원·상태 배지, 연락처 비노출)
- 상세 패널/Drawer(설명·조건·참가 요청 폼, 작성자용 승인/거절, 마감/수정/삭제, 신고 버튼/모달, 차단 실행)
- 3-Step Guide Card, CTA Banner(안전 안내)

**상태:**
- 모집 상태 계산(종료일 경과 시 조회 시점 CLOSED 표시) — REQ-FUNC-037
- 참가 요청 상태(PENDING/ACCEPTED/REJECTED) — REQ-FUNC-034/036
- 중복 요청 차단 오류 — REQ-FUNC-035
- 필터 상 차단 사용자 제외 — REQ-FUNC-030
- 신고·차단 상태
- Loading(Section 3·4 skeleton) / Success / Empty(Section 3 목록 없음, Section 4 미선택 시 안내) / Error / Unauthorized(참가 요청·작성자 액션만; 열람은 비로그인 허용)

**사용자 행동:**
- 필터 적용, 목록 카드 클릭 → 상세 패널/Drawer 갱신
- 참가 요청 제출, (작성자) 승인/거절, 마감/수정/삭제
- 신고 제출, 차단 실행
- Empty State: "필터 초기화" 또는 "동행글 작성하기" 클릭

**다른 화면으로의 이동:**
- → SCR-003 `/travel-tools` (동행 작성 탭으로 새 글쓰기, 안전 안내 Section CTA)
- → SCR-005 `/account` (내 활동·로그인, 차단 목록 관리)

**Desktop·Mobile 규칙:**
- Desktop: 좌 40% 목록 + 우 60% 상세 패널 고정(카드 클릭 시 우측 갱신)
- Mobile: 목록 1열, 카드 클릭 시 하단 Drawer로 상세(참가 요청 폼·승인/거절·마감/수정/삭제·신고·차단 전부 포함)
- Mobile 변형: 요청 범위에 없음(SCR-004는 Desktop 승인만 존재, `DESIGN_MANIFEST.md` 참조)

**금지 기능:**
- 참가/매칭에 결제·정산 UI 금지(순수 모집·승인 흐름만)
- 카드·상세 어디에도 공개 연락처 렌더링 금지(REQ-FUNC-033) — 표시 자체를 서버/클라이언트 렌더링 규칙으로 차단
- 별점·매너 점수 외 숫자 랭킹 노출 금지(경보/상태는 텍스트 배지로만)
- 경고·콘텐츠 숨김·계정 제한 자동화(REQ-FUNC-042, EXCLUDED) UI 금지

---

## SCR-005 — 계정·관리

- **Screen ID:** SCR-005
- **Route:** `/account`
- **Page Entry:** `src/app/account/page.tsx`
- **Tier:** 핵심 (core)

**영역 순서** (역할별 탭, D-001 §18 고정 — 해당 없는 역할의 탭은 렌더링하지 않음):
- **Guest:** Intro Banner → 로그인/회원가입/비밀번호 재설정 카드 3개 → 보안 안내 CTA Banner
- **Member:** 프로필 Form(성인확인 배지) → 새 동행글 작성 CTA Banner → 내 글(Card Grid/Empty) → 참가 요청(Card Grid/Empty) → 차단 목록(Card Grid/Empty)
- **Admin(Moderator/Admin 한정):** 관리 Intro → 신고 상태 변경(Filter+List/Empty) → 외부 URL 설정 Form

**주요 Component:**
- 전역 Header/Footer
- 인증 Form(로그인/가입/재설정) — 실제 제출은 기술 Route(`/auth/callback`) 경유
- 프로필 Form, 성인확인 상태 배지
- 내 글/참가 요청/차단 목록 Card Grid 또는 완성형 Empty State
- 관리자 전용: 신고 Filter+List, 외부 URL 설정 Form(HTTPS·허용목록 검증)

**상태:**
- 인증 세션, role 기반 탭 노출(Guest/Member/Admin)
- 안전수칙·정책 동의 이력(버전·시각) — REQ-FUNC-080
- 성인확인 상태(`is_adult`, `adult_verified_at`) — REQ-FUNC-028
- Loading(Member/Admin 목록 영역 skeleton) / Success / Empty(내 글·참가요청·차단·신고 목록) / Error / Unauthorized(Member/Admin 탭 직접 접근 시 Guest로 대체 또는 권한 없음 안내)

**사용자 행동:**
- 로그인/가입/재설정 제출, 프로필 편집·저장
- 내 글/참가 요청/차단 목록 열람 및 이동
- (Admin) 신고 상태 변경, 외부 URL 저장

**다른 화면으로의 이동:**
- → SCR-004 `/mates` (내 모집글/요청 상세, Empty State "동행글 둘러보기")
- → SCR-003 `/travel-tools` (작성 이어가기, "새 동행글 작성하기")

**Desktop·Mobile 규칙:**
- Desktop: 탭 상단 고정, Form 2열 배치 가능, Card Grid 목록형
- Mobile: 탭 스크롤 가능한 1행, Form 1열, Card Grid 1열
- Mobile 변형: 요청 범위에 없음(SCR-005는 Desktop 승인만 존재)

**금지 기능:**
- 계정 삭제 정식 파이프라인 UI 금지(REQ-FUNC-045/REQ-NF-018, EXCLUDED) — 탈퇴 "버튼"만 노출, 즉시 처리 로직은 구현하지 않음
- 경고·콘텐츠 숨김·계정 제한 자동화 UI(REQ-FUNC-042, EXCLUDED) 금지
- 실제 서비스 수준의 복잡한 관리자 Dashboard 금지(신고 상태 변경 + 외부 URL 설정 2개 기능으로 한정)
- 결제 수단 등록·구독 관리 UI 금지(서비스 범위 밖)

---

## 공통 규칙 (5개 Screen 전체 적용)

- Header/Footer는 5개 Screen에서 동일 컴포넌트를 재사용한다(REQ-FUNC-064).
- 반응형 레이아웃은 Desktop 1440px / Mobile 390px 두 기준을 충족해야 한다(REQ-FUNC-065).
- 알림은 Toast/화면 상태로 대체 구현한다(REQ-FUNC-043) — 브라우저 네이티브 알림·푸시 사용 금지.
- 모든 인터랙티브 요소는 ARIA·시맨틱 속성을 충족해야 한다(REQ-FUNC-079, REQ-NF-023/025).
- API Route, 인증 콜백, 404/500 오류 바운더리는 기술 Route로서 위 5개 Screen에 포함하지 않는다(`design-reference/SCREEN_ROUTE_CONTRACT.json`의 `technical_routes` 참조).
- Airbnb 상표 요소, 구매·예약·결제 UI, Proprietary Font 파일, `design-reference/D-001/DESIGN.md` §2에 없는 임의 색상은 5개 Screen 어디에도 추가할 수 없다.
