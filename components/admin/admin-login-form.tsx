"use client";

import * as React from "react";
import { Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        setErrorMessage(json?.message ?? "로그인에 실패했습니다.");
        return;
      }

      // 로그인 성공 시 페이지 새로고침
      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 font-nanumNeo">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-bold text-brand">관리자 로그인</h1>
          <p className="mt-2 text-sm font-nanumNeo text-muted-foreground">
            관리자 전용 페이지입니다. 비밀번호를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="block space-y-2">
            <input
              type="password"
              autoComplete="current-password"
              className="w-full rounded border border-gray-200 px-4 py-2 text-sm font-nanumNeo focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="어드민 비밀번호를 입력하세요"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />
          </label>

          {errorMessage && (
            <p className="text-sm font-nanumNeo text-red-500">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/50"
            disabled={isSubmitting}
          >
            <LogIn className="h-4 w-4" />
            {isSubmitting ? "확인 중..." : "접속하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
