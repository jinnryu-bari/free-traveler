import { buildMetadata } from "@/lib/seo";
import { getExternalLinks } from "@/lib/supabase/queries";
import { IntroTabs } from "@/components/travel-tools/intro-tabs";
import { FlightForm } from "@/components/travel-tools/flight-form";
import { HotelForm } from "@/components/travel-tools/hotel-form";
import { MateComposerForm } from "@/components/travel-tools/mate-composer-form";
import { NontransmitTips } from "@/components/travel-tools/nontransmit-tips";

export const metadata = buildMetadata({
  title: "여행 조건 정리하기",
  description: "항공·숙소 조건을 정리해 외부 사이트로 이동하고, 동행을 구해보세요.",
  path: "/travel-tools",
});

/**
 * SCR-003 `/travel-tools` Page Owner — Section 순서(design-reference/D-001/DESIGN.md §18):
 * Intro+Tabs -> 탭별 Form(항공/숙소/동행 구하기, 탭 전환해도 상태 유지) -> 비전달 고지+Tip.
 * `external_links`는 여기서만 서버 조회해 Client Component(FlightForm/HotelForm)로
 * props로 내려준다 — 그 Component들은 DB에 직접 접근하지 않는다.
 */
export default async function TravelTools() {
  let flightUrl: string | null = null;
  let hotelUrl: string | null = null;
  try {
    const links = await getExternalLinks();
    flightUrl = links.flight_search_base_url;
    hotelUrl = links.hotel_search_base_url;
  } catch {
    // 조회 실패는 "링크 미설정"과 동일하게 취급한다 — FlightForm/HotelForm이
    // 각자 "다시 시도" 버튼(router.refresh())으로 재조회를 유도한다.
  }

  return (
    <>
      <IntroTabs />

      <div className="mx-auto max-w-[1240px] px-5 pb-4 lg:px-10">
        <FlightForm flightUrl={flightUrl} />
        <HotelForm hotelUrl={hotelUrl} />
        <MateComposerForm />
      </div>

      <NontransmitTips />
    </>
  );
}
