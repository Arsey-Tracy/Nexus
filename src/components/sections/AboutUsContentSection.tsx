/** @format */

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Info } from "lucide-react";

const AboutUsContentSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sky-700 mb-4">
            About Nexus Care
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pioneering the future of healthcare through innovative technology
            and collaborative research.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Image
            src="/placeholder.svg" // Replace with an actual image if available via upload
            alt="Our Team"
            width={600}
            height={384}
            className="rounded-lg shadow-lg object-cover w-full h-auto max-h-96"
            style={{ width: "100%", height: "auto", maxHeight: "24rem" }}
            priority
          />
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sky-600">
                  <Users className="h-6 w-6 mr-2" /> Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Our mission is to foster innovation in healthcare by
                  connecting bright minds, funding groundbreaking projects, and
                  providing essential services to accelerate medical
                  advancements. We believe in a collaborative approach to solve
                  complex health challenges.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sky-600">
                  <Info className="h-6 w-6 mr-2" /> Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We envision a world where innovative healthcare solutions are
                  accessible to all, leading to improved patient outcomes and a
                  healthier global community. NexusCare strives to be at the
                  forefront of this transformation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4 text-center">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
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
              <div key={value.title} className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold text-sky-600 mb-1">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsContentSection;
