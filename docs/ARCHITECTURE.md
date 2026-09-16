# Free Traveler — Architecture

**Document ID:** ARCH-TRAVEL-001
**기반 문서:** `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv`
**작성일:** 2026-09-16
**범위:** 이 문서는 Free Traveler의 **구현 경계**(무엇을 어디에 어떻게 구현하는가, 무엇을 구현하지 않는가)를 설명한다. 화면 상세 명세는 `design-reference/UI_CONTRACT.md`, Task 단위 작업은 `TASKS/00_TASK_LIST.md`·`TASKS/TASK-*.md`를 참조한다. 이 문서는 그 둘을 관통하는 시스템 경계 기준선이다.

---

## 1. 기술 스택

| 계층 | 선택 | 근거 |
|---|---|---|
| 프레임워크 | **Next.js 16(App Router)** + **TypeScript** | `package.json`(`next@16.3.4`, `typescript@^5`) |
| UI 런타임 | React 19 | `package.json`(`react@19.2.8`) |
| 스타일 | Tailwind CSS v4(CSS-first `@theme`) | `package.json`, `design-reference/D-001/DESIGN.md` §2~§6 토큰을 그대로 이식 |
| 데이터/인증 | **Supabase**(PostgreSQL + Auth + RLS) — §7~§10 참조 | `docs/PROJECT_SCOPE.md` §2 |
| 정적 콘텐츠 | `src/data/*.ts` (여행지·안전정보·대표 소개) | §6 참조 |
| 테스트 | Vitest(단위) + Playwright(Chromium Smoke) | §12 참조 |
| 배포·CI | GitHub Actions + Vercel | §13 참조 |

App Router를 사용하므로 라우팅은 `src/app/**/page.tsx` 파일 트리로 결정되며, 별도 라우터 설정 파일(`pages/`, `react-router` 등)을 두지 않는다.

---

## 2. 화면 구성 — 핵심 화면 4개, 보조 화면 1개

`design-reference/SCREEN_ROUTE_CONTRACT.json`의 `tier_summary`가 유일한 근거다. 승인된 Screen은 정확히 5개이며 그 이상도 이하도 만들지 않는다.

| Tier | Screen |
|---|---|
| **핵심(core), 4개** | SCR-001 `/`, SCR-003 `/travel-tools`, SCR-004 `/mates`, SCR-005 `/account` |
| **보조(secondary), 1개** | SCR-002 `/about` |

### Page Entry

| Screen | Route | Page Entry |
|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` |
| SCR-002 | `/about` | `src/app/about/page.tsx` |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` |
| SCR-005 | `/account` | `src/app/account/page.tsx` |

기술 Route(Screen 수에 미포함, `SCREEN_ROUTE_CONTRACT.json`의 `technical_routes`): 인증 콜백 `src/app/auth/callback/route.ts`, API Route 6개(§8 참조), 오류 화면 `src/app/not-found.tsx`/`src/app/error.tsx`.

---

## 3. Server Component와 Client Component 구분

**기본값은 Server Component다.** `"use client"`는 실제로 브라우저 상호작용·상태·이벤트 핸들러가 필요한 leaf 컴포넌트에만 명시적으로 붙인다.

| 구분 | 해당 범위 | 예시 |
|---|---|---|
| **Server Component**(기본값, 디렉티브 없음) | 5개 Page Owner(`page.tsx`)의 데이터 조립, `src/data/*.ts` 읽기, 정적 콘텐츠 렌더링(SCR-002 Timeline/Gallery/국가 Chip 등), SEO `metadata` export | `src/app/page.tsx`, `src/app/about/page.tsx` |
| **Client Component**(`"use client"` 명시) | 사용자 입력·상태·이벤트가 있는 모든 조각: 검색/필터, 테마 Chip 선택, 여행지 상세 Drawer, 항공/숙소 입력 Form(§4), 탭 전환(SCR-003/005), 동행 참가·신고·차단 액션, Toast, 관리자 상태 변경 Form | `src/components/travel-tools/flight-form.tsx`, `src/components/mates/detail-panel.tsx`, `src/components/ui/toast.tsx` |

