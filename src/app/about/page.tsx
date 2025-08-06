/** @format */
import React from "react";

import AboutSection from "@/components/sections/AboutSection";
import HeroSection from "@/components/sections/HeroSection";

const AboutUsPage = () => {
  return (
    <main className="flex-grow">
      {/* You can customize the HeroSection props or create a dedicated hero for this page */}
      {/* You can customize the HeroSection props or create a dedicated hero for this page */}
      <HeroSection
        title="Get to Know Us"
        subtitle="Learn about CareInnovate Hub's mission, vision, and the team driving healthcare innovation."
        showCta={false} // Assuming no specific CTA for this hero
      />
      <AboutSection />
    </main>
  );
};

export default AboutUsPage;
