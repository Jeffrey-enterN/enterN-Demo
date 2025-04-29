import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser, UserRoleEnum } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { saveAuthState, clearAuthState, getAuthState, isLikelyLoggedIn } from "@/lib/authUtils";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  role: typeof UserRoleEnum[keyof typeof UserRoleEnum];
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
    refetch
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Check localStorage on initial render to handle page refreshes
  useEffect(() => {
    // If no user data from API but we have saved auth state, attempt to recover
    if (!user && !isLoading) {
      const savedAuth = getAuthState();
      if (savedAuth && isLikelyLoggedIn()) {
        console.log("No server session but found local auth state, refetching...");
        refetch();
      }
    }
  }, [user, isLoading, refetch]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Login mutation called with credentials:", credentials);
      const res = await apiRequest("POST", "/api/login", credentials);
      const userData = await res.json();
      console.log("Login response data:", userData);
      return userData;
    },
    onSuccess: (user: SelectUser) => {
      // First invalidate any existing user query data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Then set the user data in the query cache
      queryClient.setQueryData(["/api/user"], user);
      
      console.log("Login successful, set user data:", user);
      
      // Save authentication state to localStorage
      saveAuthState(user);
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
      // Use a small delay to ensure query cache is updated and redirect to appropriate page
      setTimeout(() => {
        try {
          // Check if user has a profile already
          if (user.role === "jobseeker") {
            // Send to dashboard - they can complete their profile from there
            console.log("Redirecting to jobseeker dashboard");
            // Use navigate function and push state to maintain history
            window.history.pushState({}, "", "/jobseeker/dashboard");
            window.dispatchEvent(new PopStateEvent('popstate'));
          } else if (user.role === "employer") {
            console.log("Redirecting to employer dashboard");
            window.history.pushState({}, "", "/employer/dashboard");
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
        } catch (e) {
          console.error("Navigation error:", e);
          // Fallback to direct location change if the above fails
          if (user.role === "jobseeker") {
            window.location.href = "/jobseeker/dashboard";
          } else if (user.role === "employer") {
            window.location.href = "/employer/dashboard";
          }
        }
      }, 750);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      console.log("Register mutation called with credentials:", credentials);
      const res = await apiRequest("POST", "/api/register", credentials);
      const userData = await res.json();
      console.log("Register response data:", userData);
      return userData;
    },
    onSuccess: (user: SelectUser) => {
      // First invalidate any existing user query data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Then set the user data in the query cache
      queryClient.setQueryData(["/api/user"], user);
      
      console.log("Registration successful, set user data:", user);
      
      // Save authentication state to localStorage using the utility
      saveAuthState(user);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      // Use a small delay to ensure query cache is updated
      setTimeout(() => {
        try {
          // Redirect user based on role after registration
          if (user.role === "jobseeker") {
            console.log("Redirecting new jobseeker to profile setup");
            window.history.pushState({}, "", "/jobseeker/simple-profile-setup");
            window.dispatchEvent(new PopStateEvent('popstate'));
          } else if (user.role === "employer") {
            console.log("Redirecting new employer to profile setup");
            window.history.pushState({}, "", "/employer/profile-setup");
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
        } catch (e) {
          console.error("Navigation error:", e);
          // Fallback to direct location change if the above fails
          if (user.role === "jobseeker") {
            window.location.href = "/jobseeker/simple-profile-setup";
          } else if (user.role === "employer") {
            window.location.href = "/employer/profile-setup";
          }
        }
      }, 750);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      // Clear user data from query cache
      queryClient.setQueryData(["/api/user"], null);
      
      // Remove auth state from localStorage using our utility
      clearAuthState();
      
      // Notification
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
      
      // Redirect to auth page
      setTimeout(() => {
        try {
          window.history.pushState({}, "", "/auth");
          window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (e) {
          console.error("Navigation error:", e);
          // Fallback
          window.location.href = '/auth';
        }
      }, 500);
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}