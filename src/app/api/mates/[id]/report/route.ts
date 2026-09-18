import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createReport, getMatePostById } from "@/lib/supabase/queries";

/**
 * API-MATE-REPORT — 동행글 신고 접수.
 * POST: 로그인 사용자만, 사유 코드+설명을 `reports` 테이블에 저장하고 신고 ID·접수 시각을 응답한다.
 * `reports` 조회는 RLS(`reports_select_own_or_admin`)가 신고자 본인·moderator/admin으로만
 * 제한하므로, 신고 대상(글 작성자)에게 신고자 식별정보가 노출되는 별도 응답 경로가 없다.
 */

const REASON_CODES = ["SPAM", "SCAM", "INAPPROPRIATE", "HARASSMENT", "OTHER"] as const;

const createReportSchema = z.object({
  reasonCode: z.enum(REASON_CODES),
  description: z.string().trim().min(1).max(1000),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요하다" }, { status: 401 });
  }

  const post = await getMatePostById(id);
  if (!post) {
    return NextResponse.json({ error: "신고 대상 동행글을 찾을 수 없다" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값이 올바르지 않다", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const report = await createReport(user.id, {
    targetPostId: id,
    reasonCode: parsed.data.reasonCode,
    description: parsed.data.description,
  });

  return NextResponse.json({ reportId: report.id, createdAt: report.created_at }, { status: 201 });
}
