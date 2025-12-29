/** @format */

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Shield, Users } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      {/* Auth Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative">
        {/* Mobile Header */}
        <div className="lg:hidden w-full max-w-sm mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors group"
          >
            <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <ArrowLeft className="h-5 w-5 text-blue-600" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NexusCareUG
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 space-y-6">
            {children}
          </div>

          {/* Trust Indicators - Mobile */}
          <div className="lg:hidden flex justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Trusted by 10K+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Branding Section */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt="Healthcare professionals"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-indigo-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-xl font-bold hover:text-blue-200 transition-colors group"
            >
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-all">
                <ArrowLeft className="h-5 w-5" />
              </div>
              <span>Nexus Healthcare</span>
            </Link>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-lg space-y-8">
              {/* Quote */}
              <blockquote className="space-y-4">
                <p className="text-2xl font-light leading-relaxed">
                  &quot;Connecting patients with healthcare professionals for
                  better, more accessible care across Uganda.&quot;
                </p>
                <footer className="text-blue-200 font-medium">
                  Uganda&apos;s Leading Telemedicine Platform
                </footer>
              </blockquote>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="text-sm font-medium">Secure & Private</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                    <Heart className="h-6 w-6 text-red-400" />
                  </div>
                  <p className="text-sm font-medium">HIPAA Compliant</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium">10K+ Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-blue-200/80 text-sm">
            © 2025 NexusCareUG. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
