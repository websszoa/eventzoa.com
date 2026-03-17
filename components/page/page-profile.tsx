"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import type { Profile } from "@/lib/types";

import PageLogin from "@/components/page/page-login";
import PageProfileInfo from "@/components/page/page-profile-info";

export default function PageProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const profileLoading = !!user && loadedUserId !== user.id;

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const supabase = createClient();

    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          toast.error("프로필 정보를 불러오지 못했습니다.");
          setProfile(null);
          setLoadedUserId(user.id);
          return;
        }

        setProfile(data);
        setLoadedUserId(user.id);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (authLoading || profileLoading) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 px-6 text-center">
        <p className="text-sm text-muted-foreground font-anyvid">
          프로필 정보를 불러오는 중입니다.
        </p>
      </div>
    );
  }

  if (!user) {
    return <PageLogin />;
  }

  return <PageProfileInfo profile={profile} />;
}
