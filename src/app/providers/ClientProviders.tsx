/** @format */

"use client";

import React, { useEffect } from "react";
import { AuthProvider } from "@/lib/auth/AuthContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // keep this file minimal and client-only
  return (
    <AuthProvider>
      <PWASetup>{children}</PWASetup>
    </AuthProvider>
  );
}

function PWASetup({ children }: { children: React.ReactNode }) {
  // Defer registration and manifest switching to the client where auth is available
  useEffect(() => {
    // Register service worker if available and on secure context
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const tryRegister = async () => {
        try {
          await navigator.serviceWorker.register("/sw.js");
        } catch (e) {
          // swallow
        }
      };

      if (window.location.protocol === "https:" || window.location.hostname === "localhost") {
        tryRegister();
      }
    }

    // Capture beforeinstallprompt to allow custom install UI later
    const onBeforeInstall = (e: Event) => {
      try {
        // @ts-ignore
        e.preventDefault?.();
        // @ts-ignore
        window.__nexus_before_install_prompt = e;
      } catch (err) {}
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall as EventListener);
    };
  }, []);

  // Switch manifest dynamically based on stored user role (helps install start_url)
  useEffect(() => {
    const applyManifestForUser = (user: any) => {
      try {
        const isAdmin = user?.user_type === "admin";
        const manifestHref = isAdmin ? "/manifest-admin.json" : "/manifest.json";
        let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement("link");
          link.rel = "manifest";
          document.head.appendChild(link);
        }
        if (!link.href || link.href.indexOf(manifestHref) === -1) {
          link.href = manifestHref;
        }
      } catch (err) {
        // ignore
      }
    };

    // initial apply
    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      applyManifestForUser(user);
    } catch {}

    // listen for user updates dispatched by AuthContext
    const onUserUpdated = (e: Event) => {
      // @ts-ignore
      const detail = e?.detail ?? null;
      applyManifestForUser(detail);
    };
    window.addEventListener("nexus:user:updated", onUserUpdated as EventListener);

    return () => {
      window.removeEventListener("nexus:user:updated", onUserUpdated as EventListener);
    };
  }, []);

  return <>{children}</>;
}
