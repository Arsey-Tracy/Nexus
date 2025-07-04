/** @format */

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";

const ContactPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ContactInfoSection />
        <ContactFormSection />
      </main>
      <Footer />
    </div>
  );
};
export default ContactPage;
