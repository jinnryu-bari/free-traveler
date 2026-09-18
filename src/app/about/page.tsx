import { buildMetadata } from "@/lib/seo";
import { ProfileHero } from "@/components/about/profile-hero";
import { IntroPhilosophy } from "@/components/about/intro-philosophy";
import { Timeline } from "@/components/about/timeline";
import { CountryChips } from "@/components/about/country-chips";
import { Gallery } from "@/components/about/gallery";
import { MemorableCta } from "@/components/about/memorable-cta";
import { ContactLinks } from "@/components/about/contact-links";

export const metadata = buildMetadata({
  title: "대표 소개",
  description:
    "free_traveler를 만든 이야기와 여행 철학, 지금까지의 여행 기록을 소개합니다.",
  path: "/about",
});

/**
 * SCR-002 `/about` Page Owner — Section 순서(design-reference/D-001/DESIGN.md §18):
 * Profile Hero+지표 -> 소개/철학 -> Timeline -> 방문 국가 -> Gallery -> 기억에 남는
 * 여행지+CTA -> 문의 링크. 이 파일은 하위 Component를 조립만 한다.
 */
export default function About() {
  return (
    <>
      <ProfileHero />
      <IntroPhilosophy />
      <Timeline />
      <CountryChips />
      <Gallery />
      <MemorableCta />
      <ContactLinks />
    </>
  );
}
