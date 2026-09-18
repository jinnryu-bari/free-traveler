import { test, expect, type Page } from "@playwright/test";

/**
 * E2E-MATE-AUTH — 동행·인증 Chromium Smoke(3개 흐름), REQ-FUNC-027,028,034,036,039,040,066.
 *
 * `.env.test.local`(gitignore 대상, `env.test.local.example` 참고)에 실제 로그인 가능한
 * 테스트 계정 2개(E2E_TEST_MEMBER_..., E2E_TEST_MODERATOR_...)가 있어야 로그인 필요 흐름을
 * 실행한다 — RLS 정책상 moderator도 admin과 동일한 조회 예외를 가져 별도 admin 계정은
 * 필요 없다(`tests/rls/rls.spec.ts` 주석 참고). 계정 준비 방법은 `docs/preview-checks/W13.md`.
 *
 * 계정 정보가 아예 없으면 전체를 skip한다(정상 상태). **계정 정보가 있는데 로그인이
 * 실패하면 skip하지 않고 테스트를 그대로 실패시킨다** — "준비 단계 실패"를 통과처럼
 * 보이게 하지 않는다(사용자 지시).
 *
 * 흐름 ①(로그인→성인확인→동행 작성)은 사용자가 2026-09-18에 본인 실제 계정으로 이미
 * 수동 확인했다(docs/preview-checks/SCR-003.md) — 여기서는 테스트 계정으로 자동화해
 * ②③이 이어받을 동행글을 만드는 역할도 겸한다. 세 테스트는 순서대로 실행되며(serial),
 * 앞 단계가 만든 글 제목을 뒷 단계가 그대로 이어받는다 — `seed.sql`의 고정 글처럼 미리
 * 심어둔 데이터에 의존하지 않는다.
 */

const MEMBER_EMAIL = process.env.E2E_TEST_MEMBER_EMAIL;
const MEMBER_PASSWORD = process.env.E2E_TEST_MEMBER_PASSWORD;
const MODERATOR_EMAIL = process.env.E2E_TEST_MODERATOR_EMAIL;
const MODERATOR_PASSWORD = process.env.E2E_TEST_MODERATOR_PASSWORD;

const HAS_ACCOUNTS_CONFIGURED = Boolean(
  MEMBER_EMAIL && MEMBER_PASSWORD && MODERATOR_EMAIL && MODERATOR_PASSWORD,
);

let sharedPostTitle = "";

async function login(
  page: Page,
  email: string,
  password: string,
  label: string,
) {
  await page.goto("/account");
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: "로그인" }).click();

  const errorLocator = page.getByText("이메일 또는 비밀번호가 올바르지 않다");
  const loginFailed = await errorLocator
    .waitFor({ state: "visible", timeout: 8000 })
    .then(() => true)
    .catch(() => false);

  if (loginFailed) {
    // 계정 정보를 설정했는데 로그인이 실패했다 — "환경 부족"이 아니라 "준비 단계 실패"다.
    throw new Error(
      `[준비 단계 실패] ${label} 로그인 실패. Supabase Dashboard에서 만든 테스트 계정의 ` +
        "이메일 확인 여부와 .env.test.local 값을 다시 확인하세요.",
    );
  }
  await page.waitForLoadState("networkidle").catch(() => {});
}

async function logout(page: Page) {
  const logoutButton = page.getByRole("button", { name: "로그아웃" });
  if (await logoutButton.isVisible().catch(() => false)) {
    await logoutButton.click();
    await page.waitForLoadState("networkidle").catch(() => {});
  }
}

