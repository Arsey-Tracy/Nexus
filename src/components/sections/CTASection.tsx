/** @format */

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, UserCheck } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Care When You Need It
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access professional healthcare services from the comfort of your
            home or get in-person care with our trusted professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Bedside Nurse Card */}
          <Card className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-64 w-full">
              <Image
                // src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                src="/bedsidenursing.jpg"
                alt="Professional bedside nursing care"
                fill
                className="object-cover"
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <UserCheck className="h-8 w-8 text-emerald-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Bedside Nurse
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Get professional nursing care at home. Our certified nurses
                provide personalized care, medication management, and health
                monitoring in the comfort of your own space.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Order Bedside Nurse
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Talk to a Doctor Card */}
          <Card className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-64 w-full">
              <Image
                // src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                src="/consultation.jpg"
                alt="Online doctor consultation"
                fill
                className="object-cover"
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Stethoscope className="h-8 w-8 text-sky-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Talk to a Doctor
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Connect with licensed doctors instantly through our telemedicine
                platform. Get medical consultations, prescriptions, and health
                advice from anywhere, anytime.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                  Start Consultation
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-sky-600 text-sky-600 hover:bg-sky-50"
                >
                  View Doctors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
