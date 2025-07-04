/** @format */

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-20 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to CareInnovate Hub
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Your trusted partner in Telemedicine, groundbreaking Research, and
          healthcare Innovation. Connecting patients, professionals, and
          hospitals seamlessly.
        </p>
        <div className="space-x-4">
          <Button
            asChild
            size="lg"
            className="bg-white text-sky-600 hover:bg-gray-100"
          >
            <Link to="/learn-more">Learn More</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-sky-600"
          >
            <Link to="/get-started">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
