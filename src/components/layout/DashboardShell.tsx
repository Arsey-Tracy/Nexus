/** @format */
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Framer motion variants
export const dashboardContainerVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const dashboardItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// ─── PAGE SHELL ───
interface DashboardPageShellProps {
  children: React.ReactNode;
  className?: string;
  maxWidthClassName?: string;
}

export const DashboardPageShell: React.FC<DashboardPageShellProps> = ({
  children,
  className,
  maxWidthClassName = "max-w-7xl",
}) => {
  return (
    <motion.div
      variants={dashboardContainerVariants}
      initial="hidden"
      animate="show"
      className={cn("mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8", maxWidthClassName, className)}
    >
      {children}
    </motion.div>
  );
};

// ─── PAGE HEADER SECTION ───
interface DashboardHeaderSectionProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: {
    text: string;
    variant?: "success" | "warning" | "info" | "neutral";
  };
}

export const DashboardHeaderSection: React.FC<DashboardHeaderSectionProps> = ({
  title,
  subtitle,
  actions,
  badge,
}) => {
  return (
    <motion.div variants={dashboardItemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-100/80">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
            {title}
          </h1>
          {badge && (
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase",
                badge.variant === "success" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
                badge.variant === "warning" && "bg-amber-50 text-amber-700 border border-amber-200",
                badge.variant === "info" && "bg-sky-50 text-sky-700 border border-sky-200",
                (!badge.variant || badge.variant === "neutral") && "bg-slate-50 text-slate-700 border border-slate-200"
              )}
            >
              {badge.text}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3 mt-1 sm:mt-0">
          {actions}
        </div>
      )}
    </motion.div>
  );
};

// ─── STAT CARD ───
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string | number;
    isPositive?: boolean;
  };
  iconColorClassName?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  iconColorClassName = "text-sky-600 bg-sky-50 border-sky-100",
}) => {
  return (
    <motion.div variants={dashboardItemVariants}>
      <Card className="rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white group overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
                {title}
              </p>
              <h3 className="text-3xl font-bold text-slate-950 tracking-tight">
                {value}
              </h3>
            </div>
            <div className={cn("p-3 rounded-xl border transition-all duration-300 group-hover:scale-110", iconColorClassName)}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          {(description || trend) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
              {trend && (
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    trend.isPositive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  )}
                >
                  {trend.value}
                </span>
              )}
              {description && (
                <p className="text-xs text-slate-500 truncate">{description}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ─── ALERT BANNER ───
interface AlertBannerProps {
  title: string;
  description: React.ReactNode;
  variant?: "info" | "warning" | "error" | "success";
  action?: React.ReactNode;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  title,
  description,
  variant = "info",
  action,
  className,
}) => {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-sky-600 flex-shrink-0" />;
    }
  };

  return (
    <motion.div
      variants={dashboardItemVariants}
      className={cn(
        "rounded-2xl border p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4 transition-all shadow-sm",
        variant === "success" && "border-emerald-100 bg-emerald-50/50 text-emerald-950",
        variant === "warning" && "border-amber-100 bg-amber-50/50 text-amber-950",
        variant === "error" && "border-rose-100 bg-rose-50/50 text-rose-950",
        variant === "info" && "border-sky-100 bg-sky-50/50 text-sky-950",
        className
      )}
    >
      <div className="flex gap-3.5 items-start">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="space-y-1">
          <h4 className="font-semibold text-[15px] leading-snug tracking-tight">
            {title}
          </h4>
          <div className="text-[13.5px] leading-relaxed text-slate-600">
            {description}
          </div>
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0 self-start md:self-center">
          {action}
        </div>
      )}
    </motion.div>
  );
};

// ─── EMPTY STATE ───
interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/20",
        className
      )}
    >
      <div className="p-4 rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-4 shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 text-sm max-w-xs mt-1.5 leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