Page Owner(`page.tsx`)는 Server Component로 유지하고, Client Component는 그 안에 **컴포지션으로 삽입**한다(Server Component 안에서 Client Component를 import해서 배치하는 표준 App Router 패턴). Page Owner 자체를 `"use client"`로 만들지 않는다.

---

## 4. 항공·숙소 입력 Form — Client Component의 일시 상태만 사용

- SCR-003의 항공편·숙소 조건 입력 Form(`C-SCR003-FLIGHT-FORM`, `C-SCR003-HOTEL-FORM`)은 **Client Component**이며, 입력값은 해당 컴포넌트(또는 그 부모 탭 컨테이너)의 React state(`useState`)에만 보관한다.
- 세션 내 상태 유지(REQ-FUNC-014)는 브라우저 메모리/`sessionStorage` 수준이며, Server Component·Server Action·API Route로 전달하지 않는다.
- 다른 탭으로 이동해도 각 탭(항공편/숙소/동행 구하기)의 상태는 독립적으로 유지되는 상태 머신을 각각 갖는다(`design-reference/UI_CONTRACT.md` SCR-003 "상태" 절).

---

## 5. 항공·숙소 입력값 비전송 원칙

항공·숙소 조건 입력값(국가·지역·날짜 등)은 다음 어디로도 전송하지 않는다:

- **API Route로 전송하지 않는다** — `/api/mates` 등 어떤 API Route도 항공/숙소 입력값을 payload로 받지 않는다.
- **DB에 저장하지 않는다** — 6개 정식 테이블(§8) 중 항공/숙소 조건을 위한 테이블은 존재하지 않는다.
- **URL query로 전달하지 않는다** — 외부 이동 URL(Google Flights/Booking.com류 고정 링크)에 목적지·날짜를 쿼리 파라미터로 붙이지 않는다. 외부 이동은 관리자가 `external_links` 테이블에 설정한 고정 URL을 `noopener,noreferrer`로 새 탭 여는 것뿐이다.
- **로그로 남기지 않는다** — 분석 이벤트·서버 로그 어디에도 입력값 원문을 기록하지 않는다.

근거: `docs/PROJECT_SCOPE.md` REQ-FUNC-017/025("입력값을 서버 API·로그·분석에 저장하지 않음"), REQ-FUNC-016/024("외부 URL을 `noopener,noreferrer`로 새 탭 오픈, query 미부착"). 검증은 `TASKS/TASK-E2E-TRAVEL-TOOLS.md`(네트워크 요청에 목적지·날짜 query 없음 자동 assert)와 `TASKS/TASK-MANUAL-EXTERNAL-LINKS.md`(수동 재확인)가 맡는다.

---

## 6. 여행지·안전정보·대표 소개 — `src/data` 정적 데이터

콘텐츠 3종은 CMS나 DB 테이블이 아니라 **`src/data/*.ts` 정적 TypeScript 데이터**로 관리한다.

| 파일 | 내용 | 최소 수량 |
|---|---|---|
| `src/data/destinations.ts` | 국내/해외 여행지 | 국내 10개 이상, 해외 15개국 30개 도시 이상 |
| `src/data/safety.ts` | 국가별 안전정보 | 게시되는 모든 해외 국가 1건 이상, 8개 필수 카테고리 |
| `src/data/about.ts` | 대표(`free_traveler`) 소개 | Timeline 6개 이상, 방문 국가 Chip 30개 이상, Gallery 8장 이상 |

