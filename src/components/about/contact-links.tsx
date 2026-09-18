import { aboutData } from "@/data/about";

export const CONTACT_LINKS_SECTION_ID = "contact-links";

const ALLOWED_PROTOCOLS = ["mailto:", "https:"];

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * SCR-002 Section 8 — 문의·SNS 링크. `src/data/about.ts`(관리자가 값을 정하는
 * 정적 설정)를 출처로 쓰고, 빈 값이나 mailto/https 외 프로토콜은 렌더링하지 않는다.
 */
export function ContactLinks() {
  const links = aboutData.contactLinks.filter((link) => link.url.trim() && isAllowedUrl(link.url));

  if (links.length === 0) {
    return null;
  }

  return (
    <section id={CONTACT_LINKS_SECTION_ID} className="mx-auto max-w-[1240px] px-5 py-10 lg:px-10">
      <div className="flex flex-wrap justify-center gap-6 lg:justify-start">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="text-body-sm text-body inline-flex items-center gap-2 hover:text-ink"
            {...(link.url.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden>
              <path
                d="M7 17 17 7M9 7h8v8"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
