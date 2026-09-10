/** @format */

import type { Metadata } from "next";

import ClientProviders from "./providers/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Care Uganda",
  description: "Your health, wherever you are",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0c4a6e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
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
