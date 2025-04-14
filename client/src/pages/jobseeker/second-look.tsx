import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ThumbsUp, ThumbsDown, ArrowLeft, Briefcase, Users, MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecondLookEmployer {
  id: number;
  userId: number;
  companyName: string;
  industry: string;
  companySize: string;
  founded: string;
  mission: string;
  culture: string;
  benefits: string[];
  headquartersLocation: string;
  officeLocations: string[];
  jobPostings: JobPosting[];
  matchId?: number; // Added to store the match ID for updating
}

interface JobPosting {
  id: number;
  employerId: number;
  title: string;
  description: string;
  requirements: string[];
  type: string;
  locationType: string;
  salary: string;
  location: string;
}

export default function SecondLookPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get employers for second look
  const { 
    data: secondLookEmployers = [], 
    isLoading, 
    error 
  } = useQuery<SecondLookEmployer[]>({
    queryKey: ['/api/jobseeker/second-look'],
    enabled: !!user,
  });

  // Define an interface for Match data
  interface Match {
    id: number;
    employerId: number;
    jobseekerId: number;
    employerStatus: string;
    jobseekerStatus: string;
    matchedAt: string | null;
    createdAt: string;
  }

  // Get matches to find the matchId for each employer
  const { data: matches = [] } = useQuery<Match[]>({
    queryKey: ['/api/jobseeker/matches'],
    enabled: !!user
  });
  
  // Update employer data with match IDs when matches or employers change
  useEffect(() => {
    if (matches.length > 0 && secondLookEmployers.length > 0) {
      const matchArray = matches as Match[];
      const updatedEmployers = secondLookEmployers.map(employer => {
        const match = matchArray.find(m => m.employerId === employer.id);
        return match ? { ...employer, matchId: match.id } : employer;
      });
      
      queryClient.setQueryData(['/api/jobseeker/second-look'], updatedEmployers);
    }
  }, [matches, secondLookEmployers]);

  // Update match status
  const matchMutation = useMutation({
    mutationFn: async ({ matchId, status }: { matchId: number, status: string }) => {
      return await apiRequest("PATCH", `/api/jobseeker/second-look/${matchId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobseeker/second-look'] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobseeker/matches'] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobseeker/analytics'] });
      
      toast({
        title: "Match updated",
        description: "Your match status has been updated successfully."
      });
      
      // Move to next card if available
      if (currentIndex < secondLookEmployers.length - 1) {
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else if (secondLookEmployers.length > 0) {
        // If this was the last employer, show a toast and redirect
        toast({
          title: "All caught up!",
          description: "You've reviewed all available employers."
        });
        setTimeout(() => {
          setLocation('/jobseeker/dashboard');
        }, 1500);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating match",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handlers for swipe actions
  const handleAccept = (matchId?: number) => {
    if (!matchId) {
      toast({
        title: "Error",
        description: "Could not find the match ID for this employer.",
        variant: "destructive"
      });
      return;
    }
    
    matchMutation.mutate({ matchId, status: 'matched' });
  };

  const handleReject = (matchId?: number) => {
    if (!matchId) {
      toast({
        title: "Error",
        description: "Could not find the match ID for this employer.",
        variant: "destructive"
      });
      return;
    }
    
    // Since we're in the second look view, and the user rejected again,
    // let's keep the status as rejected but move to the next card
    if (currentIndex < secondLookEmployers.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else if (secondLookEmployers.length > 0) {
      toast({
        title: "All caught up!",
        description: "You've reviewed all available employers."
      });
      setTimeout(() => {
        setLocation('/jobseeker/dashboard');
      }, 1500);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const employer = secondLookEmployers[currentIndex];
      if (!employer) return;
      
      if (e.key === 'ArrowRight' || e.key === 'j') {
        handleAccept(employer.matchId);
      } else if (e.key === 'ArrowLeft' || e.key === 'f') {
        handleReject(employer.matchId);
      } else if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, secondLookEmployers]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            There was an error loading employers for second look. Please try again later.
          </AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => setLocation('/jobseeker/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (secondLookEmployers.length === 0) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Second Look Employers</CardTitle>
            <CardDescription>
              You don't have any previously rejected employers to review right now.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setLocation('/jobseeker/dashboard')} className="w-full">
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const employer = secondLookEmployers[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => setLocation('/jobseeker/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Second Look</h1>
            <p className="text-gray-500">Review employers you previously passed on</p>
          </div>
        </div>
        
        <Card className={`relative transition-all duration-300 ${isExpanded ? 'max-h-[80vh]' : 'max-h-[500px]'}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{employer.companyName}</CardTitle>
                <CardDescription className="text-sm flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {employer.industry} · <Users className="h-3 w-3" /> {employer.companySize} · <MapPin className="h-3 w-3" /> {employer.headquartersLocation}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'View Less' : 'View All'}
              </Button>
            </div>
          </CardHeader>
          
          <ScrollArea className={`px-6 ${isExpanded ? 'max-h-[calc(80vh-180px)]' : 'max-h-[320px]'}`}>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Mission & Vision</h3>
                <p className="text-gray-600 text-sm">{employer.mission}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Culture</h3>
                <p className="text-gray-600 text-sm">{employer.culture}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {employer.benefits && employer.benefits.map((benefit, i) => (
                    <Badge key={i} variant="secondary">{benefit}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Office Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {employer.officeLocations && employer.officeLocations.map((location, i) => (
                    <Badge key={i} variant="outline" className="bg-gray-50">{location}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Founded</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" /> {employer.founded}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Job Openings</h3>
                {employer.jobPostings && employer.jobPostings.length > 0 ? (
                  <div className="space-y-3">
                    {employer.jobPostings.map((job) => (
                      <div key={job.id} className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm">{job.title}</h4>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">{job.type}</Badge>
                          <Badge variant="outline" className="text-xs">{job.locationType}</Badge>
                          <Badge variant="outline" className="text-xs">{job.salary}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No current job openings</p>
                )}
              </div>
            </div>
          </ScrollArea>
          
          <CardFooter className="border-t mt-4 p-4 flex justify-between">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 w-14 rounded-full border-red-200 bg-red-50 hover:bg-red-100"
              onClick={() => handleReject(employer.matchId)}
              disabled={matchMutation.isPending}
            >
              {matchMutation.isPending ? (
                <Loader2 className="h-6 w-6 animate-spin text-red-500" />
              ) : (
                <ThumbsDown className="h-6 w-6 text-red-500" />
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {currentIndex + 1} of {secondLookEmployers.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Use ← and → keys to navigate
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 w-14 rounded-full border-green-200 bg-green-50 hover:bg-green-100"
              onClick={() => handleAccept(employer.matchId)}
              disabled={matchMutation.isPending}
            >
              {matchMutation.isPending ? (
                <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              ) : (
                <ThumbsUp className="h-6 w-6 text-green-500" />
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}