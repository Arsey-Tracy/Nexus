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
    <section className="py-16 bg-gray-50 animate-fade-in">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Our Core Pillars
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.title}
              className="text-center shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white border-0"
            >
              <CardHeader>
                <div className="flex justify-center">{service.icon}</div>
                <CardTitle className="text-2xl font-semibold text-gray-700">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesIntroSection;
