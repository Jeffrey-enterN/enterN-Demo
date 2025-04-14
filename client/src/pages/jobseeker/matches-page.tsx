import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import MatchList from "@/components/match-list";
import { sampleJobseekerMatches, demoNewMatches } from "@/data/sample-matches";
import { useToast } from "@/hooks/use-toast";

export default function JobseekerMatchesPage() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("matches");
  const { toast } = useToast();
  
  // Load matches from local storage if available
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // In a real app, this would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        // Check if we have stored matches in localStorage
        const storedMatches = localStorage.getItem('jobseekerMatches');
        
        if (storedMatches) {
          setMatches(JSON.parse(storedMatches));
        } else {
          // Use sample data for demo
          setMatches(sampleJobseekerMatches);
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
          const updatedMatches = [...matches, ...newMatches];
          setMatches(updatedMatches);
          
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
    if (!loading && matches.length > 0) {
      checkNewMatches();
    }
  }, [loading, toast]);
  
  return (
    <div className="min-h-screen bg-[#f8fdfd] pt-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Your Matches</h1>
        
        <Tabs 
          defaultValue="matches" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-2xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
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
                matches={matches} 
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
                matches={matches.filter(match => match.recentMessage || match.hasUnreadMessages)} 
                currentUserId={100} // Demo user ID
                currentUserName="Bradley Student" // Demo user name
                type="jobseeker"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}