test.describe.serial("E2E-MATE-AUTH", () => {
  test.skip(
    !HAS_ACCOUNTS_CONFIGURED,
    "테스트 계정 미준비 — .env.test.local에 E2E_TEST_MEMBER_*/E2E_TEST_MODERATOR_* 설정 필요",
  );

  test("① 로그인 후 성인확인 상태에서 동행글을 작성할 수 있다", async ({
    page,
  }) => {
    await login(page, MEMBER_EMAIL!, MEMBER_PASSWORD!, "E2E_TEST_MEMBER");

    await page.goto("/travel-tools?tab=mate");
    // C-SCR003-MATE-COMPOSER: 성인확인 완료 계정이면 Gate Banner 대신 Form이 바로 보인다.
    // (성인확인이 안 된 신규 계정이면 여기서 실패한다 — 테스트 계정 준비 시 프로필 Form의
    // 성인확인 체크박스를 먼저 완료해야 한다. docs/preview-checks/W13.md 참고.)
    await expect(page.locator("#mate-title")).toBeVisible({ timeout: 10000 });

    sharedPostTitle = `E2E 스모크 동행 모집 ${Date.now()}`;
    await page.locator("#mate-title").fill(sharedPostTitle);
    await page.locator("#mate-country").selectOption({ index: 1 });
    await page.locator("#mate-region").selectOption({ index: 1 });
    await page.locator("#mate-start").fill("2026-12-01");
    await page.locator("#mate-end").fill("2026-12-05");
    await page.locator("#mate-capacity").fill("2");
    await page
      .locator("#mate-description")
      .fill("E2E 스모크 테스트로 등록한 동행글입니다.");
    await page.getByRole("checkbox").first().check();
    await page.getByRole("button", { name: "동행글 등록" }).click();
    await page.waitForLoadState("networkidle").catch(() => {});

    await page.goto("/mates");
    await expect(page.getByText(sharedPostTitle)).toBeVisible({
      timeout: 10000,
    });
  });

  test("② 다른 계정의 참가 요청을 작성자가 승인할 수 있다", async ({
    page,
  }) => {
    expect(sharedPostTitle, "①이 먼저 성공해 글 제목을 만들어야 한다").not.toBe(
      "",
    );

    await login(
      page,
      MODERATOR_EMAIL!,
      MODERATOR_PASSWORD!,
      "E2E_TEST_MODERATOR",
    );
    await page.goto("/mates");
    await page.getByText(sharedPostTitle).first().click();

    await page.getByLabel(/참가 메시지/).fill(`E2E 참가 신청 ${Date.now()}`);
    await page.getByRole("button", { name: "참가 신청 보내기" }).click();
    await expect(page.getByText("참가 신청을 보냈습니다")).toBeVisible({
      timeout: 5000,
    });

    await logout(page);
    await login(page, MEMBER_EMAIL!, MEMBER_PASSWORD!, "E2E_TEST_MEMBER");
    await page.goto("/mates");
    await page.getByText(sharedPostTitle).first().click();

    const approveButton = page.getByRole("button", { name: "승인" }).first();
    await expect(approveButton).toBeVisible({ timeout: 10000 });
    await approveButton.click();
    await expect(page.getByText("참가 요청을 승인했다")).toBeVisible({
      timeout: 5000,
    });
  });

  test("③ 다른 계정이 동행글을 신고하고 작성자를 차단할 수 있다", async ({
    page,
  }) => {
    expect(sharedPostTitle, "①이 먼저 성공해 글 제목을 만들어야 한다").not.toBe(
      "",
    );

    await login(
      page,
      MODERATOR_EMAIL!,
      MODERATOR_PASSWORD!,
      "E2E_TEST_MODERATOR",
    );
    await page.goto("/mates");
    await page.getByText(sharedPostTitle).first().click();

    await page.getByRole("button", { name: "신고하기" }).click();
    await page.getByLabel("상세 설명").fill("E2E 스모크 신고 테스트입니다.");
    await page.getByRole("button", { name: "신고 접수" }).click();
    await expect(page.getByText("신고가 접수됐습니다")).toBeVisible({
      timeout: 5000,
    });
    await page.getByRole("button", { name: "닫기" }).click();

    await page.getByRole("button", { name: "작성자 차단하기" }).click();
    await expect(page.getByText("차단했습니다.")).toBeVisible({
      timeout: 5000,
    });
  });
});

test("비인증 상태에서는 쓰기 액션이 전부 차단된다(회귀 확인, E2E-005와 동일 취지)", async ({
  page,
}) => {
  await page.goto("/travel-tools?tab=mate");
  await expect(page.getByText("로그인이 필요합니다")).toBeVisible();

  const res = await page.request.post("/api/mates", { data: { title: "x" } });
  expect(res.status()).toBe(401);
});
