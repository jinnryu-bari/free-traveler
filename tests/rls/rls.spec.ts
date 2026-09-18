import { beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * TEST-RLS-BASIC — RLS 정책 기본 통합 테스트(REQ-FUNC-044; REQ-NF-013).
 *
 * 실제 Supabase 프로젝트 + `supabase/seed.sql`의 3역할 계정(seed-member/-moderator/-admin)이
 * 있어야 로그인 필요 케이스를 실행할 수 있다. 로그인에 실패하면 그 테스트들은 `it.skip`으로
 * 명시적으로 건너뛴다 — "PASS"로 위장하지 않는다(사용자 지시: 통과/실패/환경 부족 구분,
 * 실패를 숨기는 Skip 금지 — 이건 실패를 숨기는 게 아니라 애초에 실행 전제 조건이 없어
 * "미실행"으로 정직하게 표시하는 것이다. vitest 리포트에 소문자 skipped로 남아 CI에서도
 * pass 개수와 분리되어 보인다).
 *
 * 범위를 좁혀 이번에 사용자가 명시적으로 요청한 시나리오만 다룬다(과도한 정교화 지양):
 * 1) 일반 회원의 `profiles.role` 자가 승격 차단(0003_profiles_role_lockdown.sql 검증)
 * 2) 위 수정이 정상 프로필 저장(닉네임)을 막지 않는지 회귀 확인
 * 3) 비로그인(anon)은 애초에 mate_applications GRANT가 없어 조회가 막힌다 — 로그인 불필요, 항상 실행
 * 4) admin은 정책 예외로 참가 메시지를 볼 수 있다(신고 처리 목적)
 *
 * 전체 6개 테이블 x 6개 역할의 모든 조합을 다루지는 않는다 — 수업 실습 프로젝트 범위에 맞춰
 * 이번에 실제로 문제가 된(또는 문제가 될 뻔한) 시나리오에 집중한다. seed 계정이 member(작성자)/
 * moderator(신청자)/admin(예외) 3개뿐이라 "신청자도 작성자도 아닌 완전한 제3자가 차단되는지"는
 * 이 Seed 데이터만으로는 검증할 수 없다 — 새 계정이 필요해 이번 범위에서 다루지 않는다.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SEED_PASSWORD = "SeedPassword123!";
const SEED_MEMBER_EMAIL = "seed-member@example.com";
const SEED_MEMBER_ID = "11111111-1111-1111-1111-111111111111";
const SEED_ADMIN_EMAIL = "seed-admin@example.com";
const SEED_APPLICATION_ID = "bbbbbbbb-0000-0000-0000-000000000001";

const HAS_ENV = Boolean(SUPABASE_URL && ANON_KEY);

let memberClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;
let memberSignInError: string | null = null;
let adminSignInError: string | null = null;

describe.skipIf(!HAS_ENV)("TEST-RLS-BASIC — 기본 RLS 통합 테스트", () => {
  beforeAll(async () => {
    const member = createClient(SUPABASE_URL!, ANON_KEY!);
    const memberResult = await member.auth.signInWithPassword({
      email: SEED_MEMBER_EMAIL,
      password: SEED_PASSWORD,
    });
    if (memberResult.error) {
      memberSignInError = memberResult.error.message;
    } else {
      memberClient = member;
    }

    const admin = createClient(SUPABASE_URL!, ANON_KEY!);
    const adminResult = await admin.auth.signInWithPassword({
      email: SEED_ADMIN_EMAIL,
      password: SEED_PASSWORD,
    });
    if (adminResult.error) {
      adminSignInError = adminResult.error.message;
    } else {
      adminClient = admin;
    }

    if (memberSignInError || adminSignInError) {
      console.warn(
        `[환경 부족으로 미실행] Seed 계정 로그인 실패 — member: ${memberSignInError ?? "OK"}, admin: ${adminSignInError ?? "OK"}. ` +
          "supabase/seed.sql이 이 프로젝트에 아직 적용되지 않았을 수 있다.",
      );
    }
  });

  it("일반 회원은 자기 profiles.role을 admin으로 바꿀 수 없다(0003 마이그레이션)", async (ctx) => {
    if (!memberClient) ctx.skip();
    const { error: updateError } = await memberClient!
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", SEED_MEMBER_ID);
    expect(updateError).not.toBeNull();

    const { data: afterUpdate } = await memberClient!
      .from("profiles")
      .select("role")
      .eq("id", SEED_MEMBER_ID)
      .single();
    expect(afterUpdate?.role).toBe("member");
  });

  it("일반 회원은 정상적으로 자기 닉네임을 저장할 수 있다(0003 이후 회귀 확인)", async (ctx) => {
    if (!memberClient) ctx.skip();
    const { error } = await memberClient!
      .from("profiles")
      .update({ nickname: "Seed Member" })
      .eq("id", SEED_MEMBER_ID);
    expect(error).toBeNull();
  });

  it("비로그인(anon)은 mate_applications를 조회할 수 없다(GRANT 자체가 없음, 로그인 불필요)", async () => {
    const anon = createClient(SUPABASE_URL!, ANON_KEY!);
    const { data, error } = await anon
      .from("mate_applications")
      .select("*")
      .eq("id", SEED_APPLICATION_ID);
    if (!error) {
      expect(data).toHaveLength(0);
    }
  });

  it("admin은 정책 예외로 모든 참가 메시지를 조회할 수 있다(신고 처리를 위한 의도된 예외)", async (ctx) => {
    if (!adminClient) ctx.skip();
    const { data, error } = await adminClient!
      .from("mate_applications")
      .select("*")
      .eq("id", SEED_APPLICATION_ID);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });
});
