/** @format */
"use client";
import DonationForm from "@/components/DonationForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import Image from "next/image";

const mockProjectsData = [
  {
    id: "1",
    title: "Telemedicine for Rural Clinics",
    description:
      "Equipping remote clinics with telemedicine kits to improve access to specialist consultations.",
    imageUrl: "https://example.com/project-alpha.jpg",
    donationLink: "https://example.com/donate/alpha",
  },
  {
    id: "2",
    title: "AI-Powered Diagnostic Tool Research",
    description:
      "Funding research into AI algorithms for early disease detection from medical imaging.",
    imageUrl: "/placeholder.svg",
    donationLink: "https://example.com/donate/alpha",
  },
  {
    id: "3",
    title: "Healthcare Innovation Hub Setup",
    description:
      "Building a collaborative space for healthcare professionals to develop and test new solutions.",
    imageUrl: "/placeholder.svg",
    donationLink: "https://example.com/donate/alpha",
  },
];

const DonationPage = () => {
  const params = useParams();
  const { id } = params;
  const project = mockProjectsData.find((proj) => proj.id === id);

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 py-12">
      {project ? (
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="bg-gray-50 rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl font-bold text-sky-700">
              Donate to: {project.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={800}
              height={256}
              className="w-full h-64 object-cover rounded-md mb-6"
              priority
            />
            <CardDescription className="text-lg text-gray-700 mb-6">
              {project.description}
            </CardDescription>

            <DonationForm projectTitle={project.title} />
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-10">
          <h1 className="text-3xl font-semibold text-red-600">
            Project Not Found
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            We couldn&#39;t find the project you&#39;re looking for. It might
            have been moved or no longer exists.
          </p>
          <Button
            asChild
            variant="link"
            className="mt-6 text-sky-600 hover:text-sky-700"
          >
            <a href="/projects">View All Projects</a>
          </Button>
        </div>
      )}
    </main>
  );
};

export default DonationPage;
