/**
 * @format
 * Under Development Component
 * Displays a message for features that are not yet available
 */

"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnderDevelopmentProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export function UnderDevelopment({
  title = "Coming Soon",
  description = "This feature is currently under development. We're working hard to bring this to you soon!",
  showBackButton = true,
}: UnderDevelopmentProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-amber-100 p-4">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">{title}</h1>
        <p className="text-slate-600 text-lg mb-8">{description}</p>
        {showBackButton && (
          <Button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
}
