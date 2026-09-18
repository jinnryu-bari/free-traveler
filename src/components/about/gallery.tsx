"use client";

import { useEffect, useRef } from "react";
import { aboutData, type AboutGalleryImage } from "@/data/about";

export const GALLERY_SECTION_ID = "gallery";

function GalleryPhoto({
  photo,
  eager,
}: {
  photo: AboutGalleryImage;
  eager: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);

  // 로딩 실패 판정은 <img onError>와, 그것이 놓치는 경우를 대비한 독립적인
  // img.complete/naturalWidth 폴링을 함께 쓴다. 실패 시 DOM을 직접 조작해
  // 대체 안내를 보여준다(React state가 아니라 destination-grids.tsx와 동일한
  // 검증된 방식 — 이 파일과 별개로 이미 실서비스 코드로 쓰이고 있다).
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const check = () => {
      if (!el.isConnected) return true; // stop polling once unmounted
      if (!el.complete) return false;
      if (el.naturalWidth === 0) {
        el.style.display = "none";
        el.nextElementSibling?.classList.remove("hidden");
      }
      return true;
    };

    if (check()) return;
    const interval = window.setInterval(() => {
      if (check()) window.clearInterval(interval);
    }, 150);
    return () => window.clearInterval(interval);
  }, [photo.url]);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-strong">
      {/* eslint-disable-next-line @next/next/no-img-element -- 외부 URL 이미지, next/image 도메인 등록 없이도 항상 렌더되도록 유지 */}
      <img
        ref={imgRef}
        src={photo.url}
        alt={photo.alt}
        loading={eager ? "eager" : "lazy"}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = "none";
          event.currentTarget.nextElementSibling?.classList.remove("hidden");
        }}
      />
      <div
        role="img"
        aria-label={`${photo.alt} — 이미지를 불러오지 못했습니다`}
        className="hidden absolute inset-0 h-full w-full flex-col items-center justify-center gap-2 px-4 text-center"
      >
        <svg
          viewBox="0 0 24 24"
          width={28}
          height={28}
          fill="none"
          aria-hidden
          className="text-muted-soft"
        >
          <path
            d="M4 5h16v14H4zM4 17l5-5 3 3 5-6 3 4"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 2l20 20"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
        <p className="text-caption text-muted-soft">사진을 불러오지 못했어요</p>
      </div>
    </div>
  );
}

/**
 * SCR-002 Section 6 — 여행 Gallery. 반응형 그리드(Desktop 3열/Mobile 2열)로
 * 표시하고, 사진마다 출처·작가 캡션을 표기한다(`src/data/about.ts`, 전부 실제
 * Wikimedia Commons 사진 — DATA-REPRESENTATIVE 리비전, 2026-09-18).
 * 사진 로딩 실패 시 같은 크기의 영역 안에서 대체 안내로 바뀐다 — 그리드 칸 크기
 * (`aspect-[4/3]`)는 성공/실패 상태와 무관하게 항상 고정되어 있어 레이아웃이
 * 무너지지 않는다.
 */
export function Gallery() {
  const { gallery } = aboutData;

  return (
    <section
      id={GALLERY_SECTION_ID}
      className="mx-auto max-w-[1240px] px-5 py-16 scroll-mt-20 lg:px-10 lg:py-20"
    >
      <div>
        <h2 className="text-display-md text-ink">여행 Gallery</h2>
        <p className="text-body-md text-body mt-1">
          다녀온 여행지에서 남긴 순간들이에요.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
        {gallery.map((photo, i) => (
          <figure key={photo.url} className="flex flex-col gap-2">
            <GalleryPhoto photo={photo} eager={i < 3} />
            <figcaption className="text-caption text-muted-soft">
              {photo.alt} · {photo.photographer} ({photo.license})
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
