/** @format */
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMediaUrl } from "@/lib/utils";
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
import { Menu, X, Bell, Search, ChevronDown } from "lucide-react";
import { ROLE_SIDEBAR_LINKS } from "@/lib/navLinks";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const userRole = (user?.user_type || user?.role || "patient")
    .toString()
    .toLowerCase();
  const mobileSidebarLinks = ROLE_SIDEBAR_LINKS[userRole] || [];
  const profile_link = `/dashboard/${userRole}/profile`;
  const settings_link = `/dashboard/${userRole}/settings`;

  const getInitials = () => {
    if (!user) return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  const resolveProfileImageUrl = (
    user:
      | {
          profile_picture_url?: string | null;
          profile_pic_url?: string | null;
          profile_pic?: string | null;
        }
      | null
      | undefined,
  ): string | undefined => {
    const urlCandidates = [
      user?.profile_picture_url,
      user?.profile_pic_url,
      user?.profile_pic,
    ];
    const rawUrl = urlCandidates.find(
      (value) => typeof value === "string" && value.trim().length > 0,
    ) as string | undefined;
    if (!rawUrl) return undefined;
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      return rawUrl;
    }
    return getMediaUrl(rawUrl) ?? undefined;
  };

  const profileImageUrl = resolveProfileImageUrl(user);

  const displayName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
    : "User";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .nexus-header {
          position: sticky;
          top: 0;
          z-index: 40;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8f0fe;
          box-shadow: 0 1px 16px rgba(14, 116, 192, 0.06);
          font-family: 'DM Sans', sans-serif;
        }

        /* Left side */
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .breadcrumb-page {
          font-size: 15px;
          font-weight: 600;
          color: #0c4a6e;
          letter-spacing: -0.2px;
        }
        .breadcrumb-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #cbd5e1;
        }
        .breadcrumb-sub {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 400;
        }
        .live-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border-radius: 20px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid #6ee7b7;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          animation: live-pulse 2s infinite;
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        .live-text {
          font-size: 10.5px;
          font-weight: 600;
          color: #059669;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        /* Right side */
        .header-right {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
        }

        /* Search button */
        .header-search-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px 7px 10px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #94a3b8;
          font-size: 13px;
          cursor: pointer;
          transition: all 160ms ease;
        }
        .header-search-btn:hover {
          border-color: #bae6fd;
          background: #f0f9ff;
          color: #0ea5e9;
        }
        .search-shortcut {
          font-size: 10px;
          font-weight: 600;
          color: #cbd5e1;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 1px 5px;
          border-radius: 4px;
          letter-spacing: 0.3px;
        }

        /* Notification bell */
        .notif-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          cursor: pointer;
          transition: all 160ms ease;
        }
        .notif-btn:hover {
          background: #f0f9ff;
          border-color: #bae6fd;
          color: #0ea5e9;
        }
        .notif-badge {
          position: absolute;
          top: 6px;
          right: 7px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
          border: 1.5px solid #ffffff;
        }

        /* Divider */
        .header-divider {
          width: 1px;
          height: 24px;
          background: #e2e8f0;
          margin: 0 4px;
        }

        /* Avatar trigger */
        .avatar-trigger {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 10px 5px 5px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          transition: all 160ms ease;
        }
        .avatar-trigger:hover {
          background: #f0f9ff;
          border-color: #bae6fd;
        }
        .avatar-ring {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(135deg, #0ea5e9, #0369a1);
          flex-shrink: 0;
        }
        .avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: #e0f2fe;
        }
        .avatar-info {
          display: flex;
          flex-direction: column;
        }
        .avatar-name {
          font-size: 13px;
          font-weight: 600;
          color: #0c4a6e;
          white-space: nowrap;
          line-height: 1.2;
        }
        .avatar-role {
          font-size: 10.5px;
          color: #0ea5e9;
          font-weight: 500;
          text-transform: capitalize;
          line-height: 1.2;
        }
        .chevron-icon {
          color: #94a3b8;
          flex-shrink: 0;
        }

        /* Dropdown menu overrides */
        .header-dropdown-content {
          width: 220px;
          border-radius: 14px !important;
          border: 1px solid #e0f2fe !important;
          box-shadow: 0 8px 32px rgba(14, 116, 192, 0.12) !important;
          overflow: hidden;
          padding: 6px !important;
          font-family: 'DM Sans', sans-serif;
        }
        .dropdown-header-label {
          padding: 10px 10px 8px;
        }
        .dropdown-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #0c4a6e;
        }
        .dropdown-email {
          font-size: 11.5px;
          color: #94a3b8;
          margin-top: 1px;
        }
        .dropdown-item-custom {
          border-radius: 8px !important;
          font-size: 13px !important;
          color: #334155 !important;
          font-family: 'DM Sans', sans-serif !important;
          padding: 8px 10px !important;
          cursor: pointer;
          transition: background 140ms ease;
        }
        .dropdown-item-custom:hover {
          background: #f0f9ff !important;
          color: #0369a1 !important;
        }
        .dropdown-item-logout {
          border-radius: 8px !important;
          font-size: 13px !important;
          color: #ef4444 !important;
          font-family: 'DM Sans', sans-serif !important;
          padding: 8px 10px !important;
          cursor: pointer;
        }
        .dropdown-item-logout:hover {
          background: #fff1f2 !important;
          color: #dc2626 !important;
        }

        /* Mobile menu btn */
        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          cursor: pointer;
          transition: all 160ms ease;
        }
        .mobile-menu-btn:hover {
          background: #f0f9ff;
          border-color: #bae6fd;
          color: #0ea5e9;
        }

        /* Drawer overrides */
        .nexus-drawer-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid #e8f0fe;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }
        .nexus-drawer-title {
          font-size: 18px;
          font-weight: 700;
          color: #0c4a6e;
          font-family: 'DM Sans', sans-serif;
        }
        .nexus-drawer-nav {
          padding: 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .drawer-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          text-decoration: none;
          color: #334155;
          font-size: 14px;
          font-weight: 500;
          transition: all 160ms ease;
          font-family: 'DM Sans', sans-serif;
        }
        .drawer-nav-link:hover {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          color: #0369a1;
        }
        .drawer-nav-link .drawer-icon {
          color: #0ea5e9;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
          .header-search-btn { display: none; }
          .header-divider { display: none; }
          .avatar-info { display: none; }
          .chevron-icon { display: none; }
        }
      `}</style>

      <header className="nexus-header">
        {/* Mobile Menu */}
        <div className="mobile-only">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="mobile-menu-btn" aria-label="Open menu">
                <Menu size={18} />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="nexus-drawer-header flex justify-between items-center">
                <DrawerTitle className="nexus-drawer-title">
                  NexusCare
                </DrawerTitle>
                <DrawerClose asChild>
                  <button className="mobile-menu-btn" aria-label="Close menu">
                    <X size={18} />
                  </button>
                </DrawerClose>
              </DrawerHeader>
              <div className="nexus-drawer-nav">
                {mobileSidebarLinks.map((link) => (
                  <DrawerClose asChild key={link.href}>
                    <Link href={link.href} className="drawer-nav-link">
                      <link.icon className="drawer-icon" />
                      <span>{link.label}</span>
                    </Link>
                  </DrawerClose>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Left — Breadcrumb + live indicator */}
        <div className="header-left desktop-only">
          <div className="header-breadcrumb">
            <span className="breadcrumb-page">Dashboard</span>
          </div>
          <div className="live-badge">
            <span className="live-dot" />
            <span className="live-text">Live</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="header-right">
          {/* Search */}
          <Button className="header-search-btn" aria-label="Search">
            <Search size={14} />
            <span>Search…</span>
            <span className="search-shortcut">⌘K</span>
          </Button>

          {/* Notifications */}
          <Button className="notif-btn" aria-label="Notifications">
            <Bell size={16} />
            <span className="notif-badge" />
          </Button>

          <div className="header-divider" />

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="avatar-trigger" aria-label="User menu">
                <div className="avatar-ring">
                  <div className="avatar-inner">
                    <Avatar
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                    >
                      {profileImageUrl ? (
                        <AvatarImage
                          src={profileImageUrl}
                          alt="User avatar"
                          style={{ borderRadius: "50%" }}
                        />
                      ) : null}
                      <AvatarFallback
                        style={{
                          background:
                            "linear-gradient(135deg, #0ea5e9, #0369a1)",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "700",
                          borderRadius: "50%",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="avatar-info">
                  <span className="avatar-name">{displayName}</span>
                  <span className="avatar-role">{userRole}</span>
                </div>
                <ChevronDown size={14} className="chevron-icon" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="header-dropdown-content"
              align="end"
            >
              <DropdownMenuLabel>
                <div className="dropdown-header-label">
                  <div className="dropdown-name">{displayName}</div>
                  <div className="dropdown-email">{user?.email}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator
                style={{ background: "#f0f4ff", margin: "4px 0" }}
              />
              <DropdownMenuItem asChild>
                <Link href={profile_link} className="dropdown-item-custom">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={settings_link} className="dropdown-item-custom">
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator
                style={{ background: "#f0f4ff", margin: "4px 0" }}
              />
              <DropdownMenuItem
                onSelect={logout}
                className="dropdown-item-logout"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
