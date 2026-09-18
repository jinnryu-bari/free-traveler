import type { Metadata } from "next";

const SITE_NAME = "free_traveler";
const OG_LOCALE = "ko_KR";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
}

/**
 * 각 Page Owner Task가 자신의 `page.tsx`에서 호출해 `export const metadata`로
 * 사용하는 빌더. 이 파일은 Page Entry를 소유하지 않는다(rule 16).
 */
export function buildMetadata({
  title,
  description,
  path,
}: BuildMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      type: "website",
    },
  };
}
