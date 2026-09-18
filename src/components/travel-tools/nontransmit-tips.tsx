const TIPS = [
  {
    title: "예약·결제는 항상 이동한 사이트에서",
    body: "이 화면은 조건을 정리해 외부 사이트로 안내만 합니다. 실제 예약·결제는 이동한 사이트에서 직접 진행하세요.",
  },
  {
    title: "가격은 이동 후 다시 확인하세요",
    body: "환율·프로모션 등으로 가격이 실시간으로 바뀔 수 있어, 이동한 사이트에서 최종 가격을 다시 확인하는 것이 안전합니다.",
  },
  {
    title: "여러 사이트를 비교해보세요",
    body: "항공/숙소 모두 사이트마다 가격·조건이 다를 수 있어, 조건을 한 번 정리해두면 다른 사이트에서도 같은 조건으로 빠르게 비교할 수 있습니다.",
  },
];

/**
 * SCR-003 Section 5 — 비전달 고지 + 찾기 Tip 3개.
 */
export function NontransmitTips() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-10 lg:py-20">
      <div className="border-hairline rounded-md border p-5">
        <p className="text-body-md text-ink">
          <strong>입력값은 외부 사이트로 전달되지 않습니다.</strong> 국가·지역·날짜 등 조건은 이
          화면 안에서만 정리되며, 외부 사이트로 이동할 때 함께 전달되지 않습니다.
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-display-md text-ink">여행 준비 Tip</h2>
        <p className="text-body-md text-body mt-1">외부 사이트로 이동하기 전에 참고하세요.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {TIPS.map((tip) => (
          <div key={tip.title} className="shadow-card flex flex-col gap-2 rounded-md p-5">
            <p className="text-title-md text-ink">{tip.title}</p>
            <p className="text-body-sm text-body">{tip.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
