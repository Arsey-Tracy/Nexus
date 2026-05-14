/** @format */

"use client";
/** @format */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, FlaskConical, Lightbulb } from "lucide-react";

const services = [
  {
    icon: <Stethoscope className="h-12 w-12 text-sky-600 mb-4" />,
    title: "Advanced Telemedicine",
    description:
      "Access expert medical consultations and patient care remotely, anytime, anywhere.",
  },
  {
    icon: <FlaskConical className="h-12 w-12 text-emerald-600 mb-4" />,
    title: "Cutting-Edge Research",
    description:
      "Participate in and benefit from the latest medical research and clinical trials.",
  },
  {
    icon: <Lightbulb className="h-12 w-12 text-amber-500 mb-4" />,
    title: "Healthcare Innovation",
    description:
      "Discover innovative healthcare tools, technologies, and solutions designed for modern needs.",
  },
];

const ServicesIntroSection = () => {
  return (
    <section className="py-24 bg-white text-slate-900">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">
            Our Services
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-center mt-4 text-slate-900">
            Core Pillars of Care
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Comprehensive healthcare solutions built on trust and innovation
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-center shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-sky-600 shadow-none">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesIntroSection;
