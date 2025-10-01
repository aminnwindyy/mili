const request = require('supertest');
const express = require('express');

// Create a simple Express app for testing
const app = express();
app.use(express.json());

// Mock TREF data
const mockTREFs = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: 'صندوق املاک مسکونی تهران',
    description: 'صندوق سرمایه‌گذاری در املاک مسکونی باکیفیت در تهران',
    fund_code: 'TREF123456',
    fund_type: 'residential',
    category: 'moderate',
    fund_manager: '507f1f77bcf86cd799439012',
    fund_manager_name: 'مدیر صندوق اول',
    total_fund_size: 10000000000, // 10 میلیارد ریال
    total_shares: 10000,
    share_price: 1000000, // 1 میلیون ریال
    available_shares: 8000,
    expected_annual_return: 15,
    management_fee: 2,
    performance_fee: 10,
    status: 'active',
    risk_level: 'medium',
    total_investors: 150,
    total_investments: 2000000000, // 2 میلیارد ریال
    created_at: new Date('2024-01-01')
  },
  {
    _id: '507f1f77bcf86cd799439013',
    name: 'صندوق املاک تجاری شیراز',
    description: 'صندوق سرمایه‌گذاری در املاک تجاری و اداری در شیراز',
    fund_code: 'TREF789012',
    fund_type: 'commercial',
    category: 'aggressive',
    fund_manager: '507f1f77bcf86cd799439014',
    fund_manager_name: 'مدیر صندوق دوم',
    total_fund_size: 5000000000, // 5 میلیارد ریال
    total_shares: 5000,
    share_price: 1000000,
    available_shares: 3000,
    expected_annual_return: 20,
    management_fee: 2.5,
    performance_fee: 15,
    status: 'active',
    risk_level: 'high',
    total_investors: 80,
    total_investments: 1500000000, // 1.5 میلیارد ریال
    created_at: new Date('2024-02-01')
  }
];

// Mock property data
const mockProperties = [
  {
    _id: '507f1f77bcf86cd799439015',
    title: 'آپارتمان لوکس در تهران',
    address: 'تهران، منطقه 1',
    city: 'تهران',
    property_type: 'آپارتمان',
    total_value: 2000000000, // 2 میلیارد ریال
    images: []
  },
  {
    _id: '507f1f77bcf86cd799439016',
    title: 'مجتمع تجاری در شیراز',
    address: 'شیراز، منطقه 3',
    city: 'شیراز',
    property_type: 'تجاری',
    total_value: 3000000000, // 3 میلیارد ریال
    images: []
  }
];

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439012',
    email: 'fundmanager@example.com',
    full_name: 'مدیر صندوق اول',
    phone: '09123456789',
    role: 'fund_manager'
  };
  next();
};

// Routes
app.get('/api/trefs', (req, res) => {
  const { fund_type, category, status, risk_level, search } = req.query;
  let filteredTREFs = [...mockTREFs];

  // Apply filters
  if (fund_type) {
    filteredTREFs = filteredTREFs.filter(tref => tref.fund_type === fund_type);
  }
  
  if (category) {
    filteredTREFs = filteredTREFs.filter(tref => tref.category === category);
  }
  
  if (status) {
    filteredTREFs = filteredTREFs.filter(tref => tref.status === status);
  }
  
  if (risk_level) {
    filteredTREFs = filteredTREFs.filter(tref => tref.risk_level === risk_level);
  }
  
  if (search) {
    filteredTREFs = filteredTREFs.filter(tref => 
      tref.name.includes(search) || 
      tref.description.includes(search) ||
      tref.fund_code.includes(search)
    );
  }

  res.json({
    success: true,
    data: {
      trefs: filteredTREFs,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: filteredTREFs.length,
        items_per_page: 10
      }
    }
  });
});

app.get('/api/trefs/market-stats', (req, res) => {
  const stats = {
    total_funds: mockTREFs.length,
    total_assets: mockTREFs.reduce((sum, tref) => sum + tref.total_fund_size, 0),
    avg_return: mockTREFs.reduce((sum, tref) => sum + tref.expected_annual_return, 0) / mockTREFs.length,
    total_investors: mockTREFs.reduce((sum, tref) => sum + tref.total_investors, 0),
    total_investments: mockTREFs.reduce((sum, tref) => sum + tref.total_investments, 0)
  };

  res.json({
    success: true,
    data: { stats }
  });
});

app.get('/api/trefs/:id', (req, res) => {
  const tref = mockTREFs.find(t => t._id === req.params.id);
  
  if (!tref) {
    return res.status(404).json({
      success: false,
      message: 'صندوق یافت نشد'
    });
  }

  res.json({
    success: true,
    data: { tref }
  });
});

