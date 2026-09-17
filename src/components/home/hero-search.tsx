"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";

const QUERY_PARAM = "q";

function countMatches(keyword: string): number {
  const needle = keyword.trim().toLowerCase();
  if (!needle) return destinations.length;
  return destinations.filter((destination) => {
    const haystack = [destination.country, destination.city, destination.summary, ...destination.themes]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  }).length;
}

function HeroSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();
  const [keyword, setKeyword] = useState(() => searchParams.get(QUERY_PARAM) ?? "");

  // URL query가 외부에서 바뀌면(뒤로가기 등) 입력값을 다시 동기화한다 — 렌더 중
  // 상태 조정 패턴을 사용해 effect 안에서의 setState 캐스케이드를 피한다.
  const [syncedParamsString, setSyncedParamsString] = useState(paramsString);
  if (paramsString !== syncedParamsString) {
    setSyncedParamsString(paramsString);
    setKeyword(searchParams.get(QUERY_PARAM) ?? "");
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (keyword.trim()) {
        params.set(QUERY_PARAM, keyword.trim());
      } else {
        params.delete(QUERY_PARAM);
      }
      const queryString = params.toString();
      router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
    }, 300);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchParams 자체 변화로 재실행하지 않는다(무한 루프 방지)
  }, [keyword, router]);

  const matchCount = useMemo(() => countMatches(keyword), [keyword]);
  const isEmpty = keyword.trim().length > 0 && matchCount === 0;

  return (
    <div className="flex max-w-lg flex-col gap-2">
      <form
        role="search"
        aria-label="여행지 검색"
        onSubmit={(event) => event.preventDefault()}
        className="border-hairline flex h-14 items-center rounded-full border px-5"
      >
        <label htmlFor="destination-search" className="sr-only">
          여행지, 국가, 테마로 검색
        </label>
        <input
          id="destination-search"
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="여행지, 국가, 테마로 검색"
          className="text-body-md h-full w-full bg-transparent text-ink outline-none placeholder:text-muted-soft"
        />
      </form>
      {isEmpty ? (
        <p className="text-body-sm text-muted" role="status">
          &ldquo;{keyword.trim()}&rdquo;와 일치하는 여행지를 찾지 못했어요.{" "}
          <button
            type="button"
            onClick={() => setKeyword("")}
            className="text-link text-ink underline underline-offset-2"
          >
            검색어 지우기
          </button>
        </p>
      ) : null}
    </div>
  );
}

/**
 * SCR-001 Hero의 검색 입력 부분 — 부분 일치 키워드 검색, 빈 결과 안내,
 * 필터 상태(`?q=`)의 URL 동기화·복원을 담당한다. 여행지 Grid(별도 Task)가
 * 동일한 `q` query를 각자 읽어 카드 목록을 필터링한다.
 */
export function HeroSearch() {
  return (
    <Suspense
      fallback={
        <div className="border-hairline h-14 max-w-lg animate-pulse rounded-full border" />
      }
    >
      <HeroSearchForm />
    </Suspense>
  );
}
