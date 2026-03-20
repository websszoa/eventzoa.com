"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAccessDenied() {
  const router = useRouter();

  // 홈으로 이동
  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6">
        {/* 접근 불가 안내 */}
        <div className="flex flex-col items-center text-center">
          <ShieldAlert className="w-16 h-16 text-brand/20 mx-auto mb-4" />
          <h1 className="text-gray-700 font-nanumNeo text-xl mb-1">
            접근 권한이 없습니다
          </h1>
          <p className="text-sm text-muted-foreground font-anyvid mb-4">
            관리자 전용 페이지입니다.
            <br />
            관리자 권한이 있는 계정으로만 접근할 수 있습니다.
          </p>
          <Button
            variant="destructive"
            size="lg"
            className="flex items-center"
            onClick={handleGoHome}
          >
            홈으로 가기
          </Button>
        </div>
      </div>
    </div>
  );
}
