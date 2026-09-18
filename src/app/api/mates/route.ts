import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  createMatePost,
  isProfileAdultVerified,
  listBlockedUserIds,
  listMatePosts,
} from "@/lib/supabase/queries";

/**
 * API-MATES — 동행글 목록·생성.
 * GET: 필터(AND) 적용 + 로그인 사용자가 차단한 상대의 글은 제외.
 * POST: 인증+성인확인 세션 필수, 연락처 패턴 서버측 재검증(REQ-FUNC-032와 동일 취지의
 * 방어적 재검사 — 클라이언트 검증(`C-SCR003-MATE-COMPOSER`)을 신뢰하지 않는다).
 * 입력값은 `src/lib/supabase/queries.ts`(DB-ACCESS)를 통해서만 DB에 닿는다.
 */

const getFiltersSchema = z.object({
  country: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedFilters = getFiltersSchema.safeParse({
    country: searchParams.get("country") ?? undefined,
    region: searchParams.get("region") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });
  if (!parsedFilters.success) {
    return NextResponse.json(
      { error: "잘못된 필터 조건이다" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const posts = await listMatePosts(parsedFilters.data);

  if (!user) {
    return NextResponse.json({ posts });
  }

  const blockedIds = await listBlockedUserIds(user.id);
  const visible =
    blockedIds.length === 0
      ? posts
      : posts.filter((post) => !blockedIds.includes(post.author_id));
  return NextResponse.json({ posts: visible });
}

// 연락처/외부 채널 유도 패턴 — 클라이언트 검증을 신뢰하지 않는 서버측 방어선.
// 전화번호, 이메일, 카카오톡/인스타그램 등 메신저 유도 문구를 탐지한다.
const CONTACT_PATTERNS = [
  /01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/, // 휴대폰 번호
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // 이메일
  /카카오\s*톡|카톡\s*(아이디|id)|kakao\s*id/i, // 카카오톡 유도
  /인스타(그램)?\s*(아이디|id)?|instagram/i, // 인스타그램 유도
  /(?<![\w.])@[a-zA-Z0-9_.]{3,}/, // SNS 핸들(@id)
];

function containsContactPattern(text: string): boolean {
  return CONTACT_PATTERNS.some((pattern) => pattern.test(text));
}

const createPostSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    country: z.string().trim().min(1),
    region: z.string().trim().min(1),
    startDate: z.string().date(),
    endDate: z.string().date(),
    capacity: z.number().int().min(1).max(50),
    description: z.string().trim().min(1).max(2000),
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: "종료일은 시작일 이후여야 한다",
    path: ["endDate"],
  });

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요하다" }, { status: 401 });
  }

  const isAdult = await isProfileAdultVerified(user.id);
  if (!isAdult) {
    return NextResponse.json({ error: "성인확인이 필요하다" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "입력값이 올바르지 않다",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (
    containsContactPattern(parsed.data.title) ||
    containsContactPattern(parsed.data.description)
  ) {
    return NextResponse.json(
      {
        error: "연락처·메신저 정보는 포함할 수 없다",
        issues: { description: ["연락처·메신저 정보는 포함할 수 없다"] },
      },
      { status: 400 },
    );
  }

  const post = await createMatePost(user.id, parsed.data);
  return NextResponse.json({ post }, { status: 201 });
}
