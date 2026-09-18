import { describe, expect, it } from "vitest";
import { containsContactPattern } from "./contact-detection";

// REQ-FUNC-032 AC: 기준 테스트셋 탐지율 95%↑, 오탐 5%↓.
// 연락처·메신저 유도 문구가 실제로 포함된 문장(POSITIVE_SET)과, 동행글에 흔히 쓰이지만
// 연락처를 전혀 담지 않은 정상 문장(NEGATIVE_SET)을 각각 모아 두 비율을 함께 검증한다.

const POSITIVE_SET = [
  "010-1234-5678로 연락주세요",
  "01012345678",
  "번호는 010 1234 5678 입니다",
  "test@example.com 으로 메일 주세요",
  "제 메일은 abc.def@test.co.kr",
  "카카오톡 아이디 abc123",
  "카톡 id: xyz",
  "카톡아이디 hello123",
  "kakao id: hello",
  "인스타 아이디 travel_kim",
  "인스타그램 확인해주세요",
  "instagram: traveler",
  "@myhandle123 으로 dm주세요",
  "011-222-3333",
  "이메일 주소는 hello@naver.com",
];

const NEGATIVE_SET = [
  "느긋하게 여행하는 걸 좋아해요",
  "오사카 3박4일 같이 다니실 분 구합니다",
  "여행 스타일은 힐링입니다",
  "도쿄 타워 근처에서 만나요",
  "일정 조율 가능합니다",
  "같이 사진 찍어요",
  "성인이고 여행 좋아합니다",
  "제주도 여행 계획 중입니다",
  "온천 여행 선호합니다",
  "국내 여행 위주로 다닙니다",
  "숙소는 각자 예약하는 걸로 해요",
  "맛집 탐방 위주로 여행합니다",
  "아침형 인간이라 일찍 움직입니다",
  "짐은 최소화해서 다니는 편이에요",
  "환전은 미리 해두려고 합니다",
];

describe("containsContactPattern — REQ-FUNC-032 탐지율/오탐률", () => {
  it("연락처가 실제로 포함된 문장의 95% 이상을 탐지한다", () => {
    const detected = POSITIVE_SET.filter(containsContactPattern).length;
    const detectionRate = detected / POSITIVE_SET.length;
    expect(detectionRate).toBeGreaterThanOrEqual(0.95);
  });

  it("연락처가 없는 정상 문장의 오탐률이 5% 미만이다", () => {
    const falsePositives = NEGATIVE_SET.filter(containsContactPattern).length;
    const falsePositiveRate = falsePositives / NEGATIVE_SET.length;
    expect(falsePositiveRate).toBeLessThan(0.05);
  });

  it("휴대폰 번호(하이픈 유무 모두)를 탐지한다", () => {
    expect(containsContactPattern("010-1234-5678")).toBe(true);
    expect(containsContactPattern("01012345678")).toBe(true);
  });

  it("이메일 주소를 탐지한다", () => {
    expect(containsContactPattern("hello@example.com")).toBe(true);
  });

  it("카카오톡/인스타그램 유도 문구를 탐지한다", () => {
    expect(containsContactPattern("카톡 아이디 알려주세요")).toBe(true);
    expect(containsContactPattern("인스타 팔로우 해주세요")).toBe(true);
  });

  it("SNS 핸들(@id) 형태를 탐지한다", () => {
    expect(containsContactPattern("@traveler_kim 으로 연락주세요")).toBe(true);
  });

  it("동행글에 흔한 정상 문장은 탐지하지 않는다", () => {
    expect(containsContactPattern("오사카 여행 같이 가실 분 구합니다")).toBe(
      false,
    );
  });
});
