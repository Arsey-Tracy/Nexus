/** @format */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMediaUrl } from "@/lib/utils";
import { ROLE_SIDEBAR_LINKS } from "@/lib/navLinks";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const userRole = (user?.user_type || user?.role || "patient")
    .toString()
    .toLowerCase();

  const sidebarLinks = ROLE_SIDEBAR_LINKS[userRole] || [];

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

  return (
    <>
      {/* Inline styles scoped to this component */}
      <style>{`
        .nexus-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-right: 1px solid #e8f0fe;
          transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 4px 0 24px -4px rgba(14, 116, 192, 0.06);
          z-index: 30;
        }
        .nexus-sidebar.expanded { width: 256px; }
        .nexus-sidebar.collapsed { width: 72px; }

        /* Logo area */
        .sidebar-logo-area {
          padding: 24px 16px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #f0f4ff;
          min-height: 72px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .logo-img-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(14, 165, 233, 0.3);
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: opacity 200ms ease, transform 200ms ease;
        }
        .logo-text.hidden-text {
          opacity: 0;
          pointer-events: none;
          transform: translateX(-8px);
          width: 0;
        }
        .logo-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0c4a6e;
          white-space: nowrap;
          letter-spacing: -0.3px;
        }
        .logo-tagline {
          font-size: 10px;
          font-weight: 500;
          color: #64748b;
          white-space: nowrap;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* Nav */
        .sidebar-nav {
          flex: 1;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .sidebar-nav::-webkit-scrollbar { width: 0; }

        .nav-section-label {
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 8px 10px 4px;
          white-space: nowrap;
          transition: opacity 200ms ease;
        }

        .nav-section-label.hidden-text { opacity: 0; height: 0; padding: 0; overflow: hidden; }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 180ms ease;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          min-height: 44px;
        }
        .nav-link .nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          transition: color 180ms ease;
          color: #64748b;
        }
        .nav-link .nav-label {
          font-size: 13.5px;
          font-weight: 500;
          color: #334155;
          transition: opacity 200ms ease, transform 200ms ease;
          letter-spacing: -0.1px;
        }
        .nav-link .nav-label.hidden-text {
          opacity: 0;
          transform: translateX(-6px);
          pointer-events: none;
          width: 0;
          overflow: hidden;
        }

        /* Hover */
        .nav-link:not(.active):hover {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }
        .nav-link:not(.active):hover .nav-icon { color: #0ea5e9; }
        .nav-link:not(.active):hover .nav-label { color: #0369a1; }

        /* Active */
        .nav-link.active {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
        }
        .nav-link.active .nav-icon { color: #ffffff; }
        .nav-link.active .nav-label { color: #ffffff; font-weight: 600; }
        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 25%; bottom: 25%;
          width: 3px;
          background: rgba(255,255,255,0.6);
          border-radius: 0 4px 4px 0;
        }

        /* Active indicator dot for collapsed mode */
        .nav-link.active .active-dot {
          position: absolute;
          top: 6px; right: 6px;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
        }

        /* Tooltip on collapsed */
        .nav-link[data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: #0c4a6e;
          color: #ffffff;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 100;
        }

        /* Collapse toggle button */
        .collapse-btn {
          margin: 8px 10px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 180ms ease;
          white-space: nowrap;
          overflow: hidden;
          flex-shrink: 0;
        }
        .collapse-btn:hover {
          background: #f0f9ff;
          border-color: #bae6fd;
          color: #0ea5e9;
        }
        .collapse-btn .btn-label {
          transition: opacity 200ms ease, width 200ms ease;
        }
        .collapse-btn .btn-label.hidden-text {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        /* User card at bottom */
        .sidebar-user-card {
          margin: 0 10px 16px;
          padding: 10px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #bae6fd;
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          transition: padding 200ms ease;
          flex-shrink: 0;
        }
        .sidebar-user-card.compact { padding: 8px; justify-content: center; }
        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          flex-shrink: 0;
        }
        .user-info {
          overflow: hidden;
          transition: opacity 200ms ease, width 200ms ease;
        }
        .user-info.hidden-text { opacity: 0; width: 0; pointer-events: none; overflow: hidden; }
        .user-name {
          font-size: 12px;
          font-weight: 600;
          color: #0c4a6e;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-role-badge {
          font-size: 10px;
          font-weight: 500;
          color: #0369a1;
          background: rgba(14,165,233,0.12);
          padding: 1px 6px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 2px;
          white-space: nowrap;
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .nexus-sidebar { display: none; }
        }
      `}</style>

      <aside
        className={`nexus-sidebar ${collapsed ? "collapsed" : "expanded"}`}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="NexusCare Home"
          style={{ textDecoration: "none" }}
        >
          <div className="sidebar-logo-area">
            <div className="logo-img-wrap">
              <Image
                src="/logo.png"
                alt="Nexuscare_ug_logo"
                width={55}
                height={55}
                style={{ objectFit: "cover", borderRadius: "10px" }}
              />
            </div>
            <div className={`logo-text ${collapsed ? "hidden-text" : ""}`}>
              <span className="logo-name">Nexuscare Uganda</span>
              <span className="logo-tagline">Telehealth Platform</span>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span
            className={`nav-section-label ${collapsed ? "hidden-text" : ""}`}
          >
            Navigation
          </span>

          {sidebarLinks.map((link) => {
            const isActive =
              link.href === `/dashboard/${userRole}`
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                data-tooltip={collapsed ? link.label : undefined}
              >
                <link.icon className="nav-icon" />
                <span className={`nav-label ${collapsed ? "hidden-text" : ""}`}>
                  {link.label}
                </span>
                {isActive && collapsed && <span className="active-dot" />}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className={`sidebar-user-card ${collapsed ? "compact" : ""}`}>
          <div className="user-avatar">
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImageUrl}
                alt={`${user?.first_name || "User"} avatar`}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase() ||
              "U"
            )}
          </div>
          <div className={`user-info ${collapsed ? "hidden-text" : ""}`}>
            <div className="user-name">
              {user?.first_name} {user?.last_name}
            </div>
            <span className="user-role-badge">{userRole}</span>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="collapse-btn"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span className={`btn-label ${collapsed ? "hidden-text" : ""}`}>
                Collapse
              </span>
            </>
          )}
        </button>
      </aside>
    </>
  );
};

export default DashboardSidebar;
