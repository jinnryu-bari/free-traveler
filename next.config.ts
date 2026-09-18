import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // C-SCR002-GALLERY의 next/image가 Wikimedia Commons 사진을 직접 최적화하려면
    // 원격 도메인을 명시적으로 허용해야 한다(그 외 도메인은 여전히 <img> 태그로
    // 렌더링하고 next/image를 쓰지 않는다 — 이 프로젝트 전체를 next/image로
    // 강제 전환하지 않는다).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
        pathname: "/wiki/Special:FilePath/**",
      },
    ],
  },
};

export default nextConfig;
