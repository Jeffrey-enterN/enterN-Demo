import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useEffect, useState } from "react";
import { getAuthState, isLikelyLoggedIn } from "@/lib/authUtils";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  // Check for auth state in localStorage as fallback mechanism
  useEffect(() => {
    if (user) {
      // If user is already in auth context, they're authorized
      setIsAuthorized(true);
      return;
    }
    
    // Try to get auth state from localStorage using our utility functions
    try {
      const savedAuth = getAuthState();
      if (savedAuth && isLikelyLoggedIn()) {
        console.log("Found valid auth state:", savedAuth);
        console.log("User is authorized from localStorage state");
        setIsAuthorized(true);
        return;
      }
      
      // No valid auth state found
      console.log("No valid auth state found, not authorized");
      setIsAuthorized(false);
    } catch (error) {
      console.error("Error checking auth state:", error);
      setIsAuthorized(false);
    }
  }, [user]);

  // Show loading if we're still determining auth state
  if (isLoading || isAuthorized === null) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }
  
  // If not authorized, redirect to auth page
  if (!isAuthorized && !user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }
  
  // Otherwise render the protected component
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}
