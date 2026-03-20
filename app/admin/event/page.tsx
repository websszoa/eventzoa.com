import AdminEvent from "@/components/admin/admin-event";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminMarathonPage() {
  const { data: events, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("event_start_at", { ascending: false });

  if (error) console.error(error);

  return <AdminEvent events={events ?? []} />;
}
