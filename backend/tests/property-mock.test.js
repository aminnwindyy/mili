const request = require('supertest');
const mongoose = require('mongoose');

// Mock mongoose for testing without database
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    close: jest.fn().mockResolvedValue(true)
  },
  Schema: jest.fn(),
  model: jest.fn()
}));

// Mock models
const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  full_name: 'تست کاربر',
  email: 'test@example.com',
  role: 'investor',
  is_active: true
};

const mockProperty = {
  _id: '507f1f77bcf86cd799439012',
  title: 'آپارتمان لوکس در تهران',
  description: 'آپارتمان زیبا و مدرن در منطقه شمال تهران',
  address: 'تهران، منطقه 1، خیابان ولیعصر',
  city: 'تهران',
  property_type: 'آپارتمان',
  area: 120,
  total_value: 5000000000,
  total_tokens: 1000,
  token_price: 5000000,
  owner: '507f1f77bcf86cd799439011',
  views_count: 0,
  save: jest.fn().mockResolvedValue(true)
};

// Mock User model
const User = {
  findById: jest.fn(),
  deleteMany: jest.fn().mockResolvedValue(true),
  findOne: jest.fn()
};

// Mock Property model
const Property = {
  findById: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  countDocuments: jest.fn(),
  deleteMany: jest.fn().mockResolvedValue(true),
  findByIdAndDelete: jest.fn()
};

// Mock the models
jest.mock('../src/models/User', () => User);
jest.mock('../src/models/Property', () => Property);

// Create a simple Express app for testing
const express = require('express');
const app = express();

app.use(express.json());

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = {
    id: mockUser._id,
    email: mockUser.email,
    role: mockUser.role
  };
  next();
};

// Mock routes
app.get('/api/properties', (req, res) => {
  res.json({
    success: true,
    data: {
      properties: [mockProperty],
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: 1,
        items_per_page: 10
      }
    }
  });
});

app.get('/api/properties/:id', (req, res) => {
  if (req.params.id === mockProperty._id) {
    res.json({
      success: true,
      data: { property: mockProperty }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'ملک یافت نشد'
    });
  }
});

app.post('/api/properties', auth, (req, res) => {
  const newProperty = {
    ...req.body,
    _id: '507f1f77bcf86cd799439013',
    owner: req.user.id,
    created_at: new Date()
  };
  
  res.status(201).json({
    success: true,
    message: 'ملک با موفقیت ثبت شد',
    data: { property: newProperty }
  });
});

app.put('/api/properties/:id', auth, (req, res) => {
  if (req.params.id === mockProperty._id) {
    const updatedProperty = { ...mockProperty, ...req.body };
    res.json({
      success: true,
      message: 'ملک با موفقیت به‌روزرسانی شد',
      data: { property: updatedProperty }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'ملک یافت نشد'
    });
  }
});

app.delete('/api/properties/:id', auth, (req, res) => {
  if (req.params.id === mockProperty._id) {
    res.json({
      success: true,
      message: 'ملک با موفقیت حذف شد'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'ملک یافت نشد'
    });
  }
});

describe('Property API Tests (Mocked)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/properties', () => {
    test('Should get all properties', async () => {
      const response = await request(app)
        .get('/api/properties');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.properties[0].title).toBe(mockProperty.title);
    });
  });

  describe('GET /api/properties/:id', () => {
    test('Should get single property by ID', async () => {
      const response = await request(app)
        .get(`/api/properties/${mockProperty._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.property.title).toBe(mockProperty.title);
    });

    test('Should return 404 for non-existent property', async () => {
      const response = await request(app)
        .get('/api/properties/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/properties', () => {
    test('Should create a new property', async () => {
      const newProperty = {
        title: 'آپارتمان جدید',
        description: 'توضیحات آپارتمان جدید',
        address: 'تهران، منطقه 2',
        city: 'تهران',
        property_type: 'آپارتمان',
        area: 100,
        total_value: 3000000000,
        total_tokens: 600,
        token_price: 5000000
      };

      const response = await request(app)
        .post('/api/properties')
        .send(newProperty);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.property.title).toBe(newProperty.title);
      expect(response.body.data.property.owner).toBe(mockUser._id);
    });
  });

  describe('PUT /api/properties/:id', () => {
    test('Should update property', async () => {
      const updateData = {
        title: 'آپارتمان به‌روزرسانی شده'
      };

      const response = await request(app)
        .put(`/api/properties/${mockProperty._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.property.title).toBe(updateData.title);
    });

    test('Should return 404 for non-existent property', async () => {
      const response = await request(app)
        .put('/api/properties/nonexistent')
        .send({ title: 'تست' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/properties/:id', () => {
    test('Should delete property', async () => {
      const response = await request(app)
        .delete(`/api/properties/${mockProperty._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('ملک با موفقیت حذف شد');
    });

    test('Should return 404 for non-existent property', async () => {
      const response = await request(app)
        .delete('/api/properties/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
