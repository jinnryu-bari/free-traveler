"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const TAB_PARAM = "tab";
export const TABS = [
  { id: "flight", label: "항공편" },
  { id: "hotel", label: "숙소" },
  { id: "mate", label: "동행 구하기" },
] as const;
export type TabId = (typeof TABS)[number]["id"];

export function currentTab(searchParams: URLSearchParams): TabId {
  const raw = searchParams.get(TAB_PARAM);
  return TABS.some((t) => t.id === raw) ? (raw as TabId) : "flight";
}

function IntroTabsRow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = currentTab(new URLSearchParams(searchParams.toString()));

  const selectTab = (id: TabId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(TAB_PARAM, id);
    router.replace(`/travel-tools?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-12 lg:px-10 lg:py-16">
      <h1 className="text-display-xl text-ink">여행 조건 정리하기</h1>
      <p className="text-body-md text-body mt-3 max-w-xl">
        항공·숙소 조건을 정리해 외부 사이트로 이동하거나, 함께 떠날 동행을 구해보세요. 입력 →
        요약 확인 → 이동 순서로 진행됩니다.
      </p>

      <div role="tablist" aria-label="여행 도구" className="border-hairline mt-8 grid grid-cols-3 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => selectTab(tab.id)}
            className={`text-button -mb-px border-b-2 px-2 py-3 text-center ${
              active === tab.id ? "border-brand-coral text-ink" : "border-transparent text-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * SCR-003 Section 1 — Intro Banner + Tabs Shell. 탭 상태는 `?tab=` URL로
 * 관리한다 — 각 Form Component(`FlightForm`/`HotelForm`/`MateComposerForm`)가
 * 동일한 query를 각자 읽어 자신을 숨기거나 보여주므로(언마운트하지 않음),
 * 탭을 전환해도 다른 탭에 입력해둔 값이 사라지지 않는다.
 */
export function IntroTabs() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse bg-surface-strong" />}>
      <IntroTabsRow />
    </Suspense>
  );
}
