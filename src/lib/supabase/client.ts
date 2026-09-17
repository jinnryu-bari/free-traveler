"use client";

import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Client Component에서 세션 확인 등 브라우저 측 호출에 사용하는 Supabase 클라이언트.
 * Supabase 프로젝트 연결 전(환경변수 미설정)에는 크래시 대신 명확한 안내 메시지를 던진다
 * — 실제 프로젝트 생성·키 발급은 06번 가이드에서 진행한다.
 */
export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase 환경변수가 설정되지 않았다 — NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY를 " +
        ".env.local에 추가해야 한다(06번 가이드: Supabase 프로젝트 생성과 연결).",
    );
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
