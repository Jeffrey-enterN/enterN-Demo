import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Redirect, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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

  // Display welcome screen for new employers without a profile
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Global navigation */}
        {isMobile ? <MobileNavbar activeItem="dashboard" /> : <Navbar />}
        
        <div className="container mx-auto py-20 px-4">
          <Card className="max-w-3xl mx-auto shadow-lg border-t-4 border-t-[#5ce1e6]">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Welcome to JobPair!</CardTitle>
              <CardDescription className="text-lg mt-2">
                Let's get your employer profile set up
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="h-20 w-20 bg-[rgba(92,225,230,0.1)] rounded-full flex items-center justify-center mb-4">
                  <Building className="h-10 w-10 text-[#5ce1e6]" />
                </div>
                <h3 className="text-xl font-medium mb-2">Complete Your Employer Profile</h3>
                <p className="text-gray-600 max-w-lg">
                  Before you can start finding candidates, you'll need to set up your company profile. 
                  This information will be shown to potential job seekers who might be interested in working with you.
                </p>
                
                <div className="w-full max-w-md mt-8 bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <div className="flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">Your profile information is incomplete</p>
                      <p className="text-sm text-amber-700 mt-1">
                        You need to complete your company profile to start matching with candidates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  size="lg"
                  className="bg-[#5ce1e6] hover:bg-[#4bb7bc] text-white"
                  onClick={() => setLocation("/employer/profile-setup")}
                >
                  <Building className="mr-2 h-5 w-5" />
                  Create Employer Profile
                </Button>
              </div>
            </CardContent>
          </Card>
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
      totalFields += 5; // companyName, industry, headquarters, description, website
      if (employerProfile.companyName) completedFields += 1;
      if (employerProfile.industry) completedFields += 1;
      if (employerProfile.headquarters) completedFields += 1;
      if (employerProfile.description) completedFields += 1;
      if (employerProfile.website) completedFields += 1;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/match-feed')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">View Candidates</h3>
                  <p className="text-sm text-gray-500">Find potential matches for your jobs</p>
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
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/priority-sliders')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <SlidersHorizontal className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Priority Preferences</h3>
                  <p className="text-sm text-gray-500">Select your top matching priorities</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/profile-setup')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <Edit className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Edit Company Profile</h3>
                  <p className="text-sm text-gray-500">Update your company information</p>
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
                  <p className="text-sm text-gray-500">Chat with potential candidates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/analytics-dashboard')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Analytics Dashboard</h3>
                  <p className="text-sm text-gray-500">View detailed recruitment metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[#e3fcfd] hover:border-[#5ce1e6]" onClick={() => setLocation('/employer/interviews')}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[#5ce1e6]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Interview Schedule</h3>
                  <p className="text-sm text-gray-500">Manage upcoming interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Analytics Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recruitment Analytics</h2>
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Overview</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center mb-2">
                      <Briefcase className="h-6 w-6 text-[#5ce1e6]" />
                    </div>
                    <p className="text-4xl font-bold">{analytics?.jobPostings.active || 0}</p>
                    <p className="text-sm text-gray-500">Active Jobs</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center mb-2">
                      <Users className="h-6 w-6 text-[#5ce1e6]" />
                    </div>
                    <p className="text-4xl font-bold">{analytics?.candidates.totalViewed || 0}</p>
                    <p className="text-sm text-gray-500">Candidates Viewed</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center mb-2">
                      <Zap className="h-6 w-6 text-[#5ce1e6]" />
                    </div>
                    <p className="text-4xl font-bold">{analytics?.candidates.matches || 0}</p>
                    <p className="text-sm text-gray-500">Total Matches</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-[rgba(92,225,230,0.1)] flex items-center justify-center mb-2">
                      <DollarSign className="h-6 w-6 text-[#5ce1e6]" />
                    </div>
                    <p className="text-4xl font-bold">{analytics?.interviews.accepted || 0}</p>
                    <p className="text-sm text-gray-500">Hires</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate Stats Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Candidate Interest</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={candidateData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {candidateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Interview Stats Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Hiring Funnel</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={interviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="#5ce1e6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="candidates">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Candidate Response</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={candidateData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={true}
                        label
                      >
                        {candidateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="applications">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Application Status</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applicationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={true}
                        label
                      >
                        {applicationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="interviews">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Interview Pipeline</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={interviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#5ce1e6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}