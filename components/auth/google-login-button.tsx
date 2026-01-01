"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";

export function GoogleLoginButton() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/callback`,
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
      className="w-full text-zinc-700"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      <Image src="/icon/google.svg" alt="google" width={18} height={18} />
      {isLoading ? "구글 로그인 중..." : "구글로 로그인"}
    </Button>
  );
}
