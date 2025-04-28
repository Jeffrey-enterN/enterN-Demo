import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// School information schema
const schoolInfoSchema = z.object({
  isStudent: z.boolean().optional(),
  schoolEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  school: z.string().optional().or(z.literal("")),
  degreeLevel: z.string().optional().or(z.literal("")),
  major: z.string().optional().or(z.literal("")),
});

type SchoolInfoFormData = z.infer<typeof schoolInfoSchema>;

interface SchoolInfoStepProps {
  profile: any;
  onNext: () => void;
}

export function SchoolInfoStep({ profile, onNext }: SchoolInfoStepProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  const form = useForm<SchoolInfoFormData>({
    resolver: zodResolver(schoolInfoSchema),
    defaultValues: {
      isStudent: profile?.isStudent || false,
      schoolEmail: profile?.schoolEmail || "",
      school: profile?.school || "",
      degreeLevel: profile?.degreeLevel || "",
      major: profile?.major || "",
    },
  });

  // Watch for changes to isStudent
  const watchIsStudent = form.watch("isStudent");

  // Update the state when the watched value changes
  useState(() => {
    if (watchIsStudent !== undefined) {
      setIsStudent(watchIsStudent);
    }
  });

  const profileMutation = useMutation({
    mutationFn: async (data: SchoolInfoFormData) => {
      const res = await apiRequest("PATCH", `/api/jobseeker/profile/${profile.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "School information updated",
        description: "Your school information has been saved.",
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

  const onSubmit = (data: SchoolInfoFormData) => {
    setIsSubmitting(true);
    profileMutation.mutate(data);
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="isStudent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setIsStudent(checked);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-medium">
                    I am a student or recent graduate
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          {isStudent && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input placeholder="University of California, Berkeley" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schoolEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Email (.edu)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@school.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </>
          )}
        </div>

        <div className="flex justify-end pt-4">
          {isStudent ? (
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
          ) : (
            <Button type="button" onClick={handleContinue}>
              Continue
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}