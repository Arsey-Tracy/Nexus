/** @format */
"use client";

import React from "react";

export default function UnauthorizedPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
      <p className="mb-4">You do not have permission to view this page.</p>
      <p className="text-sm text-muted-foreground">
        If you believe this is an error, sign in with an account that has the
        correct role or contact an administrator.
      </p>
    </div>
  );
}
