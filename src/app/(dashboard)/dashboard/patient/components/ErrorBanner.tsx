/**
 * @format
 * ErrorBanner Component
 * Displays error messages with retry option
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorBannerProps {
  error: string;
  onRetry: () => void;
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{error}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-100"
      >
        Retry
      </Button>
    </div>
  );
}
