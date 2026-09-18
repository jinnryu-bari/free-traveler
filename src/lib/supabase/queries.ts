import { z } from "zod";
import { createClient } from "./server";

/**
 * 서버 데이터 접근 레이어 — 모든 API Route는 Supabase를 직접 호출하지 않고
 * 이 파일을 통해서만 DB에 접근한다(rule: DB-ACCESS Functional AC).
 * 쓰기 입력은 각 함수 진입부에서 zod로 검증해 저장 단계의 XSS/부적합 데이터를 차단한다.
 */

export type MatePostStatus = "OPEN" | "CLOSED";
export type MateApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";
export type ExternalLinkKey =
  "flight_search_base_url" | "hotel_search_base_url";

export interface MatePost {
  id: string;
  author_id: string;
  title: string;
  country: string;
  region: string;
  start_date: string;
  end_date: string;
  capacity: number;
  description: string;
  status: MatePostStatus;
  created_at: string;
  updated_at: string;
}

export interface MateApplication {
  id: string;
  post_id: string;
  applicant_id: string;
  message: string;
  status: MateApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_post_id: string | null;
  target_user_id: string | null;
  reason_code: string;
  description: string;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

export interface ExternalLink {
  key: ExternalLinkKey;
  url: string;
  updated_at: string;
}

// ─── 동행글 ────────────────────────────────────────────────────────────

const matePostFiltersSchema = z.object({
  country: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export type MatePostFilters = z.infer<typeof matePostFiltersSchema>;

export async function listMatePosts(
  filters: MatePostFilters = {},
): Promise<MatePost[]> {
  const parsed = matePostFiltersSchema.parse(filters);
  const supabase = await createClient();

  let query = supabase
    .from("mate_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (parsed.country) query = query.eq("country", parsed.country);
  if (parsed.region) query = query.eq("region", parsed.region);
  if (parsed.status) query = query.eq("status", parsed.status);

  const { data, error } = await query;
  if (error) throw error;
  return data as MatePost[];
}

const createMatePostSchema = z
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

export type CreateMatePostInput = z.infer<typeof createMatePostSchema>;

export async function createMatePost(
  authorId: string,
  input: CreateMatePostInput,
): Promise<MatePost> {
  const parsed = createMatePostSchema.parse(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mate_posts")
    .insert({
      author_id: authorId,
      title: parsed.title,
      country: parsed.country,
      region: parsed.region,
      start_date: parsed.startDate,
      end_date: parsed.endDate,
      capacity: parsed.capacity,
      description: parsed.description,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as MatePost;
}

// ─── 참가 신청 ─────────────────────────────────────────────────────────

const createMateApplicationSchema = z.object({
  postId: z.string().uuid(),
  message: z.string().trim().min(1).max(500),
});

export type CreateMateApplicationInput = z.infer<
  typeof createMateApplicationSchema
>;

export async function createMateApplication(
  applicantId: string,
  input: CreateMateApplicationInput,
): Promise<MateApplication> {
  const parsed = createMateApplicationSchema.parse(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mate_applications")
    .insert({
      post_id: parsed.postId,
      applicant_id: applicantId,
      message: parsed.message,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as MateApplication;
}

const updateMateApplicationStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
});

export async function updateMateApplicationStatus(
  applicationId: string,
  input: z.infer<typeof updateMateApplicationStatusSchema>,
): Promise<MateApplication> {
  const parsed = updateMateApplicationStatusSchema.parse(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mate_applications")
    .update({ status: parsed.status })
    .eq("id", applicationId)
    .select("*")
    .single();

  if (error) throw error;
  return data as MateApplication;
}

// ─── 조회 전용 보조 함수 (API-MATE-REQUESTS) ──────────────────────────────
// 참가 요청 API가 글 존재·작성자 확인, 요청 목록 조회에 쓰는 최소 조회 함수.
// 기존 CRUD 함수는 수정하지 않고 추가만 한다(API-MATES 섹션과 동일한 원칙).

export async function getMatePostById(id: string): Promise<MatePost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mate_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as MatePost | null) ?? null;
}

export async function listApplicationsForPost(
  postId: string,
): Promise<MateApplication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mate_applications")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as MateApplication[];
}

export async function getMateApplicationById(
  id: string,
): Promise<MateApplication | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mate_applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as MateApplication | null) ?? null;
}

// ─── 조회 전용 보조 함수 (API-MATES) ──────────────────────────────────────
// 동행글 목록에서 "내가 차단한 사용자" 글을 제외하고, 작성 전 성인확인 여부를
// 확인하기 위한 최소 조회 함수. 기존 CRUD 함수는 수정하지 않고 추가만 한다.

export async function listBlockedUserIds(blockerId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocks")
    .select("blocked_id")
    .eq("blocker_id", blockerId);
  if (error) throw error;
  return (data as { blocked_id: string }[]).map((row) => row.blocked_id);
}

export async function isProfileAdultVerified(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("is_adult")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return Boolean((data as { is_adult: boolean }).is_adult);
}

// API-ADMIN-REPORTS가 요청자의 역할을 서버에서 재확인하기 위한 최소 조회 함수.
// 클라이언트가 보여주는 role(RoleGate)을 신뢰하지 않고 항상 이 함수로 다시 조회한다.
export async function getProfileRole(userId: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return (data as { role: string }).role;
}

// ─── 차단 ──────────────────────────────────────────────────────────────

const blockTargetSchema = z.object({
  blockedId: z.string().uuid(),
});

export async function createBlock(
  blockerId: string,
  input: z.infer<typeof blockTargetSchema>,
): Promise<void> {
  const parsed = blockTargetSchema.parse(input);
  const supabase = await createClient();

  const { error } = await supabase
    .from("blocks")
    .insert({ blocker_id: blockerId, blocked_id: parsed.blockedId });
  if (error) throw error;
}

export async function deleteBlock(
  blockerId: string,
  input: z.infer<typeof blockTargetSchema>,
): Promise<void> {
  const parsed = blockTargetSchema.parse(input);
  const supabase = await createClient();

  const { error } = await supabase
    .from("blocks")
    .delete()
    .eq("blocker_id", blockerId)
    .eq("blocked_id", parsed.blockedId);
  if (error) throw error;
}

// ─── 신고 ──────────────────────────────────────────────────────────────

const createReportSchema = z
  .object({
    targetPostId: z.string().uuid().optional(),
    targetUserId: z.string().uuid().optional(),
    reasonCode: z.string().trim().min(1).max(60),
    description: z.string().trim().min(1).max(1000),
  })
  .refine((value) => value.targetPostId || value.targetUserId, {
    message: "신고 대상(글 또는 사용자)이 필요하다",
    path: ["targetPostId"],
  });

export type CreateReportInput = z.infer<typeof createReportSchema>;

export async function createReport(
  reporterId: string,
  input: CreateReportInput,
): Promise<Report> {
  const parsed = createReportSchema.parse(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reports")
    .insert({
      reporter_id: reporterId,
      target_post_id: parsed.targetPostId ?? null,
      target_user_id: parsed.targetUserId ?? null,
      reason_code: parsed.reasonCode,
      description: parsed.description,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Report;
}

const listReportsFiltersSchema = z.object({
  status: z.enum(["OPEN", "RESOLVED", "DISMISSED"]).optional(),
});

export async function listReports(
  filters: z.infer<typeof listReportsFiltersSchema> = {},
): Promise<Report[]> {
  const parsed = listReportsFiltersSchema.parse(filters);
  const supabase = await createClient();

  let query = supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (parsed.status) query = query.eq("status", parsed.status);

  const { data, error } = await query;
  if (error) throw error;
  return data as Report[];
}

const updateReportStatusSchema = z.object({
  status: z.enum(["OPEN", "RESOLVED", "DISMISSED"]),
});

export async function updateReportStatus(
  reportId: string,
  input: z.infer<typeof updateReportStatusSchema>,
): Promise<Report> {
  const parsed = updateReportStatusSchema.parse(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reports")
    .update({ status: parsed.status })
    .eq("id", reportId)
    .select("*")
    .single();

  if (error) throw error;
  return data as Report;
}

// ─── 외부 URL 설정(항공/숙소) ───────────────────────────────────────────

const ALLOWED_EXTERNAL_LINK_HOSTS = [
  "www.google.com", // Google Flights/Hotels 등, 06번 가이드에서 실제 값으로 교체
];

export async function getExternalLinks(): Promise<
  Record<ExternalLinkKey, string | null>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("external_links")
    .select("key, url");
  if (error) throw error;

  const result: Record<ExternalLinkKey, string | null> = {
    flight_search_base_url: null,
    hotel_search_base_url: null,
  };
  for (const row of data as { key: ExternalLinkKey; url: string }[]) {
    result[row.key] = row.url;
  }
  return result;
}

const updateExternalLinkSchema = z.object({
  key: z.enum(["flight_search_base_url", "hotel_search_base_url"]),
  url: z
    .string()
    .url()
    .refine((value) => value.startsWith("https://"), {
      message: "HTTPS URL만 허용된다",
    })
    .refine(
      (value) =>
        ALLOWED_EXTERNAL_LINK_HOSTS.some(
          (host) => new URL(value).hostname === host,
        ),
      {
        message: "허용목록에 없는 호스트다",
      },
    ),
});

export type UpdateExternalLinkInput = z.infer<typeof updateExternalLinkSchema>;

export async function updateExternalLink(
  updatedBy: string,
  input: UpdateExternalLinkInput,
): Promise<ExternalLink> {
  const parsed = updateExternalLinkSchema.parse(input);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("external_links")
    .update({
      url: parsed.url,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    })
    .eq("key", parsed.key)
    .select("key, url, updated_at")
    .single();

  if (error) throw error;
  return data as ExternalLink;
}
