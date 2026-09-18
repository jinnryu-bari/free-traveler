"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { destinations } from "@/data/destinations";
import {
  validateDateRange,
  isDateRangeValid,
} from "@/lib/validation/travel-dates";
import { currentTab } from "./intro-tabs";

const ALLOWED_HOST = "www.google.com";
// 관리자가 아직 링크를 설정하지 않았을 때 쓰는 안전한 기본 URL(허용 호스트에 포함).
const DEFAULT_HOTEL_URL = "https://www.google.com/travel/hotels";

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "ko"));
}

function isAllowedExternalUrl(url: string): boolean {
  try {
    return new URL(url).hostname === ALLOWED_HOST;
  } catch {
    return false;
  }
}

function HotelFormPanel({ hotelUrl }: { hotelUrl: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isActive =
    currentTab(new URLSearchParams(searchParams.toString())) === "hotel";

  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [touched, setTouched] = useState(false);

  const countries = useMemo(
    () => uniqueSorted(destinations.map((d) => d.country)),
    [],
  );
  const regions = useMemo(
    () =>
      uniqueSorted(
        destinations.filter((d) => d.country === country).map((d) => d.city),
      ),
    [country],
  );

  const dateErrors = validateDateRange(checkIn, checkOut, {
    strictAfter: true,
    startLabel: "체크인",
    endLabel: "체크아웃",
  });
  const hasRequired = Boolean(country && region && checkIn && checkOut);
  const isValid = hasRequired && isDateRangeValid(dateErrors);

  const resolvedUrl = !hotelUrl
    ? DEFAULT_HOTEL_URL
    : isAllowedExternalUrl(hotelUrl)
      ? hotelUrl
      : null;
  const misconfigured = Boolean(hotelUrl) && resolvedUrl === null;

  const handleCountryChange = (value: string) => {
    setTouched(true);
    setCountry(value);
    setRegion("");
  };

  const retryLink = () => {
    router.refresh();
  };

  return (
    <div id="hotel-form-panel" className={isActive ? "" : "hidden"}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="hotel-country" className="text-body-sm text-ink">
            숙소 국가
          </label>
          <select
            id="hotel-country"
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
          >
            <option value="">선택하세요</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {touched && !country && (
            <p className="text-caption text-danger">숙소 국가를 선택하세요</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="hotel-region" className="text-body-sm text-ink">
            숙소 지역
          </label>
          <select
            id="hotel-region"
            value={region}
            onChange={(e) => {
              setTouched(true);
              setRegion(e.target.value);
            }}
            disabled={!country}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink disabled:opacity-50"
          >
            <option value="">선택하세요</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {touched && country && !region && (
            <p className="text-caption text-danger">숙소 지역을 선택하세요</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="hotel-checkin" className="text-body-sm text-ink">
            체크인
          </label>
          <input
            id="hotel-checkin"
            type="date"
            value={checkIn}
            onChange={(e) => {
              setTouched(true);
              setCheckIn(e.target.value);
            }}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
          />
          {touched && dateErrors.start && (
            <p className="text-caption text-danger">{dateErrors.start}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="hotel-checkout" className="text-body-sm text-ink">
            체크아웃
          </label>
          <input
            id="hotel-checkout"
            type="date"
            value={checkOut}
            onChange={(e) => {
              setTouched(true);
              setCheckOut(e.target.value);
            }}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
          />
          {touched && dateErrors.end && (
            <p className="text-caption text-danger">{dateErrors.end}</p>
          )}
        </div>
      </div>

      {isValid && (
        <div className="shadow-card mt-6 flex flex-col gap-3 rounded-md p-5">
          <p className="text-title-md text-ink">입력 요약</p>
          <p className="text-body-sm text-body">
            {country} {region} · {checkIn} ~ {checkOut}
          </p>
          {misconfigured && (
            <p className="text-caption text-danger">
              설정된 링크가 허용된 사이트 목록에 없습니다.
            </p>
          )}
          <div className="flex gap-3">
            {resolvedUrl && (
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-button inline-flex h-11 w-fit items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active"
              >
                숙소 보러 가기
              </a>
            )}
            {misconfigured && (
              <button
                type="button"
                onClick={retryLink}
                className="text-button border-hairline inline-flex h-11 w-fit items-center rounded-sm border px-5 text-ink hover:bg-surface-soft"
              >
                다시 시도
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * SCR-003 Section 3(숙소 탭) — 숙소 조건 입력·요약·외부 이동.
 * `hotelUrl`은 Page Owner가 `external_links` 테이블에서 서버에서 읽어 내려준다.
 * 입력값은 local state에만 있고, 서버·URL 쿼리·로그로 전송되지 않는다.
 */
export function HotelForm({ hotelUrl }: { hotelUrl: string | null }) {
  return (
    <Suspense
      fallback={
        <div className="h-64 animate-pulse rounded-md bg-surface-strong" />
      }
    >
      <HotelFormPanel hotelUrl={hotelUrl} />
    </Suspense>
  );
}
