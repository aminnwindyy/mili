const request = require('supertest');
const express = require('express');

// Create a simple Express app for testing
const app = express();
app.use(express.json());

// Mock property data
const mockProperties = [
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'آپارتمان لوکس در تهران',
    description: 'آپارتمان زیبا و مدرن در منطقه شمال تهران',
    address: 'تهران، منطقه 1، خیابان ولیعصر',
    city: 'تهران',
    property_type: 'آپارتمان',
    area: 120,
    total_value: 5000000000,
    total_tokens: 1000,
    token_price: 5000000,
    owner: '507f1f77bcf86cd799439012',
    views_count: 0,
    created_at: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439013',
    title: 'خانه ویلایی در شیراز',
    description: 'خانه زیبا با حیاط بزرگ',
    address: 'شیراز، منطقه 3',
    city: 'شیراز',
    property_type: 'خانه',
    area: 200,
    total_value: 3000000000,
    total_tokens: 600,
    token_price: 5000000,
    owner: '507f1f77bcf86cd799439014',
    views_count: 5,
    created_at: new Date()
  }
];

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439012',
    email: 'test@example.com',
    role: 'investor'
  };
  next();
};

// Routes
app.get('/api/properties', (req, res) => {
  const { city, property_type, search } = req.query;
  let filteredProperties = [...mockProperties];

  // Apply filters
  if (city) {
    filteredProperties = filteredProperties.filter(p => p.city === city);
  }
  
  if (property_type) {
    filteredProperties = filteredProperties.filter(p => p.property_type === property_type);
  }
  
  if (search) {
    filteredProperties = filteredProperties.filter(p => 
      p.title.includes(search) || p.description.includes(search)
    );
  }

  res.json({
    success: true,
    data: {
      properties: filteredProperties,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: filteredProperties.length,
        items_per_page: 10
      }
    }
  });
});

app.get('/api/properties/:id', (req, res) => {
  const property = mockProperties.find(p => p._id === req.params.id);
  
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'ملک یافت نشد'
    });
  }

  // Increment view count
  property.views_count += 1;

  res.json({
    success: true,
    data: { property }
  });
});

app.post('/api/properties', auth, (req, res) => {
  const newProperty = {
    _id: '507f1f77bcf86cd799439015',
    ...req.body,
    owner: req.user.id,
    views_count: 0,
    created_at: new Date()
  };
  
  mockProperties.push(newProperty);
  
  res.status(201).json({
    success: true,
    message: 'ملک با موفقیت ثبت شد',
    data: { property: newProperty }
  });
});

app.put('/api/properties/:id', auth, (req, res) => {
  const propertyIndex = mockProperties.findIndex(p => p._id === req.params.id);
  
  if (propertyIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'ملک یافت نشد'
    });
  }

  // Check ownership
  if (mockProperties[propertyIndex].owner !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'شما مجوز ویرایش این ملک را ندارید'
    });
  }

  // Update property
  mockProperties[propertyIndex] = {
    ...mockProperties[propertyIndex],
    ...req.body
  };

  res.json({
    success: true,
    message: 'ملک با موفقیت به‌روزرسانی شد',
    data: { property: mockProperties[propertyIndex] }
  });
});

app.delete('/api/properties/:id', auth, (req, res) => {
  try {
    const propertyIndex = mockProperties.findIndex(p => p._id === req.params.id);
    
    if (propertyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ملک یافت نشد'
      });
    }

    // Check ownership
    if (mockProperties[propertyIndex] && mockProperties[propertyIndex].owner !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز حذف این ملک را ندارید'
      });
    }

    mockProperties.splice(propertyIndex, 1);

    res.json({
      success: true,
      message: 'ملک با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف ملک'
    });
  }
});

describe('Property API Tests (Simple Mock)', () => {
  beforeEach(() => {
    // Reset mock data - recreate the array instead of truncating
    mockProperties.length = 0;
    mockProperties.push(
      {
        _id: '507f1f77bcf86cd799439011',
        title: 'آپارتمان لوکس در تهران',
        description: 'آپارتمان زیبا و مدرن در منطقه شمال تهران',
        address: 'تهران، منطقه 1، خیابان ولیعصر',
        city: 'تهران',
        property_type: 'آپارتمان',
        area: 120,
        total_value: 5000000000,
        total_tokens: 1000,
        token_price: 5000000,
        owner: '507f1f77bcf86cd799439012',
        views_count: 0,
        created_at: new Date()
      },
      {
        _id: '507f1f77bcf86cd799439013',
        title: 'خانه ویلایی در شیراز',
        description: 'خانه زیبا با حیاط بزرگ',
        address: 'شیراز، منطقه 3',
        city: 'شیراز',
        property_type: 'خانه',
        area: 200,
        total_value: 3000000000,
        total_tokens: 600,
        token_price: 5000000,
        owner: '507f1f77bcf86cd799439014',
        views_count: 5,
        created_at: new Date()
      }
    );
  });

  describe('GET /api/properties', () => {
    test('Should get all properties', async () => {
      const response = await request(app)
        .get('/api/properties');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(2);
      expect(response.body.data.properties[0].title).toBe('آپارتمان لوکس در تهران');
    });

    test('Should filter properties by city', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({ city: 'تهران' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.properties[0].city).toBe('تهران');
    });

    test('Should filter properties by property type', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({ property_type: 'خانه' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.properties[0].property_type).toBe('خانه');
    });

    test('Should search properties by title', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({ search: 'لوکس' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toHaveLength(1);
      expect(response.body.data.properties[0].title).toContain('لوکس');
    });
  });

  describe('GET /api/properties/:id', () => {
    test('Should get single property by ID', async () => {
      const response = await request(app)
        .get(`/api/properties/${mockProperties[0]._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.property.title).toBe(mockProperties[0].title);
      expect(response.body.data.property.views_count).toBe(1); // Should increment
    });

    test('Should return 404 for non-existent property', async () => {
      const response = await request(app)
        .get('/api/properties/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('ملک یافت نشد');
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
      expect(response.body.data.property.owner).toBe('507f1f77bcf86cd799439012');
      expect(mockProperties).toHaveLength(3);
    });
  });

  describe('PUT /api/properties/:id', () => {
    test('Should update property', async () => {
      const updateData = {
        title: 'آپارتمان به‌روزرسانی شده'
      };

      const response = await request(app)
        .put(`/api/properties/${mockProperties[0]._id}`)
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

    test('Should return 403 for unauthorized access', async () => {
      const response = await request(app)
        .put(`/api/properties/${mockProperties[1]._id}`)
        .send({ title: 'تست غیرمجاز' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('شما مجوز ویرایش این ملک را ندارید');
    });
  });

  describe('DELETE /api/properties/:id', () => {
    test('Should delete property', async () => {
      const response = await request(app)
        .delete(`/api/properties/${mockProperties[0]._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('ملک با موفقیت حذف شد');
      expect(mockProperties).toHaveLength(1);
    });

    test('Should return 404 for non-existent property', async () => {
      const response = await request(app)
        .delete('/api/properties/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('Should return 403 for unauthorized access', async () => {
      
      const response = await request(app)
        .delete('/api/properties/507f1f77bcf86cd799439013');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('شما مجوز حذف این ملک را ندارید');
    });
  });
});
