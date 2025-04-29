import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getAuthState, isLikelyLoggedIn, clearAuthState } from "@/lib/authUtils";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    console.error(`API Error: ${res.status}: ${text}`);
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`Making ${method} request to ${url}`, data);
  
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Important: this sends cookies with cross-origin requests
    });
    
    console.log(`API response for ${method} ${url}:`, {
      status: res.status,
      statusText: res.statusText,
      // Simplified headers logging to avoid TypeScript issue
      headers: `Content-Type: ${res.headers.get('content-type')}`
    });
    
    // Clone the response so we can log the body but still return the original response
    const clonedRes = res.clone();
    clonedRes.text().then(body => {
      try {
        const jsonBody = JSON.parse(body);
        console.log(`API response body:`, jsonBody);
      } catch (e) {
        console.log(`API response body (text):`, body);
      }
    }).catch(e => {
      console.error('Could not read response body:', e);
    });
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API request failed for ${method} ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    console.log(`Query fetch for ${queryKey[0]}`);
    
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });
      
      console.log(`Query response for ${queryKey[0]}: status=${res.status}`);
  
      if (res.status === 401) {
        console.log('Authentication failed with 401 status');
        // Use a more reliable way to detect if we're on the auth page
        const currentPath = window.location.pathname;
        
        if (currentPath !== '/auth' && unauthorizedBehavior === "returnNull") {
          console.log('Not on auth page, redirecting to auth page due to 401');
          
          // Clear any saved auth state to prevent loops
          localStorage.removeItem('auth_state');
          
          // No need for immediate redirect - let React router handle it
          // But do force a hard redirect if we're already at a protected route
          if (currentPath.startsWith('/jobseeker/') || currentPath.startsWith('/employer/')) {
            window.location.href = '/auth';
          }
          
          return null;
        } else {
          console.log('On auth page or using throw behavior, just handling 401 normally');
          if (unauthorizedBehavior === "returnNull") {
            return null;
          }
          throw new Error('Unauthorized');
        }
      }
  
      // Clone the response so we can log the body but still return the original response
      try {
        const clonedRes = res.clone();
        const body = await clonedRes.text();
        try {
          const jsonBody = JSON.parse(body);
          console.log(`Query response body:`, jsonBody);
        } catch (e) {
          console.log(`Query response body (text):`, body);
        }
      } catch (e) {
        console.error('Could not read query response body:', e);
      }
      
      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error(`Query fetch error for ${queryKey[0]}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // Change from "throw" to "returnNull" to better handle auth states
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
