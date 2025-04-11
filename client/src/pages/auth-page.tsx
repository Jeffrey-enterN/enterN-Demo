import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiGoogle, SiApple, SiLinkedin } from "react-icons/si";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserRoleEnum } from "@shared/schema";

// Form schemas with validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(UserRoleEnum, {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [_, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: undefined, 
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-heading font-extrabold text-gradient-brand">enterN</h1>
            <p className="mt-2 text-gray-600">Connect with the right opportunities</p>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="name@company.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input 
                            id="remember-me" 
                            type="checkbox" 
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <Label htmlFor="remember-me" className="text-sm text-gray-700">Remember me</Label>
                        </div>
                        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                          Forgot password?
                        </a>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Log In
                      </Button>
                    </form>
                  </Form>

                  <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" size="icon" className="w-full">
                      <SiGoogle className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-full">
                      <SiApple className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-full">
                      <SiLinkedin className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="name@company.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>I am a:</FormLabel>
                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                type="button"
                                variant={field.value === UserRoleEnum.JOBSEEKER ? "default" : "outline"}
                                className={field.value === UserRoleEnum.JOBSEEKER 
                                  ? "border-2 border-brand-cyan shadow-md"
                                  : "hover:border-brand-cyan hover:border-opacity-50 transition-all"}
                                onClick={() => registerForm.setValue("role", UserRoleEnum.JOBSEEKER)}
                                style={field.value === UserRoleEnum.JOBSEEKER ? {background: 'var(--brand-cyan-light)'} : {}}
                              >
                                Job Seeker
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === UserRoleEnum.EMPLOYER ? "default" : "outline"}
                                className={field.value === UserRoleEnum.EMPLOYER 
                                  ? "border-2 border-brand-deepPink shadow-md" 
                                  : "hover:border-brand-deepPink hover:border-opacity-50 transition-all"}
                                onClick={() => registerForm.setValue("role", UserRoleEnum.EMPLOYER)}
                                style={field.value === UserRoleEnum.EMPLOYER ? {background: 'var(--brand-deepPink-light)'} : {}}
                              >
                                Employer
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Sign Up
                      </Button>
                    </form>
                  </Form>

                  <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" size="icon" className="w-full">
                      <SiGoogle className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-full">
                      <SiApple className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-full">
                      <SiLinkedin className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Column - Hero Section */}
      <div className="hidden md:block md:w-1/2" style={{background: "linear-gradient(135deg, rgba(0, 255, 255, 0.85), rgba(255, 20, 147, 0.85))"}}>
        <div className="h-full flex flex-col justify-center px-8 lg:px-16 relative">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-6 drop-shadow-md">
            Find the perfect match for your career journey
          </h2>
          <p className="text-lg text-white mb-8 drop-shadow">
            Connect with employers or talent using our innovative matching system. No more wasted time on irrelevant applications.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white flex items-center justify-center mr-3">
                <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">Matching based on skills, preferences and company culture</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white flex items-center justify-center mr-3">
                <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">Direct communication with potential employers or candidates</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white flex items-center justify-center mr-3">
                <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">Privacy controls to help manage your job search discreetly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
