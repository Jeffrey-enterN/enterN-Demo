// Script to create a match between jobseeker and employer
import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';

// Create a cookie jar and wrapper for fetch that handles cookies
const jar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, jar);

async function createMatchWithRejection() {
  try {
    // First login as jobseeker to get the session
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
    console.log('Jobseeker login successful:', loginData.email);

    // Create a match with the employer profile (initially rejected)
    const matchResponse = await fetchWithCookies('http://localhost:5000/api/jobseeker/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        employerId: 4,
        status: 'rejected'
      })
    });

    const matchData = await matchResponse.json();
    console.log('Match created with rejection:', matchData);
    
  } catch (error) {
    console.error('Error during match creation:', error);
  }
}

createMatchWithRejection();