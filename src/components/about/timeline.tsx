import { aboutData } from "@/data/about";

export const TIMELINE_SECTION_ID = "timeline";

/**
 * SCR-002 Section 3 — 여행 Timeline. Desktop/Mobile 공통 세로 타임라인(Mobile은
 * 폭만 축소) — 별도 레이아웃 분기 없이 하나의 세로 목록으로 양쪽을 만족한다.
 */
export function Timeline() {
  const { timeline } = aboutData;

  return (
    <section
      id={TIMELINE_SECTION_ID}
      className="mx-auto max-w-[1240px] px-5 py-16 scroll-mt-20 lg:px-10 lg:py-20"
    >
      <div>
        <h2 className="text-display-md text-ink">여행 Timeline</h2>
        <p className="text-body-md text-body mt-1">
          지금까지 다녀온 여행을 연도별로 정리했어요.
        </p>
      </div>

      <ol className="border-hairline mt-8 flex flex-col gap-8 border-l pl-6 lg:max-w-2xl">
        {timeline.map((item) => (
          <li key={item.year} className="relative">
            <span className="bg-brand-coral absolute top-1 -left-[29px] h-3 w-3 rounded-full" />
            <p className="text-title-md text-ink">{item.year}</p>
            <p className="text-body-md text-body mt-1">{item.place}</p>
            <p className="text-body-sm text-muted mt-1">{item.summary}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
