import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser, UserRoleEnum } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

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
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
      // Use a small delay to ensure query cache is updated and redirect to appropriate page
      setTimeout(() => {
        // Create a small indicator in localStorage that we're logged in
        localStorage.setItem('auth_state', JSON.stringify({
          isLoggedIn: true,
          userId: user.id,
          role: user.role
        }));
        
        // Check if user has a profile already
        if (user.role === "jobseeker") {
          // Send to dashboard - they can complete their profile from there
          console.log("Redirecting to jobseeker dashboard");
          window.location.href = "/jobseeker/dashboard";
        } else if (user.role === "employer") {
          console.log("Redirecting to employer dashboard");
          window.location.href = "/employer/dashboard";
        }
      }, 500);
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
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      // Use a small delay to ensure query cache is updated
      setTimeout(() => {
        // Create a small indicator in localStorage that we're logged in
        localStorage.setItem('auth_state', JSON.stringify({
          isLoggedIn: true,
          userId: user.id,
          role: user.role
        }));
        
        // Redirect user based on role after registration
        if (user.role === "jobseeker") {
          console.log("Redirecting new jobseeker to profile setup");
          window.location.href = "/jobseeker/simple-profile-setup";
        } else if (user.role === "employer") {
          console.log("Redirecting new employer to profile setup");
          window.location.href = "/employer/profile-setup";
        }
      }, 500);
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
      
      // Remove auth state from localStorage
      localStorage.removeItem('auth_state');
      
      // Notification
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
      
      // Redirect to auth page
      setTimeout(() => {
        window.location.href = '/auth';
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