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
      {/* Only show Navbar for authenticated users */}
      {user && <Navbar />}

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
                  <User className="h-5 w-5 mr-2" style={{color: "#5ce1e6"}} />
                  For Job Seekers
                </CardTitle>
                <CardDescription>
                  Find opportunities that align with your career goals and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3" 
                         style={{backgroundColor: "rgba(92, 225, 230, 0.15)"}}>
                      <span className="text-xs font-semibold" style={{color: "#0097b1"}}>1</span>
                    </div>
                    <p className="text-gray-700">Create your professional profile</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3"
                         style={{backgroundColor: "rgba(92, 225, 230, 0.15)"}}>
                      <span className="text-xs font-semibold" style={{color: "#0097b1"}}>2</span>
                    </div>
                    <p className="text-gray-700">Set your career preferences with our intuitive slider system</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3"
                         style={{backgroundColor: "rgba(92, 225, 230, 0.15)"}}>
                      <span className="text-xs font-semibold" style={{color: "#0097b1"}}>3</span>
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
                  <Building className="h-5 w-5 mr-2" style={{color: "#ff66c4"}} />
                  For Employers
                </CardTitle>
                <CardDescription>
                  Connect with qualified candidates who match your company culture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3"
                         style={{backgroundColor: "rgba(255, 102, 196, 0.15)"}}>
                      <span className="text-xs font-semibold" style={{color: "#ff66c4"}}>1</span>
                    </div>
                    <p className="text-gray-700">Create your company profile and showcase your culture</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3"
                         style={{backgroundColor: "rgba(255, 102, 196, 0.15)"}}>
                      <span className="text-xs font-semibold" style={{color: "#ff66c4"}}>2</span>
                    </div>
                    <p className="text-gray-700">Post job opportunities with detailed descriptions</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3"
                         style={{backgroundColor: "rgba(255, 102, 196, 0.15)"}}>
                      <span className="text-xs font-semibold" style={{color: "#ff66c4"}}>3</span>
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
                    <div className="h-12 w-12 rounded-full flex items-center justify-center mb-4" 
                         style={{background: "linear-gradient(rgba(92, 225, 230, 0.1), rgba(255, 102, 196, 0.1))"}}>
                      <Heart className="h-6 w-6" style={{color: "#0097b1"}} />
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
                    <div className="h-12 w-12 rounded-full flex items-center justify-center mb-4" 
                         style={{background: "linear-gradient(rgba(255, 102, 196, 0.1), rgba(92, 225, 230, 0.1))"}}>
                      <Briefcase className="h-6 w-6" style={{color: "#ff66c4"}} />
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
                    <div className="h-12 w-12 rounded-full flex items-center justify-center mb-4" 
                         style={{background: "linear-gradient(rgba(200, 253, 4, 0.15), rgba(92, 225, 230, 0.1))"}}>
                      <MessageSquare className="h-6 w-6" style={{color: "#0097b1"}} />
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

          {/* Demo Buttons - For testing purposes */}
          <div className="mb-8 text-center space-y-4">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Try our matching features</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setLocation("/demo-employer-feed")}
                className="bg-white border-2 shadow-md transition-all hover:shadow-lg relative"
                style={{borderImage: 'linear-gradient(to right, #5ce1e6, #ff66c4) 1'}}
              >
                <Building className="h-4 w-4 mr-2" style={{color: "#5ce1e6"}} />
                <div>
                  <span className="block">Jobseeker View</span>
                  <span className="text-xs block text-gray-500">Swipe on employer profiles</span>
                </div>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setLocation("/demo-match-feed")}
                className="bg-white border-2 shadow-md transition-all hover:shadow-lg"
                style={{borderImage: 'linear-gradient(to right, #5ce1e6, #ff66c4) 1'}}
              >
                <User className="h-4 w-4 mr-2" style={{color: "#5ce1e6"}} />
                <div>
                  <span className="block">Employer View</span>
                  <span className="text-xs block text-gray-500">Swipe on candidate profiles</span>
                </div>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setLocation("/demo-matches")}
                className="bg-white border-2 shadow-md transition-all hover:shadow-lg"
                style={{borderImage: 'linear-gradient(to right, #5ce1e6, #ff66c4) 1'}}
              >
                <MessageSquare className="h-4 w-4 mr-2" style={{color: "#0097b1"}} />
                <div>
                  <span className="block">Messaging</span>
                  <span className="text-xs block text-gray-500">Chat with your matches</span>
                </div>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              No login required - see how our matching system works
            </p>
          </div>

          {/* CTA Section */}
          <div className="rounded-lg shadow-lg p-8 text-center" 
               style={{background: "linear-gradient(135deg, #5ce1e6, #ff66c4)"}}>
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

      {/* Mobile Navigation - Only for authenticated users */}
      {user && <MobileNavbar activeItem="home" />}
    </div>
  );
}
