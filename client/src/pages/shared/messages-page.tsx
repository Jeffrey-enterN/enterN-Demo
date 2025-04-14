import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import MessageInterface from "@/components/message-interface";
import MatchList from "@/components/match-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { MobileNavbar } from "@/components/mobile-navbar";
import { Loader2 } from "lucide-react";

// Types for matched profiles
interface MatchedProfile {
  id: number;
  matchId: number;
  matchedAt: string;
  employer: {
    id: number;
    companyName: string;
    userId: number;
  };
  jobseeker: {
    id: number;
    firstName: string;
    lastName: string;
    userId: number;
  };
  recentMessage?: string;
  hasUnreadMessages?: boolean;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [activeMatchId, setActiveMatchId] = useState<number | null>(null);
  const [activeMatchName, setActiveMatchName] = useState<string>("");
  const [activeMatchCompany, setActiveMatchCompany] = useState<string>("");
  
  const isEmployer = user?.role === "employer";
  const userRole = isEmployer ? "employer" : "jobseeker";
  
  // Get a display name for the current user
  const getUserName = () => {
    if (!user) return "";
    
    // We'll construct a name from the email until we fetch the profile
    const emailName = user.email.split("@")[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };
  
  // Fetch user's profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: [isEmployer ? `/api/employer-profile` : `/api/jobseeker-profile`],
    enabled: !!user,
  });

  // Fetch user's matches
  const { data: matches = [], isLoading: matchesLoading } = useQuery<MatchedProfile[]>({
    queryKey: [isEmployer ? `/api/employer/matches` : `/api/jobseeker/matches`],
    enabled: !!user && !!profile,
  });
  
  // Format matches for the MatchList component
  const formattedMatches = (matches || []).map((match) => {
    const isEmployerView = user?.role === "employer";
    const matchUser = isEmployerView ? match.jobseeker : match.employer;
    
    return {
      id: match.id,
      userId: isEmployerView ? match.jobseeker.userId : match.employer.userId,
      name: isEmployerView 
        ? `${match.jobseeker.firstName} ${match.jobseeker.lastName}` 
        : match.employer.companyName,
      company: isEmployerView ? null : match.employer.companyName,
      position: isEmployerView ? match.jobseeker.firstName : null, // Using firstName as placeholder for position
      matchId: match.id,
      matchDate: match.matchedAt,
      recentMessage: match.recentMessage || "",
      hasUnreadMessages: match.hasUnreadMessages || false,
    };
  });

  const handleMatchSelect = (matchId: number, userName: string, company?: string) => {
    setActiveMatchId(matchId);
    setActiveMatchName(userName);
    if (company) setActiveMatchCompany(company);
  };

  const isLoading = profileLoading || matchesLoading;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow p-4 pt-20 md:pt-24 pb-20 md:pb-6 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Messages</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#5ce1e6]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Your Matches</h2>
              </div>
              
              {formattedMatches.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  You don't have any matches yet. Keep swiping to find matches!
                </div>
              ) : (
                <MatchList 
                  matches={formattedMatches}
                  currentUserId={user?.id || 0}
                  currentUserName={getUserName()}
                  type={userRole as "employer" | "jobseeker"}
                  onSelectMatch={handleMatchSelect}
                />
              )}
            </div>
            
            <div className="md:col-span-2">
              {activeMatchId ? (
                <MessageInterface 
                  matchId={activeMatchId}
                  currentUserId={user?.id || 0}
                  currentUserName={user?.name || ""}
                  matchUserName={activeMatchName}
                  matchUserCompany={activeMatchCompany}
                  onClose={() => setActiveMatchId(null)}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm h-[600px] flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">
                      Choose a match from the list to start or continue a conversation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <MobileNavbar activeItem="messages" />
    </div>
  );
}