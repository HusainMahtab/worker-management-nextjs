"use client";

import Link from "next/link";
import { HomeIcon, Users, Bell, Settings, CircleUser } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

export function AppSidebar() {
  const { data: session } = useSession();
  const currentUser = session?.user.username;
  const slicedName = currentUser ? (
    currentUser[0] +
    (currentUser.includes(" ") ? currentUser[currentUser.indexOf(" ") + 1] : "")
  ) : (
    <CircleUser />
  );
  return (
    <div>
      <Sidebar className="mt-[58px]">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <HomeIcon className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Users className="h-4 w-4" />
                  <span>Workers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              {session?.user && (
                <SidebarMenuButton asChild>
                  <Link href="/become-worker">
                    <Users className="h-4 w-4" />
                    <span>Become a Worker</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="md:mb-16">
          <div className="w-full h-full flex gap-4 items-center">
            <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full bg-slate-500">
              <p className="p-2">{slicedName}</p>
            </div>
            <p>{currentUser}</p>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
