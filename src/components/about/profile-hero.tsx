import { aboutData } from "@/data/about";

export const PROFILE_HERO_SECTION_ID = "profile-hero";

/**
 * SCR-002 Section 1 — Profile Hero + 여행 지표 카드.
 * `src/data/about.ts`(DATA-REPRESENTATIVE)를 단일 출처로 사용한다 — 지표(50+ Trips/
 * 30+ Countries)는 홈(C-SCR001-FOUNDER-SPLIT)과 동일한 필드를 참조해 항상 일치한다.
 */
export function ProfileHero() {
  const { name, tagline, totalTrips, totalCountries, gallery } = aboutData;
  const photo = gallery[0];

  return (
    <section
      id={PROFILE_HERO_SECTION_ID}
      className="mx-auto flex min-h-[480px] max-w-[1240px] flex-col items-center gap-8 px-5 py-16 scroll-mt-20 lg:flex-row lg:px-10 lg:py-20"
    >
      <div className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-md bg-surface-strong lg:w-[360px] lg:shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- 외부 URL 이미지, next/image 도메인 등록 없이도 항상 렌더되도록 유지 */}
        <img src={photo.url} alt={photo.alt} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
        <div>
          <h1 className="text-display-xl text-ink">{name}</h1>
          <p className="text-body-md text-body mt-2 max-w-md">{tagline}</p>
        </div>

        <div className="flex gap-6">
          <div className="shadow-card flex flex-col items-center gap-1 rounded-md px-6 py-4 lg:items-start">
            <p className="text-display-md text-ink">{totalTrips}+ Trips</p>
          </div>
          <div className="shadow-card flex flex-col items-center gap-1 rounded-md px-6 py-4 lg:items-start">
            <p className="text-display-md text-ink">{totalCountries}+ Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
}
