const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');
const Property = require('../src/models/Property');

// Test data
const testUser = {
  full_name: 'تست کاربر',
  email: 'test@example.com',
  password: 'Test123456',
  phone: '09123456789',
  role: 'investor'
};

const testProperty = {
  title: 'آپارتمان لوکس در تهران',
  description: 'آپارتمان زیبا و مدرن در منطقه شمال تهران با امکانات کامل',
  address: 'تهران، منطقه 1، خیابان ولیعصر',
  city: 'تهران',
  property_type: 'آپارتمان',
  area: 120,
  rooms: 3,
  floors: 10,
  floor_number: 5,
  total_value: 5000000000, // 5 میلیارد ریال
  total_tokens: 1000,
  token_price: 5000000, // 5 میلیون ریال
  expected_annual_return: 15,
  features: ['پارکینگ', 'انباری', 'آسانسور', 'بالکن']
};

let authToken;
let userId;
let propertyId;

describe('Property API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/melkmekl_test');
    
    // Clean up existing data
    await User.deleteMany({});
    await Property.deleteMany({});
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Property.deleteMany({});
    await mongoose.connection.close();
  });

  describe('User Registration and Login', () => {
    test('Should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      
      userId = response.body.data.user._id;
    });

    test('Should login user and get token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      
      authToken = response.body.data.token;
    });
  });

  describe('Property CRUD Operations', () => {
    test('Should create a new property', async () => {
      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testProperty);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.property.title).toBe(testProperty.title);
      expect(response.body.data.property.owner).toBe(userId);
      
      propertyId = response.body.data.property._id;
    });

    test('Should get all properties', async () => {
      const response = await request(app)
        .get('/api/properties');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.properties[0].title).toBe(testProperty.title);
    });

    test('Should get single property by ID', async () => {
      const response = await request(app)
        .get(`/api/properties/${propertyId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.property.title).toBe(testProperty.title);
      expect(response.body.data.property.views_count).toBe(1); // Should increment view count
    });

    test('Should get user properties', async () => {
      const response = await request(app)
        .get('/api/properties/my-properties')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
    });

    test('Should update property', async () => {
      const updateData = {
        title: 'آپارتمان لوکس به‌روزرسانی شده',
        description: 'توضیحات جدید'
      };

      const response = await request(app)
        .put(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.property.title).toBe(updateData.title);
    });

    test('Should filter properties by city', async () => {
      const response = await request(app)
        .get('/api/properties?city=تهران');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
    });

    test('Should filter properties by property type', async () => {
      const response = await request(app)
        .get('/api/properties?property_type=آپارتمان');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
    });

    test('Should search properties by title', async () => {
      const response = await request(app)
        .get('/api/properties?search=لوکس');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
    });
  });

  describe('Property Validation', () => {
    test('Should reject property with invalid data', async () => {
      const invalidProperty = {
        title: 'ک', // Too short
        description: 'ک', // Too short
        city: 'شهر_نامعتبر',
        property_type: 'نوع_نامعتبر',
        area: -10, // Negative area
        total_value: 1000 // Too low
      };

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidProperty);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('Should reject unauthorized property access', async () => {
      // Create another user
      const anotherUser = {
        full_name: 'کاربر دوم',
        email: 'test2@example.com',
        password: 'Test123456',
        phone: '09123456780',
        role: 'investor'
      };

      await request(app)
        .post('/api/auth/register')
        .send(anotherUser);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: anotherUser.email,
          password: anotherUser.password
        });

      const anotherToken = loginResponse.body.data.token;

      // Try to update property owned by first user
      const response = await request(app)
        .put(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ title: 'تلاش برای تغییر' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Property Deletion', () => {
    test('Should delete property', async () => {
      const response = await request(app)
        .delete(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('Should return 404 for deleted property', async () => {
      const response = await request(app)
        .get(`/api/properties/${propertyId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
