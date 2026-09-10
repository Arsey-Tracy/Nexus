/** @format */
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const NotFound = () => {
  const pathname = usePathname();

  // Only log actual 404s in development, avoid logging during route transitions
  useEffect(() => {
    // Skip logging for auth-related paths that might be transitioning
    if (!pathname?.includes("/signin") && !pathname?.includes("/register")) {
      console.warn("404 - Page not found:", pathname);
    }
  }, [pathname]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-2">404 — Page not found</h1>
      <p>
        Requested path: <code>{pathname ?? "unknown"}</code>
      </p>
    </div>
  );
};
export default NotFound;
