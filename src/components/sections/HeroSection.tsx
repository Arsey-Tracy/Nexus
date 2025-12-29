/** @format */
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Activity,
  Heart,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showCta?: boolean;
}

const HeroSection = ({
  title = "Welcome to Nexus Care",
  subtitle = "Your trusted partner in Telemedicine, groundbreaking Research, and healthcare Innovation. Connecting patients, professionals, and hospitals seamlessly.",
  showCta = true,
}: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Medical Cross Pattern */}
        <div className="absolute top-20 left-10 w-32 h-32 opacity-5">
          <div className="w-full h-full border-2 border-blue-500 rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-blue-500"></div>
        </div>

        {/* Floating Medical Icons */}
        <div
          className="absolute top-32 right-20 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        >
          <Heart className="w-8 h-8 text-blue-200" />
        </div>
        <div
          className="absolute top-64 left-20 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        >
          <Activity className="w-6 h-6 text-emerald-200" />
        </div>
        <div
          className="absolute bottom-32 right-32 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        >
          <Shield className="w-7 h-7 text-indigo-200" />
        </div>

        {/* DNA Helix Pattern */}
        <div className="absolute bottom-20 left-32 opacity-10">
          <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            className="text-blue-300"
          >
            <path
              d="M10 10 Q30 30 50 10 Q70 30 90 10 Q110 30 130 10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M10 70 Q30 50 50 70 Q70 50 90 70 Q110 50 130 70"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="10" cy="10" r="2" fill="currentColor" />
            <circle cx="50" cy="10" r="2" fill="currentColor" />
            <circle cx="90" cy="10" r="2" fill="currentColor" />
            <circle cx="10" cy="70" r="2" fill="currentColor" />
            <circle cx="50" cy="70" r="2" fill="currentColor" />
            <circle cx="90" cy="70" r="2" fill="currentColor" />
          </svg>
        </div>

        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-emerald-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-cyan-100/25 to-blue-100/25 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))] opacity-30"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
            <Sparkles className="w-4 h-4" />
            Uganda&apos;s Leading Healthcare Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-emerald-800 bg-clip-text text-transparent leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          {showCta && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link href="/register" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-medium">10,000+ Patients</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span className="font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
