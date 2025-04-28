import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, School, BriefcaseIcon, Sliders } from "lucide-react";
import { SchoolInfoStep } from "../../components/jobseeker/school-info-step";
import { CareerInterestsStep } from "../../components/jobseeker/career-interests-step";
import { PreferencesStep } from "../../components/jobseeker/preferences-step";

export default function CompleteProfile() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("school-info");

  // Get jobseeker profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/jobseeker/profile"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNext = () => {
    if (activeTab === "school-info") {
      setActiveTab("career-interests");
    } else if (activeTab === "career-interests") {
      setActiveTab("preferences");
    } else if (activeTab === "preferences") {
      setLocation("/jobseeker/dashboard");
    }
  };

  const handleBack = () => {
    if (activeTab === "career-interests") {
      setActiveTab("school-info");
    } else if (activeTab === "preferences") {
      setActiveTab("career-interests");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-heading font-bold text-gray-900">Complete Your Profile</h1>
            <Button 
              variant="ghost" 
              className="text-sm text-gray-500"
              onClick={() => setLocation('/jobseeker/dashboard')}
            >
              Skip for now
            </Button>
          </div>
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
            <div 
              className="bg-primary-500 h-full rounded-full" 
              style={{ width: activeTab === "school-info" ? "33%" : activeTab === "career-interests" ? "66%" : "100%" }}
            ></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow mb-8">
          <CardHeader>
            <CardTitle>Let's complete your profile</CardTitle>
            <CardDescription>
              Taking the time to fill out your complete profile will help us find the best matches for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="school-info" className="flex gap-2 items-center">
                  <School className="h-4 w-4" />
                  <span>School Info</span>
                </TabsTrigger>
                <TabsTrigger value="career-interests" className="flex gap-2 items-center">
                  <BriefcaseIcon className="h-4 w-4" />
                  <span>Career Interests</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex gap-2 items-center">
                  <Sliders className="h-4 w-4" />
                  <span>Preferences</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="school-info">
                <SchoolInfoStep profile={profile} onNext={handleNext} />
              </TabsContent>

              <TabsContent value="career-interests">
                <CareerInterestsStep profile={profile} onNext={handleNext} onBack={handleBack} />
              </TabsContent>

              <TabsContent value="preferences">
                <PreferencesStep profile={profile} onNext={handleNext} onBack={handleBack} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}