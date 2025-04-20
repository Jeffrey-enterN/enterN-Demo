import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import EmployerProfileSetup from "@/pages/employer/profile-setup";
import EmployerJobPosting from "@/pages/employer/job-posting";
import EmployerDashboard from "@/pages/employer/dashboard";
import EmployerMatchFeed from "@/pages/employer/match-feed";
import EmployerMatchesPage from "@/pages/employer/matches-page";
import EmployerAnalyticsDashboard from "@/pages/employer/analytics-dashboard";
import PrioritySliders from "@/pages/employer/priority-sliders";
import JobseekerProfileSetup from "@/pages/jobseeker/profile-setup";
import JobseekerPreferences from "@/pages/jobseeker/preferences";
import JobseekerDashboard from "@/pages/jobseeker/dashboard";
import JobseekerMatchFeed from "@/pages/jobseeker/match-feed";
import JobseekerEmployerFeed from "@/pages/jobseeker/employer-feed";
import JobseekerMatchesPage from "@/pages/jobseeker/matches-page";
import JobseekerSecondLook from "@/pages/jobseeker/second-look";
import JobInterest from "@/pages/shared/job-interest";
import MessagesPage from "@/pages/shared/messages-page";
import DemoCard from "@/pages/demo-card";
import DemoMatchFeed from "@/pages/demo-match-feed";
import DemoEmployerFeed from "@/pages/demo-employer-feed";
import DemoMatchesPage from "@/pages/demo-matches-page";
import { AuthProvider } from "@/contexts/auth-context";
import { MascotProvider } from "@/contexts/mascot-context";
import { CatMascot } from "@/components/cat-mascot";
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
      <ProtectedRoute path="/employer/dashboard" component={EmployerDashboard} />
      <ProtectedRoute path="/employer/profile-setup" component={EmployerProfileSetup} />
      <ProtectedRoute path="/employer/job-posting" component={EmployerJobPosting} />
      <ProtectedRoute path="/employer/match-feed" component={EmployerMatchFeed} />
      <ProtectedRoute path="/employer/matches" component={EmployerMatchesPage} />
      <ProtectedRoute path="/employer/analytics" component={EmployerAnalyticsDashboard} />
      <ProtectedRoute path="/employer/priority-sliders" component={PrioritySliders} />
      
      {/* Jobseeker Routes - Protected */}
      <ProtectedRoute path="/jobseeker/dashboard" component={JobseekerDashboard} />
      <ProtectedRoute path="/jobseeker/profile-setup" component={JobseekerProfileSetup} />
      <ProtectedRoute path="/jobseeker/preferences" component={JobseekerPreferences} />
      <ProtectedRoute path="/jobseeker/match-feed" component={JobseekerMatchFeed} />
      <ProtectedRoute path="/jobseeker/employer-feed" component={JobseekerEmployerFeed} />
      <ProtectedRoute path="/jobseeker/matches" component={JobseekerMatchesPage} />
      <ProtectedRoute path="/jobseeker/second-look" component={JobseekerSecondLook} />
      
      {/* Shared Routes - Protected */}
      <ProtectedRoute path="/job-interest/:matchId" component={JobInterest} />
      <ProtectedRoute path="/messages" component={MessagesPage} />
      
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
        <MascotProvider>
          <AppRoutes />
          {/* Cat mascot will only appear on jobseeker routes */}
          <CatMascot />
          <Toaster />
        </MascotProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
