/** @format */
"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

const ProjectsSection = () => {
  return (
    <section className="py-12 md:py-20 bg-[#07101f]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Support Our Projects
          </h2>
          <p className="text-lg text-slate-300 mt-3 max-w-2xl mx-auto">
            Your contributions help us innovate and expand healthcare
            accessibility. Join us in making a difference.
          </p>
        </div>

        {/* Under Development Message */}
        <div className="max-w-2xl mx-auto rounded-2xl border border-amber-200 bg-amber-50 px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-amber-100 p-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mb-2">
            Coming Soon
          </h3>
          <p className="text-amber-800">
            The projects feature is currently under development. We're working
            hard to bring you innovative healthcare projects soon. Check back
            later!
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
