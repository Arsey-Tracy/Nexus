/** @format */

"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-6 py-8 text-center text-gray-600">
        <div className="mb-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
          <div>
            <Link href="/privacy-policy" className="mx-2 hover:text-sky-600">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="mx-2 hover:text-sky-600">
              Terms of Service
            </Link>
            <Link href="/faq" className="mx-2 hover:text-sky-600">
              FAQs
            </Link>
          </div>
          <div className="flex justify-center gap-3 mt-2 md:mt-0">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-sky-600"
            >
              <Github className="inline h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-sky-600"
            >
              <Twitter className="inline h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-sky-600"
            >
              <Linkedin className="inline h-5 w-5" />
            </a>
          </div>
        </div>
        <p>&copy; {currentYear} NexusCare. All rights reserved.</p>
        <p className="text-sm mt-2">Innovating Healthcare, Together.</p>
      </div>
    </footer>
  );
};

export default Footer;
