"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "./navbar/page";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark");
  
  useEffect(() => {
    // Apply theme to html element
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  
  const handleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <SessionProvider>
      <div>
        <NavBar />
        <div className="md:pt-[60px] pt-[70px]">
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex">
                      <SidebarTrigger className="fixed z-20" />
                      <div onClick={handleTheme} className="p-2">
                        {theme === "dark" ? (
                          <Sun className="w-4 h-4 fixed right-4 z-20" />
                        ) : (
                          <Moon className="w-4 h-4 fixed right-4 z-20" />
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>toggle sidebar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {children}
            </main>
          </SidebarProvider>
        </div>
        <Toaster />
      </div>
    </SessionProvider>
  );
} 