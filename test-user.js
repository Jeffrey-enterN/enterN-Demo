// Script to test getting the current user
import fetch from 'node-fetch';

// We need to use cookies to maintain the session
import { CookieJar } from 'tough-cookie';
import { promisify } from 'util';
import fetchCookie from 'fetch-cookie';

// Create a cookie jar to store cookies (session)
const jar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, jar);

async function testAuthFlow() {
  try {
    // Step 1: Login
    console.log('Step 1: Logging in...');
    const loginResponse = await fetchWithCookies('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData);

    // Step 2: Get current user
    console.log('\nStep 2: Getting current user...');
    const userResponse = await fetchWithCookies('http://localhost:5000/api/user');
    const userData = await userResponse.json();
    console.log('Current user:', userData);

    // Step 3: Logout
    console.log('\nStep 3: Logging out...');
    const logoutResponse = await fetchWithCookies('http://localhost:5000/api/logout', {
      method: 'POST'
    });
    console.log('Logout status:', logoutResponse.status);

    // Step 4: Try to get user after logout
    console.log('\nStep 4: Getting user after logout...');
    const afterLogoutResponse = await fetchWithCookies('http://localhost:5000/api/user');
    console.log('Get user after logout status:', afterLogoutResponse.status);
  } catch (error) {
    console.error('Error during auth flow test:', error);
  }
}

testAuthFlow();