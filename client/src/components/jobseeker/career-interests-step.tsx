import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ChevronLeft } from "lucide-react";

// Career interests schema
const careerInterestsSchema = z.object({
  preferredIndustries: z.array(z.string()).optional(),
  preferredFunctionalAreas: z.array(z.string()).optional(),
  preferredLocations: z.array(z.string()).optional(),
  preferredLocationTypes: z.array(z.string()).optional(),
  preferredFunctionalArea: z.string().optional(),
});

type CareerInterestsFormData = z.infer<typeof careerInterestsSchema>;

interface CareerInterestsStepProps {
  profile: any;
  onNext: () => void;
  onBack: () => void;
}

const industries = [
  { id: "tech", label: "Technology" },
  { id: "finance", label: "Finance" },
  { id: "healthcare", label: "Healthcare" },
  { id: "education", label: "Education" },
  { id: "retail", label: "Retail" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "consulting", label: "Consulting" },
  { id: "media", label: "Media & Entertainment" },
  { id: "nonprofit", label: "Nonprofit" },
  { id: "government", label: "Government" },
];

const functionalAreas = [
  { id: "software-development", label: "Software Development" },
  { id: "data-science", label: "Data Science" },
  { id: "product-management", label: "Product Management" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "customer-success", label: "Customer Success" },
  { id: "finance", label: "Finance" },
  { id: "hr", label: "Human Resources" },
  { id: "operations", label: "Operations" },
];

const locationTypes = [
  { id: "on-site", label: "On-site" },
  { id: "hybrid", label: "Hybrid" },
  { id: "remote", label: "Remote" },
];

export function CareerInterestsStep({ profile, onNext, onBack }: CareerInterestsStepProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    profile?.preferredIndustries || []
  );
  const [selectedFunctionalAreas, setSelectedFunctionalAreas] = useState<string[]>(
    profile?.preferredFunctionalAreas || []
  );
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>(
    profile?.preferredLocationTypes || []
  );

  const form = useForm<CareerInterestsFormData>({
    resolver: zodResolver(careerInterestsSchema),
    defaultValues: {
      preferredIndustries: profile?.preferredIndustries || [],
      preferredFunctionalAreas: profile?.preferredFunctionalAreas || [],
      preferredLocations: profile?.preferredLocations || [],
      preferredLocationTypes: profile?.preferredLocationTypes || [],
      preferredFunctionalArea: profile?.preferredFunctionalArea || "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: CareerInterestsFormData) => {
      const res = await apiRequest("PATCH", `/api/jobseeker/profile/${profile.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Career interests updated",
        description: "Your career interests have been saved.",
      });
      
      // Invalidate the profile query
      queryClient.invalidateQueries({ queryKey: ["/api/jobseeker/profile"] });
      
      // Move to the next step
      onNext();
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CareerInterestsFormData) => {
    setIsSubmitting(true);
    
    const updatedData = {
      ...data,
      preferredIndustries: selectedIndustries,
      preferredFunctionalAreas: selectedFunctionalAreas,
      preferredLocationTypes: selectedLocationTypes,
    };
    
    profileMutation.mutate(updatedData);
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      setSelectedIndustries((prev) => [...prev, industry]);
    } else {
      setSelectedIndustries((prev) => prev.filter((i) => i !== industry));
    }
  };

  const handleFunctionalAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      setSelectedFunctionalAreas((prev) => [...prev, area]);
    } else {
      setSelectedFunctionalAreas((prev) => prev.filter((a) => a !== area));
    }
  };

  const handleLocationTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedLocationTypes((prev) => [...prev, type]);
    } else {
      setSelectedLocationTypes((prev) => prev.filter((t) => t !== type));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {/* Industries */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Industries of Interest</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industries.map((industry) => (
                <div key={industry.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry.id}`}
                    checked={selectedIndustries.includes(industry.id)}
                    onCheckedChange={(checked) => 
                      handleIndustryChange(industry.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`industry-${industry.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {industry.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Functional Areas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Functional Areas of Interest</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {functionalAreas.map((area) => (
                <div key={area.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`area-${area.id}`}
                    checked={selectedFunctionalAreas.includes(area.id)}
                    onCheckedChange={(checked) => 
                      handleFunctionalAreaChange(area.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`area-${area.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {area.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Location */}
          <div>
            <FormField
              control={form.control}
              name="preferredLocations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Locations</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="San Francisco, New York, London (separate with commas)" 
                      value={field.value?.join(", ")} 
                      onChange={(e) => {
                        const locations = e.target.value.split(",").map(loc => loc.trim());
                        field.onChange(locations);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location Types */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Preferred Location Type</h3>
            <div className="flex flex-wrap gap-3">
              {locationTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={selectedLocationTypes.includes(type.id)}
                    onCheckedChange={(checked) => 
                      handleLocationTypeChange(type.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`type-${type.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Functional Area */}
          <FormField
            control={form.control}
            name="preferredFunctionalArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Functional Area</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Software Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}