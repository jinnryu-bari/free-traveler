const SAFETY_GUIDE_VERSION = "v1.0";
const SAFETY_GUIDE_EFFECTIVE_DATE = "2026년 1월 1일";

export default function SafetyGuidePage() {
  return (
    <main className="mx-auto max-w-[840px] px-5 py-12 lg:py-16">
      <h1 className="text-display-lg text-ink">동행 안전수칙</h1>
      <p className="text-body-md text-body mt-4">
        동행 모집글을 작성하거나 참가를 신청하기 전에 아래 안전수칙을 반드시 확인해 주세요.
        서비스는 동행 상대방의 신원을 검증하지 않으므로, 실제 만남과 여행은 아래 수칙을
        참고해 신중하게 진행해야 합니다.
      </p>

      <section className="mt-10">
        <h2 className="text-title-md text-ink">1. 만나기 전에 확인하세요</h2>
        <p className="text-body-md text-body mt-3">
          실제로 만나기 전에 화상통화 등으로 먼저 대화해 보고, 여행 계획·경험 등 서로의
          정보가 일관되는지 확인하세요. 조금이라도 불편하거나 이상하다고 느껴지면 만남을
          진행하지 마세요.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">2. 첫 만남은 공개된 장소에서</h2>
        <p className="text-body-md text-body mt-3">
          첫 만남은 공항, 역, 카페처럼 사람이 많은 공개된 장소에서 가지세요. 숙소나 인적이 드문
          장소에서의 첫 만남은 피하세요.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">3. 일정을 다른 사람과 공유하세요</h2>
        <p className="text-body-md text-body mt-3">
          동행 만남 일시·장소와 상대방의 서비스 내 프로필 정보를 가족이나 친구에게 미리
          공유해 두세요. 여행 중에도 주기적으로 안부를 알리는 것이 좋습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">4. 금전·개인정보를 요구받으면 즉시 중단하세요</h2>
        <p className="text-body-md text-body mt-3">
          상대방이 송금, 계좌·카드 정보, 숙소·여권 등 민감한 개인정보를 요구하면 만남을
          중단하고 서비스 내 신고 기능으로 신고해 주세요.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">5. 위험을 느끼면 바로 알리고 신고하세요</h2>
        <p className="text-body-md text-body mt-3">
          위협을 느끼는 상황에서는 즉시 그 자리를 벗어나고, 현지 긴급 연락처 또는 가까운
          사람에게 도움을 요청하세요. 이후 서비스 내 신고 기능을 통해 해당 회원을 신고하고
          필요하면 차단해 주세요.
        </p>
      </section>

      <p className="text-body-sm text-muted mt-10">
        본 안전수칙 {SAFETY_GUIDE_VERSION} · 시행일: {SAFETY_GUIDE_EFFECTIVE_DATE}
      </p>
    </main>
  );
}
