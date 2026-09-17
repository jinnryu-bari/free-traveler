"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { destinations, type Destination } from "@/data/destinations";

const QUERY_PARAM = "q";
const DESTINATION_PARAM = "destination";

const ALL_SEASONS = ["봄", "여름", "가을", "겨울"] as const;

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "ko"));
}

function DestinationCard({ destination, onOpen }: { destination: Destination; onOpen: (id: string) => void }) {
  return (
    <button
      type="button"
      data-testid="destination-card"
      onClick={() => onOpen(destination.id)}
      className="shadow-card group flex flex-col overflow-hidden rounded-md text-left"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-strong">
        {/* eslint-disable-next-line @next/next/no-img-element -- 외부 URL 이미지, next/image 도메인 등록 없이도 항상 렌더되도록 유지 */}
        <img
          src={destination.image.url}
          alt={destination.image.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
        <div className="text-caption text-muted-soft hidden h-full w-full items-center justify-center">
          이미지를 불러오지 못했어요
        </div>
      </div>
      <div className="flex flex-col gap-1 p-4">
        <p className="text-title-md text-ink">{destination.city}</p>
        <p className="text-body-sm text-body">{destination.country}</p>
        <p className="text-body-sm text-body line-clamp-2">{destination.summary}</p>
      </div>
    </button>
  );
}

function DestinationGridsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = (searchParams.get(QUERY_PARAM) ?? "").trim().toLowerCase();

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [season, setSeason] = useState("");
  const [theme, setTheme] = useState("");

  const countries = useMemo(() => uniqueSorted(destinations.map((d) => d.country)), []);
  const cities = useMemo(() => uniqueSorted(destinations.map((d) => d.city)), []);
  const themes = useMemo(() => uniqueSorted(destinations.flatMap((d) => d.themes)), []);

  const openDetail = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(DESTINATION_PARAM, id);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    setCountry("");
    setCity("");
    setSeason("");
    setTheme("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete(QUERY_PARAM);
    router.replace(params.toString() ? `/?${params.toString()}` : "/", { scroll: false });
  };

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      if (country && d.country !== country) return false;
      if (city && d.city !== city) return false;
      if (season && !d.seasons.includes(season as (typeof ALL_SEASONS)[number])) return false;
      if (theme && !d.themes.includes(theme)) return false;
      if (keyword) {
        const haystack = [d.country, d.city, d.summary, ...d.themes].join(" ").toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }
      return true;
    });
  }, [country, city, season, theme, keyword]);

  const domestic = filtered.filter((d) => d.region === "domestic");
  const international = filtered.filter((d) => d.region === "international");
  const hasAnyFilter = Boolean(country || city || season || theme || keyword);
  const isEmpty = filtered.length === 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <select
          aria-label="국가 필터"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
        >
          <option value="">국가 전체</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          aria-label="도시 필터"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
        >
          <option value="">도시 전체</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          aria-label="계절 필터"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
        >
          <option value="">계절 전체</option>
          {ALL_SEASONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          aria-label="테마 필터"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
        >
          <option value="">테마 전체</option>
          {themes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-start gap-3 py-8">
          <p className="text-body-md text-body">
            선택하신 조건에 맞는 여행지가 없어요. 국가·도시·계절·테마 조건을 완화해보세요.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-button rounded-sm bg-brand-coral px-5 py-2.5 text-on-brand hover:bg-brand-coral-active"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-display-md text-ink">국내 인기 여행지</h2>
              <p className="text-body-md text-body mt-1">
                가까운 곳에서 부담 없이 떠날 수 있는 국내 여행지를 모았어요.
              </p>
            </div>
            {domestic.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {domestic.map((d) => (
                  <DestinationCard key={d.id} destination={d} onOpen={openDetail} />
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-muted">조건에 맞는 국내 여행지가 없어요.</p>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-display-md text-ink">해외 인기 여행지</h2>
              <p className="text-body-md text-body mt-1">
                여러 나라의 인기 도시 중 다음 여행지를 골라보세요.
              </p>
            </div>
            {international.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {international.map((d) => (
                  <DestinationCard key={d.id} destination={d} onOpen={openDetail} />
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-muted">조건에 맞는 해외 여행지가 없어요.</p>
            )}
          </section>
        </>
      )}

      {hasAnyFilter && !isEmpty ? (
        <button
          type="button"
          onClick={resetFilters}
          className="text-link self-start text-ink underline underline-offset-2"
        >
          필터 초기화
        </button>
      ) : null}
    </div>
  );
}

/**
 * SCR-001 Section 2·3 — 국내/해외 인기 여행지 Card Grid.
 * 카드 클릭은 `?destination=<id>` URL 상태만 설정한다 — 실제 상세 Drawer는
 * 별도 Task(`C-SCR001-DEST-DETAIL-DRAWER`)가 같은 query를 읽어 렌더링한다.
 */
export function DestinationGrids() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-surface-strong" />}>
      <DestinationGridsSection />
    </Suspense>
  );
}
