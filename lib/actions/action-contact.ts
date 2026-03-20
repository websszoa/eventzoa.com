"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Contact } from "@/lib/types";

interface UpdateContactPayload {
  id: string;
  status: Contact["status"];
  adminReply: string;
}

export async function updateContactByAdmin(
  payload: UpdateContactPayload,
): Promise<Contact> {
  const { id, status, adminReply } = payload;

  const isResolved = status === "resolved" || status === "closed";

  const { data, error } = await supabaseAdmin
    .from("contacts")
    .update({
      status,
      admin_reply: adminReply.trim() || null,
      resolved_at: isResolved ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Contact;
}
