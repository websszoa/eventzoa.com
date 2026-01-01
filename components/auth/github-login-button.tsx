"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";

export function GithubLoginButton() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "에러 발생";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full text-zinc-700 mt-2"
      onClick={handleGithubLogin}
      disabled={isLoading}
    >
      <Image src="/icon/github.svg" alt="github" width={18} height={18} />
      {isLoading ? "깃허브 로그인 중..." : "깃허브로 로그인"}
    </Button>
  );
}
