import { User as SelectUser } from "@shared/schema";

// Helper function to save auth state to localStorage
export function saveAuthState(user: SelectUser) {
  localStorage.setItem('auth_state', JSON.stringify({
    isLoggedIn: true,
    userId: user.id,
    role: user.role,
    email: user.email,
    lastUpdated: new Date().toISOString()
  }));
}

// Helper function to clear auth state from localStorage
export function clearAuthState() {
  localStorage.removeItem('auth_state');
  // Also clear any other auth-related cookies or storage
  document.cookie.split(";").forEach(cookie => {
    const [name] = cookie.trim().split("=");
    if (name.includes("user_") || name.includes("connect.sid")) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
}

// Helper function to get auth state from localStorage
export function getAuthState() {
  try {
    const authState = localStorage.getItem('auth_state');
    if (!authState) return null;
    
    const parsedState = JSON.parse(authState);
    
    // Basic validation
    if (parsedState && parsedState.isLoggedIn && parsedState.userId && parsedState.role) {
      return parsedState;
    }
  } catch (e) {
    console.error("Error parsing auth state", e);
  }
  
  return null;
}

// Helper to check if the user is likely logged in, based on both localStorage and cookies
export function isLikelyLoggedIn() {
  const authState = getAuthState();
  const hasCookie = document.cookie.includes('user_logged_in=true');
  
  return authState !== null || hasCookie;
}