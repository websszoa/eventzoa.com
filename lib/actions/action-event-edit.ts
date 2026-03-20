"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type {
  Event,
  EventHosts,
  EventImages,
  EventLocation,
  EventRegistrationPrice,
  EventSNS,
  RegistrationStatus,
} from "@/lib/types";

type EventEditPayload = {
  id: string;
  year: number;
  month: number;
  country: string;
  region: string;
  name: string;
  slug: string;
  description: string;
  event_start_at: string;
  event_end_at: string | null;
  event_scale: number | null;
  event_type: string | null;
  event_site: string | null;
  event_program: string | null;
  location: EventLocation | null;
  registration_status: RegistrationStatus | null;
  registration_start_at: string | null;
  registration_end_at: string | null;
  registration_add_start_at: string | null;
  registration_add_end_at: string | null;
  registration_price: EventRegistrationPrice | null;
  images: EventImages | null;
  hosts: EventHosts | null;
  sns: EventSNS | null;
};

export async function updateEventByAdmin(
  payload: EventEditPayload,
): Promise<Event> {
  const { id, ...fields } = payload;

  const { data, error } = await supabaseAdmin
    .from("events")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Event;
}
