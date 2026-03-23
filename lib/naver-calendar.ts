import type { Event } from "@/lib/types";
import { APP_SITE_URL } from "@/lib/constants";

/** RFC 5545 ICS 라인 폴딩: 75옥텟 초과 시 CRLF + 공백으로 분리 */
function icsFold(line: string): string {
  const maxBytes = 75;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(line);
  if (bytes.length <= maxBytes) return line;

  const result: string[] = [];
  let start = 0;
  let first = true;
  while (start < bytes.length) {
    const limit = first ? maxBytes : maxBytes - 1;
    let end = start + limit;
    if (end >= bytes.length) {
      result.push((first ? "" : " ") + new TextDecoder().decode(bytes.slice(start)));
      break;
    }
    while (end > start && (bytes[end] & 0xc0) === 0x80) end--;
    result.push((first ? "" : " ") + new TextDecoder().decode(bytes.slice(start, end)));
    start = end;
    first = false;
  }
  return result.join("\r\n");
}

const icsEscape = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");

const toIcsDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
};

const toIcsUtc = (d: Date) =>
  d.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 15) + "Z";

/** 네이버 캘린더 API용 iCalendar 문자열 생성 */
export function createNaverEventIcalString(event: Pick<Event, "id" | "slug" | "name" | "description" | "event_start_at" | "event_end_at" | "region" | "location">): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? APP_SITE_URL;
  const eventUrl = `${siteUrl}/event/${event.slug}`;

  const summary = icsEscape(event.name || "이벤트");
  const location = icsEscape(
    [event.region, (event.location as { place?: string } | null)?.place]
      .filter(Boolean)
      .join(" ") || "",
  );

  const descLines = [event.name || "이벤트"];
  if (event.description) descLines.push(event.description);
  descLines.push("", `자세히 보기 : ${eventUrl}`, `이벤트조아 : ${siteUrl}`);
  const description = icsEscape(descLines.join("\n"));

  const start = event.event_start_at ? new Date(event.event_start_at) : null;
  const endRaw = event.event_end_at ? new Date(event.event_end_at) : null;
  const endNext = endRaw
    ? new Date(endRaw.getTime() + 24 * 60 * 60 * 1000)
    : start
      ? new Date(start.getTime() + 24 * 60 * 60 * 1000)
      : null;

  const dtStart = start ? `DTSTART;VALUE=DATE:${toIcsDate(start)}` : "";
  const dtEnd = endNext ? `DTEND;VALUE=DATE:${toIcsDate(endNext)}` : "";

  const uid = `${event.id.replace(/-/g, "")}@eventzoa.com`;
  const now = new Date();
  const dtstamp = toIcsUtc(now);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:Naver Calendar",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "SEQUENCE:0",
    "CLASS:PUBLIC",
    "TRANSP:OPAQUE",
    `UID:${uid}`,
    dtStart,
    dtEnd,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    ...(location ? [`LOCATION:${location}`] : []),
    `DTSTAMP:${dtstamp}`,
    `CREATED:${dtstamp}`,
    `LAST-MODIFIED:${dtstamp}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.map(icsFold).join("\r\n");
}

/** 네이버 캘린더 OAuth 인증 URL (state에 eventId 전달). 서버 전용. */
export function getNaverCalendarAuthorizeUrl(redirectUri: string, state: string): string {
  const clientId = process.env.NAVER_CLIENT_ID;
  if (!clientId) return "";
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: "calendar",
  });
  return `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`;
}
