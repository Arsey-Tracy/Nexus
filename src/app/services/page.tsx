/** @format */

import React from "react";
import ServicesDetailSection from "@/components/sections/ServicesDetailSection";

const ServicesPage = () => {
  return (
    <main className="flex-grow">
      {/* You can have a specific Hero for the Services page or reuse the main one */}
      {/* For now, let's add the services details directly */}
      <ServicesDetailSection />
      {/* You could add other sections like FAQs related to services, etc. */}
    </main>
  );
};

export default ServicesPage;
