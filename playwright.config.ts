import { defineConfig, devices } from "@playwright/test";

// 기본 baseURL. Vercel Preview 등 실제 배포 URL을 검증할 때는
// PLAYWRIGHT_BASE_URL 환경변수로 덮어쓴다 — 이 경우 webServer(로컬 npm run dev)는
// 사용하지 않는다(아래 webServer 조건 참고).
//
// "127.0.0.1"이 아니라 "localhost"를 쓴다 — Next.js 16의 allowedDevOrigins
// 교차 출처 차단이 dev 서버가 시작된 원점("localhost")과 다른 host로 접속할 때
// 클라이언트 hydration/이벤트 바인딩을 조용히 막는 현상을 수동 검증으로 확인함
// (2026-09-18: 127.0.0.1로 접속하면 새로 추가한 Client Component의 클릭·onError
// 이벤트가 전혀 발동하지 않았고, localhost로 바꾸자 즉시 정상화됨 — 두 URL 모두
// 재현·재확인함).
const DEFAULT_BASE_URL = "http://localhost:3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || DEFAULT_BASE_URL;
const isPreviewTarget = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Preview URL(PLAYWRIGHT_BASE_URL)을 검사할 때는 로컬 dev 서버를 띄우지 않는다.
  webServer: isPreviewTarget
    ? undefined
    : {
        command: "npm run dev",
        url: DEFAULT_BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
