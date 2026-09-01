import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
