/** @format */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext"; // 1. Import useAuth
import { ROLE_SIDEBAR_LINKS } from "@/lib/navLinks"; // 2. Import the role map

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth(); // 3. Get the user from the auth context

  // 4. Determine the user's role (with fallbacks)
  const userRole = (user?.user_type || user?.role || "patient")
    .toString()
    .toLowerCase();

  // 5. Select the correct links based on the role
  // Fallback to an empty array if the role has no defined links
  const sidebarLinks = ROLE_SIDEBAR_LINKS[userRole] || [];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen px-4 py-8 bg-slate-50 text-gray-800 border-r sticky top-0">
      <Link
        href="/"
        className="text-2xl font-bold text-sky-600 hover:text-sky-700 flex items-center mb-8"
        aria-label="NexusCare Home"
      >
        <Stethoscope className="h-8 w-8 mr-2 text-sky-500" />
        NexusCare
      </Link>

      <nav className="flex flex-col space-y-2">
        {/* 6. The map function now uses the dynamic sidebarLinks array */}
        {sidebarLinks.map((link) => {
          // Check if the current path starts with the link href for highlighting
          // Use startsWith for parent routes (e.g., /dashboard/doctor should match /dashboard/doctor/patients)
          // But check for exact match for the main dashboard link
          const isActive =
            link.href === `/dashboard/${userRole}`
              ? pathname === link.href
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sky-600 text-white shadow"
                  : "text-gray-700 hover:bg-sky-100"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <link.icon className="h-5 w-5 text-sky-600" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
