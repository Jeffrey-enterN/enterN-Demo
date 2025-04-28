import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormItem } from "@/components/ui/form";
import { Loader2, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

// Preferences schema - allowing any values for now as we have many slider fields
const preferencesSchema = z.object({
  preferences: z.record(z.number()).optional(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface PreferencesStepProps {
  profile: any;
  onNext: () => void;
  onBack: () => void;
}

// Define the categories and their sliders
const preferencesCategories = [
  {
    id: "organizational-values",
    title: "Organizational Values & Mission Alignment",
    sliders: [
      { id: "mission-driven", left: "Mission-driven", right: "Profit-driven" },
      { id: "social-impact", left: "High social impact", right: "Low social impact" },
      { id: "ethics-priority", left: "Ethics first", right: "Results first" },
      { id: "innovation-tradition", left: "Innovative", right: "Traditional" },
      { id: "diversity-inclusion", left: "Diverse & inclusive", right: "Homogeneous" }
    ]
  },
  {
    id: "work-style",
    title: "Work Style Preferences",
    sliders: [
      { id: "autonomy-direction", left: "High autonomy", right: "Clear direction" },
      { id: "specialist-generalist", left: "Specialist", right: "Generalist" },
      { id: "independent-collaborative", left: "Independent", right: "Collaborative" },
      { id: "structure-flexibility", left: "Structured", right: "Flexible" },
      { id: "risk-tolerance", left: "Risk-taking", right: "Risk-averse" }
    ]
  },
  {
    id: "leadership-style",
    title: "Preferred Leadership & Supervisor Styles",
    sliders: [
      { id: "hands-on-hands-off", left: "Hands-on management", right: "Hands-off management" },
      { id: "coaching-directing", left: "Coaching-oriented", right: "Direction-oriented" },
      { id: "feedback-frequency", left: "Frequent feedback", right: "Periodic feedback" },
      { id: "hierarchical-flat", left: "Hierarchical", right: "Flat structure" },
      { id: "transformational-transactional", left: "Transformational", right: "Transactional" }
    ]
  },
  {
    id: "work-environment",
    title: "Preferred Work Environment",
    sliders: [
      { id: "busy-calm", left: "Busy & energetic", right: "Calm & focused" },
      { id: "formal-casual", left: "Formal", right: "Casual" },
      { id: "competitive-supportive", left: "Competitive", right: "Supportive" },
      { id: "tech-driven-human-centered", left: "Tech-driven", right: "Human-centered" },
      { id: "open-private", left: "Open workspace", right: "Private workspace" }
    ]
  },
  {
    id: "collaboration-style",
    title: "Collaboration & Communication Style",
    sliders: [
      { id: "direct-diplomatic", left: "Direct communication", right: "Diplomatic communication" },
      { id: "scheduled-spontaneous", left: "Scheduled meetings", right: "Spontaneous discussions" },
      { id: "text-verbal", left: "Text-based", right: "Verbal" },
      { id: "detailed-big-picture", left: "Detailed", right: "Big-picture" },
      { id: "consensus-decisive", left: "Consensus-seeking", right: "Decisive" }
    ]
  },
  {
    id: "growth-motivation",
    title: "Growth, Intrinsic Motivation & Development Goals",
    sliders: [
      { id: "continuous-learning", left: "Continuous learning", right: "Mastery" },
      { id: "challenge-stability", left: "Challenge-oriented", right: "Stability-oriented" },
      { id: "skill-breadth-depth", left: "Skill breadth", right: "Skill depth" },
      { id: "mentor-access", left: "Access to mentorship", right: "Self-directed growth" },
      { id: "creative-analytical", left: "Creative work", right: "Analytical work" }
    ]
  },
  {
    id: "problem-solving",
    title: "Problem-Solving & Decision-Making",
    sliders: [
      { id: "intuitive-methodical", left: "Intuitive", right: "Methodical" },
      { id: "theory-practice", left: "Theory-based", right: "Practice-based" },
      { id: "rapid-thorough", left: "Rapid decisions", right: "Thorough analysis" },
      { id: "innovative-proven", left: "Innovative solutions", right: "Proven approaches" },
      { id: "solo-team", left: "Individual problem-solving", right: "Team problem-solving" }
    ]
  },
  {
    id: "adaptability",
    title: "Adaptability & Resilience",
    sliders: [
      { id: "change-consistency", left: "Embraces change", right: "Values consistency" },
      { id: "pressure-tolerance", left: "Thrives under pressure", right: "Prefers low pressure" },
      { id: "ambiguity-clarity", left: "Comfortable with ambiguity", right: "Needs clarity" },
      { id: "multitasking-focus", left: "Multitasking", right: "Deep focus" },
      { id: "fast-steady", left: "Fast-paced", right: "Steady-paced" }
    ]
  },
  {
    id: "emotional-intelligence",
    title: "Emotional Intelligence & Interpersonal Effectiveness",
    sliders: [
      { id: "network-depth", left: "Wide network", right: "Deep relationships" },
      { id: "emotional-rational", left: "Emotionally expressive", right: "Reserved & rational" },
      { id: "social-independent", left: "Socially oriented", right: "Independently oriented" },
      { id: "conflict-engagement", left: "Engages with conflict", right: "Avoids conflict" },
      { id: "empathy-objectivity", left: "Empathy-driven", right: "Objectivity-driven" }
    ]
  }
];

export function PreferencesStep({ profile, onNext, onBack }: PreferencesStepProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>([preferencesCategories[0].id]);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferences: {},
    },
  });

  // Initialize slider values from profile if available
  useState(() => {
    if (profile?.preferences) {
      setSliderValues(profile.preferences);
    } else {
      // Initialize all sliders to middle value (50)
      const initialValues: Record<string, number> = {};
      preferencesCategories.forEach(category => {
        category.sliders.forEach(slider => {
          initialValues[slider.id] = 50;
        });
      });
      setSliderValues(initialValues);
    }
  });

  const preferenceMutation = useMutation({
    mutationFn: async (data: Record<string, number>) => {
      const res = await apiRequest("PATCH", `/api/jobseeker/preferences/${profile.id}`, { 
        preferences: data 
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved.",
      });
      
      // Invalidate the profile query
      queryClient.invalidateQueries({ queryKey: ["/api/jobseeker/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/jobseeker/preferences"] });
      
      // Move to the next step/finish
      onNext();
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

  const onSubmit = () => {
    setIsSubmitting(true);
    preferenceMutation.mutate(sliderValues);
  };

  const handleSliderChange = (sliderId: string, value: number[]) => {
    setSliderValues(prev => ({
      ...prev,
      [sliderId]: value[0],
    }));
  };

  const toggleCategory = (categoryId: string) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter(id => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <div className="space-y-6">
          <p className="text-gray-600">
            Adjust these sliders to indicate your preferences. These will help us match you with employers that align with your values and work style.
          </p>
          
          <Accordion 
            type="multiple" 
            value={openCategories} 
            className="space-y-4"
          >
            {preferencesCategories.map((category) => (
              <AccordionItem 
                key={category.id} 
                value={category.id}
                className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline">
                  <span className="text-lg font-medium">{category.title}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-gray-50/50">
                  <div className="space-y-6">
                    {category.sliders.map((slider) => (
                      <div key={slider.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 font-medium">{slider.left}</span>
                          <span className="text-gray-700 font-medium">{slider.right}</span>
                        </div>
                        <FormItem>
                          <Slider
                            defaultValue={[sliderValues[slider.id] || 50]}
                            max={99}
                            min={1}
                            step={1}
                            onValueChange={(value) => handleSliderChange(slider.id, value)}
                          />
                        </FormItem>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finishing...
              </>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}