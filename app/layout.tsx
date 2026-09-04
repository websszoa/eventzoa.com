import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";

import NaverAnalytics from "@/components/analytics/naver-analytics";
import PageFooter from "@/components/page/page-footer";
import PageHeader from "@/components/page/page-header";
import { PageLoading } from "@/components/page/page-loading";
import {
  APP_DESCRIPTION,
  APP_EMAIL,
  APP_ENG_NAME,
  APP_GOOGLE_ANALYTICS_ID,
  APP_INSTAGRAM_URL,
  APP_KEYWORDS,
  APP_NAME,
  APP_SHORT_DESCRIPTION,
  APP_SITE_URL,
  APP_SLOGAN,
  APP_THREADS_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

import "./globals.css";

const nanumSquareNeo = localFont({
  src: "../public/fonts/NanumSquareNeo-Variable.woff2",
  weight: "300 900",
  style: "normal",
  display: "block",
  variable: "--local-font-nanum",
});

const cafe24ProSlim = localFont({
  src: [
    { path: "../public/fonts/Cafe24PROSlimAir.woff2", weight: "300" },
    { path: "../public/fonts/Cafe24PROSlimFit.woff2", weight: "400" },
    { path: "../public/fonts/Cafe24PROSlimMax.woff2", weight: "700" },
  ],
  display: "block",
  variable: "--local-font-cafe24",
});

const anyvid = localFont({
  src: "../public/fonts/anyvid.woff2",
  display: "block",
  preload: false,
  variable: "--local-font-anyvid",
});

const keywords = APP_KEYWORDS.split(",").map((keyword) => keyword.trim());

export const metadata: Metadata = {
  metadataBase: new URL(APP_SITE_URL),
  title: {
    default: `${APP_NAME} | ${APP_SLOGAN}`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: APP_ENG_NAME, url: APP_SITE_URL }],
  creator: APP_ENG_NAME,
  publisher: APP_ENG_NAME,
  keywords,
  category: "축제·행사 정보",
  alternates: { canonical: "/", languages: { "ko-KR": "/" } },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: APP_NAME,
    title: `${APP_NAME} | ${APP_SLOGAN}`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} | ${APP_SLOGAN}`,
    description: APP_SHORT_DESCRIPTION,
    images: [{ url: "/icons/icon512.png", alt: `${APP_NAME} 로고` }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon192.png", sizes: "192x192" }],
    shortcut: "/icons/favicon.svg",
  },
  formatDetection: { address: false, email: false, telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#252525" },
  ],
  colorScheme: "light dark",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${APP_SITE_URL}/#organization`,
      name: APP_NAME,
      alternateName: APP_ENG_NAME,
      url: APP_SITE_URL,
      logo: `${APP_SITE_URL}/icons/icon512.png`,
      email: APP_EMAIL,
      sameAs: [APP_INSTAGRAM_URL, APP_THREADS_URL],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: APP_EMAIL,
        url: `${APP_SITE_URL}/contact`,
        availableLanguage: "Korean",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${APP_SITE_URL}/#website`,
      name: APP_NAME,
      alternateName: APP_ENG_NAME,
      url: APP_SITE_URL,
      description: APP_DESCRIPTION,
      inLanguage: "ko-KR",
      publisher: { "@id": `${APP_SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full antialiased",
        nanumSquareNeo.variable,
        cafe24ProSlim.variable,
        anyvid.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <noscript>
          <style>{`.page-loading{display:none}`}</style>
        </noscript>
        <PageLoading />
        <PageHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <PageFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${APP_GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${APP_GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
        <NaverAnalytics />
      </body>
    </html>
  );
}
