"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import type { MatePost, MatePostStatus } from "@/lib/supabase/queries";

export const FILTER_PARAMS = {
  country: "country",
  region: "region",
  start: "start",
  end: "end",
  status: "status",
} as const;

export interface MateFilters {
  country: string;
  region: string;
  start: string;
  end: string;
  status: "" | MatePostStatus;
}

export function readMateFilters(searchParams: URLSearchParams): MateFilters {
  const status = searchParams.get(FILTER_PARAMS.status);
  return {
    country: searchParams.get(FILTER_PARAMS.country) ?? "",
    region: searchParams.get(FILTER_PARAMS.region) ?? "",
    start: searchParams.get(FILTER_PARAMS.start) ?? "",
    end: searchParams.get(FILTER_PARAMS.end) ?? "",
    status: status === "OPEN" || status === "CLOSED" ? status : "",
  };
}

/**
 * 저장값이 OPEN이어도 종료일이 지났으면 화면에서는 CLOSED로 본다
 * (`docs/PROJECT_SCOPE.md` §2 — 동행 마감은 조회 시점에 계산, DB 값을 직접 바꾸지 않음).
 */
export function computeDisplayStatus(post: MatePost): MatePostStatus {
  if (post.status === "CLOSED") return "CLOSED";
  const today = new Date().toISOString().slice(0, 10);
  return post.end_date < today ? "CLOSED" : "OPEN";
}

function overlapsPeriod(post: MatePost, start: string, end: string): boolean {
  if (start && post.end_date < start) return false;
  if (end && post.start_date > end) return false;
  return true;
}

/**
 * `/api/mates`는 country·region만 서버 필터로 지원한다(API-MATES). 기간 겹침과
 * 자동 마감(CLOSED) 판정은 조회 시점에 이 함수가 클라이언트에서 추가로 적용한다 —
 * `C-SCR004-LIST-GRID`도 같은 조건으로 일관되게 필터링하기 위해 이 함수를 그대로 가져다 쓴다.
 */
export async function fetchFilteredMatePosts(filters: MateFilters): Promise<MatePost[]> {
  const params = new URLSearchParams();
  if (filters.country) params.set("country", filters.country);
  if (filters.region) params.set("region", filters.region);

  const res = await fetch(`/api/mates${params.toString() ? `?${params}` : ""}`, { cache: "no-store" });
  if (!res.ok) throw new Error("동행글을 불러오지 못했다");
  const body = (await res.json()) as { posts: MatePost[] };

  return body.posts.filter((post) => {
    if (!overlapsPeriod(post, filters.start, filters.end)) return false;
    if (filters.status && computeDisplayStatus(post) !== filters.status) return false;
    return true;
  });
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "ko"));
}

function FilterSummaryPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = readMateFilters(new URLSearchParams(searchParams.toString()));

  const [mobileOpen, setMobileOpen] = useState(false);
  const filterKey = `${filters.country}|${filters.region}|${filters.start}|${filters.end}|${filters.status}`;
  const [result, setResult] = useState<{ key: string; count: number | null; error: boolean }>({
    key: "",
    count: null,
    error: false,
  });

  const countries = useMemo(() => uniqueSorted(destinations.map((d) => d.country)), []);
  const regions = useMemo(
    () => uniqueSorted(destinations.filter((d) => d.country === filters.country).map((d) => d.city)),
    [filters.country],
  );

  useEffect(() => {
    let active = true;
    fetchFilteredMatePosts(filters)
      .then((posts) => {
        if (active) setResult({ key: filterKey, count: posts.length, error: false });
      })
      .catch(() => {
        if (active) setResult({ key: filterKey, count: null, error: true });
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const isLoading = result.key !== filterKey;
  const count = isLoading ? null : result.count;
  const loadError = !isLoading && result.error;

  const updateParam = (key: keyof typeof FILTER_PARAMS, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(FILTER_PARAMS[key], value);
    else next.delete(FILTER_PARAMS[key]);
    if (key === "country") next.delete(FILTER_PARAMS.region);
    router.replace(`/mates?${next.toString()}`, { scroll: false });
  };

  return (
    <section className="mx-auto max-w-[1240px] px-5 lg:px-10">
      <div className="border-hairline rounded-md border p-4">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="text-button flex w-full items-center justify-between lg:hidden"
        >
          필터
          <span aria-hidden>{mobileOpen ? "▲" : "▼"}</span>
        </button>

        <div
          className={`${mobileOpen ? "flex" : "hidden"} mt-3 flex-col gap-3 lg:mt-0 lg:flex lg:flex-row lg:flex-wrap lg:items-end lg:gap-4`}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="mate-filter-country" className="text-body-sm text-ink">
              국가
            </label>
            <select
              id="mate-filter-country"
              value={filters.country}
              onChange={(e) => updateParam("country", e.target.value)}
              className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
            >
              <option value="">전체</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="mate-filter-region" className="text-body-sm text-ink">
              지역
            </label>
            <select
              id="mate-filter-region"
              value={filters.region}
              onChange={(e) => updateParam("region", e.target.value)}
              disabled={!filters.country}
              className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink disabled:opacity-50"
            >
              <option value="">전체</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="mate-filter-start" className="text-body-sm text-ink">
              시작일
            </label>
            <input
              id="mate-filter-start"
              type="date"
              value={filters.start}
              onChange={(e) => updateParam("start", e.target.value)}
              className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="mate-filter-end" className="text-body-sm text-ink">
              종료일
            </label>
            <input
              id="mate-filter-end"
              type="date"
              value={filters.end}
              onChange={(e) => updateParam("end", e.target.value)}
              className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="mate-filter-status" className="text-body-sm text-ink">
              모집 상태
            </label>
            <select
              id="mate-filter-status"
              value={filters.status}
              onChange={(e) => updateParam("status", e.target.value)}
              className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
            >
              <option value="">전체</option>
              <option value="OPEN">모집중</option>
              <option value="CLOSED">마감</option>
            </select>
          </div>
        </div>

        <p className="text-body-sm text-body mt-3">
          {loadError
            ? "결과 수를 불러오지 못했다."
            : count === null
              ? "조건에 맞는 동행글을 세는 중..."
              : `조건에 맞는 동행글 ${count}개`}
        </p>
      </div>
    </section>
  );
}

/**
 * SCR-004 Section 2 — 국가·지역·기간·모집 상태 Filter와 결과 수 요약.
 * 필터 상태는 URL 쿼리(`?country=&region=&start=&end=&status=`)에 저장돼 `C-SCR004-LIST-GRID`와
 * 동일한 조건을 공유한다(SCR-003 `intro-tabs`/`flight-form` 패턴과 동일).
 */
export function FilterSummary() {
  return (
    <Suspense fallback={<div className="mx-auto h-20 max-w-[1240px] animate-pulse rounded-md bg-surface-strong px-5 lg:px-10" />}>
      <FilterSummaryPanel />
    </Suspense>
  );
}
