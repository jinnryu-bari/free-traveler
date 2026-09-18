import Link from "next/link";
import { aboutData, type AboutCountryChip } from "@/data/about";
import { destinations } from "@/data/destinations";

export const COUNTRY_CHIPS_SECTION_ID = "country-chips";

const REGION_ORDER: AboutCountryChip["region"][] = ["아시아", "유럽", "북미", "남미", "오세아니아", "아프리카"];

/**
 * SCR-002 Section 4 — 방문 국가 Chip(권역별). `src/data/destinations.ts`에 해당
 * 국가의 여행지가 있으면 SCR-001(`/`)의 키워드 검색으로 이동하는 활성 Chip,
 * 없으면 비활성(클릭 불가) 스타일로 표시한다.
 */
export function CountryChips() {
  const { visitedCountries } = aboutData;
  const countriesWithDestinations = new Set(destinations.map((d) => d.country));

  const byRegion = REGION_ORDER.map((region) => ({
    region,
    countries: visitedCountries.filter((c) => c.region === region),
  })).filter((group) => group.countries.length > 0);

  return (
    <section id={COUNTRY_CHIPS_SECTION_ID} className="mx-auto max-w-[1240px] px-5 py-16 scroll-mt-20 lg:px-10 lg:py-20">
      <div>
        <h2 className="text-display-md text-ink">방문 국가</h2>
        <p className="text-body-md text-body mt-1">
          지금까지 다녀온 {visitedCountries.length}개국이에요. 여행지 정보가 있는 국가는 눌러서 바로 확인할 수 있어요.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:flex-wrap">
        {byRegion.map((group) => (
          <div key={group.region} className="flex flex-col gap-3">
            <h3 className="text-title-md text-ink">{group.region}</h3>
            <div className="flex flex-wrap gap-2">
              {group.countries.map((c) =>
                countriesWithDestinations.has(c.country) ? (
                  <Link
                    key={c.country}
                    href={`/?q=${encodeURIComponent(c.country)}`}
                    className="text-caption bg-brand-coral-soft text-ink rounded-full px-4 py-2 hover:opacity-80"
                  >
                    {c.country}
                  </Link>
                ) : (
                  <span
                    key={c.country}
                    aria-disabled="true"
                    className="text-caption bg-surface-soft text-muted-soft cursor-default rounded-full px-4 py-2"
                  >
                    {c.country}
                  </span>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
