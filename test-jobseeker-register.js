// Script to test jobseeker registration
import fetch from 'node-fetch';

async function registerJobseeker() {
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test-jobseeker@example.com',
        password: 'password123',
        role: 'jobseeker'
      })
    });

    const data = await response.json();
    console.log('Registration response:', data);
  } catch (error) {
    console.error('Error during registration:', error);
  }
}

registerJobseeker();