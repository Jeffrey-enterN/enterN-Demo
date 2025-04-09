import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import EmployerProfileSetup from "@/pages/employer/profile-setup";
import EmployerJobPosting from "@/pages/employer/job-posting";
import EmployerMatchFeed from "@/pages/employer/match-feed";
import JobseekerProfileSetup from "@/pages/jobseeker/profile-setup";
import JobseekerPreferences from "@/pages/jobseeker/preferences";
import JobseekerMatchFeed from "@/pages/jobseeker/match-feed";
import JobInterest from "@/pages/shared/job-interest";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Employer Routes */}
      <ProtectedRoute path="/employer/profile-setup" component={EmployerProfileSetup} />
      <ProtectedRoute path="/employer/job-posting" component={EmployerJobPosting} />
      <ProtectedRoute path="/employer/match-feed" component={EmployerMatchFeed} />
      
      {/* Jobseeker Routes */}
      <ProtectedRoute path="/jobseeker/profile-setup" component={JobseekerProfileSetup} />
      <ProtectedRoute path="/jobseeker/preferences" component={JobseekerPreferences} />
      <ProtectedRoute path="/jobseeker/match-feed" component={JobseekerMatchFeed} />
      
      {/* Shared Routes */}
      <ProtectedRoute path="/job-interest/:matchId" component={JobInterest} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
