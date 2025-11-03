/** @format */
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Settings,
} from "lucide-react";

// Re-define links for the mobile drawer
const mobileSidebarLinks = [
  { href: "/doctor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/patients", label: "My Patients", icon: Users },
  { href: "/doctor/schedule", label: "Schedule", icon: Calendar },
  { href: "/doctor/messages", label: "Messages", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  const getInitials = () => {
    if (!user) return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  return (
    <header className="flex h-16 items-center justify-between bg-white px-6 border-b sticky top-0 z-40">
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="flex justify-between items-center p-4 border-b">
              <DrawerTitle className="text-xl font-semibold text-sky-700">
                Menu
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" aria-label="Close menu">
                  <X className="h-6 w-6" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className="p-4">
              <ul className="space-y-2">
                {mobileSidebarLinks.map((link) => (
                  <li key={link.href}>
                    <DrawerClose asChild>
                      <Link
                        href={link.href}
                        className="flex items-center space-x-3 py-2 px-3 text-lg rounded-md text-gray-700 hover:text-sky-600 hover:bg-sky-50"
                      >
                        <link.icon className="h-5 w-5" />
                        <span>{link.label}</span>
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
              </ul>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Placeholder for search or breadcrumbs (optional) */}
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold text-gray-700">
          Doctor Dashboard
        </h2>
      </div>

      {/* Avatar Dropdown */}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.profile_picture_url || ""}
                  alt="User avatar"
                />
                <AvatarFallback className="bg-sky-100 text-sky-700 font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">
                Dr. {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Account Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={logout} className="text-red-500">
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
