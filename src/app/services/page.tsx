/** @format */

import React from "react";
import ServicesDetailSection from "@/components/sections/ServicesDetailSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
const ServicesPage = () => {
  return (
    <main className="flex-grow">
      <Navbar />
      {/* You can have a specific Hero for the Services page or reuse the main one */}
      <HeroSection
        title="Services We Offer"
        subtitle="Explore the comprehensive range of services we offer to advance
        healthcare through technology, research, and innovation."
      />
      {/* For now, let's add the services details directly */}
      <ServicesDetailSection />
      {/* You could add other sections like FAQs related to services, etc. */}
      <Footer />
    </main>
  );
};

export default ServicesPage;
