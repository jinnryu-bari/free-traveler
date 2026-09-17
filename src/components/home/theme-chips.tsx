"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DESTINATION_GRIDS_SECTION_ID } from "./destination-grids";

const THEME_PARAM = "theme";

// destinations.ts에 실제로 존재하는 테마 값 중 빈도 상위 6개
// (역사 18 · 해변 11 · 도시 9 · 자연 6 · 예술 6 · 휴양 4).
const TRAVEL_THEMES = ["역사", "해변", "도시", "자연", "예술", "휴양"] as const;

function ThemeChipsRow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTheme = searchParams.get(THEME_PARAM) ?? "";

  const selectTheme = (theme: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const next = selectedTheme === theme ? "" : theme;
    if (next) {
      params.set(THEME_PARAM, next);
    } else {
      params.delete(THEME_PARAM);
    }
    router.replace(params.toString() ? `/?${params.toString()}` : "/", { scroll: false });

    document.getElementById(DESTINATION_GRIDS_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:gap-3">
      {TRAVEL_THEMES.map((theme) => {
        const isSelected = selectedTheme === theme;
        return (
          <button
            key={theme}
            type="button"
            aria-pressed={isSelected}
            onClick={() => selectTheme(theme)}
            className={`text-caption rounded-full px-4 py-2 transition-colors ${
              isSelected
                ? "bg-brand-coral-soft text-ink"
                : "bg-surface-soft text-muted hover:text-ink"
            }`}
          >
            {theme}
          </button>
        );
      })}
    </div>
  );
}

/**
 * SCR-001 Section 4 — 여행 동기·테마 Chip. 선택 시 `?theme=` URL을 설정해
 * `C-SCR001-DEST-GRIDS`의 테마 필터를 원격으로 제어하고, Grid Section으로
 * 스크롤 이동한다.
 */
export function ThemeChips() {
  return (
    <Suspense fallback={<div className="h-11 animate-pulse rounded-full bg-surface-soft" />}>
      <ThemeChipsRow />
    </Suspense>
  );
}
