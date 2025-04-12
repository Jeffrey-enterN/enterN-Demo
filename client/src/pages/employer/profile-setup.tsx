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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertEmployerProfileSchema } from "@shared/schema";
import { Loader2, Upload } from "lucide-react";

// Extend the employer profile schema with validation
const employerProfileSchema = insertEmployerProfileSchema.extend({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  headquarters: z.string().min(1, "Headquarters location is required"),
  employeeCount: z.string().min(1, "Number of employees is required"),
  yearFounded: z.string().transform(val => parseInt(val, 10)).refine(
    val => !isNaN(val) && val > 1900 && val <= new Date().getFullYear(),
    `Year must be between 1900 and ${new Date().getFullYear()}`
  ),
});

type EmployerProfileFormData = z.infer<typeof employerProfileSchema>;

export default function EmployerProfileSetup() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<number>(33);

  const form = useForm<EmployerProfileFormData>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      headquarters: "",
      additionalOffices: "",
      employeeCount: "",
      yearFounded: String(new Date().getFullYear()),
      about: "",
      missionValues: "",
      perksAndBenefits: "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: EmployerProfileFormData) => {
      // Add the user ID
      const profileData = {
        ...data,
        userId: user?.id,
      };
      
      const res = await apiRequest("POST", "/api/employer/profile", profileData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile created",
        description: "Your company profile has been saved successfully.",
      });
      
      // Redirect to job posting page
      setLocation("/employer/job-posting");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmployerProfileFormData) => {
    profileMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-heading font-bold text-gray-900">Company Profile Setup</h1>
            <div className="text-sm font-medium text-gray-500">Step 1 of 3</div>
          </div>
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full" 
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--brand-pink), var(--brand-pink-medium))" }}
            ></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Primary Company Information</CardTitle>
                <CardDescription>
                  This information will be displayed on your public profile.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="company-logo">Company Logo</Label>
                  <div className="flex items-center mt-1">
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-300 mr-4">
                      <Upload className="h-8 w-8" style={{color: "#ff66c4"}} />
                    </div>
                    <Button variant="outline" type="button" className="border-brand-pink text-brand-pink hover:bg-brand-pink-light">
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="headquarters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headquarters Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalOffices"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Offices (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="San Francisco, CA; New York, NY; London, UK" 
                            className="resize-none" 
                            rows={2} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="employeeCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Employees</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10</SelectItem>
                              <SelectItem value="11-50">11-50</SelectItem>
                              <SelectItem value="51-200">51-200</SelectItem>
                              <SelectItem value="201-500">201-500</SelectItem>
                              <SelectItem value="501-1000">501-1,000</SelectItem>
                              <SelectItem value="1001-5000">1,001-5,000</SelectItem>
                              <SelectItem value="5001+">5,001+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearFounded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Founded</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2010" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell potential candidates about your company..." 
                            className="resize-none" 
                            rows={4} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="missionValues"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission & Values</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your company's mission and core values..." 
                            className="resize-none" 
                            rows={3} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="perksAndBenefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perks & Benefits</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List the perks and benefits your company offers..." 
                            className="resize-none" 
                            rows={3} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50 flex justify-end">
                <Button 
                  type="submit"
                  style={{background: "#ff66c4", color: "white"}}
                  className="hover:bg-brand-pink-dark"
                  disabled={profileMutation.isPending}
                >
                  {profileMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Continue to Job Postings
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    </div>
  );
}
