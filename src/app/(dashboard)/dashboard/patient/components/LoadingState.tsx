/**
 * @format
 * LoadingState Component
 * Displays skeleton loaders while fetching data
 */

"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}
