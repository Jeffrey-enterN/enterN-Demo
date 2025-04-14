// Script to create an employer profile and job posting
import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';

// Create a cookie jar and wrapper for fetch that handles cookies
const jar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, jar);

async function createEmployerWithJob() {
  try {
    // Register employer user
    const registerResponse = await fetchWithCookies('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test-employer2@example.com',
        password: 'password123',
        role: 'employer'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Employer registration response:', registerData);

    // Now create the employer profile
    const profileResponse = await fetchWithCookies('http://localhost:5000/api/employer/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyName: 'Test Company',
        industry: 'Technology',
        employeeCount: '51-200',
        yearFounded: 2015,
        headquarters: 'San Francisco, CA',
        additionalOffices: 'New York, London',
        about: 'An innovative technology company focusing on AI solutions.',
        missionValues: 'Making technology accessible to everyone. Innovation, Collaboration, Excellence.',
        perksAndBenefits: 'Health Insurance, Remote Work, 401k, Professional Development',
        calendarLink: 'https://calendly.com/testcompany',
        atsLink: 'https://testcompany.applicanttracking.com'
      })
    });

    const profileData = await profileResponse.json();
    console.log('Employer profile response:', profileData);

    // Create a job posting
    const jobResponse = await fetchWithCookies('http://localhost:5000/api/employer/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Full Stack Developer',
        function: 'Engineering',
        type: 'full_time',
        location: 'Remote - US',
        locationType: 'remote',
        description: 'Looking for an experienced full stack developer to join our team.',
        responsibilities: 'Build scalable web applications, collaborate with product team, and maintain existing systems.'
      })
    });

    const jobData = await jobResponse.json();
    console.log('Job posting response:', jobData);
  } catch (error) {
    console.error('Error during employer setup:', error);
  }
}

createEmployerWithJob();