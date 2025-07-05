/** @format */
"use client";

import React from "react";
import ProjectCard from "@/components/ProjectCard";
// Button import can be removed if not used for "View All Projects"
// import { Button } from '@/components/ui/button';

const mockProjects = [
  {
    id: "1",
    title: "Telemedicine for Rural Clinics",
    description:
      "Equipping remote clinics with telemedicine kits to improve access to specialist consultations.",
    imageUrl: "/placeholder.svg", // Ensure this path is correct or use an uploaded image
    goal: 10000,
    raised: 4500,
  },
  {
    id: "2",
    title: "AI-Powered Diagnostic Tool Research",
    description:
      "Funding research into AI algorithms for early disease detection from medical imaging.",
    imageUrl: "/placeholder.svg",
    goal: 25000,
    raised: 12000,
  },
  {
    id: "3",
    title: "Healthcare Innovation Hub Setup",
    description:
      "Building a collaborative space for healthcare professionals to develop and test new solutions.",
    imageUrl: "/placeholder.svg",
    goal: 50000,
    raised: 15000,
  },
];

const ProjectsSection = () => {
  return (
    <section className="py-12 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Support Our Projects
          </h2>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            Your contributions help us innovate and expand healthcare
            accessibility. Join us in making a difference.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id} // Pass the id to ProjectCard
              title={project.title}
              description={project.description}
              imageUrl={project.imageUrl}
            />
          ))}
        </div>
        {/* Optional: A button to see all projects if this section is a teaser on the homepage
            And if the current page is not already /projects
        */}

        {/* {window.location.pathname !== "/projects" && (
          <div className="text-center mt-12 md:mt-16">
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        )} */}
      </div>
    </section>
  );
};

export default ProjectsSection;
