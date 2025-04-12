import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MatchStatusEnum } from "@shared/schema";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import MatchCard from "@/components/match-card";

export default function EmployerMatchFeed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("job-fair");

  // Get employer profile
  const { data: employerProfile } = useQuery({
    queryKey: ["/api/employer/profile"],
    enabled: !!user,
  });

  // Get match feed data
  const { data: jobseekers = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ["/api/employer/match-feed"],
    enabled: !!employerProfile,
  });

  // Match mutation
  const matchMutation = useMutation({
    mutationFn: async ({ jobseekerId, status }: { jobseekerId: number, status: string }) => {
      const res = await apiRequest("POST", "/api/employer/match", { jobseekerId, status });
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.employerStatus === MatchStatusEnum.MATCHED && data.jobseekerStatus === MatchStatusEnum.MATCHED) {
        toast({
          title: "It's a match!",
          description: "You've matched with this candidate. You can now share job postings.",
        });
      } else if (data.employerStatus === MatchStatusEnum.MATCHED) {
        toast({
          title: "Interest sent",
          description: "You've expressed interest in this candidate.",
        });
      } else if (data.employerStatus === MatchStatusEnum.REJECTED) {
        toast({
          title: "Candidate passed",
          description: "This candidate has been removed from your match feed.",
        });
      }
      
      // Refetch the match feed
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleMatch = (jobseekerId: number, status: string) => {
    matchMutation.mutate({ jobseekerId, status });
  };

  // Filter jobseekers based on active tab
  const filteredJobseekers = jobseekers.filter((jobseeker: any) => {
    if (activeTab === "job-fair") {
      // Logic for job fair filter
      return true; // Placeholder for demo
    } else if (activeTab === "local") {
      // Logic for local candidates
      return true; // Placeholder for demo
    } else {
      // All candidates
      return true;
    }
  });

  return (
    <div className="h-full flex flex-col">
      <Navbar />

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

              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: "#ff66c4"}}></div>
                </div>
              ) : filteredJobseekers.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{background: "rgba(92, 225, 230, 0.1)"}}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: "rgba(255, 102, 196, 0.2)"}}>
                      <div className="w-6 h-6 rounded-full" style={{background: "rgba(200, 253, 4, 0.3)"}}></div>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                  <p className="text-gray-500">There are no candidates in this queue at the moment. Check back later!</p>
                </div>
              ) : (
                <>
                  {/* Match Card */}
                  {filteredJobseekers.map((jobseeker: any) => (
                    <MatchCard
                      key={jobseeker.id}
                      profile={jobseeker}
                      onReject={() => handleMatch(jobseeker.id, MatchStatusEnum.REJECTED)}
                      onAccept={() => handleMatch(jobseeker.id, MatchStatusEnum.MATCHED)}
                    />
                  ))}

                  {/* Instructions */}
                  <div className="mt-8 text-center text-sm p-4 rounded-lg" 
                       style={{background: "linear-gradient(rgba(92, 225, 230, 0.05), rgba(255, 102, 196, 0.05))"}}>
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
