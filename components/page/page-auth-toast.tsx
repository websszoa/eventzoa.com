"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const LOGIN_MESSAGES = {
  success: () => toast.success("로그인되었어요. 반가워요!"),
  error: () =>
    toast.error("로그인에 실패했어요. 잠시 후 다시 시도해 주세요."),
} as const;

export default function PageAuthToast() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get("login");

    if (status !== "success" && status !== "error") return;

    LOGIN_MESSAGES[status]();

    // 새로고침이나 공유 시 토스트가 다시 뜨지 않도록 주소에서 제거한다.
    url.searchParams.delete("login");
    window.history.replaceState(window.history.state, "", url);
  }, []);

  return null;
}
