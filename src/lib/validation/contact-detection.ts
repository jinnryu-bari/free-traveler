// 연락처/외부 채널 유도 패턴 탐지 — 클라이언트 측 1차 방어선.
// `src/app/api/mates/route.ts`가 서버측에서 동일한 취지의 패턴으로 다시 검사하므로
// (클라이언트 검증은 신뢰하지 않는다), 여기서는 사용자에게 빠른 피드백만 준다.
const CONTACT_PATTERNS = [
  /01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/, // 휴대폰 번호
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // 이메일
  /카카오\s*톡|카톡\s*(아이디|id)|kakao\s*id/i, // 카카오톡 유도
  /인스타(그램)?\s*(아이디|id)?|instagram/i, // 인스타그램 유도
  /(?<![\w.])@[a-zA-Z0-9_.]{3,}/, // SNS 핸들(@id)
];

export function containsContactPattern(text: string): boolean {
  return CONTACT_PATTERNS.some((pattern) => pattern.test(text));
}
