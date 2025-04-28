import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

interface PreferencesStepProps {
  onComplete: () => void;
  onBack: () => void;
}

// Define the preference categories and sliders
const preferenceCategories = [
  {
    id: "organizational-values",
    name: "Organizational Values",
    sliders: [
      { id: "work-life-balance", name: "Work-Life Balance", leftLabel: "Always-On", rightLabel: "Strict Boundaries" },
      { id: "mission-driven", name: "Mission-Driven", leftLabel: "Profit-Focused", rightLabel: "Mission-Focused" },
      { id: "innovation", name: "Innovation", leftLabel: "Stability", rightLabel: "Cutting-Edge" },
      { id: "diversity", name: "Diversity & Inclusion", leftLabel: "Traditional", rightLabel: "Progressive" },
      { id: "transparency", name: "Transparency", leftLabel: "Need-to-Know", rightLabel: "Open-Book" },
    ]
  },
  {
    id: "work-style",
    name: "Work Style",
    sliders: [
      { id: "autonomous", name: "Independence", leftLabel: "Guided", rightLabel: "Autonomous" },
      { id: "structured", name: "Structure", leftLabel: "Fluid", rightLabel: "Structured" },
      { id: "deadline-driven", name: "Deadline Approach", leftLabel: "Relaxed", rightLabel: "Urgent" },
      { id: "multitasking", name: "Task Focus", leftLabel: "Single-Task", rightLabel: "Multi-Task" },
      { id: "work-pace", name: "Work Pace", leftLabel: "Steady", rightLabel: "Sprint-based" },
    ]
  },
  {
    id: "leadership",
    name: "Leadership Styles",
    sliders: [
      { id: "coaching", name: "Coaching Style", leftLabel: "Directive", rightLabel: "Facilitative" },
      { id: "feedback", name: "Feedback Style", leftLabel: "Direct", rightLabel: "Diplomatic" },
      { id: "decision-making", name: "Decision Making", leftLabel: "Top-Down", rightLabel: "Consensus" },
      { id: "accessibility", name: "Leadership Accessibility", leftLabel: "Formal", rightLabel: "Approachable" },
      { id: "recognition", name: "Recognition Style", leftLabel: "Private", rightLabel: "Public" },
    ]
  },
  {
    id: "environment",
    name: "Work Environment",
    sliders: [
      { id: "noise-level", name: "Noise Level", leftLabel: "Library-Like", rightLabel: "Bustling" },
      { id: "office-layout", name: "Space Layout", leftLabel: "Private", rightLabel: "Open" },
      { id: "dress-code", name: "Dress Code", leftLabel: "Formal", rightLabel: "Casual" },
      { id: "social-events", name: "Social Events", leftLabel: "Minimal", rightLabel: "Frequent" },
      { id: "physical-comfort", name: "Physical Comfort", leftLabel: "Functional", rightLabel: "Ergonomic" },
    ]
  },
  {
    id: "collaboration",
    name: "Collaboration",
    sliders: [
      { id: "team-size", name: "Team Size", leftLabel: "Small Teams", rightLabel: "Large Teams" },
      { id: "communication", name: "Communication Style", leftLabel: "Brief", rightLabel: "Detailed" },
      { id: "meeting-frequency", name: "Meeting Frequency", leftLabel: "Minimal", rightLabel: "Regular" },
      { id: "cross-functional", name: "Cross-Functional Work", leftLabel: "Specialized", rightLabel: "Integrated" },
      { id: "conflict-resolution", name: "Conflict Resolution", leftLabel: "Direct", rightLabel: "Mediated" },
    ]
  },
  {
    id: "growth",
    name: "Growth & Development",
    sliders: [
      { id: "learning-style", name: "Learning Style", leftLabel: "Self-Directed", rightLabel: "Structured" },
      { id: "skill-variety", name: "Skill Variety", leftLabel: "Specialized", rightLabel: "Diverse" },
      { id: "mentorship", name: "Mentorship", leftLabel: "Minimal", rightLabel: "Extensive" },
      { id: "career-path", name: "Career Path", leftLabel: "Linear", rightLabel: "Exploratory" },
      { id: "feedback-frequency", name: "Feedback Frequency", leftLabel: "Annual", rightLabel: "Continuous" },
    ]
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    sliders: [
      { id: "analytical", name: "Analytical Approach", leftLabel: "Data-Driven", rightLabel: "Intuitive" },
      { id: "risk-tolerance", name: "Risk Tolerance", leftLabel: "Conservative", rightLabel: "Innovative" },
      { id: "decision-speed", name: "Decision Speed", leftLabel: "Deliberate", rightLabel: "Quick" },
      { id: "process-adherence", name: "Process Adherence", leftLabel: "By-the-Book", rightLabel: "Adaptive" },
      { id: "troubleshooting", name: "Troubleshooting Style", leftLabel: "Methodical", rightLabel: "Creative" },
    ]
  },
  {
    id: "adaptability",
    name: "Adaptability",
    sliders: [
      { id: "change-frequency", name: "Change Frequency", leftLabel: "Stable", rightLabel: "Dynamic" },
      { id: "pivoting", name: "Pivoting", leftLabel: "Consistent", rightLabel: "Agile" },
      { id: "uncertainty", name: "Uncertainty Comfort", leftLabel: "Clear Expectations", rightLabel: "Ambiguity Friendly" },
      { id: "tech-adoption", name: "Tech Adoption", leftLabel: "Proven Solutions", rightLabel: "Early Adopter" },
      { id: "resilience", name: "Resilience Expectations", leftLabel: "Supportive", rightLabel: "Challenging" },
    ]
  },
  {
    id: "emotional-intelligence",
    name: "Emotional Intelligence",
    sliders: [
      { id: "empathy", name: "Empathy Priority", leftLabel: "Results-First", rightLabel: "People-First" },
      { id: "emotional-expression", name: "Emotional Expression", leftLabel: "Reserved", rightLabel: "Expressive" },
      { id: "personal-boundaries", name: "Personal Boundaries", leftLabel: "Professional", rightLabel: "Personal" },
      { id: "conflict-approach", name: "Conflict Approach", leftLabel: "Avoiding", rightLabel: "Engaging" },
      { id: "stress-management", name: "Stress Management", leftLabel: "Individual", rightLabel: "Team Support" },
    ]
  },
];

