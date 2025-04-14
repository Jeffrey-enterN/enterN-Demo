// Script to create a jobseeker profile
import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';

// Create a cookie jar and wrapper for fetch that handles cookies
const jar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, jar);

async function createJobseekerProfile() {
  try {
    // First login to get the session
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
    console.log('Login successful:', loginData.email);

    // Now create the jobseeker profile
    const profileResponse = await fetchWithCookies('http://localhost:5000/api/jobseeker/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Jobseeker',
        phoneNumber: '555-123-4567',
        school: 'Test University',
        degreeLevel: 'Bachelor',
        major: 'Computer Science',
        graduationYear: 2025,
        workExperience: '2 years',
        skills: ['JavaScript', 'React', 'Node.js'],
        preferredIndustries: ['Tech', 'Software', 'Web Development'],
        preferredFunctionalAreas: ['Engineering', 'Development', 'Frontend'],
        portfolioUrl: 'https://testportfolio.com'
      })
    });

    const profileData = await profileResponse.json();
    console.log('Profile creation response:', profileData);

    // Now create the jobseeker preferences
    const preferencesResponse = await fetchWithCookies('http://localhost:5000/api/jobseeker/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        preferences: {
          workLifeBalance: 75,
          teamCollaboration: 80,
          autonomy: 65,
          structuredWork: 50,
          remoteWork: 90,
          compensationFocus: 70,
          careerGrowth: 85,
          companyStability: 60,
          missionAlignment: 75,
          fastPacedEnvironment: 65
        }
      })
    });

    const preferencesData = await preferencesResponse.json();
    console.log('Preferences creation response:', preferencesData);
  } catch (error) {
    console.error('Error during profile setup:', error);
  }
}

createJobseekerProfile();