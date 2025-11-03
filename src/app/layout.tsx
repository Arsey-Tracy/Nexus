/** @format */

import type { Metadata } from "next";
import { Geist } from "next/font/google";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
import ClientProviders from "./providers/ClientProviders";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "NexusCare",
  description: "Your health, wherever you are",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body>
        {/* wrap app in client providers (AuthProvider runs only on client) */}
        <ClientProviders>
          {/* <Navbar /> */}
          {children}
          {/* <Footer /> */}
        </ClientProviders>
      </body>
    </html>
  );
}
