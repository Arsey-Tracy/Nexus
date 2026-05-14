/** @format */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "FAQs", href: "/faq" },
  ],
};

const socials = [
  { Icon: Github, href: "https://github.com/", label: "GitHub" },
  { Icon: Twitter, href: "https://twitter.com/", label: "Twitter" },
  { Icon: Linkedin, href: "https://linkedin.com/", label: "LinkedIn" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto max-w-7xl px-6 pt-14 pb-10">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr] border-b border-slate-800 pb-12">
          <div className="space-y-5">
            <Link
              href="/"
              className="flex items-center gap-3 focus:outline-none"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 shadow-none">
                <Image
                  width={18}
                  height={18}
                  src="/nexuscareuglogo.svg"
                  alt="NexusCare logo"
                  className="object-contain brightness-0 invert"
                />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-white">
                  Nexus<span className="text-sky-400">Care</span>
                  <span className="ml-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                    UG
                  </span>
                </p>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-slate-400">
              Pioneering accessible, technology-driven healthcare for Uganda and
              beyond.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-slate-300 transition hover:bg-sky-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Platform
            </p>
            <ul className="space-y-3 text-sm text-slate-400">
              {footerLinks.Platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Legal
            </p>
            <ul className="space-y-3 text-sm text-slate-400">
              {footerLinks.Legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-800 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} NexusCare Uganda. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 italic">
            Innovating Healthcare, Together.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
