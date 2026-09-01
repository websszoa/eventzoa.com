import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
