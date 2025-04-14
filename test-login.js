// Script to test user login
import fetch from 'node-fetch';

async function loginUser() {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('Login response:', data);
  } catch (error) {
    console.error('Error during login:', error);
  }
}

loginUser();