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
        email: 'test-employer@example.com',
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
        companySize: '51-200',
        foundedYear: 2015,
        website: 'https://testcompany.com',
        headquarters: 'San Francisco, CA',
        description: 'An innovative technology company focusing on AI solutions.',
        missionStatement: 'Making technology accessible to everyone.',
        cultureValues: ['Innovation', 'Collaboration', 'Excellence'],
        benefitsPerks: ['Health Insurance', 'Remote Work', '401k', 'Professional Development'],
        diversityInitiatives: 'Committed to diversity and inclusion in all hiring practices.'
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
        description: 'Looking for an experienced full stack developer to join our team.',
        responsibilities: 'Build scalable web applications, collaborate with product team, and maintain existing systems.',
        qualifications: 'Experience with React, Node.js, and PostgreSQL. 3+ years of experience.',
        employmentType: 'full-time',
        locationType: 'remote',
        location: 'Remote - US',
        minSalary: 90000,
        maxSalary: 120000,
        applicationInstructions: 'Apply through our website or this platform.'
      })
    });

    const jobData = await jobResponse.json();
    console.log('Job posting response:', jobData);
  } catch (error) {
    console.error('Error during employer setup:', error);
  }
}

createEmployerWithJob();