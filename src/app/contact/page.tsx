/** @format */

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";
import HeroSection from "@/components/sections/HeroSection";
const ContactPage = () => {
  return (
    <main className="flex-grow">
      <Navbar />
      <HeroSection
        title="Get In Touch"
        subtitle="We'd love to hear from you. Reach out through any of the
            channels below."
      />
      <ContactInfoSection />

      <ContactFormSection />
      <Footer />
    </main>
  );
};
export default ContactPage;
