/**
 * @format
 * EmptyState Component
 * Displays when there is no medical history
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Video } from "lucide-react";

interface EmptyStateProps {
  onConsultationClick: () => void;
  onHomeVisitClick: () => void;
}

export function EmptyState({
  onConsultationClick,
  onHomeVisitClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Home className="h-9 w-9 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        No medical history yet
      </h3>
      <p className="text-slate-400 text-sm mb-7 max-w-xs">
        Book your first consultation or home visit to get started
      </p>
      <div className="flex gap-3">
        <Button
          onClick={onConsultationClick}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Video className="h-4 w-4" />
          Book Consultation
        </Button>
        <Button
          onClick={onHomeVisitClick}
          variant="outline"
          className="rounded-xl border-slate-200 gap-2"
        >
          <Home className="h-4 w-4" />
          Book Home Visit
        </Button>
      </div>
    </div>
  );
}
