export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[840px] px-5 py-12 lg:py-16">
      <h1 className="text-display-lg text-ink">개인정보 처리방침</h1>
      <p className="text-body-md text-body mt-4">
        free_traveler(이하 &ldquo;서비스&rdquo;)는 이용자의 개인정보를 소중히
        다루며, 다음과 같은 기준으로 최소한의 정보만 수집·이용합니다.
      </p>

      <section className="mt-10">
        <h2 className="text-title-md text-ink">
          제1조 (수집하는 개인정보 항목)
        </h2>
        <ul className="text-body-md text-body mt-3 flex flex-col gap-2">
          <li>
            회원가입·로그인: 이메일 주소, 인증 식별자 (Supabase Auth를 통해
            처리)
          </li>
          <li>동행 모집·신청: 작성한 모집글 내용, 참가 신청 메시지</li>
          <li>신고·차단: 신고 사유, 신고·차단 대상 회원 식별자</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">제2조 (수집하지 않는 정보)</h2>
        <p className="text-body-md text-body mt-3">
          여행 도구(항공·숙소 조건 정리) 화면에서 입력한 출발/도착 국가·지역,
          여행 날짜 등의 검색 조건은 서비스의 서버·데이터베이스로 전송되거나
          저장되지 않으며, 로그·분석 도구로도 수집되지 않습니다. 해당 입력값은
          브라우저의 일시적인 화면 상태로만 사용되고, 외부 항공/숙소 사이트로
          이동하는 순간 해당 사이트의 정책을 따릅니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">제3조 (이용 목적)</h2>
        <p className="text-body-md text-body mt-3">
          수집한 정보는 회원 인증, 동행 모집글·참가 신청 처리, 신고·차단 기능
          운영, 서비스 품질 개선 목적으로만 이용되며, 목적 외 용도로 제3자에게
          제공하지 않습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">제4조 (보관 및 파기)</h2>
        <p className="text-body-md text-body mt-3">
          개인정보는 회원 탈퇴 또는 수집 목적 달성 시 지체 없이 파기합니다. 관련
          법령에 따라 보관이 필요한 경우 해당 기간 동안만 별도 보관합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">제5조 (이용자의 권리)</h2>
        <p className="text-body-md text-body mt-3">
          회원은 언제든지 자신의 개인정보 열람·수정·삭제를 요청할 수 있으며,
          계정 화면에서 직접 관리하거나 서비스에 문의할 수 있습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-title-md text-ink">제6조 (처리방침의 변경)</h2>
        <p className="text-body-md text-body mt-3">
          본 처리방침이 개정되는 경우 시행일과 변경 사항을 서비스 내에
          공지합니다.
        </p>
      </section>

      <p className="text-body-sm text-muted mt-10">시행일: 2026년 1월 1일</p>
    </main>
  );
}