- 필수 필드는 TypeScript 타입으로 강제한다(컴파일 타임에 누락 필드를 잡음) — 런타임 CMS 검증 게이트는 두지 않는다.
- 콘텐츠 갱신은 개발자가 이 파일을 직접 수정하는 방식이며, 관리자 화면에서 콘텐츠를 편집하는 기능은 만들지 않는다(§14 CMS 제외 참조).
- 이미지는 일반 URL + `alt` 텍스트만 사용하고 별도 업로드·라이선스 승인 워크플로는 없다.

---

## 7. Supabase 사용 범위 — Auth와 동행 기능 중심

Supabase는 **모든 것을 담는 백엔드가 아니라, 인증과 동행(Travel Mate) 기능에 한정**해서 사용한다.

- **Auth**: 이메일 가입/로그인/로그아웃/비밀번호 재설정(`/auth/callback` 경유), 세션 관리, role(Member/Moderator/Admin) 판별.
- **동행 기능**: 프로필(닉네임·연령대·스타일·성인확인 상태), 동행 모집글 작성/마감/수정/삭제, 참가 요청/승인/거절, 신고, 차단, 관리자의 신고 상태 변경·외부 URL 설정.
- 여행지·안전정보·대표 소개(§6)는 Supabase를 거치지 않는다 — Supabase는 이 콘텐츠의 저장소가 아니다.

---

## 8. DB — 정확히 6개 테이블

| 테이블 | 용도 | 관련 API |
|---|---|---|
| `profiles` | 회원 프로필, 성인확인 상태(`is_adult`, `adult_verified_at`) — 생년월일 원본은 저장하지 않음 | `/auth/callback` |
| `mate_posts` | 동행 모집글 | `/api/mates` |
| `mate_applications` | 참가 요청(PENDING/ACCEPTED/REJECTED), 동일 사용자·동일 글 중복 PENDING/ACCEPTED 방지 unique 제약 | `/api/mates/[id]/requests` |
| `blocks` | 사용자 간 차단 관계 | `/api/account/blocklist` |
| `reports` | 신고(사유 코드+설명, OPEN/RESOLVED/DISMISSED) | `/api/mates/[id]/report`, `/api/admin/reports` |
| `external_links` | 관리자가 설정한 항공·숙소 외부 URL(HTTPS + 허용목록) | `/api/admin/external-links` |

**7번째 테이블을 만들지 않는다.** 감사 로그·이벤트 분석·알림 큐 등은 별도 테이블 없이 §14의 제외 범위로 대체한다(예: 신고/승인 상태 변경은 컬럼 값 갱신만, 별도 이력 테이블 없음). 근거: `docs/PROJECT_SCOPE.md` §3, `TASKS/TASK-DB-SCHEMA-BASE.md`.

---

## 9. Supabase Client 구성 — Browser·Server 분리

Next.js App Router의 Server/Client Component 경계(§3)에 맞춰 Supabase 클라이언트를 두 종류로 분리한다.

| 클라이언트 | 위치(예정) | 사용처 |
|---|---|---|
| Browser Client | `src/lib/supabase/client.ts` | Client Component에서 세션 확인, 실시간 UI 갱신 등 브라우저 측 호출 |
| Server Client | `src/lib/supabase/server.ts` | Server Component·API Route·`/auth/callback`에서 쿠키 기반 세션으로 인증된 요청 처리 |

두 클라이언트 모두 anon key만 클라이언트 번들에 포함하고(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), service role key는 서버 전용 환경변수로만 참조하며 클라이언트 번들에 포함하지 않는다(`SUPABASE_SERVICE_ROLE_KEY`, REQ-NF-016).

---

## 10. RLS 원칙 (간단)

정교한 역할 매트릭스를 만들지 않고, 아래 3가지 원칙만 6개 테이블 전체에 일관 적용한다(`docs/PROJECT_SCOPE.md` REQ-FUNC-044, REQ-NF-013):

