import path from "node:path";
import { defineConfig } from "vitest/config";

// UNIT-MATE-STATE(W13)가 실제 프로덕션 모듈(components/app 아래 파일)을 그대로 가져와
// 테스트하면서 발견한 gap: tsconfig.json의 "@/*" 경로 별칭이 vitest(vite)에는 자동으로
// 적용되지 않아, 그 별칭을 쓰는 파일을 import하면 즉시 실패했다. 최소 범위로 별칭만 추가한다.
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
    ],
    exclude: ["tests/e2e/**", "node_modules/**"],
    environment: "node",
    passWithNoTests: true,
  },
});
