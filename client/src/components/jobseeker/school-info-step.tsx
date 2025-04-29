import { useState, useEffect } from "react";
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
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Define the schema for school information
const schoolInfoSchema = z.object({
  isStudent: z.boolean().default(false),
  school: z.string().optional(),
  degreeType: z.string().optional(),
  major: z.string().optional(),
  schoolEmail: z.string().optional().refine(val => {
    if (!val) return true;
    return val.includes('@') && val.includes('.edu');
  }, { message: "Please enter a valid .edu email address" }),
});

type SchoolInfoFormData = z.infer<typeof schoolInfoSchema>;

interface SchoolInfoStepProps {
  onNext: () => void;
}

export function SchoolInfoStep({ onNext }: SchoolInfoStepProps) {
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

  const form = useForm<SchoolInfoFormData>({
    resolver: zodResolver(schoolInfoSchema),
    defaultValues: {
      isStudent: profile?.isStudent || false,
      school: profile?.school || "",
      degreeType: profile?.degreeType || "",
      major: profile?.major || "",
      schoolEmail: profile?.schoolEmail || "",
    },
  });

  // Watch for changes to the isStudent field
  const isStudent = form.watch("isStudent");

  const updateProfileMutation = useMutation({
    mutationFn: async (data: SchoolInfoFormData) => {
      const res = await apiRequest("PATCH", "/api/jobseeker/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "School information updated",
        description: "Your school information has been saved successfully.",
      });
      
      // Invalidate the profile query before proceeding
      queryClient.invalidateQueries({ queryKey: ["/api/jobseeker/profile"] });
      
      // Go to next step
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

  const onSubmit = (data: SchoolInfoFormData) => {
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
        <CardTitle>School Information</CardTitle>
        <CardDescription>
          Tell us about your educational background to help us find relevant opportunities.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Student Toggle */}
            <FormField
              control={form.control}
              name="isStudent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Student Status</FormLabel>
                    <FormDescription>
                      Are you a student or recent graduate with an active .edu email address?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Educational Info - Only shown if isStudent is true */}
            {isStudent && (
              <div className="space-y-6 border-t pt-6">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/University</FormLabel>
                      <FormControl>
                        <Input placeholder="University of California, Berkeley" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="degreeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select degree type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                            <SelectItem value="Master's">Master's</SelectItem>
                            <SelectItem value="PhD">PhD</SelectItem>
                            <SelectItem value="Associate's">Associate's</SelectItem>
                            <SelectItem value="Certificate">Certificate</SelectItem>
                            <SelectItem value="High School">High School</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Major/Field of Study</FormLabel>
                        <FormControl>
                          <Input placeholder="Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="schoolEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="student@university.edu" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be used for school verification
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end">
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