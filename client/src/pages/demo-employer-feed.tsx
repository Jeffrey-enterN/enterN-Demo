import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import EmployerCard from "@/components/employer-card";
import { sampleEmployers } from "@/data/sample-employers";
import { useToast } from "@/hooks/use-toast";

export default function DemoEmployerFeed() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<{[key: number]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API fetch
    const fetchEmployers = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEmployers(sampleEmployers);
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

    fetchEmployers();
  }, [toast]);

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
        <p className="text-gray-600 text-center mb-8">
          Swipe right to express interest, left to remove yourself from the employer's feed
        </p>
        
        <div className="min-h-[600px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#5ce1e6]" />
              <p className="mt-4 text-gray-600">Loading employer profiles...</p>
            </div>
          ) : noMoreEmployers ? (
            <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">You've viewed all employers!</h3>
              <p className="text-gray-600 mb-4">
                Check back later for new opportunities or review your matches.
              </p>
              <p className="text-sm text-gray-500">
                Matched with {Object.values(matches).filter(status => status === "INTERESTED").length} employers
              </p>
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