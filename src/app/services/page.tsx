/** @format */

import React from "react";
import ServicesDetailSection from "@/components/sections/ServicesDetailSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
const ServicesPage = () => {
  return (
    <main className="flex-grow">
      <Navbar />
      {/* You can have a specific Hero for the Services page or reuse the main one */}
      {/* For now, let's add the services details directly */}
      <ServicesDetailSection />
      {/* You could add other sections like FAQs related to services, etc. */}
      <Footer />
    </main>
  );
};

export default ServicesPage;
