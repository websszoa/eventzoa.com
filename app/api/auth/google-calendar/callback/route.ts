import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const eventId = req.nextUrl.searchParams.get("state");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  if (!code || !eventId) {
    return NextResponse.redirect(`${siteUrl}/?calendar=error`);
  }

  const redirectUri = `${siteUrl}/api/auth/google-calendar/callback`;

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

  // 2. Supabase에서 이벤트 데이터 조회
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("name, description, event_start_at, event_end_at, location, region")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    return NextResponse.redirect(`${siteUrl}/?calendar=error`);
  }

  const place = [event.region, event.location?.place].filter(Boolean).join(" ");

  // 3. Google Calendar API로 이벤트 추가
  const calendarEvent = {
    summary: event.name,
    description: event.description ?? "",
    location: place,
    start: {
      dateTime: event.event_start_at
        ? new Date(event.event_start_at).toISOString()
        : new Date().toISOString(),
      timeZone: "Asia/Seoul",
    },
    end: {
      dateTime: event.event_end_at
        ? new Date(event.event_end_at).toISOString()
        : new Date().toISOString(),
      timeZone: "Asia/Seoul",
    },
  };

  const calRes = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendarEvent),
    }
  );

  if (!calRes.ok) {
    return NextResponse.redirect(`${siteUrl}/?calendar=error`);
  }

  return NextResponse.redirect(`${siteUrl}/?calendar=success`);
}