1. **본인 데이터 우선** — `profiles`/`mate_applications`/`blocks`/`reports`는 기본적으로 본인이 만든 행만 읽고 쓸 수 있다.
2. **관계 당사자 예외** — `mate_applications`는 참가 요청자 본인과 해당 모집글의 작성자(승인/거절 권한) 둘 다 접근 가능하다. `mate_posts`는 게시 상태면 모두 열람 가능, 수정/삭제는 작성자만 가능하다.
3. **관리자 예외** — `reports`·`external_links`와 각 테이블의 관리 조작은 Moderator/Admin role만 추가로 접근 가능하다. role 확인은 클라이언트 표시만이 아니라 **서버(RLS)에서 항상 재검증**한다.

6개 테이블 전부 RLS를 활성화하며, RLS가 비활성인 테이블은 0건이어야 한다. 검증은 `TASKS/TASK-TEST-RLS-BASIC.md`(통합 테스트)가 맡는다.

---

## 11. ORM 미사용

**Prisma 등 ORM을 사용하지 않는다.** 데이터 접근은 Supabase JS 클라이언트(`@supabase/supabase-js`)를 통해 직접 쿼리하며, 스키마는 `supabase/migrations/*.sql`로 직접 관리한다(마이그레이션 생성기·ORM 스키마 파일 없음). 서버 데이터 접근은 `src/lib/supabase/queries.ts` 한 곳을 통해서만 이뤄지도록 모아서, 모든 API Route가 이 레이어를 거치게 한다(`docs/PROJECT_SCOPE.md`, `TASKS/TASK-DB-ACCESS.md`).

---

## 12. 테스트 전략 — Vitest + Playwright(Chromium Smoke)

| 계층 | 도구 | 대상 |
|---|---|---|
| 단위 테스트 | **Vitest** | 날짜 검증(`UNIT-TRAVEL-DATES`), 연락처 패턴 탐지(`UNIT-CONTACT-DETECTION`), 모집/요청 상태 전이(`UNIT-MATE-STATE`) — 외부 네트워크·DB 의존 없는 순수 함수 |
| 통합 테스트 | Node 기반 통합 테스트 | RLS 정책(`TEST-RLS-BASIC`) — Seed 데이터의 Adult Member/Moderator/Admin 3개 역할로 권한별 시나리오 검증 |
| E2E | **Playwright, Chromium 프로젝트만** | 핵심 흐름 happy path 3개 스펙: `E2E-PUBLIC-SMOKE`(공개 2흐름), `E2E-TRAVEL-TOOLS`(여행 준비 2흐름), `E2E-MATE-AUTH`(동행·인증 3흐름) |

Playwright는 `projects: [{ name: 'chromium' }]` 단일 구성만 사용한다 — Firefox/WebKit 프로젝트, 시각적 회귀 테스트, 부하 테스트는 추가하지 않는다(`TASKS/00_TASK_LIST.md` §2.13, `scripts/audit_tasks.py` 검사 15).

---

## 13. CI/CD — GitHub Actions + Vercel Preview

- **GitHub Actions**(`RELEASE-CI-GATES`, `.github/workflows/ci.yml` 예정): `npm run lint`, `npm run build`, Vitest 단위/통합 테스트, Playwright E2E가 **main 병합 전 전부 통과**해야 한다.
- **Vercel**: Pull Request마다 Preview 배포, `main` 브랜치는 Production 배포. TLS 1.2+ 기본 적용, 비밀키는 Vercel 환경변수로만 관리하고 클라이언트 번들에 포함되지 않음을 배포 산출물로 확인한다(`RELEASE-VERCEL-DEPLOY-CHECK`).
- 병합은 **항상 사람이 PR을 검토한 뒤 수동으로 진행**한다(§14 참조).

---

## 14. 인프라·운영 제외 범위 (하지 않는 것)

아래 항목은 이 프로젝트 범위에서 명시적으로 제외한다(`docs/PROJECT_SCOPE.md` §3, `TASKS/00_TASK_LIST.md` §4 EXCLUDED 25건 근거):

