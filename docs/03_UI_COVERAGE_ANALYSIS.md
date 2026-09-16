# Free Traveler — UI Coverage Analysis

**Document ID:** UICOV-TRAVEL-001
**기반 문서:** `02_SRS_BASELINE.md.md`(REQ-FUNC-001~080, REQ-NF-001~034), `docs/PROJECT_SCOPE.md`

이 문서는 전체 SRS 요구사항 114개(REQ-FUNC 80 + REQ-NF 34)를 유지한 채, 5개 고정 디자인 Screen에 배치하고 각 요구사항의 UI 성격(UI_DIRECT / UI_STATE / NON_UI / OPERATIONS)과 `PROJECT_SCOPE.md`의 처리 분류(IMPLEMENT / EXCLUDED)를 함께 기록한다.

## 분류 정의

| 분류 | 의미 |
|---|---|
| **UI_DIRECT** | 화면에 직접 보이는 위젯·패널·버튼·목록 등으로 구현되는 요구사항 |
| **UI_STATE** | 화면에 별도 위젯을 만들지 않지만 클라이언트 상태·검증·계산 결과로 화면 동작에 반영되는 요구사항 |
| **NON_UI** | 사용자에게 시각적으로 드러나지 않는 서버·데이터·보안·성능 요구사항 |
| **OPERATIONS** | 콘텐츠 편집, 신고 처리, 모니터링, 비용 등 운영·관리자 성격의 요구사항(SCR-005 관리자 탭 또는 화면 외 운영 프로세스) |

API Route, 인증 콜백(`/auth/callback` 등), 404/500/에러 바운더리는 기술 Route로서 아래 5개 디자인 Screen에 포함하지 않는다. 해당 기술 Route가 관련된 요구사항(예: REQ-FUNC-078)은 표에서 "기술 Route"로 별도 표기한다.

---

## 1. 고정 디자인 Screen 5개

### SCR-001 `/` 메인

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 국내·해외 여행지를 발견·필터링하고, 상세 콘텐츠와 국가 안전정보를 확인한다 |
| 주요 영역 | 전역 내비/푸터, 국내·해외 탭, 필터바(국가·도시·계절·테마·기간), 키워드 검색, 여행지 카드 목록, 빈 결과 안내, 여행지 상세 Drawer/Modal(소개·일정·예산·교통·음식·에티켓·출처, **국가 안전정보 패널 포함**), 즐겨찾기, 관련 여행지, URL 공유 |
| 상태 | 필터 상태(URL query 동기화), Drawer/Modal 열림·닫힘, 즐겨찾기(localStorage), 안전정보 stale 계산(렌더링 시 7일 경과 판단) |
| 이동 목적지 | SCR-003(항공/호텔 조건 입력), SCR-002(대표 소개), SCR-004(동행 조회), SCR-005(로그인·계정) |

### SCR-002 `/about` 대표 소개

| 항목 | 내용 |
|---|---|
| 사용자 목표 | `free_traveler`의 경험·철학을 확인해 콘텐츠 신뢰 근거를 파악한다 |
| 주요 영역 | 대표 이미지·한 문장 소개, `50+ Trips`/`30+ Countries` 수치 카드, 철학·편집 원칙, 방문 권역 지도/국가 목록, 여행 타임라인, 추천 여행지 6개, 문의·SNS 링크 |
| 상태 | 정적 콘텐츠 렌더링, 추천 여행지의 비공개 여부에 따른 대체 노출 |
| 이동 목적지 | SCR-001(추천 여행지 상세) |

### SCR-003 `/travel-tools` 통합 여행 준비

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 항공·숙소 조건을 입력해 요약을 확인한 뒤 외부 사이트로 이동하거나, 동행 모집글을 작성한다 |
| 주요 영역 | 탭 내비(항공 / 숙소 / 동행 작성), 항공·숙소 각각의 조건 입력 폼과 요약 화면, 비전달 고지, 외부 이동 버튼, 동행 모집글 작성 폼(로그인·성인확인 게이트, 연락처 탐지, 안전수칙 동의) |
| 상태 | 폼 검증 상태(날짜·필수값), 브라우저 임시 상태(항공·숙소 입력값은 비영속), 요약 단계 전환, 로그인/성인확인 가드에 따른 리다이렉트 |
| 이동 목적지 | 항공/숙소: 외부 일반 페이지(새 탭). 동행 작성 완료: SCR-004(작성된 모집글 상세). 미인증: SCR-005(로그인·성인확인) |

