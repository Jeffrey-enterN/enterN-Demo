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
import { insertJobseekerProfileSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";

// Extend the jobseeker profile schema with validation
const jobseekerProfileSchema = insertJobseekerProfileSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  summary: z.string().optional(),
  school: z.string().optional(),
  degreeLevel: z.string().optional(),
  major: z.string().optional(),
  preferredIndustries: z.array(z.string()).optional(),
  preferredLocations: z.array(z.string()).optional(),
});

type JobseekerProfileFormData = z.infer<typeof jobseekerProfileSchema>;

export default function JobseekerProfileSetup() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<number>(33);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const form = useForm<JobseekerProfileFormData>({
    resolver: zodResolver(jobseekerProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      summary: "",
      school: "",
      degreeLevel: "",
      major: "",
      preferredIndustries: [],
      preferredLocations: [],
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      console.log("Profile mutation called with:", profileData);
      
      try {
        const res = await apiRequest("POST", "/api/jobseeker/profile", profileData);
        console.log("Server response:", res);
        return await res.json();
      } catch (error) {
        console.error("Error submitting profile:", error);
        throw error;
      }
    },
    onSuccess: (result) => {
      console.log("Profile created successfully:", result);
      
      toast({
        title: "Profile created",
        description: "Your profile has been saved successfully.",
      });
      
      try {
        // Store profile ID in localStorage as backup
        localStorage.setItem('jobseekerProfileId', result.id.toString());
        console.log("Saved profile ID to localStorage:", result.id);
        
        // Invalidate the profile query before redirecting
        queryClient.invalidateQueries({ queryKey: ["/api/jobseeker/profile"] });
        
        // Add a small delay to ensure cache is cleared before redirect
        setTimeout(() => {
          console.log("Redirecting to preferences page...");
          // Use direct window.location for more reliable navigation
          window.location.href = "/jobseeker/preferences";
        }, 1000);
      } catch (error) {
        console.error("Navigation error:", error);
        // Fallback direct navigation
        alert("Profile created. Click OK to continue to preferences page.");
        window.location.href = "/jobseeker/preferences";
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JobseekerProfileFormData) => {
    console.log("********************************************");
    console.log("FORM SUBMISSION TRIGGERED");
    console.log("Form data:", data);
    console.log("Form errors:", form.formState.errors);
    console.log("Selected industries:", selectedIndustries);
    console.log("Selected locations:", selectedLocations);
    console.log("User:", user);
    console.log("********************************************");
    
    if (!user || !user.id) {
      console.error("User not found or missing user ID");
      toast({
        title: "Error",
        description: "You must be logged in to create a profile.",
        variant: "destructive",
      });
      return;
    }
    
    // Add the user ID and selected data
    const profileData = {
      ...data,
      userId: user.id, // Now we're sure user.id exists
      preferredIndustries: selectedIndustries || [],
      preferredLocations: (selectedLocations || []).map(loc => loc.trim()),
    };
    
    console.log("Complete profile data to submit:", profileData);
    
    try {
      // This will trigger the mutationFn and onSuccess/onError handlers
      profileMutation.mutate(profileData);
      
      console.log("Mutation triggered successfully");
    } catch (error) {
      console.error("Error triggering mutation:", error);
    }
  };

  const handleIndustrySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.options;
    const values: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setSelectedIndustries(values);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLocations(event.target.value.split(';'));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-heading font-bold text-gray-900">Profile Setup</h1>
            <div className="text-sm font-medium text-gray-500">Step 1 of 3</div>
          </div>
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
            <div 
              className="bg-primary-500 h-full rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  This information will be shared with employers after a match.
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Summary</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe your skills, experience, and career goals..." 
                          className="resize-none" 
                          rows={4} 
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
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School</FormLabel>
                        <FormControl>
                          <Input placeholder="University of California, Berkeley" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="degreeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level of Degree</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select degree" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="associates">Associate's</SelectItem>
                            <SelectItem value="bachelors">Bachelor's</SelectItem>
                            <SelectItem value="masters">Master's</SelectItem>
                            <SelectItem value="doctorate">Doctorate</SelectItem>
                            <SelectItem value="certificate">Certificate</SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="major"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Major</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label htmlFor="preferred-industries">Industries of Interest</Label>
                  <select 
                    id="preferred-industries" 
                    multiple 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition mt-1"
                    onChange={handleIndustrySelect}
                    size={10}
                  >
                    <option value="11">Agriculture, Forestry, Fishing & Hunting</option>
                    <option value="21">Mining, Quarrying, Oil & Gas</option>
                    <option value="22">Utilities</option>
                    <option value="23">Construction</option>
                    <option value="31">Manufacturing</option>
                    <option value="41">Wholesale Trade</option>
                    <option value="44">Retail Trade</option>
                    <option value="48">Transportation & Warehousing</option>
                    <option value="51">Information</option>
                    <option value="52">Finance & Insurance</option>
                    <option value="53">Real Estate, Renting & Leasing</option>
                    <option value="54">Professional, Scientific & Technical Services</option>
                    <option value="55">Management of Companies & Enterprises</option>
                    <option value="56a">Administrative Support</option>
                    <option value="56b">Waste Management & Remediation</option>
                    <option value="61">Educational Services</option>
                    <option value="62">Health Care & Social Assistance</option>
                    <option value="71">Arts, Entertainment & Recreation</option>
                    <option value="72">Accommodation & Food Services</option>
                    <option value="81">Public Administration</option>
                    <option value="99">Other</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple industries</p>
                </div>

                <div>
                  <Label htmlFor="preferred-locations">Preferred Locations</Label>
                  <Input 
                    id="preferred-locations" 
                    placeholder="San Francisco, CA; New York, NY; Remote" 
                    className="mt-1"
                    onChange={handleLocationChange}
                  />
                  <p className="mt-1 text-xs text-gray-500">Separate locations with semicolons (;)</p>
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50 flex justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    console.log("Test navigation button clicked");
                    window.location.href = "/jobseeker/preferences";
                  }}
                >
                  Test Direct Navigation
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={profileMutation.isPending}
                  onClick={() => console.log("Submit button clicked - this should trigger form submit")}
                >
                  {profileMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Continue to Preferences
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    </div>
  );
}
