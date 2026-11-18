import type { Metadata } from "next";

import { APP_NAME, APP_SITE_URL } from "@/lib/constants";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  image = "/images/eventzoa-og.webp",
  publishedTime,
  keywords,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "ko_KR",
      siteName: APP_NAME,
      url: path,
      title,
      description,
      images: [{ url: image, alt: title }],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image, alt: title }],
    },
  };
}

export function absoluteUrl(path: string) {
  return new URL(path, APP_SITE_URL).toString();
}
