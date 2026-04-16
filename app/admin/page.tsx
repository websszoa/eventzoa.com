import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const [
    { data: events },
    { data: members },
    { data: contacts },
  ] = await Promise.all([
    supabaseAdmin
      .from("events")
      .select("id, name, country, region, event_start_at, event_end_at, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, role, is_deleted, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("contacts")
      .select("id, message, status, admin_reply, created_at")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <AdminDashboard
      events={events ?? []}
      members={members ?? []}
      contacts={contacts ?? []}
    />
  );
}
