import Image from "next/image";
import { aboutData } from "@/data/about";

export const GALLERY_SECTION_ID = "gallery";

/**
 * SCR-002 Section 6 — 여행 Gallery. `next/image`로 반응형+lazy load(첫 3장 제외)를
 * 적용하고, 사진마다 출처·작가 캡션을 표기한다(`src/data/about.ts`, 전부 실제
 * Wikimedia Commons 사진 — DATA-REPRESENTATIVE 리비전, 2026-09-18).
 */
export function Gallery() {
  const { gallery } = aboutData;

  return (
    <section id={GALLERY_SECTION_ID} className="mx-auto max-w-[1240px] px-5 py-16 scroll-mt-20 lg:px-10 lg:py-20">
      <div>
        <h2 className="text-display-md text-ink">여행 Gallery</h2>
        <p className="text-body-md text-body mt-1">다녀온 여행지에서 남긴 순간들이에요.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
        {gallery.map((photo, i) => (
          <figure key={photo.url} className="flex flex-col gap-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-strong">
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                loading={i < 3 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="text-caption text-muted-soft">
              {photo.alt} · {photo.photographer} ({photo.license})
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
