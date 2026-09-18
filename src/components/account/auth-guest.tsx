"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

type CardState = "idle" | "submitting" | "success";

function LoginCard() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<CardState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setState("idle");
      setError("이메일 또는 비밀번호가 올바르지 않다");
      return;
    }
    setState("success");
    showToast("success", "로그인했다");
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="shadow-card flex flex-col gap-3 rounded-md p-5">
      <p className="text-title-md text-ink">로그인</p>
      <div className="flex flex-col gap-1">
        <label htmlFor="login-email" className="text-body-sm text-ink">
          이메일
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="login-password" className="text-body-sm text-ink">
          비밀번호
        </label>
        <input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
        />
      </div>
      {error && <p className="text-caption text-danger">{error}</p>}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="text-button inline-flex h-11 items-center justify-center rounded-sm bg-brand-coral px-5 text-on-brand hover:bg-brand-coral-active disabled:opacity-50"
      >
        {state === "submitting" ? "로그인하는 중..." : "로그인"}
      </button>
    </form>
  );
}

function SignupCard() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<CardState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "submitting") return;
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 한다");
      return;
    }
    setState("submitting");
    setError(null);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (signUpError) {
      setState("idle");
      setError(signUpError.message);
      return;
    }
    setState("success");
    showToast("success", "확인 이메일을 보냈다");
  };

  if (state === "success") {
    return (
      <div className="shadow-card flex flex-col gap-2 rounded-md p-5">
        <p className="text-title-md text-ink">가입</p>
        <p className="text-body-sm text-body">
          {email}로 확인 이메일을 보냈습니다. 메일의 링크를 눌러야 로그인할 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="shadow-card flex flex-col gap-3 rounded-md p-5">
      <p className="text-title-md text-ink">가입</p>
      <div className="flex flex-col gap-1">
        <label htmlFor="signup-email" className="text-body-sm text-ink">
          이메일
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="signup-password" className="text-body-sm text-ink">
          비밀번호 (8자 이상)
        </label>
        <input
          id="signup-password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
        />
      </div>
      {error && <p className="text-caption text-danger">{error}</p>}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="text-button border-hairline inline-flex h-11 items-center justify-center rounded-sm border px-5 text-ink hover:bg-surface-soft disabled:opacity-50"
      >
        {state === "submitting" ? "가입하는 중..." : "가입하기"}
      </button>
    </form>
  );
}

function ResetPasswordCard() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<CardState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setError(null);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account`,
    });
    if (resetError) {
      setState("idle");
      setError("재설정 메일을 보내지 못했다");
      return;
    }
    setState("success");
    showToast("success", "재설정 메일을 보냈다");
  };

  if (state === "success") {
    return (
      <div className="shadow-card flex flex-col gap-2 rounded-md p-5">
        <p className="text-title-md text-ink">비밀번호 재설정</p>
        <p className="text-body-sm text-body">{email}로 재설정 메일을 보냈습니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="shadow-card flex flex-col gap-3 rounded-md p-5">
      <p className="text-title-md text-ink">비밀번호 재설정</p>
      <div className="flex flex-col gap-1">
        <label htmlFor="reset-email" className="text-body-sm text-ink">
          이메일
        </label>
        <input
          id="reset-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-hairline text-body-sm rounded-sm border px-3 py-2 text-ink"
        />
      </div>
      {error && <p className="text-caption text-danger">{error}</p>}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="text-button border-hairline inline-flex h-11 items-center justify-center rounded-sm border px-5 text-ink hover:bg-surface-soft disabled:opacity-50"
      >
        {state === "submitting" ? "보내는 중..." : "재설정 메일 보내기"}
      </button>
    </form>
  );
}

/**
 * SCR-005 Guest 상태 — 로그인/가입/비밀번호 재설정 카드 3개.
 * 가입·재설정은 Supabase 이메일 확인 링크(`/auth/callback`)를 거쳐야 세션이 생긴다 —
 * 이메일 확인 전에는 동행 쓰기 등 인증 필요 기능에 세션 자체가 없어 접근할 수 없다.
 */
export function AuthGuest() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <LoginCard />
        <SignupCard />
        <ResetPasswordCard />
      </div>
      <p className="text-body-sm text-body">
        비밀번호는 Supabase Auth가 암호화해 저장하며, 이 프로젝트는 원문을 저장하지 않습니다. 자세한
        내용은{" "}
        <Link href="/privacy" className="text-link">
          개인정보처리방침
        </Link>
        을 확인하세요.
      </p>
    </div>
  );
}
