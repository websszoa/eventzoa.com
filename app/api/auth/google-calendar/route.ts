import { NextRequest, NextResponse } from "next/server";

const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const COOKIE_NAME = "google_calendar_token";

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  if (!eventId) {
    return NextResponse.json({ error: "eventId가 없습니다." }, { status: 400 });
  }

  // 저장된 토큰이 있으면 OAuth 없이 바로 캘린더 추가
  const savedToken = req.cookies.get(COOKIE_NAME)?.value;
  if (savedToken) {
    const { addToCalendarDirect } = await import("./_add");
    const success = await addToCalendarDirect(savedToken, eventId);

    if (success) {
      return NextResponse.redirect(`${siteUrl}/?calendar=success`);
    }
    // 토큰 만료 시 아래 OAuth 플로우로 진행
  }

  // OAuth 동의 화면으로 이동
  const redirectUri = `${siteUrl}/api/auth/google-calendar/callback`;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    access_type: "online",
    state: eventId,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
