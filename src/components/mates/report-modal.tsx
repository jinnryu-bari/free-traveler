"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";

const REASON_OPTIONS = [
  { value: "SPAM", label: "스팸·광고" },
  { value: "SCAM", label: "사기 의심" },
  { value: "INAPPROPRIATE", label: "부적절한 내용" },
  { value: "HARASSMENT", label: "괴롭힘·혐오 표현" },
  { value: "OTHER", label: "기타" },
] as const;

interface ReportModalProps {
  postId: string;
}

/**
 * SCR-004 Detail Panel — 신고 버튼/모달. `/api/mates/[id]/report`(API-MATE-REPORT)로 접수하고
 * 신고 ID·접수 시각을 즉시 보여준다. 신고 내용은 작성자에게 공개되지 않는다(RLS로 서버에서도 강제).
 */
export function ReportModal({ postId }: ReportModalProps) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [reasonCode, setReasonCode] = useState<(typeof REASON_OPTIONS)[number]["value"]>("SPAM");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ reportId: string; createdAt: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting || !description.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/mates/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reasonCode, description: description.trim() }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        const message = body?.error ?? "신고를 접수하지 못했다";
        setError(message);
        showToast("error", message);
        return;
      }
      const body = (await res.json()) as { reportId: string; createdAt: string };
      setReceipt(body);
      showToast("success", "신고를 접수했다");
    } catch {
      setError("네트워크 오류로 신고를 접수하지 못했다");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-button border-hairline inline-flex h-9 items-center rounded-sm border px-4 text-ink hover:bg-surface-soft"
      >
        신고하기
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="닫기" onClick={close} className="bg-scrim absolute inset-0" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="동행글 신고"
            className="shadow-overlay fixed inset-x-4 top-1/2 z-10 max-w-md -translate-y-1/2 rounded-md bg-canvas p-6 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2"
          >
            {receipt ? (
              <div>
                <p className="text-title-md text-ink">신고가 접수됐습니다</p>
                <p className="text-body-sm text-body mt-2">
                  신고 ID: {receipt.reportId}
                  <br />
                  접수 시각: {new Date(receipt.createdAt).toLocaleString("ko-KR")}
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="text-button border-hairline mt-4 inline-flex h-10 items-center rounded-sm border px-4 text-ink hover:bg-surface-soft"
                >
                  닫기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <p className="text-title-md text-ink">동행글 신고</p>
                <div className="flex flex-col gap-1">
                  <label htmlFor="report-reason" className="text-body-sm text-ink">
                    사유
                  </label>
                  <select
                    id="report-reason"
                    value={reasonCode}
                    onChange={(e) => setReasonCode(e.target.value as typeof reasonCode)}
                    className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
                  >
                    {REASON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="report-description" className="text-body-sm text-ink">
                    상세 설명
                  </label>
                  <textarea
                    id="report-description"
                    value={description}
                    maxLength={1000}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
                    placeholder="신고 사유를 간단히 설명해주세요."
                  />
                </div>
                {error && <p className="text-caption text-danger">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={close}
                    className="text-button border-hairline inline-flex h-10 items-center rounded-sm border px-4 text-ink hover:bg-surface-soft"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !description.trim()}
                    className="text-button inline-flex h-10 items-center rounded-sm bg-brand-coral px-4 text-on-brand hover:bg-brand-coral-active disabled:opacity-50"
                  >
                    {submitting ? "접수 중..." : "신고 접수"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
