"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { countrySafetyInfo, type SafetyCategories } from "@/data/safety";

const SAFETY_PARAM = "safety";
const CONSULAR_CALL_CENTER = "영사콜센터: +82-2-3210-0404 (해외 무료 접속번호는 재외공관 홈페이지에서 확인)";

const CATEGORY_LABELS: { key: keyof SafetyCategories; label: string }[] = [
  { key: "security", label: "치안" },
  { key: "scam", label: "사기" },
  { key: "law", label: "법규" },
  { key: "transport", label: "교통" },
  { key: "disasterClimate", label: "재난·기후" },
  { key: "health", label: "보건" },
  { key: "cultureDressCode", label: "문화·복장" },
  { key: "emergencyContacts", label: "긴급연락처" },
];

function SafetyDetailDrawerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get(SAFETY_PARAM);
  const info = id ? countrySafetyInfo.find((item) => item.id === id) : undefined;

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(SAFETY_PARAM);
    router.replace(params.toString() ? `/?${params.toString()}` : "/", { scroll: false });
  };

  useEffect(() => {
    if (!info) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close()는 searchParams만 참조, id 변경 시 재바인딩 불필요
  }, [info]);

  if (!info) return null;

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
        aria-label={`${info.country} 안전정보`}
        className="shadow-overlay fixed inset-x-0 bottom-0 top-14 z-10 flex flex-col overflow-y-auto rounded-t-lg bg-canvas p-6 lg:inset-y-0 lg:left-auto lg:right-0 lg:top-0 lg:h-full lg:w-[520px] lg:rounded-none lg:rounded-l-lg"
      >
        <button
          type="button"
          onClick={close}
          aria-label="닫기"
          className="self-end p-2 text-muted hover:text-ink"
        >
          <svg viewBox="0 0 20 20" width={20} height={20} fill="none" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>

        <p className="bg-info-bg text-info text-body-sm mb-4 rounded-sm px-3 py-2">
          이 정보는 참고용이며 공식 판단을 대체할 수 없습니다. 출국 전 외교부 원문에서 최신
          정보를 반드시 재확인하세요.
        </p>

        <h2 className="text-display-md text-ink">{info.country}</h2>
        <p className="text-caption text-muted mt-1">
          {info.scopeType === "country" ? "국가 전역" : info.scopeText} · 최종 확인일{" "}
          {info.lastCheckedAt} · 편집자 {info.editor}
        </p>

        <dl className="mt-5 flex flex-col gap-4">
          {CATEGORY_LABELS.map(({ key, label }) => (
            <div key={key}>
              <dt className="text-title-sm text-ink">{label}</dt>
              <dd className="text-body-sm text-body mt-1">{info.categories[key]}</dd>
            </div>
          ))}
        </dl>

        <p className="text-body-sm text-body mt-4">{CONSULAR_CALL_CENTER}</p>

        <a
          href={info.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link text-ink mt-5 inline-flex w-fit items-center gap-1 underline underline-offset-2"
        >
          {info.sourceName} 원문 보기
        </a>
      </div>
    </div>
  );
}

/**
 * SCR-001 Section 5의 국가별 주의사항 상세 Drawer. `?safety=<id>` URL query가
 * 있을 때만 렌더링되며, `C-SCR001-SAFETY-GRID`의 카드 클릭이 이 query를 설정한다.
 */
export function SafetyDetailDrawer() {
  return (
    <Suspense fallback={null}>
      <SafetyDetailDrawerContent />
    </Suspense>
  );
}
