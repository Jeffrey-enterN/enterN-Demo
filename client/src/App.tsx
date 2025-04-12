import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import EmployerProfileSetup from "@/pages/employer/profile-setup";
import EmployerJobPosting from "@/pages/employer/job-posting";
import EmployerMatchFeed from "@/pages/employer/match-feed";
import JobseekerProfileSetup from "@/pages/jobseeker/profile-setup";
import JobseekerPreferences from "@/pages/jobseeker/preferences";
import JobseekerMatchFeed from "@/pages/jobseeker/match-feed";
import JobInterest from "@/pages/shared/job-interest";
import DemoCard from "@/pages/demo-card";
import { AuthProvider } from "@/contexts/auth-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";

// This is a very simple component that just renders the routes
function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Employer Routes - Protected */}
      <ProtectedRoute path="/employer/profile-setup" component={EmployerProfileSetup} />
      <ProtectedRoute path="/employer/job-posting" component={EmployerJobPosting} />
      <ProtectedRoute path="/employer/match-feed" component={EmployerMatchFeed} />
      
      {/* Jobseeker Routes - Protected */}
      <ProtectedRoute path="/jobseeker/profile-setup" component={JobseekerProfileSetup} />
      <ProtectedRoute path="/jobseeker/preferences" component={JobseekerPreferences} />
      <ProtectedRoute path="/jobseeker/match-feed" component={JobseekerMatchFeed} />
      
      {/* Shared Routes - Protected */}
      <ProtectedRoute path="/job-interest/:matchId" component={JobInterest} />
      
      {/* Demo Routes - Not Protected */}
      <Route path="/demo-card" component={DemoCard} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App component with provider setup
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
