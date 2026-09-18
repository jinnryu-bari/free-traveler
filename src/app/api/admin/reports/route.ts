import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getProfileRole, listReports, updateReportStatus } from "@/lib/supabase/queries";

/**
 * API-ADMIN-REPORTS — 관리자 신고 상태 필터·변경(간소화 범위, REQ-FUNC-041).
 * GET/PATCH 둘 다 클라이언트가 보내는 role을 신뢰하지 않고 세션의 user.id로 `profiles.role`을
 * 다시 조회해 moderator/admin인지 재검증한다(`C-SCR005-ROLE-GATE`의 클라이언트 표시와 별개).
 */

async function requireModeratorOrAdmin(): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "로그인이 필요하다" }, { status: 401 }) };
  }

  const role = await getProfileRole(user.id);
  if (role !== "moderator" && role !== "admin") {
    return { ok: false, response: NextResponse.json({ error: "관리자만 접근할 수 있다" }, { status: 403 }) };
  }

  return { ok: true };
}

const statusFilterSchema = z.enum(["OPEN", "RESOLVED", "DISMISSED"]).optional();

export async function GET(request: Request) {
  const guard = await requireModeratorOrAdmin();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const parsedStatus = statusFilterSchema.safeParse(searchParams.get("status") ?? undefined);
  if (!parsedStatus.success) {
    return NextResponse.json({ error: "잘못된 필터 조건이다" }, { status: 400 });
  }

  const reports = await listReports({ status: parsedStatus.data });
  return NextResponse.json({ reports });
}

const patchSchema = z.object({
  reportId: z.string().uuid(),
  status: z.enum(["OPEN", "RESOLVED", "DISMISSED"]),
});

export async function PATCH(request: Request) {
  const guard = await requireModeratorOrAdmin();
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값이 올바르지 않다", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const report = await updateReportStatus(parsed.data.reportId, { status: parsed.data.status });
  return NextResponse.json({ report });
}
