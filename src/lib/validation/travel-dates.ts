export interface DateRangeErrors {
  start?: string;
  end?: string;
}

/**
 * 항공(출발일/귀국일)·숙소(체크인/체크아웃) 공통 날짜 범위 검증.
 * ISO 형식(YYYY-MM-DD) 문자열은 사전순 비교가 곧 날짜순 비교와 같다.
 */
export function validateDateRange(
  start: string,
  end: string,
  opts: { strictAfter?: boolean; startLabel?: string; endLabel?: string } = {},
): DateRangeErrors {
  const { strictAfter = false, startLabel = "시작일", endLabel = "종료일" } = opts;
  const errors: DateRangeErrors = {};
  const today = new Date().toISOString().slice(0, 10);

  if (!start) {
    errors.start = `${startLabel}을 입력하세요`;
  } else if (start < today) {
    errors.start = `${startLabel}은 오늘 이후여야 합니다`;
  }

  if (!end) {
    errors.end = `${endLabel}을 입력하세요`;
  } else if (start && !errors.start) {
    const isInvalid = strictAfter ? end <= start : end < start;
    if (isInvalid) {
      errors.end = strictAfter
        ? `${endLabel}은 ${startLabel} 이후여야 합니다`
        : `${endLabel}은 ${startLabel}과 같거나 이후여야 합니다`;
    }
  }

  return errors;
}

export function isDateRangeValid(errors: DateRangeErrors): boolean {
  return !errors.start && !errors.end;
}
