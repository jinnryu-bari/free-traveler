# C-SCR001-MATES-PREVIEW — 최근 동행글 미리보기

**Category:** COMPONENT
**Implementation Status:** IMPLEMENT
**Priority:** P1
**Seq:** 12

## Context

'최근 동행글 미리보기'는 SCR-001 화면의 UI_CONTRACT.md 주요 Component 목록에 정의된 조각을 구현하는 Component Task다. Page Owner Task(`API-MATES` 중 PAGE-* 항목)가 이 Task의 산출물을 조립한다.

## Project Scope

**Implementation Status:** `IMPLEMENT`

`docs/PROJECT_SCOPE.md` §2 구현 방식 요약과 일치해야 한다: 콘텐츠는 `src/data` 정적 파일, 즐겨찾기는 localStorage, 알림은 Toast 대체, 동행 마감/안전정보 stale은 조회 시점 계산, 이미지는 URL+alt만, 관리자 기능은 신고 상태 변경·외부 URL 설정으로 한정, 인증/동행 데이터는 Supabase, 핵심 흐름은 Playwright Smoke Test.

## Requirement Ref

`REQ-FUNC-069(부분)`

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-001 |
| Route | `/` |
| Page Entry | `src/app/page.tsx`(사용처) |

## Design Ref

- `design-reference/D-001/DESIGN.md` §2 Color Token, §4 Spacing, §5 Radius, §6 Shadow (공통 토큰)
- `design-reference/UI_CONTRACT.md` § SCR-001 — 메인
- `design-reference/D-001/DESIGN.md` §18 SCR-001 Section 순서·최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` §11 Mate Post Card, §8 Search·Filter
- `design-reference/D-001/DESIGN.md` §19 완성형 Empty State·Placeholder 금지, §20 Do/Do Not

## Depends On

- `API-MATES` — 동행글 목록·생성 API

## Expected Files

- `src/components/home/mates-preview.tsx`

**이 Task는 위에 나열된 파일(들) 밖의 어떤 파일도 만들거나 수정하지 않는다.** 다른 Task의 Expected Files와 겹치는 파일을 이 Task에서 건드리지 않는다.

## Functional AC

- 데이터 있으면 3개 카드(국가·기간·모집상태), 없으면 완성형 Empty State("아직 등록된 동행글이 없어요..." + 동행글 작성하기 CTA) — Lorem ipsum·준비 중·정보 확인 필요·빈 카드 금지

## Visual AC

- Desktop/Mobile 카드 그리드 공통 패턴

## Security/Privacy AC

- 카드에 연락처 미노출(REQ-FUNC-033과 동일 규칙 적용)

## Test Cases

- Functional AC의 각 조건을 개별 케이스로 분리해 확인한다: 데이터 있으면 3개 카드(국가·기간·모집상태), 없으면 완성형 Empty State("아직 등록된 동행글이 없어요..." + 동행글 작성하기 CTA) — Lorem ipsum·준비 중·정보 확인 필요·빈 카드 금지
- `E2E-PUBLIC-SMOKE`(공개 흐름 Chromium Smoke(2개 흐름))가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.

## Verify

- E2E-PUBLIC-SMOKE

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
