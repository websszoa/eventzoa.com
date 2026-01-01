"use client";

import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AdminNavUser({ user }: { user?: User | null }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  // 사용자 정보
  const userData = user
    ? {
        name: user.user_metadata?.display_name || "",
        email: user.email || "",
        avatar: user.user_metadata?.avatar_url || "",
      }
    : {
        name: "Admin",
        email: "",
        avatar: "",
      };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.refresh();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {userData.avatar ? (
                <div className="bg-red-100 p-1 rounded-full w-9 h-9 overflow-hidden">
                  <img src={userData.avatar} alt={userData.name} className="h-8 w-8 object-cover" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center">
                  <IconUserCircle className="h-5 w-5 text-gray-600" />
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="text-muted-foreground truncate text-xs">{userData.email}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                eventzoa.com
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                cafezoa.com
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                runzoa.com
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
