import Link from "next/link";
import { House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { APP_SLOGAN } from "@/lib/constants";

export function AdminSiteHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* 사이드바 토글 */}
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 mt-2.5"
        />
        {/* 앱 슬로건 */}
        <p className="text-sm font-anyvid">{APP_SLOGAN}</p>
        {/* 홈 바로가기 */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="link"
            asChild
            size="sm"
            className="flex bg-gray-50 size-9 p-0"
          >
            <Link href="/" className="dark:text-foreground" aria-label="홈">
              <House className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
