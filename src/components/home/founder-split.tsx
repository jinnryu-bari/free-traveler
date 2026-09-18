import Link from "next/link";
import { aboutData } from "@/data/about";

export const FOUNDER_SPLIT_SECTION_ID = "founder-split";

/**
 * SCR-001 Section 7 — free_traveler 소개 요약 Split.
 * `src/data/about.ts`(DATA-REPRESENTATIVE)를 단일 출처로 사용한다 — 지표(50+ Trips/
 * 30+ Countries)와 대표 사진(gallery[0])은 SCR-002 Profile Hero와 동일한 값을 공유한다.
 * 상호작용이 없는 정적 Section이라 Server Component로 유지한다.
 */
export function FounderSplit() {
  const { name, gallery, philosophySections, totalTrips, totalCountries } =
    aboutData;
  const photo = gallery[0];
  const intro = philosophySections[0]?.paragraphs.slice(0, 3) ?? [];

  return (
    <section
      id={FOUNDER_SPLIT_SECTION_ID}
      className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-16 scroll-mt-20 lg:flex-row lg:items-center lg:gap-14 lg:px-10 lg:py-24"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-surface-strong lg:w-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element -- 외부 URL 이미지, next/image 도메인 등록 없이도 항상 렌더되도록 유지 */}
        <img
          src={photo.url}
          alt={photo.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-5 lg:w-1/2">
        <div>
          <h2 className="text-display-md text-ink">{name}를 소개합니다</h2>
          <div className="mt-3 flex flex-col gap-3">
            {intro.map((paragraph, i) => (
              <p key={i} className="text-body-md text-body">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          <div>
            <p className="text-display-md text-ink">{totalTrips}+</p>
            <p className="text-body-sm text-muted">Trips</p>
          </div>
          <div>
            <p className="text-display-md text-ink">{totalCountries}+</p>
            <p className="text-body-sm text-muted">Countries</p>
          </div>
        </div>

        <Link
          href="/about"
          className="text-button inline-flex h-12 w-fit items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active"
        >
          대표 이야기 더 보기
        </Link>
      </div>
    </section>
  );
}
