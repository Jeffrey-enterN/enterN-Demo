import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { insertJobPostingSchema, EmploymentTypeEnum, LocationTypeEnum } from "@shared/schema";
import { Loader2 } from "lucide-react";

// Extend the job posting schema with validation
const jobPostingSchema = insertJobPostingSchema.extend({
  title: z.string().min(1, "Job title is required"),
  function: z.string().min(1, "Job function is required"),
  type: z.nativeEnum(EmploymentTypeEnum, {
    errorMap: () => ({ message: "Please select a job type" }),
  }),
  location: z.string().min(1, "Job location is required"),
  locationType: z.nativeEnum(LocationTypeEnum, {
    errorMap: () => ({ message: "Please select a location type" }),
  }),
  description: z.string().min(20, "Job description must be at least 20 characters"),
  responsibilities: z.string().min(20, "Job responsibilities must be at least 20 characters"),
});

type JobPostingFormData = z.infer<typeof jobPostingSchema>;

export default function EmployerJobPosting() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<number>(66);

  // Get employer profile
  const { data: employerProfile } = useQuery({
    queryKey: ["/api/employer/profile"],
    enabled: !!user,
  });

  const form = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: "",
      function: "",
      type: undefined,
      location: "",
      locationType: undefined,
      description: "",
      responsibilities: "",
    },
  });

  const jobPostingMutation = useMutation({
    mutationFn: async (data: JobPostingFormData) => {
      const res = await apiRequest("POST", "/api/job-postings", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Job posting created",
        description: "Your job posting has been created successfully.",
      });
      
      // Redirect to employer dashboard
      setLocation("/employer/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating job posting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JobPostingFormData) => {
    jobPostingMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-heading font-bold text-gray-900">Job Posting</h1>
            <div className="text-sm font-medium text-gray-500">Step 2 of 3</div>
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
                <CardTitle>Job Posting</CardTitle>
                <CardDescription>
                  Create a new job posting to connect with potential candidates.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="function"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Function</FormLabel>
                      <FormControl>
                        <Input placeholder="Engineering" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={EmploymentTypeEnum.FULL_TIME}>Full-time</SelectItem>
                          <SelectItem value={EmploymentTypeEnum.PART_TIME}>Part-time</SelectItem>
                          <SelectItem value={EmploymentTypeEnum.CONTRACT}>Contract</SelectItem>
                          <SelectItem value={EmploymentTypeEnum.INTERNSHIP}>Internship</SelectItem>
                          <SelectItem value={EmploymentTypeEnum.ENTRY_LEVEL}>Entry-Level</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={LocationTypeEnum.ONSITE}>On-site</SelectItem>
                          <SelectItem value={LocationTypeEnum.HYBRID}>Hybrid</SelectItem>
                          <SelectItem value={LocationTypeEnum.REMOTE}>Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About The Role</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the job role, its purpose, and the ideal candidate..." 
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
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the key responsibilities and day-to-day activities..." 
                          className="resize-none" 
                          rows={4} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="bg-gray-50 flex justify-between">
                <Button 
                  variant="outline" 
                  type="button"
                  className="border-brand-pink text-brand-pink hover:bg-brand-pink-light"
                  onClick={() => setLocation("/employer/profile-setup")}
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  style={{background: "#ff66c4", color: "white"}}
                  className="hover:bg-brand-pink-dark"
                  disabled={jobPostingMutation.isPending}
                >
                  {jobPostingMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Create Job Posting
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    </div>
  );
}
