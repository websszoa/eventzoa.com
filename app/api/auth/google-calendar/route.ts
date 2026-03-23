import { NextRequest, NextResponse } from "next/server";

const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "eventId가 없습니다." }, { status: 400 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google-calendar/callback`;

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
