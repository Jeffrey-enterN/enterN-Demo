import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import MatchCard from "@/components/match-card";
import { sampleJobseekers } from "@/data/sample-profiles";
import { useToast } from "@/hooks/use-toast";

export default function DemoMatchFeed() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("job-fair");
  const [availableJobseekers, setAvailableJobseekers] = useState([...sampleJobseekers]);
  
  // Simplified match handling for demo
  const handleMatch = (jobseekerId: number, status: string) => {
    // Log matching for debugging
    console.log(`Matched with ID ${jobseekerId}, status: ${status}`);
    
    // Show toast notification
    if (status === "MATCHED") {
      toast({
        title: "Interest sent",
        description: "You've expressed interest in this candidate.",
      });
    } else if (status === "REJECTED") {
      toast({
        title: "Candidate passed",
        description: "This candidate has been removed from your match feed.",
      });
    }
    
    // Remove the candidate from the available list
    setAvailableJobseekers(prev => prev.filter(jobseeker => jobseeker.id !== jobseekerId));
    
    // If all jobseekers have been processed, reset the list for demo purposes
    if (availableJobseekers.length <= 1) {
      setTimeout(() => {
        setAvailableJobseekers([...sampleJobseekers]);
        toast({
          title: "Match queue refreshed",
          description: "New candidates have been added to your match feed.",
        });
      }, 500);
    }
  };

  // Filter jobseekers based on active tab
  const filteredJobseekers = availableJobseekers.filter((jobseeker) => {
    if (activeTab === "job-fair") {
      // Logic for job fair filter - for demo, show all with Bachelor's or Master's degree
      return jobseeker.degreeLevel.includes("Bachelor") || jobseeker.degreeLevel.includes("Master");
    } else if (activeTab === "local") {
      // Logic for local candidates - for demo, show all with tech-related majors
      const techMajors = ["Computer Science", "Data Science", "Cloud Architecture", "Information Security", "Game Design"];
      return techMajors.some(tech => jobseeker.major.includes(tech));
    } else {
      // All candidates
      return true;
    }
  });

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6 border-b">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Match Card Demo</h1>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-heading font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Match Feed
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center hover:bg-[rgba(92,225,230,0.1)]"
                style={{borderColor: "#5ce1e6", color: "#5ce1e6"}}
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
                    className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
                  >
                    Job Fair
                  </TabsTrigger>
                  <TabsTrigger 
                    value="local"
                    className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
                  >
                    Local
                  </TabsTrigger>
                  <TabsTrigger 
                    value="all"
                    className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
                  >
                    All
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {filteredJobseekers.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{background: "rgba(92, 225, 230, 0.1)"}}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: "rgba(92, 225, 230, 0.2)"}}>
                      <div className="w-6 h-6 rounded-full" style={{background: "rgba(92, 225, 230, 0.3)"}}></div>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                  <p className="text-gray-500">There are no candidates in this queue at the moment. Check back later!</p>
                </div>
              ) : (
                <>
                  {/* Match Card */}
                  {filteredJobseekers.map((jobseeker) => (
                    <div className="mb-10" key={jobseeker.id}>
                      <MatchCard
                        profile={jobseeker}
                        onReject={() => handleMatch(jobseeker.id, "REJECTED")}
                        onAccept={() => handleMatch(jobseeker.id, "MATCHED")}
                      />
                    </div>
                  ))}

                  {/* Instructions */}
                  <div className="mt-8 text-center text-sm p-4 rounded-lg" 
                      style={{background: "linear-gradient(rgba(92, 225, 230, 0.05), rgba(92, 225, 230, 0.05))"}}>
                    <p className="font-medium" style={{color: "#0097b1"}}>Swipe right to express interest or left to pass</p>
                    <p className="mt-1 text-gray-500">You can also use the buttons or arrow keys</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}