### SCR-004 `/mates` 동행 조회

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 조건이 맞는 동행 모집글을 찾아 상세를 확인하고 참가를 요청하거나, 작성자로서 요청을 승인·거절·마감·신고·차단한다 |
| 주요 영역 | 필터(국가·기간·연령대·성별·스타일·모집상태), 모집글 목록, **동행 상세 패널**(설명·조건·참가 요청 폼, 작성자용 승인/거절, 마감/수정/삭제, 신고, 차단) |
| 상태 | 모집 상태 계산(종료일 경과 시 조회 시점에 CLOSED 표시), 참가 요청 PENDING/ACCEPTED/REJECTED 상태, 신고·차단 상태 |
| 이동 목적지 | SCR-003(동행 작성 탭으로 새 글쓰기), SCR-005(내 활동·로그인) |

### SCR-005 `/account` 계정·관리

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 가입·로그인·성인확인을 완료하고 프로필을 관리하며, 내 활동(글·요청·차단)을 확인한다. 권한이 있으면 신고 상태와 외부 URL을 관리한다 |
| 주요 영역 | 탭(로그인·회원가입·성인확인 / 프로필 / 내 활동(내 모집글·참가 요청·차단 목록) / 관리자(신고 상태 처리, 외부 URL 설정)) — 마지막 탭은 Moderator/Admin 권한자에게만 노출 |
| 상태 | 인증 세션, role 기반 탭 노출, 안전수칙·정책 동의 이력(버전·시각), 성인확인 상태(`is_adult`, `adult_verified_at`) |
| 이동 목적지 | SCR-004(내 모집글/요청 상세), SCR-003(작성 이어가기) |

---

## 2. Functional Requirements 매핑 (REQ-FUNC-001~080)

### F1. Destination Guide (SCR-001)

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-FUNC-001 | SCR-001 | UI_DIRECT | IMPLEMENT | 국내/해외 탭 |
| REQ-FUNC-002 | SCR-001 | UI_DIRECT | IMPLEMENT | 필터바 |
| REQ-FUNC-003 | SCR-001 | UI_DIRECT | IMPLEMENT | 키워드 검색 |
| REQ-FUNC-004 | SCR-001 | UI_DIRECT | IMPLEMENT | 상세 Drawer 필수 콘텐츠 |
| REQ-FUNC-005 | SCR-001 | UI_DIRECT | IMPLEMENT | 빈 결과 안내·초기화 |
| REQ-FUNC-006 | SCR-001 | UI_DIRECT | IMPLEMENT | 상세 Drawer 내 안전정보 패널 링크 |
| REQ-FUNC-007 | SCR-001 | UI_STATE | IMPLEMENT | 이미지 alt/출처 메타는 표시 속성으로만 반영 |
| REQ-FUNC-008 | N/A(데이터) | OPERATIONS | IMPLEMENT | 콘텐츠 수량 확보(수동 검수) |
| REQ-FUNC-009 | SCR-001 | UI_DIRECT | IMPLEMENT | 관련 여행지 |
| REQ-FUNC-010 | SCR-001 | UI_STATE | IMPLEMENT | 필터 상태 URL 동기화 |

