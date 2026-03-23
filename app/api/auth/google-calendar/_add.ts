import { createClient } from "@/lib/supabase/server";

export async function addToCalendarDirect(accessToken: string, eventId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("name, description, event_start_at, event_end_at, location, region")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) return false;

  const place = [event.region, event.location?.place].filter(Boolean).join(" ");

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

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendarEvent),
    }
  );

  return res.ok;
}
