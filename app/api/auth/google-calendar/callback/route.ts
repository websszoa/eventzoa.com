import { NextRequest, NextResponse } from "next/server";
import { addToCalendarDirect } from "../_add";

const COOKIE_NAME = "google_calendar_token";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const eventId = req.nextUrl.searchParams.get("state");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const redirectUri = `${siteUrl}/api/auth/google-calendar/callback`;

  if (!code || !eventId) {
    return NextResponse.redirect(`${siteUrl}/?calendar=error`);
  }

  // 1. Access Token 교환
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.redirect(`${siteUrl}/?calendar=error`);
  }

  // 2. 토큰 쿠키 먼저 저장 (55분) — 캘린더 추가 성공 여부와 무관하게 저장
  const isProduction = process.env.NODE_ENV === "production";

  // 3. 이벤트 캘린더 추가
  const result = await addToCalendarDirect(tokenData.access_token, eventId);

  const redirectUrl = result ? `${siteUrl}/?calendar=success` : `${siteUrl}/?calendar=error`;
  const res = NextResponse.redirect(redirectUrl);
  res.cookies.set(COOKIE_NAME, tokenData.access_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 60 * 55,
    path: "/",
  });

  return res;
}
