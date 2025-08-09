"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { APP_NAME, APP_NAME_SHORT } from "@/constants";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, setOpen } = useSidebar();

  const pathname = usePathname();

  useEffect(() => {
    const isOpen =
      document.cookie
        .split("; ")
        .find((c) => c.startsWith("sidebar_state="))
        ?.split("=")[1] === "true";

    if (!isOpen) {
      setOpen(true);
    }

    document.cookie = "sidebar_state=true; path=/; max-age=31536000";
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
        <SidebarGroup>
          <SidebarGroupLabel className="sr-only">Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  "w-full hover:bg-sidebar-active/10 rounded-lg",
                  pathname === "/" &&
                    "bg-sidebar-active/90 hover:bg-sidebar-active/80 hover:text-white text-white font-medium"
                )}
              >
                <Link href={"/"} className="flex items-center gap-2 w-full">
                  <LayoutDashboard
                    className={cn("size-5", pathname === "/" && "!text-white")}
                  />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Main Nav Menu */}
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail className="hover:after:bg-black/10" />
    </Sidebar>
  );
}
