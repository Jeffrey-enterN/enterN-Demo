import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Redirect, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart, 
  Pie,
  Cell,
} from "recharts";
import { 
  Building, 
  FileText, 
  Plus, 
  Users, 
  Briefcase,
  MessageSquare,
  Loader2,
  Settings,
  Bell,
  Edit,
  Mail,
  Calendar,
  Search,
  BarChart2,
  Zap,
  DollarSign,
  AlertCircle,
  SlidersHorizontal
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MobileNavbar } from "@/components/mobile-navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployerProfile, JobPosting } from "@shared/schema";

interface EmployerAnalytics {
  jobPostings: {
    total: number;
    active: number;
    closed: number;
  };
  candidates: {
    totalViewed: number;
    interested: number;
    rejected: number;
    matches: number;
  };
  applications: {
    total: number;
    reviewed: number;
    shortlisted: number;
    rejected: number;
  };
  interviews: {
    scheduled: number;
    completed: number;
    offered: number;
    accepted: number;
  };
}

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [notificationsCount, setNotificationsCount] = useState<number>(2);
  
  // Get employer profile
  const { data: employerProfile, isLoading: loadingProfile, error: profileError } = useQuery<EmployerProfile>({
    queryKey: ["/api/employer/profile"],
    enabled: !!user,
    retry: false, // Don't retry if profile doesn't exist
  });
  
  // Get job postings for this employer
  const { data: jobPostings = [], isLoading: loadingJobs } = useQuery<JobPosting[]>({
    queryKey: ["/api/job-postings/employer"],
    enabled: !!user && !!employerProfile,
    retry: false, // Don't retry if no job postings
  });
  
  // Get analytics data
  const { data: analytics, isLoading: loadingAnalytics } = useQuery<EmployerAnalytics>({
    queryKey: ["/api/employer/analytics"],
    enabled: !!user && !!employerProfile,
    // Mock data for display purposes - remove in production
    placeholderData: {
      jobPostings: {
        total: 5,
        active: 3,
        closed: 2
      },
      candidates: {
        totalViewed: 28,
        interested: 15,
        rejected: 13,
        matches: 8
      },
      applications: {
        total: 20,
        reviewed: 18,
        shortlisted: 12,
        rejected: 6
      },
      interviews: {
        scheduled: 10,
        completed: 8,
        offered: 5,
        accepted: 3
      }
    }
  });

  // Calculate loading state
  const isLoading = loadingProfile || loadingJobs || loadingAnalytics;
  
  // Transform analytics data for charts
  const candidateData = analytics ? [
    { name: 'Interested', value: analytics.candidates.interested, fill: '#5ce1e6' },
    { name: 'Rejected', value: analytics.candidates.rejected, fill: '#ff66c4' },
  ] : [
    { name: 'Interested', value: 0, fill: '#5ce1e6' },
    { name: 'Rejected', value: 0, fill: '#ff66c4' },
  ];
  
  const applicationData = analytics ? [
    { name: 'Shortlisted', value: analytics.applications.shortlisted, fill: '#5ce1e6' },
    { name: 'Rejected', value: analytics.applications.rejected, fill: '#ff66c4' },
  ] : [
    { name: 'Shortlisted', value: 0, fill: '#5ce1e6' },
    { name: 'Rejected', value: 0, fill: '#ff66c4' },
  ];
  
  const interviewData = analytics ? [
    { name: 'Scheduled', value: analytics.interviews.scheduled },
    { name: 'Completed', value: analytics.interviews.completed },
    { name: 'Offered', value: analytics.interviews.offered },
    { name: 'Accepted', value: analytics.interviews.accepted },
  ] : [
    { name: 'Scheduled', value: 0 },
    { name: 'Completed', value: 0 },
    { name: 'Offered', value: 0 },
    { name: 'Accepted', value: 0 },
  ];
  
  // Make sure only employers can access this page
  if (user && user.role !== "employer" && user.role !== "EMPLOYER") {
    return <Redirect to="/" />;
  }
  
  // If still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#5ce1e6]" />
      </div>
    );
  }
  
  // Check if employer profile exists
  const hasProfile = !!employerProfile && !profileError;
  const hasJobPostings = jobPostings && Array.isArray(jobPostings) && jobPostings.length > 0;

  // Display dashboard even for employers without a profile
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Global navigation */}
        {isMobile ? <MobileNavbar activeItem="dashboard" /> : <Navbar />}
        
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employer Dashboard</h1>
            <p className="text-gray-500">Welcome to JobPair!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
              {notificationsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-[#ff66c4] h-5 w-5 flex items-center justify-center p-0">
                  {notificationsCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 bg-[#5ce1e6] rounded-full flex items-center justify-center">
              <span className="text-white font-medium">E</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto py-8 px-4">
          {/* Welcome Card */}
          <Card className="mb-8 border-t-4 border-t-[#5ce1e6]">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-20 w-20 flex-shrink-0 bg-[rgba(92,225,230,0.1)] rounded-full flex items-center justify-center">
                  <Building className="h-10 w-10 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Complete Your Company Profile</h3>
                  <p className="text-gray-600 mb-4">
                    We recommend setting up your company profile to help job seekers understand your company culture and values.
                    This helps improve the quality of your matches.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="bg-[#5ce1e6] hover:bg-[#4bb7bc] text-white"
                      onClick={() => setLocation("/employer/profile-setup")}
                    >
                      <Building className="mr-2 h-5 w-5" />
                      Create Company Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#5ce1e6] text-[#5ce1e6] hover:bg-[rgba(92,225,230,0.1)]"
                      onClick={() => setLocation("/employer/job-posting")}
                    >
                      <Briefcase className="mr-2 h-5 w-5" />
                      Post a Job
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/profile-setup')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                    <Building className="h-6 w-6 text-[#5ce1e6]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Create Company Profile</h3>
                    <p className="text-sm text-gray-500">Set up your company information</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/job-posting')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-[#5ce1e6]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Post New Job</h3>
                    <p className="text-sm text-gray-500">Create a new job posting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/match-feed')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#5ce1e6]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Browse Candidates</h3>
                    <p className="text-sm text-gray-500">Find potential candidates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Getting Started */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-[rgba(92,225,230,0.1)] rounded-full flex items-center justify-center mb-4">
                    <span className="text-[#5ce1e6] font-bold">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Create Your Profile</h3>
                  <p className="text-sm text-gray-500">Set up your company details to attract the right candidates</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-[rgba(92,225,230,0.1)] rounded-full flex items-center justify-center mb-4">
                    <span className="text-[#5ce1e6] font-bold">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Post Jobs</h3>
                  <p className="text-sm text-gray-500">Create detailed job listings to match with qualified candidates</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-[rgba(92,225,230,0.1)] rounded-full flex items-center justify-center mb-4">
                    <span className="text-[#5ce1e6] font-bold">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Match & Connect</h3>
                  <p className="text-sm text-gray-500">Browse candidates, find matches, and start conversations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Calculate profile completion percentage based on available data
  const calculateProfileCompletion = () => {
    if (!hasProfile) return 0;
    
    let completedFields = 0;
    let totalFields = 0;
    
    // Check company profile fields
    if (employerProfile) {
      totalFields += 5; // companyName, industry, headquarters, about, missionValues
      if (employerProfile.companyName) completedFields += 1;
      if (employerProfile.industry) completedFields += 1;
      if (employerProfile.headquarters) completedFields += 1;
      if (employerProfile.about) completedFields += 1;
      if (employerProfile.missionValues) completedFields += 1;
    }
    
    // Check job postings
    if (hasJobPostings) {
      completedFields += Math.min(jobPostings.length, 2); // Count up to 2 job postings
      totalFields += 2;
    }
    
    const percentage = Math.round((completedFields / totalFields) * 100);
    return Math.min(100, percentage); // Cap at 100%
  };
  
  const profileCompletionPercentage = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global navigation */}
      {isMobile ? <MobileNavbar activeItem="dashboard" /> : <Navbar />}
      
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employer Dashboard</h1>
          <p className="text-gray-500">Welcome back, {employerProfile?.companyName || 'there'}!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
            {notificationsCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-[#ff66c4] h-5 w-5 flex items-center justify-center p-0">
                {notificationsCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 bg-[#5ce1e6] rounded-full flex items-center justify-center">
            <span className="text-white font-medium">{(employerProfile?.companyName || 'C')?.charAt(0)}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        {/* Profile Completion Progress */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Completion</span>
                <span className="font-medium">{profileCompletionPercentage}%</span>
              </div>
              <Progress value={profileCompletionPercentage} className="h-2" />
              
              {!hasJobPostings && (
                <div className="bg-amber-50 border border-amber-100 rounded-md p-3 mt-3 flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Add job postings to find candidates</p>
                    <p className="text-xs text-amber-700 mt-1">Create job postings to get matched with qualified candidates.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/match-feed')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Match Feed</h3>
                  <p className="text-sm text-gray-500">Find potential candidates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/job-posting')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Post Job</h3>
                  <p className="text-sm text-gray-500">Create a new job posting</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/priority-sliders')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <SlidersHorizontal className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Priority Preferences</h3>
                  <p className="text-sm text-gray-500">Customize your matching sliders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/messages')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-500">Chat with your matches</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Analytics Tabs */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
        <Card className="mb-8">
          <Tabs defaultValue="candidates">
            <TabsList className="grid grid-cols-4 h-auto p-0">
              <TabsTrigger value="candidates" className="py-3 data-[state=active]:text-[#5ce1e6]">
                Candidates
              </TabsTrigger>
              <TabsTrigger value="jobs" className="py-3 data-[state=active]:text-[#5ce1e6]">
                Jobs
              </TabsTrigger>
              <TabsTrigger value="applications" className="py-3 data-[state=active]:text-[#5ce1e6]">
                Applications
              </TabsTrigger>
              <TabsTrigger value="interviews" className="py-3 data-[state=active]:text-[#5ce1e6]">
                Interviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="candidates" className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Candidate Overview</h3>
                    <p className="text-sm text-gray-500">Summary of candidate interactions</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div>
                          <p className="text-sm text-gray-500">Total Viewed</p>
                          <p className="text-3xl font-bold">{analytics?.candidates.totalViewed || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div>
                          <p className="text-sm text-gray-500">Matches</p>
                          <p className="text-3xl font-bold">{analytics?.candidates.matches || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Candidate Decision Distribution</h3>
                    <p className="text-sm text-gray-500">Breakdown of your candidate decisions</p>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={candidateData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {candidateData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="jobs" className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Job Postings Summary</h3>
                    <p className="text-sm text-gray-500">Overview of your active and filled positions</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div>
                          <p className="text-sm text-gray-500">Total Jobs</p>
                          <p className="text-3xl font-bold">{analytics?.jobPostings.total || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div>
                          <p className="text-sm text-gray-500">Active</p>
                          <p className="text-3xl font-bold">{analytics?.jobPostings.active || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div>
                          <p className="text-sm text-gray-500">Closed</p>
                          <p className="text-3xl font-bold">{analytics?.jobPostings.closed || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Job Postings</h3>
                    <p className="text-sm text-gray-500">Status of your most recent job postings</p>
                  </div>
                  
                  {jobPostings && jobPostings.length > 0 ? (
                    <div className="space-y-4">
                      {jobPostings.slice(0, 3).map(job => (
                        <Card key={job.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="border-l-4 border-[#5ce1e6] pl-3 py-3 pr-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{job.title}</p>
                                  <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
                                </div>
                                <Badge className={job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                  {job.status === 'open' ? 'Active' : 'Closed'}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="flex flex-col items-center justify-center text-center py-10">
                        <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No Job Postings Yet</h3>
                        <p className="text-sm text-gray-500 mb-4">Start creating job postings to attract candidates</p>
                        <Button 
                          size="sm"
                          className="bg-[#5ce1e6] hover:bg-[#4bb7bc] text-white"
                          onClick={() => setLocation("/employer/job-posting")}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Job Posting
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="applications" className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Applications Overview</h3>
                    <p className="text-sm text-gray-500">Summary of applications received</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div>
                          <p className="text-sm text-gray-500">Total Applications</p>
                          <p className="text-3xl font-bold">{analytics?.applications.total || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div>
                          <p className="text-sm text-gray-500">Reviewed</p>
                          <p className="text-3xl font-bold">{analytics?.applications.reviewed || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Application Outcomes</h3>
                    <p className="text-sm text-gray-500">Breakdown of application review decisions</p>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={applicationData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {applicationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="interviews" className="p-6">
              <div className="flex flex-col gap-8">
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Interview Pipeline</h3>
                    <p className="text-sm text-gray-500">Track your candidates throughout the interview process</p>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={interviewData}
                        margin={{
                          top: 5,
                          right: 5,
                          left: 5,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="value" fill="#5ce1e6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">Upcoming Interviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics && analytics.interviews.scheduled > 0 ? (
                        Array(Math.min(analytics.interviews.scheduled, 3)).fill(0).map((_, i) => (
                          <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                                <Users className="h-5 w-5 text-[#5ce1e6]" />
                              </div>
                              <div>
                                <p className="font-medium">Candidate Name {i + 1}</p>
                                <p className="text-sm text-gray-500">Software Developer • Tomorrow, 10:00 AM</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Calendar
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center py-4">
                          <Calendar className="h-10 w-10 text-gray-300 mb-3" />
                          <h3 className="text-base font-medium text-gray-600 mb-1">No Upcoming Interviews</h3>
                          <p className="text-sm text-gray-500">Schedule interviews with your matched candidates</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}