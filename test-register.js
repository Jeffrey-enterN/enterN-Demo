// Script to test user registration
import fetch from 'node-fetch';

async function registerUser() {
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        role: 'employer'
      })
    });

    const data = await response.json();
    console.log('Registration response:', data);
  } catch (error) {
    console.error('Error during registration:', error);
  }
}

registerUser();