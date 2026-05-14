/** @format */
"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  UserCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: "bedside-nurse",
    title: "Bedside Nursing",
    subtitle: "Professional Home Care",
    description:
      "Certified nursing care at home — personalized attention, medication management, and health monitoring, when and where you need it.",
    image: "/bedsidenursing.jpg",
    icon: UserCheck,
    accent: "teal",
    features: [
      "24/7 Availability",
      "Certified Nurses",
      "Home Visits",
      "Medication Management",
    ],
    ctaText: "Book a Nurse",
    href: "/dashboard/patient?tab=services",
    price: "from UGX 70,000",
  },
  {
    id: "consultation",
    title: "Doctor Consultation",
    subtitle: "Instant Medical Care",
    description:
      "Connect with licensed doctors instantly through our secure telemedicine platform for expert consultations and prescriptions.",
    image: "/consultation.jpg",
    icon: Stethoscope,
    accent: "sky",
    features: [
      "Instant Connection",
      "Licensed Doctors",
      "E-Prescriptions",
      "Follow-up Care",
    ],
    ctaText: "Start Consultation",
    href: "/dashboard/patient?tab=consultations",
    price: "from UGX 50,000",
  },
];

const accentMap: Record<string, Record<string, string>> = {
  teal: {
    badge: "bg-teal-50 text-teal-700 border-teal-200",
    icon: "bg-teal-500",
    ring: "group-hover:ring-teal-200",
    btn: "bg-teal-600 hover:bg-teal-700 shadow-teal-200",
    check: "text-teal-500",
    price: "text-teal-600",
  },
  sky: {
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    icon: "bg-sky-500",
    ring: "group-hover:ring-sky-200",
    btn: "bg-sky-600 hover:bg-sky-700 shadow-sky-200",
    check: "text-sky-500",
    price: "text-sky-600",
  },
};

const CTASection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-600 shadow-none">
            Healthcare Services
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Get Care When You <span className="text-sky-600">Need It</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Access professional healthcare from the comfort of your home or
            connect with a doctor instantly — all on one secure platform.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-2 mb-14">
          {services.map((service) => {
            const IconComponent = service.icon;
            const c = accentMap[service.accent];

            return (
              <div
                key={service.id}
                className={`group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.ring}`}
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div
                    className={`absolute top-5 right-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl ${c.icon} shadow-lg shadow-slate-900/10`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute bottom-5 left-5">
                    <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                      {service.price}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 gap-5 p-8">
                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${c.badge}`}
                    >
                      {service.subtitle}
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {service.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2"
                      >
                        <CheckCircle2 className={`h-4 w-4 ${c.check}`} />
                        <span className="text-xs text-slate-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    className={`mt-auto inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white shadow-sm ${c.btn} transition-all duration-300 hover:-translate-y-0.5`}
                  >
                    <Link
                      href={service.href}
                      className="flex items-center justify-center gap-2"
                    >
                      {service.ctaText}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-100 text-sky-600">
                <Clock className="h-6 w-6" />
              </span>
              <div>
                <p className="text-base font-semibold text-slate-900">
                  Available 24 / 7
                </p>
                <p className="text-sm text-slate-600">
                  Our healthcare professionals are always ready to help you.
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="inline-flex w-full justify-center rounded-3xl border-slate-300 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-white sm:w-auto"
            >
              <Link href="/contact" className="flex items-center gap-2">
                Contact Support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