### F2. Flight Link-out (SCR-003 항공 탭)

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-FUNC-011 | SCR-003 | UI_DIRECT | IMPLEMENT | 입력 폼 |
| REQ-FUNC-012 | SCR-003 | UI_DIRECT | IMPLEMENT | 국가→지역 종속 선택 |
| REQ-FUNC-013 | SCR-003 | UI_STATE | IMPLEMENT | 날짜 검증 차단 |
| REQ-FUNC-014 | SCR-003 | UI_DIRECT | IMPLEMENT | 요약 화면 |
| REQ-FUNC-015 | SCR-003 | UI_DIRECT | IMPLEMENT | 비전달 고지 문구 |
| REQ-FUNC-016 | SCR-003 → 기술 Route(외부 새 탭) | UI_DIRECT | IMPLEMENT | 외부 이동 버튼 |
| REQ-FUNC-017 | SCR-003 | NON_UI | IMPLEMENT | 서버 미저장 |
| REQ-FUNC-018 | SCR-003 | UI_DIRECT | IMPLEMENT | 이동 실패 오류 UI |

### F3. Hotel Link-out (SCR-003 숙소 탭)

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-FUNC-019 | SCR-003 | UI_DIRECT | IMPLEMENT | 입력 폼 |
| REQ-FUNC-020 | SCR-003 | UI_DIRECT | IMPLEMENT | 국가→지역 종속 선택 |
| REQ-FUNC-021 | SCR-003 | UI_STATE | IMPLEMENT | 날짜 검증 차단 |
| REQ-FUNC-022 | SCR-003 | UI_DIRECT | IMPLEMENT | 요약 화면 |
| REQ-FUNC-023 | SCR-003 | UI_DIRECT | IMPLEMENT | 비전달 고지 문구 |
| REQ-FUNC-024 | SCR-003 → 기술 Route(외부 새 탭) | UI_DIRECT | IMPLEMENT | 외부 이동 버튼 |
| REQ-FUNC-025 | SCR-003 | NON_UI | IMPLEMENT | 서버 미저장 |
| REQ-FUNC-026 | SCR-003 | UI_DIRECT | IMPLEMENT | 이동 실패 오류 UI |

### F4. Travel Mate (SCR-003 작성 탭 / SCR-004 목록·상세 / SCR-005 계정·관리)

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-FUNC-027 | SCR-003, SCR-004 → SCR-005(로그인 가드) | UI_STATE | IMPLEMENT | 미인증 시 리다이렉트 |
| REQ-FUNC-028 | SCR-005 | UI_DIRECT | IMPLEMENT | 성인확인 체크·시각 저장 |
| REQ-FUNC-029 | SCR-005 | UI_DIRECT | IMPLEMENT | 프로필 필드(프로필 탭) |
| REQ-FUNC-030 | SCR-004 | UI_DIRECT | IMPLEMENT | 필터·차단 사용자 제외 |
| REQ-FUNC-031 | SCR-003 | UI_DIRECT | IMPLEMENT | 작성 폼 필수 필드 |
| REQ-FUNC-032 | SCR-003 | UI_STATE | IMPLEMENT | 연락처 패턴 탐지·제출 차단 |
| REQ-FUNC-033 | SCR-004 | UI_STATE | IMPLEMENT | 연락처 비노출 렌더링 규칙 |
| REQ-FUNC-034 | SCR-004 | UI_DIRECT | IMPLEMENT | 참가 요청 폼(상세 패널) |
| REQ-FUNC-035 | SCR-004 | UI_STATE | IMPLEMENT | 중복 요청 차단 오류 |
| REQ-FUNC-036 | SCR-004 | UI_DIRECT | IMPLEMENT | 승인/거절 버튼(상세 패널) |
| REQ-FUNC-037 | SCR-004 | UI_STATE | IMPLEMENT | 조회 시 종료일 계산→CLOSED 표시 |
| REQ-FUNC-038 | SCR-004 | UI_DIRECT | IMPLEMENT | 수동 마감/수정/삭제 |
| REQ-FUNC-039 | SCR-004 | UI_DIRECT | IMPLEMENT | 신고 버튼/모달 |
| REQ-FUNC-040 | SCR-004 → SCR-005(차단 목록) | UI_DIRECT | IMPLEMENT | 차단 실행/관리 |
| REQ-FUNC-041 | SCR-005 | OPERATIONS | IMPLEMENT | 관리자 탭 신고 상태 필터·변경(간소화) |
| REQ-FUNC-042 | SCR-005(미구현) | OPERATIONS | EXCLUDED | 경고·콘텐츠 숨김·계정 제한 미구현 |
| REQ-FUNC-043 | 전역(SCR-003, SCR-004) | UI_DIRECT | IMPLEMENT(대체) | Toast/화면 상태 알림 |
| REQ-FUNC-044 | N/A(백엔드) | NON_UI | IMPLEMENT | Supabase RLS |
| REQ-FUNC-045 | SCR-005(탈퇴 버튼만 노출) | NON_UI | EXCLUDED | 정식 삭제 파이프라인 미구현 |

