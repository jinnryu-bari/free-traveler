import { test, expect, type Page } from "@playwright/test";

/**
 * E2E-MATE-AUTH — 동행·인증 Chromium Smoke(3개 흐름), REQ-FUNC-027,028,034,036,039,040,066.
 *
 * `supabase/seed.sql`의 3역할 계정(seed-member/-moderator/-admin, 비밀번호 SeedPassword123!)이
 * 이 프로젝트에 실제로 적용돼 있어야 실행된다. 로그인에 실패하면 `test.skip()`으로 그 테스트를
 * 명시적으로 건너뛴다 — "PASS"로 위장하지 않는다(사용자 지시: 통과/실패/환경 부족 구분).
 *
 * 흐름 ①(로그인→성인확인→동행 작성)은 사용자가 2026-09-18에 실제 계정으로 이미 수동
 * 확인했다(docs/preview-checks/SCR-003.md) — seed 계정으로도 같은 경로가 되는지 가볍게만
 * 재확인한다. 흐름 ②③(다른 계정의 신청→승인, 신고·차단)은 이번에 처음 자동화한다.
 *
 * `tests/e2e/auth-smoke.spec.ts`(E2E-006/007, 초기 스캐폴드)는 건드리지 않았다 — 로그인
 * 셀렉터(`getByRole("link", {name:"로그인"})`)와 Section 제목("참가 요청")이 실제 W11~W12
 * 구현과 달라져 있어 지금 실행하면 실패할 것으로 보이지만, 그 파일은 이 Task의 Expected
 * File이 아니라 수정하지 않았다 — 별도로 정리가 필요한 항목으로 보고에 남긴다.
 */

const SEED_PASSWORD = "SeedPassword123!";
const SEED_MEMBER_EMAIL = "seed-member@example.com"; // 오사카 글 작성자
const SEED_MODERATOR_EMAIL = "seed-moderator@example.com";
const SEED_ADMIN_EMAIL = "seed-admin@example.com";
const SEED_POST_TITLE = "오사카 3박 4일 같이 다니실 분";

async function login(page: Page, email: string): Promise<boolean> {
  await page.goto("/account");
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(SEED_PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  try {
    await page.getByText("이메일 또는 비밀번호가 올바르지 않다").waitFor({ state: "visible", timeout: 8000 });
    return false;
  } catch {
    // 오류 문구가 끝내 뜨지 않으면 로그인 성공(페이지가 reload되어 오류 문구 자체가 사라짐)으로 본다.
    await page.waitForLoadState("networkidle").catch(() => {});
    return true;
  }
}

async function logout(page: Page) {
  const logoutButton = page.getByRole("button", { name: "로그아웃" });
  if (await logoutButton.isVisible().catch(() => false)) {
    await logoutButton.click();
    await page.waitForTimeout(1000);
  }
}

test.describe("E2E-MATE-AUTH", () => {
  test("① 로그인 후 성인확인 상태에서 동행글을 작성할 수 있다", async ({ page }) => {
    const ok = await login(page, SEED_MEMBER_EMAIL);
    test.skip(!ok, "환경 부족으로 미실행 — seed-member 로그인 실패(supabase/seed.sql 미적용 가능성)");

    await page.goto("/travel-tools?tab=mate");
    // C-SCR003-MATE-COMPOSER: 성인확인 완료 계정이면 Gate Banner 대신 Form이 바로 보인다.
    await expect(page.locator("#mate-title")).toBeVisible();

    const title = `E2E 스모크 동행 모집 ${Date.now()}`;
    await page.locator("#mate-title").fill(title);
    await page.locator("#mate-country").selectOption({ index: 1 });
    await page.locator("#mate-region").selectOption({ index: 1 });
    await page.locator("#mate-start").fill("2026-12-01");
    await page.locator("#mate-end").fill("2026-12-05");
    await page.locator("#mate-capacity").fill("2");
    await page.locator("#mate-description").fill("E2E 스모크 테스트로 등록한 동행글입니다.");
    await page.getByRole("checkbox").first().check();
    await page.getByRole("button", { name: /등록|작성/ }).click();
    await page.waitForTimeout(1500);

    await page.goto("/mates");
    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });
  });

  test("② 다른 계정의 참가 요청을 작성자가 승인할 수 있다", async ({ page }) => {
    const adminOk = await login(page, SEED_ADMIN_EMAIL);
    test.skip(!adminOk, "환경 부족으로 미실행 — seed-admin 로그인 실패(supabase/seed.sql 미적용 가능성)");

    await page.goto("/mates");
    await page.getByText(SEED_POST_TITLE).first().click();
    await page.waitForTimeout(500);

    const message = `E2E 참가 신청 ${Date.now()}`;
    const messageField = page.getByLabel(/참가 메시지/);
    if (await messageField.isVisible().catch(() => false)) {
      await messageField.fill(message);
      await page.getByRole("button", { name: "참가 신청 보내기" }).click();
      await page.waitForTimeout(1000);
    }
    // 이미 PENDING/ACCEPTED 신청이 있으면(재실행 시) 폼 대신 오류가 뜨는 것도 정상이다 —
    // 아래에서 작성자 계정으로 실제 승인 가능한 요청이 하나라도 있는지로 흐름을 검증한다.

    await logout(page);
    const memberOk = await login(page, SEED_MEMBER_EMAIL);
    test.skip(!memberOk, "환경 부족으로 미실행 — seed-member 로그인 실패");

    await page.goto("/mates");
    await page.getByText(SEED_POST_TITLE).first().click();
    await page.waitForTimeout(500);

    const approveButton = page.getByRole("button", { name: "승인" }).first();
    await expect(approveButton).toBeVisible({ timeout: 10000 });
    await approveButton.click();
    await expect(page.getByText("참가 요청을 승인했다")).toBeVisible({ timeout: 5000 });
  });

  test("③ 다른 계정이 동행글을 신고하고 작성자를 차단할 수 있다", async ({ page }) => {
    const ok = await login(page, SEED_MODERATOR_EMAIL);
    test.skip(!ok, "환경 부족으로 미실행 — seed-moderator 로그인 실패(supabase/seed.sql 미적용 가능성)");

    await page.goto("/mates");
    await page.getByText(SEED_POST_TITLE).first().click();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "신고하기" }).click();
    await page.getByLabel("상세 설명").fill("E2E 스모크 신고 테스트입니다.");
    await page.getByRole("button", { name: "신고 접수" }).click();
    await expect(page.getByText("신고가 접수됐습니다")).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "닫기" }).click();

    await page.getByRole("button", { name: "작성자 차단하기" }).click();
    await expect(page.getByText("차단했습니다.")).toBeVisible({ timeout: 5000 });
  });

  test("비인증 상태에서는 쓰기 액션이 전부 차단된다(회귀 확인, E2E-005와 동일 취지)", async ({ page }) => {
    await page.goto("/travel-tools?tab=mate");
    await expect(page.getByText("로그인이 필요합니다")).toBeVisible();

    const res = await page.request.post("/api/mates", { data: { title: "x" } });
    expect(res.status()).toBe(401);
  });
});
