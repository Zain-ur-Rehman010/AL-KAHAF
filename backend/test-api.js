require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.FRONTEND_URL || 'https://alkahafonlineacademy.com';
const API_URL = `${BASE_URL}/api/v1`;

console.log('\n🧪 Testing AlKahaf LMS API...\n');
console.log('Base URL:', BASE_URL);
console.log('API URL:', API_URL);
console.log('─────────────────────────────────────\n');

async function testAPI() {
  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Health Check
  console.log('1️⃣  Testing Health Check Endpoint...');
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    if (response.data.status === 'OK') {
      console.log('   ✅ Health check passed');
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      testsPassed++;
    } else {
      console.log('   ❌ Health check failed - unexpected response');
      testsFailed++;
    }
  } catch (error) {
    console.log('   ❌ Health check failed');
    console.log('   Error:', error.message);
    testsFailed++;
  }

  console.log('\n─────────────────────────────────────\n');

  // Test 2: Register User
  console.log('2️⃣  Testing User Registration...');
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'Test123456!',
    confirmPassword: 'Test123456!',
    role: 'student'
  };

  try {
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    if (response.data.success) {
      console.log('   ✅ User registration successful');
      console.log('   User ID:', response.data.data.user.id);
      console.log('   Email:', response.data.data.user.email);
      console.log('   Token received:', response.data.data.accessToken ? 'Yes' : 'No');
      testsPassed++;

      // Save token for next test
      global.accessToken = response.data.data.accessToken;
      global.userId = response.data.data.user.id;
    } else {
      console.log('   ❌ User registration failed - unexpected response');
      testsFailed++;
    }
  } catch (error) {
    console.log('   ❌ User registration failed');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('   Error:', error.message);
    }
    testsFailed++;
  }

  console.log('\n─────────────────────────────────────\n');

  // Test 3: Get Current User (if registration succeeded)
  if (global.accessToken) {
    console.log('3️⃣  Testing Get Current User...');
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${global.accessToken}`
        }
      });
      if (response.data.success) {
        console.log('   ✅ Get current user successful');
        console.log('   User:', response.data.data.firstName, response.data.data.lastName);
        console.log('   Email:', response.data.data.email);
        console.log('   Role:', response.data.data.role);
        testsPassed++;
      } else {
        console.log('   ❌ Get current user failed - unexpected response');
        testsFailed++;
      }
    } catch (error) {
      console.log('   ❌ Get current user failed');
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Error:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('   Error:', error.message);
      }
      testsFailed++;
    }

    console.log('\n─────────────────────────────────────\n');

    // Test 4: Login with created user
    console.log('4️⃣  Testing User Login...');
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      if (response.data.success) {
        console.log('   ✅ User login successful');
        console.log('   Token received:', response.data.data.accessToken ? 'Yes' : 'No');
        console.log('   Refresh token received:', response.data.data.refreshToken ? 'Yes' : 'No');
        testsPassed++;
      } else {
        console.log('   ❌ User login failed - unexpected response');
        testsFailed++;
      }
    } catch (error) {
      console.log('   ❌ User login failed');
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Error:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('   Error:', error.message);
      }
      testsFailed++;
    }
  }

  // Summary
  console.log('\n═════════════════════════════════════');
  console.log('📊 Test Summary');
  console.log('═════════════════════════════════════');
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  console.log('═════════════════════════════════════\n');

  if (testsFailed === 0) {
    console.log('🎉 All tests passed! Your API is working correctly.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.\n');
    process.exit(1);
  }
}

testAPI();