import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { MobileNavbar } from "@/components/mobile-navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Building, User, Heart, MessageSquare, Loader2 } from "lucide-react";

export default function HomePage() {
  const [_, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  // Important: Always declare these queries regardless of conditions
  // This prevents "rendered more hooks than during the previous render" errors
  const { data: employerProfile, isLoading: isLoadingEmployer } = useQuery({
    queryKey: ["/api/employer/profile"],
    // Only actually load if user is an employer
    enabled: !!user && user.role === "employer",
  });

  const { data: jobseekerProfile, isLoading: isLoadingJobseeker } = useQuery({
    queryKey: ["/api/jobseeker/profile"],
    // Only actually load if user is a jobseeker
    enabled: !!user && user.role === "jobseeker",
  });

  // Only redirect authenticated users to their profile pages
  // We want unauthenticated users to be able to see the landing page

  // Redirect to appropriate setup page if user has not completed profile
  useEffect(() => {
    if (user && !isLoading && !isLoadingEmployer && !isLoadingJobseeker) {
      if (user.role === "employer" && !employerProfile && !isLoadingEmployer) {
        setLocation("/employer/profile-setup");
      } else if (user.role === "jobseeker" && !jobseekerProfile && !isLoadingJobseeker) {
        setLocation("/jobseeker/profile-setup");
      } else if (user.role === "employer" && employerProfile) {
        setLocation("/employer/match-feed");
      } else if (user.role === "jobseeker" && jobseekerProfile) {
        setLocation("/jobseeker/match-feed");
      }
    }
  }, [user, employerProfile, jobseekerProfile, isLoading, isLoadingEmployer, isLoadingJobseeker, setLocation]);

  // Show loading while checking authentication or profiles
  if (isLoading || (user && (isLoadingEmployer || isLoadingJobseeker))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Welcome to enterN
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find your perfect career match with our innovative platform that connects talent with 
              opportunities based on preferences and company culture.
            </p>
          </div>

          {/* Getting Started Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="shadow hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <User className="h-5 w-5 mr-2 text-primary-500" />
                  For Job Seekers
                </CardTitle>
                <CardDescription>
                  Find opportunities that align with your career goals and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-primary-600">1</span>
                    </div>
                    <p className="text-gray-700">Create your professional profile</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-primary-600">2</span>
                    </div>
                    <p className="text-gray-700">Set your career preferences with our intuitive slider system</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-primary-600">3</span>
                    </div>
                    <p className="text-gray-700">Match with employers and express interest in specific roles</p>
                  </div>
                </div>

                {user?.role === "jobseeker" ? (
                  <Button 
                    className="w-full" 
                    onClick={() => setLocation("/jobseeker/profile-setup")}
                  >
                    Complete Your Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : user?.role === "employer" ? null : (
                  <Button className="w-full" onClick={() => setLocation("/auth")}>
                    Sign Up as Job Seeker
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="shadow hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Building className="h-5 w-5 mr-2 text-primary-500" />
                  For Employers
                </CardTitle>
                <CardDescription>
                  Connect with qualified candidates who match your company culture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-primary-600">1</span>
                    </div>
                    <p className="text-gray-700">Create your company profile and showcase your culture</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-primary-600">2</span>
                    </div>
                    <p className="text-gray-700">Post job opportunities with detailed descriptions</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-primary-600">3</span>
                    </div>
                    <p className="text-gray-700">Match with candidates who align with your requirements</p>
                  </div>
                </div>

                {user?.role === "employer" ? (
                  <Button 
                    className="w-full" 
                    onClick={() => setLocation("/employer/profile-setup")}
                  >
                    Complete Your Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : user?.role === "jobseeker" ? null : (
                  <Button className="w-full" onClick={() => setLocation("/auth")}>
                    Sign Up as Employer
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Platform Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6 text-center">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                      <Heart className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Matching Algorithm</h3>
                    <p className="text-gray-600">
                      Our smart matching system connects you with opportunities that align with your preferences
                      and values.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                      <Briefcase className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Job Verification</h3>
                    <p className="text-gray-600">
                      Candidates can express interest in specific roles after matching, ensuring genuine interest
                      in the position.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                      <MessageSquare className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Direct Communication</h3>
                    <p className="text-gray-600">
                      Once matched, employers and candidates can communicate directly to explore opportunities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              {user ? "Ready to complete your profile?" : "Ready to find your perfect match?"}
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              {user 
                ? "Take the next step towards finding your perfect match by completing your profile."
                : "Join thousands of professionals and companies who are connecting through enterN's innovative matching platform."
              }
            </p>
            {user?.role === "jobseeker" ? (
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={() => setLocation("/jobseeker/profile-setup")}
              >
                Complete Your Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : user?.role === "employer" ? (
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={() => setLocation("/employer/profile-setup")}
              >
                Complete Your Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={() => setLocation("/auth")}
              >
                Get Started Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavbar activeItem="home" />
    </div>
  );
}
