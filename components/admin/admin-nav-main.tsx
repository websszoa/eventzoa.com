"use client";

import { useAdmin } from "@/contexts/admin-context";
import { adminMenuItems } from "@/lib/menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type AdminView = "dashboard" | "events" | "notice" | "report";

const viewMap: Record<string, AdminView> = {
  "/admin": "dashboard",
  "/admin/events": "events",
  "/admin/notice": "notice",
  "/admin/report": "report",
};

export function AdminNavMain() {
  const { currentView, setCurrentView } = useAdmin();

  const handleMenuClick = (href: string) => {
    const view = viewMap[href] || "dashboard";
    setCurrentView(view);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {adminMenuItems.map((item) => {
            const view = viewMap[item.href] || "dashboard";
            const isActive = currentView === view;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={isActive}
                  onClick={() => handleMenuClick(item.href)}
                  className={
                    isActive
                      ? "data-[active=true]:bg-brand! data-[active=true]:text-white"
                      : ""
                  }
                >
                  {item.icon && <item.icon />}
                  <span className="font-nanumNeo text-sm">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