### F5. Country Safety (SCR-001 안전정보 패널)

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-FUNC-046 | N/A(데이터) | OPERATIONS | IMPLEMENT | 전체 해외국가 커버리지(수동 검수) |
| REQ-FUNC-047 | SCR-001 | UI_DIRECT | IMPLEMENT | 8개 안전 카테고리 |
| REQ-FUNC-048 | SCR-001 | UI_DIRECT | IMPLEMENT | 출처·확인일 표시 |
| REQ-FUNC-049 | SCR-001 → 기술 Route(외부 새 탭) | UI_DIRECT | IMPLEMENT | 외교부 링크 |
| REQ-FUNC-050 | SCR-001 | UI_STATE | IMPLEMENT | stale 계산(렌더링 시 7일 판단) |
| REQ-FUNC-051 | SCR-001 | UI_DIRECT | IMPLEMENT | 중대 경보 상단 표시 |
| REQ-FUNC-052 | SCR-001 | UI_DIRECT | IMPLEMENT | 국가/지역 범위 구분 |
| REQ-FUNC-053 | SCR-001 | UI_DIRECT | IMPLEMENT | 긴급연락처 |
| REQ-FUNC-054 | SCR-001 | UI_DIRECT | IMPLEMENT | 공식 판단 대체 불가 고지 |
| REQ-FUNC-055 | N/A(미구현) | OPERATIONS | EXCLUDED | 편집·검수·게시 워크플로 |
| REQ-FUNC-056 | N/A(미구현) | OPERATIONS | EXCLUDED | 변경 이력 보존 |

### F6. About free_traveler (SCR-002)

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-FUNC-057 | SCR-002 | UI_DIRECT | IMPLEMENT | 대표명·수치 카드 |
| REQ-FUNC-058 | SCR-002 | UI_DIRECT | IMPLEMENT | 소개문·철학 |
| REQ-FUNC-059 | SCR-002 | UI_DIRECT | IMPLEMENT | 방문 권역/국가 목록 |
| REQ-FUNC-060 | SCR-002 | UI_DIRECT | IMPLEMENT | 여행 타임라인 |
| REQ-FUNC-061 | SCR-002 | UI_STATE | IMPLEMENT | 이미지 메타(alt 등) |
| REQ-FUNC-062 | SCR-002 | UI_DIRECT | IMPLEMENT | 문의·SNS 링크 |
| REQ-FUNC-063 | SCR-002 → SCR-001 | UI_DIRECT | IMPLEMENT | 추천 여행지 6개 연결 |

