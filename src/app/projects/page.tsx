/** @format */

import React from "react";

import ProjectsSection from "@/components/sections/ProjectsSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ProjectsPage = () => {
  return (
    <main className="flex-grow">
      <Navbar />
      <ProjectsSection />
      <Footer />
    </main>
  );
};

export default ProjectsPage;
// This page is dedicated to displaying all projects.
// It uses the ProjectsSection component to list and detail projects.
