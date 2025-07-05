/** @format */
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfoSection = () => {
  return (
    <section id="contact" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Get In Touch
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            We&apos;d love to hear from you. Reach out through any of the
            channels below.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-3">
                <Mail className="h-10 w-10 text-sky-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-700">
                Email Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                General Inquiries:{" "}
                <a
                  href="mailto:nexuscare@gmail.com"
                  className="text-sky-600 hover:underline"
                >
                  info@nexuscare.hub
                </a>
              </p>
              <p className="text-gray-600">
                Support:{" "}
                <a
                  href="mailto:support@nexuscare.hub"
                  className="text-sky-600 hover:underline"
                >
                  support@nexcare.hub
                </a>
              </p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-3">
                <Phone className="h-10 w-10 text-emerald-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-700">
                Call Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Office:{" "}
                <a
                  href="tel:+256742879650"
                  className="text-emerald-600 hover:underline"
                >
                  +256742879650
                </a>
              </p>
              <p className="text-gray-600">
                Whatsapp:{" "}
                <a
                  href="tel:+256779541272"
                  className="text-emerald-600 hover:underline"
                >
                  +256779541272
                </a>
              </p>
              <p className="text-gray-600">
                Support Line:{" "}
                <a
                  href="tel:+256707758612"
                  className="text-emerald-600 hover:underline"
                >
                  +256707758612
                </a>
              </p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-3">
                <MapPin className="h-10 w-10 text-amber-500" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-700">
                Our Office
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">NexusCare, </p>
              <p className="text-gray-600">Nansana, Wakiso, Uganda</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactInfoSection;
