"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { NavMenuItem } from "@/types/common";
import { NAV_MENU_ITEMS } from "@/constants";

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="sr-only">Menu</SidebarGroupLabel>
      <SidebarMenu>
        {NAV_MENU_ITEMS.map((section: NavMenuItem, index: number) => {
          const hasChildren = section.childrens && section.childrens.length > 0;
          const isParentActive = hasChildren
            ? section.childrens?.some((child) => child.url === pathname)
            : false;

          if (hasChildren) {
            return (
              <Collapsible
                key={`nav-${section.title}-${index}`}
                defaultOpen={isParentActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    asChild
                    className="hover:!bg-sidebar-active/10 rounded-lg"
                  >
                    <SidebarMenuButton
                      tooltip={section.title}
                      className="w-full hover:bg-sidebar-active/10"
                    >
                      {section.icon && <section.icon className="size-5" />}
                      <span>{section.title}</span>
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.childrens?.map((child) => (
                        <SidebarMenuSubItem key={child.url}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              "w-full hover:bg-sidebar-active/10 rounded-lg",
                              pathname === child.url &&
                                "bg-sidebar-active/90 hover:bg-sidebar-active/80 hover:text-white text-white font-medium"
                            )}
                          >
                            <Link
                              href={child.url ?? "#"}
                              className="flex items-center gap-2 w-full"
                            >
                              {child.icon && <child.icon className="size-4" />}
                              <span>{child.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          } else {
            return (
              <SidebarMenuItem key={`nav-${section.title}-${index}`}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "w-full hover:bg-sidebar-active/10 rounded-lg",
                    pathname === section.url &&
                      "bg-sidebar-active/90 hover:bg-sidebar-active/80 hover:text-white text-white font-medium"
                  )}
                >
                  <Link
                    href={section.url ?? "#"}
                    className="flex items-center gap-2 w-full"
                  >
                    {section.icon && <section.icon className="size-5" />}
                    <span>{section.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
