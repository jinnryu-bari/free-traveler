"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { MatePost } from "@/lib/supabase/queries";
import { computeDisplayStatus, fetchFilteredMatePosts, readMateFilters } from "./filter-summary";

export const SELECTED_PARAM = "post";

export function readSelectedPostId(searchParams: URLSearchParams): string | null {
  return searchParams.get(SELECTED_PARAM);
}

const INITIAL_VISIBLE = 8;
const MAX_VISIBLE = 20;

function formatPeriod(post: MatePost): string {
  return `${post.start_date} ~ ${post.end_date}`;
}

function ListGridPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = readMateFilters(new URLSearchParams(searchParams.toString()));
  const selectedId = readSelectedPostId(new URLSearchParams(searchParams.toString()));

  const filterKey = `${filters.country}|${filters.region}|${filters.start}|${filters.end}|${filters.status}`;
  const [nicknames, setNicknames] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ key: string; posts: MatePost[] | null; error: boolean }>({
    key: "",
    posts: null,
    error: false,
  });
  const [visible, setVisible] = useState<{ key: string; count: number }>({
    key: filterKey,
    count: INITIAL_VISIBLE,
  });

  useEffect(() => {
    let active = true;
    fetchFilteredMatePosts(filters)
      .then((data) => {
        if (active) setResult({ key: filterKey, posts: data, error: false });
      })
      .catch(() => {
        if (active) setResult({ key: filterKey, posts: null, error: true });
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const isLoading = result.key !== filterKey;
  const posts = isLoading ? null : result.posts;
  const loadError = !isLoading && result.error;
  const visibleCount = visible.key === filterKey ? visible.count : INITIAL_VISIBLE;

  const visiblePosts = useMemo(() => posts?.slice(0, visibleCount) ?? [], [posts, visibleCount]);

  useEffect(() => {
    const authorIds = Array.from(new Set(visiblePosts.map((p) => p.author_id))).filter(
      (id) => !(id in nicknames),
    );
    if (authorIds.length === 0) return;
    let active = true;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("id, nickname")
      .in("id", authorIds)
      .then(({ data }) => {
        if (!active || !data) return;
        setNicknames((current) => {
          const next = { ...current };
          for (const row of data as { id: string; nickname: string }[]) {
            next[row.id] = row.nickname;
          }
          return next;
        });
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiblePosts]);

  const selectPost = (id: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set(SELECTED_PARAM, id);
    router.replace(`/mates?${next.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.replace("/mates", { scroll: false });
  };

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-10 lg:flex lg:gap-6 lg:px-10">
      <div className="lg:w-[40%]">
        {loadError && (
          <div className="border-hairline rounded-md border p-6 text-center">
            <p className="text-body-md text-ink">동행글 목록을 불러오지 못했어요.</p>
            <p className="text-body-sm text-body mt-1">잠시 후 다시 시도해주세요.</p>
          </div>
        )}

        {!loadError && posts === null && (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-md bg-surface-strong" />
            ))}
          </div>
        )}

        {!loadError && posts !== null && posts.length === 0 && (
          <div className="border-hairline rounded-md border p-8 text-center">
            <p className="text-title-md text-ink">조건에 맞는 동행글이 없어요.</p>
            <p className="text-body-sm text-body mt-1">
              필터를 초기화하거나 새 동행글을 작성해 다른 여행자를 기다려보세요.
            </p>
            <div className="mt-4 flex flex-col justify-center gap-3 lg:flex-row">
              <button
                type="button"
                onClick={resetFilters}
                className="text-button border-hairline inline-flex h-11 items-center justify-center rounded-sm border px-5 text-ink hover:bg-surface-soft"
              >
                필터 초기화
              </button>
              <a
                href="/travel-tools?tab=mate"
                className="text-button inline-flex h-11 items-center justify-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active"
              >
                동행글 작성하기
              </a>
            </div>
          </div>
        )}

        {!loadError && posts !== null && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {visiblePosts.map((post) => {
              const displayStatus = computeDisplayStatus(post);
              const isSelected = post.id === selectedId;
              return (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => selectPost(post.id)}
                  aria-pressed={isSelected}
                  className={`shadow-card flex flex-col gap-1 rounded-md p-4 text-left ${isSelected ? "ring-2 ring-brand-coral" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-title-md text-ink line-clamp-1">{post.title}</p>
                    <span
                      className={`text-caption shrink-0 rounded-full px-2 py-0.5 ${displayStatus === "OPEN" ? "bg-info-bg text-info" : "bg-surface-strong text-body"}`}
                    >
                      {displayStatus === "OPEN" ? "모집중" : "마감"}
                    </span>
                  </div>
                  <p className="text-body-sm text-body">
                    {post.country} {post.region} · {formatPeriod(post)}
                  </p>
                  <p className="text-body-sm text-body">
                    모집 인원 {post.capacity}명 · 작성자 {nicknames[post.author_id] ?? "..."}
                  </p>
                </button>
              );
            })}

            {posts.length > visibleCount && (
              <button
                type="button"
                onClick={() =>
                  setVisible({ key: filterKey, count: Math.min(visibleCount + INITIAL_VISIBLE, MAX_VISIBLE) })
                }
                className="text-button border-hairline inline-flex h-11 items-center justify-center rounded-sm border px-5 text-ink hover:bg-surface-soft"
              >
                더 보기
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * SCR-004 Section 3 — 공개 동행글 Card 목록. `C-SCR004-FILTER-SUMMARY`와 같은 URL 쿼리 필터를
 * 공유하고(`fetchFilteredMatePosts` 재사용), 카드 클릭은 `?post=<id>` 쿼리로 선택 상태를 남겨
 * `C-SCR004-DETAIL-PANEL`이 같은 URL에서 상세를 읽는다.
 */
export function ListGrid() {
  return (
    <Suspense fallback={<div className="mx-auto h-64 max-w-[1240px] animate-pulse rounded-md bg-surface-strong px-5 lg:px-10" />}>
      <ListGridPanel />
    </Suspense>
  );
}
