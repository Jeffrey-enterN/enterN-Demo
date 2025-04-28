import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { SchoolInfoStep } from "@/components/jobseeker/school-info-step";
import { CareerInterestsStep } from "@/components/jobseeker/career-interests-step";
import { PreferencesStep } from "@/components/jobseeker/preferences-step";
// Import the recently created StepHeader component
import { StepHeader } from "@/components/step-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

// Step definitions for the multi-step form
const steps = [
  { id: "school-info", title: "School Information" },
  { id: "career-interests", title: "Career Interests" },
  { id: "preferences", title: "Preferences & Values" },
];

export default function CompleteProfile() {
  const [currentStep, setCurrentStep] = useState<string>("school-info");
  const [_, setLocation] = useLocation();
  const { user } = useAuth();

  // Go back to the dashboard
  const handleBackToDashboard = () => {
    setLocation('/jobseeker/dashboard');
  };

  // Handle next step navigation
  const handleNextStep = (currentId: string) => {
    const currentIndex = steps.findIndex(step => step.id === currentId);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    } else {
      // When all steps are completed, go to the dashboard
      setLocation('/jobseeker/dashboard');
    }
  };

  // Handle previous step navigation
  const handlePreviousStep = (currentId: string) => {
    const currentIndex = steps.findIndex(step => step.id === currentId);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  // Render the appropriate step component
  const renderStepContent = () => {
    switch (currentStep) {
      case "school-info":
        return (
          <SchoolInfoStep 
            onNext={() => handleNextStep("school-info")} 
          />
        );
      case "career-interests":
        return (
          <CareerInterestsStep 
            onNext={() => handleNextStep("career-interests")} 
            onBack={() => handlePreviousStep("career-interests")} 
          />
        );
      case "preferences":
        return (
          <PreferencesStep 
            onComplete={() => handleNextStep("preferences")} 
            onBack={() => handlePreviousStep("preferences")} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with progress bar */}
      <StepHeader 
        title="Complete Your Profile" 
        currentStep={steps.findIndex(step => step.id === currentStep) + 1} 
        totalSteps={steps.length}
        progress={calculateProgress()}
      />

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          className="flex items-center mb-4 text-gray-600 hover:text-gray-900" 
          onClick={handleBackToDashboard}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>

        <Card className="overflow-hidden shadow">
          {renderStepContent()}
        </Card>
      </main>
    </div>
  );
}