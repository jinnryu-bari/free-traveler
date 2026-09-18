"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

const AGE_RANGE_OPTIONS = ["10대", "20대", "30대", "40대", "50대 이상"];
const GENDER_OPTIONS = ["", "여성", "남성"];

interface Profile {
  nickname: string;
  age_range: string;
  travel_style: string;
  gender: string | null;
  is_adult: boolean;
  adult_verified_at: string | null;
}

type LoadState = "loading" | "error" | "ready";

/**
 * SCR-005 Member — 프로필 Form + 성인확인 배지(REQ-FUNC-028,029).
 * 성인확인은 체크박스로만 받고 `is_adult`+`adult_verified_at`만 저장한다 — 정확한 생년월일은
 * 절대 입력받거나 저장하지 않는다. 프로필 저장 요청도 nickname/age_range/travel_style/gender
 * 4개 컬럼만 보내고, `role`은 이 Form에서 절대 전송하지 않는다(관리자 권한 자가 승격 방지 —
 * 다만 `profiles_update_own` RLS 정책 자체는 컬럼 단위 제한이 없어 별도 공격 경로가 남아있음을
 * 이번 Wave 보고에 기록한다).
 */
export function ProfileForm() {
  const { showToast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmingAdult, setConfirmingAdult] = useState(false);
  const [adultChecked, setAdultChecked] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      if (!data.user) {
        setLoadState("error");
        return;
      }
      setUserId(data.user.id);
      const { data: row, error } = await supabase
        .from("profiles")
        .select("nickname, age_range, travel_style, gender, is_adult, adult_verified_at")
        .eq("id", data.user.id)
        .single();
      if (!active) return;
      if (error || !row) {
        setLoadState("error");
        return;
      }
      setProfile(row as Profile);
      setLoadState("ready");
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId || !profile || saving) return;
    if (!profile.nickname.trim() || !profile.age_range || !profile.travel_style.trim()) {
      showToast("error", "닉네임·연령대·여행 스타일은 필수다");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        nickname: profile.nickname.trim(),
        age_range: profile.age_range,
        travel_style: profile.travel_style.trim(),
        gender: profile.gender || null,
      })
      .eq("id", userId);
    setSaving(false);
    if (error) {
      showToast("error", "프로필을 저장하지 못했다");
      return;
    }
    showToast("success", "프로필을 저장했다");
  };

  const confirmAdult = async () => {
    if (!userId || confirmingAdult || !adultChecked) return;
    setConfirmingAdult(true);
    const supabase = createClient();
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("profiles")
      .update({ is_adult: true, adult_verified_at: now })
      .eq("id", userId);
    setConfirmingAdult(false);
    if (error) {
      showToast("error", "성인확인을 저장하지 못했다");
      return;
    }
    setProfile((current) => (current ? { ...current, is_adult: true, adult_verified_at: now } : current));
    showToast("success", "성인확인을 완료했다");
  };

  if (loadState === "loading") {
    return <div className="h-64 animate-pulse rounded-md bg-surface-strong" />;
  }

  if (loadState === "error" || !profile) {
    return (
      <div className="border-hairline rounded-md border p-6 text-center">
        <p className="text-body-md text-ink">프로필을 불러오지 못했어요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border-hairline rounded-md border p-5">
        {profile.is_adult ? (
          <p className="text-body-sm text-ink">
            성인 인증 완료 · {profile.adult_verified_at?.slice(0, 10)}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-body-sm text-ink">아직 성인확인을 완료하지 않았습니다.</p>
            <label className="text-body-sm flex items-center gap-2 text-ink">
              <input
                type="checkbox"
                checked={adultChecked}
                onChange={(e) => setAdultChecked(e.target.checked)}
              />
              저는 만 19세 이상입니다.
            </label>
            <button
              type="button"
              onClick={confirmAdult}
              disabled={!adultChecked || confirmingAdult}
              className="text-button inline-flex h-9 w-fit items-center rounded-sm bg-brand-coral px-4 text-on-brand hover:bg-brand-coral-active disabled:opacity-50"
            >
              {confirmingAdult ? "확인하는 중..." : "성인확인 완료"}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="profile-nickname" className="text-body-sm text-ink">
            닉네임
          </label>
          <input
            id="profile-nickname"
            required
            value={profile.nickname}
            onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="profile-age-range" className="text-body-sm text-ink">
            연령대
          </label>
          <select
            id="profile-age-range"
            required
            value={profile.age_range}
            onChange={(e) => setProfile({ ...profile, age_range: e.target.value })}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
          >
            <option value="">선택하세요</option>
            {AGE_RANGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="profile-travel-style" className="text-body-sm text-ink">
            여행 스타일
          </label>
          <input
            id="profile-travel-style"
            required
            value={profile.travel_style}
            onChange={(e) => setProfile({ ...profile, travel_style: e.target.value })}
            placeholder="예: 느긋한 힐링 여행"
            className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="profile-gender" className="text-body-sm text-ink">
            성별 (선택)
          </label>
          <select
            id="profile-gender"
            value={profile.gender ?? ""}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option || "none"} value={option}>
                {option || "선택 안 함"}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="text-button inline-flex h-11 items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active disabled:opacity-50"
          >
            {saving ? "저장하는 중..." : "프로필 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
