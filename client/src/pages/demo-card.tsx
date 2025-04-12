import MatchCard from "@/components/match-card";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Sample data for a demo jobseeker profile
const sampleJobseeker = {
  id: 1,
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.j@example.com",
  school: "Stanford University",
  degreeLevel: "Masters",
  major: "Computer Science",
  summary: "Passionate developer with expertise in React, TypeScript, and Node.js. Looking for opportunities in tech startups.",
  preferredIndustries: ["Tech", "Healthcare", "Finance"],
  preferences: {
    preferences: {
      remoteWork: 8,
      organizationSize: 3,
      growthTrajectory: 5
    }
  }
};

export default function DemoCard() {
  const [activeTab, setActiveTab] = useState("job-fair");

  const handleMatch = (id: number, status: string) => {
    console.log(`Matched with ID ${id}, status: ${status}`);
  };

  return (
    <div className="h-full flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-heading font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Match Card Demo
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center border-brand-pink text-brand-pink hover:bg-brand-pink-light"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-lg">
              {/* Queue Selection Tabs */}
              <Tabs 
                defaultValue="job-fair" 
                className="mb-6"
                onValueChange={(value) => setActiveTab(value)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger 
                    value="job-fair" 
                    className="data-[state=active]:bg-brand-pink data-[state=active]:text-white"
                  >
                    Job Fair
                  </TabsTrigger>
                  <TabsTrigger 
                    value="local"
                    className="data-[state=active]:bg-brand-cyan data-[state=active]:text-white"
                  >
                    Local
                  </TabsTrigger>
                  <TabsTrigger 
                    value="all"
                    className="data-[state=active]:bg-brand-lime-medium data-[state=active]:text-black"
                  >
                    All
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Match Card Demo */}
              <MatchCard
                profile={sampleJobseeker}
                onReject={() => handleMatch(sampleJobseeker.id, "REJECTED")}
                onAccept={() => handleMatch(sampleJobseeker.id, "MATCHED")}
              />

              {/* Instructions */}
              <div className="mt-8 text-center text-sm p-4 rounded-lg" 
                   style={{background: "linear-gradient(rgba(92, 225, 230, 0.05), rgba(255, 102, 196, 0.05))"}}>
                <p className="font-medium" style={{color: "#0097b1"}}>Swipe right to express interest or left to pass</p>
                <p className="mt-1 text-gray-500">You can also use the buttons or arrow keys</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}