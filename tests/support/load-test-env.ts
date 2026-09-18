import fs from "node:fs";
import path from "node:path";

/**
 * `.env.local`(공개 Supabase URL/anon key)과 `.env.test.local`(테스트 계정 이메일·비밀번호,
 * gitignore 대상)을 순수 Node 프로세스(vitest/playwright.config.ts)에 로드한다.
 * Next.js 개발 서버는 두 파일을 자동으로 읽지만 vitest/playwright는 읽지 않는다 — 그 gap을
 * 메운다(W13에서 처음 발견, `.env.local`만 대상이던 것을 `.env.test.local`까지 확장).
 * 이미 설정된 값은 덮어쓰지 않는다. 비밀번호 등 값 자체를 로그로 남기지 않는다.
 */
export function loadEnvFile(
  filename: string,
  root: string = process.cwd(),
): void {
  const envPath = path.resolve(root, filename);
  if (!fs.existsSync(envPath)) return;
  for (const rawLine of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (!(key in process.env)) process.env[key] = value.trim();
  }
}
