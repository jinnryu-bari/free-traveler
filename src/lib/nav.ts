export type NavLink = {
  href: string;
  label: string;
};

// 공통 내비게이션 4개 링크 — docs/04_UIUX_PLAN.md §3.1
export const primaryNavLinks: NavLink[] = [
  { href: "/", label: "여행지" },
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
  { href: "/about", label: "대표 소개" },
];
