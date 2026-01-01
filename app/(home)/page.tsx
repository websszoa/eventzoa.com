import { createClient } from "@/lib/supabase/server";
import EventList from "@/components/event/event-list";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*");

  console.log("Supabase Data:", events);

  return (
    <>
      <EventList events={events ?? []} />
    </>
  );
}
