import { beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * TEST-RLS-BASIC — RLS 정책 기본 통합 테스트(REQ-FUNC-044; REQ-NF-013).
 *
 * `.env.test.local`(gitignore 대상, `env.test.local.example` 참고)에 실제 로그인 가능한
 * 테스트 계정 정보(E2E_TEST_MEMBER_..., E2E_TEST_MODERATOR_...)가 있어야 로그인 필요 케이스를
 * 실행한다. 계정 2개면 충분하다 — RLS 정책(`mate_applications_select_related`, 0002_rls.sql)이
 * moderator에게도 admin과 동일한 조회 예외를 주므로 별도 admin 계정은 필요 없다
 * (기존 `seed.sql`의 3계정 대신 최소 2개로 줄였다).
 *
 * 계정 정보가 아예 없으면(로컬 개발자가 아직 준비하지 않은 정상적인 상태) 전체를
 * describe.skip으로 건너뛴다. 반면 **계정 정보가 설정돼 있는데 로그인 자체가 실패하면
 * 그건 "환경 없음"이 아니라 "준비 단계 실패"다 — skip하지 않고 테스트를 그대로
 * 실패시킨다**(사용자 지시: 검증을 명시적으로 실행했는데 로그인 실패를 자동 Skip해
 * 통과처럼 보이게 하지 말 것).
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const MEMBER_EMAIL = process.env.E2E_TEST_MEMBER_EMAIL;
const MEMBER_PASSWORD = process.env.E2E_TEST_MEMBER_PASSWORD;
const MODERATOR_EMAIL = process.env.E2E_TEST_MODERATOR_EMAIL;
const MODERATOR_PASSWORD = process.env.E2E_TEST_MODERATOR_PASSWORD;

const HAS_SUPABASE_ENV = Boolean(SUPABASE_URL && ANON_KEY);
const HAS_ACCOUNTS_CONFIGURED = Boolean(
  MEMBER_EMAIL && MEMBER_PASSWORD && MODERATOR_EMAIL && MODERATOR_PASSWORD,
);

let memberClient: SupabaseClient;
let moderatorClient: SupabaseClient;
let memberUserId: string;

describe.skipIf(!HAS_SUPABASE_ENV)(
  "TEST-RLS-BASIC — 기본 RLS 통합 테스트",
  () => {
    describe.skipIf(!HAS_ACCOUNTS_CONFIGURED)(
      "로그인 필요 케이스(.env.test.local 준비됨)",
      () => {
        beforeAll(async () => {
          memberClient = createClient(SUPABASE_URL!, ANON_KEY!);
          const memberResult = await memberClient.auth.signInWithPassword({
            email: MEMBER_EMAIL!,
            password: MEMBER_PASSWORD!,
          });
          // 계정 정보를 설정했는데 로그인이 실패하면 준비 단계 실패다 — skip하지 않고 던진다.
          if (memberResult.error || !memberResult.data.user) {
            throw new Error(
              `[준비 단계 실패] E2E_TEST_MEMBER 로그인 실패: ${memberResult.error?.message ?? "세션 없음"}. ` +
                "Supabase Dashboard에서 만든 테스트 계정의 이메일 확인 여부와 .env.test.local 값을 다시 확인하세요.",
            );
          }
          memberUserId = memberResult.data.user.id;

          moderatorClient = createClient(SUPABASE_URL!, ANON_KEY!);
          const moderatorResult = await moderatorClient.auth.signInWithPassword(
            {
              email: MODERATOR_EMAIL!,
              password: MODERATOR_PASSWORD!,
            },
          );
          if (moderatorResult.error || !moderatorResult.data.user) {
            throw new Error(
              `[준비 단계 실패] E2E_TEST_MODERATOR 로그인 실패: ${moderatorResult.error?.message ?? "세션 없음"}. ` +
                "Supabase Dashboard에서 role='moderator'로 올린 테스트 계정인지, .env.test.local 값이 맞는지 다시 확인하세요.",
            );
          }
        });

        it("일반 회원은 자기 profiles.role을 admin으로 바꿀 수 없다(0003 마이그레이션)", async () => {
          const { error: updateError } = await memberClient
            .from("profiles")
            .update({ role: "admin" })
            .eq("id", memberUserId);
          expect(updateError).not.toBeNull();

          const { data: afterUpdate } = await memberClient
            .from("profiles")
            .select("role")
            .eq("id", memberUserId)
            .single();
          expect(afterUpdate?.role).not.toBe("admin");
        });

        it("일반 회원은 정상적으로 자기 닉네임을 저장할 수 있다(0003 이후 회귀 확인)", async () => {
          const { error } = await memberClient
            .from("profiles")
            .update({ nickname: "E2E 테스트 회원" })
            .eq("id", memberUserId);
          expect(error).toBeNull();
        });

        it("moderator는 정책 예외로 mate_applications를 조회할 수 있다(RLS 거부 없음)", async () => {
          const { error } = await moderatorClient
            .from("mate_applications")
            .select("id")
            .limit(1);
          expect(error).toBeNull();
        });
      },
    );

    it("비로그인(anon)은 mate_applications를 조회할 수 없다(GRANT 자체가 없음, 로그인 불필요)", async () => {
      const anon = createClient(SUPABASE_URL!, ANON_KEY!);
      const { data, error } = await anon
        .from("mate_applications")
        .select("*")
        .limit(1);
      if (!error) {
        expect(data).toHaveLength(0);
      }
    }, 10000);
  },
);
