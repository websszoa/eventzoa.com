"use client";

import Script from "next/script";

import { APP_NAVER_ANALYTICS_ID } from "@/lib/constants";

type NaverAnalyticsWindow = Window & {
  wcs_add?: Record<string, string>;
  wcs_do?: () => void;
};

function initializeNaverAnalytics() {
  const naverWindow = window as NaverAnalyticsWindow;

  naverWindow.wcs_add = naverWindow.wcs_add || {};
  naverWindow.wcs_add.wa = APP_NAVER_ANALYTICS_ID;
  naverWindow.wcs_do?.();
}

export default function NaverAnalytics() {
  return (
    <Script
      src="https://wcs.pstatic.net/wcslog.js"
      strategy="afterInteractive"
      onReady={initializeNaverAnalytics}
    />
  );
}
