import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { SheetProvider } from "@/contexts/sheet-context";
import MobileNav from "@/components/header/mobile-nav";
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_KEYWORDS,
  APP_SITE_URL,
} from "@/lib/constants";

const nanumSquare = localFont({
  variable: "--font-nanumNeo",
  display: "swap",
  src: [
    {
      path: "../public/fonts/NanumSquareNeo-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

const paperlogy = localFont({
  variable: "--font-paperlogy",
  display: "swap",
  src: [
    {
      path: "../public/fonts/Paperlogy-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} | 전국 축제·이벤트 통합 플랫폼`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS.split(", "),
  metadataBase: new URL(APP_SITE_URL),
  openGraph: {
    title: `${APP_NAME} | 전국 축제·이벤트 통합 플랫폼`,
    description: APP_DESCRIPTION,
    url: APP_SITE_URL,
    siteName: APP_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/eventzoa.jpg",
        width: 1200,
        height: 800,
        alt: `${APP_NAME} 전국 축제·이벤트 통합 플랫폼`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | 전국 축제·이벤트 통합 플랫폼`,
    description: APP_DESCRIPTION,
    images: ["/eventzoa.jpg"],
    creator: "@eventzoa_official",
  },
  icons: {
    icon: [
      { url: "/icon/icon96.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/icon96.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/icon96.png", sizes: "48x48", type: "image/png" },
      { url: "/icon/icon96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon/icon192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon/icon512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${nanumSquare.variable} ${paperlogy.variable}`}>
        <SheetProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                title: "font-nanumNeo",
                description: "font-nanumNeo text-xs",
              },
            }}
          />
          {children}
          <MobileNav />
        </SheetProvider>
      </body>
    </html>
  );
}
