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
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

export function AppSidebar() {
  const { data: session } = useSession();
  const { setOpenMobile } = useSidebar();
  const currentUser = session?.user.username;
  const slicedName = currentUser ? (
    currentUser[0] +
    (currentUser.includes(" ") ? currentUser[currentUser.indexOf(" ") + 1] : "")
  ) : (
    <CircleUser />
  );

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <div>
      <Sidebar className="mt-[58px]">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" onClick={handleLinkClick} className="w-full">
                <div className="flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <HomeIcon className="h-4 w-4" />
                  <span>Home</span>
                </div>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="#" onClick={handleLinkClick} className="w-full">
                <div className="flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Users className="h-4 w-4" />
                  <span>Workers</span>
                </div>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="#" onClick={handleLinkClick} className="w-full">
                <div className="flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </div>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="#" onClick={handleLinkClick} className="w-full">
                <div className="flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </div>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              {session?.user && (
                <Link href="/become-worker" onClick={handleLinkClick} className="w-full">
                  <div className="flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <Users className="h-4 w-4" />
                    <span>Become a Worker</span>
                  </div>
                </Link>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="fixed bottom-0 left-0 right-0">
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
