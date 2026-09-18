import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createBlock, deleteBlock } from "@/lib/supabase/queries";

/**
 * API-BLOCKLIST — 차단 실행/해제.
 * POST: 로그인 사용자가 본인 이름으로 차단 생성(RLS `blocks_insert_own`이 서버에서도 재확인).
 * DELETE: 본인이 만든 차단만 해제 가능(RLS `blocks_delete_own`).
 * 차단 이후 `/api/mates`(API-MATES) GET이 `listBlockedUserIds`로 이미 상대방 글을 제외한다 —
 * 이 API는 차단 행을 만들고 지우는 것만 담당하고, 노출 차단은 조회 쪽 책임이다.
 */

const UNIQUE_VIOLATION = "23505";

function hasPgErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === code
  );
}

const blockTargetSchema = z.object({
  blockedId: z.string().uuid(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요하다" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = blockTargetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "입력값이 올바르지 않다",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.blockedId === user.id) {
    return NextResponse.json(
      { error: "자기 자신을 차단할 수 없다" },
      { status: 400 },
    );
  }

  try {
    await createBlock(user.id, parsed.data);
  } catch (error) {
    if (!hasPgErrorCode(error, UNIQUE_VIOLATION)) throw error;
    // 이미 차단한 상대를 다시 차단해도 최종 상태는 동일하므로 성공으로 처리한다.
  }

  return NextResponse.json({ blocked: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요하다" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = blockTargetSchema.safeParse({
    blockedId: searchParams.get("blockedId") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값이 올바르지 않다" },
      { status: 400 },
    );
  }

  await deleteBlock(user.id, parsed.data);
  return NextResponse.json({ blocked: false });
}
