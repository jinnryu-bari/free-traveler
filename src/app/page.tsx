import Link from "next/link";
import { HeroSearch } from "@/components/home/hero-search";
import { DestinationGrids } from "@/components/home/destination-grids";
import { DestinationDetailDrawer } from "@/components/home/destination-detail-drawer";
import { ThemeChips } from "@/components/home/theme-chips";
import { SafetyGrid } from "@/components/home/safety-grid";
import { SafetyDetailDrawer } from "@/components/home/safety-detail-drawer";
import { MatesPreview } from "@/components/home/mates-preview";
import { FounderSplit } from "@/components/home/founder-split";

/**
 * SCR-001 `/` Page Owner — Section 순서(design-reference/D-001/DESIGN.md §18):
 * Hero → 국내/해외 인기 여행지(DestinationGrids) → 여행 동기 Chip(ThemeChips) →
 * 국가별 주의사항(SafetyGrid) → 최근 동행글(MatesPreview) → free_traveler 소개(FounderSplit).
 * 이 파일은 하위 Component를 조립만 한다 — 새 Component 로직을 여기서 구현하지 않는다.
 */
export default function Home() {
  return (
    <>
      <section className="mx-auto flex min-h-[560px] max-w-[1240px] flex-col justify-center gap-6 px-5 py-12 lg:px-10 lg:py-20">
        <h1 className="text-display-xl max-w-xl text-ink">어디로 떠나고 싶으신가요?</h1>
        <p className="text-body-md max-w-md text-body">
          여행지를 발견하고, 항공·숙소 조건을 정리해 외부 사이트로 이동하고, 믿을 수 있는 동행을
          찾아보세요.
        </p>
        <HeroSearch />
        <Link
          href="/travel-tools"
          className="text-button inline-flex h-12 w-fit items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active"
        >
          여행 조건 정리하기
        </Link>
      </section>

      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">
        <DestinationGrids />
      </div>
      <DestinationDetailDrawer />

      <div className="mx-auto max-w-[1240px] px-5 py-8 lg:px-10">
        <ThemeChips />
      </div>

      <div className="mx-auto max-w-[1240px] px-5 py-8 lg:px-10">
        <SafetyGrid />
      </div>
      <SafetyDetailDrawer />

      <MatesPreview />

      <FounderSplit />
    </>
  );
}
