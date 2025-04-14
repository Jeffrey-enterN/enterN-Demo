import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import MatchList from "@/components/match-list";
import { sampleEmployerMatches } from "@/data/sample-matches";
import { useToast } from "@/hooks/use-toast";

export default function EmployerMatchesPage() {
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
        const storedMatches = localStorage.getItem('employerMatches');
        
        if (storedMatches) {
          setMatches(JSON.parse(storedMatches));
        } else {
          // Use sample data for demo
          setMatches(sampleEmployerMatches);
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
  }, [toast]);

  // Function to handle new match notifications
  const checkNewMatches = () => {
    // In a real app, this would be handled by websockets or polling
    // For demo purposes, we could check localStorage for matches created
    // in the jobseeker's flow and notify the employer
  };
  
  return (
    <div className="min-h-screen bg-[#f8fdfd] pt-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Your Candidate Matches</h1>
        
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
                matches={matches} 
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
                matches={matches.filter(match => match.recentMessage || match.hasUnreadMessages)} 
                currentUserId={200} // Demo employer ID
                currentUserName="TechNova" // Demo employer name
                type="employer"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}