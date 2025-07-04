/** @format */
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-20 md:py-32 animate-fade-in">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Welcome to NexusCare
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Your trusted partner in Telemedicine, groundbreaking Research, and
          healthcare Innovation. Connecting patients, professionals, and
          hospitals seamlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-sky-600 hover:bg-gray-100 font-semibold shadow"
          >
            <Link href="/learn-more">Learn More</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-sky-600 text-white hover:bg-sky-700 font-semibold shadow"
          >
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

// Add this to your global CSS (e.g., globals.css):
/*
@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade-in {
  animation: fade-in 1s ease;
}
*/
