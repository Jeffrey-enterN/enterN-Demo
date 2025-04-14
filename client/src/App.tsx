import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import EmployerProfileSetup from "@/pages/employer/profile-setup";
import EmployerJobPosting from "@/pages/employer/job-posting";
import EmployerMatchFeed from "@/pages/employer/match-feed";
import EmployerMatchesPage from "@/pages/employer/matches-page";
import EmployerAnalyticsDashboard from "@/pages/employer/analytics-dashboard";
import JobseekerProfileSetup from "@/pages/jobseeker/profile-setup";
import JobseekerPreferences from "@/pages/jobseeker/preferences";
import JobseekerMatchFeed from "@/pages/jobseeker/match-feed";
import JobseekerEmployerFeed from "@/pages/jobseeker/employer-feed";
import JobseekerMatchesPage from "@/pages/jobseeker/matches-page";
import JobInterest from "@/pages/shared/job-interest";
import DemoCard from "@/pages/demo-card";
import DemoMatchFeed from "@/pages/demo-match-feed";
import DemoEmployerFeed from "@/pages/demo-employer-feed";
import DemoMatchesPage from "@/pages/demo-matches-page";
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
      <ProtectedRoute path="/employer/matches" component={EmployerMatchesPage} />
      
      {/* Jobseeker Routes - Protected */}
      <ProtectedRoute path="/jobseeker/profile-setup" component={JobseekerProfileSetup} />
      <ProtectedRoute path="/jobseeker/preferences" component={JobseekerPreferences} />
      <ProtectedRoute path="/jobseeker/match-feed" component={JobseekerMatchFeed} />
      <ProtectedRoute path="/jobseeker/employer-feed" component={JobseekerEmployerFeed} />
      <ProtectedRoute path="/jobseeker/matches" component={JobseekerMatchesPage} />
      
      {/* Shared Routes - Protected */}
      <ProtectedRoute path="/job-interest/:matchId" component={JobInterest} />
      
      {/* Demo Routes - Not Protected */}
      <Route path="/demo-card" component={DemoCard} />
      <Route path="/demo-match-feed" component={DemoMatchFeed} />
      <Route path="/demo-employer-feed" component={DemoEmployerFeed} />
      <Route path="/demo-matches" component={DemoMatchesPage} />
      
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
