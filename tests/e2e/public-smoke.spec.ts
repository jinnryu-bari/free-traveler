import { test, expect } from "@playwright/test";

/**
 * 공개(비로그인) 흐름 Chromium Smoke — E2E-001~E2E-005.
 *
 * Selector 우선순위: role → label → test id 순. 목록형 반복 요소(여행지 카드 등)처럼
 * 고유한 접근성 이름이 없는 경우에만 `data-testid`를 사용한다 — 구현 Task는 아래
 * test id를 그대로 부여해야 한다:
 *   - 여행지 카드: `data-testid="destination-card"`
 *
 * 여행 도구(SCR-003) Form 라벨은 UI_CONTRACT.md §SCR-003 문구를 그대로 접근성
 * label로 사용한다고 가정한다: "출발 국가"/"출발 지역"/"출발일"/"귀국일"(항공),
 * "숙소 국가"/"숙소 지역"/"체크인"/"체크아웃"(숙소). 외부 이동 버튼은
 * UI_CONTRACT.md 사용자 행동 문구("항공편/숙소 보러 가기")를 접근성 이름으로 쓴다.
 *
 * 외부 사이트 자체의 내용은 검사하지 않는다 — href·target·rel 속성과 비전달 고지
 * 문구만 확인한다(요청 규칙).
 */

test("E2E-001 메인 페이지의 추천 여행지와 주요 CTA", async ({ page }) => {
  await page.goto("/");

  const primaryNav = page
    .getByRole("navigation", { name: "주요 메뉴" })
    .first();
  await expect(
    primaryNav.getByRole("link", { name: "동행 찾기" }),
  ).toHaveAttribute("href", "/mates");
  await expect(
    primaryNav.getByRole("link", { name: "대표 소개" }),
  ).toHaveAttribute("href", "/about");
  await expect(
    page.getByRole("link", { name: "여행 조건 정리하기" }),
  ).toHaveAttribute("href", "/travel-tools");

  await expect(
    page.getByRole("heading", { name: /국내 인기 여행지/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /해외 인기 여행지/ }),
  ).toBeVisible();

  const destinationCards = page.getByTestId("destination-card");
  await expect(destinationCards.first()).toBeVisible();
  expect(await destinationCards.count()).toBeGreaterThanOrEqual(1);
});

test("E2E-002 대표 소개의 free_traveler, 50회 이상, 30개국 이상", async ({
  page,
}) => {
  await page.goto("/about");

  await expect(page.getByText("free_traveler").first()).toBeVisible();
  await expect(page.getByText(/50\+|50회\s*이상/).first()).toBeVisible();
  await expect(page.getByText(/30\+|30개국\s*이상/).first()).toBeVisible();
});

test("E2E-003 여행 도구의 항공 외부 이동 안내와 href", async ({ page }) => {
  await page.goto("/travel-tools");
  await page.getByRole("tab", { name: "항공편" }).click();

  await page.getByLabel("출발 국가").selectOption({ index: 1 });
  await page.getByLabel("출발 지역").selectOption({ index: 1 });
  await page.getByLabel("출발일").fill("2026-11-01");
  await page.getByLabel("귀국일").fill("2026-11-05");

  const goExternal = page.getByRole("link", { name: /보러 가기/ });
  await expect(goExternal).toBeVisible();
  await expect(goExternal).toHaveAttribute("target", "_blank");
  await expect(goExternal).toHaveAttribute("rel", /noopener/);
  await expect(goExternal).toHaveAttribute("rel", /noreferrer/);

  const href = await goExternal.getAttribute("href");
  expect(href).toBeTruthy();
  // 목적지·날짜 query가 외부 URL에 실리지 않아야 한다(REQ-FUNC-017 비전달).
  expect(href).not.toMatch(/[?&](destination|country|region|from|to|date)=/i);

  await expect(
    page.getByText("입력값은 외부 사이트로 전달되지 않습니다"),
  ).toBeVisible();
});

test("E2E-004 여행 도구의 숙소 외부 이동 안내와 href", async ({ page }) => {
  await page.goto("/travel-tools");
  await page.getByRole("tab", { name: "숙소" }).click();

  await page.getByLabel("숙소 국가").selectOption({ index: 1 });
  await page.getByLabel("숙소 지역").selectOption({ index: 1 });
  await page.getByLabel("체크인").fill("2026-11-01");
  await page.getByLabel("체크아웃").fill("2026-11-05");

  const goExternal = page.getByRole("link", { name: /보러 가기/ });
  await expect(goExternal).toBeVisible();
  await expect(goExternal).toHaveAttribute("target", "_blank");
  await expect(goExternal).toHaveAttribute("rel", /noopener/);
  await expect(goExternal).toHaveAttribute("rel", /noreferrer/);

  const href = await goExternal.getAttribute("href");
  expect(href).toBeTruthy();
  // 목적지·날짜 query가 외부 URL에 실리지 않아야 한다(REQ-FUNC-025 비전달).
  expect(href).not.toMatch(
    /[?&](destination|country|region|checkin|checkout|date)=/i,
  );

  await expect(
    page.getByText("입력값은 외부 사이트로 전달되지 않습니다"),
  ).toBeVisible();
});

test("E2E-005 비로그인 동행글 작성의 로그인 안내", async ({ page }) => {
  await page.goto("/travel-tools");
  await page.getByRole("tab", { name: "동행 구하기" }).click();

  // 미인증 시 CTA Banner만 렌더되고 작성 Form 자체는 렌더되지 않는다(AC).
  await expect(page.getByRole("link", { name: /로그인/ })).toBeVisible();
  await expect(page.getByLabel("제목")).toHaveCount(0);
});
