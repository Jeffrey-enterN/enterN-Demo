import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { insertJobseekerProfileSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";

// Extend the jobseeker profile schema with only essential fields for initial setup
const essentialProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  isStudent: z.boolean().default(false),
});

type EssentialProfileFormData = z.infer<typeof essentialProfileSchema>;

export default function SimpleProfileSetup() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EssentialProfileFormData>({
    resolver: zodResolver(essentialProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      isStudent: false,
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const res = await apiRequest("POST", "/api/jobseeker/profile", profileData);
      return await res.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Profile created",
        description: "Your basic profile has been saved successfully.",
      });
      
      // Store profile ID in localStorage as backup
      localStorage.setItem('jobseekerProfileId', result.id.toString());
      
      // Invalidate the profile query before redirecting
      queryClient.invalidateQueries({ queryKey: ["/api/jobseeker/profile"] });
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/jobseeker/dashboard";
      }, 500);
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast({
        title: "Error creating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EssentialProfileFormData) => {
    if (!user || !user.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a profile.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Add the user ID
    const profileData = {
      ...data,
      userId: user.id,
      // Add empty arrays for optional fields that should be arrays
      preferredIndustries: [],
      preferredLocations: [],
      preferredLocationTypes: [],
      preferredFunctionalAreas: [],
    };
    
    profileMutation.mutate(profileData);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-heading font-bold text-gray-900">Welcome to JobPair!</h1>
            <div className="text-sm font-medium text-gray-500">Getting Started</div>
          </div>
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
            <div 
              className="bg-primary-500 h-full rounded-full" 
              style={{ width: `33%` }}
            ></div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Let's get started</CardTitle>
                <CardDescription>
                  Tell us a little about yourself to create your basic profile. You can add more details later.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number <span className="text-gray-500 text-xs">(optional)</span></FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isStudent"
                  render={({ field }) => (
                    <FormItem className={`flex flex-row items-center justify-between rounded-lg border p-4 ${field.value ? 'bg-cyan-50 border-cyan-200' : ''}`}>
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Student Status</FormLabel>
                        <FormDescription>
                          {field.value 
                            ? "You've identified as a student. We'll tailor opportunities accordingly."
                            : "Are you currently a student? This helps us find student-specific opportunities."}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className={field.value ? 'data-[state=checked]:bg-[#5ce1e6]' : ''}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="ghost" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Continue to Dashboard"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    </div>
  );
}