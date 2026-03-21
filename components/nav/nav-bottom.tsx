"use client";

import Link from "next/link";
import { TentTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { mobileMenuItems } from "@/lib/menu";
import { useSheet } from "@/contexts/context-sheet";

export default function MobileNav() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { setIsOpen } = useSheet();

  const handleMoreClick = (e: React.MouseEvent, href: string) => {
    if (href === "#more") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  // 모바일
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isMore = item.href === "#more";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => isMore && handleMoreClick(e, item.href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors",
                  isActive
                    ? "text-brand"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-nanumNeo">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // PC
  return (
    <nav className="fixed bottom-4 right-0 left-0 z-30 hidden md:flex justify-center pointer-events-none">
      <div className="pointer-events-auto border bg-white/10 px-7 py-3 rounded-full flex items-center gap-5 shadow-lg backdrop-blur-md">
        <TentTree className="size-4.5 text-blue-600 shrink-0" aria-hidden />
        <span className="h-4 w-px bg-gray-200 shrink-0" />
        {mobileMenuItems.map((item) => {
          const isActive = pathname === item.href;
          const isMore = item.href === "#more";

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => isMore && handleMoreClick(e, item.href)}
              className={cn(
                "text-sm font-anyvid transition-colors",
                isActive ? "text-blue-700" : "text-black/60 hover:text-black",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
