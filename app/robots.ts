import type { MetadataRoute } from "next";

import { APP_SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 관리자·API·로그인 콜백·마이페이지는 검색 대상이 아니다.
      disallow: ["/admin", "/api", "/auth", "/mypage"],
    },
    sitemap: `${APP_SITE_URL}/sitemap.xml`,
    host: APP_SITE_URL,
  };
}
