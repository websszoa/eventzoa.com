"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/types";

interface UpdateMemberPayload {
  id: string;
  full_name?: string;
  role: string;
  visit_count: number;
  is_deleted: boolean;
  created_at: string;
}

export async function updateMemberByAdmin(
  payload: UpdateMemberPayload,
): Promise<Profile> {
  const { id, ...fields } = payload;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}
