"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";

export default function AuthToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const welcome = searchParams.get("welcome");
    const calendar = searchParams.get("calendar");

    if (calendar === "success") {
      toast.success("구글 캘린더에 일정이 추가되었습니다.");
    }
    if (calendar === "error") {
      toast.error("캘린더 추가에 실패했습니다. 다시 시도해주세요.");
    }

    // 로그인/이메일 인증 성공
    if (welcome === "true") {
      toast.success("로그인이 되었습니다.");
    }

    // 탈퇴한 계정
    if (error === "deleted_account") {
      toast.error("탈퇴한 계정입니다. 관리자에게 문의해주세요.");
    }

    // 에러 발생
    if (error === "error_code") {
      toast.error("에러 발생!. 관리자에게 문의해주세요.");
    }

    // 표시한 뒤 URL에서 제거
    if (welcome || error || calendar) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("welcome");
      newParams.delete("error");
      newParams.delete("calendar");
      const newUrl = newParams.toString()
        ? `${pathname}?${newParams.toString()}`
        : pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router, pathname]);

  return null;
}
