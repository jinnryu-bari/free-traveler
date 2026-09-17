"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { countrySafetyInfo, type CountrySafety } from "@/data/safety";

const SAFETY_PARAM = "safety";
const STALE_MS = 7 * 24 * 60 * 60 * 1000;

const ALERT_LABEL: Record<number, string> = {
  0: "안전",
  1: "여행유의",
  2: "여행자제",
  3: "철수권고",
  4: "여행금지",
};

function AlertIcon({ level }: { level: number }) {
  if (level === 0) {
    return (
      <svg viewBox="0 0 16 16" width={14} height={14} fill="none" aria-hidden>
        <path
          d="M3 8.5l3 3 7-7"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" width={14} height={14} fill="none" aria-hidden>
      <path d="M8 1l7 13H1L8 1z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M8 6v4M8 12h.01" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function AlertBadge({ level }: { level: number }) {
  const style = level >= 3 ? "bg-danger-bg text-danger" : level >= 1 ? "bg-warning-bg text-warning" : "bg-surface-strong text-body";
  return (
    <span className={`text-caption inline-flex items-center gap-1 rounded-sm px-2 py-1 ${style}`}>
      <AlertIcon level={level} />
      {ALERT_LABEL[level] ?? "정보 없음"}
    </span>
  );
}

function isStale(lastCheckedAt: string): boolean {
  return Date.now() - new Date(lastCheckedAt).getTime() > STALE_MS;
}

function SafetyCard({ info, onOpen }: { info: CountrySafety; onOpen: (id: string) => void }) {
  const stale = isStale(info.lastCheckedAt);
  return (
    <button
      type="button"
      onClick={() => onOpen(info.id)}
      className="shadow-card border-hairline flex flex-col gap-3 rounded-md border p-5 text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-title-md text-ink">{info.country}</p>
          <p className="text-caption text-muted">
            {info.scopeType === "country" ? "국가 전역" : info.scopeText}
          </p>
        </div>
        <AlertBadge level={info.alertLevel} />
      </div>
      <p className="text-body-sm text-body">최종 확인일: {info.lastCheckedAt}</p>
      {stale ? (
        <p className="text-caption bg-warning-bg text-warning inline-flex items-center gap-1 rounded-sm px-2 py-1">
          <AlertIcon level={1} />
          최종 확인일로부터 7일이 지났어요. 최신 정보를 다시 확인해 주세요.
        </p>
      ) : null}
    </button>
  );
}

function SafetyGridSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const cards = useMemo(() => countrySafetyInfo, []);

  const openDetail = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(SAFETY_PARAM, id);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-display-md text-ink">국가별 주의사항</h2>
        <p className="text-body-md text-body mt-1">
          방문 전 각 국가의 최신 안전정보를 꼭 확인하세요.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {cards.map((info) => (
          <SafetyCard key={info.id} info={info} onOpen={openDetail} />
        ))}
      </div>
    </section>
  );
}

/**
 * SCR-001 Section 5 — 국가별 주의사항 Card Grid.
 * 카드 클릭은 `?safety=<country id>` URL 상태만 설정한다 — 실제 상세는
 * 별도 Task(`C-SCR001-SAFETY-DETAIL-DRAWER`)가 같은 query를 읽어 렌더링한다.
 */
export function SafetyGrid() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-surface-strong" />}>
      <SafetyGridSection />
    </Suspense>
  );
}
