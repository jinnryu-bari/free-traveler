"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";

const MAX_LENGTH = 500;

interface ParticipateRequestFormProps {
  postId: string;
  onSubmitted?: () => void;
}

/**
 * SCR-004 Detail Panel 내부에 임베드되는 참가 요청 Form.
 * 최대 500자 비공개 참가 메시지를 `/api/mates/[id]/requests`(API-MATE-REQUESTS)로 제출한다.
 * 중복 PENDING/ACCEPTED 신청은 서버가 409로 응답하며, 이 화면은 그 오류를 그대로 노출한다.
 */
export function ParticipateRequestForm({ postId, onSubmitted }: ParticipateRequestFormProps) {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting || !message.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/mates/${postId}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        const message = body?.error ?? "참가 신청을 보내지 못했다";
        setError(message);
        showToast("error", message);
        return;
      }
      setSubmitted(true);
      showToast("success", "참가 신청을 보냈다. 작성자 승인을 기다려주세요.");
      onSubmitted?.();
    } catch {
      setError("네트워크 오류로 참가 신청을 보내지 못했다");
      showToast("error", "네트워크 오류로 참가 신청을 보내지 못했다");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="border-hairline rounded-md border p-4">
        <p className="text-body-md text-ink">참가 신청을 보냈습니다. 작성자 승인을 기다려주세요.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="participate-message" className="text-body-sm text-ink">
        참가 메시지 (작성자와 신청자만 볼 수 있습니다)
      </label>
      <textarea
        id="participate-message"
        value={message}
        maxLength={MAX_LENGTH}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
        placeholder="간단한 자기소개와 참가 이유를 적어주세요."
      />
      <p className="text-caption text-body text-right">{message.length}/{MAX_LENGTH}</p>
      {error && <p className="text-caption text-danger">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !message.trim()}
        className="text-button inline-flex h-11 w-fit items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active disabled:opacity-50"
      >
        {submitting ? "보내는 중..." : "참가 신청 보내기"}
      </button>
    </form>
  );
}
