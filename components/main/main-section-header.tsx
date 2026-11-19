import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MainSectionHeaderProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  action?: { href: string; label: string };
  /** 섹션 배경이 slate-50이면 배지를 흰 바탕으로 띄운다. */
  tone?: "white" | "slate";
};

// 메인 섹션 공통 머리말: 배지 + 제목 + 설명 + 오른쪽 이동 버튼
export default function MainSectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
  tone = "white",
}: MainSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Badge
          variant="secondary"
          className={cn(
            "mb-2 h-auto gap-1.5 rounded-full px-3 py-1.5 font-bold text-blue-700",
            tone === "white" ? "bg-blue-50" : "bg-white ring-1 ring-slate-200",
          )}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          {eyebrow}
        </Badge>
        <h2 className="font-cafe24 text-4xl leading-tight font-bold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h2>
        <p className="mt-3 font-anyvid text-sm leading-6 break-keep text-slate-500 sm:text-base">
          {description}
        </p>
      </div>

      {action && (
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={action.href} />}
          className={cn(
            "self-start rounded-full border-slate-200 px-5 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:self-auto",
            tone === "slate" && "bg-white",
          )}
        >
          {action.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
