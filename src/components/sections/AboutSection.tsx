/** @format */
"use-client";
// Update the import path below to the correct relative path where your Card components are located.
// For example, if they are in 'src/components/ui/card', use the following:
import { CardHeader, Card, CardTitle, CardContent } from "../ui/card";
import { Users, Info } from "lucide-react";
import Image from "next/image";

function AboutSection() {
  return (
    <section id="about" className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sky-700 mb-4">
            About NexusCare
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pioneering the future of healthcare through innovative technology
            and collaborative research.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Image
            src="/placeholder.svg"
            alt="Our Team"
            width={600}
            height={384}
            className="rounded-lg shadow-lg object-cover w-full h-auto max-h-96"
            style={{ width: "100%", height: "auto", maxHeight: "24rem" }}
            priority
          />
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="">
                  <Users className="" />
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <p className="text-gray-700">
                  Our mission is foster innovation in healthcare by connecting
                  bright minds, funding groundbreaking, and providing essential
                  services to accelerate medical advancements. We believe in a
                  collaborative approach to solve complex health challenges.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sky-600">
                  <Info className="h-6 w-6 mr-2" /> Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We envision a world where innovative healthcare solutions are
                  accessible to all, leading to improved patient outcomes and a
                  healthier global community. CareInnovate Hub strives to be at
                  the forefront of this transformation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
