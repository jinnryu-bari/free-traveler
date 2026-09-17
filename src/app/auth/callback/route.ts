import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase Auth 이메일 가입/로그인/비밀번호 재설정 콜백.
 * `code`를 세션으로 교환한 뒤 항상 `/account`로 복귀한다. 세션 발급에 실패하면
 * 세션 없이(비인증 상태로) `/account`로 돌려보내 동행 쓰기 등 인증 필요 기능이
 * 열리지 않도록 한다.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/account?error=auth_callback_failed`);
}
