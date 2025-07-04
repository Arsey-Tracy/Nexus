/** @format */

import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ServicesIntroSection from "@/components/sections/ServicesIntroSection";
import AboutUsTeaserSection from "@/components/sections/AboutUsTeaserSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import Footer from "@/components/layout/Footer";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesDetailSection from "@/components/sections/ServiceDetailSection";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ServicesIntroSection />
        <ServicesDetailSection />
        <ProjectsSection />
        <AboutSection />
        <AboutUsTeaserSection />
        <ContactInfoSection />
        <ContactFormSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
