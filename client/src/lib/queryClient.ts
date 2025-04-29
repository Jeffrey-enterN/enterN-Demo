import { QueryClient, QueryFunction } from "@tanstack/react-query";

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
    
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });
    
    console.log(`Query response for ${queryKey[0]}: status=${res.status}`);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.log('Returning null for 401 response as configured');
      return null;
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
