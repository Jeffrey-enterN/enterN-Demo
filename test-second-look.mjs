// Script to test the second look feature
import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';

// Create a cookie jar and wrapper for fetch that handles cookies
const jar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, jar);

async function testSecondLookFeature() {
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

    // Fetch the second look list (rejected employers that can be reconsidered)
    const secondLookResponse = await fetchWithCookies('http://localhost:5000/api/jobseeker/second-look', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const secondLookData = await secondLookResponse.json();
    console.log('Second look data:', secondLookData);

    // If we have employers in the second look list, update the match status for the first one
    if (secondLookData && secondLookData.length > 0) {
      const employerId = secondLookData[0].id;
      
      const updateResponse = await fetchWithCookies(`http://localhost:5000/api/jobseeker/match/${employerId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'matched'
        })
      });

      const updateData = await updateResponse.json();
      console.log('Match status updated:', updateData);
    }
    
  } catch (error) {
    console.error('Error during second look test:', error);
  }
}

testSecondLookFeature();