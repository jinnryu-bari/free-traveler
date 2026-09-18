"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

interface MyPost {
  id: string;
  title: string;
  country: string;
  region: string;
  start_date: string;
  end_date: string;
  status: "OPEN" | "CLOSED";
}

interface MyApplication {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  mate_posts: { title: string; country: string; region: string } | null;
}

interface MyBlock {
  blocked_id: string;
  nickname: string;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "대기중",
  ACCEPTED: "승인됨",
  REJECTED: "거절됨",
};

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-title-md text-ink">{title}</p>
      <p className="text-body-sm text-body mt-1">{description}</p>
    </div>
  );
}

function EmptyState({
  message,
  ctaHref,
  ctaLabel,
}: {
  message: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="border-hairline rounded-md border p-6 text-center">
      <p className="text-body-md text-ink">{message}</p>
      <Link
        href={ctaHref}
        className="text-button border-hairline mt-3 inline-flex h-10 items-center rounded-sm border px-4 text-ink hover:bg-surface-soft"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

/**
 * SCR-005 Member — 내가 쓴 글 / 내가 신청한 글 / 차단 목록(REQ-FUNC-040 관리 측면).
 * 세 목록 모두 RLS가 본인 데이터로만 제한한다(`mate_posts_update_own`, `mate_applications_select_related`,
 * `blocks_select_own`) — 이 Component는 그 위에서 현재 로그인 사용자 id로만 필터링한다.
 */
export function MyActivity() {
  const { showToast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<MyPost[] | null>(null);
  const [applications, setApplications] = useState<MyApplication[] | null>(
    null,
  );
  const [blocks, setBlocks] = useState<MyBlock[] | null>(null);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  const loadAll = useCallback(async (id: string) => {
    const supabase = createClient();

    const [postsRes, applicationsRes, blocksRes] = await Promise.all([
      supabase
        .from("mate_posts")
        .select("id, title, country, region, start_date, end_date, status")
        .eq("author_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("mate_applications")
        .select("id, status, mate_posts(title, country, region)")
        .eq("applicant_id", id)
        .order("created_at", { ascending: false }),
      supabase.from("blocks").select("blocked_id").eq("blocker_id", id),
    ]);

    setPosts((postsRes.data as MyPost[] | null) ?? []);
    setApplications(
      (applicationsRes.data as unknown as MyApplication[] | null) ?? [],
    );

    const blockedIds = (
      (blocksRes.data as { blocked_id: string }[] | null) ?? []
    ).map((row) => row.blocked_id);
    if (blockedIds.length === 0) {
      setBlocks([]);
    } else {
      const { data: profileRows } = await supabase
        .from("profiles")
        .select("id, nickname")
        .in("id", blockedIds);
      const nicknameById = new Map(
        ((profileRows as { id: string; nickname: string }[] | null) ?? []).map(
          (r) => [r.id, r.nickname],
        ),
      );
      setBlocks(
        blockedIds.map((blockedId) => ({
          blocked_id: blockedId,
          nickname: nicknameById.get(blockedId) ?? "알 수 없음",
        })),
      );
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);
      loadAll(data.user.id);
    });
  }, [loadAll]);

  const closePost = async (postId: string) => {
    if (closingId) return;
    setClosingId(postId);
    const supabase = createClient();
    const { error } = await supabase
      .from("mate_posts")
      .update({ status: "CLOSED" })
      .eq("id", postId);
    setClosingId(null);
    if (error) {
      showToast("error", "모집을 마감하지 못했다");
      return;
    }
    showToast("success", "모집을 마감했다");
    if (userId) loadAll(userId);
  };

  const unblock = async (blockedId: string) => {
    if (unblockingId) return;
    setUnblockingId(blockedId);
    const res = await fetch(`/api/account/blocklist?blockedId=${blockedId}`, {
      method: "DELETE",
    });
    setUnblockingId(null);
    if (!res.ok) {
      showToast("error", "차단을 해제하지 못했다");
      return;
    }
    showToast("success", "차단을 해제했다");
    if (userId) loadAll(userId);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <SectionTitle
          title="내가 쓴 동행글"
          description="작성한 글의 모집 상태를 확인하고 마감할 수 있습니다."
        />
        {posts === null && (
          <div className="h-24 animate-pulse rounded-md bg-surface-strong" />
        )}
        {posts !== null && posts.length === 0 && (
          <EmptyState
            message="아직 작성한 동행글이 없습니다."
            ctaHref="/travel-tools?tab=mate"
            ctaLabel="동행글 작성하기"
          />
        )}
        {posts !== null && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="shadow-card flex flex-col gap-1 rounded-md p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-title-sm text-ink line-clamp-1">
                    {post.title}
                  </p>
                  <span
                    className={`text-caption shrink-0 rounded-full px-2 py-0.5 ${post.status === "OPEN" ? "bg-info-bg text-info" : "bg-surface-strong text-body"}`}
                  >
                    {post.status === "OPEN" ? "모집중" : "마감"}
                  </span>
                </div>
                <p className="text-body-sm text-body">
                  {post.country} {post.region} · {post.start_date} ~{" "}
                  {post.end_date}
                </p>
                {post.status === "OPEN" && (
                  <button
                    type="button"
                    onClick={() => closePost(post.id)}
                    disabled={closingId === post.id}
                    className="text-button border-hairline mt-2 inline-flex h-8 w-fit items-center rounded-sm border px-3 text-ink hover:bg-surface-soft disabled:opacity-50"
                  >
                    {closingId === post.id ? "마감하는 중..." : "모집 마감"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SectionTitle
          title="내가 신청한 동행글"
          description="참가 신청 상태를 확인할 수 있습니다."
        />
        {applications === null && (
          <div className="h-24 animate-pulse rounded-md bg-surface-strong" />
        )}
        {applications !== null && applications.length === 0 && (
          <EmptyState
            message="아직 신청한 동행글이 없습니다."
            ctaHref="/mates"
            ctaLabel="동행글 찾아보기"
          />
        )}
        {applications !== null && applications.length > 0 && (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {applications.map((app) => (
              <div
                key={app.id}
                className="shadow-card flex flex-col gap-1 rounded-md p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-title-sm text-ink line-clamp-1">
                    {app.mate_posts?.title ?? "삭제된 글"}
                  </p>
                  <span className="text-caption bg-surface-strong text-body shrink-0 rounded-full px-2 py-0.5">
                    {STATUS_LABEL[app.status]}
                  </span>
                </div>
                {app.mate_posts && (
                  <p className="text-body-sm text-body">
                    {app.mate_posts.country} {app.mate_posts.region}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SectionTitle
          title="차단 목록"
          description="차단한 사용자를 관리할 수 있습니다."
        />
        {blocks === null && (
          <div className="h-24 animate-pulse rounded-md bg-surface-strong" />
        )}
        {blocks !== null && blocks.length === 0 && (
          <EmptyState
            message="차단한 사용자가 없습니다."
            ctaHref="/mates"
            ctaLabel="동행글 찾아보기"
          />
        )}
        {blocks !== null && blocks.length > 0 && (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {blocks.map((block) => (
              <div
                key={block.blocked_id}
                className="shadow-card flex items-center justify-between gap-2 rounded-md p-4"
              >
                <p className="text-body-sm text-ink">{block.nickname}</p>
                <button
                  type="button"
                  onClick={() => unblock(block.blocked_id)}
                  disabled={unblockingId === block.blocked_id}
                  className="text-button border-hairline inline-flex h-8 shrink-0 items-center rounded-sm border px-3 text-ink hover:bg-surface-soft disabled:opacity-50"
                >
                  {unblockingId === block.blocked_id
                    ? "해제하는 중..."
                    : "차단 해제"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
