import { useState, useEffect } from "react";
import { Loader2, Filter } from "lucide-react";
import EmployerCard from "@/components/employer-card";
import { sampleEmployers } from "@/data/sample-employers";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function DemoEmployerFeed() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<{[key: number]: string}>({});
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API fetch
    const fetchEmployers = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter employers based on the active tab
        let filteredEmployers = [...sampleEmployers];
        
        if (activeTab === "local") {
          // Filter to only show Peoria, IL companies
          console.log("Total employers:", sampleEmployers.length);
          
          // Debug info for Peoria companies
          const peoriaEmployers = sampleEmployers.filter(employer => 
            employer.location && employer.location.includes("Peoria, IL")
          );
          
          console.log("Peoria employers found:", peoriaEmployers.length);
          console.log("Peoria employer IDs:", peoriaEmployers.map(e => e.id).join(", "));
          console.log("Peoria employer names:", peoriaEmployers.map(e => e.companyName).join(", "));
          
          filteredEmployers = peoriaEmployers;
        } else if (activeTab === "tech") {
          // Filter to show only tech companies
          filteredEmployers = sampleEmployers.filter(employer => 
            employer.industry && (
              employer.industry.includes("Tech") || 
              employer.industry.includes("Software") || 
              employer.industry.includes("Data")
            )
          );
        }
        
        setEmployers(filteredEmployers);
        setCurrentIndex(0); // Reset the index when changing filters
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employers:", error);
        toast({
          title: "Error",
          description: "Failed to load employer profiles. Please try again.",
          variant: "destructive",
        });
      }
    };

    setLoading(true);
    fetchEmployers();
  }, [toast, activeTab]);

  const handleAccept = () => {
    // In a real app, this would call an API to update the match status
    const employer = employers[currentIndex];
    setMatches({ ...matches, [employer.id]: "INTERESTED" });
    console.log(`Matched with ID ${employer.id}, status: INTERESTED`);
    
    // Show toast notification
    toast({
      title: "Interested",
      description: `You've expressed interest in ${employer.companyName}.`,
      className: "bg-green-50 border-green-200",
    });
    
    // Move to next employer
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handleReject = () => {
    // In a real app, this would call an API to update the match status
    const employer = employers[currentIndex];
    setMatches({ ...matches, [employer.id]: "NOT_INTERESTED" });
    console.log(`Matched with ID ${employer.id}, status: NOT_INTERESTED`);
    
    // Show toast notification
    toast({
      title: "Not Interested",
      description: `You've been removed from ${employer.companyName}'s feed.`,
      variant: "destructive",
    });
    
    // Move to next employer
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const currentEmployer = employers[currentIndex];
  const noMoreEmployers = currentIndex >= employers.length;

  return (
    <div className="min-h-screen bg-[#f8fdfd] pt-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Demo: Employer Feed</h1>
        <p className="text-gray-600 text-center mb-2">
          Swipe right to express interest, left to remove yourself from the employer's feed
        </p>
        
        {/* Filter Tabs */}
        <div className="mb-6 max-w-md mx-auto">
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-2"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="local"
                className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
              >
                Peoria, IL
              </TabsTrigger>
              <TabsTrigger 
                value="tech"
                className="data-[state=active]:bg-[#5ce1e6] data-[state=active]:text-white"
              >
                Tech
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-sm text-center text-gray-500">
            {activeTab === "local" ? "Showing employers in Peoria, IL" : 
             activeTab === "tech" ? "Showing tech companies" : 
             "Showing all employers"}
          </p>
        </div>
        
        <div className="min-h-[600px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#5ce1e6]" />
              <p className="mt-4 text-gray-600">Loading employer profiles...</p>
            </div>
          ) : employers.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No employers found</h3>
              <p className="text-gray-600 mb-4">
                No employers match your current filter. Try a different filter.
              </p>
              <Button 
                onClick={() => setActiveTab("all")}
                className="bg-[#5ce1e6] hover:bg-[#4bced3] text-white"
              >
                Show All Employers
              </Button>
            </div>
          ) : noMoreEmployers ? (
            <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">You've viewed all employers!</h3>
              <p className="text-gray-600 mb-4">
                Check back later for new opportunities or review your matches.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Matched with {Object.values(matches).filter(status => status === "INTERESTED").length} employers
              </p>
              <Button 
                onClick={() => setActiveTab(activeTab === "all" ? "local" : activeTab === "local" ? "tech" : "all")}
                className="bg-[#5ce1e6] hover:bg-[#4bced3] text-white"
              >
                Try {activeTab === "all" ? "Peoria, IL" : activeTab === "local" ? "Tech" : "All"} Employers
              </Button>
            </div>
          ) : (
            <EmployerCard 
              employer={currentEmployer} 
              onAccept={handleAccept} 
              onReject={handleReject} 
            />
          )}
        </div>
      </div>
    </div>
  );
}