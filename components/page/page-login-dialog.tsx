"use client";

import Link from "next/link";
import { LoaderCircle, PartyPopper } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

type PageLoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.35Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.42l-3.25-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.6-4.12H3.05v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.91A6 6 0 0 1 6.08 12c0-.66.11-1.3.32-1.91V7.5H3.05a10 10 0 0 0 0 9l3.35-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.97c1.47 0 2.78.5 3.82 1.5l2.88-2.88A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.95 5.5l3.35 2.59c.8-2.36 3-4.12 5.6-4.12Z"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3C6.48 3 2 6.47 2 10.75c0 2.74 1.84 5.14 4.61 6.52l-.93 3.43a.48.48 0 0 0 .73.52l4.05-2.69c.5.06 1.01.1 1.54.1 5.52 0 10-3.48 10-7.88S17.52 3 12 3Z"
      />
    </svg>
  );
}

export default function PageLoginDialog({
  open,
  onOpenChange,
}: PageLoginDialogProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isKakaoLoading, setIsKakaoLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    setLoginError(null);

    try {
      const supabase = createClient();
      const callbackUrl =
        window.location.hostname === "localhost"
          ? `${window.location.origin}/auth/callback`
          : "https://www.eventzoa.com/auth/callback";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) throw error;
    } catch {
      setLoginError(
        "Google 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
      setIsGoogleLoading(false);
    }
  }

  async function handleKakaoLogin() {
    setIsKakaoLoading(true);
    setLoginError(null);

    try {
      const supabase = createClient();
      const callbackUrl =
        window.location.hostname === "localhost"
          ? `${window.location.origin}/auth/callback/kakao`
          : "https://www.eventzoa.com/auth/callback/kakao";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: { redirectTo: callbackUrl },
      });

      if (error) throw error;
    } catch {
      setLoginError(
        "카카오 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
      setIsKakaoLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-3xl border-0 bg-white p-0 ring-1 ring-slate-200 sm:max-w-105">
        <div className="bg-blue-50 px-7 pt-9 pb-7 text-center sm:px-9">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-600 text-white">
            <PartyPopper className="size-7" aria-hidden="true" />
          </div>
          <DialogHeader className="mt-5 items-center gap-2">
            <DialogTitle className="font-cafe24 text-3xl font-bold text-slate-950">
              {APP_NAME}에 오신 걸 환영해요!
            </DialogTitle>
            <DialogDescription className="max-w-75 leading-6 text-slate-600 break-keep">
              간편하게 로그인하고 관심 있는 축제와 행사 소식을 만나보세요.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-3 px-7 pt-4 pb-8 sm:px-9">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isKakaoLoading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 font-bold text-slate-800 transition-colors hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isGoogleLoading ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <GoogleIcon />
            )}
            {isGoogleLoading ? "Google로 이동 중..." : "Google로 계속하기"}
          </Button>
          <Button
            type="button"
            onClick={handleKakaoLogin}
            disabled={isGoogleLoading || isKakaoLoading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#FEE500] bg-[#FEE500] px-5 font-bold text-[#191919] transition-colors hover:border-[#F5DC00] hover:bg-[#F5DC00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isKakaoLoading ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <KakaoIcon />
            )}
            {isKakaoLoading ? "카카오로 이동 중..." : "카카오로 계속하기"}
          </Button>

          {loginError && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-center text-xs leading-5 text-red-700"
            >
              {loginError}
            </p>
          )}

          <p className="pt-3 text-center text-xs leading-5 text-slate-500 break-keep">
            계속 진행하면 이벤트조아의{" "}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-3 hover:text-blue-600"
            >
              이용약관
            </Link>
            과{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-3 hover:text-blue-600"
            >
              개인정보처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
