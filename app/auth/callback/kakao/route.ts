import { NextResponse } from "next/server";

import { sendNewMemberNotification } from "@/lib/email/notifications";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = requestUrl.searchParams.get("next");
  const safeNextPath = nextPath?.startsWith("/") ? nextPath : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) await sendNewMemberNotification(user);

      return NextResponse.redirect(new URL(safeNextPath, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/?login=error", requestUrl.origin));
}
