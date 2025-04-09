import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { insertJobseekerPreferencesSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";
import PreferenceSlider from "@/components/preference-slider";

// Define preference categories and sliders
const preferenceCategories = [
  {
    id: "workEnvironment",
    title: "Work Environment",
    description: "Rate your preferences for the following aspects of work environment.",
    sliders: [
      {
        id: "teamCollaboration",
        label: "Team Collaboration",
        min: "Independent Work",
        max: "Highly Collaborative",
      },
      {
        id: "workPace",
        label: "Work Pace",
        min: "Methodical",
        max: "Fast-paced",
      },
      {
        id: "workStructure",
        label: "Work Structure",
        min: "Flexible",
        max: "Structured",
      },
      {
        id: "communicationStyle",
        label: "Communication Style",
        min: "Direct",
        max: "Diplomatic",
      },
      {
        id: "remoteWork",
        label: "Remote Work",
        min: "In-office",
        max: "Fully Remote",
      },
      {
        id: "organizationSize",
        label: "Organization Size",
        min: "Small Startup",
        max: "Large Enterprise",
      },
    ],
  },
  {
    id: "careerDevelopment",
    title: "Career Development",
    description: "Rate your preferences for the following aspects of career growth.",
    sliders: [
      {
        id: "growthTrajectory",
        label: "Growth Trajectory",
        min: "Specialist/Expert",
        max: "Management Track",
      },
      {
        id: "learningStyle",
        label: "Learning Style",
        min: "Self-directed",
        max: "Structured Training",
      },
      {
        id: "feedbackFrequency",
        label: "Feedback Frequency",
        min: "Minimal",
        max: "Constant",
      },
      {
        id: "careerProgression",
        label: "Career Progression",
        min: "Skill Mastery",
        max: "Rapid Advancement",
      },
      {
        id: "mentorship",
        label: "Mentorship",
        min: "Independent Learning",
        max: "Close Mentorship",
      },
      {
        id: "educationSupport",
        label: "Education Support",
        min: "On-the-job Training",
        max: "Formal Education",
      },
    ],
  },
  {
    id: "workLifeBalance",
    title: "Work-Life Balance",
    description: "Rate your preferences for the following aspects of work-life balance.",
    sliders: [
      {
        id: "workHours",
        label: "Work Hours",
        min: "Standard Hours",
        max: "Flexible Hours",
      },
      {
        id: "vacationTime",
        label: "Vacation Time",
        min: "Less Important",
        max: "Very Important",
      },
      {
        id: "workSchedule",
        label: "Work Schedule",
        min: "Fixed Schedule",
        max: "Flexible Schedule",
      },
      {
        id: "overtimeExpectations",
        label: "Overtime Expectations",
        min: "Minimal",
        max: "Occasional",
      },
      {
        id: "weekendWork",
        label: "Weekend Work",
        min: "Never",
        max: "Occasionally Acceptable",
      },
      {
        id: "travelRequirements",
        label: "Travel Requirements",
        min: "No Travel",
        max: "Frequent Travel",
      },
    ],
  },
  {
    id: "compensationBenefits",
    title: "Compensation & Benefits",
    description: "Rate your preferences for the following aspects of compensation and benefits.",
    sliders: [
      {
        id: "salaryImportance",
        label: "Salary Importance",
        min: "Lower Priority",
        max: "High Priority",
      },
      {
        id: "equityImportance",
        label: "Equity/Ownership",
        min: "Lower Priority",
        max: "High Priority",
      },
      {
        id: "healthBenefits",
        label: "Health Benefits",
        min: "Basic Coverage",
        max: "Comprehensive",
      },
      {
        id: "retirementBenefits",
        label: "Retirement Benefits",
        min: "Lower Priority",
        max: "High Priority",
      },
      {
        id: "bonusStructure",
        label: "Bonus Structure",
        min: "Fixed Salary",
        max: "Performance-based",
      },
      {
        id: "parentalLeave",
        label: "Parental Leave",
        min: "Standard",
        max: "Generous",
      },
    ],
  },
  {
    id: "companyValues",
    title: "Company Values & Culture",
    description: "Rate your preferences for the following aspects of company values and culture.",
    sliders: [
      {
        id: "socialImpact",
        label: "Social Impact",
        min: "Less Important",
        max: "Very Important",
      },
      {
        id: "environmentalImpact",
        label: "Environmental Impact",
        min: "Less Important",
        max: "Very Important",
      },
      {
        id: "diversityInclusion",
        label: "Diversity & Inclusion",
        min: "Less Important",
        max: "Very Important",
      },
      {
        id: "companyTransparency",
        label: "Company Transparency",
        min: "Less Important",
        max: "Very Important",
      },
      {
        id: "innovationFocus",
        label: "Innovation Focus",
        min: "Stability-oriented",
        max: "Innovation-driven",
      },
      {
        id: "workplaceFormality",
        label: "Workplace Formality",
        min: "Casual",
        max: "Formal",
      },
    ],
  },
  {
    id: "teamDynamics",
    title: "Team Dynamics",
    description: "Rate your preferences for the following aspects of team dynamics.",
    sliders: [
      {
        id: "teamSize",
        label: "Team Size",
        min: "Small Team",
        max: "Large Team",
      },
      {
        id: "managementStyle",
        label: "Management Style",
        min: "Autonomous",
        max: "Directive",
      },
      {
        id: "peerCollaboration",
        label: "Peer Collaboration",
        min: "Independent Work",
        max: "Team-oriented",
      },
      {
        id: "decisionMaking",
        label: "Decision Making",
        min: "Consensus-based",
        max: "Hierarchical",
      },
      {
        id: "conflictResolution",
        label: "Conflict Resolution",
        min: "Direct Discussion",
        max: "Mediated Resolution",
      },
      {
        id: "socialInteraction",
        label: "Social Interaction",
        min: "Minimal",
        max: "Frequent",
      },
    ],
  },
];

// Define the form schema
const preferencesSchema = z.object({
  preferences: z.record(z.number()),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

export default function JobseekerPreferences() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<number>(66);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});

  // Get jobseeker profile
  const { data: jobseekerProfile } = useQuery({
    queryKey: ["/api/jobseeker/profile"],
    enabled: !!user,
  });

  // Initialize the form with default values
  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferences: {},
    },
  });

  // Initialize slider values (all set to 5)
  useState(() => {
    const initialValues: Record<string, number> = {};
    preferenceCategories.forEach(category => {
      category.sliders.forEach(slider => {
        initialValues[slider.id] = 5;
      });
    });
    setSliderValues(initialValues);
  });

  const preferencesMutation = useMutation({
    mutationFn: async (data: PreferencesFormData) => {
      if (!jobseekerProfile) throw new Error("Jobseeker profile not found");
      
      const res = await apiRequest("POST", "/api/jobseeker/preferences", {
        jobseekerId: jobseekerProfile.id,
        preferences: data.preferences,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Preferences saved",
        description: "Your preferences have been saved successfully.",
      });
      
      // Redirect to match feed page
      setLocation("/jobseeker/match-feed");
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSliderChange = (id: string, value: number) => {
    setSliderValues(prev => ({ ...prev, [id]: value }));
  };

  const onSubmit = (data: PreferencesFormData) => {
    // Use the current slider values for submission
    preferencesMutation.mutate({ preferences: sliderValues });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-heading font-bold text-gray-900">Career Preferences</h1>
            <div className="text-sm font-medium text-gray-500">Step 2 of 3</div>
          </div>
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
            <div 
              className="bg-primary-500 h-full rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {preferenceCategories.map((category) => (
              <Card key={category.id} className="shadow mb-8">
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {category.sliders.map((slider) => (
                    <PreferenceSlider
                      key={slider.id}
                      id={slider.id}
                      label={slider.label}
                      min={slider.min}
                      max={slider.max}
                      value={sliderValues[slider.id] || 5}
                      onChange={(value) => handleSliderChange(slider.id, value)}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => setLocation("/jobseeker/profile-setup")}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                disabled={preferencesMutation.isPending}
              >
                {preferencesMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
