/** @format */

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectsSection from "@/components/sections/ProjectsSection";

const ProjectsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
// This page is dedicated to displaying all projects.
// It uses the ProjectsSection component to list and detail projects.
