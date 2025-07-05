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
    <section id="services" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our Services
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the comprehensive range of services we offer to advance
            healthcare through technology, research, and innovation.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {detailedServices.map((service) => (
            <Card
              key={service.title}
              className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center mb-2">
                  {service.icon}
                  <CardTitle className="text-xl font-semibold text-gray-700 ml-3">
                    {service.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-gray-600 mb-4">
                  {service.description}
                </CardDescription>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-500">
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
