# SCR-005 `/account` — 적용 예정 요구사항 (W11~W12)

**상태:** 기록만 함, 구현 없음. `/run-wave W08` 요청에 잘못 첨부됐던 SCR-005(`/account`, Guest/Member/Admin) 상세 지시를 그대로 옮겨 적은 문서다. 실제 적용 시점은 `TASKS/WAVE_PLAN.md` 기준 `W11`(`C-SCR005-AUTH-GUEST`/`PROFILE`/`MY-ACTIVITY`/`ROLE-GATE`/`API-ADMIN-REPORTS`)~`W12`(`C-SCR005-ADMIN-REPORTS`/`API-ADMIN-EXTERNAL-LINKS`/`ADMIN-EXTERNAL-URL`/`PAGE-SCR005`, Preview Checkpoint 있음)이다.

**외부 URL 테이블명 확정:** 사용자 확인에 따라 기존 `external_links`를 그대로 유지한다. `app_settings`로 변경하지 않는다.

## 상태별 화면 (원문)

- 비로그인: 계정 기능 Intro, 이메일 로그인 Form, 로그인 후 가능한 기능, 보안 안내
- 로그인: Profile·성인 확인 요약, 내가 쓴 글, 내가 신청한 글, 차단 목록, 새 동행글 작성 CTA, 로그아웃
- 관리자: 관리 Intro, 신고 상태 변경, 항공·숙소 외부 URL 설정(`external_links` 테이블 기준)

## 반드시 할 일 (원문)

- 로그인·로그아웃 Loading·Error 상태
- 내가 쓴 동행글의 수정 가능한 최소 항목과 모집 마감
- 내가 신청한 글과 신청 상태
- 데이터 없음 상태
- 일반 사용자가 관리자 UI와 Action에 접근하지 못하는 Guard
- 관리자 변경 성공·실패 Toast
- 외부 URL(`external_links`)의 URL 형식 검증
- 모바일에서 Section 구분
- 현재 역할에 필요한 Section만 표시, 내용 없는 목록에는 설명+다음 행동이 있는 Empty State
- 각 Section에 제목과 설명, 큰 빈 영역·내용 없는 Card·Placeholder 문구 없음

## 하지 않을 일 (원문)

- 복잡한 권한 관리 화면
- 사용자 전체 관리
- 전체 CMS
- 범용 감사 로그
- Dashboard Chart

## 완료 검사 (원문)

- Auth 상태 Component Test
- 관리자 Guard Test
- URL Validation Test
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `docs/preview-checks/SCR-005.md` 작성

## 대조 메모

W11~W12 착수 시 실제로 대조할 것:

- "비로그인/로그인/관리자" 3단 분기가 `TASKS/TASK-C-SCR005-ROLE-GATE.md`(역할별 탭 렌더링/차단 로직) AC와 일치하는지
- "내가 쓴 글 수정 가능한 최소 항목"이 `TASKS/TASK-C-SCR005-MY-ACTIVITY.md` 범위 안에서 처리 가능한지, Expected Files 밖 수정이 필요하면 먼저 확인
- 관리자 Guard/Toast가 `TASKS/TASK-C-SCR005-ADMIN-REPORTS.md`, `TASKS/TASK-C-SCR005-ADMIN-EXTERNAL-URL.md`로 충분히 커버되는지
- 수업 실습 프로젝트 성격상(`CLAUDE.md` 규칙 24) 핵심 기능·기본 검증 우선, 과도한 정교화(복잡한 권한 UI 등, 위 "하지 않을 일"과도 일치) 지양
