/** @format */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
  className={`sticky top-0 z-50 transition-all duration-300 ${
    scrolled
      ? "bg-white/95 backdrop-blur-xl shadow-sm shadow-slate-300/10 border-b border-slate-200/70"
      : "bg-white border-b border-transparent"
  }`}
>
  <nav
    className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8 max-w-7xl"
    aria-label="Main navigation"
  >
    <Link
      href="/"
      className="flex items-center gap-3 focus:outline-none"
      aria-label="NexusCare Home"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-100 ring-1 ring-sky-200/60 transition-transform duration-150 hover:scale-105">
        <Image
          width={44}
          height={44}
          src="/nexuscareuglogo.svg"
          alt="Nexus Care Uganda Logo"
          className="h-full w-full object-cover"
        />
      </div>
      <span className="text-lg font-semibold text-blue-600 transition-colors duration-150 hover:text-sky-700">
        Nexus Care
        <span className="ml-0.5 text-[10px] font-medium text-slate-400 uppercase tracking-[0.25em]">
          UG
        </span>
      </span>
    </Link>

    <div className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-slate-50/60 p-1 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.to}
          href={link.to}
          aria-current={pathname === link.to ? "page" : undefined}
          className={`rounded-full px-4 py-2 text-sm font-medium transition duration-150 ${
            pathname === link.to
              ? "bg-sky-50 text-sky-600 shadow-sm shadow-sky-200/50"
              : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>

    <div className="hidden items-center gap-3 md:flex">
      <Button
        asChild
        variant="ghost"
        className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <Link href="/signin">Sign In</Link>
      </Button>
      <Button
        asChild
        className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition-transform duration-150 hover:scale-[1.02] hover:bg-sky-700"
      >
        <Link href="/register">Get Started</Link>
      </Button>
    </div>

    <div className="md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="rounded-t-3xl bg-white">
          <DrawerHeader className="flex items-center justify-between border-b border-slate-100 px-6 pb-4 pt-6">
            <DrawerTitle className="flex items-center gap-3 text-base font-semibold text-blue-900">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-100 ring-1 ring-sky-200/60">
                <Image
                  width={44}
                  height={44}
                  src="/nexuscareuglogo.svg"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              NexusCare<span className="text-sky-600">UG</span>
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 text-slate-400 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="space-y-1.5 px-4 py-5">
            {navLinks.map((link) => (
              <DrawerClose key={link.to} asChild>
                <Link
                  href={link.to}
                  aria-current={pathname === link.to ? "page" : undefined}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    pathname === link.to
                      ? "bg-sky-50 text-sky-700"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              </DrawerClose>
            ))}
          </div>

          <div className="border-t border-slate-100 px-4 pb-8 pt-4 space-y-3">
            <DrawerClose asChild>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-2xl border-slate-200 text-slate-700 font-medium"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button
                asChild
                className="w-full rounded-2xl bg-sky-600 font-semibold text-white hover:bg-sky-700"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  </nav>
</header>
  );
};

export default Navbar;
