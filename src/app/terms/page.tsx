export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[840px] px-5 py-12 lg:py-16">
      <h1 className="text-display-lg text-ink">이용약관</h1>
      <p className="text-body-md text-body mt-4">
        본 약관은 free_traveler(이하 &ldquo;서비스&rdquo;)가 제공하는 여행지 정보, 항공·숙소 조건
        정리, 동행 모집·신청 기능의 이용과 관련하여 서비스와 회원 간의 권리·의무·책임 사항을
        정합니다.
      </p>

      <section className="mt-10">
        <h2 className="text-title-md text-ink">제1조 (서비스의 성격)</h2>
        <p className="text-body-md text-body mt-3">
          서비스는 여행지·안전정보를 안내하고, 이용자가 입력한 항공·숙소 조건을 바탕으로 외부
          항공/숙소 예약 사이트로 이동을 돕는 정보 중개 역할만 수행합니다. 서비스는 항공권·숙소를
          직접 판매·예약·결제하지 않으며, 이동 후 외부 사이트에서 이루어지는 거래에는 관여하지
          않습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">제2조 (동행 모집·신청)</h2>
        <p className="text-body-md text-body mt-3">
          동행 모집글 작성과 참가 신청은 로그인한 회원만 이용할 수 있습니다. 회원은 실제 여행
          계획을 바탕으로 사실에 맞는 정보만 작성해야 하며, 다른 회원과의 만남·연락은 전적으로
          회원 개인의 책임 하에 이루어집니다. 서비스는 동행 상대방의 신원을 검증하지 않으며,
          동행 과정에서 발생하는 사고·분쟁에 대해 책임지지 않습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">제3조 (금지 행위)</h2>
        <p className="text-body-md text-body mt-3">
          회원은 다음 행위를 해서는 안 됩니다: 허위 동행 모집글 작성, 다른 회원에 대한 괴롭힘·
          혐오 표현, 서비스 내 연락처 노출을 통한 개인 거래 유도, 그 밖에 관련 법령 또는 본
          약관에 위반되는 행위. 이를 위반한 게시물은 신고 접수 후 관리자 검토를 거쳐 삭제되거나
          작성자가 차단될 수 있습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">제4조 (외부 사이트 이동 및 면책)</h2>
        <p className="text-body-md text-body mt-3">
          서비스가 안내하는 항공·숙소 외부 사이트, 안전정보 출처 사이트는 각기 독립적으로
          운영되며, 해당 사이트의 이용약관·개인정보 처리방침이 별도로 적용됩니다. 서비스는 외부
          사이트의 정보 정확성, 가용성, 거래 결과에 대해 책임지지 않습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">제5조 (약관의 변경)</h2>
        <p className="text-body-md text-body mt-3">
          서비스는 필요한 경우 본 약관을 개정할 수 있으며, 개정 시 시행일과 개정 사유를 서비스
          내에 공지합니다. 개정된 약관은 공지된 시행일부터 효력이 발생합니다.
        </p>
      </section>

      <p className="text-body-sm text-muted mt-10">시행일: 2026년 1월 1일</p>
    </main>
  );
}
