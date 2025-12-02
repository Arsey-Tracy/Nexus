import { BarChart3, Calendar, CreditCard, FileText, LayoutDashboard, MessageSquare, Settings, Shield, User, Users } from "lucide-react";
import React from "react";

export type SidebarLink = {
    href: string;
    label: string;
    icon: React.ElementType; //  For lucide icons
};

const adminLinks: SidebarLink[] = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard }, // [cite: 21]
  { href: "/dashboard/admin/users", label: "User Management", icon: Users }, // [cite: 21]
  { href: "/dashboard/admin/appointments", label: "Appointments", icon: Calendar }, // [cite: 22]
  { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 }, // [cite: 22]
  { href: "/dashboard/admin/security", label: "System Health", icon: Shield },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

const doctorLinks: SidebarLink[] = [
  { href: "/dashboard/doctor", label: "Dashboard", icon: LayoutDashboard }, // [cite: 236]
  { href: "/dashboard/doctor/patients", label: "My Patients", icon: Users }, // [cite: 236]
  { href: "/dashboard/doctor/schedule", label: "Schedule", icon: Calendar }, // [cite: 236]
  { href: "/dashboard/doctor/messages", label: "Messages", icon: MessageSquare }, // [cite: 236]
  { href: "/dashboard/doctor/settings", label: "Settings", icon: Settings }, // [cite: 236]
];

const patientLinks: SidebarLink[] = [
  { href: "/dashboard/patient", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/patient/profile", label: "Profile Settings", icon: User }, // [cite: 145]
  { href: "/dashboard/patient/history", label: "Medical History", icon: FileText }, // [cite: 146]
  { href: "/dashboard/patient/payments", label: "Payment Methods", icon: CreditCard }, // [cite: 147]
  { href: "/dashboard/patient/messages", label: "Messages", icon: MessageSquare }, // [cite: 148]
  { href: "/dashboard/patient/settings", label: "Settings", icon: Settings },
];

const nurseLinks: SidebarLink[] = [
  // Define nurse links here when ready
  { href: "/dashboard/nurse", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/nurse/visits", label: "Home Visits", icon: Calendar },
  { href: "/dashboard/nurse/patients", label: "My Patients", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

// --- Create the Main Role Map ---

// Define a type for the role map
type RoleSidebarLinks = {
    [key: string]: SidebarLink[];
};

export const ROLE_SIDEBAR_LINKS: RoleSidebarLinks = {
  admin: adminLinks,
  doctor: doctorLinks,
  patient: patientLinks,
  nurse: nurseLinks,
  // Add other roles as needed
}