# MANUAL-EXTERNAL-LINKS — 외부 링크·미전송 수동 점검

**Category:** MANUAL_CHECK
**Implementation Status:** IMPLEMENT
**Priority:** P0
**Seq:** 73

## Context

'외부 링크·미전송 수동 점검'는 자동화하지 않고 수동 점검·체크리스트 서명으로 완료를 기록하는 Task다(`docs/PROJECT_SCOPE.md` §2 최종 확인 규칙).

## Project Scope

**Implementation Status:** `IMPLEMENT`

`docs/PROJECT_SCOPE.md` §2 구현 방식 요약과 일치해야 한다: 콘텐츠는 `src/data` 정적 파일, 즐겨찾기는 localStorage, 알림은 Toast 대체, 동행 마감/안전정보 stale은 조회 시점 계산, 이미지는 URL+alt만, 관리자 기능은 신고 상태 변경·외부 URL 설정으로 한정, 인증/동행 데이터는 Supabase, 핵심 흐름은 Playwright Smoke Test.

## Requirement Ref

`REQ-FUNC-016,018,024,026,049; REQ-NF-017`

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-001, SCR-003 |
| Route | N/A |
| Page Entry | N/A(코드 파일 없음) |

## Design Ref

- `design-reference/D-001/DESIGN.md` §2 Color Token, §4 Spacing, §5 Radius, §6 Shadow (공통 토큰)
- `design-reference/UI_CONTRACT.md` § SCR-001 — 메인
- `design-reference/D-001/DESIGN.md` §18 SCR-001 Section 순서·최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` §19 완성형 Empty State·Placeholder 금지, §20 Do/Do Not

## Depends On

- `C-SCR003-FLIGHT-FORM` — 항공 조건 입력·요약·외부 이동
- `C-SCR003-HOTEL-FORM` — 숙소 조건 입력·요약·외부 이동
- `C-SCR001-SAFETY-DETAIL-DRAWER` — 안전정보 상세 Drawer

## Expected Files

- (해당 없음) 없음(수동 점검, 코드 파일 없음)

**이 Task는 위에 나열된 파일(들) 밖의 어떤 파일도 만들거나 수정하지 않는다.** 다른 Task의 Expected Files와 겹치는 파일을 이 Task에서 건드리지 않는다.

## Functional AC

- 항공/숙소/외교부 외부 링크 실제 열림 확인, 새 탭 `noopener,noreferrer`, 네트워크 탭에서 입력값 미전송 육안 재확인

## Visual AC

- 해당 없음

## Security/Privacy AC

- 해당 없음

## Test Cases

- 본 Task 자체가 검증 단위다(Verify 열 = 자기완결) — 체크리스트 서명으로 완료를 기록한다.

## Verify

- 자기완결

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
