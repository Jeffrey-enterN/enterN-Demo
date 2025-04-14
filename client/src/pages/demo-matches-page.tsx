import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UserCircle, Building } from "lucide-react";
import MatchList from "@/components/match-list";
import { sampleEmployerMatches, sampleJobseekerMatches, demoNewMatches } from "@/data/sample-matches";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function DemoMatchesPage() {
  const [loading, setLoading] = useState(true);
  const [employerMatches, setEmployerMatches] = useState<any[]>([]);
  const [jobseekerMatches, setJobseekerMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("jobseeker");
  const [activeSubTab, setActiveSubTab] = useState<string>("matches");
  const { toast } = useToast();
  
  // Load matches from local storage if available
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // In a real app, this would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        // Check if we have stored matches in localStorage for both types
        const storedJobseekerMatches = localStorage.getItem('jobseekerMatches');
        const storedEmployerMatches = localStorage.getItem('employerMatches');
        
        if (storedJobseekerMatches) {
          setJobseekerMatches(JSON.parse(storedJobseekerMatches));
        } else {
          // Use sample data for demo
          setJobseekerMatches(sampleJobseekerMatches);
        }
        
        if (storedEmployerMatches) {
          setEmployerMatches(JSON.parse(storedEmployerMatches));
        } else {
          // Use sample data for demo
          setEmployerMatches(sampleEmployerMatches);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast({
          title: "Error",
          description: "Failed to load matches. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchMatches();
    
    // Check if there are new matches from swiping
    const checkNewMatches = () => {
      const pendingMatches = JSON.parse(localStorage.getItem('pendingMatches') || '{}');
      const newMatchesFound = Object.keys(pendingMatches).filter(id => pendingMatches[id] === "INTERESTED");
      
      if (newMatchesFound.length > 0) {
        // Add new matches for demo purposes - in a real app, this would happen server-side
        const newMatches = newMatchesFound.map(id => demoNewMatches[id as keyof typeof demoNewMatches]).filter(Boolean);
        
        if (newMatches.length > 0) {
          const updatedMatches = [...jobseekerMatches, ...newMatches];
          setJobseekerMatches(updatedMatches);
          
          // Store in localStorage
          localStorage.setItem('jobseekerMatches', JSON.stringify(updatedMatches));
          
          // Show notification
          toast({
            title: "New Match!",
            description: `You have ${newMatches.length} new ${newMatches.length === 1 ? 'match' : 'matches'}!`,
            className: "bg-green-50 border-green-200",
          });
          
          // Clear pending matches
          localStorage.setItem('pendingMatches', '{}');
        }
      }
    };
    
    // Only check for new matches after initial load
    if (!loading) {
      checkNewMatches();
    }
  }, [loading, toast]);
  
  return (
    <div className="min-h-screen bg-[#f8fdfd] pt-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Demo: Messaging</h1>
        <p className="text-gray-600 text-center mb-6">
          Message with your matches after you both express interest
        </p>
        
        <Tabs 
          defaultValue="jobseeker" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-2xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger 
              value="jobseeker" 
              className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Jobseeker View
            </TabsTrigger>
            <TabsTrigger 
              value="employer" 
              className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
            >
              <Building className="h-4 w-4 mr-2" />
              Employer View
            </TabsTrigger>
          </TabsList>
          
          {/* Jobseeker View */}
          <TabsContent value="jobseeker" className="mt-0">
            <Tabs 
              defaultValue="matches" 
              value={activeSubTab}
              onValueChange={setActiveSubTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger 
                  value="matches" 
                  className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
                >
                  Matches
                </TabsTrigger>
                <TabsTrigger 
                  value="messages" 
                  className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
                >
                  Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches" className="mt-0">
                {loading ? (
                  <Card>
                    <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin text-[#5ce1e6]" />
                    </CardContent>
                  </Card>
                ) : (
                  <MatchList 
                    matches={jobseekerMatches} 
                    currentUserId={100} // Demo user ID
                    currentUserName="Bradley Student" // Demo user name
                    type="jobseeker"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="messages" className="mt-0">
                {loading ? (
                  <Card>
                    <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin text-[#5ce1e6]" />
                    </CardContent>
                  </Card>
                ) : (
                  <MatchList 
                    matches={jobseekerMatches.filter(match => match.recentMessage || match.hasUnreadMessages)} 
                    currentUserId={100} // Demo user ID
                    currentUserName="Bradley Student" // Demo user name
                    type="jobseeker"
                  />
                )}
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 mb-2">
                Want to find more potential employer matches?
              </p>
              <Button
                onClick={() => window.location.href = "/demo-employer-feed"}
                className="bg-[#5ce1e6] hover:bg-[#4bced3] text-white"
              >
                Go to Employer Feed
              </Button>
            </div>
          </TabsContent>
          
          {/* Employer View */}
          <TabsContent value="employer" className="mt-0">
            <Tabs 
              defaultValue="matches" 
              value={activeSubTab}
              onValueChange={setActiveSubTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger 
                  value="matches" 
                  className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
                >
                  All Matches
                </TabsTrigger>
                <TabsTrigger 
                  value="messages" 
                  className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
                >
                  Active Conversations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches" className="mt-0">
                {loading ? (
                  <Card>
                    <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin text-[#5ce1e6]" />
                    </CardContent>
                  </Card>
                ) : (
                  <MatchList 
                    matches={employerMatches} 
                    currentUserId={200} // Demo employer ID
                    currentUserName="TechNova" // Demo employer name
                    type="employer"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="messages" className="mt-0">
                {loading ? (
                  <Card>
                    <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin text-[#5ce1e6]" />
                    </CardContent>
                  </Card>
                ) : (
                  <MatchList 
                    matches={employerMatches.filter(match => match.recentMessage || match.hasUnreadMessages)} 
                    currentUserId={200} // Demo employer ID
                    currentUserName="TechNova" // Demo employer name
                    type="employer"
                  />
                )}
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 mb-2">
                Want to find more potential candidate matches?
              </p>
              <Button
                onClick={() => window.location.href = "/demo-match-feed"}
                className="bg-[#5ce1e6] hover:bg-[#4bced3] text-white"
              >
                Go to Candidate Feed
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}