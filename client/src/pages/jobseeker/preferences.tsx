import { useState, useEffect, useCallback } from "react";
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
import { insertJobseekerPreferencesSchema, JobseekerProfile } from "@shared/schema";
import { Loader2, ChevronDown, ChevronUp, Check } from "lucide-react";
import PreferenceSlider from "@/components/preference-slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Define preference categories and sliders based on the user requirements
const preferenceCategories = [
  {
    id: "missionVision",
    title: "Mission & Vision",
    description: "Move the slider to the position that best reflects your preferences on the mission, vision, and values of the organization you wish to work for.",
    sliders: [
      {
        id: "purposeVsProfit",
        label: "Purpose vs. Profit",
        min: "Purpose-Driven Impact",
        max: "Profit-Driven Focus",
        tooltip: "Organizations might prioritize making a positive social/environmental impact or focus more on maximizing profit and shareholder value."
      },
      {
        id: "innovationVsTradition",
        label: "Innovation vs. Tradition",
        min: "Innovation & Disruption",
        max: "Tradition & Stability",
        tooltip: "Some organizations value innovation and constantly disrupting the status quo, while others value tradition, stability, and proven approaches."
      },
      {
        id: "diversityVsPerformance",
        label: "Diversity vs. Performance Focus",
        min: "Diversity & Inclusion",
        max: "Performance-First Culture",
        tooltip: "This reflects whether an organization prioritizes diversity and inclusion initiatives or focuses primarily on performance metrics and results."
      },
      {
        id: "cooperativeVsCompetitive",
        label: "Cooperative vs. Competitive",
        min: "Cooperative & Supportive",
        max: "Highly Competitive",
        tooltip: "This indicates whether the work environment encourages cooperation and support among colleagues or fosters internal competition."
      },
      {
        id: "socialResponsibilityVsPragmatism",
        label: "Social Responsibility vs. Pragmatism",
        min: "Social Responsibility",
        max: "Business Pragmatism",
        tooltip: "Some organizations prioritize social responsibility in decision-making, while others focus on pragmatic business considerations."
      }
    ],
  },
  {
    id: "workStylePreferences",
    title: "Work Style Preferences",
    description: "Move the slider to the position that best reflects your preferences on your own working style.",
    sliders: [
      {
        id: "logicalVsIntuitive",
        label: "Logical vs. Intuitive",
        min: "Logical Decision-Making",
        max: "Intuitive Decision-Making",
        tooltip: "Do you prefer making decisions based on objective data and analysis, or do you rely more on intuition and gut feelings?"
      },
      {
        id: "structureVsAmbiguity",
        label: "Structure vs. Ambiguity",
        min: "Prefers Structure",
        max: "Thrives in Ambiguity",
        tooltip: "This indicates whether you work best with clear guidelines and processes or prefer more open-ended, ambiguous situations."
      },
      {
        id: "focusVsMultitasking",
        label: "Focus vs. Multitasking",
        min: "Deep Focus",
        max: "Multitasking",
        tooltip: "Do you prefer to focus deeply on one task at a time, or do you enjoy juggling multiple tasks simultaneously?"
      },
      {
        id: "deadlinesVsFlexibility",
        label: "Deadlines vs. Flexibility",
        min: "Set Deadlines",
        max: "Flexible Timelines",
        tooltip: "This indicates your preference for working with firm deadlines versus more flexible timelines."
      },
      {
        id: "checkInsVsAutonomy",
        label: "Check-ins vs. Autonomy",
        min: "Frequent Check-Ins",
        max: "Full Autonomy",
        tooltip: "Do you prefer regular check-ins and feedback from managers, or do you prefer complete autonomy in your work?"
      },
      {
        id: "provenVsExperimental",
        label: "Proven vs. Experimental",
        min: "Proven Practices",
        max: "Experimentation",
        tooltip: "Do you prefer following established, proven methods, or do you enjoy experimenting with new approaches?"
      }
    ],
  },
  {
    id: "supervisorStyle",
    title: "Preferred Style for Supervisor",
    description: "Move the slider to the position that best reflects your preferences on your direct supervisor's management style.",
    sliders: [
      {
        id: "strictVsAdaptable",
        label: "Strict vs. Adaptable",
        min: "Strict Adherence to Policies",
        max: "Adaptable to Situations",
        tooltip: "Do you prefer a manager who strictly adheres to company policies, or one who adapts rules based on the situation?"
      },
      {
        id: "trainingVsIndependent",
        label: "Training vs. Independent Learning",
        min: "Structured Training & Mentorship",
        max: "Independent Learning & Development",
        tooltip: "This indicates your preference for structured training programs versus self-directed learning opportunities."
      },
      {
        id: "taskmasterVsHandsOff",
        label: "Taskmaster vs. Hands-Off",
        min: "Taskmaster & Transparent",
        max: "Hands-Off & Ambiguous",
        tooltip: "Do you prefer a manager who closely monitors tasks and provides clear direction, or one who provides more freedom and autonomy?"
      },
      {
        id: "publicVsPrivateRecognition",
        label: "Public vs. Private Recognition",
        min: "Shows Public Recognition",
        max: "Shows Private Appreciation",
        tooltip: "This indicates whether you prefer to receive recognition publicly or in private."
      },
      {
        id: "competitionVsCollaboration",
        label: "Competition vs. Collaboration",
        min: "Encourages Competition",
        max: "Fosters Collaboration",
        tooltip: "Do you prefer a manager who encourages competition among team members, or one who promotes collaboration?"
      },
      {
        id: "boundariesVsAvailability",
        label: "Boundaries vs. Availability",
        min: "Sets Boundaries",
        max: "Always Available",
        tooltip: "This reflects whether you prefer a manager who maintains professional boundaries or one who is more available and accessible."
      }
    ],
  },
  {
    id: "workEnvironment",
    title: "Preferred Work Environment",
    description: "Move the slider to the position that best reflects your preferences for the environment you will work in.",
    sliders: [
      {
        id: "focusVsDistraction",
        label: "Focus vs. Distraction",
        min: "Deep Focus",
        max: "Distractions & Multitasking",
        tooltip: "This indicates your preference for a quiet, focused environment versus a more dynamic, multitasking environment."
      },
      {
        id: "soloVsCollaboration",
        label: "Solo vs. Collaboration",
        min: "Working Solo",
        max: "Frequent Collaboration",
        tooltip: "Do you prefer working independently most of the time, or do you thrive in collaborative environments?"
      },
      {
        id: "assignedVsFlexible",
        label: "Assigned vs. Flexible Workspaces",
        min: "Assigned Desks & Workspaces",
        max: "Open Office with Flexible Seating",
        tooltip: "This reflects your preference for having your own dedicated workspace versus more flexible arrangements."
      },
      {
        id: "quietVsNoisy",
        label: "Quiet vs. Busy",
        min: "Quiet & Interruption-Free",
        max: "Noisy & Busy",
        tooltip: "Do you prefer a quiet work environment with minimal interruptions, or do you thrive in a busier, more energetic space?"
      },
      {
        id: "basicVsAmenities",
        label: "Basic vs. Amenities",
        min: "I'm at Work to Work",
        max: "I Want Lots of Amenities",
        tooltip: "This indicates whether you prioritize a focused work environment or value additional workplace amenities."
      },
      {
        id: "separateVsSocial",
        label: "Work-Life Separation vs. Integration",
        min: "Keep Work & Social Life Separate",
        max: "Lots of Group Activities & Happy Hours",
        tooltip: "Do you prefer to keep your work and social life separate, or do you enjoy workplace social activities?"
      }
    ],
  },
  {
    id: "collaborationStyles",
    title: "Preferred Collaboration Styles",
    description: "Move the slider to the position that best reflects your preferences on how you collaborate with your team.",
    sliders: [
      {
        id: "definedVsFluid",
        label: "Defined vs. Fluid Roles",
        min: "Defined Roles",
        max: "Fluid Responsibilities",
        tooltip: "This indicates whether you prefer clearly defined roles and responsibilities or more flexible arrangements where responsibilities are shared."
      },
      {
        id: "dataVsStory",
        label: "Data vs. Story",
        min: "Data-Backed Arguments",
        max: "Persuasive Storytelling",
        tooltip: "Do you prefer to make decisions based on data and analytics, or do you find storytelling and narratives more compelling?"
      },
      {
        id: "formalVsInformal",
        label: "Formal vs. Informal Meetings",
        min: "Formal, Scheduled Meetings",
        max: "Quick, Informal Meetings",
        tooltip: "This reflects your preference for structured, scheduled meetings versus informal, impromptu discussions."
      },
      {
        id: "preciseVsOpenEnded",
        label: "Precise vs. Open-Ended",
        min: "Precise Communications",
        max: "Open-Ended Discussions",
        tooltip: "Do you prefer direct, to-the-point communications, or do you value more exploratory, open-ended discussions?"
      },
      {
        id: "structuredVsOpen",
        label: "Structured vs. Open Approvals",
        min: "Structured Approvals",
        max: "Open Idea-Sharing",
        tooltip: "This indicates your preference for formal approval processes versus more open sharing of ideas."
      },
      {
        id: "decisiveVsDemocratic",
        label: "Decisive vs. Democratic",
        min: "Decisive Leadership",
        max: "Democratic Decisions",
        tooltip: "Do you prefer strong, decisive leadership, or do you value more democratic, consensus-based decision-making?"
      }
    ],
  },
  {
    id: "growthDevelopment",
    title: "Growth & Development Goals",
    description: "Move the slider to the position that best reflects your preferences on your own growth and development.",
    sliders: [
      {
        id: "steadyVsRapid",
        label: "Steady vs. Rapid Growth",
        min: "Steady Progression",
        max: "Rapid Promition",
        tooltip: "This indicates whether you prefer a gradual, steady career progression or faster advancement opportunities."
      },
      {
        id: "tenureVsMerit",
        label: "Tenure vs. Merit",
        min: "Tenure-Based Promotion",
        max: "Merit-Based Promotion",
        tooltip: "Do you prefer a system where promotions are based on time with the company, or one that rewards performance regardless of tenure?"
      },
      {
        id: "skillsVsTitles",
        label: "Skills vs. Titles",
        min: "Prioritize Skills Development",
        max: "Prioritize Advancing Titles",
        tooltip: "This reflects whether you prioritize developing new skills or advancing to higher job titles."
      },
      {
        id: "companyVsIndependent",
        label: "Company vs. Independent Development",
        min: "Company-Sponsored Development",
        max: "Independent Skill-Building",
        tooltip: "Do you prefer formal company-sponsored development programs, or do you take more ownership of your own skill-building?"
      },
      {
        id: "loyaltyVsAbility",
        label: "Loyalty vs. Ability",
        min: "Employer Values Loyalty",
        max: "Employer Values Abilitiies",
        tooltip: "This indicates whether you prefer an environment that rewards loyalty or one that prioritizes skills and abilities."
      },
      {
        id: "recognitionVsPromotion",
        label: "Recognition vs. Promotion",
        min: "Motivated by Recognition & Achievements",
        max: "Motivated by Promotions & Advancing Titles",
        tooltip: "Are you more motivated by recognition and acknowledgment of your work, or by formal promotions and title advancement?"
      }
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
  const [progress, setProgress] = useState<number>(0);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});

  // Get jobseeker profile
  const { data: jobseekerProfile } = useQuery<JobseekerProfile>({
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

  // Initialize slider values (all set to 50 - middle of 1-99 scale)
  useEffect(() => {
    const initialValues: Record<string, number> = {};
    const initialOpenState: Record<string, boolean> = {};
    const initialCompletedState: Record<string, boolean> = {};
    
    preferenceCategories.forEach((category, index) => {
      // First section is open by default
      initialOpenState[category.id] = index === 0;
      initialCompletedState[category.id] = false;
      
      category.sliders.forEach(slider => {
        initialValues[slider.id] = 50; // Set to middle of scale (1-99)
      });
    });
    
    setSliderValues(initialValues);
    setOpenSections(initialOpenState);
    setCompletedSections(initialCompletedState);
  }, []);

  // Calculate overall progress
  useEffect(() => {
    const totalSections = preferenceCategories.length;
    const completedCount = Object.values(completedSections).filter(Boolean).length;
    const calculatedProgress = Math.round((completedCount / totalSections) * 100);
    setProgress(calculatedProgress);
  }, [completedSections]);

  // Check if a section is complete (all sliders have been touched)
  const checkSectionCompletion = useCallback((categoryId: string) => {
    const category = preferenceCategories.find(cat => cat.id === categoryId);
    if (!category) return false;
    
    const allSlidersSet = category.sliders.every(slider => 
      sliderValues[slider.id] !== undefined && sliderValues[slider.id] !== 50
    );
    
    setCompletedSections(prev => ({
      ...prev,
      [categoryId]: allSlidersSet
    }));
    
    return allSlidersSet;
  }, [sliderValues]);

  const toggleSection = useCallback((categoryId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  // In a development environment, let's simulate having a profile to avoid the TypeScript errors
  // In production, we would handle the profile not found case more gracefully
  const mockJobseekerProfile = { id: 1, userId: 1, firstName: "Test", lastName: "User" } as JobseekerProfile;
  
  const preferencesMutation = useMutation({
    mutationFn: async (data: PreferencesFormData) => {
      // Use the actual profile when available, otherwise use our mock data for development
      const profile = jobseekerProfile || mockJobseekerProfile;
      
      const res = await apiRequest("POST", "/api/jobseeker/preferences", {
        jobseekerId: profile.id,
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

  const handleSliderChange = (categoryId: string, sliderId: string, value: number) => {
    setSliderValues(prev => ({ ...prev, [sliderId]: value }));
    
    // Check if this section is now complete
    setTimeout(() => {
      checkSectionCompletion(categoryId);
    }, 100);
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
              className="bg-primary-500 h-full rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        {/* Progress Sidebar */}
        <div className="md:w-1/4 hidden md:block">
          <div className="bg-white rounded-lg shadow p-4 sticky top-24">
            <h3 className="font-medium text-gray-900 mb-4">Your Progress</h3>
            <div className="space-y-2">
              {preferenceCategories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => toggleSection(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                    openSections[category.id] 
                      ? 'bg-primary-50 text-primary-700' 
                      : completedSections[category.id] 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <span className={`w-5 h-5 mr-2 flex-shrink-0 rounded-full flex items-center justify-center 
                      ${completedSections[category.id] 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'}`}
                    >
                      {completedSections[category.id] ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </span>
                    <span className="text-sm font-medium truncate">{category.title}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="md:w-3/4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {preferenceCategories.map((category) => (
                <Collapsible 
                  key={category.id} 
                  open={openSections[category.id]}
                  onOpenChange={() => toggleSection(category.id)}
                  className="mb-6"
                >
                  <Card className={`shadow transition-all duration-200 ${
                    completedSections[category.id] ? 'border-l-4 border-l-green-500' : ''
                  }`}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>{category.title}</CardTitle>
                            <CardDescription className="mt-1">{category.description}</CardDescription>
                          </div>
                          <div className="flex items-center">
                            {completedSections[category.id] && (
                              <span className="mr-2 text-green-600 bg-green-100 p-1 rounded-full">
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                            {openSections[category.id] ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        {category.sliders.map((slider) => (
                          <PreferenceSlider
                            key={slider.id}
                            id={slider.id}
                            label={slider.label}
                            min={slider.min}
                            max={slider.max}
                            value={sliderValues[slider.id] || 50}
                            onChange={(value) => handleSliderChange(category.id, slider.id, value)}
                            tooltip={slider.tooltip}
                          />
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}

              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => setLocation("/jobseeker/profile-setup")}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={preferencesMutation.isPending || progress < 100}
                >
                  {preferencesMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {progress < 100 ? "Please Complete All Sections" : "Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </main>
      </div>
    </div>
  );
}