### F7. Common, Admin, Governance

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-FUNC-064 | 전역(5개 Screen 공통) | UI_DIRECT | IMPLEMENT | 내비게이션·푸터 |
| REQ-FUNC-065 | 전역 | UI_DIRECT | IMPLEMENT | 반응형 레이아웃 |
| REQ-FUNC-066 | SCR-005 → 기술 Route(인증 콜백) | UI_DIRECT | IMPLEMENT | 가입/로그인/로그아웃/재설정 |
| REQ-FUNC-067 | SCR-001(대체 기능으로 축소) | UI_DIRECT | EXCLUDED | 통합검색은 003(키워드 검색)으로 대체 |
| REQ-FUNC-068 | SCR-001 | UI_DIRECT | IMPLEMENT | 즐겨찾기(localStorage) |
| REQ-FUNC-069 | SCR-001, SCR-004 | UI_DIRECT | IMPLEMENT | URL 공유 |
| REQ-FUNC-070 | 전역 | NON_UI | IMPLEMENT | SEO 메타데이터 |
| REQ-FUNC-071 | N/A | NON_UI | EXCLUDED | 행동 분석 이벤트 파이프라인 |
| REQ-FUNC-072 | N/A(미구현) | OPERATIONS | EXCLUDED | 콘텐츠 CRUD(CMS) |
| REQ-FUNC-073 | N/A(미구현) | OPERATIONS | EXCLUDED | 미디어 업로드 워크플로 |
| REQ-FUNC-074 | N/A(미구현) | OPERATIONS | EXCLUDED | 완전성 게이트 자동화 |
| REQ-FUNC-075 | N/A(미구현) | OPERATIONS | EXCLUDED | stale 대시보드 |
| REQ-FUNC-076 | N/A(미구현) | OPERATIONS | EXCLUDED | 감사 로그 |
| REQ-FUNC-077 | SCR-005 | OPERATIONS | IMPLEMENT | 관리자 외부 URL 설정 |
| REQ-FUNC-078 | 전역/기술 Route(404·500·오류 바운더리) | UI_DIRECT | IMPLEMENT | 오류 화면(디자인 Screen 아님) |
| REQ-FUNC-079 | 전역 | UI_STATE | IMPLEMENT | ARIA·시맨틱 속성 |
| REQ-FUNC-080 | SCR-003(동의 체크), SCR-005(정책 열람) | UI_DIRECT | IMPLEMENT | 약관/정책/안전수칙 동의 |

---

## 3. Non-Functional Requirements 매핑 (REQ-NF-001~034)

대부분의 NFR은 특정 화면 위젯이 아니라 전역 품질 속성이거나 운영 활동이므로 Screen은 "전역" 또는 "N/A"로 표기한다.

### Performance / Reliability

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-NF-001 | 전역 | NON_UI | IMPLEMENT(best-effort) | LCP |
| REQ-NF-002 | 전역 | NON_UI | IMPLEMENT(best-effort) | INP |
| REQ-NF-003 | 전역 | NON_UI | IMPLEMENT(best-effort) | CLS |
| REQ-NF-004 | N/A | OPERATIONS | EXCLUDED | 부하 테스트 |
| REQ-NF-005 | N/A | OPERATIONS | EXCLUDED | 부하 테스트 |
| REQ-NF-006 | 전역 | NON_UI | IMPLEMENT | 이미지 최적화 |
| REQ-NF-007 | N/A | OPERATIONS | EXCLUDED | Lighthouse CI 게이트 |
| REQ-NF-008 | N/A | OPERATIONS | EXCLUDED | 가용성 모니터링 |
| REQ-NF-009 | N/A | OPERATIONS | EXCLUDED | 5xx 모니터링 |
| REQ-NF-010 | N/A | OPERATIONS | EXCLUDED | 자동 백업 |
| REQ-NF-011 | N/A | OPERATIONS | EXCLUDED | 자동 링크 검사·알림 |

### Security / Privacy

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-NF-012 | N/A | NON_UI | IMPLEMENT | TLS |
| REQ-NF-013 | N/A | NON_UI | IMPLEMENT | 인증·RLS 서버 검증 |
| REQ-NF-014 | N/A | NON_UI | IMPLEMENT | CSRF/SameSite |
| REQ-NF-015 | N/A | NON_UI | IMPLEMENT | 입력 검증/XSS 방지 |
| REQ-NF-016 | N/A | NON_UI | IMPLEMENT | 환경변수 비밀키 |
| REQ-NF-017 | N/A | NON_UI | IMPLEMENT | 항공·호텔 원시값 미저장 |
| REQ-NF-018 | SCR-005(탈퇴 버튼만) | OPERATIONS | EXCLUDED | 정식 내보내기/삭제 파이프라인 |

### Safety and Moderation

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-NF-019 | SCR-004 | NON_UI | IMPLEMENT(best-effort) | 신고 접수 응답 속도 |
| REQ-NF-020 | N/A | OPERATIONS | EXCLUDED | SLA 모니터링 |
| REQ-NF-021 | N/A | OPERATIONS | EXCLUDED | Rate limiting |
| REQ-NF-022 | N/A | OPERATIONS | EXCLUDED | Moderator 조치 추적성(감사로그) |

