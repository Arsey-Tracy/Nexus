/** @format */

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesDetailSection from "@/components/sections/ServicesDetailSection";
import HeroSection from "@/components/sections/HeroSection"; // Optional: reuse hero or create a specific one

const ServicesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* You can have a specific Hero for the Services page or reuse the main one */}
        {/* For now, let's add the services details directly */}
        <ServicesDetailSection />
        {/* You could add other sections like FAQs related to services, etc. */}
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
