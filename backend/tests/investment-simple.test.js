const request = require('supertest');
const express = require('express');

// Create a simple Express app for testing
const app = express();
app.use(express.json());

// Mock investment data
const mockInvestments = [
  {
    _id: '507f1f77bcf86cd799439011',
    investor: '507f1f77bcf86cd799439012',
    investor_email: 'investor1@example.com',
    investor_name: 'سرمایه‌گذار اول',
    property: '507f1f77bcf86cd799439013',
    property_title: 'آپارتمان لوکس در تهران',
    property_address: 'تهران، منطقه 1',
    investment_amount: 50000000, // 50 میلیون ریال
    tokens_purchased: 10,
    token_price_at_purchase: 5000000, // 5 میلیون ریال
    status: 'active',
    payment_method: 'bank_transfer',
    payment_status: 'completed',
    investment_date: new Date('2024-01-01'),
    current_value: 55000000, // 55 میلیون ریال
    profit_loss: 5000000, // 5 میلیون ریال سود
    profit_loss_percentage: 10,
    is_listed_for_sale: false,
    created_at: new Date('2024-01-01')
  },
  {
    _id: '507f1f77bcf86cd799439014',
    investor: '507f1f77bcf86cd799439015',
    investor_email: 'investor2@example.com',
    investor_name: 'سرمایه‌گذار دوم',
    property: '507f1f77bcf86cd799439016',
    property_title: 'خانه ویلایی در شیراز',
    property_address: 'شیراز، منطقه 3',
    investment_amount: 30000000, // 30 میلیون ریال
    tokens_purchased: 6,
    token_price_at_purchase: 5000000,
    status: 'active',
    payment_method: 'credit_card',
    payment_status: 'completed',
    investment_date: new Date('2024-02-01'),
    current_value: 31500000, // 31.5 میلیون ریال
    profit_loss: 1500000, // 1.5 میلیون ریال سود
    profit_loss_percentage: 5,
    is_listed_for_sale: true,
    sale_price: 32000000,
    sale_listing_date: new Date('2024-03-01'),
    created_at: new Date('2024-02-01')
  }
];

// Mock property data
const mockProperties = [
  {
    _id: '507f1f77bcf86cd799439013',
    title: 'آپارتمان لوکس در تهران',
    address: 'تهران، منطقه 1',
    city: 'تهران',
    property_type: 'آپارتمان',
    token_price: 5000000,
    available_tokens: 90,
    status: 'در_حال_فروش',
    expected_annual_return: 15
  },
  {
    _id: '507f1f77bcf86cd799439016',
    title: 'خانه ویلایی در شیراز',
    address: 'شیراز، منطقه 3',
    city: 'شیراز',
    property_type: 'خانه',
    token_price: 5000000,
    available_tokens: 94,
    status: 'در_حال_فروش',
    expected_annual_return: 12
  }
];

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439012',
    email: 'investor1@example.com',
    full_name: 'سرمایه‌گذار اول',
    role: 'investor'
  };
  next();
};

// Routes
app.get('/api/investments', (req, res) => {
  const { status, investor, is_listed_for_sale } = req.query;
  let filteredInvestments = [...mockInvestments];

  // Apply filters
  if (status) {
    filteredInvestments = filteredInvestments.filter(inv => inv.status === status);
  }
  
  if (investor) {
    filteredInvestments = filteredInvestments.filter(inv => inv.investor === investor);
  }
  
  if (is_listed_for_sale !== undefined) {
    const isListed = is_listed_for_sale === 'true';
    filteredInvestments = filteredInvestments.filter(inv => inv.is_listed_for_sale === isListed);
  }

  res.json({
    success: true,
    data: {
      investments: filteredInvestments,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: filteredInvestments.length,
        items_per_page: 10
      }
    }
  });
});

