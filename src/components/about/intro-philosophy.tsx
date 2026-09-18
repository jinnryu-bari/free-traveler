import { aboutData } from "@/data/about";

export const INTRO_PHILOSOPHY_SECTION_ID = "intro-philosophy";

function sectionAnchorId(index: number): string {
  return `${INTRO_PHILOSOPHY_SECTION_ID}-${index}`;
}

/**
 * SCR-002 Section 2 — 소개·철학 Split(자기소개/여행을 시작한 이유/여행 철학).
 * Desktop은 좌측 목차 + 우측 본문, Mobile은 세로 스택. 목차는 각 소제목의 앵커로
 * 이동하는 정적 링크로 충분해 별도 스크롤 스파이 로직 없이 Server Component로 둔다.
 */
export function IntroPhilosophy() {
  const { philosophySections } = aboutData;

  return (
    <section
      id={INTRO_PHILOSOPHY_SECTION_ID}
      className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-16 scroll-mt-20 lg:flex-row lg:gap-14 lg:px-10 lg:py-20"
    >
      <nav
        aria-label="소개 목차"
        className="flex flex-row gap-4 lg:w-56 lg:shrink-0 lg:flex-col lg:gap-2"
      >
        {philosophySections.map((section, i) => (
          <a
            key={section.heading}
            href={`#${sectionAnchorId(i)}`}
            className="text-body-sm text-body hover:text-ink"
          >
            {section.heading}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-10">
        {philosophySections.map((section, i) => (
          <div
            key={section.heading}
            id={sectionAnchorId(i)}
            className="flex flex-col gap-3 scroll-mt-20"
          >
            <h2 className="text-display-md text-ink">{section.heading}</h2>
            {section.paragraphs.map((paragraph, j) => (
              <p key={j} className="text-body-md text-body">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
