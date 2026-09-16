# PAGE-SCR002 — SCR-002 `/about` Page Owner

**Category:** PAGE_OWNER
**Implementation Status:** IMPLEMENT
**Priority:** P0
**Seq:** 2

## Context

이 Task는 `/about`(SCR-002) 화면의 Page Owner다. 이미 완료된 하위 Component/Data/API Task들이 만든 조각을 실제 Route Page(`src/app/about/page.tsx`)에 조립하는 것만 범위이며, 새로운 Component를 이 Task 안에서 직접 구현하지 않는다(§UI_CONTRACT.md, D-001 §18 Section 순서 기준).

## Project Scope

**Implementation Status:** `IMPLEMENT`

`docs/PROJECT_SCOPE.md` §2 구현 방식 요약과 일치해야 한다: 콘텐츠는 `src/data` 정적 파일, 즐겨찾기는 localStorage, 알림은 Toast 대체, 동행 마감/안전정보 stale은 조회 시점 계산, 이미지는 URL+alt만, 관리자 기능은 신고 상태 변경·외부 URL 설정으로 한정, 인증/동행 데이터는 Supabase, 핵심 흐름은 Playwright Smoke Test.

## Requirement Ref

`REQ-FUNC-057~063`

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-002 |
| Route | `/about` |
| Page Entry | `src/app/about/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` §2 Color Token, §4 Spacing, §5 Radius, §6 Shadow (공통 토큰)
- `design-reference/UI_CONTRACT.md` § SCR-002 — 대표 소개
- `design-reference/D-001/DESIGN.md` §18 SCR-002 Section 순서·최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` §19 완성형 Empty State·Placeholder 금지, §20 Do/Do Not

## Depends On

- `C-SCR002-PROFILE-HERO` — Profile Hero + 여행 지표 카드
- `C-SCR002-INTRO-PHILOSOPHY` — 소개·철학 Split
- `C-SCR002-TIMELINE` — 여행 Timeline
- `C-SCR002-COUNTRY-CHIPS` — 방문 국가 Chip(권역별)
- `C-SCR002-GALLERY` — 여행 Gallery
- `C-SCR002-MEMORABLE-CTA` — 기억에 남는 여행지 + CTA Banner
- `C-SCR002-CONTACT-LINKS` — 문의·SNS 링크
- `DATA-REPRESENTATIVE` — 대표 소개 정적 데이터
- `DATA-DESTINATIONS` — 여행지 정적 데이터
- `C-GLOBAL-SEO-HELPER` — SEO 메타데이터 헬퍼

## Expected Files

- `src/app/about/page.tsx`

**이 Task는 위에 나열된 파일(들) 밖의 어떤 파일도 만들거나 수정하지 않는다.** 다른 Task의 Expected Files와 겹치는 파일을 이 Task에서 건드리지 않는다.

## Functional AC

- Section 순서를 Profile Hero→여행 지표→소개·철학→Timeline 6→방문 국가 30→Gallery 8→기억에 남는 여행지 4+CTA 순으로 조립
- 데이터 출처는 전부 `src/data/about.ts`(방문 국가만 `src/data/about.ts`의 countries 필드, 기억에 남는 여행지는 `src/data/destinations.ts` 교차참조)
- 최소 Timeline 6개, 방문 국가 Chip 30개, Gallery 8장, 기억에 남는 여행지 카드 4개

## Visual AC

- Desktop Hero ≈480px, Gallery 3열/Mobile 2열, 국가 Chip 권역별 그룹 헤딩

## Security/Privacy AC

- 없음(정적 콘텐츠, 개인정보 미수집)

## Test Cases

- Functional AC의 각 조건을 개별 케이스로 분리해 확인한다: Section 순서를 Profile Hero→여행 지표→소개·철학→Timeline 6→방문 국가 30→Gallery 8→기억에 남는 여행지 4+CTA 순으로 조립; 데이터 출처는 전부 `src/data/about.ts`(방문 국가만 `src/data/about.ts`의 countries 필드, 기억에 남는 여행지는 `src/data/destinations....
- `E2E-PUBLIC-SMOKE`(공개 흐름 Chromium Smoke(2개 흐름))가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.
- `MANUAL-RESPONSIVE-VISUAL`(Desktop/Mobile 시각·리듬 점검)가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.
- `MANUAL-CONTENT-REVIEW`(콘텐츠 완전성·출처 수동 검수)가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.

## Verify

- E2E-PUBLIC-SMOKE
- MANUAL-RESPONSIVE-VISUAL
- MANUAL-CONTENT-REVIEW

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
