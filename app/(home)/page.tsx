import EventMain from "@/components/event/event-main";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_start_at", { ascending: false });

  if (error) console.error(error);

  return <EventMain events={events ?? []} />;
}
