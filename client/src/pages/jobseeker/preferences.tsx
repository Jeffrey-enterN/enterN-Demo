import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PreferenceSlider from '@/components/preference-slider';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Preference categories
const categories = {
  "Mission & Vision": [
    { id: "purposeVsProfit", min: "Purpose-driven", max: "Profit-driven", tooltip: "Do you prefer a company focused on social impact or financial success?" },
    { id: "innovationVsTradition", min: "Innovation-focused", max: "Tradition-focused", tooltip: "Do you prefer cutting-edge approaches or proven methodologies?" },
    { id: "diversityVsPerformance", min: "Diversity-focused", max: "Performance-focused", tooltip: "Do you value workplace diversity or pure performance metrics more?" },
    { id: "cooperativeVsCompetitive", min: "Cooperative culture", max: "Competitive culture", tooltip: "Do you thrive in team-oriented or individual achievement environments?" },
    { id: "socialResponsibilityVsPragmatism", min: "Socially responsible", max: "Pragmatic", tooltip: "How important is corporate social responsibility to you?" },
  ],
  "Work Style Preferences": [
    { id: "logicalVsIntuitive", min: "Logical approach", max: "Intuitive approach", tooltip: "Do you prefer data-driven decisions or gut feelings?" },
    { id: "structureVsAmbiguity", min: "Clear structure", max: "Comfortable with ambiguity", tooltip: "Do you need defined processes or thrive in uncertainty?" },
    { id: "focusVsMultitasking", min: "Deep focus", max: "Multitasking", tooltip: "Do you prefer concentrating on one task or juggling multiple responsibilities?" },
    { id: "deadlinesVsFlexibility", min: "Strict deadlines", max: "Flexible timelines", tooltip: "How important are strict deadlines to your work style?" },
    { id: "checkInsVsAutonomy", min: "Regular check-ins", max: "Complete autonomy", tooltip: "How much supervision do you prefer in your work?" },
    { id: "provenVsExperimental", min: "Proven methods", max: "Experimental approaches", tooltip: "Do you prefer tried-and-true or innovative approaches?" },
    { id: "strictVsAdaptable", min: "Strict processes", max: "Adaptable workflows", tooltip: "How rigid or flexible do you like work processes to be?" },
    { id: "trainingVsIndependent", min: "Structured training", max: "Self-directed learning", tooltip: "How do you prefer to learn new skills?" },
    { id: "taskmasterVsHandsOff", min: "Directive management", max: "Hands-off management", tooltip: "What level of management involvement do you prefer?" },
  ],
  "Recognition & Growth": [
    { id: "publicVsPrivateRecognition", min: "Public recognition", max: "Private acknowledgment", tooltip: "How do you prefer to receive praise for your work?" },
    { id: "competitionVsCollaboration", min: "Competitive advancement", max: "Collaborative growth", tooltip: "Do you prefer competing or collaborating for advancement?" },
    { id: "boundariesVsAvailability", min: "Clear boundaries", max: "Always available", tooltip: "How do you prefer to separate work and personal life?" },
  ],
  "Workstation Preferences": [
    { id: "focusVsDistraction", min: "Distraction-free", max: "Stimulating environment", tooltip: "What type of physical work environment helps you perform best?" },
    { id: "soloVsCollaboration", min: "Individual workspace", max: "Collaborative space", tooltip: "Do you prefer working alone or in group settings?" },
    { id: "assignedVsFlexible", min: "Assigned desk", max: "Flexible seating", tooltip: "Do you prefer having your own dedicated space or flexibility?" },
    { id: "quietVsNoisy", min: "Quiet atmosphere", max: "Energetic atmosphere", tooltip: "What noise level helps you concentrate best?" },
    { id: "basicVsAmenities", min: "Basic necessities", max: "Luxury amenities", tooltip: "How important are workplace perks and amenities to you?" },
    { id: "separateVsSocial", min: "Separate work areas", max: "Social work areas", tooltip: "Do you prefer private work areas or social spaces?" },
  ],
  "Decision Making & Communication": [
    { id: "definedVsFluid", min: "Defined roles", max: "Fluid responsibilities", tooltip: "Do you prefer clearly defined or adaptable job responsibilities?" },
    { id: "dataVsStory", min: "Data-driven", max: "Narrative-focused", tooltip: "Do you prefer facts and figures or stories and context?" },
    { id: "formalVsInformal", min: "Formal communication", max: "Casual communication", tooltip: "What communication style do you prefer at work?" },
    { id: "preciseVsOpenEnded", min: "Precise instructions", max: "Open-ended guidance", tooltip: "How much detail do you need in instructions?" },
    { id: "structuredVsOpen", min: "Structured meetings", max: "Open discussions", tooltip: "How do you prefer meetings to be organized?" },
    { id: "decisiveVsDemocratic", min: "Quick decisions", max: "Consensus building", tooltip: "What decision-making approach do you prefer?" },
  ],
  "Career Progression": [
    { id: "steadyVsRapid", min: "Steady progression", max: "Rapid advancement", tooltip: "What pace of career growth do you prefer?" },
    { id: "tenureVsMerit", min: "Tenure-based promotion", max: "Merit-based promotion", tooltip: "How do you believe promotions should be determined?" },
    { id: "skillsVsTitles", min: "Skill development", max: "Title advancement", tooltip: "Do you value building skills or moving up in title?" },
    { id: "companyVsIndependent", min: "Company loyalty", max: "Independent growth", tooltip: "Do you prefer growing within one company or across multiple organizations?" },
    { id: "loyaltyVsAbility", min: "Loyalty recognition", max: "Performance recognition", tooltip: "Should loyalty or performance be more rewarded?" },
    { id: "recognitionVsPromotion", min: "Recognition", max: "Promotion", tooltip: "Which do you value more: recognition or promotion?" },
  ],
};

