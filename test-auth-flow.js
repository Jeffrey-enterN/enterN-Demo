// Script to test complete auth flow with session persistence
import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';

async function testAuthFlow() {
  // Create a cookie jar to store and send cookies between requests
  const jar = new CookieJar();
  const fetchWithCookies = fetchCookie(fetch, jar);
  
  console.log('Step 1: Attempting login');
  try {
    const loginResponse = await fetchWithCookies('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test-jobseeker@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', loginData);
    console.log('Cookies after login:', await jar.getCookieString('http://localhost:5000'));
    
    // Wait a moment to ensure session is saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\nStep 2: Checking user session');
    const userResponse = await fetchWithCookies('http://localhost:5000/api/user', {
      method: 'GET'
    });
    
    console.log('User response status:', userResponse.status);
    
    if (userResponse.status === 200) {
      const userData = await userResponse.json();
      console.log('User data from session:', userData);
      console.log('Auth flow test: SUCCESS - Session is working properly');
    } else {
      console.log('User response error:', await userResponse.text());
      console.log('Auth flow test: FAILED - Session is not persisting');
    }
    
  } catch (error) {
    console.error('Error during auth flow test:', error);
  }
}

testAuthFlow();