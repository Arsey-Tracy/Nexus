/** @format */

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  image?: string;
  title: string;
  subtitle?: string;
}

export function AuthLayout({
  children,
  image = "/auth-bg.jpg",
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <main className="flex justify-center min-h-screen w-full">
      {/* Auth Form Section */}
      <div className="flex flex-1 flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            {/* Logo for mobile view */}
            <div className="lg:hidden mx-auto mb-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold text-gray-800"
              >
                <ArrowLeft className="h-8 w-8 text-blue-600 animate-bounce" />
                NexusCareUG
              </Link>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>

      {/* Branding & Image Section - Hidden on mobile */}
      <aside className="relative hidden lg:flex flex-1 h-screen flex-col items-center justify-between bg-zinc-900 p-10 text-white mb-2">
        <Link
          href="/"
          className="relative z-20 flex items-center text-lg font-medium mb-2"
        >
          <ArrowLeft className="mr-2 h-6 w-6" />
          Nexus Healthcare
        </Link>
        <Image
          src={image}
          alt="Authentication background"
          fill
          className="w-full h-full object-cover opacity-25"
          priority
        />

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Connecting patients with healthcare professionals for
              better, more accessible care.&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">
              Uganda&apos;s Leading Telemedicine Platform
            </footer>
          </blockquote>
        </div>
      </aside>
    </main>
  );
}
