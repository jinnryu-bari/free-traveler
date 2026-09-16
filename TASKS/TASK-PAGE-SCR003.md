# PAGE-SCR003 — SCR-003 `/travel-tools` Page Owner

**Category:** PAGE_OWNER
**Implementation Status:** IMPLEMENT
**Priority:** P0
**Seq:** 3

## Context

이 Task는 `/travel-tools`(SCR-003) 화면의 Page Owner다. 이미 완료된 하위 Component/Data/API Task들이 만든 조각을 실제 Route Page(`src/app/travel-tools/page.tsx`)에 조립하는 것만 범위이며, 새로운 Component를 이 Task 안에서 직접 구현하지 않는다(§UI_CONTRACT.md, D-001 §18 Section 순서 기준).

## Project Scope

**Implementation Status:** `IMPLEMENT`

`docs/PROJECT_SCOPE.md` §2 구현 방식 요약과 일치해야 한다: 콘텐츠는 `src/data` 정적 파일, 즐겨찾기는 localStorage, 알림은 Toast 대체, 동행 마감/안전정보 stale은 조회 시점 계산, 이미지는 URL+alt만, 관리자 기능은 신고 상태 변경·외부 URL 설정으로 한정, 인증/동행 데이터는 Supabase, 핵심 흐름은 Playwright Smoke Test.

## Requirement Ref

`REQ-FUNC-011~026,027,028,031,032,080`

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-003 |
| Route | `/travel-tools` |
| Page Entry | `src/app/travel-tools/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` §2 Color Token, §4 Spacing, §5 Radius, §6 Shadow (공통 토큰)
- `design-reference/UI_CONTRACT.md` § SCR-003 — 통합 여행 준비
- `design-reference/D-001/DESIGN.md` §18 SCR-003 Section 순서·최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` §19 완성형 Empty State·Placeholder 금지, §20 Do/Do Not

## Depends On

- `C-SCR003-INTRO-TABS` — Intro Banner + Tabs Shell
- `C-SCR003-FLIGHT-FORM` — 항공 조건 입력·요약·외부 이동
- `C-SCR003-HOTEL-FORM` — 숙소 조건 입력·요약·외부 이동
- `C-SCR003-MATE-COMPOSER` — 동행 모집글 작성 Form(인증 게이트)
- `C-SCR003-NONTRANSMIT-TIPS` — 비전달 고지 + Tip 3개
- `API-MATES` — 동행글 목록·생성 API
- `C-GLOBAL-TOAST` — Toast/알림 컴포넌트
- `C-GLOBAL-POLICY-TERMS` — 이용약관 정적 페이지
- `C-GLOBAL-POLICY-SAFETY-GUIDE` — 동행 안전수칙 정적 페이지
- `C-GLOBAL-SEO-HELPER` — SEO 메타데이터 헬퍼

## Expected Files

- `src/app/travel-tools/page.tsx`

**이 Task는 위에 나열된 파일(들) 밖의 어떤 파일도 만들거나 수정하지 않는다.** 다른 Task의 Expected Files와 겹치는 파일을 이 Task에서 건드리지 않는다.

## Functional AC

- Section 순서를 Intro→탭(항공편/숙소/동행 구하기)→여행정보 Form→입력 요약·외부 이동→찾기 Tip 3→동행 작성 또는 로그인 안내·안전 안내 순으로 조립
- 항공편·숙소·동행 구하기 3개 탭을 실제로 한 페이지에서 조립하고 탭 전환 시 각 탭의 입력·검증·완료 상태가 독립적으로 유지됨을 보장
- 탭별 데이터 출처는 클라이언트 세션 상태(항공/숙소)와 API(동행 구하기 게시)

## Visual AC

- Desktop 2열 Form, Mobile 3분할 탭(가로 스크롤 없음), 요약→Action Card 세로 스택(Mobile)

## Security/Privacy AC

- 항공·호텔 입력값을 서버/DB/URL 쿼리로 전송하지 않음(REQ-FUNC-017,025)
- 동행 작성 폼은 연락처 패턴 탐지 시 제출 자체를 차단

## Test Cases

- Functional AC의 각 조건을 개별 케이스로 분리해 확인한다: Section 순서를 Intro→탭(항공편/숙소/동행 구하기)→여행정보 Form→입력 요약·외부 이동→찾기 Tip 3→동행 작성 또는 로그인 안내·안전 안내 순으로 조립; 항공편·숙소·동행 구하기 3개 탭을 실제로 한 페이지에서 조립하고 탭 전환 시 각 탭의 입력·검증·완료 상태가 독립적으로 유지됨을 보장; 탭별 데이터 출처는 클라이언트 세션 상태(항공/숙...
- `E2E-TRAVEL-TOOLS`(여행 준비 Chromium Smoke(2개 흐름))가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.
- `E2E-MATE-AUTH`(동행·인증 Chromium Smoke(3개 흐름))가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.
- `MANUAL-EXTERNAL-LINKS`(외부 링크·미전송 수동 점검)가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.

## Verify

- E2E-TRAVEL-TOOLS
- E2E-MATE-AUTH
- MANUAL-EXTERNAL-LINKS

## Definition of Done

- 위 Expected Files만 생성/수정되었고 그 밖의 파일은 변경되지 않았다.
- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족되었다.
- Depends On에 명시된 선행 Task가 모두 완료 상태다.
- Verify 열에 연결된 Task(들)가 이 Task의 완료를 확인했다(또는 자기완결 Task는 체크리스트 서명 완료).
- Forbidden 섹션에 명시된 EXCLUDED 요구사항·금지 패턴이 구현되지 않았다.
- (본 문서 자체) 이 상세 파일은 Task 정의 문서이며, 이 문서를 작성하는 과정에서 구현 코드·Branch·Commit은 생성되지 않았다.

## Forbidden

- 이 영역에 해당하는 EXCLUDED 요구사항 없음(`docs/PROJECT_SCOPE.md` §4/`TASKS/00_TASK_LIST.md` §4 참조).

- 이 Task ID로 실제 구현 코드, git branch, commit을 생성하지 않는다 — 본 파일은 Task 정의 문서다.
- `design-reference/D-001/DESIGN.md` §20 "Do Not" 목록(Airbnb 상표 요소, 구매/예약/결제 UI, Proprietary 폰트, §2 밖의 임의 색상, 코랄을 경고/오류 색으로 사용, Lorem ipsum/준비 중/정보 확인 없음 문구, 다음 Section이 전혀 보이지 않는 Hero)을 위반하지 않는다.
