"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNavLinks } from "@/lib/nav";

const FOCUSABLE_SELECTOR = "a[href], button:not([disabled])";

function NavList({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <ul className={className}>
      {primaryNavLinks.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`text-title-sm inline-flex h-11 items-center border-b-2 px-1 transition-colors ${
                isActive
                  ? "border-brand-coral text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuSheetRef = useRef<HTMLDivElement>(null);

  // 라우트가 바뀌면 모바일 메뉴를 자동으로 닫는다. Effect 대신 렌더 중 상태 조정
  // 패턴을 사용해 불필요한 추가 렌더(react-hooks/set-state-in-effect)를 피한다.
  const [menuClosedForPathname, setMenuClosedForPathname] = useState(pathname);
  if (pathname !== menuClosedForPathname) {
    setMenuClosedForPathname(pathname);
    if (isMenuOpen) setIsMenuOpen(false);
  }

  // Esc로 닫기 + Tab 포커스 트랩 (design plan §3.5 포커스 트랩 원칙 준용)
  useEffect(() => {
    if (!isMenuOpen) return;
    const sheet = menuSheetRef.current;
    const triggerButton = menuButtonRef.current;
    const focusable = sheet
      ? Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : [];
    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      triggerButton?.focus();
    };
  }, [isMenuOpen]);

  return (
    <header className="border-hairline sticky top-0 z-40 border-b bg-canvas">
      <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-5 lg:h-[72px] lg:px-10">
        <Link
          href="/"
          className="text-title-md flex items-center gap-1.5 text-ink"
        >
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-brand-coral"
          />
          Free Traveler
        </Link>

        {/* Desktop nav */}
        <nav aria-label="주요 메뉴" className="hidden lg:block">
          <NavList pathname={pathname} className="flex items-center gap-8" />
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/account"
            className="text-title-sm border-hairline inline-flex h-11 items-center rounded-sm border px-4 text-ink hover:border-border-strong"
          >
            로그인
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={menuButtonRef}
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-sheet"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg
            viewBox="0 0 24 24"
            width={24}
            height={24}
            fill="none"
            aria-hidden
          >
            {isMenuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile full-screen sheet */}
      {isMenuOpen ? (
        <div
          ref={menuSheetRef}
          id="mobile-nav-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="주요 메뉴"
          className="fixed inset-x-0 bottom-0 top-14 z-30 flex flex-col justify-between overflow-y-auto bg-canvas lg:hidden"
        >
          <nav aria-label="주요 메뉴" className="px-5 py-6">
            <NavList
              pathname={pathname}
              onNavigate={() => setIsMenuOpen(false)}
              className="flex flex-col gap-2"
            />
          </nav>
          <div className="border-hairline border-t p-5">
            <Link
              href="/account"
              onClick={() => setIsMenuOpen(false)}
              className="text-title-sm border-hairline flex h-12 items-center justify-center rounded-sm border text-ink"
            >
              로그인
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
