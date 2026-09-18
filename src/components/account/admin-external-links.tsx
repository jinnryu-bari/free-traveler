"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAccountRole } from "./role-gate";

type LinkKey = "flight_search_base_url" | "hotel_search_base_url";

const LINK_LABEL: Record<LinkKey, string> = {
  flight_search_base_url: "항공 검색 URL",
  hotel_search_base_url: "숙소 검색 URL",
};

function LinkField({
  linkKey,
  initialUrl,
}: {
  linkKey: LinkKey;
  initialUrl: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/external-links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: linkKey, url }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setMessage({ type: "error", text: body?.error ?? "저장하지 못했다" });
      return;
    }
    setMessage({ type: "success", text: "저장했다" });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label
        htmlFor={`admin-link-${linkKey}`}
        className="text-body-sm text-ink"
      >
        {LINK_LABEL[linkKey]}
      </label>
      <div className="flex flex-col gap-2 lg:flex-row">
        <input
          id={`admin-link-${linkKey}`}
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.google.com/travel/..."
          className="border-hairline text-body-sm flex-1 rounded-sm border px-3 py-2 text-ink"
        />
        <button
          type="submit"
          disabled={saving}
          className="text-button inline-flex h-10 shrink-0 items-center justify-center rounded-sm bg-brand-coral px-4 text-on-brand hover:bg-brand-coral-active disabled:opacity-50"
        >
          {saving ? "저장하는 중..." : "저장"}
        </button>
      </div>
      {message && (
        <p
          className={`text-caption ${message.type === "success" ? "text-info" : "text-danger"}`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}

/**
 * SCR-005 Admin — 항공/숙소 외부 URL 설정(REQ-FUNC-077). `external_links`는 RLS로 공개 조회라
 * 이 Component가 직접 브라우저 Supabase 클라이언트로 현재 값을 읽고, 저장은
 * `/api/admin/external-links`(API-ADMIN-EXTERNAL-LINKS, HTTPS+허용목록+admin role 서버 검증)로 보낸다.
 * moderator/admin이 아니면 아무것도 렌더링하지 않는다(자체 방어선, Security AC).
 */
export function AdminExternalLinks() {
  const { role, loading: roleLoading } = useAccountRole();
  const [links, setLinks] = useState<Record<LinkKey, string> | null>(null);
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    const supabase = createClient();
    supabase
      .from("external_links")
      .select("key, url")
      .then(({ data }) => {
        if (!active) return;
        const rows = (data as { key: LinkKey; url: string }[] | null) ?? [];
        setLinks({
          flight_search_base_url:
            rows.find((r) => r.key === "flight_search_base_url")?.url ?? "",
          hotel_search_base_url:
            rows.find((r) => r.key === "hotel_search_base_url")?.url ?? "",
        });
      });
    return () => {
      active = false;
    };
  }, [isAdmin]);

  if (roleLoading) {
    return <div className="h-32 animate-pulse rounded-md bg-surface-strong" />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-title-md text-ink">외부 URL 설정</p>
        <p className="text-body-sm text-body">
          항공·숙소 이동 링크는 허용된 사이트의 HTTPS 주소만 저장할 수 있습니다.
        </p>
      </div>
      {links === null && (
        <div className="h-32 animate-pulse rounded-md bg-surface-strong" />
      )}
      {links !== null && (
        <div className="flex flex-col gap-5">
          <LinkField
            linkKey="flight_search_base_url"
            initialUrl={links.flight_search_base_url}
          />
          <LinkField
            linkKey="hotel_search_base_url"
            initialUrl={links.hotel_search_base_url}
          />
        </div>
      )}
    </div>
  );
}
