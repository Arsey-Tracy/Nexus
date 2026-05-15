/** @format */

"use client";
/** @format */
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutUsTeaserSection = () => {
  return (
    <section className="py-24 bg-white text-slate-900">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-600 to-blue-800 p-12 shadow-xl shadow-blue-200">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Pioneering the Future of Healthcare
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            At Nexus Care, we are dedicated to transforming healthcare through
            technology and collaborative research. Our mission is to make
            quality care accessible and to drive innovation for a healthier
            tomorrow.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg shadow-blue-900/30 transition-all duration-300 hover:bg-blue-50 hover:scale-[1.02]"
          >
            <Link href="/about">Discover Our Story</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutUsTeaserSection;
