/** @format */

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";

const ContactPage = () => {
  return (
    <main className="flex-grow">
      <Navbar />
      <ContactInfoSection />
      <ContactFormSection />
      <Footer />
    </main>
  );
};
export default ContactPage;
