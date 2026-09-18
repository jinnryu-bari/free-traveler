import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getProfileRole, updateExternalLink } from "@/lib/supabase/queries";

/**
 * API-ADMIN-EXTERNAL-LINKS — 관리자 항공/숙소 외부 URL 설정(REQ-FUNC-077).
 * PATCH만 제공한다(조회는 `getExternalLinks()`를 Client Component가 직접 읽는다 — `external_links`는
 * RLS로 이미 공개 조회이므로 별도 GET 라우트가 필요 없다).
 * `updateExternalLink()`(DB-ACCESS, W03)가 HTTPS+허용목록(`ALLOWED_EXTERNAL_LINK_HOSTS`) 검증을
 * 이미 수행한다 — 이 라우트는 그 위에 admin role만 재확인한다. RLS(`external_links_update_admin_only`)도
 * role='admin'만 허용해, moderator는 신고는 처리해도 외부 URL은 바꿀 수 없다.
 */

const patchSchema = z.object({
  key: z.enum(["flight_search_base_url", "hotel_search_base_url"]),
  url: z.string(),
});

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요하다" }, { status: 401 });
  }

  const role = await getProfileRole(user.id);
  if (role !== "admin") {
    return NextResponse.json(
      { error: "admin만 접근할 수 있다" },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값이 올바르지 않다" },
      { status: 400 },
    );
  }

  try {
    const link = await updateExternalLink(user.id, parsed.data);
    return NextResponse.json({ link });
  } catch {
    return NextResponse.json(
      { error: "HTTPS이고 허용된 사이트인 URL만 저장할 수 있다" },
      { status: 400 },
    );
  }
}