### Accessibility

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-NF-023 | 전역 | UI_STATE | IMPLEMENT(best-effort) | WCAG 2.2 AA 목표 |
| REQ-NF-024 | N/A | OPERATIONS | EXCLUDED | axe 자동 CI 검사 |
| REQ-NF-025 | 전역 | UI_STATE | IMPLEMENT(부분) | 키보드/스크린리더 수동 점검 |

### Content, Freshness, SEO, Copyright

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-NF-026 | N/A | OPERATIONS | IMPLEMENT | 여행지 콘텐츠 완전성 |
| REQ-NF-027 | N/A | OPERATIONS | IMPLEMENT | 안전정보 커버리지 |
| REQ-NF-028 | SCR-001 | UI_STATE | IMPLEMENT | stale 표시(050과 동일 로직) |
| REQ-NF-029 | N/A | OPERATIONS | IMPLEMENT | 미디어 메타데이터 |
| REQ-NF-030 | 전역 | NON_UI | IMPLEMENT | SEO 메타데이터 |

### Maintainability, Monitoring, Cost

| ID | Screen | UI 분류 | PROJECT_SCOPE | 비고 |
|---|---|---|---|---|
| REQ-NF-031 | N/A | OPERATIONS | IMPLEMENT | 타입·lint·테스트 게이트 |
| REQ-NF-032 | N/A | OPERATIONS | EXCLUDED | 구조화 로그 |
| REQ-NF-033 | N/A | OPERATIONS | EXCLUDED | 장애 알림 |
| REQ-NF-034 | N/A | OPERATIONS | IMPLEMENT(참고치) | 인프라 비용 |

---

## 4. 검증 요약

### 4.1 총 개수 확인

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계** | **114** |

전체 SRS 114개 요구사항이 삭제 없이 1회씩 위 표에 기록되었다.

### 4.2 UI 분류별 개수

| 분류 | 개수 |
|---|---:|
| UI_DIRECT | 50 |
| UI_STATE | 15 |
| NON_UI | 18 |
| OPERATIONS | 31 |
| **합계** | **114** |

### 4.3 Screen별 배치 확인

- **SCR-001** `/`: 여행지 목록·필터·검색·즐겨찾기·상세 Drawer/Modal(F1 전체) + 국가 안전정보 패널(F5 전체)이 배치된다.
- **SCR-002** `/about`: 대표 소개(F6 전체)가 배치된다.
- **SCR-003** `/travel-tools`: 항공 탭(F2 전체), 숙소 탭(F3 전체), 동행 작성 탭(F4 중 작성·게이트 관련 REQ-FUNC-027·028·031·032·080)이 3개 탭으로 배치된다.
- **SCR-004** `/mates`: 동행 목록·상세 패널(F4 중 조회·요청·승인/거절·마감·신고·차단 REQ-FUNC-030·033~040)이 배치된다.
- **SCR-005** `/account`: 로그인/프로필/성인확인(REQ-FUNC-028·029·066), 내 활동(REQ-FUNC-040 관리), 간단 관리자 탭(REQ-FUNC-041·077)이 배치된다.
- 디자인 Screen은 정확히 5개(SCR-001~SCR-005)만 사용했으며, API Route·인증 콜백·404/500 오류 바운더리(REQ-FUNC-016·024·049·066·078)는 기술 Route로 표기하고 6번째 디자인 Screen으로 세지 않았다.

### 4.4 PROJECT_SCOPE 정합성

- EXCLUDED로 표기된 요구사항(REQ-FUNC-042·045·055·056·067·071~076, REQ-NF-004·005·007~011·018·020~022·024·032·033)은 `docs/PROJECT_SCOPE.md`의 분류를 그대로 유지했으며, 본 문서에서 구현 범위로 임의 복원하지 않았다.
- IMPLEMENT 요구사항 중 관리자·운영 성격(REQ-FUNC-041·077, REQ-NF-026·027·029·031·034 등)은 OPERATIONS로 분류하되 SCR-005 관리자 탭 범위 내에서만 구현한다.