app.get('/api/trefs/:id/performance', (req, res) => {
  const tref = mockTREFs.find(t => t._id === req.params.id);
  
  if (!tref) {
    return res.status(404).json({
      success: false,
      message: 'صندوق یافت نشد'
    });
  }

  const performance = {
    fund_performance: {
      total_value: 5000000000,
      current_nav: 5500000000,
      performance_percentage: 10,
      total_shares: tref.total_shares,
      nav_per_share: 1100000
    },
    performance_metrics: {
      total_return: 500000000,
      total_return_percentage: 10,
      monthly_return: 0.8,
      quarterly_return: 2.5,
      yearly_return: 10
    },
    risk_assessment: {
      risk_level: tref.risk_level,
      risk_score: 65,
      risk_factors: [
        { factor: 'نوسانات بازار', impact: 'medium' },
        { factor: 'ریسک نقدینگی', impact: 'low' }
      ]
    },
    fund_statistics: {
      total_investors: tref.total_investors,
      total_investments: tref.total_investments,
      average_investment: tref.total_investments / tref.total_investors,
      total_shares: tref.total_shares,
      available_shares: tref.available_shares
    }
  };

  res.json({
    success: true,
    data: { performance }
  });
});

app.get('/api/trefs/:id/properties', (req, res) => {
  const tref = mockTREFs.find(t => t._id === req.params.id);
  
  if (!tref) {
    return res.status(404).json({
      success: false,
      message: 'صندوق یافت نشد'
    });
  }

  const properties = [
    {
      property: mockProperties[0],
      property_title: mockProperties[0].title,
      property_address: mockProperties[0].address,
      property_value: 2000000000,
      ownership_percentage: 20,
      acquisition_date: new Date('2024-01-15')
    }
  ];

  res.json({
    success: true,
    data: { properties }
  });
});

