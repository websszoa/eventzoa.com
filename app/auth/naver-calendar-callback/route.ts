import { NextResponse, type NextRequest } from "next/server";
import { createNaverEventIcalString } from "@/lib/naver-calendar";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Event } from "@/lib/types";

const NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
const NAVER_CALENDAR_API_URL = "https://openapi.naver.com/calendar/createSchedule.json";
const TOKEN_COOKIE = "naver_cal_token";
const NAVER_TOKEN_EXPIRES_SECONDS = 3600;

/**
 * 네이버 OAuth 콜백: code로 access_token 발급 후 캘린더 API로 일정 추가.
 * state = eventId
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // eventId

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isDev = process.env.NODE_ENV === "development";
  const baseUrl =
    isDev && !forwardedHost
      ? request.nextUrl.origin
      : process.env.NEXT_PUBLIC_SITE_URL ||
        (forwardedHost ? `https://${forwardedHost}` : request.nextUrl.origin);

  const makeError = (reason: string) => {
    const url = new URL("/", baseUrl);
    url.searchParams.set("naver_calendar", "error");
    url.searchParams.set("reason", reason);
    return NextResponse.redirect(url);
  };

  if (!code || !state) {
    return makeError("no_code");
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return makeError("env");
  }

  const redirectUri = `${baseUrl}/auth/naver-calendar-callback`;

  // 1. code → access_token
  const tokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
    state,
  });

  let tokenRes: Response;
  try {
    tokenRes = await fetch(`${NAVER_TOKEN_URL}?${tokenParams.toString()}`, { method: "GET" });
  } catch {
    return makeError("token_network");
  }

  if (!tokenRes.ok) {
    return makeError("token");
  }

  const tokenData = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    return makeError("token");
  }

  // 2. 이벤트 조회
  const { data: event, error: fetchError } = await supabaseAdmin
    .from("events")
    .select("id, slug, name, description, event_start_at, event_end_at, region, location")
    .eq("id", state)
    .single();

  if (fetchError || !event) {
    return makeError("event");
  }

  // 3. 네이버 캘린더 API 호출
  const scheduleIcalString = createNaverEventIcalString(event as unknown as Event);

  let calendarRes: Response;
  try {
    calendarRes = await fetch(NAVER_CALENDAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        Authorization: `Bearer ${accessToken}`,
      },
      body: new URLSearchParams({ calendarId: "defaultCalendarId", scheduleIcalString }).toString(),
    });
  } catch {
    return makeError("api_network");
  }

  if (!calendarRes.ok) {
    const errBody = await calendarRes.text();
    console.error(`네이버 캘린더 추가 실패 [${calendarRes.status}]:`, errBody);
    return makeError(`api_${calendarRes.status}`);
  }

  // 4. 성공: 토큰 쿠키 저장 후 이벤트 페이지로 리다이렉트
  const slug = (event as { slug?: string }).slug ?? state;
  const successUrl = new URL(`/event/${slug}`, baseUrl);
  successUrl.searchParams.set("naver_calendar", "success");

  const response = NextResponse.redirect(successUrl);
  response.cookies.set(TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: NAVER_TOKEN_EXPIRES_SECONDS,
    path: "/",
  });
  return response;
}
