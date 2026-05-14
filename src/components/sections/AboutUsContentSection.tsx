/** @format */

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Info } from "lucide-react";

const AboutUsContentSection = () => {
  return (
    <section className="py-24 bg-slate-50 text-slate-900">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">
            About Nexus Care
          </p>
          <h1 className="mt-4 text-5xl font-bold text-slate-900 md:text-6xl">
            Pioneering Healthcare for the Next Generation
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            We combine telemedicine, research, and innovation to deliver care
            that is secure, accessible, and grounded in trust.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="overflow-hidden rounded-[2rem] bg-slate-200 shadow-lg">
            <Image
              src="/consultation.jpg"
              alt="Our Team and Healthcare Professionals"
              width={700}
              height={500}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-sky-600">
                  <Users className="h-6 w-6 mr-2" /> Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-7">
                  Our mission is to foster innovation in healthcare by
                  connecting bright minds, funding groundbreaking projects, and
                  providing essential services that accelerate medical progress.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-emerald-600">
                  <Info className="h-6 w-6 mr-2" /> Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-7">
                  We envision a world where healthcare innovation is accessible
                  to everyone, empowering better outcomes and stronger
                  communities across Uganda and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Our Values
            </h2>
            <p className="mt-3 text-base text-slate-600">
              The principles guiding every patient interaction, research
              project, and technology decision.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Innovation",
                description: "Driving progress with creative solutions.",
              },
              {
                title: "Collaboration",
                description: "Working together for greater impact.",
              },
              {
                title: "Integrity",
                description: "Upholding the highest ethical standards.",
              },
              {
                title: "Impact",
                description: "Making a tangible difference in healthcare.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-blue-50 p-6"
              >
                <h3 className="mb-2 text-lg font-semibold text-sky-700">
                  {value.title}
                </h3>
                <p className="text-sm leading-6 text-slate-700">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsContentSection;