| 제외 항목 | 대체 방식 |
|---|---|
| **AWS·EC2 인프라** | Vercel(호스팅) + Supabase(DB/Auth)만 사용. EC2/AWS 관련 코드·설정·Task를 만들지 않는다. |
| **자동 Merge(무인 병합)** | 모든 병합은 CI 통과 후에도 사람이 PR을 검토하고 수동으로 병합한다. Merge bot/자동 병합 워크플로를 만들지 않는다. |
| **CMS(콘텐츠 관리 시스템)** | 콘텐츠 CRUD·검수·게시 워크플로, 미디어 업로드 승인 화면을 만들지 않는다. §6의 `src/data` 정적 파일로 대체한다. |
| **외부 이메일 공급자 연동** | 참가 승인/거절, 신고 처리 등의 알림은 이메일 발송 대신 Toast/화면 상태로 대체한다(`C-GLOBAL-TOAST`). SMTP·이메일 API 연동 코드를 만들지 않는다. |
| **모니터링/옵저버빌리티 인프라** | 가용성 모니터링, 5xx 알림, 구조화 로그 파이프라인, Lighthouse CI 게이트, axe 자동 검사 CI를 구축하지 않는다. 대신 `MANUAL-PERF-LIGHTHOUSE`, `MANUAL-A11Y-KEYBOARD` 등 수동 점검 Task로 대체한다. |

---

## 15. 착수 차단 (Blocking) — 실제로 누락된 파일·환경변수만

아래는 2026-09-16 기준 실제 파일 트리·`package.json`을 확인해 **실제로 없는 것만** 기록한 것이며, 구현 착수 전에 준비가 필요하다. 이미 존재하는 것은 포함하지 않았다.

### 15.1 패키지 (`package.json`에 없음)

| 패키지 | 필요 이유 | 관련 Task |
|---|---|---|
| `@supabase/supabase-js` | Browser/Server Supabase Client(§9) | `DB-ACCESS`, `API-AUTH-CALLBACK` |
| `vitest` | 단위 테스트(§12) | `UNIT-TRAVEL-DATES` 등 |
| `@playwright/test` | E2E Smoke(§12) | `E2E-PUBLIC-SMOKE` 등 |
| `zod`(또는 동등 검증 라이브러리) | 입력 검증(REQ-NF-015) | `DB-ACCESS` |

### 15.2 환경변수 (`.env.local` 파일 자체가 존재하지 않음)

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser/Server Supabase Client 공통 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser Client, RLS 적용 요청 |
| `SUPABASE_SERVICE_ROLE_KEY` | Server 전용 관리 작업(Seed, Admin API) — 클라이언트 번들 미포함 필수 |

Supabase 프로젝트 자체가 아직 생성/연결되지 않아 위 값의 실제 발급도 선행되어야 한다.

### 15.3 디렉토리·설정 파일 (존재하지 않음)

| 경로 | 관련 Task |
|---|---|
| `supabase/migrations/` (스키마·RLS SQL 없음) | `DB-SCHEMA-BASE`, `DB-RLS-BASE` |
| `supabase/seed.sql` | `DB-SEED-BASE` |
| `src/data/destinations.ts`, `src/data/safety.ts`, `src/data/about.ts` (§6, 디렉토리는 있으나 파일 없음) | `DATA-DESTINATIONS`, `DATA-SAFETY`, `DATA-REPRESENTATIVE` |
| `playwright.config.ts` | `E2E-*` Task 전체 |
| `.github/workflows/ci.yml` | `RELEASE-CI-GATES` |
| `.vercel/`(Vercel 프로젝트 연결 없음) | `RELEASE-VERCEL-DEPLOY-CHECK` |

이 목록 밖의 항목(예: 이메일 공급자 키, 모니터링 SaaS 연동, CMS 관리자 계정 등)은 §14에 따라 애초에 범위 밖이므로 "누락"으로 기록하지 않는다.
