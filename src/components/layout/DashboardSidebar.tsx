/** @format */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Stethoscope,
} from "lucide-react";

// Adjust these links for all roles, or create a dynamic list based on role
const sidebarLinks = [
  { href: "/dashboard/doctor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/patients", label: "My Patients", icon: Users },
  { href: "/dashboard/schedule", label: "Schedule", icon: Calendar },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen px-4 py-8 bg-gray-900 text-white border-r sticky top-0">
      <Link
        href="/"
        className="text-2xl font-bold text-white hover:text-gray-200 flex items-center mb-8"
        aria-label="NexusCare Home"
      >
        <Stethoscope className="h-8 w-8 mr-2 text-sky-400" />
        NexusCare
      </Link>

      <nav className="flex flex-col space-y-2">
        {sidebarLinks.map((link) => {
          // Check if the current path starts with the link href for highlighting
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sky-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
