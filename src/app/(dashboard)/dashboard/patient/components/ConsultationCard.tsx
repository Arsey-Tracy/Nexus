/**
 * @format
 * ConsultationCard Component
 * Displays individual consultation details with action buttons
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Star } from "lucide-react";
import { Consultation } from "@/lib/api/consultations";
import { statusConfig, cardVariants } from "../constants";

interface ConsultationCardProps {
  consultation: Consultation;
  index: number;
  onReview: (consultation: Consultation) => void;
}

export function ConsultationCard({
  consultation: c,
  index,
  onReview,
}: ConsultationCardProps) {
  const sc = statusConfig[c.status] ?? statusConfig.pending;

  return (
    <motion.div
      key={`consultation-${c.id}`}
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate="show"
      className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Status + date row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${sc.bg} ${sc.text} ${sc.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
              {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3 w-3" />
              {new Date(c.requested_at).toLocaleDateString("en-UG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {c.doctor && (
            <p className="font-semibold text-slate-900 text-[15px] mb-1">
              Dr. {c.doctor.first_name} {c.doctor.last_name}
            </p>
          )}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
            {c.symptoms}
          </p>
        </div>

        <div className="flex shrink-0 flex-row sm:flex-col gap-2 sm:items-end">
          {c.status === "assigned" && c.meeting_link && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    <a
                      href={c.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Join Call
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start your virtual consultation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {c.status === "completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReview(c)}
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-1.5"
            >
              <Star className="h-3.5 w-3.5" />
              Review
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
