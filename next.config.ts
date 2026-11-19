import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // 옛 축제 소식 주소 → 블로그. 검색엔진이 주소 이전을 알 수 있도록 308로 보낸다.
  async redirects() {
    return [
      { source: "/festival-news", destination: "/blog", permanent: true },
      {
        source: "/festival-news/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      // 축제 상세 주소에서 연도를 뺐다. (예: seoul-...-festival-2026 → seoul-...-festival)
      // 해마다 같은 주소를 쓰면 검색 점수가 계속 쌓인다. 옛 연도 주소는 모두 새 주소로 보낸다.
      {
        source:
          "/festivals/:base([a-z0-9-]+)-:year(20\\d{2})-:season(spring|summer|fall|winter)",
        destination: "/festivals/:base-:season",
        permanent: true,
      },
      {
        source: "/festivals/:base([a-z0-9-]+)-:year(20\\d{2})",
        destination: "/festivals/:base",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/websszoa/eventzoa.com@main/public/event/cover/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/event/cover/**",
      },
      {
        pathname: "/icons/**",
        search: "",
      },
      {
        pathname: "/images/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
