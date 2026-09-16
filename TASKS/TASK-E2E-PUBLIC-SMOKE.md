# E2E-PUBLIC-SMOKE — 공개 흐름 Chromium Smoke(2개 흐름)

**Category:** E2E_TEST
**Implementation Status:** IMPLEMENT
**Priority:** P0
**Seq:** 66

## Context

이 Task는 Playwright Chromium 단일 브라우저로 핵심 사용자 흐름의 happy path를 자동화 Smoke Test로 검증한다.

## Project Scope

**Implementation Status:** `IMPLEMENT`

`docs/PROJECT_SCOPE.md` §2 구현 방식 요약과 일치해야 한다: 콘텐츠는 `src/data` 정적 파일, 즐겨찾기는 localStorage, 알림은 Toast 대체, 동행 마감/안전정보 stale은 조회 시점 계산, 이미지는 URL+alt만, 관리자 기능은 신고 상태 변경·외부 URL 설정으로 한정, 인증/동행 데이터는 Supabase, 핵심 흐름은 Playwright Smoke Test.

## Requirement Ref

`REQ-FUNC-001,004,006,046~054,057~063,064,065,078`

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-001, SCR-002 |
| Route | `/`, `/about` |
| Page Entry | N/A |

## Design Ref

- `design-reference/D-001/DESIGN.md` §2 Color Token, §4 Spacing, §5 Radius, §6 Shadow (공통 토큰)
- `design-reference/UI_CONTRACT.md` § SCR-001 — 메인
- `design-reference/D-001/DESIGN.md` §18 SCR-001 Section 순서·최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` §19 완성형 Empty State·Placeholder 금지, §20 Do/Do Not

## Depends On

- `PAGE-SCR001` — SCR-001 `/` Page Owner
- `PAGE-SCR002` — SCR-002 `/about` Page Owner

## Expected Files

- `playwright.config.ts`
- `tests/e2e/public-smoke.spec.ts`

**이 Task는 위에 나열된 파일(들) 밖의 어떤 파일도 만들거나 수정하지 않는다.** 다른 Task의 Expected Files와 겹치는 파일을 이 Task에서 건드리지 않는다.

## Functional AC

- Chromium 단일 브라우저로 ①여행지 탐색→필터→상세→안전정보 Drawer, ②대표 소개 열람→SCR-001 이동, 2개 핵심 흐름의 happy path만 검증(비회원, 로그인 불필요)

## Visual AC

- 해당 없음

## Security/Privacy AC

- 해당 없음

## Test Cases

- `RELEASE-CI-GATES`(CI 파이프라인(lint/build/test))가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.
- Chromium 단일 브라우저(Playwright `projects: [{name: 'chromium'}]`)로만 실행한다 — Firefox/WebKit 프로젝트를 추가하지 않는다.
- happy path(핵심 플로우)만 다루며 시각적 회귀·부하 테스트를 포함하지 않는다.

## Verify

- RELEASE-CI-GATES

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
