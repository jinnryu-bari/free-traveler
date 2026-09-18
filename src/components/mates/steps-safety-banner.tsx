import Link from "next/link";

const STEPS = [
  { step: "①", title: "조건에 맞는 글 찾기", body: "국가·지역·기간·모집 상태로 필터링해 원하는 동행글을 찾습니다." },
  { step: "②", title: "참가 메시지 보내기", body: "간단한 소개와 함께 비공개 참가 메시지를 작성자에게 보냅니다." },
  { step: "③", title: "작성자 승인 기다리기", body: "작성자가 메시지를 확인하고 승인하면 동행이 시작됩니다." },
];

/**
 * SCR-004 Section 5·6 — 신청 방법 3단계 + 안전 안내 Banner.
 */
export function StepsSafetyBanner() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-10 lg:py-20">
      <div>
        <h2 className="text-display-md text-ink">동행 신청은 이렇게 진행돼요</h2>
        <p className="text-body-md text-body mt-1">신청부터 승인까지 3단계로 이뤄집니다.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {STEPS.map((item) => (
          <div key={item.step} className="shadow-card flex flex-col gap-2 rounded-md p-5">
            <p className="text-display-md text-brand-coral">{item.step}</p>
            <p className="text-title-md text-ink">{item.title}</p>
            <p className="text-body-sm text-body">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="border-hairline mt-6 flex flex-col gap-3 rounded-md border p-5 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-body-md text-ink">
          <strong>안전한 만남을 위해:</strong> 연락처·SNS 아이디 등 개인 정보는 이 화면 어디에도
          공개로 남기지 마세요. 불편한 상대는 언제든 신고하거나 차단할 수 있습니다.
        </p>
        <Link
          href="/travel-tools?tab=mate"
          className="text-button border-hairline inline-flex h-11 w-fit shrink-0 items-center rounded-sm border px-5 text-ink hover:bg-surface-soft"
        >
          동행글 작성하기
        </Link>
      </div>
    </section>
  );
}
