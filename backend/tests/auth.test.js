const request = require('supertest');
const app = require('../server');

describe('Authentication API', () => {
  let testUser = {
    full_name: 'تست کاربر',
    email: 'test@example.com',
    password: 'Test123456',
    phone: '09123456789',
    national_id: '1234567890'
  };

  let authToken;

  test('POST /api/auth/register - Register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(testUser.email);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();
    
    authToken = response.body.data.token;
  });

  test('POST /api/auth/login - Login with credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(testUser.email);
    expect(response.body.data.token).toBeDefined();
  });

  test('GET /api/auth/profile - Get user profile', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(testUser.email);
    expect(response.body.data.user.full_name).toBe(testUser.full_name);
  });

  test('PUT /api/auth/profile - Update user profile', async () => {
    const updatedData = {
      full_name: 'تست کاربر به‌روزرسانی شده',
      phone: '09987654321'
    };

    const response = await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.full_name).toBe(updatedData.full_name);
    expect(response.body.data.user.phone).toBe(updatedData.phone);
  });

  test('POST /api/auth/register - Duplicate email should fail', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('ایمیل');
  });

  test('POST /api/auth/login - Invalid credentials should fail', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('اشتباه');
  });

  test('GET /api/auth/profile - Without token should fail', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('توکن');
  });
});

describe('Health Check', () => {
  test('GET /api/health - Health check endpoint', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body.status).toBe('OK');
    expect(response.body.service).toBe('MelkChain Backend API');
  });
});
