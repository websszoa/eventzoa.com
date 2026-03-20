"use client";

import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminEventHeader({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <div className="event__header flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-2xl font-semibold font-paperlogy">이벤트 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground font-anyvid">
          전체 이벤트 목록을 확인하고 관리할 수 있습니다.
        </p>
      </div>
      {/* 이벤트 추가 버튼 */}
      <Button
        variant="destructive"
        className="w-full md:w-auto"
        onClick={() => onOpenChange(true)}
      >
        <CirclePlus />
        이벤트 추가
      </Button>
    </div>
  );
}
