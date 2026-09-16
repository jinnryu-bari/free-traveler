# PAGE-SCR005 — SCR-005 `/account` Page Owner

**Category:** PAGE_OWNER
**Implementation Status:** IMPLEMENT
**Priority:** P0
**Seq:** 5

## Context

이 Task는 `/account`(SCR-005) 화면의 Page Owner다. 이미 완료된 하위 Component/Data/API Task들이 만든 조각을 실제 Route Page(`src/app/account/page.tsx`)에 조립하는 것만 범위이며, 새로운 Component를 이 Task 안에서 직접 구현하지 않는다(§UI_CONTRACT.md, D-001 §18 Section 순서 기준).

## Project Scope

**Implementation Status:** `IMPLEMENT`

`docs/PROJECT_SCOPE.md` §2 구현 방식 요약과 일치해야 한다: 콘텐츠는 `src/data` 정적 파일, 즐겨찾기는 localStorage, 알림은 Toast 대체, 동행 마감/안전정보 stale은 조회 시점 계산, 이미지는 URL+alt만, 관리자 기능은 신고 상태 변경·외부 URL 설정으로 한정, 인증/동행 데이터는 Supabase, 핵심 흐름은 Playwright Smoke Test.

## Requirement Ref

`REQ-FUNC-028,029,040,041,066,077`

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-005 |
| Route | `/account` |
| Page Entry | `src/app/account/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` §2 Color Token, §4 Spacing, §5 Radius, §6 Shadow (공통 토큰)
- `design-reference/UI_CONTRACT.md` § SCR-005 — 계정·관리
- `design-reference/D-001/DESIGN.md` §18 SCR-005 Section 순서·최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` §19 완성형 Empty State·Placeholder 금지, §20 Do/Do Not

## Depends On

- `C-SCR005-AUTH-GUEST` — Guest 로그인/가입/재설정 카드
- `C-SCR005-PROFILE` — Member 프로필 Form + 성인확인 배지
- `C-SCR005-MY-ACTIVITY` — 내 글·참가 요청·차단 목록
- `C-SCR005-ADMIN-REPORTS` — 관리자 신고 상태 변경
- `C-SCR005-ADMIN-EXTERNAL-URL` — 관리자 외부 URL 설정
- `C-SCR005-ROLE-GATE` — 역할별 탭 렌더링/차단 로직
- `API-AUTH-CALLBACK` — Supabase 인증 콜백
- `API-ADMIN-REPORTS` — 관리자 신고 상태 변경 API
- `API-ADMIN-EXTERNAL-LINKS` — 관리자 외부 URL 설정 API
- `API-BLOCKLIST` — 차단 실행/해제 API
- `C-GLOBAL-POLICY-TERMS` — 이용약관 정적 페이지
- `C-GLOBAL-POLICY-PRIVACY` — 개인정보 처리방침 정적 페이지
- `C-GLOBAL-SEO-HELPER` — SEO 메타데이터 헬퍼

## Expected Files

- `src/app/account/page.tsx`

**이 Task는 위에 나열된 파일(들) 밖의 어떤 파일도 만들거나 수정하지 않는다.** 다른 Task의 Expected Files와 겹치는 파일을 이 Task에서 건드리지 않는다.

## Functional AC

- Guest·Member·Admin 중 현재 역할의 Intro→핵심 작업→도움말/다음 행동을 실제로 조립하고, 역할에 없는 관리 영역(예: 비Admin 사용자에게 신고/외부URL 탭)은 렌더링 자체를 생략
- 데이터 출처는 Supabase Auth 세션 + `/api/admin/*`
- 내 글/참가 요청/차단/신고 목록은 0건이어도 완성형 Empty State

## Visual AC

- 탭 상단 고정, Desktop Form 2열, Mobile 탭 스크롤 1행+Form 1열

## Security/Privacy AC

- 성인확인은 `is_adult`+`adult_verified_at`만 저장(생년월일 미저장)
- role 미달 시 Admin 탭 URL 직접 접근해도 "권한 없음" 안내로 대체(서버 RLS로도 재검증)

## Test Cases

- Functional AC의 각 조건을 개별 케이스로 분리해 확인한다: Guest·Member·Admin 중 현재 역할의 Intro→핵심 작업→도움말/다음 행동을 실제로 조립하고, 역할에 없는 관리 영역(예: 비Admin 사용자에게 신고/외부URL 탭)은 렌더링 자체를 생략; 데이터 출처는 Supabase Auth 세션 + `/api/admin/*`; 내 글/참가 요청/차단/신고 목록은 0건이어도 완성형 Empty State
- `E2E-MATE-AUTH`(동행·인증 Chromium Smoke(3개 흐름))가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.
- `MANUAL-A11Y-KEYBOARD`(키보드·스크린리더 수동 점검)가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.

## Verify

- E2E-MATE-AUTH
- MANUAL-A11Y-KEYBOARD

## Definition of Done

- 위 Expected Files만 생성/수정되었고 그 밖의 파일은 변경되지 않았다.
- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족되었다.
- Depends On에 명시된 선행 Task가 모두 완료 상태다.
- Verify 열에 연결된 Task(들)가 이 Task의 완료를 확인했다(또는 자기완결 Task는 체크리스트 서명 완료).
- Forbidden 섹션에 명시된 EXCLUDED 요구사항·금지 패턴이 구현되지 않았다.
- (본 문서 자체) 이 상세 파일은 Task 정의 문서이며, 이 문서를 작성하는 과정에서 구현 코드·Branch·Commit은 생성되지 않았다.

## Forbidden

- 다음 EXCLUDED 요구사항을 이 Task 범위에서 구현하지 않는다(`TASKS/00_TASK_LIST.md` §4 참조): REQ-FUNC-045, REQ-NF-018

- 이 Task ID로 실제 구현 코드, git branch, commit을 생성하지 않는다 — 본 파일은 Task 정의 문서다.
- `design-reference/D-001/DESIGN.md` §20 "Do Not" 목록(Airbnb 상표 요소, 구매/예약/결제 UI, Proprietary 폰트, §2 밖의 임의 색상, 코랄을 경고/오류 색으로 사용, Lorem ipsum/준비 중/정보 확인 없음 문구, 다음 Section이 전혀 보이지 않는 Hero)을 위반하지 않는다.