app.get('/api/investments/my-portfolio', auth, (req, res) => {
  const userInvestments = mockInvestments.filter(inv => inv.investor === req.user.id);
  
  const portfolioStats = {
    total_investments: userInvestments.length,
    total_amount: userInvestments.reduce((sum, inv) => sum + inv.investment_amount, 0),
    total_current_value: userInvestments.reduce((sum, inv) => sum + inv.current_value, 0),
    total_profit_loss: userInvestments.reduce((sum, inv) => sum + inv.profit_loss, 0),
    avg_return_percentage: userInvestments.length > 0 
      ? userInvestments.reduce((sum, inv) => sum + inv.profit_loss_percentage, 0) / userInvestments.length 
      : 0,
    active_investments: userInvestments.filter(inv => inv.status === 'active').length
  };

  res.json({
    success: true,
    data: {
      investments: userInvestments,
      portfolio_stats: portfolioStats,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: userInvestments.length,
        items_per_page: 10
      }
    }
  });
});

app.get('/api/investments/secondary-market', (req, res) => {
  const secondaryMarketInvestments = mockInvestments.filter(inv => inv.is_listed_for_sale);

  res.json({
    success: true,
    data: {
      investments: secondaryMarketInvestments,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: secondaryMarketInvestments.length,
        items_per_page: 10
      }
    }
  });
});

app.get('/api/investments/:id', (req, res) => {
  const investment = mockInvestments.find(inv => inv._id === req.params.id);
  
  if (!investment) {
    return res.status(404).json({
      success: false,
      message: 'سرمایه‌گذاری یافت نشد'
    });
  }

  res.json({
    success: true,
    data: { investment }
  });
});

app.post('/api/investments', auth, (req, res) => {
  const { property_id, investment_amount, tokens_purchased, payment_method } = req.body;
  
  // Find property
  const property = mockProperties.find(p => p._id === property_id);
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'ملک یافت نشد'
    });
  }

  // Check available tokens
  if (property.available_tokens < tokens_purchased) {
    return res.status(400).json({
      success: false,
      message: `تعداد توکن‌های موجود: ${property.available_tokens}، درخواست شده: ${tokens_purchased}`
    });
  }

  // Calculate expected amount
  const expectedAmount = tokens_purchased * property.token_price;
  if (Math.abs(expectedAmount - investment_amount) > 1000) {
    return res.status(400).json({
      success: false,
      message: `مبلغ محاسبه شده: ${expectedAmount.toLocaleString('fa-IR')} ریال، مبلغ وارد شده: ${investment_amount.toLocaleString('fa-IR')} ریال`
    });
  }

  // Create new investment
  const newInvestment = {
    _id: '507f1f77bcf86cd799439017',
    investor: req.user.id,
    investor_email: req.user.email,
    investor_name: req.user.full_name,
    property: property_id,
    property_title: property.title,
    property_address: property.address,
    investment_amount: expectedAmount,
    tokens_purchased,
    token_price_at_purchase: property.token_price,
    status: 'pending',
    payment_method,
    payment_status: 'pending',
    investment_date: new Date(),
    current_value: expectedAmount,
    profit_loss: 0,
    profit_loss_percentage: 0,
    is_listed_for_sale: false,
    created_at: new Date()
  };

  mockInvestments.push(newInvestment);
  
  // Update property available tokens
  property.available_tokens -= tokens_purchased;

  res.status(201).json({
    success: true,
    message: 'سرمایه‌گذاری با موفقیت ثبت شد',
    data: { investment: newInvestment }
  });
});

app.put('/api/investments/:id/cancel', auth, (req, res) => {
  const investmentIndex = mockInvestments.findIndex(inv => inv._id === req.params.id);
  
  if (investmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'سرمایه‌گذاری یافت نشد'
    });
  }

  const investment = mockInvestments[investmentIndex];

  // Check ownership
  if (investment.investor !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'شما مجوز لغو این سرمایه‌گذاری را ندارید'
    });
  }

  // Check if investment can be cancelled
  if (investment.status !== 'pending' && investment.status !== 'confirmed') {
    return res.status(400).json({
      success: false,
      message: 'این سرمایه‌گذاری قابل لغو نیست'
    });
  }

  // Update investment status
  investment.status = 'cancelled';
  
  // Return tokens to property
  const property = mockProperties.find(p => p._id === investment.property);
  if (property) {
    property.available_tokens += investment.tokens_purchased;
  }

  res.json({
    success: true,
    message: 'سرمایه‌گذاری با موفقیت لغو شد',
    data: { investment }
  });
});

