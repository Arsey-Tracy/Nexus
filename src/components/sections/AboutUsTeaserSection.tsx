/** @format */

"use client";
/** @format */
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutUsTeaserSection = () => {
  return (
    <section className="py-16 bg-white animate-fade-in">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          Pioneering the Future of Healthcare
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          At Nexus Care, we are dedicated to transforming healthcare through
          technology and collaborative research. Our mission is to make quality
          care accessible and to drive innovation for a healthier tomorrow.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow"
        >
          <Link href="/about">Discover Our Story</Link>
        </Button>
      </div>
    </section>
  );
};

export default AboutUsTeaserSection;
