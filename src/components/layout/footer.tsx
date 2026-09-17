import Link from "next/link";

type FooterColumn = {
  title: string;
  links: { href: string; label: string }[];
};

// docs/04_UIUX_PLAN.md §3.2 — 3열 구성(여행 정보 / 서비스 / 회사)
const columns: FooterColumn[] = [
  {
    title: "여행 정보",
    links: [
      { href: "/", label: "여행지" },
      { href: "/#safety", label: "국가 안전정보" },
    ],
  },
  {
    title: "서비스",
    links: [
      { href: "/travel-tools", label: "여행 준비" },
      { href: "/mates", label: "동행 찾기" },
    ],
  },
  {
    title: "회사",
    links: [
      { href: "/about", label: "대표 소개" },
      { href: "/terms", label: "이용약관" },
      { href: "/privacy", label: "개인정보 처리방침" },
      { href: "/safety-guide", label: "동행 안전수칙" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-surface-soft">
      <div className="mx-auto max-w-[1240px] px-5 py-10 lg:px-10 lg:py-16">
        <nav aria-label="Footer 링크" className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-title-sm mb-4 text-ink">{column.title}</h2>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-body hover:text-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-hairline mt-10 flex flex-col gap-2 border-t pt-6 lg:mt-16">
          <p className="text-caption text-muted">
            &copy; {new Date().getFullYear()} Free Traveler. All rights reserved.
          </p>
          <a
            href="mailto:hello@freetraveler.app"
            className="text-caption text-muted hover:text-ink hover:underline"
          >
            hello@freetraveler.app
          </a>
        </div>
      </div>
    </footer>
  );
}
