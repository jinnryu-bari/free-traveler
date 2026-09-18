import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { AuthGuest } from "@/components/account/auth-guest";
import { ProfileForm } from "@/components/account/profile-form";
import { MyActivity } from "@/components/account/my-activity";
import { AdminReports } from "@/components/account/admin-reports";
import { AdminExternalLinks } from "@/components/account/admin-external-links";

export const metadata = buildMetadata({
  title: "계정",
  description: "로그인, 프로필, 내 활동, 관리자 기능을 한 곳에서 관리하세요.",
  path: "/account",
});

/**
 * SCR-005 `/account` Page Owner — Section 순서(design-reference/D-001/DESIGN.md §18):
 * Guest: Intro -> 로그인/가입/재설정 카드(`AuthGuest`).
 * Member: Intro -> (moderator/admin만) 탭("내 계정"/"관리") -> 프로필+내 활동(`ProfileForm`,
 * `MyActivity`) / 관리(`AdminReports`, `AdminExternalLinks`).
 * 역할 판정은 서버에서 세션+`profiles.role`을 다시 읽어 결정한다 — 클라이언트가 보여주는 role을
 * 신뢰하지 않는다(`C-SCR005-ROLE-GATE`와 별개의 서버측 재검증, Security AC).
 */
export default async function Account({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 py-16 lg:px-10 lg:py-20">
        <h1 className="text-display-lg text-ink">계정</h1>
        <p className="text-body-md text-body mt-2">
          로그인하면 프로필을 관리하고, 내가 쓴 동행글과 신청 현황을 확인할 수
          있습니다.
        </p>
        <div className="mt-8">
          <AuthGuest />
        </div>
      </div>
    );
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = (profileRow?.role as string | undefined) ?? "member";
  const isAdminArea = role === "moderator" || role === "admin";
  const activeTab = isAdminArea && tab === "admin" ? "admin" : "account";

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-16 lg:px-10 lg:py-20">
      <h1 className="text-display-lg text-ink">계정</h1>
      <p className="text-body-md text-body mt-2">
        프로필과 내 활동을 관리하세요.
      </p>

      {isAdminArea && (
        <div className="border-hairline mt-6 flex gap-1 overflow-x-auto border-b">
          <Link
            href="/account"
            className={`text-button shrink-0 border-b-2 px-4 py-3 ${activeTab === "account" ? "border-brand-coral text-ink" : "border-transparent text-body"}`}
          >
            내 계정
          </Link>
          <Link
            href="/account?tab=admin"
            className={`text-button shrink-0 border-b-2 px-4 py-3 ${activeTab === "admin" ? "border-brand-coral text-ink" : "border-transparent text-body"}`}
          >
            관리
          </Link>
        </div>
      )}

      <div className="mt-8">
        {activeTab === "account" && (
          <div className="flex flex-col gap-10">
            <ProfileForm />
            <MyActivity />
          </div>
        )}

        {activeTab === "admin" && (
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-title-md text-ink">관리</p>
              <p className="text-body-sm text-body mt-1">
                신고 처리와 외부 이동 URL을 관리합니다.
              </p>
            </div>
            <AdminReports />
            <AdminExternalLinks />
          </div>
        )}
      </div>
    </div>
  );
}
