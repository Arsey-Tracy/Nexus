/** @format */

import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";

const ContactPage = () => {
  return (
    <main className="flex-grow">
      <ContactInfoSection />
      <ContactFormSection />
    </main>
  );
};
export default ContactPage;
