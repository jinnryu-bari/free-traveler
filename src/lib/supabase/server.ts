import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Server Component·Route Handler·`/auth/callback`에서 쿠키 기반 세션으로 인증된
 * 요청을 처리하는 Supabase 클라이언트. 환경변수 미설정 시 크래시 대신 명확한 안내
 * 메시지를 던진다 — 실제 프로젝트 생성·키 발급은 06번 가이드에서 진행한다.
 */
export async function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase 환경변수가 설정되지 않았다 — NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY를 " +
        ".env.local에 추가해야 한다(06번 가이드: Supabase 프로젝트 생성과 연결).",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component에서 호출된 경우 쿠키를 쓸 수 없다 — 미들웨어가
          // 세션을 갱신하므로 무시해도 안전하다(Next.js 공식 패턴).
        }
      },
    },
  });
}

/**
 * `SUPABASE_SERVICE_ROLE_KEY`로 RLS를 우회하는 관리자 전용 클라이언트.
 * 서버 전용 코드(API Route/Seed 스크립트)에서만 참조하며 클라이언트 번들에는
 * 절대 포함하지 않는다(CLAUDE.md rule 15).
 */
export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !serviceRoleKey) {
    throw new Error(
      "Supabase 환경변수가 설정되지 않았다 — NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY를 " +
        ".env.local에 추가해야 한다(06번 가이드: Supabase 프로젝트 생성과 연결).",
    );
  }
  return createServerClient(SUPABASE_URL, serviceRoleKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
}
