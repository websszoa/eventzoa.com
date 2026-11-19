import Link from "next/link";

import { Button } from "@/components/ui/button";
import { adminMenu } from "@/lib/navigation";
import { cn } from "@/lib/utils";

// 관리자 페이지 상단 메뉴. 항목은 lib/navigation.ts의 adminMenu를 따른다.
export default function PageAdminNav({ activeHref }: { activeHref: string }) {
  return (
    <nav aria-label="관리자 메뉴" className="mt-6 flex flex-wrap gap-2">
      {adminMenu.map((item) => {
        const Icon = item.icon;
        const active = item.href === activeHref;

        return (
          <Button
            key={item.href}
            nativeButton={false}
            render={
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
              />
            }
            variant={active ? "default" : "outline"}
            className={cn(
              "h-10 rounded-full px-4",
              active
                ? "font-bold"
                : "bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}