app.post('/api/trefs', auth, (req, res) => {
  const {
    name,
    description,
    fund_type,
    category,
    total_fund_size,
    total_shares,
    expected_annual_return,
    management_fee,
    performance_fee,
    entry_fee,
    exit_fee,
    risk_level,
    distribution_frequency,
    notes
  } = req.body;

  // Generate unique fund code
  const fund_code = `TREF${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const newTREF = {
    _id: '507f1f77bcf86cd799439017',
    name,
    description,
    fund_code,
    fund_type,
    category,
    fund_manager: req.user.id,
    fund_manager_name: req.user.full_name,
    fund_manager_contact: req.user.phone,
    total_fund_size,
    total_shares,
    share_price: Math.floor(total_fund_size / total_shares),
    available_shares: total_shares,
    expected_annual_return,
    management_fee,
    performance_fee: performance_fee || 0,
    entry_fee: entry_fee || 0,
    exit_fee: exit_fee || 0,
    risk_level: risk_level || 'medium',
    distribution_frequency: distribution_frequency || 'quarterly',
    status: 'planning',
    total_investors: 0,
    total_investments: 0,
    properties: [],
    notes: notes || '',
    created_at: new Date()
  };

  mockTREFs.push(newTREF);

  res.status(201).json({
    success: true,
    message: 'صندوق با موفقیت ایجاد شد',
    data: { tref: newTREF }
  });
});

app.put('/api/trefs/:id', auth, (req, res) => {
  const trefIndex = mockTREFs.findIndex(t => t._id === req.params.id);
  
  if (trefIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'صندوق یافت نشد'
    });
  }

  const tref = mockTREFs[trefIndex];

  // Check ownership
  if (tref.fund_manager !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'شما مجوز ویرایش این صندوق را ندارید'
    });
  }

  // Update TREF
  Object.assign(tref, req.body);
  mockTREFs[trefIndex] = tref;

  res.json({
    success: true,
    message: 'صندوق با موفقیت به‌روزرسانی شد',
    data: { tref }
  });
});

app.put('/api/trefs/:id/launch', auth, (req, res) => {
  const trefIndex = mockTREFs.findIndex(t => t._id === req.params.id);
  
  if (trefIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'صندوق یافت نشد'
    });
  }

  const tref = mockTREFs[trefIndex];

  // Check ownership
  if (tref.fund_manager !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'شما مجوز راه‌اندازی این صندوق را ندارید'
    });
  }

  // Check if TREF can be launched
  if (tref.status !== 'planning' && tref.status !== 'launching') {
    return res.status(400).json({
      success: false,
      message: 'این صندوق قابل راه‌اندازی نیست'
    });
  }

  // Update TREF status
  tref.status = 'active';
  tref.launch_date = new Date();
  mockTREFs[trefIndex] = tref;

  res.json({
    success: true,
    message: 'صندوق با موفقیت راه‌اندازی شد',
    data: { tref }
  });
});

app.post('/api/trefs/:id/properties', auth, (req, res) => {
  const { property_id, property_value, ownership_percentage } = req.body;
  
  const trefIndex = mockTREFs.findIndex(t => t._id === req.params.id);
  
  if (trefIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'صندوق یافت نشد'
    });
  }

  const tref = mockTREFs[trefIndex];

  // Check ownership
  if (tref.fund_manager !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'شما مجوز اضافه کردن ملک به این صندوق را ندارید'
    });
  }

  // Find property
  const property = mockProperties.find(p => p._id === property_id);
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'ملک یافت نشد'
    });
  }

  // Add property to TREF
  const newProperty = {
    property: property_id,
    property_title: property.title,
    property_address: property.address,
    property_value,
    ownership_percentage,
    acquisition_date: new Date()
  };

  if (!tref.properties) {
    tref.properties = [];
  }
  tref.properties.push(newProperty);
  mockTREFs[trefIndex] = tref;

  res.json({
    success: true,
    message: 'ملک با موفقیت به صندوق اضافه شد',
    data: { property: newProperty }
  });
});

app.delete('/api/trefs/:id/properties/:property_id', auth, (req, res) => {
  const trefIndex = mockTREFs.findIndex(t => t._id === req.params.id);
  
  if (trefIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'صندوق یافت نشد'
    });
  }

  const tref = mockTREFs[trefIndex];

  // Check ownership
  if (tref.fund_manager !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'شما مجوز حذف ملک از این صندوق را ندارید'
    });
  }

  // Find and remove property
  const propertyIndex = tref.properties.findIndex(p => p.property === req.params.property_id);
  if (propertyIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'ملک در صندوق یافت نشد'
    });
  }

  tref.properties.splice(propertyIndex, 1);
  mockTREFs[trefIndex] = tref;

  res.json({
    success: true,
    message: 'ملک با موفقیت از صندوق حذف شد'
  });
});

describe('TREF API Tests (Simple Mock)', () => {
  beforeEach(() => {
    // Reset mock data
    mockTREFs.length = 2;
    mockTREFs[0].status = 'active';
    mockTREFs[0].properties = [];
    mockTREFs[1].status = 'active';
    mockTREFs[1].properties = [];
  });

  describe('GET /api/trefs', () => {
    test('Should get all TREFs', async () => {
      const response = await request(app)
        .get('/api/trefs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trefs).toHaveLength(2);
      expect(response.body.data.trefs[0].name).toBe('صندوق املاک مسکونی تهران');
    });

    test('Should filter TREFs by fund type', async () => {
      const response = await request(app)
        .get('/api/trefs')
        .query({ fund_type: 'residential' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trefs).toHaveLength(1);
      expect(response.body.data.trefs[0].fund_type).toBe('residential');
    });

    test('Should filter TREFs by category', async () => {
      const response = await request(app)
        .get('/api/trefs')
        .query({ category: 'aggressive' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trefs).toHaveLength(1);
      expect(response.body.data.trefs[0].category).toBe('aggressive');
    });

    test('Should filter TREFs by risk level', async () => {
      const response = await request(app)
        .get('/api/trefs')
        .query({ risk_level: 'high' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trefs).toHaveLength(1);
      expect(response.body.data.trefs[0].risk_level).toBe('high');
    });

    test('Should search TREFs by name', async () => {
      const response = await request(app)
        .get('/api/trefs')
        .query({ search: 'تهران' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trefs).toHaveLength(1);
      expect(response.body.data.trefs[0].name).toContain('تهران');
    });
  });

  describe('GET /api/trefs/market-stats', () => {
    test('Should get market statistics', async () => {
      const response = await request(app)
        .get('/api/trefs/market-stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stats.total_funds).toBe(2);
      expect(response.body.data.stats.total_assets).toBe(15000000000);
      expect(response.body.data.stats.avg_return).toBe(17.5);
    });
  });

  describe('GET /api/trefs/:id', () => {
    test('Should get single TREF by ID', async () => {
      const response = await request(app)
        .get(`/api/trefs/${mockTREFs[0]._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tref.name).toBe('صندوق املاک مسکونی تهران');
    });

    test('Should return 404 for non-existent TREF', async () => {
      const response = await request(app)
        .get('/api/trefs/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('صندوق یافت نشد');
    });
  });

  describe('GET /api/trefs/:id/performance', () => {
    test('Should get TREF performance data', async () => {
      const response = await request(app)
        .get(`/api/trefs/${mockTREFs[0]._id}/performance`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.performance.fund_performance).toBeDefined();
      expect(response.body.data.performance.performance_metrics).toBeDefined();
      expect(response.body.data.performance.risk_assessment).toBeDefined();
    });
  });

  describe('GET /api/trefs/:id/properties', () => {
    test('Should get TREF properties', async () => {
      const response = await request(app)
        .get(`/api/trefs/${mockTREFs[0]._id}/properties`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toBeDefined();
    });
  });

  describe('POST /api/trefs', () => {
    test('Should create a new TREF', async () => {
      const newTREF = {
        name: 'صندوق املاک جدید',
        description: 'توضیحات صندوق جدید',
        fund_type: 'mixed',
        category: 'conservative',
        total_fund_size: 2000000000, // 2 میلیارد ریال
        total_shares: 2000,
        expected_annual_return: 12,
        management_fee: 1.5,
        performance_fee: 8,
        risk_level: 'low',
        distribution_frequency: 'monthly'
      };

      const response = await request(app)
        .post('/api/trefs')
        .send(newTREF);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tref.name).toBe(newTREF.name);
      expect(response.body.data.tref.fund_manager).toBe('507f1f77bcf86cd799439012');
      expect(mockTREFs).toHaveLength(3);
    });
  });

  describe('PUT /api/trefs/:id', () => {
    test('Should update TREF', async () => {
      const updateData = {
        name: 'صندوق املاک به‌روزرسانی شده',
        expected_annual_return: 18
      };

      const response = await request(app)
        .put(`/api/trefs/${mockTREFs[0]._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tref.name).toBe(updateData.name);
      expect(response.body.data.tref.expected_annual_return).toBe(updateData.expected_annual_return);
    });

    test('Should return 403 for unauthorized update', async () => {
      const response = await request(app)
        .put(`/api/trefs/${mockTREFs[1]._id}`)
        .send({ name: 'تست غیرمجاز' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('شما مجوز ویرایش این صندوق را ندارید');
    });
  });

  describe('PUT /api/trefs/:id/launch', () => {
    test('Should launch TREF', async () => {
      // First create a planning TREF
      const newTREF = {
        name: 'صندوق در حال برنامه‌ریزی',
        description: 'توضیحات صندوق',
        fund_type: 'residential',
        category: 'moderate',
        total_fund_size: 1000000000,
        total_shares: 1000,
        expected_annual_return: 10,
        management_fee: 2
      };

      await request(app)
        .post('/api/trefs')
        .send(newTREF);

      const trefId = mockTREFs[mockTREFs.length - 1]._id;

      const response = await request(app)
        .put(`/api/trefs/${trefId}/launch`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('صندوق با موفقیت راه‌اندازی شد');
      expect(mockTREFs[mockTREFs.length - 1].status).toBe('active');
    });

    test('Should return 403 for unauthorized launch', async () => {
      const response = await request(app)
        .put(`/api/trefs/${mockTREFs[1]._id}/launch`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('شما مجوز راه‌اندازی این صندوق را ندارید');
    });
  });

  describe('POST /api/trefs/:id/properties', () => {
    test('Should add property to TREF', async () => {
      const propertyData = {
        property_id: '507f1f77bcf86cd799439015',
        property_value: 1500000000, // 1.5 میلیارد ریال
        ownership_percentage: 15
      };

      const response = await request(app)
        .post(`/api/trefs/${mockTREFs[0]._id}/properties`)
        .send(propertyData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('ملک با موفقیت به صندوق اضافه شد');
      expect(mockTREFs[0].properties).toHaveLength(1);
    });

    test('Should return 404 for non-existent property', async () => {
      const propertyData = {
        property_id: 'nonexistent',
        property_value: 1000000000,
        ownership_percentage: 10
      };

      const response = await request(app)
        .post(`/api/trefs/${mockTREFs[0]._id}/properties`)
        .send(propertyData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('ملک یافت نشد');
    });
  });

  describe('DELETE /api/trefs/:id/properties/:property_id', () => {
    test('Should remove property from TREF', async () => {
      // First add a property
      const propertyData = {
        property_id: '507f1f77bcf86cd799439015',
        property_value: 1000000000,
        ownership_percentage: 10
      };

      await request(app)
        .post(`/api/trefs/${mockTREFs[0]._id}/properties`)
        .send(propertyData);

      const response = await request(app)
        .delete(`/api/trefs/${mockTREFs[0]._id}/properties/507f1f77bcf86cd799439015`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('ملک با موفقیت از صندوق حذف شد');
      expect(mockTREFs[0].properties).toHaveLength(0);
    });

    test('Should return 404 for non-existent property in TREF', async () => {
      const response = await request(app)
        .delete(`/api/trefs/${mockTREFs[0]._id}/properties/nonexistent`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('ملک در صندوق یافت نشد');
    });
  });
});
