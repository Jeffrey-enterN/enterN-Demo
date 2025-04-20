import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';

// Define the slider categories - same as what we show to jobseekers
const sliderCategories = {
  "Mission & Vision": [
    { id: "purposeVsProfit", label: "Purpose vs Profit", description: "Emphasis on company mission vs financial performance" },
    { id: "innovationVsTradition", label: "Innovation vs Tradition", description: "Focus on new ideas vs established practices" },
    { id: "diversityVsPerformance", label: "Diversity vs Performance", description: "Prioritizing diversity or pure performance metrics" },
    { id: "cooperativeVsCompetitive", label: "Cooperative vs Competitive", description: "Team-oriented approach vs individual achievement" },
    { id: "socialResponsibilityVsPragmatism", label: "Social Responsibility vs Pragmatism", description: "Importance of corporate social responsibility" },
  ],
  "Work Style Preferences": [
    { id: "logicalVsIntuitive", label: "Logical vs Intuitive", description: "Data-driven approach vs gut feelings" },
    { id: "structureVsAmbiguity", label: "Structure vs Ambiguity", description: "Clear processes vs comfort with uncertainty" },
    { id: "focusVsMultitasking", label: "Focus vs Multitasking", description: "Deep concentration vs handling multiple tasks" },
    { id: "deadlinesVsFlexibility", label: "Deadlines vs Flexibility", description: "Strict timeline adherence vs adaptable scheduling" },
    { id: "planningVsAdaptability", label: "Planning vs Adaptability", description: "Detailed planning vs on-the-fly adaptation" },
  ],
  "Preferred Style for Supervisor": [
    { id: "handsOnVsHandsOff", label: "Hands-on vs Hands-off", description: "Management style preference" },
    { id: "directVsDiplomatic", label: "Direct vs Diplomatic", description: "Communication style preference" },
    { id: "professionalVsCasual", label: "Professional vs Casual", description: "Workplace atmosphere preference" },
    { id: "frequentVsInfrequentFeedback", label: "Frequent vs Infrequent Feedback", description: "Feedback frequency preference" },
    { id: "fixedVsFlexibleHours", label: "Fixed vs Flexible Hours", description: "Work schedule preference" },
  ],
  "Preferred Collaboration Styles": [
    { id: "independentVsCollaborative", label: "Independent vs Collaborative", description: "Work approach preference" },
    { id: "specialistVsGeneralist", label: "Specialist vs Generalist", description: "Role focus preference" },
    { id: "writtenVsVerbalCommunication", label: "Written vs Verbal Communication", description: "Communication method preference" },
    { id: "projectVsTaskFocus", label: "Project vs Task Focus", description: "Work organization preference" },
    { id: "leaderVsSupporter", label: "Leader vs Supporter", description: "Team role preference" },
  ],
};

export default function PrioritySliders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedSliders, setSelectedSliders] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Mission & Vision");
  
  // Get employer profile
  const { data: employerProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['/api/employer/profile'],
    enabled: !!user,
  });

  // Initialize with existing priority sliders if any
  useEffect(() => {
    if (employerProfile?.prioritySliders) {
      setSelectedSliders(employerProfile.prioritySliders);
    }
  }, [employerProfile]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { prioritySliders: string[] }) => {
      const res = await apiRequest(
        "PATCH",
        "/api/employer/profile/priority-sliders",
        data
      );
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Priority sliders saved",
        description: "Your priority sliders have been updated successfully.",
      });
      
      // Invalidate the employer profile query to refetch with new data
      queryClient.invalidateQueries({ queryKey: ['/api/employer/profile'] });
      
      // Redirect back to dashboard
      setLocation("/employer/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving priority sliders",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleSlider = (sliderId: string) => {
    setSelectedSliders(prev => {
      // If already selected, remove it
      if (prev.includes(sliderId)) {
        return prev.filter(id => id !== sliderId);
      }
      
      // If adding a new one but already have 3, show a toast and don't add
      if (prev.length >= 3) {
        toast({
          title: "Maximum selections reached",
          description: "You can only select up to 3 priority sliders. Deselect one to choose another.",
          variant: "destructive",
        });
        return prev;
      }
      
      // Otherwise add it
      return [...prev, sliderId];
    });
  };

  const handleSave = () => {
    saveMutation.mutate({ prioritySliders: selectedSliders });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const isPending = loadingProfile || saveMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation('/employer/dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Priority Preferences</h1>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2 items-start">
              <div className="p-2 rounded-full bg-[rgba(92,225,230,0.1)]">
                <Info className="h-5 w-5 text-[#5ce1e6]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">What are priority preferences?</h3>
                <p className="text-gray-600 mt-1">
                  Select up to 3 sliders that are most important to you when matching with candidates.
                  These selected preferences will be displayed first on candidate cards, making it easier to identify the best matches.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md">
              <p className="text-sm text-amber-800">
                <strong>Selected: {selectedSliders.length}/3</strong> - You've selected {selectedSliders.length} out of 3 possible priority preferences.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {Object.entries(sliderCategories).map(([category, sliders]) => (
          <Card key={category} className="mb-4 overflow-hidden">
            <CardHeader 
              className={`bg-gray-50 hover:bg-gray-100 cursor-pointer py-3 border-b ${expandedCategory === category ? 'border-[#5ce1e6]' : 'border-gray-200'}`}
              onClick={() => toggleCategory(category)}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium text-gray-800">{category}</CardTitle>
                {expandedCategory === category ? (
                  <ArrowLeft className="h-5 w-5 text-gray-500 transform rotate-90" />
                ) : (
                  <ArrowLeft className="h-5 w-5 text-gray-500 transform -rotate-90" />
                )}
              </div>
            </CardHeader>
            
            {expandedCategory === category && (
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {sliders.map((slider, index) => (
                    <div key={slider.id}>
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id={slider.id} 
                          checked={selectedSliders.includes(slider.id)}
                          onCheckedChange={() => handleToggleSlider(slider.id)}
                          className="text-[#5ce1e6] border-[#5ce1e6] focus:ring-[#5ce1e6]"
                        />
                        <div className="space-y-0.5">
                          <Label 
                            htmlFor={slider.id}
                            className="font-medium cursor-pointer"
                          >
                            {slider.label}
                          </Label>
                          <p className="text-sm text-gray-500">{slider.description}</p>
                        </div>
                      </div>
                      {index < sliders.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/employer/dashboard')}
            disabled={isPending}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isPending}
            className="bg-[#5ce1e6] hover:bg-[#4bb7bc] text-white"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Save Priorities
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}