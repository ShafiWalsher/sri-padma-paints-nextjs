"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { useEffect } from "react";
import { APP_NAME, APP_NAME_SHORT } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    const isOpen =
      document.cookie
        .split("; ")
        .find((c) => c.startsWith("sidebar_state="))
        ?.split("=")[1] === "true";

    setOpen(isOpen);
  }, [setOpen]);
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-transparent transition-all duration-300 bg-background"
    >
      <SidebarHeader className="mb-4">
        {!open ? (
          <Avatar className="h-8 w-8 rounded-full bg-gray-500 text-white">
            <AvatarImage />
            <AvatarFallback className="rounded-full bg-gray-500">
              {APP_NAME_SHORT}
            </AvatarFallback>
          </Avatar>
        ) : (
          <h2
            className={` ${
              !open
                ? "hidden"
                : "truncate flex justify-center text-2xl font-medium"
            }`}
          >
            {APP_NAME}
          </h2>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
