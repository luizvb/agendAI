"use client";

import { ChevronsUpDown, LogOut, Edit3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { signOutAction } from "@/actions/sign-out-action";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const [username, setUsername] = useState(user?.decodedToken?.username || "");
  const [phone, setPhone] = useState(user?.decodedToken?.phone || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  console.log(user);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.decodedToken?.image}
                  alt={user?.decodedToken?.username}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.decodedToken?.username}
                </span>
                <span className="truncate text-xs">
                  {user?.decodedToken?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.decodedToken?.image}
                    alt={user?.decodedToken?.username}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.decodedToken?.username}
                  </span>
                  <span className="truncate text-xs">
                    {user?.decodedToken?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <div className="flex items-center">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nome"
                    className="mt-1 block w-full"
                    disabled={!isEditingName}
                  />
                  <Edit3
                    className="ml-2 cursor-pointer"
                    onClick={() => setIsEditingName(!isEditingName)}
                  />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div className="flex items-center">
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Celular"
                    className="mt-1 block w-full"
                    disabled={!isEditingPhone}
                  />
                  <Edit3
                    className="ml-2 cursor-pointer"
                    onClick={() => setIsEditingPhone(!isEditingPhone)}
                  />
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                signOutAction();
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
