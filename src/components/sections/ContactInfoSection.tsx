/** @format */
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfoSection = () => {
  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-br from-slate-50 to-white text-slate-900"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Contact Us
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900">
            Reach the Nexus Care Team
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-slate-600">
            Get fast and friendly support for bookings, consultations, or
            general inquiries from our dedicated team.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="rounded-[1.75rem] border border-slate-800/70 bg-white/5 text-center shadow-xl shadow-slate-950/20 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-100 text-sky-600 shadow-none">
                <Mail className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Email Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                General inquiries:{" "}
                <a
                  href="mailto:info@nexuscare.hub"
                  className="font-semibold text-sky-600 hover:text-sky-700"
                >
                  info@nexuscare.hub
                </a>
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Support:{" "}
                <a
                  href="mailto:support@nexuscare.hub"
                  className="font-semibold text-sky-600 hover:text-sky-700"
                >
                  support@nexuscare.hub
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border border-slate-800/70 bg-white/5 text-center shadow-xl shadow-slate-950/20 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-none">
                <Phone className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Call Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Office:{" "}
                <a
                  href="tel:+256742879650"
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  +256742879650
                </a>
              </p>
              <p className="mt-3 text-sm text-slate-600">
                WhatsApp:{" "}
                <a
                  href="tel:+256779541272"
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  +256779541272
                </a>
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Support:{" "}
                <a
                  href="tel:+256707758612"
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  +256707758612
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border border-slate-800/70 bg-white/5 text-center shadow-xl shadow-slate-950/20 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/10">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 shadow-none">
                <MapPin className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Our Office
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold text-slate-900">
                Nexus Care Uganda
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Nansana, Wakiso, Uganda
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactInfoSection;
