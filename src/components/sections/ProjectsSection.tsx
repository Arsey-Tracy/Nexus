/** @format */
"use client";

import React from "react";
import ProjectCard from "@/components/ProjectCard";
// Button import can be removed if not used for "View All Projects"
// import { Button } from '@/components/ui/button';

const mockProjects = [
  {
    id: "1",
    title: "Nexus AI Health Assistant (NAHA)",
    description: "An AI-powered tool to support healthcare needs.",
    imageUrl: "/placeholder.svg", // Ensure this path is correct or use an uploaded image
    goal: 10000,
    raised: 4500,
  },
  {
    id: "2",
    title: "Breast Cancer Prevention Innovation",
    description:
      "Solutions for early detection and prevention of breast cancer",
    imageUrl: "/placeholder.svg",
    goal: 25000,
    raised: 12000,
  },
  {
    id: "3",
    title: "Sign Language Translator",
    description:
      "Building an innovative sign language translator into text and speech using AI.",
    imageUrl: "/placeholder.svg",
    goal: 50000,
    raised: 15000,
  },
  {
    id: "4",
    title: "AMR Digital Tracker(planned)",
    description: "A tool to monitor and track antimicrobial resistance",
    imageUrl: "/placeholder.svg",
    goal: 150000,
    raised: 34000,
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
