import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  createMateApplication,
  getMateApplicationById,
  getMatePostById,
  listApplicationsForPost,
  updateMateApplicationStatus,
} from "@/lib/supabase/queries";

/**
 * API-MATE-REQUESTS — 참가 요청 제출·조회·승인/거절.
 * GET: 요청 목록(RLS가 신청자 본인·글 작성자·관리자만 조회 가능하도록 이미 제한한다).
 * POST: 로그인 사용자만, 자기 글에는 신청 불가, DB unique index로 중복 PENDING/ACCEPTED 차단(+애플리케이션 재검증).
 * PATCH: 글 작성자만 승인/거절 가능(비작성자 403) — 클라이언트 판단을 신뢰하지 않고 서버에서 author_id를 재확인한다.
 */

// UNIT-MATE-STATE(W13)가 중복 신청 차단 로직을 직접 테스트할 수 있도록 export한다
// (Next.js Route Handler 파일에서 HTTP 메서드 외의 이름 있는 export는 라우터가 무시하고
// 일반 모듈 export로만 동작한다 — 라우팅 동작에는 영향이 없다).
export const UNIQUE_VIOLATION = "23505";

export function hasPgErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === code;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요하다" }, { status: 401 });
  }

  const applications = await listApplicationsForPost(id);
  return NextResponse.json({ applications });
}

const createRequestSchema = z.object({
  message: z.string().trim().min(1).max(500),
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
    return NextResponse.json({ error: "동행글을 찾을 수 없다" }, { status: 404 });
  }
  if (post.author_id === user.id) {
    return NextResponse.json({ error: "자기 글에는 참가 신청을 할 수 없다" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값이 올바르지 않다", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const application = await createMateApplication(user.id, { postId: id, message: parsed.data.message });
    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    if (hasPgErrorCode(error, UNIQUE_VIOLATION)) {
      return NextResponse.json({ error: "이미 신청 중인 동행글이다" }, { status: 409 });
    }
    throw error;
  }
}

const updateRequestSchema = z.object({
  applicationId: z.string().uuid(),
  status: z.enum(["ACCEPTED", "REJECTED"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    return NextResponse.json({ error: "동행글을 찾을 수 없다" }, { status: 404 });
  }
  if (post.author_id !== user.id) {
    return NextResponse.json({ error: "글 작성자만 승인/거절할 수 있다" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값이 올바르지 않다", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const application = await getMateApplicationById(parsed.data.applicationId);
  if (!application || application.post_id !== id) {
    return NextResponse.json({ error: "참가 요청을 찾을 수 없다" }, { status: 404 });
  }

  const updated = await updateMateApplicationStatus(parsed.data.applicationId, { status: parsed.data.status });
  return NextResponse.json({ application: updated });
}
