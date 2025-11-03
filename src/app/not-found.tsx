/** @format */
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
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
