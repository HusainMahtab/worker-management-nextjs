"use client";
import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


function NavBar() {
  const { data: session, status } = useSession();
  const profileName = session?.user?.username || ""; // Ensure it's at least an empty string
  const slicedName = profileName ? (
    profileName[0] +
    (profileName.includes(" ") ? profileName[profileName.indexOf(" ") + 1] : "")
  ) : (
    <CircleUser />
  ); 
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await signOut({ redirect: false, callbackUrl: "/login" });

    if (result.url) {
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully.",
      });
      router.push(result.url);
    } else {
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex justify-between items-center p-2 md:p-0 md:px-4 bg-[#181818] fixed w-full z-20 border-b border-slate-600">
      <Link href={"/"} className="text-white">
        <span className="font-thin text-2xl">Work</span>करो
      </Link>
      {/* <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent></NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}
      <div className="flex items-center gap-3 p-1">
        <Popover>
          <div className="w-[50px] h-[50px] flex justify-center items-center bg-slate-500 rounded-full cursor-pointer">
            {session?.user ? (
              <div>
                <PopoverTrigger className="p-4">{slicedName}</PopoverTrigger>
                <PopoverContent className="grid gap-2">
                  <Link
                    href={`/profile/${session?.user.email}`}
                    className="p-2 hover:bg-slate-500 rounded"
                  >
                   My Profile
                  </Link>
                  <p onClick={handleLogout} className="p-2 hover:bg-slate-500 cursor-pointer rounded">
                    Logout
                  </p>
                </PopoverContent>
              </div>
            ) : (
              <CircleUser />
            )}
          </div>
        </Popover>
        <Link
          href={"/login"}
          className="p-2 font-semibold text-white rounded border border-slate-800 hover:border-slate-600"
        >
          SignIn
        </Link>
      </div>
    </div>
  );
}

export default NavBar;



