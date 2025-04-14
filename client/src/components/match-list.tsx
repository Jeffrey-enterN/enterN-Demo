import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent,
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import MessageInterface from "./message-interface";

interface MatchUser {
  id: number;
  userId: number;
  name: string;
  company?: string; // For employers
  position?: string; // For jobseekers
  matchId: number;
  matchDate: string;
  recentMessage?: string;
  hasUnreadMessages?: boolean;
}

interface MatchListProps {
  matches: MatchUser[];
  currentUserId: number;
  currentUserName: string;
  type: "employer" | "jobseeker";
  onSelectMatch?: (matchId: number, userName: string, company?: string) => void;
}

export default function MatchList({ 
  matches, 
  currentUserId,
  currentUserName,
  type,
  onSelectMatch
}: MatchListProps) {
  const [selectedMatch, setSelectedMatch] = useState<MatchUser | null>(null);

  if (matches.length === 0) {
    return (
      <Card className="w-full bg-white">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No matches yet</h3>
            <p className="text-sm text-gray-500 max-w-md mt-2">
              {type === "employer" 
                ? "Start swiping on candidate profiles to find your next team member!"
                : "Start swiping on employer profiles to find your next opportunity!"}
            </p>
            <Button 
              className="mt-4 bg-[#5ce1e6] hover:bg-[#4bced3] text-white" 
              onClick={() => window.location.href = type === "employer" ? "/match-feed" : "/employer-feed"}
            >
              Find Matches
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Matches</h2>
        <Badge variant="outline" className="bg-[#e0f7fa] text-[#0097b1] font-semibold">
          {matches.length} {matches.length === 1 ? "Match" : "Matches"}
        </Badge>
      </div>

      {matches.map((match) => (
        <Card 
          key={match.matchId}
          className="relative overflow-hidden border border-[#e0f7fa] hover:shadow-md transition-all"
        >
          {match.hasUnreadMessages && (
            <div className="absolute top-0 right-0 h-3 w-3 bg-[#5ce1e6] rounded-full m-2" />
          )}
          <CardHeader className="py-3">
            <div className="flex justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-[#5ce1e6] text-white">
                    {match.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-medium">{match.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {match.company || match.position || "Matched"}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(match.matchDate).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </CardHeader>
          
          {match.recentMessage && (
            <CardContent className="py-0 pb-3 px-4">
              <p className="text-sm text-gray-600 truncate">{match.recentMessage}</p>
            </CardContent>
          )}
          
          <CardFooter className="pt-0 pb-3 px-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setSelectedMatch(match)}
                  className="w-full bg-[#5ce1e6] hover:bg-[#4bced3] text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" /> Message
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0">
                {selectedMatch && (
                  <MessageInterface
                    matchId={selectedMatch.matchId}
                    currentUserId={currentUserId}
                    currentUserName={currentUserName}
                    matchUserName={selectedMatch.name}
                    matchUserCompany={selectedMatch.company}
                    onClose={() => setSelectedMatch(null)}
                    initialMessages={[
                      // Demo messages for now
                      {
                        id: 1,
                        senderId: currentUserId === 101 ? 102 : 101,
                        content: `Hey there! Thanks for connecting. I'd love to learn more about ${type === 'employer' ? 'your background and skills' : 'your company and team'}.`,
                        createdAt: new Date(Date.now() - 86400000).toISOString(),
                      }
                    ]}
                  />
                )}
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}