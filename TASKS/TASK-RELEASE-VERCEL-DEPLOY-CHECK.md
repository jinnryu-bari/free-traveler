# RELEASE-VERCEL-DEPLOY-CHECK — Vercel 배포·환경변수 확인

**Category:** RELEASE_CHECK
**Implementation Status:** IMPLEMENT
**Priority:** P1
**Seq:** 75

## Context

'Vercel 배포·환경변수 확인'는 배포 전 최종 게이트를 확인하는 Task다 — 병합/배포 이전에 반드시 통과해야 한다.

## Project Scope

**Implementation Status:** `IMPLEMENT`

`docs/PROJECT_SCOPE.md` §2 구현 방식 요약과 일치해야 한다: 콘텐츠는 `src/data` 정적 파일, 즐겨찾기는 localStorage, 알림은 Toast 대체, 동행 마감/안전정보 stale은 조회 시점 계산, 이미지는 URL+alt만, 관리자 기능은 신고 상태 변경·외부 URL 설정으로 한정, 인증/동행 데이터는 Supabase, 핵심 흐름은 Playwright Smoke Test.

## Requirement Ref

`REQ-NF-012,016,034`

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | N/A |
| Route | N/A |
| Page Entry | N/A |

## Design Ref

- `design-reference/D-001/DESIGN.md` §2 Color Token, §4 Spacing, §5 Radius, §6 Shadow (공통 토큰)
- `design-reference/D-001/DESIGN.md` §19 완성형 Empty State·Placeholder 금지, §20 Do/Do Not

## Depends On

- `RELEASE-CI-GATES` — CI 파이프라인(lint/build/test)

## Expected Files

- (해당 없음) 없음(환경 설정 확인, 코드 파일 없음)

**이 Task는 위에 나열된 파일(들) 밖의 어떤 파일도 만들거나 수정하지 않는다.** 다른 Task의 Expected Files와 겹치는 파일을 이 Task에서 건드리지 않는다.

## Functional AC

- TLS 1.2+ 기본 적용 확인, 비밀키가 클라이언트 번들에 미포함(빌드 산출물 검사), 무료/저비용 티어 요금 참고치 확인

## Visual AC

- 해당 없음

## Security/Privacy AC

- 비밀키 클라이언트 노출 0건

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

- 다음 EXCLUDED 요구사항을 이 Task 범위에서 구현하지 않는다(`TASKS/00_TASK_LIST.md` §4 참조): REQ-NF-004, REQ-NF-005, REQ-NF-007, REQ-NF-008, REQ-NF-009, REQ-NF-010, REQ-NF-011, REQ-NF-032, REQ-NF-033

- 이 Task ID로 실제 구현 코드, git branch, commit을 생성하지 않는다 — 본 파일은 Task 정의 문서다.
- `design-reference/D-001/DESIGN.md` §20 "Do Not" 목록(Airbnb 상표 요소, 구매/예약/결제 UI, Proprietary 폰트, §2 밖의 임의 색상, 코랄을 경고/오류 색으로 사용, Lorem ipsum/준비 중/정보 확인 없음 문구, 다음 Section이 전혀 보이지 않는 Hero)을 위반하지 않는다.
