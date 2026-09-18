"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type AuthState = "loading" | "guest" | "authed";

function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>("loading");

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setState(data.user ? "authed" : "guest");
    });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

/**
 * SCR-004 Section 1 — 동행 찾기 설명 + 글 작성 CTA.
 * 비인증 상태에서는 CTA가 `/account` 로그인 유도로 전환된다(로그인 후 `/travel-tools`에서 작성).
 */
export function IntroCta() {
  const auth = useAuthState();
  const isAuthed = auth === "authed";
  const ctaHref = isAuthed ? "/travel-tools?tab=mate" : "/account";
  const ctaLabel = isAuthed ? "동행글 작성하기" : "로그인하고 동행글 작성하기";

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-12 lg:px-10 lg:py-16">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-display-lg text-ink">
            믿을 수 있는 동행을 찾아보세요
          </h1>
          <p className="text-body-md text-body mt-2">
            같은 여행지, 비슷한 일정의 동행글을 찾아보고 안전한 절차로 참가를
            신청해보세요.
          </p>
        </div>
        <Link
          href={ctaHref}
          className="text-button inline-flex h-11 w-full shrink-0 items-center justify-center rounded-sm bg-brand-coral px-6 text-on-brand hover:bg-brand-coral-active lg:w-fit"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
