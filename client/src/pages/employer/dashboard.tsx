import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Redirect, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Building, 
  FileText, 
  PieChart, 
  Plus, 
  Users, 
  Briefcase,
  MessageSquare,
  Loader2
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MobileNavbar } from "@/components/mobile-navbar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const isMobile = useIsMobile();
  
  // Get employer profile
  const { data: employerProfile, isLoading: loadingProfile, error: profileError } = useQuery({
    queryKey: ["/api/employer/profile"],
    enabled: !!user,
    retry: false, // Don't retry if profile doesn't exist
  });
  
  // Get job postings for this employer
  const { data: jobPostings = [], isLoading: loadingJobs } = useQuery({
    queryKey: ["/api/job-postings/employer"],
    enabled: !!user && !!employerProfile,
    retry: false, // Don't retry if no job postings
  });
  
  // Make sure only employers can access this page
  if (user && user.role !== "EMPLOYER") {
    return <Redirect to="/" />;
  }
  
  const isLoading = loadingProfile || loadingJobs;
  const hasProfile = !!employerProfile && !profileError;
  const hasJobPostings = jobPostings && jobPostings.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNavbar activeItem="dashboard" /> : <Navbar />}
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage your company profile, job postings, and candidates</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Profile Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Building className="h-5 w-5 mr-2 text-[#5ce1e6]" />
                    Company Profile
                  </CardTitle>
                  <CardDescription>Manage your company information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasProfile ? (
                <div className="space-y-2">
                  <p className="font-medium">{employerProfile.companyName}</p>
                  <p className="text-sm text-gray-600">{employerProfile.industry}</p>
                  <p className="text-sm text-gray-600">{employerProfile.headquarters}</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-2">No company profile setup yet</p>
                  <p className="text-sm text-gray-400 mb-4">Create your profile to attract more candidates</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full"
                style={{background: "#5ce1e6", color: "white"}}
                onClick={() => setLocation("/employer/profile-setup")}
              >
                {hasProfile ? "Edit Profile" : "Create Profile"}
              </Button>
            </CardFooter>
          </Card>

          {/* Job Postings Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-[#ff66c4]" />
                    Job Postings
                  </CardTitle>
                  <CardDescription>Manage your open positions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasJobPostings ? (
                <div className="space-y-3">
                  {jobPostings.slice(0, 3).map((job: any) => (
                    <div key={job.id} className="flex justify-between items-center p-2 rounded border border-gray-100 hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.location}</p>
                      </div>
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {job.applicants || 0} applicants
                      </div>
                    </div>
                  ))}
                  {jobPostings.length > 3 && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      +{jobPostings.length - 3} more job postings
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-2">No job postings yet</p>
                  <p className="text-sm text-gray-400 mb-4">Create job postings to find candidates</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full"
                style={{background: "#ff66c4", color: "white"}}
                onClick={() => setLocation("/employer/job-posting")}
              >
                <Plus className="h-4 w-4 mr-2" />
                {hasJobPostings ? "Add New Job" : "Create Job Posting"}
              </Button>
            </CardFooter>
          </Card>

          {/* Candidate Matches Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Users className="h-5 w-5 mr-2 text-[#5ce1e6]" />
                    Candidate Matches
                  </CardTitle>
                  <CardDescription>View and manage potential candidates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="min-h-[180px] flex flex-col justify-center">
              <div className="text-center py-4">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-2">Find your ideal candidates</p>
                <p className="text-sm text-gray-400 mb-4">Review profiles that match your job postings</p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full"
                style={{background: "#5ce1e6", color: "white"}}
                onClick={() => setLocation("/employer/match-feed")}
                disabled={!hasJobPostings}
              >
                View Candidates
              </Button>
            </CardFooter>
          </Card>

          {/* Analytics Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-[#ff66c4]" />
                    Analytics
                  </CardTitle>
                  <CardDescription>Track your recruitment metrics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="min-h-[180px] flex flex-col justify-center">
              <div className="text-center py-4">
                <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-2">Track your recruitment performance</p>
                <p className="text-sm text-gray-400 mb-4">View stats on views, matches, and applications</p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full"
                style={{background: "#ff66c4", color: "white"}}
                onClick={() => setLocation("/employer/analytics-dashboard")}
                disabled={!hasJobPostings}
              >
                View Analytics
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}