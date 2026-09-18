# SCR-004 `/mates` — 적용 예정 요구사항 (W09~W10)

**상태:** 기록만 함, 구현 없음. 사용자가 `/run-wave W07` 요청에 잘못 첨부했던 SCR-004(`/mates`) 상세 지시를 그대로 옮겨 적은 문서다. 실제 적용 시점은 `TASKS/WAVE_PLAN.md` 기준 `W09`(Component 대부분)~`W10`(`API-MATE-REPORT`/`REPORT-MODAL`/`API-BLOCKLIST`/`BLOCK-ACTION`/`PAGE-SCR004`)이다.

이 문서는 그 두 Wave를 실제로 진행할 때 기존 `TASKS/TASK-C-SCR004-*.md`/`TASKS/TASK-PAGE-SCR004.md`의 AC와 대조해 빠진 부분이 없는지 확인하는 체크리스트로 쓴다 — Task 정의 문서 자체를 대체하지 않는다.

## 반드시 포함 (원문)

- 1번째 Section: 동행 찾기 설명과 `/travel-tools` 글 작성 CTA
- 2번째 Section: 국가·지역·기간·모집 상태 Filter와 결과 수 요약
- 3번째 Section: 공개 동행글 Card 목록
- 4번째 Section: 선택한 글의 상세 Modal/Drawer
- 5번째 Section: 동행 신청 방법 3단계
- 6번째 Section: 안전한 만남·신고·차단 안내와 글 작성 CTA
- 제목, 지역, 기간, 모집 인원, 작성자 표시
- 목록 Loading, Empty, Error 상태
- Card 선택 시 같은 Page의 상세 Modal/Drawer
- 상세에서 소개, 모집 상태, 신청 Button 표시
- 로그인 사용자 신청 Form과 간단 메시지
- 중복 신청 방지
- 자기 글에는 신청 Button 대신 관리 안내
- 작성자 차단과 글 신고의 최소 UI
- 모집 종료 상태는 저장값과 날짜를 기준으로 화면에서 계산
- 데이터가 있으면 첫 화면에서 Card를 최대 8개 우선 노출, 데이터가 없으면 조건 초기화·이용 방법·글 작성 CTA가 있는 Empty State
- Section마다 제목과 설명, 큰 빈 영역이나 Placeholder 문구 없음

## 단순화 범위 (원문)

- 무한 Scroll 대신 처음 20개 또는 간단 Pagination
- 실시간 Subscription 없음
- 추천 Algorithm 없음
- 신고 사유는 Select와 짧은 설명만

## 완료 검사 (원문)

- 목록 Filter Unit Test
- 신청 Validation·중복 방지 Test
- 차단 시 목록 제외 Test 또는 Data Function Test
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `docs/preview-checks/SCR-004.md` 작성
- 실제 DB 인증 Smoke는 Supabase 연결 후 실행

## 대조 메모

W09~W10 착수 시 아래를 실제로 대조할 것:

- Card 8개 우선 노출 규칙이 `TASKS/TASK-C-SCR004-LIST-GRID.md`의 Functional AC(최대 8개+"더 보기")와 일치하는지
- "간단 Pagination" 방식이 기존 Task 정의에 없다면 `PAGE-SCR004`/`LIST-GRID` Expected Files 범위 안에서 처리 가능한지, 아니면 Task List 보완이 먼저 필요한지
- 차단/신고 UI가 `API-BLOCKLIST`/`API-MATE-REPORT`/`C-SCR004-BLOCK-ACTION`/`C-SCR004-REPORT-MODAL`(이미 정의됨)로 충분히 커버되는지
