import { describe, expect, it } from "vitest";
import { isDateRangeValid, validateDateRange } from "./travel-dates";

const TODAY = new Date().toISOString().slice(0, 10);
const PAST = "2020-01-01";
const FUTURE_1 = "2099-01-10";
const FUTURE_2 = "2099-01-05"; // FUTURE_1보다 이전

describe("validateDateRange — 항공(strictAfter=false, 종료일 == 시작일 허용)", () => {
  it("과거 출발일은 차단된다", () => {
    const errors = validateDateRange(PAST, FUTURE_1);
    expect(isDateRangeValid(errors)).toBe(false);
    expect(errors.start).toBeDefined();
  });

  it("귀국일이 출발일보다 앞서면(날짜 역전) 차단된다", () => {
    const errors = validateDateRange(FUTURE_1, FUTURE_2);
    expect(isDateRangeValid(errors)).toBe(false);
    expect(errors.end).toBeDefined();
  });

  it("출발일과 귀국일이 같으면 허용된다(당일 왕복)", () => {
    const errors = validateDateRange(FUTURE_1, FUTURE_1);
    expect(isDateRangeValid(errors)).toBe(true);
  });

  it("정상적인 미래 범위는 통과한다", () => {
    const errors = validateDateRange(FUTURE_2, FUTURE_1);
    expect(isDateRangeValid(errors)).toBe(true);
  });

  it("오늘 날짜는 과거로 취급하지 않는다", () => {
    const errors = validateDateRange(TODAY, FUTURE_1);
    expect(errors.start).toBeUndefined();
  });
});

describe("validateDateRange — 숙소(strictAfter=true, 체크아웃 == 체크인 차단)", () => {
  it("과거 체크인은 차단된다", () => {
    const errors = validateDateRange(PAST, FUTURE_1, { strictAfter: true });
    expect(isDateRangeValid(errors)).toBe(false);
    expect(errors.start).toBeDefined();
  });

  it("체크아웃이 체크인보다 앞서면 차단된다", () => {
    const errors = validateDateRange(FUTURE_1, FUTURE_2, { strictAfter: true });
    expect(isDateRangeValid(errors)).toBe(false);
    expect(errors.end).toBeDefined();
  });

  it("체크아웃과 체크인이 같으면(0박) strictAfter에서는 차단된다", () => {
    const errors = validateDateRange(FUTURE_1, FUTURE_1, { strictAfter: true });
    expect(isDateRangeValid(errors)).toBe(false);
    expect(errors.end).toBeDefined();
  });

  it("체크아웃이 체크인 이후면 통과한다", () => {
    const errors = validateDateRange(FUTURE_2, FUTURE_1, { strictAfter: true });
    expect(isDateRangeValid(errors)).toBe(true);
  });
});

describe("validateDateRange — 빈 값", () => {
  it("시작일이 비어 있으면 시작일 오류를 반환한다", () => {
    const errors = validateDateRange("", FUTURE_1);
    expect(errors.start).toBeDefined();
  });

  it("종료일이 비어 있으면 종료일 오류를 반환한다", () => {
    const errors = validateDateRange(FUTURE_1, "");
    expect(errors.end).toBeDefined();
  });
});
