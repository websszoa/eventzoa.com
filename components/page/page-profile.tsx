"use client";

import { Separator } from "@/components/ui/separator";
import type { User } from "@supabase/supabase-js";
import PageProfileImage from "./page-profile-image";
import PageProfileItem from "./page-profile-item";

interface PageProfileProps {
  user: User;
}

export default function PageProfile({ user }: PageProfileProps) {
  return (
    <div className="contact__container space-y-6 border p-4 md:p-6 rounded-2xl">
      <PageProfileImage user={user} />
      <Separator />
      <PageProfileItem user={user} />
    </div>
  );
}
