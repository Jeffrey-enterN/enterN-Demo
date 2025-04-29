// Test script to verify authentication and redirects
import fetch from 'node-fetch';

async function testAuth() {
  console.log("Testing authentication with redirect handling...");
  
  try {
    // 1. Try to register a new user
    console.log("\n1. Registering a new test user...");
    const registerResponse = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `test-user-${Date.now()}@example.com`,
        password: 'password123',
        role: 'jobseeker'
      }),
      redirect: 'manual',
    });
    
    console.log("Register Status:", registerResponse.status);
    const registerData = await registerResponse.json();
    console.log("Register Response:", registerData);
    
    // 2. Check if we can get the user info
    console.log("\n2. Fetching user info after registration...");
    const userResponse = await fetch('http://localhost:5000/api/user', {
      headers: {
        Cookie: registerResponse.headers.get('set-cookie'),
      },
    });
    
    console.log("User API Status:", userResponse.status);
    if (userResponse.status === 200) {
      const userData = await userResponse.json();
      console.log("User Response:", userData);
    } else {
      console.log("Failed to get user, not authenticated");
    }
    
    // 3. Logout
    console.log("\n3. Logging out...");
    const logoutResponse = await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        Cookie: registerResponse.headers.get('set-cookie'),
      },
    });
    
    console.log("Logout Status:", logoutResponse.status);
    
    // 4. Verify logged out
    console.log("\n4. Verifying logged out state...");
    const afterLogoutResponse = await fetch('http://localhost:5000/api/user', {
      headers: {
        Cookie: registerResponse.headers.get('set-cookie'),
      },
    });
    
    console.log("After Logout Status:", afterLogoutResponse.status);
    
    console.log("\nAuthentication test completed!");
  } catch (error) {
    console.error("Test failed with error:", error);
  }
}

testAuth();