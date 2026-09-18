"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";

interface BlockButtonProps {
  userId: string;
  onBlocked?: () => void;
}

/**
 * SCR-004 Detail Panel — 차단 실행 버튼. `/api/account/blocklist`(API-BLOCKLIST)로 차단을 생성한다.
 * 차단 직후 이 상대의 글은 `/api/mates` GET 조회에서 즉시 제외된다(API-MATES가 이미 처리).
 * 차단 해제는 이 Task 범위가 아니며 SCR-005에서 관리한다(Functional AC).
 */
export function BlockButton({ userId, onBlocked }: BlockButtonProps) {
  const { showToast } = useToast();
  const [blocking, setBlocking] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const handleBlock = async () => {
    if (blocking || blocked) return;
    setBlocking(true);
    try {
      const res = await fetch("/api/account/blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedId: userId }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        showToast("error", body?.error ?? "차단하지 못했다");
        return;
      }
      setBlocked(true);
      showToast("success", "이 작성자를 차단했다. 이후 이 작성자의 글은 목록에 보이지 않는다.");
      onBlocked?.();
    } catch {
      showToast("error", "네트워크 오류로 차단하지 못했다");
    } finally {
      setBlocking(false);
    }
  };

  if (blocked) {
    return <p className="text-body-sm text-body">차단했습니다.</p>;
  }

  return (
    <button
      type="button"
      onClick={handleBlock}
      disabled={blocking}
      className="text-button border-hairline inline-flex h-9 items-center rounded-sm border px-4 text-ink hover:bg-surface-soft disabled:opacity-50"
    >
      {blocking ? "차단하는 중..." : "작성자 차단하기"}
    </button>
  );
}
