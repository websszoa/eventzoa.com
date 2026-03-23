import { NextResponse, type NextRequest } from "next/server";
import { getNaverCalendarAuthorizeUrl, createNaverEventIcalString } from "@/lib/naver-calendar";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Event } from "@/lib/types";

const NAVER_CALENDAR_API_URL = "https://openapi.naver.com/calendar/createSchedule.json";
const TOKEN_COOKIE = "naver_cal_token";

/**
 * GET /api/auth/naver-calendar?eventId=...
 * 1) 쿠키에 저장된 토큰이 있으면 OAuth 없이 바로 캘린더 API 호출
 * 2) 없거나 만료되었으면 네이버 OAuth 인증 페이지로 리다이렉트
 */
export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

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

  // 캐시된 토큰으로 OAuth 없이 바로 API 호출 시도
  const cachedToken = request.cookies.get(TOKEN_COOKIE)?.value;
  if (cachedToken) {
    const { data: event, error } = await supabaseAdmin
      .from("events")
      .select("id, slug, name, description, event_start_at, event_end_at, region, location")
      .eq("id", eventId)
      .single();

    if (!error && event) {
      const scheduleIcalString = createNaverEventIcalString(event as unknown as Event);
      try {
        const calendarRes = await fetch(NAVER_CALENDAR_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${cachedToken}`,
          },
          body: new URLSearchParams({ calendarId: "defaultCalendarId", scheduleIcalString }).toString(),
        });

        if (calendarRes.ok) {
          const slug = (event as { slug?: string }).slug ?? eventId;
          const successUrl = new URL(`/event/${slug}`, baseUrl);
          successUrl.searchParams.set("naver_calendar", "success");
          return NextResponse.redirect(successUrl);
        }
        // 401/403: 토큰 만료 → 쿠키 지우고 OAuth로 진행
      } catch {
        // 에러 시 OAuth로 진행
      }
    }
  }

  // OAuth 인증 페이지로 리다이렉트
  const redirectUri = `${baseUrl}/auth/naver-calendar-callback`;
  const url = getNaverCalendarAuthorizeUrl(redirectUri, eventId);
  if (!url) {
    return makeError("env");
  }

  const response = NextResponse.redirect(url);
  if (cachedToken) {
    response.cookies.delete(TOKEN_COOKIE);
  }
  return response;
}
