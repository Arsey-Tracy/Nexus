/** @format */

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Lightbulb,
  Brain,
  Users,
  Stethoscope,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

const detailedServices = [
  {
    icon: <Stethoscope className="h-10 w-10 text-sky-600 mb-3" />,
    title: "Comprehensive Telemedicine Platform",
    description:
      "Our platform offers secure video consultations, remote patient monitoring, and e-prescription services, connecting patients with healthcare professionals seamlessly.",
    details: [
      "HD Video Calls",
      "Secure Messaging",
      "Appointment Scheduling",
      "Digital Health Records",
    ],
  },
  {
    icon: <FlaskConical className="h-10 w-10 text-emerald-600 mb-3" />,
    title: "Medical Research Collaboration",
    description:
      "We facilitate and participate in cutting-edge medical research, providing tools and platforms for data collection, analysis, and collaborative studies.",
    details: [
      "Clinical Trial Support",
      "Research Data Management",
      "AI-Powered Analytics",
      "Publication Support",
    ],
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-amber-500 mb-3" />,
    title: "Healthcare Innovation Development",
    description:
      "Our innovation hub focuses on developing and implementing novel healthcare technologies, from AI diagnostic tools to personalized medicine solutions.",
    details: [
      "Prototyping & Testing",
      "AI in Healthcare",
      "IoT for Health",
      "Custom Software Solutions",
    ],
  },
  {
    icon: <Brain className="h-10 w-10 text-purple-600 mb-3" />,
    title: "Mental Health Support",
    description:
      "Providing accessible and confidential mental health services through our telemedicine platform, including therapy sessions and wellness programs.",
    details: [
      "Online Counseling",
      "Group Therapy",
      "Wellness Workshops",
      "Stress Management Tools",
    ],
  },
  {
    icon: <Users className="h-10 w-10 text-pink-600 mb-3" />,
    title: "Community Health Programs",
    description:
      "Launching and supporting community-focused health initiatives aimed at improving public health awareness and access to care in underserved areas.",
    details: [
      "Health Education",
      "Screening Camps",
      "Vaccination Drives",
      "Partnerships with NGOs",
    ],
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-red-600 mb-3" />,
    title: "Data Security & Compliance",
    description:
      "Ensuring the highest standards of data security and regulatory compliance (e.g., HIPAA, GDPR) for all our services and platforms.",
    details: [
      "End-to-End Encryption",
      "Regular Audits",
      "Compliance Training",
      "Secure Data Storage",
    ],
  },
];

const ServicesDetailSection = () => {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">
            Services
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900">
            Built for Modern Healthcare
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            From telemedicine to research and innovation, our services are
            created to help patients and providers move forward with confidence.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {detailedServices.map((service) => (
            <Card
              key={service.title}
              className="flex flex-col rounded-[2rem] border border-slate-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-100 text-sky-600">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    {service.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-slate-700 mb-4 text-base">
                  {service.description}
                </CardDescription>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                  {service.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesDetailSection;
