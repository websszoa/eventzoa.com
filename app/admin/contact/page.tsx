import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminContact from "@/components/admin/admin-contact";

export default async function AdminContactPage() {
  const { data: contacts, error } = await supabaseAdmin
    .from("contacts")
    .select(
      "id, user_id, user_email, message, status, admin_reply, admin_id, resolved_at, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return <AdminContact contacts={contacts ?? []} />;
}
