import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

// UNIT-MATE-STATE(W13)가 실제 프로덕션 모듈(components/app 아래 파일)을 그대로 가져와
// 테스트하면서 발견한 gap: tsconfig.json의 "@/*" 경로 별칭이 vitest(vite)에는 자동으로
// 적용되지 않아, 그 별칭을 쓰는 파일을 import하면 즉시 실패했다. 최소 범위로 별칭만 추가한다.
//
// TEST-RLS-BASIC(W13)이 추가로 발견한 gap: Next.js 개발 서버는 `.env.local`을 자동으로
// 읽지만 vitest(순수 Node 프로세스)는 읽지 않아, NEXT_PUBLIC_SUPABASE_URL/ANON_KEY가
// `process.env`에 없어 Supabase 연결 테스트가 항상 "환경 부족"으로 skip됐다. 외부 패키지
// 없이 `.env.local`을 최소한으로 직접 파싱해 넣는다(이미 있는 값은 덮어쓰지 않는다).
function loadDotEnvLocal() {
  const envPath = path.resolve(__dirname, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const rawLine of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (!(key in process.env)) process.env[key] = value.trim();
  }
}
loadDotEnvLocal();

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/rls/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**"],
    environment: "node",
    passWithNoTests: true,
  },
});
