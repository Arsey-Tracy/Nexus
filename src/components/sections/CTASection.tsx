/** @format */
"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Stethoscope,
  UserCheck,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  const services = [
    {
      id: "bedside-nurse",
      title: "Bedside Nurse",
      subtitle: "Professional Home Care",
      description:
        "Get certified nursing care at home with personalized attention, medication management, and health monitoring.",
      image: "/bedsidenursing.jpg",
      icon: UserCheck,
      color: "emerald",
      features: [
        "24/7 Availability",
        "Certified Nurses",
        "Home Visits",
        "Medication Management",
      ],
      ctaText: "Book Nurse Visit",
      href: "/dashboard/patient?tab=services",
    },
    {
      id: "consultation",
      title: "Doctor Consultation",
      subtitle: "Instant Medical Care",
      description:
        "Connect with licensed doctors instantly through our secure telemedicine platform for consultations and prescriptions.",
      image: "/consultation.jpg",
      icon: Stethoscope,
      color: "blue",
      features: [
        "Instant Connection",
        "Licensed Doctors",
        "Prescriptions",
        "Follow-up Care",
      ],
      ctaText: "Start Consultation",
      href: "/dashboard/patient?tab=consultations",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-100/40 to-emerald-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-100/25 to-blue-100/25 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4" />
            Healthcare Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Get Care When You
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              Need It Most
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Access professional healthcare services from the comfort of your
            home or get in-person care with our trusted medical professionals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const colorClasses = {
              emerald: {
                bg: "bg-emerald-500",
                hover: "hover:bg-emerald-600",
                light: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
              },
              blue: {
                bg: "bg-blue-500",
                hover: "hover:bg-blue-600",
                light: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
              },
            }[service.color] || {
              bg: "bg-blue-500",
              hover: "hover:bg-blue-600",
              light: "bg-blue-50",
              text: "text-blue-700",
              border: "border-blue-200",
            };

            return (
              <Card
                key={service.id}
                className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colorClasses.light} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Image Section */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />

                  {/* Floating Icon */}
                  <div
                    className={`absolute top-4 right-4 w-12 h-12 ${colorClasses.bg} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-8 relative z-10">
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-lg font-medium text-gray-600">
                        {service.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        What&apos;s Included
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      asChild
                      className={`w-full ${colorClasses.bg} ${colorClasses.hover} text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group/btn`}
                    >
                      <Link
                        href={service.href}
                        className="flex items-center justify-center gap-2"
                      >
                        {service.ctaText}
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>

                {/* Hover Effect Border */}
                <div
                  className={`absolute inset-0 border-2 ${colorClasses.border} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none`}
                ></div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg border border-gray-200/50">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-semibold text-gray-900">
                Available 24/7
              </span>
            </div>
            <p className="text-gray-600 mb-6">
              Need immediate assistance? Our healthcare professionals are
              available around the clock to provide the care you need.
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold transition-all duration-300"
            >
              <Link href="/contact" className="flex items-center gap-2">
                Contact Support
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
