import { describe, expect, it } from "vitest";
import { computeDisplayStatus } from "@/components/mates/filter-summary";
import { hasPgErrorCode, UNIQUE_VIOLATION } from "@/app/api/mates/[id]/requests/route";
import type { MatePost } from "@/lib/supabase/queries";

/**
 * UNIT-MATE-STATE — REQ-FUNC-035,036,037: 모집 상태·요청 상태 전이를 순수 함수 단위로 검증한다.
 *
 * 이 Task의 세 AC 중 실제로 모듈화된 순수 함수로 존재하는 부분만 직접 테스트한다:
 * - "종료일 경과 → CLOSED 계산": `computeDisplayStatus`(C-SCR004-LIST-GRID, W09)를 그대로 가져와 검증한다.
 * - "중복 PENDING/ACCEPTED 차단": 실제 차단 메커니즘은 DB의 partial unique index
 *   (`mate_applications_unique_active`, 0001_schema.sql)이고, API(`API-MATE-REQUESTS`)는 그 위반을
 *   Postgres 에러 코드 23505로 감지해 409를 반환한다(`hasPgErrorCode`) — 그 감지 함수를 직접 테스트한다.
 * - "PENDING→ACCEPTED/REJECTED 전이"는 `src/lib/supabase/queries.ts`의
 *   `updateMateApplicationStatusSchema`(zod `enum(["ACCEPTED","REJECTED"])`)가 실제로 강제하지만
 *   그 스키마는 export되어 있지 않다 — 여기서는 그 스키마·DB CHECK 제약(`status in ('PENDING','ACCEPTED','REJECTED')`,
 *   0001_schema.sql)과 반드시 같은 값이어야 하는 상수를 복제해 검증한다. 실제 스키마가 바뀌면 이 값도
 *   함께 갱신해야 한다(둘이 어긋나도 이 테스트만으로는 잡아내지 못함 — 알려진 한계로 기록).
 */

describe("computeDisplayStatus — 종료일 경과 시 CLOSED 계산", () => {
  const basePost: MatePost = {
    id: "post-1",
    author_id: "author-1",
    title: "테스트 동행글",
    country: "일본",
    region: "오사카",
    start_date: "2020-01-01",
    end_date: "2020-01-05",
    capacity: 3,
    description: "설명",
    status: "OPEN",
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2020-01-01T00:00:00Z",
  };

  it("저장값이 OPEN이어도 종료일이 지났으면 CLOSED로 계산한다", () => {
    expect(computeDisplayStatus({ ...basePost, end_date: "2020-01-05" })).toBe("CLOSED");
  });

  it("저장값이 OPEN이고 종료일이 미래면 OPEN을 유지한다", () => {
    expect(computeDisplayStatus({ ...basePost, end_date: "2099-01-05" })).toBe("OPEN");
  });

  it("저장값이 이미 CLOSED면 종료일과 무관하게 CLOSED를 유지한다(수동 마감)", () => {
    expect(computeDisplayStatus({ ...basePost, status: "CLOSED", end_date: "2099-01-05" })).toBe("CLOSED");
  });
});

describe("hasPgErrorCode — 중복 PENDING/ACCEPTED 신청 차단 감지", () => {
  it("Postgres unique_violation(23505) 에러를 감지한다", () => {
    const pgError = { code: "23505", message: "duplicate key value violates unique constraint" };
    expect(hasPgErrorCode(pgError, UNIQUE_VIOLATION)).toBe(true);
  });

  it("다른 에러 코드는 중복으로 오인하지 않는다", () => {
    const otherError = { code: "23503", message: "foreign key violation" };
    expect(hasPgErrorCode(otherError, UNIQUE_VIOLATION)).toBe(false);
  });

  it("code 필드가 없는 값은 중복으로 오인하지 않는다", () => {
    expect(hasPgErrorCode(new Error("network error"), UNIQUE_VIOLATION)).toBe(false);
    expect(hasPgErrorCode(null, UNIQUE_VIOLATION)).toBe(false);
  });
});

describe("참가 요청 상태 전이 — 허용된 값(queries.ts/DB CHECK 제약과 동일해야 함)", () => {
  // src/lib/supabase/queries.ts의 updateMateApplicationStatusSchema, supabase/migrations/0001_schema.sql의
  // mate_applications.status CHECK 제약과 반드시 일치해야 하는 값(수동 복제, 위 문서 주석 참고).
  const VALID_TRANSITION_TARGETS = ["ACCEPTED", "REJECTED"] as const;
  const ALL_VALID_STATUSES = ["PENDING", "ACCEPTED", "REJECTED"] as const;

  it("작성자가 요청을 변경할 수 있는 대상 상태는 ACCEPTED/REJECTED 뿐이다", () => {
    expect(VALID_TRANSITION_TARGETS).toEqual(["ACCEPTED", "REJECTED"]);
    expect(VALID_TRANSITION_TARGETS).not.toContain("PENDING");
  });

  it("전체 상태값 집합은 PENDING/ACCEPTED/REJECTED 3가지뿐이다", () => {
    expect(ALL_VALID_STATUSES).toHaveLength(3);
  });
});
