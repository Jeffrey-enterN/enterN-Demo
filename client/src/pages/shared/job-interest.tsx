import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InterestStatusEnum } from "@shared/schema";
import { Navbar } from "@/components/navbar";
import JobCard from "@/components/job-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobInterest() {
  const { matchId } = useParams();
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Get the match information
  const { data: jobInterests, isLoading: isLoadingInterests } = useQuery({
    queryKey: [`/api/job-interests/${matchId}`],
    enabled: !!matchId,
  });

  // Get employer profile for display
  const { data: employerProfile } = useQuery({
    queryKey: ["/api/employer/profile"],
    enabled: user?.role === "employer",
  });

  // Get job postings for this employer
  const { data: jobPostings } = useQuery({
    queryKey: ["/api/job-postings"],
    enabled: user?.role === "employer",
  });

  // Update job interest status mutation
  const updateInterestMutation = useMutation({
    mutationFn: async ({ jobId, status }: { jobId: number; status: string }) => {
      const res = await apiRequest("POST", "/api/job-interest", {
        matchId: parseInt(matchId as string),
        jobId,
        status,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      let message = "";
      if (data.status === InterestStatusEnum.INTERESTED) {
        message = "You've expressed interest in this position!";
      } else {
        message = "You've declined this position.";
      }

      toast({
        title: "Response saved",
        description: message,
      });

      // Refetch job interests
      queryClient.invalidateQueries({ queryKey: [`/api/job-interests/${matchId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating interest",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInterestUpdate = (jobId: number, status: string) => {
    updateInterestMutation.mutate({ jobId, status });
  };

  // If all job interests are handled, redirect to matches page
  useEffect(() => {
    if (
      !isLoadingInterests &&
      jobInterests &&
      jobInterests.length > 0 &&
      jobInterests.every((interest) => interest.status !== InterestStatusEnum.PENDING)
    ) {
      toast({
        title: "All positions reviewed",
        description: "You've reviewed all positions for this match.",
      });
      
      setTimeout(() => {
        setLocation(user?.role === "employer" ? "/employer/match-feed" : "/jobseeker/match-feed");
      }, 2000);
    }
  }, [jobInterests, isLoadingInterests, setLocation, user?.role, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow">
            <CardHeader className="border-b border-gray-200 flex flex-col sm:flex-row sm:items-center">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center mr-4">
                  {employerProfile && employerProfile.companyName ? (
                    <span className="text-lg font-bold text-primary-600">
                      {employerProfile.companyName.charAt(0)}
                    </span>
                  ) : (
                    <div className="bg-gray-200 h-full w-full" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg font-heading">
                    {isLoadingInterests ? (
                      "Loading match details..."
                    ) : (
                      `It's a Match${employerProfile ? ` with ${employerProfile.companyName}` : ""}!`
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {user?.role === "jobseeker"
                      ? "They're interested in your profile"
                      : "They're interested in your company"}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-5">
              {isLoadingInterests ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
              ) : jobInterests && jobInterests.length > 0 ? (
                <>
                  <p className="text-gray-700 mb-6">
                    {user?.role === "jobseeker"
                      ? "The employer has shared the following positions they think would be a good fit for you. Please review and indicate your interest in each role."
                      : "The candidate is interested in your company. Share some relevant positions that match their profile."}
                  </p>

                  <div className="space-y-6">
                    {jobInterests
                      .filter((interest) => interest.status === InterestStatusEnum.PENDING)
                      .map((interest) => {
                        // Find the job posting details
                        const jobPosting = jobPostings?.find((job) => job.id === interest.jobId);
                        
                        return (
                          <JobCard
                            key={interest.id}
                            job={jobPosting}
                            onReject={() => handleInterestUpdate(interest.jobId, InterestStatusEnum.NOT_INTERESTED)}
                            onAccept={() => handleInterestUpdate(interest.jobId, InterestStatusEnum.INTERESTED)}
                            userRole={user?.role}
                          />
                        );
                      })}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No job positions shared yet</h3>
                  <p className="text-gray-500">
                    {user?.role === "employer"
                      ? "Share job positions with this candidate to gauge their interest."
                      : "The employer hasn't shared any positions with you yet. Check back later!"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
