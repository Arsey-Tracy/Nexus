/** @format */

"use client";

import React from "react";
import Image from "next/image";
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
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-[#0f172a] border border-[#0891B2]/10 relative">
      <CardHeader className="p-0 relative">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={192}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-[#07101f]/90 rounded-full p-1 shadow-lg shadow-[#0891B2]/20">
          <Heart className="h-5 w-5 text-[#38bdf8]" />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col flex-grow">
        <CardTitle className="mb-2 text-xl font-semibold text-white">
          {title}
        </CardTitle>
        <CardDescription className="text-slate-300 leading-relaxed mb-4 flex-grow">
          {description}
        </CardDescription>
        <CardFooter className="p-0 mt-auto">
          <Button
            onClick={handleDonateClick}
            className="w-full bg-[#0891B2] hover:bg-[#0d7e9c] text-white font-semibold shadow cursor-pointer"
          >
            Donate Now
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