export default function JobseekerPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Mission & Vision");
  const [preferences, setPreferences] = useState<Record<string, number>>({});
  const [saveButtonText, setSaveButtonText] = useState("Save Preferences");
  
  // Get jobseeker profile
  const { data: profile } = useQuery({
    queryKey: ['/api/jobseeker/profile'],
    enabled: !!user,
  });
  
  // Get existing preferences if any
  const { data: existingPreferences, isLoading } = useQuery({
    queryKey: ['/api/jobseeker/preferences'],
    enabled: !!profile?.id,
  });
  
  // Initialize default preferences
  useEffect(() => {
    if (existingPreferences?.preferences) {
      setPreferences(existingPreferences.preferences);
    } else {
      // Default all preferences to middle (50)
      const defaultPrefs: Record<string, number> = {};
      Object.values(categories).flat().forEach(pref => {
        defaultPrefs[pref.id] = 50;
      });
      setPreferences(defaultPrefs);
    }
  }, [existingPreferences]);
  
  // Save preferences mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { jobseekerId: number; preferences: Record<string, number> }) => {
      console.log("Saving preferences for jobseeker profile:", data.jobseekerId);
      const res = await apiRequest(
        "POST",
        "/api/jobseeker/preferences",
        data
      );
      console.log("API response for POST /api/jobseeker/preferences:", {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers
      });
      console.log("API response body:", await res.json());
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobseeker/preferences'] });
      console.log("Preferences saved successfully");
      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated successfully.",
      });
      setSaveButtonText("Saved!");
      setTimeout(() => {
        setSaveButtonText("Save Preferences");
        setLocation('/jobseeker/dashboard'); // Redirect to dashboard after saving
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
      setSaveButtonText("Save Preferences");
    },
  });
  
  const handleSliderChange = (id: string, value: number) => {
    setPreferences(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSave = () => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "Profile information not found. Please complete your profile first.",
        variant: "destructive",
      });
      return;
    }
    
    setSaveButtonText("Saving...");
    saveMutation.mutate({
      jobseekerId: profile.id,
      preferences
    });
  };
  
  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-[#5ce1e6] border-r-[#5ce1e6] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation('/jobseeker/dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Work Style Preferences</h1>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-gray-600">
              Adjust these preferences to help us find the best employer matches for you.
              These preferences are anonymous and help us understand your ideal work environment.
            </p>
          </CardContent>
        </Card>
        
        {Object.entries(categories).map(([category, prefs]) => (
          <Card key={category} className="mb-4 overflow-hidden">
            <CardHeader 
              className={`bg-gray-50 hover:bg-gray-100 cursor-pointer py-3 border-b ${expandedCategory === category ? 'border-[#5ce1e6]' : 'border-gray-200'}`}
              onClick={() => toggleCategory(category)}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium text-gray-800">{category}</CardTitle>
                {expandedCategory === category ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
            
            {expandedCategory === category && (
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {prefs.map((pref, index) => (
                    <div key={pref.id}>
                      <PreferenceSlider
                        id={pref.id}
                        label={pref.id.split(/(?=[A-Z])/).join(" ")}
                        min={pref.min}
                        max={pref.max}
                        value={preferences[pref.id] || 50}
                        onChange={(value) => handleSliderChange(pref.id, value)}
                        tooltip={pref.tooltip}
                      />
                      {index < prefs.length - 1 && <Separator className="mt-6" />}
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
            onClick={() => setLocation('/jobseeker/dashboard')}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSave} 
            className="bg-[#5ce1e6] hover:bg-[#4bc0c5] text-white"
            disabled={saveMutation.isPending}
          >
            {saveButtonText === "Saved!" ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saveButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}