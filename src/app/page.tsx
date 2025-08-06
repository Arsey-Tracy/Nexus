/** @format */

import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import ServicesIntroSection from "@/components/sections/ServicesIntroSection";
import AboutUsTeaserSection from "@/components/sections/AboutUsTeaserSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";
import ServicesDetailSection from "@/components/sections/ServicesDetailSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <main className="flex-grow">
      <HeroSection />
      <CTASection />
      <ServicesIntroSection />
      <ServicesDetailSection />
      <ProjectsSection />
      <AboutUsTeaserSection />
      <ContactInfoSection />
      <ContactFormSection />
    </main>
  );
};

export default Index;
