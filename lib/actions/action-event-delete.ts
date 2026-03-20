"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function deleteEventByAdmin(id: string) {
  const { error } = await supabaseAdmin.from("events").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
