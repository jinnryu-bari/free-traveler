# Free Traveler — PROJECT_SCOPE

**Document ID:** SCOPE-TRAVEL-001
**기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`
**현재 코드 상태:** `create-next-app` 초기 스캐폴드(`src/app/page.tsx` 기본 템플릿), `src/data` 비어 있음, 커스텀 라우트·컴포넌트 없음.

이 문서는 SRS의 REQ-FUNC-001~080, REQ-NF-001~034를 각각 **IMPLEMENT**(구현하고 테스트) 또는 **EXCLUDED**(만들지 않음)로 분류하고, 구현 방식과 확인 방법을 기록한다.

---

## 1. 화면 구성

| 화면 | 구분 | 내용 |
|---|---|---|
| 홈 / 여행지 목록·상세 / 항공 찾기 / 호텔 찾기 | 핵심 화면 4개 | 여행지 탐색→여행 조건 정리→외부 이동이라는 핵심 사용자 흐름(F1·F2·F3) |
| 동행 찾기(목록·상세·작성) | 보조 화면 1개 | 동행 모집 흐름(F4). 국가 안전정보는 여행지 상세 내 패널로, 대표 소개는 별도 정적 페이지로 제공하며 각각 아래 2·3·4항목으로 별도 구현 |
| 국가 안전정보 패널 | 여행지 상세에 통합 표시(패널), 별도 목록/상세 CMS 없음 |
| `free_traveler` 대표 소개 | 정적 콘텐츠 페이지 |
| 로그인·회원가입·성인확인 | Supabase Auth 기반 |
| 마이페이지(내 활동) | 내 모집글·참가 요청·차단 목록 |
| 관리자 탭 | 신고 상태 변경, 외부 URL 설정만 취급(간소화) |

---

## 2. 구현 방식 요약

- 여행지·안전정보·대표 소개 콘텐츠는 `src/data`의 정적 TypeScript/JSON 데이터로 관리한다(CMS 없음).
- 즐겨찾기는 서버 저장 없이 `localStorage`로 처리한다.
- 참가 요청 승인/거절, 신고 접수 등 상태 변경 알림은 실제 이메일 발송 대신 Toast 또는 화면 상태로 대체한다.
- 동행 모집글의 자동 마감은 배치 작업이 아니라 조회 시점에 종료일을 계산해 표시한다.
- 안전정보의 stale(최종 확인 후 7일 경과) 여부도 렌더링 시 날짜 계산으로 판단한다.
- 이미지는 일반 인터넷 URL과 `alt` 텍스트만 사용하고, 별도 업로드·라이선스 승인 워크플로는 두지 않는다.
- 관리자 기능은 신고 상태값 변경과 외부 URL(항공·호텔 링크) 설정으로 한정한다.
- 인증·성인확인·동행 데이터는 Supabase(Auth + PostgreSQL + RLS)를 사용한다.
- 핵심 흐름은 Playwright Smoke Test로 검증하고 Vercel에 배포한다.

---

## 3. 제외 기능 (전체 요구사항 공통 사유)

| 제외 항목 | 사유 |
|---|---|
| 전체 콘텐츠 CMS(관리자 CRUD·검수·게시 워크플로) | 콘텐츠는 `src/data` 정적 파일로 개발자가 직접 관리 |
| 미디어 업로드·라이선스 승인 워크플로 | 이미지는 일반 URL + alt 텍스트만 사용 |
| 범용 감사 로그(변경 이력·조치 추적 시스템) | 상태값 변경(승인/거절/신고 처리)만 구현, 별도 이력 저장소 없음 |
| 자동 백업·장애 알림·부하 테스트 | 운영 모니터링 인프라 구축은 MVP 범위 밖 |
| 외부 이메일 사업자 연동 | 알림은 Toast/화면 상태로 대체 |
| EC2·AWS 인프라 | Vercel + Supabase로 대체 |
| 무인 자동 Merge Runner | 모든 병합은 수동 검토 후 진행 |

---

## 4. Functional Requirements 요구사항 매핑

### 4.1 F1. Destination Guide

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | 국내/해외 탭, `src/data` 정적 여행지 목록 분리 | Playwright: 탭 전환 시 구분별 결과만 노출 |
| REQ-FUNC-002 | IMPLEMENT | 국가·도시·계절·테마·기간 필터를 클라이언트 AND 조건으로 적용 | Playwright: 복수 필터 결과 검증 |
| REQ-FUNC-003 | IMPLEMENT | 클라이언트 부분 일치 키워드 검색 | Playwright: 검색어/빈 결과 케이스 |
| REQ-FUNC-004 | IMPLEMENT | 필수 콘텐츠 필드(소개·명소 5개↑·시기·1일/3일 일정·예산·교통·음식 3개↑·에티켓·출처·수정일)를 정적 데이터 스키마로 강제 | 데이터 스키마 타입 검사 + 수동 콘텐츠 검수(자동 게시 게이트 없음) |
| REQ-FUNC-005 | IMPLEMENT | 결과 없음 시 안내 문구 + 초기화 버튼 | Playwright: 빈 결과→초기화 확인 |
| REQ-FUNC-006 | IMPLEMENT | 여행지 데이터의 countryCode와 안전정보 데이터 키를 일치시켜 링크 연결 | Playwright: 상세→안전정보 이동 확인 |
| REQ-FUNC-007 | IMPLEMENT | 정적 데이터에 `alt`/`source`/`author`/`license` 필드 기록(승인 워크플로 없이 수동 입력) | 데이터 리뷰(코드 리뷰) |
| REQ-FUNC-008 | IMPLEMENT | 국내 10개↑·해외 15개국 30개 도시↑ 데이터 수량 확보 | 데이터 개수 수동 검수 |
| REQ-FUNC-009 | IMPLEMENT | 동일 국가·테마 관련 여행지 최대 6개 표시 | Playwright: 관련 여행지 노출 확인 |
| REQ-FUNC-010 | IMPLEMENT | 필터 상태를 URL query에 반영·복원 | Playwright: 새로고침 후 필터 유지 확인 |

### 4.2 F2. Flight Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | 국가·지역·출발일·귀국일 필수 입력 폼 | Playwright: 필드 렌더링·라벨 확인 |
| REQ-FUNC-012 | IMPLEMENT | 국가 선택에 종속된 지역 옵션, 국가 변경 시 지역 초기화 | Playwright: 국가 변경→지역 리셋 확인 |
| REQ-FUNC-013 | IMPLEMENT | 클라이언트 날짜 검증(과거 출발일/역전 귀국일 차단) | Playwright: 경계값 케이스 |
| REQ-FUNC-014 | IMPLEMENT | 유효 입력 후 요약 화면, 세션 내 상태 유지 | Playwright: 수정→복귀 시 값 유지 확인 |
| REQ-FUNC-015 | IMPLEMENT | 폼·요약에 비전달 고지 문구 표시 | Playwright: 문구 존재 확인 |
| REQ-FUNC-016 | IMPLEMENT | 설정된 항공 URL을 `noopener,noreferrer`로 새 탭 오픈, query 미부착 | Playwright: 새 탭 URL 파라미터 없음 확인 |
| REQ-FUNC-017 | IMPLEMENT | 입력값을 서버 API·로그·분석에 저장하지 않음(클라이언트 상태만 사용) | 네트워크 탭 수동 검사 |
| REQ-FUNC-018 | IMPLEMENT | 외부 URL 미설정/허용목록 밖일 때 이동 차단 + 오류/재시도 UI | Playwright: 오류 상태 케이스 |

### 4.3 F3. Hotel Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | 국가·지역·체크인·체크아웃 필수 입력 폼 | Playwright |
| REQ-FUNC-020 | IMPLEMENT | 국가별 지역 옵션 종속, 국가 변경 시 초기화 | Playwright |
| REQ-FUNC-021 | IMPLEMENT | 체크인/체크아웃 날짜 검증 | Playwright: 경계값 케이스 |
| REQ-FUNC-022 | IMPLEMENT | 요약 화면에 입력값 정확히 반영 | Playwright |
| REQ-FUNC-023 | IMPLEMENT | 비전달 고지 문구 표시 | Playwright |
| REQ-FUNC-024 | IMPLEMENT | 호텔 URL을 `noopener,noreferrer`로 새 탭 오픈 | Playwright |
| REQ-FUNC-025 | IMPLEMENT | 입력값 서버 미저장 | 네트워크 탭 수동 검사 |
| REQ-FUNC-026 | IMPLEMENT | URL 오류 시 이동 차단 + 오류 표시, 입력값 유지 | Playwright |

### 4.4 F4. Travel Mate

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | Supabase Auth 이메일 세션 필수화(미들웨어 가드) | Playwright: 비로그인 접근 시 리다이렉트 |
| REQ-FUNC-028 | IMPLEMENT | 체크박스 기반 성인확인 + 확인 시각만 저장(생년월일 미저장) | Playwright + Supabase 테이블 값 확인 |
| REQ-FUNC-029 | IMPLEMENT | 닉네임·연령대·여행 스타일 필수, 성별 선택 프로필 폼 | Playwright |
| REQ-FUNC-030 | IMPLEMENT | 국가·기간 겹침·연령대·성별·스타일·모집상태 필터, 차단 사용자 글 제외 | Playwright |
| REQ-FUNC-031 | IMPLEMENT | 모집글 작성 폼 필수 필드 + 날짜/과거종료일 검증 | Playwright |
| REQ-FUNC-032 | IMPLEMENT | 전화번호/이메일/메신저 ID 정규식 탐지 후 제출 차단 | 단위 테스트(정규식 케이스) + Playwright |
| REQ-FUNC-033 | IMPLEMENT | 응답/렌더링에서 연락처 필드 제외 | Playwright: HTML에 연락처 부재 확인 |
| REQ-FUNC-034 | IMPLEMENT | 참가 메시지(500자 이하) 비공개 제출, PENDING 저장 | Playwright |
| REQ-FUNC-035 | IMPLEMENT | Supabase unique 제약으로 중복 PENDING/ACCEPTED 차단 | Playwright: 중복 요청 오류 확인 |
| REQ-FUNC-036 | IMPLEMENT | 작성자만 승인/거절 가능(상태값 변경, 별도 이력 저장 없음) | Playwright: 권한 없는 변경 차단 확인 |
| REQ-FUNC-037 | IMPLEMENT | 배치 작업 대신 조회 시 종료일 경과 여부 계산해 CLOSED로 표시 | Playwright: 종료일 경과 글 노출 확인 |
| REQ-FUNC-038 | IMPLEMENT | 작성자 수동 마감/수정/삭제 | Playwright |
| REQ-FUNC-039 | IMPLEMENT | 사유 코드 + 설명으로 간단 신고 접수 | Playwright |
| REQ-FUNC-040 | IMPLEMENT | 사용자 간 간단 차단/해제 | Playwright |
| REQ-FUNC-041 | IMPLEMENT(간소화) | 관리자 탭에서 신고 상태(OPEN/RESOLVED/DISMISSED)만 필터·변경 | Playwright: 관리자 신고 상태 변경 확인 |
| REQ-FUNC-042 | EXCLUDED | 경고·콘텐츠 숨김·계정 일시 제한 등 정교한 제재 조치는 제외. 관리자는 신고 상태값 변경만 수행(041로 대체) | — |
| REQ-FUNC-043 | IMPLEMENT(대체) | 이메일 발송 대신 Toast/화면 상태로 접수·승인·거절 알림 표시 | Playwright: 알림 UI 노출 확인 |
| REQ-FUNC-044 | IMPLEMENT | Supabase RLS로 본인/대상 작성자/관리자만 비공개 데이터 열람 | RLS 정책 테스트(권한별 접근 시도) |
| REQ-FUNC-045 | EXCLUDED | 30일 내 개인정보 삭제 등 정식 보존·삭제 파이프라인은 범용 거버넌스 영역으로 제외. Supabase Auth 계정 삭제로 최소 대응 | — |

### 4.5 F5. Country Safety

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | 소개되는 모든 해외 국가에 안전정보 정적 데이터 확보 | 데이터 커버리지 수동 검수 |
| REQ-FUNC-047 | IMPLEMENT | 8개 필수 카테고리를 정적 데이터 스키마 필드로 강제 | 데이터 스키마 타입 검사 |
| REQ-FUNC-048 | IMPLEMENT | 출처명·URL·최종확인일·편집자 필드를 정적 데이터에 기록 | 데이터 리뷰 |
| REQ-FUNC-049 | IMPLEMENT | 외교부 원문 링크를 새 탭(`noopener,noreferrer`)으로 제공 | Playwright |
| REQ-FUNC-050 | IMPLEMENT | 최종 확인일 기준 7일 경과 여부를 렌더링 시 클라이언트에서 계산해 경고 표시 | Playwright: 날짜 조작 케이스 |
| REQ-FUNC-051 | IMPLEMENT | 중대 경보(출국권고·여행금지 등)를 텍스트로 상단 표시 | Playwright |
| REQ-FUNC-052 | IMPLEMENT | `scope_type`/`scope_text` 정적 데이터 필드로 국가·지역 범위 구분 | 데이터 리뷰 |
| REQ-FUNC-053 | IMPLEMENT | 긴급연락처·영사콜센터 정보를 정적 데이터로 표시 | Playwright |
| REQ-FUNC-054 | IMPLEMENT | 공식 판단 대체 불가·출국 전 재확인 고지 문구 표시 | Playwright |
| REQ-FUNC-055 | EXCLUDED | Editor/Admin 작성·검수·게시·보관 워크플로는 전체 콘텐츠 CMS로 제외. 안전정보는 개발자가 `src/data`를 직접 갱신 | — |
| REQ-FUNC-056 | EXCLUDED | 변경 이력(이전값·사유·담당자·시각) 보존은 범용 감사 로그로 제외 | — |

### 4.6 F6. About free_traveler

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | 대표명·`50+ Trips`·`30+ Countries`를 단일 정적 데이터 소스에서 표시 | Playwright: 홈·대표 페이지 값 일치 확인 |
| REQ-FUNC-058 | IMPLEMENT | 소개문·여행 철학·편집 원칙 정적 콘텐츠 | Playwright |
| REQ-FUNC-059 | IMPLEMENT | 방문 권역/30개국 이상 목록(지도 또는 리스트) | Playwright |
| REQ-FUNC-060 | IMPLEMENT | 여행 타임라인(연도·장소·요약) 정적 데이터 | Playwright |
| REQ-FUNC-061 | IMPLEMENT | 대표 이미지에 alt/출처/작가/라이선스 URL 기록(정적 데이터) | 데이터 리뷰 |
| REQ-FUNC-062 | IMPLEMENT | 정적 설정값 기반 문의/SNS 링크, 빈 값 미렌더링 | Playwright |
| REQ-FUNC-063 | IMPLEMENT | 추천 여행지 6개를 공개 상세로 연결 | Playwright |

### 4.7 F7. Common, Admin, Governance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 전역 내비게이션·푸터 레이아웃 | Playwright |
| REQ-FUNC-065 | IMPLEMENT | 320px~데스크톱 반응형 Tailwind 레이아웃 | 수동 반응형 점검 + Playwright viewport 테스트 |
| REQ-FUNC-066 | IMPLEMENT | Supabase Auth 이메일 가입/인증/로그인/로그아웃/재설정 | Playwright |
| REQ-FUNC-067 | EXCLUDED | 여행지+안전정보 통합검색(결과유형 라벨·하이라이트)은 검색 인프라 고도화로 제외. 여행지 키워드 검색(003)으로 최소 기능 충족 | — |
| REQ-FUNC-068 | IMPLEMENT | `localStorage` 기반 즐겨찾기 추가/해제, 중복 방지 | Playwright(브라우저 스토리지 확인) |
| REQ-FUNC-069 | IMPLEMENT | Web Share API 시도 후 실패 시 URL 복사 폴백 | Playwright |
| REQ-FUNC-070 | IMPLEMENT | Next.js Metadata API로 title/description/canonical/OG 제공 | 수동 메타태그 점검 |
| REQ-FUNC-071 | EXCLUDED | 정교한 이벤트 스키마·분석 파이프라인 구축은 제외(모니터링 인프라 제외 범위) | — |
| REQ-FUNC-072 | EXCLUDED | Editor/Admin 콘텐츠 CRUD·미리보기(전체 콘텐츠 CMS)는 제외. 콘텐츠는 정적 데이터 파일로 관리 | — |
| REQ-FUNC-073 | EXCLUDED | 미디어 업로드 시 출처·라이선스 필수 입력 워크플로 제외. 이미지는 일반 URL + alt 텍스트만 사용 | — |
| REQ-FUNC-074 | EXCLUDED | 자동 완전성 게이트(CMS 상태 전이)는 제외. 정적 데이터 작성 규칙과 수동 리뷰로 대체 | — |
| REQ-FUNC-075 | EXCLUDED | stale 현황 대시보드(운영 도구)는 제외. stale 여부는 상세 페이지 렌더링 시 계산해 표시(050) | — |
| REQ-FUNC-076 | EXCLUDED | 관리자 변경·신고 처리·권한 변경 감사 로그는 범용 감사 로그로 제외 | — |
| REQ-FUNC-077 | IMPLEMENT | 관리자 탭에서 항공·호텔 외부 URL을 허용목록 내 HTTPS로만 설정 | Playwright: 비HTTPS 입력 거부 확인 |
| REQ-FUNC-078 | IMPLEMENT | 404/500/권한없음/외부연결실패 화면 + 홈·이전·재시도 행동 제공 | Playwright |
| REQ-FUNC-079 | IMPLEMENT | 폼/모달/탭/알림에 기본 HTML 시맨틱·ARIA 속성 적용 | 수동 키보드 점검 + Playwright |
| REQ-FUNC-080 | IMPLEMENT | 이용약관·개인정보 처리방침·동행 안전수칙·콘텐츠 면책 고지 페이지 + 작성 시 동의 체크(버전·시각 저장) | Playwright |

---

## 5. Non-Functional Requirements 요구사항 매핑

### 5.1 Performance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-001 | IMPLEMENT(best-effort) | 정적 생성·이미지 최적화로 LCP 목표 지향(자동 CI 측정 없음) | 수동 Lighthouse 실행 |
| REQ-NF-002 | IMPLEMENT(best-effort) | 클라이언트 상태 최소화로 상호작용 지연 최소화 | 수동 확인 |
| REQ-NF-003 | IMPLEMENT(best-effort) | 레이아웃 시프트 방지(이미지 크기 고정 등) | 수동 확인 |
| REQ-NF-004 | EXCLUDED | 동시 사용자 50명 부하 테스트는 제외. 필터 기능 자체는 REQ-FUNC-002로 구현 | — |
| REQ-NF-005 | EXCLUDED | 부하 조건 하 API 응답시간 측정은 제외 | — |
| REQ-NF-006 | IMPLEMENT | `next/image` responsive size + lazy load, LCP 이미지 priority | 수동 확인 |
| REQ-NF-007 | EXCLUDED | Lighthouse CI 성능 게이트 미구축(자동 부하/모니터링 제외 범위). 배포 전 수동 점검으로 대체 | — |
| REQ-NF-008 | EXCLUDED | 가용성 모니터링/SLA 측정은 자동 백업·장애 알림 제외 범위 | — |
| REQ-NF-009 | EXCLUDED | 5xx 비율 모니터링은 자동 장애 알림 제외 범위 | — |

### 5.2 Reliability and Recovery

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-010 | EXCLUDED | DB 자동 백업 RPO/RTO 목표는 자동 백업 제외 범위 | — |
| REQ-NF-011 | EXCLUDED | 주 1회 자동 링크 검사·관리자 알림은 자동 장애 알림 제외 범위. 배포 전 수동 링크 점검으로 대체 | — |

### 5.3 Security and Privacy

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-012 | IMPLEMENT | Vercel/Supabase 기본 HTTPS·TLS 1.2+ | 배포 환경 설정 확인 |
| REQ-NF-013 | IMPLEMENT | Supabase Auth + RLS로 인증·역할 서버 검증 | RLS 정책 테스트 |
| REQ-NF-014 | IMPLEMENT | Next.js/Supabase 기본 CSRF 방어·SameSite 쿠키 사용 | 수동 확인 |
| REQ-NF-015 | IMPLEMENT | 입력 검증(zod 등) + React 기본 이스케이프로 저장 XSS 차단 | 단위 테스트 |
| REQ-NF-016 | IMPLEMENT | 비밀키는 Vercel 환경변수로 관리, 클라이언트 번들 미포함 | 빌드 산출물 수동 검사 |
| REQ-NF-017 | IMPLEMENT | 항공·호텔 원시 입력값을 서버·분석에 저장하지 않음 | 네트워크/DB 로그 수동 검사 |
| REQ-NF-018 | EXCLUDED | 개인정보 내보내기/삭제 전용 파이프라인은 범용 거버넌스 영역으로 제외. Supabase Auth 계정 삭제로 최소 대응 | — |

### 5.4 Safety and Moderation

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-019 | IMPLEMENT(best-effort) | 신고 접수 응답을 간단한 동기 처리로 신속화 | Playwright: 응답 지연 수동 확인 |
| REQ-NF-020 | EXCLUDED | 24시간 SLA 측정·모니터링 체계는 제외. 신고 처리 자체는 REQ-FUNC-041로 구현 | — |
| REQ-NF-021 | EXCLUDED | 속도 제한(rate limiting) 인프라는 제외. 중복 요청 차단(REQ-FUNC-035)으로 일부 대응 | — |
| REQ-NF-022 | EXCLUDED | Moderator 조치 추적성(범용 감사 로그)은 제외 | — |

### 5.5 Accessibility

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-023 | IMPLEMENT(best-effort) | WCAG 2.2 AA를 목표로 시맨틱 마크업 적용, 자동 감사 도구 미구축 | 수동 점검 |
| REQ-NF-024 | EXCLUDED | axe 자동 검사 CI 파이프라인은 제외. 수동 점검으로 대체 | — |
| REQ-NF-025 | IMPLEMENT(부분) | 핵심 사용자 흐름(여행지 탐색, 항공/호텔 입력, 동행 참가)의 키보드 접근성 수동 점검 | 수동 키보드 점검 + Playwright 핵심 흐름 |

### 5.6 Content, Freshness, SEO, Copyright

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-026 | IMPLEMENT | 정적 데이터 작성 규칙으로 여행지 필수 필드 100% 충족(자동 게이트 없음) | 수동 데이터 검수 |
| REQ-NF-027 | IMPLEMENT | 해외 국가 안전정보 100% 커버리지(정적 데이터) | 수동 데이터 검수 |
| REQ-NF-028 | IMPLEMENT | 렌더링 시 stale 계산(REQ-FUNC-050과 동일 방식) | Playwright |
| REQ-NF-029 | IMPLEMENT | 이미지 alt/출처 필드는 정적 데이터에 기록(정식 라이선스 승인 절차 없음) | 데이터 리뷰 |
| REQ-NF-030 | IMPLEMENT | 공개 페이지 SEO 메타데이터(REQ-FUNC-070과 동일) | 수동 점검 |

### 5.7 Maintainability, Monitoring, Cost

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-031 | IMPLEMENT | TypeScript strict, ESLint, 핵심 흐름 Playwright 테스트를 병합 전 통과 | `npm run lint`, `npm run build`, Playwright 실행 |
| REQ-NF-032 | EXCLUDED | 구조화 로그 파이프라인(request_id 등)은 모니터링 인프라 제외 범위 | — |
| REQ-NF-033 | EXCLUDED | 5xx>1% 또는 외부링크 실패 5분 이내 알림은 자동 장애 알림 제외 범위 | — |
| REQ-NF-034 | IMPLEMENT(참고치) | Vercel + Supabase 무료/저비용 티어 사용, 별도 비용 모니터링 도구 없이 목표만 참고 | 요금제 수동 확인 |

---

## 6. 검증 체크

- REQ-FUNC-001~080: 80개 전항 기록 완료.
- REQ-NF-001~034: 34개 전항 기록 완료.
- 삭제된 Requirement 없음(모두 IMPLEMENT 또는 EXCLUDED로 1회씩 분류).
- Playwright 핵심 Smoke Test 대상: 여행지 탐색·필터·상세(001~006), 항공/호텔 입력→요약→외부 이동(011~026), 동행 작성·참가 요청·승인/거절·마감(027~038), 신고·차단(039~040), 안전정보 표시(046~054), 대표 소개(057~063), 인증(066), 관리자 신고/URL 설정(041, 077).
