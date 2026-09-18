import Link from "next/link";
import { destinations } from "@/data/destinations";

export const MEMORABLE_CTA_SECTION_ID = "memorable-cta";

// 우선 순위대로 4개를 채운다 — 앞쪽 id가 destinations.ts에서 더 이상 찾을 수 없으면
// (개편/삭제로 비공개 처리된 경우) 자동으로 건너뛰고 다음 후보로 대체한다.
const PREFERRED_DESTINATION_IDS = [
  "intl-santorini",
  "intl-queenstown",
  "dom-jeju",
  "intl-paris",
  "intl-kyoto",
  "dom-gyeongju",
  "intl-prague",
];

/**
 * SCR-002 Section 7 — 기억에 남는 여행지(카드 4개) + CTA Banner.
 * `src/data/destinations.ts`를 교차 참조한다(PAGE-SCR002 Functional AC).
 */
export function MemorableCta() {
  const cards = PREFERRED_DESTINATION_IDS.map((id) => destinations.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => d !== undefined)
    .slice(0, 4);

  return (
    <section
      id={MEMORABLE_CTA_SECTION_ID}
      className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-16 scroll-mt-20 lg:px-10 lg:py-20"
    >
      <div>
        <h2 className="text-display-md text-ink">기억에 남는 여행지</h2>
        <p className="text-body-md text-body mt-1">지금까지의 여행 중 가장 오래 기억에 남는 곳들이에요.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        {cards.map((d) => (
          <Link
            key={d.id}
            href={`/?destination=${d.id}`}
            className="shadow-card group flex flex-col overflow-hidden rounded-md text-left"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-strong">
              {/* eslint-disable-next-line @next/next/no-img-element -- 외부 URL 이미지, next/image 도메인 등록 없이도 항상 렌더되도록 유지 */}
              <img
                src={d.image.url}
                alt={d.image.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-1 p-4">
              <p className="text-title-md text-ink">{d.city}</p>
              <p className="text-body-sm text-body">{d.country}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="shadow-card flex flex-col items-center gap-4 rounded-md p-8 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <p className="text-title-md text-ink">여행을 떠날 준비가 되셨나요?</p>
          <p className="text-body-sm text-body mt-1">항공·숙소 조건을 정리하거나, 함께할 동행을 찾아보세요.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/travel-tools"
            className="text-button inline-flex h-11 items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active"
          >
            여행 조건 정리하기
          </Link>
          <Link
            href="/mates"
            className="text-button border-hairline inline-flex h-11 items-center rounded-sm border px-5 text-ink hover:bg-surface-soft"
          >
            동행 찾기
          </Link>
        </div>
      </div>
    </section>
  );
}
