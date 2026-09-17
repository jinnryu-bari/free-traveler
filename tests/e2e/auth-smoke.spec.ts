import { test, expect, type Page } from "@playwright/test";

/**
 * 인증 필요 흐름 Chromium Smoke — E2E-006~E2E-007 골격.
 *
 * Seed 계정(TASK-DB-SEED-BASE)이 있는 환경(Supabase 연결 + 인증 환경변수)에서만
 * 실행한다. E2E_SEED_EMAIL/E2E_SEED_PASSWORD가 없으면 이 파일 전체를 명시적으로
 * skip한다 — 공개 Smoke(public-smoke.spec.ts)는 이 조건과 무관하게 항상 실행된다.
 *
 * 각 test 내부의 TODO 주석은 해당 Component/API Task(C-SCR003-MATE-COMPOSER,
 * C-SCR004-PARTICIPATE-FLOW 등) 구현이 끝난 뒤 채운다 — 지금은 로그인 후 화면 이동
 * 골격과, 이미 문서(UI_CONTRACT.md/Task AC)로 확정된 라벨만 실제로 assert한다.
 */

const SEED_EMAIL = process.env.E2E_SEED_EMAIL;
const SEED_PASSWORD = process.env.E2E_SEED_PASSWORD;

test.skip(
  !SEED_EMAIL || !SEED_PASSWORD,
  "E2E_SEED_EMAIL/E2E_SEED_PASSWORD 미설정 — Supabase Seed 계정이 있는 환경에서만 실행한다",
);

async function loginWithSeedAccount(page: Page) {
  await page.goto("/account");
  // C-SCR005-AUTH-GUEST: 로그인 진입 카드 → Form
  await page.getByRole("link", { name: "로그인" }).click();
  await page.getByLabel("이메일").fill(SEED_EMAIL!);
  await page.getByLabel("비밀번호").fill(SEED_PASSWORD!);
  await page.getByRole("button", { name: "로그인" }).click();
}

test.describe("E2E-006 로그인 사용자의 동행글 작성과 목록·상세 확인", () => {
  test("로그인 후 작성한 동행글을 목록·상세에서 확인할 수 있다", async ({
    page,
  }) => {
    await loginWithSeedAccount(page);

    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 구하기" }).click();

    // TODO(C-SCR003-MATE-COMPOSER 구현 후): 제목/국가/기간/모집인원/스타일/설명 입력,
    // 안전수칙 동의 체크 후 제출. 연락처 패턴 입력 시 제출 차단되는 경로는 별도
    // UNIT-CONTACT-DETECTION에서 다룬다.
    // await page.getByLabel("제목").fill("E2E 스모크 동행 모집");
    // await page.getByRole("checkbox", { name: /안전수칙/ }).check();
    // await page.getByRole("button", { name: "모집글 등록" }).click();

    // TODO: 제출 완료 시 SCR-004 상세로 이동(UI_CONTRACT.md 이동 규칙)
    // await expect(page).toHaveURL(/\/mates\/.+/);

    // TODO(C-SCR004-LIST-GRID 구현 후): /mates 목록에서 방금 작성한 글이 보이는지 확인
    // await page.goto("/mates");
    // await expect(page.getByText("E2E 스모크 동행 모집")).toBeVisible();
  });
});

test.describe("E2E-007 동행글 신청과 계정 화면의 내 활동 확인", () => {
  test("동행글에 참가 요청을 보내면 계정 내 활동에서 확인할 수 있다", async ({
    page,
  }) => {
    await loginWithSeedAccount(page);

    await page.goto("/mates");

    // TODO(C-SCR004-LIST-GRID / DETAIL-PANEL 구현 후): 목록에서 Seed 모집글 카드 클릭
    // await page.getByTestId("mate-post-card").first().click();

    // TODO(C-SCR004-PARTICIPATE-FLOW 구현 후): 참가 메시지 입력 후 제출(500자 이하)
    // await page.getByLabel("참가 메시지").fill("함께하고 싶어요!");
    // await page.getByRole("button", { name: "참가 요청 보내기" }).click();

    await page.goto("/account");
    // C-SCR005-MY-ACTIVITY: 내 글/참가 요청/차단 목록 Section 헤딩(AC 확정 문구)
    await expect(
      page.getByRole("heading", { name: "참가 요청" }),
    ).toBeVisible();

    // TODO: 방금 보낸 참가 요청이 목록에 PENDING 상태로 나타나는지 확인
    // await expect(page.getByText(/PENDING|대기/)).toBeVisible();
  });
});
