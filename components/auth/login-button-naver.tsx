"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginButtonNaver() {
  const [loading, setLoading] = useState(false);

  const loginWithNaver = async () => {
    setLoading(true);
    try {
      window.location.href = "/api/auth/naver";
    } catch {
      toast.error("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={loginWithNaver}
      disabled={loading}
      className="w-full h-11 flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#03C75A]/80 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-anyvid">로그인 중...</span>
        </>
      ) : (
        <>
          <Image
            src="/svg/naver.svg"
            alt="네이버"
            width={20}
            height={20}
            className="shrink-0"
          />
          <span className="font-anyvid">네이버 로그인</span>
        </>
      )}
    </Button>
  );
}
