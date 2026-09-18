"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { destinations, type Destination } from "@/data/destinations";
import { countrySafetyInfo } from "@/data/safety";

const DESTINATION_PARAM = "destination";
const SAFETY_PARAM = "safety";
const FAVORITES_KEY = "ft-favorite-destinations";

function readFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]) {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // localStorage를 사용할 수 없는 환경(사생활 보호 모드 등)에서는 조용히 무시한다.
  }
}

function relatedDestinations(current: Destination): Destination[] {
  return destinations
    .filter(
      (d) =>
        d.id !== current.id &&
        (d.country === current.country ||
          d.themes.some((t) => current.themes.includes(t))),
    )
    .slice(0, 6);
}

function DestinationDetailDrawerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get(DESTINATION_PARAM);
  const destination = id ? destinations.find((d) => d.id === id) : undefined;

  const [favorites, setFavorites] = useState<string[]>([]);
  const [shareFeedback, setShareFeedback] = useState("");

  useEffect(() => {
    // localStorage는 서버에 없으므로 마운트 후 한 번만 읽는다(hydration mismatch 방지).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(readFavorites());
  }, []);

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(DESTINATION_PARAM);
    router.replace(params.toString() ? `/?${params.toString()}` : "/", {
      scroll: false,
    });
  };

  const openRelated = (relatedId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(DESTINATION_PARAM, relatedId);
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  const openSafetyPanel = (country: string) => {
    const safety = countrySafetyInfo.find((s) => s.country === country);
    if (!safety) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete(DESTINATION_PARAM);
    params.set(SAFETY_PARAM, safety.id);
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!destination) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close()는 searchParams만 참조
  }, [destination]);

  if (!destination) return null;

  const isFavorite = favorites.includes(destination.id);
  const toggleFavorite = () => {
    const next = isFavorite
      ? favorites.filter((favId) => favId !== destination.id)
      : [...favorites, destination.id];
    setFavorites(next);
    writeFavorites(next);
  };

  const shareUrl = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: destination.city, url });
        return;
      } catch {
        // 사용자가 공유를 취소한 경우 등 — 아래 클립보드 폴백으로 넘어가지 않는다.
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback("링크를 복사했어요");
    } catch {
      setShareFeedback("링크 복사에 실패했어요");
    }
    window.setTimeout(() => setShareFeedback(""), 2500);
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="닫기"
        onClick={close}
        className="bg-scrim absolute inset-0"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${destination.city} 상세정보`}
        className="shadow-overlay fixed inset-x-0 bottom-0 top-[20%] z-10 flex flex-col overflow-y-auto rounded-t-lg bg-canvas p-6 lg:inset-y-0 lg:left-auto lg:right-0 lg:top-0 lg:h-full lg:w-[520px] lg:rounded-none lg:rounded-l-lg"
      >
        <div
          aria-hidden
          className="mx-auto mb-2 h-1 w-10 rounded-full bg-hairline lg:hidden"
        />

        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-display-md text-ink">{destination.city}</h2>
            <p className="text-caption text-muted">{destination.country}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFavorite}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
              className={`rounded-sm p-2 ${isFavorite ? "text-brand-coral" : "text-muted hover:text-ink"}`}
            >
              <svg
                viewBox="0 0 20 20"
                width={20}
                height={20}
                fill={isFavorite ? "currentColor" : "none"}
                aria-hidden
              >
                <path
                  d="M10 17s-6.5-4-6.5-9A3.5 3.5 0 0110 5.5 3.5 3.5 0 0116.5 8c0 5-6.5 9-6.5 9z"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              className="p-2 text-muted hover:text-ink"
            >
              <svg
                viewBox="0 0 20 20"
                width={20}
                height={20}
                fill="none"
                aria-hidden
              >
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-body-md text-body mt-4">{destination.summary}</p>

        <section className="mt-4">
          <h3 className="text-title-sm text-ink">명소</h3>
          <ul className="text-body-sm text-body mt-2 flex flex-col gap-1">
            {destination.attractions.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-4">
          <h3 className="text-title-sm text-ink">추천 시기</h3>
          <p className="text-body-sm text-body mt-1">
            {destination.bestTimeToVisit}
          </p>
        </section>

        <section className="mt-4">
          <h3 className="text-title-sm text-ink">1일 일정</h3>
          <ul className="text-body-sm text-body mt-2 flex flex-col gap-1">
            {destination.itineraryOneDay.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-4">
          <h3 className="text-title-sm text-ink">3일 일정</h3>
          <ul className="text-body-sm text-body mt-2 flex flex-col gap-1">
            {destination.itineraryThreeDay.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-title-sm text-ink">예산</h3>
            <p className="text-body-sm text-body mt-1">{destination.budget}</p>
          </div>
          <div>
            <h3 className="text-title-sm text-ink">교통</h3>
            <p className="text-body-sm text-body mt-1">
              {destination.transport}
            </p>
          </div>
        </section>

        <section className="mt-4">
          <h3 className="text-title-sm text-ink">음식</h3>
          <p className="text-body-sm text-body mt-1">
            {destination.food.join(", ")}
          </p>
        </section>

        <section className="mt-4">
          <h3 className="text-title-sm text-ink">에티켓</h3>
          <p className="text-body-sm text-body mt-1">{destination.etiquette}</p>
        </section>

        <button
          type="button"
          onClick={() => openSafetyPanel(destination.country)}
          className="text-link border-hairline mt-5 inline-flex w-fit items-center gap-1 rounded-sm border px-3 py-2 text-ink"
        >
          {destination.country} 안전정보 보기
        </button>

        {relatedDestinations(destination).length > 0 ? (
          <section className="mt-6">
            <h3 className="text-title-sm text-ink">관련 여행지</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {relatedDestinations(destination).map((related) => (
                <button
                  key={related.id}
                  type="button"
                  onClick={() => openRelated(related.id)}
                  className="text-caption bg-surface-soft rounded-sm px-3 py-2 text-ink hover:bg-surface-strong"
                >
                  {related.city}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <p className="text-caption text-muted mt-6">
          출처: {destination.source} · 수정일: {destination.updatedAt}
        </p>

        <button
          type="button"
          onClick={shareUrl}
          className="text-button mt-4 inline-flex w-fit items-center gap-2 rounded-sm bg-brand-coral px-4 py-2 text-on-brand hover:bg-brand-coral-active"
        >
          공유하기
        </button>
        {shareFeedback ? (
          <p role="status" className="text-caption text-muted mt-2">
            {shareFeedback}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * SCR-001 Section 2·3의 여행지 상세 Drawer. `?destination=<id>` URL query가
 * 있을 때만 렌더링되며, `C-SCR001-DEST-GRIDS`의 카드 클릭이 이 query를 설정한다.
 */
export function DestinationDetailDrawer() {
  return (
    <Suspense fallback={null}>
      <DestinationDetailDrawerContent />
    </Suspense>
  );
}
