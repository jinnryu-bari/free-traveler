"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { validateDateRange, isDateRangeValid } from "@/lib/validation/travel-dates";
import { containsContactPattern } from "@/lib/validation/contact-detection";
import { currentTab } from "./intro-tabs";

type AuthState = "loading" | "guest" | "not-adult" | "ready";

function useMateComposerAuth(): AuthState {
  const [state, setState] = useState<AuthState>("loading");

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        setState("guest");
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("is_adult").eq("id", user.id).single();
      if (cancelled) return;
      setState(profile?.is_adult ? "ready" : "not-adult");
    }

    check().catch(() => {
      if (!cancelled) setState("guest");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function GateBanner({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-hairline flex flex-col items-start gap-3 rounded-md border p-6">
      <p className="text-title-md text-ink">{title}</p>
      <p className="text-body-sm text-body">{body}</p>
      <Link
        href="/account"
        className="text-button inline-flex h-11 items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active"
      >
        /account로 이동
      </Link>
    </div>
  );
}

interface FormState {
  title: string;
  country: string;
  region: string;
  startDate: string;
  endDate: string;
  capacity: string;
  styleTag: string;
  description: string;
  agreedSafety: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  country: "",
  region: "",
  startDate: "",
  endDate: "",
  capacity: "",
  styleTag: "",
  description: "",
  agreedSafety: false,
};

function MateComposerReadyForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedPostId, setSubmittedPostId] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const dateErrors = validateDateRange(form.startDate, form.endDate, {
    startLabel: "시작일",
    endLabel: "종료일",
  });
  const capacityNumber = Number(form.capacity);
  const contactHit = containsContactPattern(form.title) || containsContactPattern(form.description);

  const hasRequired = Boolean(
    form.title.trim() &&
      form.country.trim() &&
      form.region.trim() &&
      form.startDate &&
      form.endDate &&
      form.capacity &&
      capacityNumber > 0 &&
      form.description.trim() &&
      form.agreedSafety,
  );
  const isValid = hasRequired && isDateRangeValid(dateErrors) && !contactHit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const description = form.styleTag.trim()
        ? `[여행 스타일: ${form.styleTag.trim()}]\n\n${form.description.trim()}`
        : form.description.trim();

      const res = await fetch("/api/mates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          country: form.country.trim(),
          region: form.region.trim(),
          startDate: form.startDate,
          endDate: form.endDate,
          capacity: capacityNumber,
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.error ?? "동행글 작성에 실패했습니다";
        setSubmitError(message);
        showToast("error", message);
        return;
      }
      showToast("success", "동행글을 등록했습니다.");
      setSubmittedPostId(data.post.id);
      setForm(EMPTY_FORM);
      setTouched(false);
    } catch {
      const message = "네트워크 오류로 등록하지 못했습니다. 다시 시도해주세요.";
      setSubmitError(message);
      showToast("error", message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedPostId) {
    return (
      <div className="border-hairline flex flex-col items-start gap-3 rounded-md border p-6">
        <p className="text-title-md text-ink">동행글을 등록했습니다.</p>
        <div className="flex gap-3">
          <Link
            href="/mates"
            className="text-button inline-flex h-11 items-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active"
          >
            /mates에서 보기
          </Link>
          <button
            type="button"
            onClick={() => setSubmittedPostId(null)}
            className="text-button border-hairline inline-flex h-11 items-center rounded-sm border px-5 text-ink hover:bg-surface-soft"
          >
            새 글 작성
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="mate-title" className="text-body-sm text-ink">
          제목
        </label>
        <input
          id="mate-title"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
          maxLength={120}
        />
        {touched && !form.title.trim() && <p className="text-caption text-danger">제목을 입력하세요</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-country" className="text-body-sm text-ink">
            국가
          </label>
          <input
            id="mate-country"
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
          />
          {touched && !form.country.trim() && <p className="text-caption text-danger">국가를 입력하세요</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-region" className="text-body-sm text-ink">
            지역
          </label>
          <input
            id="mate-region"
            value={form.region}
            onChange={(e) => set("region", e.target.value)}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
          />
          {touched && !form.region.trim() && <p className="text-caption text-danger">지역을 입력하세요</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-start" className="text-body-sm text-ink">
            시작일
          </label>
          <input
            id="mate-start"
            type="date"
            value={form.startDate}
            onChange={(e) => set("startDate", e.target.value)}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
          />
          {touched && dateErrors.start && <p className="text-caption text-danger">{dateErrors.start}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-end" className="text-body-sm text-ink">
            종료일
          </label>
          <input
            id="mate-end"
            type="date"
            value={form.endDate}
            onChange={(e) => set("endDate", e.target.value)}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
          />
          {touched && dateErrors.end && <p className="text-caption text-danger">{dateErrors.end}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-capacity" className="text-body-sm text-ink">
            모집 인원
          </label>
          <input
            id="mate-capacity"
            type="number"
            min={1}
            max={50}
            value={form.capacity}
            onChange={(e) => set("capacity", e.target.value)}
            className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
          />
          {touched && !(form.capacity && capacityNumber > 0) && (
            <p className="text-caption text-danger">모집 인원을 입력하세요</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-style" className="text-body-sm text-ink">
            여행 스타일(선택)
          </label>
          <input
            id="mate-style"
            value={form.styleTag}
            onChange={(e) => set("styleTag", e.target.value)}
            placeholder="예: 자유여행, 맛집 탐방"
            className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="mate-description" className="text-body-sm text-ink">
          상세 소개
        </label>
        <textarea
          id="mate-description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={5}
          maxLength={2000}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2.5 text-ink"
        />
        {touched && !form.description.trim() && <p className="text-caption text-danger">상세 소개를 입력하세요</p>}
        {touched && contactHit && (
          <p className="text-caption text-danger">
            전화번호·이메일·메신저 아이디로 보이는 내용은 제거해주세요.
          </p>
        )}
      </div>

      <label className="text-body-sm text-body flex items-start gap-2">
        <input
          type="checkbox"
          checked={form.agreedSafety}
          onChange={(e) => set("agreedSafety", e.target.checked)}
          className="mt-0.5"
        />
        <span>
          <Link href="/safety-guide" className="text-link text-ink underline underline-offset-2">
            동행 안전수칙
          </Link>
          을 확인했으며 이에 동의합니다.
        </span>
      </label>
      {touched && !form.agreedSafety && <p className="text-caption text-danger">안전수칙 동의가 필요합니다</p>}

      {submitError && <p className="text-caption text-danger">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="text-button inline-flex h-11 w-fit items-center rounded-sm bg-brand-coral px-6 text-on-brand hover:bg-brand-coral-active disabled:opacity-60"
      >
        {submitting ? "등록 중..." : "동행글 등록"}
      </button>
    </form>
  );
}

function MateComposerPanel() {
  const searchParams = useSearchParams();
  const isActive = currentTab(new URLSearchParams(searchParams.toString())) === "mate";
  const authState = useMateComposerAuth();

  return (
    <div id="mate-composer-panel" className={isActive ? "" : "hidden"}>
      {authState === "loading" && <div className="h-40 animate-pulse rounded-md bg-surface-strong" />}
      {authState === "guest" && (
        <GateBanner
          title="로그인이 필요합니다"
          body="동행글을 작성하려면 먼저 로그인해주세요."
        />
      )}
      {authState === "not-adult" && (
        <GateBanner
          title="성인확인이 필요합니다"
          body="동행 안전을 위해 성인확인을 완료한 계정만 동행글을 작성할 수 있습니다."
        />
      )}
      {authState === "ready" && <MateComposerReadyForm />}
    </div>
  );
}

/**
 * SCR-003 Section 3(동행 구하기 탭) — 동행 모집글 작성 Form(인증 게이트).
 * 미인증/미성년이면 Form 자체를 렌더하지 않고 안내 Banner만 보여준다.
 * 본문에 연락처로 보이는 패턴이 있으면 제출을 막는다(서버(`/api/mates`)가
 * 동일 취지로 다시 검사하므로 이 클라이언트 검증만 신뢰하지 않는다).
 */
export function MateComposerForm() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-surface-strong" />}>
      <MateComposerPanel />
    </Suspense>
  );
}
