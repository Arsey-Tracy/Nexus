/** @format */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  imageUrl,
}) => {
  const router = useRouter();

  const handleDonateClick = () => {
    router.push(`/donate/${id}`);
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white border-0">
      <CardHeader className="p-0 relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow">
          <Heart className="h-5 w-5 text-sky-600" />
        </div>
      </CardHeader>
      <div className="p-6 flex flex-col flex-grow">
        <CardTitle className="mb-2 text-xl font-semibold text-sky-700">
          {title}
        </CardTitle>
        <CardContent className="p-0 flex-grow mb-4">
          <CardDescription className="text-gray-600 leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-0 mt-auto">
          <Button
            onClick={handleDonateClick}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow"
          >
            Donate Now
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProjectCard;
