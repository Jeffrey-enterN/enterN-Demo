import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ChevronLeft } from "lucide-react";

// Define the schema for career interests
const careerInterestsSchema = z.object({
  preferredIndustries: z.array(z.string()).min(1, "Select at least one industry"),
  preferredFunctionalAreas: z.array(z.string()).min(1, "Select at least one functional area"),
  preferredLocations: z.array(z.string()).min(1, "Select at least one location"),
  preferredLocationTypes: z.array(z.string()).min(1, "Select at least one location type"),
  minSalary: z.string().optional(),
});

type CareerInterestsFormData = z.infer<typeof careerInterestsSchema>;

interface CareerInterestsStepProps {
  onNext: () => void;
  onBack: () => void;
}

// Sample data for checkboxes
const industries = [
  "Technology", "Finance", "Healthcare", "Education", "Manufacturing",
  "Retail", "Hospitality", "Consulting", "Media", "Non-profit"
];

const functionalAreas = [
  "Software Engineering", "Data Science", "Product Management", "Design",
  "Marketing", "Sales", "Customer Support", "Human Resources", "Finance",
  "Operations"
];

const locations = [
  "San Francisco Bay Area", "New York", "Boston", "Seattle", "Austin",
  "Chicago", "Los Angeles", "Denver", "Atlanta", "Washington DC"
];

const locationTypes = [
  "On-site", "Remote", "Hybrid"
];

export function CareerInterestsStep({ onNext, onBack }: CareerInterestsStepProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get existing profile data
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["/api/jobseeker/profile"],
    queryFn: async () => {
      const res = await fetch("/api/jobseeker/profile");
      if (!res.ok) {
        return null;
      }
      return await res.json();
    },
  });

  const form = useForm<CareerInterestsFormData>({
    resolver: zodResolver(careerInterestsSchema),
    defaultValues: {
      preferredIndustries: profile?.preferredIndustries || [],
      preferredFunctionalAreas: profile?.preferredFunctionalAreas || [],
      preferredLocations: profile?.preferredLocations || [],
      preferredLocationTypes: profile?.preferredLocationTypes || [],
      minSalary: profile?.minSalary || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: CareerInterestsFormData) => {
      const res = await apiRequest("PATCH", "/api/jobseeker/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Career interests updated",
        description: "Your career interests have been saved successfully.",
      });
      
      // Invalidate the profile query before proceeding
      queryClient.invalidateQueries({ queryKey: ["/api/jobseeker/profile"] });
      
      // Go to next step
      onNext();
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast({
        title: "Error updating career interests",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CareerInterestsFormData) => {
    setIsSubmitting(true);
    updateProfileMutation.mutate(data);
  };

  // If still loading the profile data, show a loading state
  if (isProfileLoading) {
    return (
      <CardContent className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2 text-gray-500">Loading your profile data...</p>
      </CardContent>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Career Interests</CardTitle>
        <CardDescription>
          Tell us what you're looking for to help us match you with the right opportunities.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            {/* Preferred Industries */}
            <FormField
              control={form.control}
              name="preferredIndustries"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Preferred Industries</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {industries.map((industry) => (
                      <FormField
                        key={industry}
                        control={form.control}
                        name="preferredIndustries"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={industry}
                              className="flex items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(industry)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, industry])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== industry
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {industry}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Functional Areas */}
            <FormField
              control={form.control}
              name="preferredFunctionalAreas"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Preferred Functional Areas</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {functionalAreas.map((area) => (
                      <FormField
                        key={area}
                        control={form.control}
                        name="preferredFunctionalAreas"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={area}
                              className="flex items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(area)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, area])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== area
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {area}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Locations */}
            <FormField
              control={form.control}
              name="preferredLocations"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Preferred Locations</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {locations.map((location) => (
                      <FormField
                        key={location}
                        control={form.control}
                        name="preferredLocations"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={location}
                              className="flex items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(location)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, location])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== location
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {location}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Location Types */}
            <FormField
              control={form.control}
              name="preferredLocationTypes"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Preferred Work Arrangements</FormLabel>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {locationTypes.map((type) => (
                      <FormField
                        key={type}
                        control={form.control}
                        name="preferredLocationTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={type}
                              className="flex items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(type)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, type])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== type
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {type}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Minimum Salary */}
            <FormField
              control={form.control}
              name="minSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Annual Salary</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 75000" 
                      {...field} 
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Continue to Next Step"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
}