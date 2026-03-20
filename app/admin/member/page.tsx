import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminMember from "@/components/admin/admin-member";

export default async function AdminMemberPage() {
  const { data: members, error } = await supabaseAdmin
    .from("profiles")
    .select(
      "id, email, full_name, avatar_url, signup_provider, role, visit_count, is_deleted, created_at, updated_at, deleted_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return <AdminMember members={members ?? []} />;
}
