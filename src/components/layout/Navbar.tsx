/** @format */

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, Menu, X } from "lucide-react";
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
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  // { to: "/signin", label: "Sign In" },
  // { to: "/register", label: "Register" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav
        className="container mx-auto px-6 py-3 flex justify-between items-center max-w-7xl"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-2xl font-bold text-sky-600 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
          aria-label="NexusCare Home"
        >
          <span className="flex items-center">
            <Stethoscope className="h-8 w-8 mr-2" />
            NexusCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-3 sm:space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                pathname === link.to
                  ? "bg-sky-100 text-sky-700 font-semibold"
                  : "text-gray-700 hover:text-sky-600 hover:bg-sky-50"
              }`}
              aria-current={pathname === link.to ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}

          {/* Add Auth buttons separately */}
          <Button asChild variant="outline" className="px-4 py-2">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button
            asChild
            className="px-4 py-2 bg-sky-600 text-white hover:bg-sky-700"
          >
            <Link href="/register">Register</Link>
          </Button>
        </div>

        {/* Mobile Navigation - Drawer */}
        <div className="md:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex justify-between items-center p-4 border-b">
                <DrawerTitle className="text-xl font-semibold text-sky-700">
                  Menu
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close menu">
                    <X className="h-6 w-6" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              <div className="p-4">
                <ul className="space-y-3">
                  {navLinks.map((link) => (
                    <li key={link.to}>
                      <DrawerClose asChild>
                        <Link
                          href={link.to}
                          className={`block py-2 px-3 text-lg rounded-md transition-colors ${
                            pathname === link.to
                              ? "bg-sky-100 text-sky-700 font-semibold"
                              : "text-gray-700 hover:text-sky-600 hover:bg-sky-50"
                          }`}
                          aria-current={
                            pathname === link.to ? "page" : undefined
                          }
                        >
                          {link.label}
                        </Link>
                      </DrawerClose>
                    </li>
                  ))}

                  {/* Add mobile auth buttons (full width for better tap targets) */}
                  <li className="pt-2">
                    <DrawerClose asChild>
                      <Button asChild variant="outline" className="w-full mb-2">
                        <Link href="/signin">Sign In</Link>
                      </Button>
                    </DrawerClose>
                  </li>
                  <li>
                    <DrawerClose asChild>
                      <Button
                        asChild
                        className="w-full bg-sky-600 text-white hover:bg-sky-700"
                      >
                        <Link href="/register">Register</Link>
                      </Button>
                    </DrawerClose>
                  </li>
                </ul>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