export function PreferencesStep({ onComplete, onBack }: PreferencesStepProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferences, setPreferences] = useState<Record<string, number>>({});

  // Get existing preferences data
  const { data: preferencesData, isLoading: isPreferencesLoading } = useQuery({
    queryKey: ["/api/jobseeker/preferences"],
    queryFn: async () => {
      const res = await fetch("/api/jobseeker/preferences");
      if (!res.ok) {
        // If preferences don't exist yet, return an empty object
        if (res.status === 404) {
          return {};
        }
        throw new Error("Failed to fetch preferences");
      }
      return await res.json();
    },
  });

  // Initialize preferences from existing data
  useState(() => {
    if (preferencesData && preferencesData.preferencesData) {
      try {
        const parsedPreferences = JSON.parse(preferencesData.preferencesData);
        setPreferences(parsedPreferences);
      } catch (error) {
        // If the preferences data is not valid JSON, start with empty preferences
        console.error("Failed to parse preferences data:", error);
      }
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: { preferencesData: string }) => {
      // Check if preferences already exist
      if (preferencesData && preferencesData.id) {
        // Update existing preferences
        const res = await apiRequest("PATCH", "/api/jobseeker/preferences", data);
        return await res.json();
      } else {
        // Create new preferences
        const res = await apiRequest("POST", "/api/jobseeker/preferences", data);
        return await res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      });
      
      // Invalidate the preferences query
      queryClient.invalidateQueries({ queryKey: ["/api/jobseeker/preferences"] });
      
      // Complete the form
      onComplete();
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast({
        title: "Error updating preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSliderChange = (sliderId: string, value: number[]) => {
    setPreferences(prev => ({
      ...prev,
      [sliderId]: value[0]
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Convert preferences to JSON string
    const preferencesData = JSON.stringify(preferences);
    
    // Send to API
    updatePreferencesMutation.mutate({ preferencesData });
  };

  // Get slider value or default to middle (50)
  const getSliderValue = (sliderId: string) => {
    return preferences[sliderId] !== undefined ? [preferences[sliderId]] : [50];
  };

  // If still loading preferences data, show a loading state
  if (isPreferencesLoading) {
    return (
      <CardContent className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2 text-gray-500">Loading your preferences...</p>
      </CardContent>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Preferences & Values</CardTitle>
        <CardDescription>
          Adjust the sliders to indicate your workplace preferences. These settings help us find employers who align with your values.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" className="w-full" defaultValue={["organizational-values"]}>
          {preferenceCategories.map((category) => (
            <AccordionItem value={category.id} key={category.id}>
              <AccordionTrigger className="text-base font-medium hover:no-underline hover:bg-gray-50 px-4 py-2 rounded">
                {category.name}
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="space-y-8">
                  {category.sliders.map((slider) => (
                    <div key={slider.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{slider.name}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{slider.leftLabel}</span>
                          <span>{slider.rightLabel}</span>
                        </div>
                        <Slider
                          value={getSliderValue(slider.id)}
                          min={1}
                          max={99}
                          step={1}
                          onValueChange={(value) => handleSliderChange(slider.id, value)}
                          className="[&>span]:bg-[#5ce1e6] cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </CardFooter>
    </>
  );
}