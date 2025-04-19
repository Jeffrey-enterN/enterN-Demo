import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Filter } from "lucide-react";
import EmployerCard from "@/components/employer-card";
import { MatchStatusEnum } from "@shared/schema";
import { Navbar } from "@/components/navbar";
import { MobileNavbar } from "@/components/mobile-navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth-context";
import { useMascot } from "@/contexts/mascot-context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function JobseekerMatchFeed() {
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [currentEmployerIndex, setCurrentEmployerIndex] = useState(0);
  const { setMood, showMessage, setIsVisible } = useMascot();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filteredEmployers, setFilteredEmployers] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch employer profiles for the jobseeker to match with
  const { data: employers, isLoading, error } = useQuery({
    queryKey: ["/api/jobseeker/match-feed", activeTab],
    enabled: !!user,
  });
  
  // Define employer type to fix TypeScript errors
  type Employer = {
    id: number;
    userId: number;
    companyName: string;
    location?: string;
    industry?: string;
    industries?: string[];
    jobPostings?: any[];
    [key: string]: any;
  };

  // Filter employers based on the active tab
  useEffect(() => {
    if (employers && Array.isArray(employers)) {
      let filtered = [...employers] as Employer[];
      
      if (activeTab === "local") {
        // Filter to only show local companies (e.g., containing "Peoria, IL")
        filtered = employers.filter((employer: Employer) => 
          employer.location && employer.location.includes("Peoria, IL")
        );
      } else if (activeTab === "tech") {
        // Filter to show only tech companies
        filtered = employers.filter((employer: Employer) => {
          if (employer.industry) {
            return (
              employer.industry.includes("Tech") || 
              employer.industry.includes("Software") || 
              employer.industry.includes("Data")
            );
          }
          if (employer.industries && Array.isArray(employer.industries)) {
            return employer.industries.some(industry => 
              industry.includes("Tech") || 
              industry.includes("Software") || 
              industry.includes("Data")
            );
          }
          return false;
        });
      }
      
      setFilteredEmployers(filtered);
      setCurrentEmployerIndex(0); // Reset index when filter changes
    }
  }, [employers, activeTab]);

  // Ensure the mascot is visible on this page
  useEffect(() => {
    setIsVisible(true);
    
    // Show a welcome message when landing on the match feed
    showMessage("Ready to find your next opportunity? Remember to review each company carefully!", "excited");
    
    return () => {
      // Reset mood when leaving the page
      setMood("default");
    };
  }, []);

  // Handle accepting an employer (interested in some roles)
  const handleAcceptEmployer = (employerId: number) => {
    // Make API call to update match status
    console.log(`Interested in roles at employer ID ${employerId}`);
    
    // Show positive mascot message
    setMood("matched");
    showMessage("Great choice! This employer has some exciting opportunities that match your skills!", "matched");
    
    toast({
      title: "Employer Added to Matches",
      description: "You'll be notified if they're interested in your profile as well.",
      variant: "default",
    });
    moveToNextEmployer();
  };

  // Handle rejecting an employer (not interested)
  const handleRejectEmployer = (employerId: number) => {
    // Make API call to update match status and remove from this employer's feed
    console.log(`Not interested in employer ID ${employerId}`);
    
    // Show supportive mascot message
    setMood("rejected");
    showMessage("That's okay! It's important to be selective in your job search. Let's see who's next!", "rejected");
    
    toast({
      title: "Employer Removed",
      description: "This employer won't see your profile in their feed.",
      variant: "default",
    });
    moveToNextEmployer();
  };

  // Move to the next employer profile
  const moveToNextEmployer = () => {
    const employersArray = filteredEmployers.length > 0 ? filteredEmployers : (employers && Array.isArray(employers) ? employers : []);
    
    if (employersArray.length > 0 && currentEmployerIndex < employersArray.length - 1) {
      setCurrentEmployerIndex(currentEmployerIndex + 1);
    } else {
      // No more employers to show
      toast({
        title: "You've seen all employers",
        description: "Check back later for new companies matching your preferences.",
        variant: "default",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        {isMobile ? <MobileNavbar activeItem="matches" /> : <Navbar />}
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#5ce1e6]" />
        </div>
      </div>
    );
  }

  if (error) {
    // Show frustrated mascot when there's an error
    useEffect(() => {
      setMood("frustrated");
      showMessage("Oh no! We're having trouble loading companies. Let's try again in a little while!", "frustrated", false);
    }, []);
    
    return (
      <div className="min-h-screen flex flex-col">
        {isMobile ? <MobileNavbar activeItem="matches" /> : <Navbar />}
        <div className="flex-1 flex items-center justify-center text-center p-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Error loading companies</h2>
            <p className="text-gray-600">
              We encountered a problem loading employer profiles. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use sample data for demonstration
  const sampleEmployers = [
    {
      id: 1,
      userId: 201,
      companyName: "TechNova Solutions",
      industries: ["Software Development", "AI", "Cloud Services"],
      location: "San Francisco, CA (Remote-friendly)",
      companySize: "250-500",
      website: "www.technovasolutions.com",
      description: "TechNova specializes in cutting-edge AI solutions for enterprise clients across healthcare, finance, and retail. Our mission is to democratize artificial intelligence and make it accessible for businesses of all sizes.",
      mission: "Democratizing AI technologies to empower businesses and drive innovation.",
      jobPostings: [
        {
          id: 101,
          title: "Senior Frontend Developer",
          employmentType: "Full-time",
          locationType: "Remote",
          requiredExperience: "3-5 years",
          description: "We're looking for a skilled frontend developer proficient in React and TypeScript to join our product team."
        },
        {
          id: 102,
          title: "ML Engineer",
          employmentType: "Full-time",
          locationType: "Hybrid",
          requiredExperience: "2-4 years",
          description: "Work with our AI team to build and optimize machine learning models for our enterprise customers."
        },
        {
          id: 103,
          title: "DevOps Engineer",
          employmentType: "Full-time",
          locationType: "Remote",
          requiredExperience: "3+ years",
          description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines."
        }
      ]
    },
    {
      id: 2,
      userId: 202,
      companyName: "GreenEarth Sustainability",
      industries: ["Clean Energy", "Environmental Tech", "Sustainability"],
      location: "Portland, OR",
      companySize: "50-100",
      website: "www.greenearthsustain.org",
      description: "GreenEarth develops software solutions for environmental monitoring, sustainable resource management, and clean energy optimization. Our team is passionate about leveraging technology to address climate change and promote environmental stewardship.",
      mission: "Creating technology that helps organizations reduce their environmental impact and operate more sustainably.",
      jobPostings: [
        {
          id: 201,
          title: "Full Stack Developer",
          employmentType: "Full-time",
          locationType: "Hybrid",
          requiredExperience: "2+ years",
          description: "Build web applications for environmental data collection and visualization."
        },
        {
          id: 202,
          title: "Data Scientist",
          employmentType: "Full-time",
          locationType: "On-site",
          requiredExperience: "3+ years",
          description: "Analyze environmental data and develop predictive models for resource management."
        }
      ]
    },
    {
      id: 3,
      userId: 203,
      companyName: "HealthFirst Digital",
      industries: ["Healthcare Tech", "Telemedicine", "Health Analytics"],
      location: "Boston, MA (Remote options)",
      companySize: "100-250",
      website: "www.healthfirstdigital.com",
      description: "HealthFirst is revolutionizing healthcare delivery through accessible telemedicine platforms and data-driven health analytics. We're focused on improving patient outcomes while reducing healthcare costs through innovative technology solutions.",
      mission: "Making quality healthcare accessible to everyone through technology innovation.",
      jobPostings: [
        {
          id: 301,
          title: "Backend Engineer",
          employmentType: "Full-time",
          locationType: "Remote",
          requiredExperience: "3-5 years",
          description: "Build scalable and secure backend systems for our telemedicine platform."
        },
        {
          id: 302,
          title: "UX/UI Designer",
          employmentType: "Full-time",
          locationType: "Hybrid",
          requiredExperience: "2+ years",
          description: "Design intuitive and accessible user experiences for healthcare applications."
        },
        {
          id: 303,
          title: "QA Engineer",
          employmentType: "Full-time",
          locationType: "Remote",
          requiredExperience: "2-4 years",
          description: "Ensure the quality and reliability of our healthcare software through comprehensive testing."
        },
        {
          id: 304,
          title: "Product Manager",
          employmentType: "Full-time",
          locationType: "Hybrid",
          requiredExperience: "4+ years",
          description: "Lead the development of new healthcare technology products from conception to launch."
        }
      ]
    }
  ];

  // Determine which employers to display
  const sourceEmployers = (employers && Array.isArray(employers)) ? employers : sampleEmployers;
  // Use filtered list if available
  const employersToShow = filteredEmployers.length > 0 ? filteredEmployers : sourceEmployers;
  const currentEmployer = employersToShow[currentEmployerIndex] as Employer | undefined;

  // If no more employers to show
  if (!currentEmployer) {
    // Show an encouraging message when there are no more employers
    useEffect(() => {
      setMood("excited");
      showMessage("You've reviewed all the available companies! That's great progress. Check back later for new opportunities!", "excited", false);
    }, []);
    
    return (
      <div className="min-h-screen flex flex-col">
        {isMobile ? <MobileNavbar activeItem="matches" /> : <Navbar />}
        <div className="flex-1 flex items-center justify-center text-center p-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No more companies to show</h2>
            <p className="text-gray-600">
              You've seen all available employers matching your preferences.
              <br />Check back later for new companies!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isMobile ? <MobileNavbar activeItem="matches" /> : <Navbar />}
      
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6">
        <h1 className="text-2xl font-bold text-center mb-2 text-[#0097b1]">Potential Employers</h1>
        <p className="text-gray-600 text-center mb-4">
          Swipe right if you're interested in potential roles, or left if you're not interested.
        </p>
        
        {/* Filtering tabs */}
        <div className="mb-6">
          <Tabs value={activeTab} className="w-full justify-center">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger 
                value="all" 
                onClick={() => setActiveTab("all")}
                className={activeTab === "all" ? "bg-[#5ce1e6] text-white" : ""}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="local" 
                onClick={() => setActiveTab("local")}
                className={activeTab === "local" ? "bg-[#5ce1e6] text-white" : ""}
              >
                Local
              </TabsTrigger>
              <TabsTrigger 
                value="tech" 
                onClick={() => setActiveTab("tech")}
                className={activeTab === "tech" ? "bg-[#5ce1e6] text-white" : ""}
              >
                Tech
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Showing {employersToShow.length} {activeTab !== "all" ? activeTab : ""} companies
            </span>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs flex items-center gap-1"
            >
              <Filter className="h-3 w-3" />
              {showFilters ? "Hide Filters" : "More Filters"}
            </Button>
          </div>
          
          {/* Advanced filter options (hidden by default) */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-sm mb-2">Additional Filters</h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                  >
                    Remote Only
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                  >
                    Junior Roles
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                  >
                    Startups
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <EmployerCard 
          employer={currentEmployer} 
          onAccept={() => handleAcceptEmployer(currentEmployer.id)}
          onReject={() => handleRejectEmployer(currentEmployer.id)}
        />
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>{currentEmployerIndex + 1} of {employersToShow.length} companies</p>
        </div>
      </div>
    </div>
  );
}