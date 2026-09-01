import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "websszoa.github.io",
        pathname: "/eventzoa.com/event/cover/**",
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