app.put('/api/investments/:id/list-for-sale', auth, (req, res) => {
  const investmentIndex = mockInvestments.findIndex(inv => inv._id === req.params.id);
  
  if (investmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'سرمایه‌گذاری یافت نشد'
    });
  }

  const investment = mockInvestments[investmentIndex];

  // Check ownership
  if (investment.investor !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'شما مجوز فروش این سرمایه‌گذاری را ندارید'
    });
  }

  // Check if investment is active
  if (investment.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'فقط سرمایه‌گذاری‌های فعال قابل فروش هستند'
    });
  }

  // Update investment
  investment.is_listed_for_sale = true;
  investment.sale_price = req.body.sale_price || investment.current_value;
  investment.sale_listing_date = new Date();

  res.json({
    success: true,
    message: 'سرمایه‌گذاری برای فروش قرار گرفت',
    data: { investment }
  });
});

app.put('/api/investments/:id/remove-from-sale', auth, (req, res) => {
  const investmentIndex = mockInvestments.findIndex(inv => inv._id === req.params.id);
  
  if (investmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'سرمایه‌گذاری یافت نشد'
    });
  }

  const investment = mockInvestments[investmentIndex];

  // Check ownership
  if (investment.investor !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'شما مجوز حذف این سرمایه‌گذاری از فروش را ندارید'
    });
  }

  // Update investment
  investment.is_listed_for_sale = false;
  investment.sale_price = undefined;
  investment.sale_listing_date = undefined;

  res.json({
    success: true,
    message: 'سرمایه‌گذاری از فروش حذف شد',
    data: { investment }
  });
});

