import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
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
