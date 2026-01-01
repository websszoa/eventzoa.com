"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";
import { Ghost } from "lucide-react";
import { AdminNavMain } from "./admin-nav-main";
import { AdminNavUser } from "./admin-nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user?: User | null }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent">
              <h1>
                <a
                  href="/"
                  className="w-7 h-7 bg-brand flex items-center justify-center rounded-full"
                >
                  <Ghost className="w-4 text-white" />
                </a>
                <span className="text-xl font-semibold font-paperlogy">
                  이벤트조아 관리자
                </span>
              </h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
