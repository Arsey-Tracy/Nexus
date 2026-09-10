/**
 * @format
 * BedsideNursingCard Component
 * Displays individual home visit details with action buttons
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { BedsideNursing } from "@/lib/api/bedside_nursing";
import { statusConfig, cardVariants } from "../constants";

interface BedsideNursingCardProps {
  bedside: BedsideNursing;
  index: number;
}

export function BedsideNursingCard({
  bedside: b,
  index,
}: BedsideNursingCardProps) {
  const sc = statusConfig[b.status] ?? statusConfig.pending;

  return (
    <motion.div
      key={`bedside-${b.id}`}
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate="show"
      className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${sc.bg} ${sc.text} ${sc.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
              {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3 w-3" />
              {new Date(b.requested_at).toLocaleDateString("en-UG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {b.doctor && (
            <p className="font-semibold text-slate-900 text-[15px] mb-1">
              Dr. {b.doctor.first_name} {b.doctor.last_name}
            </p>
          )}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-1">
            {b.symptoms}
          </p>
          {b.address && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3 w-3" />
              {b.address}
            </span>
          )}
        </div>

        <div className="flex shrink-0 flex-row sm:flex-col gap-2 sm:items-end">
          {b.status === "completed" && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
