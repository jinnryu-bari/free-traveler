# API-MATES — 동행글 목록·생성 API

**Category:** API
**Implementation Status:** IMPLEMENT
**Priority:** P0
**Seq:** 55

## Context

이 Task는 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 technical_routes에 정의된 API Route `/api/mates`를 구현한다. UI Component가 이 API를 호출해 데이터를 읽고 쓴다.

## Project Scope

**Implementation Status:** `IMPLEMENT`

`docs/PROJECT_SCOPE.md` §2 구현 방식 요약과 일치해야 한다: 콘텐츠는 `src/data` 정적 파일, 즐겨찾기는 localStorage, 알림은 Toast 대체, 동행 마감/안전정보 stale은 조회 시점 계산, 이미지는 URL+alt만, 관리자 기능은 신고 상태 변경·외부 URL 설정으로 한정, 인증/동행 데이터는 Supabase, 핵심 흐름은 Playwright Smoke Test.

## Requirement Ref

`REQ-FUNC-030,031`

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-003, SCR-004 |
| Route | `/api/mates` |
| Page Entry | `src/app/api/mates/route.ts` |

## Design Ref

- `design-reference/D-001/DESIGN.md` §2 Color Token, §4 Spacing, §5 Radius, §6 Shadow (공통 토큰)
- `design-reference/UI_CONTRACT.md` § SCR-003 — 통합 여행 준비
- `design-reference/D-001/DESIGN.md` §18 SCR-003 Section 순서·최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` §19 완성형 Empty State·Placeholder 금지, §20 Do/Do Not

## Depends On

- `DB-SCHEMA-BASE` — Supabase 스키마(6개 테이블)
- `DB-RLS-BASE` — Row Level Security 정책
- `DB-ACCESS` — 서버 데이터 접근 레이어

## Expected Files

- `src/app/api/mates/route.ts`

**이 Task는 위에 나열된 파일(들) 밖의 어떤 파일도 만들거나 수정하지 않는다.** 다른 Task의 Expected Files와 겹치는 파일을 이 Task에서 건드리지 않는다.

## Functional AC

- GET: 필터 조건(AND)·차단 사용자 제외 후 목록 반환
- POST: 인증+성인확인 세션 필수(401/리다이렉트), 연락처 패턴 서버측 재검증

## Visual AC

- 해당 없음

## Security/Privacy AC

- 미인증 POST 100% 차단

## Test Cases

- Functional AC의 각 조건을 개별 케이스로 분리해 확인한다: GET: 필터 조건(AND)·차단 사용자 제외 후 목록 반환; POST: 인증+성인확인 세션 필수(401/리다이렉트), 연락처 패턴 서버측 재검증
- `UNIT-MATE-STATE`(모집 상태·요청 상태 전이 단위 테스트)가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.
- `TEST-RLS-BASIC`(RLS 정책 기본 통합 테스트)가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.

## Verify

- UNIT-MATE-STATE
- TEST-RLS-BASIC

## Definition of Done

- 위 Expected Files만 생성/수정되었고 그 밖의 파일은 변경되지 않았다.
- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족되었다.
- Depends On에 명시된 선행 Task가 모두 완료 상태다.
- Verify 열에 연결된 Task(들)가 이 Task의 완료를 확인했다(또는 자기완결 Task는 체크리스트 서명 완료).
- Forbidden 섹션에 명시된 EXCLUDED 요구사항·금지 패턴이 구현되지 않았다.
- (본 문서 자체) 이 상세 파일은 Task 정의 문서이며, 이 문서를 작성하는 과정에서 구현 코드·Branch·Commit은 생성되지 않았다.

## Forbidden

- 다음 EXCLUDED 요구사항을 이 Task 범위에서 구현하지 않는다(`TASKS/00_TASK_LIST.md` §4 참조): REQ-NF-021

- 이 Task ID로 실제 구현 코드, git branch, commit을 생성하지 않는다 — 본 파일은 Task 정의 문서다.
- `design-reference/D-001/DESIGN.md` §20 "Do Not" 목록(Airbnb 상표 요소, 구매/예약/결제 UI, Proprietary 폰트, §2 밖의 임의 색상, 코랄을 경고/오류 색으로 사용, Lorem ipsum/준비 중/정보 확인 없음 문구, 다음 Section이 전혀 보이지 않는 Hero)을 위반하지 않는다.