describe('Investment API Tests (Simple Mock)', () => {
  beforeEach(() => {
    // Reset mock data
    mockInvestments.length = 2;
    mockInvestments[0].status = 'active';
    mockInvestments[0].is_listed_for_sale = false;
    mockInvestments[1].status = 'active';
    mockInvestments[1].is_listed_for_sale = true;
    
    mockProperties.length = 2;
    mockProperties[0].available_tokens = 90;
    mockProperties[1].available_tokens = 94;
  });

  describe('GET /api/investments', () => {
    test('Should get all investments', async () => {
      const response = await request(app)
        .get('/api/investments');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.investments).toHaveLength(2);
      expect(response.body.data.investments[0].investor_name).toBe('سرمایه‌گذار اول');
    });

    test('Should filter investments by status', async () => {
      const response = await request(app)
        .get('/api/investments')
        .query({ status: 'active' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.investments).toHaveLength(2);
      expect(response.body.data.investments.every(inv => inv.status === 'active')).toBe(true);
    });

    test('Should filter investments by investor', async () => {
      const response = await request(app)
        .get('/api/investments')
        .query({ investor: '507f1f77bcf86cd799439012' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.investments).toHaveLength(1);
      expect(response.body.data.investments[0].investor).toBe('507f1f77bcf86cd799439012');
    });

    test('Should filter investments listed for sale', async () => {
      const response = await request(app)
        .get('/api/investments')
        .query({ is_listed_for_sale: 'true' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.investments).toHaveLength(1);
      expect(response.body.data.investments[0].is_listed_for_sale).toBe(true);
    });
  });

  describe('GET /api/investments/my-portfolio', () => {
    test('Should get user portfolio', async () => {
      const response = await request(app)
        .get('/api/investments/my-portfolio');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.investments).toHaveLength(1);
      expect(response.body.data.portfolio_stats.total_investments).toBe(1);
      expect(response.body.data.portfolio_stats.total_amount).toBe(50000000);
      expect(response.body.data.portfolio_stats.total_current_value).toBe(55000000);
      expect(response.body.data.portfolio_stats.total_profit_loss).toBe(5000000);
    });
  });

  describe('GET /api/investments/secondary-market', () => {
    test('Should get secondary market listings', async () => {
      const response = await request(app)
        .get('/api/investments/secondary-market');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.investments).toHaveLength(1);
      expect(response.body.data.investments[0].is_listed_for_sale).toBe(true);
    });
  });

  describe('GET /api/investments/:id', () => {
    test('Should get single investment by ID', async () => {
      const response = await request(app)
        .get(`/api/investments/${mockInvestments[0]._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.investment.investor_name).toBe('سرمایه‌گذار اول');
    });

    test('Should return 404 for non-existent investment', async () => {
      const response = await request(app)
        .get('/api/investments/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('سرمایه‌گذاری یافت نشد');
    });
  });

  describe('POST /api/investments', () => {
    test('Should create a new investment', async () => {
      const newInvestment = {
        property_id: '507f1f77bcf86cd799439013',
        investment_amount: 25000000, // 25 میلیون ریال
        tokens_purchased: 5,
        payment_method: 'bank_transfer'
      };

      const response = await request(app)
        .post('/api/investments')
        .send(newInvestment);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.investment.tokens_purchased).toBe(5);
      expect(response.body.data.investment.investor).toBe('507f1f77bcf86cd799439012');
      expect(mockInvestments).toHaveLength(3);
      expect(mockProperties[0].available_tokens).toBe(85); // 90 - 5
    });

    test('Should reject investment with insufficient tokens', async () => {
      const newInvestment = {
        property_id: '507f1f77bcf86cd799439013',
        investment_amount: 500000000, // 500 میلیون ریال
        tokens_purchased: 100, // More than available
        payment_method: 'bank_transfer'
      };

      const response = await request(app)
        .post('/api/investments')
        .send(newInvestment);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('تعداد توکن‌های موجود');
    });

    test('Should reject investment with wrong amount', async () => {
      const newInvestment = {
        property_id: '507f1f77bcf86cd799439013',
        investment_amount: 20000000, // Wrong amount
        tokens_purchased: 5, // Should be 25 million
        payment_method: 'bank_transfer'
      };

      const response = await request(app)
        .post('/api/investments')
        .send(newInvestment);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('مبلغ محاسبه شده');
    });
  });

  describe('PUT /api/investments/:id/cancel', () => {
    test('Should cancel investment', async () => {
      // First create a pending investment
      const newInvestment = {
        property_id: '507f1f77bcf86cd799439013',
        investment_amount: 25000000,
        tokens_purchased: 5,
        payment_method: 'bank_transfer'
      };

      await request(app)
        .post('/api/investments')
        .send(newInvestment);

      const investmentId = mockInvestments[mockInvestments.length - 1]._id;

      const response = await request(app)
        .put(`/api/investments/${investmentId}/cancel`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('سرمایه‌گذاری با موفقیت لغو شد');
      expect(mockInvestments[mockInvestments.length - 1].status).toBe('cancelled');
      expect(mockProperties[0].available_tokens).toBe(90); // Tokens returned
    });

    test('Should return 403 for unauthorized cancellation', async () => {
      const response = await request(app)
        .put(`/api/investments/${mockInvestments[1]._id}/cancel`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('شما مجوز لغو این سرمایه‌گذاری را ندارید');
    });
  });

  describe('PUT /api/investments/:id/list-for-sale', () => {
    test('Should list investment for sale', async () => {
      const response = await request(app)
        .put(`/api/investments/${mockInvestments[0]._id}/list-for-sale`)
        .send({ sale_price: 60000000 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('سرمایه‌گذاری برای فروش قرار گرفت');
      expect(mockInvestments[0].is_listed_for_sale).toBe(true);
      expect(mockInvestments[0].sale_price).toBe(60000000);
    });

    test('Should return 403 for unauthorized listing', async () => {
      const response = await request(app)
        .put(`/api/investments/${mockInvestments[1]._id}/list-for-sale`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('شما مجوز فروش این سرمایه‌گذاری را ندارید');
    });
  });

  describe('PUT /api/investments/:id/remove-from-sale', () => {
    test('Should remove investment from sale', async () => {
      // Use the first investment which belongs to the authenticated user
      const response = await request(app)
        .put(`/api/investments/${mockInvestments[0]._id}/remove-from-sale`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('سرمایه‌گذاری از فروش حذف شد');
      expect(mockInvestments[0].is_listed_for_sale).toBe(false);
    });

    test('Should return 403 for unauthorized removal', async () => {
      const response = await request(app)
        .put(`/api/investments/${mockInvestments[1]._id}/remove-from-sale`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('شما مجوز حذف این سرمایه‌گذاری از فروش را ندارید');
    });
  });
});
