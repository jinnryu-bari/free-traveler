import Link from "next/link";

// SCR-001 `/` 메인 — Section 1(검색 Hero)만 우선 배치한 임시 뼈대.
// 나머지 Section(국내/해외 인기 여행지, 테마, 안전정보, 동행글, 대표 소개 요약)은
// docs/04_UIUX_PLAN.md §5 SCR-001 명세에 따라 후속 작업에서 구현한다.
export default function Home() {
  return (
    <section className="mx-auto flex min-h-[560px] max-w-[1240px] flex-col justify-center gap-6 px-5 py-12 lg:px-10 lg:py-20">
      <h1 className="text-display-xl max-w-xl text-ink">어디로 떠나고 싶으신가요?</h1>
      <p className="text-body-md max-w-md text-body">
        여행지를 발견하고, 항공·숙소 조건을 정리해 외부 사이트로 이동하고, 믿을 수 있는 동행을
        찾아보세요.
      </p>
      <form
        role="search"
        aria-label="여행지 검색"
        className="border-hairline flex h-14 max-w-lg items-center rounded-full border px-5"
      >
        <label htmlFor="destination-search" className="sr-only">
          여행지, 국가, 테마로 검색
        </label>
        <input
          id="destination-search"
          type="search"
          placeholder="여행지, 국가, 테마로 검색"
          className="text-body-md h-full w-full bg-transparent text-ink outline-none placeholder:text-muted-soft"
        />
      </form>
      <Link
        href="/travel-tools"
        className="text-button inline-flex h-12 w-fit items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active"
      >
        여행 조건 정리하기
      </Link>
    </section>
  );
}
