import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

export function NavUser() {
  const { open } = useSidebar();
  // Get the real user and logout function from our auth hook
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    // This will clear the session and redirect to /login
    await logout();
  };

  // If for some reason the user is not available, render nothing
  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem
        className={`relative h-[40px] flex items-center transition-all duration-150`}
      >
        <div
          className={`absolute transition-all duration-150 left-0 w-full ${
            !open && "-translate-y-10"
          }`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className={`hover:bg-transparent flex justify-start group-data-[collapsible=icon]:p-0! p-0 ml-[1px]`}
            >
              <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div className=" p-1 hover:bg-background-hover/20 rounded-full trasition-colors duration-150 overflow-hidden">
                  <Avatar className="h-6 w-6 rounded-full bg-gray-600 text-white">
                    <AvatarImage src="" alt={user.username} />
                    <AvatarFallback className="rounded-full bg-gray-600">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer hover:!bg-background-hover/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className={`absolute transition-all duration-150 right-0 p-1`}>
          <SidebarTrigger className="rounded-full hover:bg-background-hover/10" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
