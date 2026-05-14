/** @format */
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Heart,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle,
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
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white to-slate-50 text-slate-900">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              <Sparkles className="w-4 h-4 text-sky-500" />
              Uganda&apos;s Leading Healthcare Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {title}
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed">
              {subtitle}
            </p>

            {showCta && (
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:bg-sky-700 hover:scale-[1.02]"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-300 hover:border-sky-500 hover:text-sky-600"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>10,000+ Patients Served</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md">
              <Image
                src="/consultation.jpg"
                alt="Healthcare professional consulting with patient"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl object-cover"
                priority
              />
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
                      D
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                      P
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Trusted by Doctors
                    </p>
                    <p className="text-xs text-slate-500">500+ Professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
