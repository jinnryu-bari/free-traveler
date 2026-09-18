"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import type { MateApplication, MatePost } from "@/lib/supabase/queries";
import { computeDisplayStatus, fetchFilteredMatePosts } from "./filter-summary";
import { readSelectedPostId, SELECTED_PARAM } from "./list-grid";
import { ParticipateRequestForm } from "./participate-request-form";
import { ReportModal } from "./report-modal";
import { BlockButton } from "./block-button";

function DetailPanelPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = readSelectedPostId(new URLSearchParams(searchParams.toString()));
  const { showToast } = useToast();

  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [closing, setClosing] = useState(false);
  const [postResult, setPostResult] = useState<{
    key: string;
    post: MatePost | null;
    status: "not-found" | "ready";
  }>({ key: "", post: null, status: "not-found" });
  const [appsResult, setAppsResult] = useState<{
    key: string;
    applications: MateApplication[] | null;
    error: boolean;
  }>({ key: "", applications: null, error: false });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const loadPost = useCallback(async (id: string) => {
    try {
      const posts = await fetchFilteredMatePosts({ country: "", region: "", start: "", end: "", status: "" });
      const found = posts.find((p) => p.id === id) ?? null;
      setPostResult({ key: id, post: found, status: found ? "ready" : "not-found" });
    } catch {
      setPostResult({ key: id, post: null, status: "not-found" });
    }
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    fetchFilteredMatePosts({ country: "", region: "", start: "", end: "", status: "" })
      .then((posts) => {
        if (!active) return;
        const found = posts.find((p) => p.id === selectedId) ?? null;
        setPostResult({ key: selectedId, post: found, status: found ? "ready" : "not-found" });
      })
      .catch(() => {
        if (active) setPostResult({ key: selectedId, post: null, status: "not-found" });
      });
    return () => {
      active = false;
    };
  }, [selectedId]);

  const post = postResult.key === selectedId ? postResult.post : null;
  const postState: "no-selection" | "loading" | "not-found" | "ready" = !selectedId
    ? "no-selection"
    : postResult.key !== selectedId
      ? "loading"
      : postResult.status;

  const isAuthor = Boolean(userId && post && userId === post.author_id);

  const loadApplications = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/mates/${id}/requests`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const body = (await res.json()) as { applications: MateApplication[] };
      setAppsResult({ key: id, applications: body.applications, error: false });
    } catch {
      setAppsResult({ key: id, applications: null, error: true });
    }
  }, []);

  useEffect(() => {
    if (!selectedId || !isAuthor) return;
    let active = true;
    fetch(`/api/mates/${selectedId}/requests`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<{ applications: MateApplication[] }>;
      })
      .then((body) => {
        if (active) setAppsResult({ key: selectedId, applications: body.applications, error: false });
      })
      .catch(() => {
        if (active) setAppsResult({ key: selectedId, applications: null, error: true });
      });
    return () => {
      active = false;
    };
  }, [selectedId, isAuthor]);

  const applications = appsResult.key === selectedId ? appsResult.applications : null;
  const applicationsError = appsResult.key === selectedId && appsResult.error;

  const closePanel = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete(SELECTED_PARAM);
    router.replace(`/mates${next.toString() ? `?${next.toString()}` : ""}`, { scroll: false });
  };

  const respondToRequest = async (applicationId: string, status: "ACCEPTED" | "REJECTED") => {
    if (!selectedId) return;
    const res = await fetch(`/api/mates/${selectedId}/requests`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      showToast("error", body?.error ?? "처리하지 못했다");
      return;
    }
    showToast("success", status === "ACCEPTED" ? "참가 요청을 승인했다" : "참가 요청을 거절했다");
    loadApplications(selectedId);
  };

  const closePost = async () => {
    if (!selectedId || closing) return;
    setClosing(true);
    const supabase = createClient();
    const { error } = await supabase.from("mate_posts").update({ status: "CLOSED" }).eq("id", selectedId);
    setClosing(false);
    if (error) {
      showToast("error", "모집을 마감하지 못했다");
      return;
    }
    showToast("success", "모집을 마감했다");
    loadPost(selectedId);
  };

  if (!selectedId) {
    return (
      <aside className="border-hairline hidden rounded-md border p-8 text-center lg:block lg:w-[60%]">
        <p className="text-body-md text-body">왼쪽 목록에서 동행글을 선택하면 상세 정보가 여기에 표시됩니다.</p>
      </aside>
    );
  }

  return (
    <aside className="border-hairline fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto rounded-t-md border bg-surface p-5 lg:static lg:z-auto lg:max-h-none lg:w-[60%] lg:overflow-visible lg:rounded-md">
      <div className="mb-3 flex items-center justify-between">
        <span aria-hidden className="mx-auto block h-1 w-10 rounded-full bg-surface-strong lg:hidden" />
        <button type="button" onClick={closePanel} className="text-body-sm text-body ml-auto hover:text-ink">
          닫기
        </button>
      </div>

      {postState === "loading" && <div className="h-40 animate-pulse rounded-md bg-surface-strong" />}

      {postState === "not-found" && (
        <p className="text-body-md text-ink">동행글을 찾을 수 없습니다. 삭제되었거나 접근할 수 없는 글입니다.</p>
      )}

      {postState === "ready" && post && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-title-md text-ink">{post.title}</h2>
              <span
                className={`text-caption rounded-full px-2 py-0.5 ${computeDisplayStatus(post) === "OPEN" ? "bg-info-bg text-info" : "bg-surface-strong text-body"}`}
              >
                {computeDisplayStatus(post) === "OPEN" ? "모집중" : "마감"}
              </span>
            </div>
            <p className="text-body-sm text-body mt-1">
              {post.country} {post.region} · {post.start_date} ~ {post.end_date} · 모집 인원 {post.capacity}명
            </p>
          </div>

          <p className="text-body-md text-ink whitespace-pre-wrap">{post.description}</p>

          {isAuthor ? (
            <div className="border-hairline rounded-md border p-4">
              <p className="text-title-sm text-ink">내 글 관리</p>
              <p className="text-body-sm text-body mt-1">
                이 글은 본인이 작성했습니다. 참가 신청 대신 아래에서 승인/거절과 마감을 관리할 수 있습니다.
              </p>

              {post.status === "OPEN" && (
                <button
                  type="button"
                  onClick={closePost}
                  disabled={closing}
                  className="text-button border-hairline mt-3 inline-flex h-9 items-center rounded-sm border px-4 text-ink hover:bg-surface-soft disabled:opacity-50"
                >
                  {closing ? "마감 처리 중..." : "모집 수동 마감"}
                </button>
              )}

              <div className="mt-4 flex flex-col gap-2">
                <p className="text-body-sm text-ink">참가 요청</p>
                {applicationsError && <p className="text-body-sm text-body">참가 요청을 불러오지 못했다.</p>}
                {!applicationsError && applications === null && (
                  <p className="text-body-sm text-body">불러오는 중...</p>
                )}
                {!applicationsError && applications !== null && applications.length === 0 && (
                  <p className="text-body-sm text-body">아직 참가 요청이 없습니다.</p>
                )}
                {!applicationsError &&
                  applications?.map((app) => (
                    <div key={app.id} className="border-hairline flex items-center justify-between gap-2 rounded-sm border p-3">
                      <div>
                        <p className="text-body-sm text-ink">{app.message}</p>
                        <p className="text-caption text-body">상태: {app.status}</p>
                      </div>
                      {app.status === "PENDING" && (
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => respondToRequest(app.id, "ACCEPTED")}
                            className="text-button inline-flex h-8 items-center rounded-sm bg-brand-coral px-3 text-on-brand"
                          >
                            승인
                          </button>
                          <button
                            type="button"
                            onClick={() => respondToRequest(app.id, "REJECTED")}
                            className="text-button border-hairline inline-flex h-8 items-center rounded-sm border px-3 text-ink"
                          >
                            거절
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="border-hairline rounded-md border p-4">
              <p className="text-title-sm text-ink">참가 신청</p>
              {userId === null && (
                <p className="text-body-sm text-body mt-1">
                  참가 신청은 로그인 후 이용할 수 있습니다.{" "}
                  <a href="/account" className="text-link">
                    로그인하기
                  </a>
                </p>
              )}
              {userId && computeDisplayStatus(post) === "CLOSED" && (
                <p className="text-body-sm text-body mt-1">모집이 마감된 동행글입니다.</p>
              )}
              {userId && computeDisplayStatus(post) === "OPEN" && (
                <div className="mt-2">
                  <ParticipateRequestForm postId={post.id} />
                </div>
              )}

              {userId && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-hairline pt-4">
                  <ReportModal postId={post.id} />
                  <BlockButton userId={post.author_id} onBlocked={() => window.location.reload()} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

/**
 * SCR-004 Section 4 — 목록+상세 Split(Desktop)/Drawer(Mobile). URL의 `?post=<id>`로 선택 상태를
 * 공유해 `C-SCR004-LIST-GRID`의 카드 클릭과 연동되고, 같은 URL을 공유하면 동일한 상세가 열린다.
 */
export function DetailPanel() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-surface-strong lg:w-[60%]" />}>
      <DetailPanelPanel />
    </Suspense>
  );
}
