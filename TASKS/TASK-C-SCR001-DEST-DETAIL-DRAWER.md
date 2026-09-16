# C-SCR001-DEST-DETAIL-DRAWER — 여행지 상세 Drawer(즐겨찾기·공유 포함)

**Category:** COMPONENT
**Implementation Status:** IMPLEMENT
**Priority:** P0
**Seq:** 9

## Context

'여행지 상세 Drawer(즐겨찾기·공유 포함)'는 SCR-001 화면의 UI_CONTRACT.md 주요 Component 목록에 정의된 조각을 구현하는 Component Task다. Page Owner Task(`DATA-DESTINATIONS; C-SCR001-SAFETY-DETAIL-DRAWER` 중 PAGE-* 항목)가 이 Task의 산출물을 조립한다.

## Project Scope

**Implementation Status:** `IMPLEMENT`

`docs/PROJECT_SCOPE.md` §2 구현 방식 요약과 일치해야 한다: 콘텐츠는 `src/data` 정적 파일, 즐겨찾기는 localStorage, 알림은 Toast 대체, 동행 마감/안전정보 stale은 조회 시점 계산, 이미지는 URL+alt만, 관리자 기능은 신고 상태 변경·외부 URL 설정으로 한정, 인증/동행 데이터는 Supabase, 핵심 흐름은 Playwright Smoke Test.

## Requirement Ref

`REQ-FUNC-004,006,007,009,068,069`

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
- `design-reference/D-001/DESIGN.md` §9 Destination Card, §12 Drawer·Modal
- `design-reference/D-001/DESIGN.md` §19 완성형 Empty State·Placeholder 금지, §20 Do/Do Not

## Depends On

- `DATA-DESTINATIONS` — 여행지 정적 데이터
- `C-SCR001-SAFETY-DETAIL-DRAWER` — 안전정보 상세 Drawer

## Expected Files

- `src/components/home/destination-detail-drawer.tsx`

**이 Task는 위에 나열된 파일(들) 밖의 어떤 파일도 만들거나 수정하지 않는다.** 다른 Task의 Expected Files와 겹치는 파일을 이 Task에서 건드리지 않는다.

## Functional AC

- 소개·명소 5개↑·추천시기·1일/3일 일정·예산·교통·음식 3개↑·에티켓·출처·수정일 전부 표시, 안전정보 패널 링크, 관련 여행지 최대 6개, 즐겨찾기 토글(localStorage, 중복 방지), URL 공유(Web Share API 실패 시 URL 복사 폴백)

## Visual AC

- Desktop 우측 슬라이드 480~560px, Mobile 하단 Bottom Sheet(80%까지 확장, drag handle)

## Security/Privacy AC

- 즐겨찾기는 서버 전송 없이 localStorage만 사용

## Test Cases

- Functional AC의 각 조건을 개별 케이스로 분리해 확인한다: 소개·명소 5개↑·추천시기·1일/3일 일정·예산·교통·음식 3개↑·에티켓·출처·수정일 전부 표시, 안전정보 패널 링크, 관련 여행지 최대 6개, 즐겨찾기 토글(localStorage, 중복 방지), URL 공유(Web Share API 실패 시 URL 복사 폴백)
- `E2E-PUBLIC-SMOKE`(공개 흐름 Chromium Smoke(2개 흐름))가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.
- `MANUAL-A11Y-KEYBOARD`(키보드·스크린리더 수동 점검)가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.

## Verify

- E2E-PUBLIC-SMOKE
- MANUAL-A11Y-KEYBOARD

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
