"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminUserMenuItems } from "@/lib/menu";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

type SidebarProfile = Pick<Profile, "id" | "full_name" | "avatar_url" | "email" | "role">;
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AdminSidebarUser() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [profile, setProfile] = useState<SidebarProfile | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // 현재 로그인된 사용자 정보 로드
  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setEmail(null);
        return;
      }
      setEmail(user.email ?? null);
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, email, role")
        .eq("id", user.id)
        .single();
      setProfile(data);
    };

    loadUser();
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("로그아웃 되었습니다.");
    router.push("/");
    router.refresh();
  };

  // 표시용 이름/이메일/아바타 fallback 계산
  const displayName = profile?.full_name?.trim() || "관리자";
  const displayEmail = email || profile?.email || "-";
  const avatarFallback = displayName.slice(0, 2).toUpperCase();
  const navigateToSite = (url: string) => {
    router.push(url);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* 사용자 정보 트리거 */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-gray-100 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {profile?.avatar_url ? (
                  <AvatarImage
                    src={profile.avatar_url}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <AvatarFallback className="rounded-lg bg-brand/10 text-brand font-semibold">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {displayEmail}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {/* 드롭다운 메뉴 */}
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* 사용자 정보 헤더 */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {profile?.avatar_url ? (
                    <AvatarImage
                      src={profile.avatar_url}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                  <AvatarFallback className="rounded-lg bg-brand/10 text-brand font-semibold">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate text-black font-medium">
                    {displayName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* 관리자 메뉴 항목 */}
            <DropdownMenuGroup>
              {adminUserMenuItems.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  onClick={() => navigateToSite(item.href)}
                >
                  <item.icon />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* 로그아웃 */}
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
