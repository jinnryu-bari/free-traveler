import { buildMetadata } from "@/lib/seo";
import { IntroCta } from "@/components/mates/intro-cta";
import { FilterSummary } from "@/components/mates/filter-summary";
import { ListGrid } from "@/components/mates/list-grid";
import { DetailPanel } from "@/components/mates/detail-panel";
import { StepsSafetyBanner } from "@/components/mates/steps-safety-banner";

export const metadata = buildMetadata({
  title: "동행 구하기",
  description: "국가·지역·기간·모집 상태로 동행글을 찾아보고 참가를 신청해보세요.",
  path: "/mates",
});

/**
 * SCR-004 `/mates` Page Owner — Section 순서(design-reference/D-001/DESIGN.md §18):
 * Intro+작성 CTA -> Filter·결과 요약 -> 목록+상세(Desktop Split/Mobile Drawer) ->
 * 신청 방법 3단계 -> 안전·신고·차단 안내+CTA. 목록·상세는 `?post=<id>` URL 쿼리로 선택
 * 상태를 공유한다(`C-SCR004-LIST-GRID`/`C-SCR004-DETAIL-PANEL`, W09).
 *
 * 알려진 제한: `ListGrid`가 자신의 `<section>` 안에서 이미 40% 폭 컬럼을 감싸고 있어(W09),
 * 여기서 그 위에 다시 flex 행으로 감싸면 좌우 padding이 한 번 더 겹친다(기능은 정상, Desktop
 * 시각적으로 살짝 더 들여써짐) — 사소한 시각 다듬기이며 `MANUAL-RESPONSIVE-VISUAL`(W14)에서
 * 정리할 항목으로 남긴다. `ListGrid`/`DetailPanel` 자체는 다른 완료 Task 소유 파일이라
 * 이 Task 범위에서 수정하지 않는다.
 */
export default function Mates() {
  return (
    <>
      <IntroCta />
      <FilterSummary />

      <section className="mx-auto max-w-[1240px] px-5 pb-10 lg:flex lg:items-start lg:gap-6 lg:px-10">
        <ListGrid />
        <DetailPanel />
      </section>

      <StepsSafetyBanner />
    </>
  );
}
