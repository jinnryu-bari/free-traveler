"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export type AccountRole = "guest" | "member" | "moderator" | "admin";

interface AccountRoleState {
  role: AccountRole;
  loading: boolean;
  userId: string | null;
}

/**
 * 현재 세션의 역할을 판정한다. 비로그인 → "guest", 로그인 사용자는 `profiles.role`
 * (member/moderator/admin) 그대로 반환한다. `profiles.role`은 RLS로 누구나 읽을 수 있지만
 * 쓰기는 본인 행만 가능하다(`profiles_update_own`) — 이 화면(`ProfileForm`)은 `role` 컬럼을
 * 절대 갱신 요청에 포함하지 않는다. **알려진 제한**: 그 RLS 정책 자체는 컬럼 단위로
 * `role`을 막지 않아, 사용자가 UI를 우회해 자기 행의 `role`을 직접 바꾸는 것이 DB 레벨에서는
 * 여전히 가능하다 — 이는 `DB-RLS-BASE`(W03) 소관 스키마 변경이 필요해 이번 Wave에서
 * 고치지 않았고, `docs/preview-checks/SCR-005.md`에 보안 참고사항으로 남겼다. 따라서 모든
 * Admin API(`API-ADMIN-REPORTS` 등)는 이 Component가 보여주는 role을 신뢰하지 않고
 * 서버에서 `profiles.role`을 다시 조회해 재검증한다.
 */
export function useAccountRole(): AccountRoleState {
  const [state, setState] = useState<AccountRoleState>({ role: "guest", loading: true, userId: null });

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      if (!data.user) {
        setState({ role: "guest", loading: false, userId: null });
        return;
      }
      const { data: row } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
      if (!active) return;
      const role = (row?.role as AccountRole | undefined) ?? "member";
      setState({ role, loading: false, userId: data.user.id });
    });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

export function UnauthorizedNotice() {
  return (
    <div className="border-hairline mx-auto max-w-[1240px] rounded-md border p-8 text-center">
      <p className="text-title-md text-ink">접근 권한이 없어요</p>
      <p className="text-body-sm text-body mt-1">이 화면은 관리자만 볼 수 있습니다.</p>
      <Link
        href="/"
        className="text-button mt-4 inline-flex h-11 items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active"
      >
        홈으로 이동
      </Link>
    </div>
  );
}

interface RoleGateProps {
  allow: AccountRole[];
  children: ReactNode;
}

/**
 * `allow`에 없는 역할이면 children 대신 "접근 권한이 없어요" 안내를 렌더한다.
 * Admin URL(`/account?tab=admin`)에 직접 접근해도 이 Guard가 렌더 자체를 막는다.
 */
export function RoleGate({ allow, children }: RoleGateProps) {
  const { role, loading } = useAccountRole();

  if (loading) {
    return <div className="h-40 animate-pulse rounded-md bg-surface-strong" />;
  }

  if (!allow.includes(role)) {
    return <UnauthorizedNotice />;
  }

  return <>{children}</>;
}
