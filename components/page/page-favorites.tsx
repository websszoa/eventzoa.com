"use client";

import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/context-auth";
import PageLogin from "@/components/page/page-login";
import PageNoData from "@/components/page/page-no-data";

export default function PageFavorites() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-16 px-6 text-center">
        <p className="text-sm text-muted-foreground font-anyvid">
          즐겨찾기 정보를 확인하는 중입니다.
        </p>
      </div>
    );
  }

  if (!user) {
    return <PageLogin />;
  }

  return (
    <PageNoData
      icon={Heart}
      title="아직 저장된 즐겨찾기가 없습니다."
      description="관심 있는 이벤트를 추가해보세요!"
    />
  );
}
