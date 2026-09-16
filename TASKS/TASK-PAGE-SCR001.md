# PAGE-SCR001 — SCR-001 `/` Page Owner

**Category:** PAGE_OWNER
**Implementation Status:** IMPLEMENT
**Priority:** P0
**Seq:** 1

## Context

이 Task는 `/`(SCR-001) 화면의 Page Owner다. 이미 완료된 하위 Component/Data/API Task들이 만든 조각을 실제 Route Page(`src/app/page.tsx`)에 조립하는 것만 범위이며, 새로운 Component를 이 Task 안에서 직접 구현하지 않는다(§UI_CONTRACT.md, D-001 §18 Section 순서 기준).

## Project Scope

**Implementation Status:** `IMPLEMENT`

`docs/PROJECT_SCOPE.md` §2 구현 방식 요약과 일치해야 한다: 콘텐츠는 `src/data` 정적 파일, 즐겨찾기는 localStorage, 알림은 Toast 대체, 동행 마감/안전정보 stale은 조회 시점 계산, 이미지는 URL+alt만, 관리자 기능은 신고 상태 변경·외부 URL 설정으로 한정, 인증/동행 데이터는 Supabase, 핵심 흐름은 Playwright Smoke Test.

## Requirement Ref

`REQ-FUNC-001~010,068,069`

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | SCR-001 |
| Route | `/` |
| Page Entry | `src/app/page.tsx` |

## Design Ref

- `design-reference/D-001/DESIGN.md` §2 Color Token, §4 Spacing, §5 Radius, §6 Shadow (공통 토큰)
- `design-reference/UI_CONTRACT.md` § SCR-001 — 메인
- `design-reference/D-001/DESIGN.md` §18 SCR-001 Section 순서·최소 콘텐츠 수
- `design-reference/D-001/DESIGN.md` §19 완성형 Empty State·Placeholder 금지, §20 Do/Do Not

## Depends On

- `C-SCR001-HERO-SEARCH` — Hero 검색 입력 로직 연결
- `C-SCR001-DEST-GRIDS` — 국내/해외 여행지 Card Grid
- `C-SCR001-THEME-CHIPS` — 여행 동기 Chip 필터
- `C-SCR001-DEST-DETAIL-DRAWER` — 여행지 상세 Drawer(즐겨찾기·공유 포함)
- `C-SCR001-SAFETY-GRID` — 국가별 주의사항 Card Grid
- `C-SCR001-SAFETY-DETAIL-DRAWER` — 안전정보 상세 Drawer
- `C-SCR001-MATES-PREVIEW` — 최근 동행글 미리보기
- `C-SCR001-FOUNDER-SPLIT` — free_traveler 소개 요약 Split
- `DATA-DESTINATIONS` — 여행지 정적 데이터
- `DATA-SAFETY` — 국가 안전정보 정적 데이터
- `DATA-REPRESENTATIVE` — 대표 소개 정적 데이터
- `API-MATES` — 동행글 목록·생성 API
- `C-GLOBAL-SEO-HELPER` — SEO 메타데이터 헬퍼

## Expected Files

- `src/app/page.tsx`

**이 Task는 위에 나열된 파일(들) 밖의 어떤 파일도 만들거나 수정하지 않는다.** 다른 Task의 Expected Files와 겹치는 파일을 이 Task에서 건드리지 않는다.

## Functional AC

- Section 순서를 Hero→국내 6→해외 6→여행 동기 6→국가별 주의사항 6→최근 동행글 3/Empty→free_traveler 소개 순으로 정확히 조립
- 각 Section 데이터 출처는 `src/data/destinations.ts`(국내/해외/동기/관련여행지), `src/data/safety.ts`(주의사항), API 동행 목록(최근 동행글), `src/data/about.ts`(소개 요약)로 명시
- 최소 Card 수 국내 6·해외 6·주의사항 6, 동행글 3 또는 완성형 Empty State
- create-next-app 스타터 마크업을 전부 교체(잔존 스타터 텍스트/로고 0건)

## Visual AC

- Desktop 1240px 컨테이너, Hero ≈560px(다음 Section 일부 노출), Mobile 390px 1열 스택, Chip 2열
- 반응형 콘텐츠 밀도는 D-001 §15 규칙 준수

## Security/Privacy AC

- 안전정보 stale 계산은 클라이언트 렌더링 시점 계산(REQ-FUNC-050), 즐겨찾기는 localStorage만 사용, 서버 전송 없음

## Test Cases

- Functional AC의 각 조건을 개별 케이스로 분리해 확인한다: Section 순서를 Hero→국내 6→해외 6→여행 동기 6→국가별 주의사항 6→최근 동행글 3/Empty→free_traveler 소개 순으로 정확히 조립; 각 Section 데이터 출처는 `src/data/destinations.ts`(국내/해외/동기/관련여행지), `src/data/safety.ts`(주의사항), API 동행 목록(최근 동행글), `...
- `E2E-PUBLIC-SMOKE`(공개 흐름 Chromium Smoke(2개 흐름))가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.
- `MANUAL-RESPONSIVE-VISUAL`(Desktop/Mobile 시각·리듬 점검)가 이 Task의 완료를 검증한다 — 해당 Task 실행 시 본 Task의 Functional/Security AC가 자동/수동으로 재확인되어야 한다.

## Verify

- E2E-PUBLIC-SMOKE
- MANUAL-RESPONSIVE-VISUAL

## Definition of Done

- 위 Expected Files만 생성/수정되었고 그 밖의 파일은 변경되지 않았다.
- Functional AC, Visual AC, Security/Privacy AC 전 항목이 충족되었다.
- Depends On에 명시된 선행 Task가 모두 완료 상태다.
- Verify 열에 연결된 Task(들)가 이 Task의 완료를 확인했다(또는 자기완결 Task는 체크리스트 서명 완료).
- Forbidden 섹션에 명시된 EXCLUDED 요구사항·금지 패턴이 구현되지 않았다.
- (본 문서 자체) 이 상세 파일은 Task 정의 문서이며, 이 문서를 작성하는 과정에서 구현 코드·Branch·Commit은 생성되지 않았다.

## Forbidden

- 다음 EXCLUDED 요구사항을 이 Task 범위에서 구현하지 않는다(`TASKS/00_TASK_LIST.md` §4 참조): REQ-FUNC-067

- 이 Task ID로 실제 구현 코드, git branch, commit을 생성하지 않는다 — 본 파일은 Task 정의 문서다.
- `design-reference/D-001/DESIGN.md` §20 "Do Not" 목록(Airbnb 상표 요소, 구매/예약/결제 UI, Proprietary 폰트, §2 밖의 임의 색상, 코랄을 경고/오류 색으로 사용, Lorem ipsum/준비 중/정보 확인 없음 문구, 다음 Section이 전혀 보이지 않는 Hero)을 위반하지 않는다.
