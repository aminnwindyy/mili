const request = require('supertest');
const express = require('express');

// Create a simple Express app for testing
const app = express();
app.use(express.json());

// Mock analytics data
const mockAnalytics = [
  {
    _id: '507f1f77bcf86cd799439011',
    analytics_type: 'user_behavior',
    category: 'dashboard',
    period: 'daily',
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-01-31'),
    metrics: {
      total_users: 1500,
      active_users: 1200,
      new_users: 150,
      user_retention_rate: 80,
      user_engagement_score: 75
    },
    trends: {
      user_growth_trend: 'increasing',
      revenue_trend: 'stable',
      market_trend: 'bullish',
      performance_trend: 'improving'
    },
    insights: [
      {
        type: 'opportunity',
        title: 'رشد کاربران',
        description: 'تعداد کاربران در حال رشد است',
        impact_score: 8,
        confidence_level: 90,
        actionable: true
      }
    ],
    visibility: 'private',
    created_at: new Date('2024-01-01')
  },
  {
    _id: '507f1f77bcf86cd799439012',
    analytics_type: 'financial_performance',
    category: 'reports',
    period: 'monthly',
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-01-31'),
    metrics: {
      total_revenue: 5000000000, // 5 میلیارد ریال
      total_volume: 10000000000, // 10 میلیارد ریال
      average_transaction_value: 1000000, // 1 میلیون ریال
      revenue_growth_rate: 15.5,
      profit_margin: 25
    },
    trends: {
      user_growth_trend: 'stable',
      revenue_trend: 'increasing',
      market_trend: 'bullish',
      performance_trend: 'improving'
    },
    insights: [
      {
        type: 'trend',
        title: 'رشد درآمد',
        description: 'درآمد ماهانه 15.5% رشد داشته است',
        impact_score: 9,
        confidence_level: 95,
        actionable: false
      }
    ],
    visibility: 'private',
    created_at: new Date('2024-01-15')
  }
];

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439012',
    email: 'analyst@example.com',
    full_name: 'تحلیلگر سیستم',
    role: 'analyst'
  };
  next();
};

// Mock admin auth middleware
const adminAuth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439015',
    email: 'admin@example.com',
    full_name: 'مدیر سیستم',
    role: 'admin'
  };
  next();
};

// Analytics Routes
app.get('/api/analytics/dashboard', auth, (req, res) => {
  const summary = {
    total_users: 1500,
    total_revenue: 5000000000,
    total_transactions: 2500,
    system_uptime: 99.9,
    performance_score: 85,
    active_alerts: 2,
    key_insights: [
      {
        type: 'opportunity',
        title: 'رشد کاربران',
        description: 'تعداد کاربران در حال رشد است'
      },
      {
        type: 'trend',
        title: 'رشد درآمد',
        description: 'درآمد ماهانه 15.5% رشد داشته است'
      }
    ]
  };

  res.json({
    success: true,
    data: { summary }
  });
});

app.get('/api/analytics/market-insights', auth, (req, res) => {
  const { period = '30d' } = req.query;
  
  const marketData = {
    total_volume: 10000000000, // 10 میلیارد ریال
    average_price: 2000000, // 2 میلیون ریال
    price_change: 8.5,
    market_cap: 50000000000 // 50 میلیارد ریال
  };
  
  const insights = [
    {
      type: 'trend',
      title: 'رشد بازار',
      description: 'بازار املاک در حال رشد است',
      impact_score: 8,
      confidence_level: 85
    },
    {
      type: 'opportunity',
      title: 'فرصت سرمایه‌گذاری',
      description: 'فرصت‌های خوبی برای سرمایه‌گذاری وجود دارد',
      impact_score: 7,
      confidence_level: 80
    }
  ];
  
  const trends = {
    direction: 'upward',
    strength: 'strong',
    volatility: 'moderate'
  };

  res.json({
    success: true,
    data: {
      period,
      market_data: marketData,
      insights,
      trends
    }
  });
});

app.get('/api/analytics/user-behavior', auth, (req, res) => {
  const { period = '30d' } = req.query;
  
  const behaviorData = {
    page_views: 50000,
    unique_visitors: 25000,
    session_duration: 450, // seconds
    bounce_rate: 20,
    conversion_rate: 12.5
  };
  
  const insights = [
    {
      type: 'opportunity',
      title: 'بهبود تجربه کاربری',
      description: 'نرخ پرش قابل بهبود است',
      impact_score: 6,
      confidence_level: 75
    },
    {
      type: 'trend',
      title: 'افزایش تعامل',
      description: 'زمان ماندگاری کاربران افزایش یافته است',
      impact_score: 7,
      confidence_level: 80
    }
  ];
  
  const engagement = {
    engagement_score: 78,
    retention_rate: 65,
    conversion_rate: 12.5,
    user_satisfaction: 4.2
  };

  res.json({
    success: true,
    data: {
      period,
      behavior_data: behaviorData,
      insights,
      engagement
    }
  });
});

app.get('/api/analytics/financial-performance', auth, (req, res) => {
  const { period = '30d' } = req.query;
  
  const financialData = {
    revenue: 5000000000, // 5 میلیارد ریال
    expenses: 3000000000, // 3 میلیارد ریال
    profit: 2000000000, // 2 میلیارد ریال
    growth_rate: 15.5,
    profit_margin: 40
  };
  
  const insights = [
    {
      type: 'trend',
      title: 'رشد درآمد',
      description: 'درآمد 15.5% رشد داشته است',
      impact_score: 8,
      confidence_level: 90
    },
    {
      type: 'opportunity',
      title: 'بهینه‌سازی هزینه‌ها',
      description: 'امکان کاهش هزینه‌ها وجود دارد',
      impact_score: 6,
      confidence_level: 70
    }
  ];
  
  const performance = {
    roi: 18.5,
    profit_margin: 40,
    revenue_growth: 15.5,
    cost_efficiency: 85
  };

  res.json({
    success: true,
    data: {
      period,
      financial_data: financialData,
      insights,
      performance
    }
  });
});

app.get('/api/analytics/system-performance', auth, (req, res) => {
  const { period = '24h' } = req.query;
  
  const systemData = {
    uptime: 99.95,
    response_time: 120, // milliseconds
    error_rate: 0.05,
    cpu_usage: 45,
    memory_usage: 60,
    disk_usage: 35
  };
  
  const insights = [
    {
      type: 'trend',
      title: 'عملکرد مطلوب',
      description: 'سیستم در وضعیت مطلوب است',
      impact_score: 9,
      confidence_level: 95
    },
    {
      type: 'opportunity',
      title: 'بهینه‌سازی حافظه',
      description: 'استفاده از حافظه قابل بهینه‌سازی است',
      impact_score: 5,
      confidence_level: 60
    }
  ];
  
  const performance = {
    performance_score: 92,
    reliability: 99.95,
    efficiency: 88,
    scalability: 85
  };

  res.json({
    success: true,
    data: {
      period,
      system_data: systemData,
      insights,
      performance
    }
  });
});

app.get('/api/analytics', auth, (req, res) => {
  const { analytics_type, category, period } = req.query;
  let filteredAnalytics = [...mockAnalytics];

  // Apply filters
  if (analytics_type) {
    filteredAnalytics = filteredAnalytics.filter(a => a.analytics_type === analytics_type);
  }
  
  if (category) {
    filteredAnalytics = filteredAnalytics.filter(a => a.category === category);
  }
  
  if (period) {
    filteredAnalytics = filteredAnalytics.filter(a => a.period === period);
  }

  res.json({
    success: true,
    data: {
      analytics: filteredAnalytics,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: filteredAnalytics.length,
        items_per_page: 10
      }
    }
  });
});

app.get('/api/analytics/:id', auth, (req, res) => {
  const analytics = mockAnalytics.find(a => a._id === req.params.id);
  
  if (!analytics) {
    return res.status(404).json({
      success: false,
      message: 'تحلیل یافت نشد'
    });
  }

  res.json({
    success: true,
    data: { analytics }
  });
});

app.get('/api/analytics/market-insights', auth, (req, res) => {
  const { period = '30d' } = req.query;
  
  const marketData = {
    total_volume: 10000000000, // 10 میلیارد ریال
    average_price: 2000000, // 2 میلیون ریال
    price_change: 8.5,
    market_cap: 50000000000 // 50 میلیارد ریال
  };
  
  const insights = [
    {
      type: 'trend',
      title: 'رشد بازار',
      description: 'بازار املاک در حال رشد است',
      impact_score: 8,
      confidence_level: 85
    },
    {
      type: 'opportunity',
      title: 'فرصت سرمایه‌گذاری',
      description: 'فرصت‌های خوبی برای سرمایه‌گذاری وجود دارد',
      impact_score: 7,
      confidence_level: 80
    }
  ];
  
  const trends = {
    direction: 'upward',
    strength: 'strong',
    volatility: 'moderate'
  };

  res.json({
    success: true,
    data: {
      period,
      market_data: marketData,
      insights,
      trends
    }
  });
});

app.get('/api/analytics/user-behavior', auth, (req, res) => {
  const { period = '30d' } = req.query;
  
  const behaviorData = {
    page_views: 50000,
    unique_visitors: 25000,
    session_duration: 450, // seconds
    bounce_rate: 20,
    conversion_rate: 12.5
  };
  
  const insights = [
    {
      type: 'opportunity',
      title: 'بهبود تجربه کاربری',
      description: 'نرخ پرش قابل بهبود است',
      impact_score: 6,
      confidence_level: 75
    },
    {
      type: 'trend',
      title: 'افزایش تعامل',
      description: 'زمان ماندگاری کاربران افزایش یافته است',
      impact_score: 7,
      confidence_level: 80
    }
  ];
  
  const engagement = {
    engagement_score: 78,
    retention_rate: 65,
    conversion_rate: 12.5,
    user_satisfaction: 4.2
  };

  res.json({
    success: true,
    data: {
      period,
      behavior_data: behaviorData,
      insights,
      engagement
    }
  });
});

app.get('/api/analytics/financial-performance', auth, (req, res) => {
  const { period = '30d' } = req.query;
  
  const financialData = {
    revenue: 5000000000, // 5 میلیارد ریال
    expenses: 3000000000, // 3 میلیارد ریال
    profit: 2000000000, // 2 میلیارد ریال
    growth_rate: 15.5,
    profit_margin: 40
  };
  
  const insights = [
    {
      type: 'trend',
      title: 'رشد درآمد',
      description: 'درآمد 15.5% رشد داشته است',
      impact_score: 8,
      confidence_level: 90
    },
    {
      type: 'opportunity',
      title: 'بهینه‌سازی هزینه‌ها',
      description: 'امکان کاهش هزینه‌ها وجود دارد',
      impact_score: 6,
      confidence_level: 70
    }
  ];
  
  const performance = {
    roi: 18.5,
    profit_margin: 40,
    revenue_growth: 15.5,
    cost_efficiency: 85
  };

  res.json({
    success: true,
    data: {
      period,
      financial_data: financialData,
      insights,
      performance
    }
  });
});

app.get('/api/analytics/system-performance', auth, (req, res) => {
  const { period = '24h' } = req.query;
  
  const systemData = {
    uptime: 99.95,
    response_time: 120, // milliseconds
    error_rate: 0.05,
    cpu_usage: 45,
    memory_usage: 60,
    disk_usage: 35
  };
  
  const insights = [
    {
      type: 'trend',
      title: 'عملکرد مطلوب',
      description: 'سیستم در وضعیت مطلوب است',
      impact_score: 9,
      confidence_level: 95
    },
    {
      type: 'opportunity',
      title: 'بهینه‌سازی حافظه',
      description: 'استفاده از حافظه قابل بهینه‌سازی است',
      impact_score: 5,
      confidence_level: 60
    }
  ];
  
  const performance = {
    performance_score: 92,
    reliability: 99.95,
    efficiency: 88,
    scalability: 85
  };

  res.json({
    success: true,
    data: {
      period,
      system_data: systemData,
      insights,
      performance
    }
  });
});

app.post('/api/analytics', adminAuth, (req, res) => {
  const {
    analytics_type,
    category,
    period,
    start_date,
    end_date,
    description,
    tags,
    visibility = 'private'
  } = req.body;

  const newAnalytics = {
    _id: '507f1f77bcf86cd799439013',
    analytics_type,
    category,
    period,
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    metrics: {
      total_users: 1000,
      total_revenue: 2000000000,
      total_transactions: 1500,
      system_uptime: 99.5
    },
    trends: {
      user_growth_trend: 'stable',
      revenue_trend: 'increasing',
      market_trend: 'bullish',
      performance_trend: 'improving'
    },
    insights: [
      {
        type: 'trend',
        title: 'تحلیل جدید',
        description: 'تحلیل جدید ایجاد شده است',
        impact_score: 7,
        confidence_level: 80,
        actionable: true
      }
    ],
    visibility,
    tags: tags || [],
    created_by: req.user.id,
    created_at: new Date()
  };

  mockAnalytics.push(newAnalytics);

  res.status(201).json({
    success: true,
    message: 'تحلیل با موفقیت ایجاد شد',
    data: { analytics: newAnalytics }
  });
});

describe('Analytics API Tests (Simple Mock)', () => {
  beforeEach(() => {
    // Reset mock data
    mockAnalytics.length = 2;
  });

  describe('Dashboard API', () => {
    test('Should get dashboard summary', async () => {
      const response = await request(app)
        .get('/api/analytics/dashboard');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.summary.total_users).toBe(1500);
      expect(response.body.data.summary.total_revenue).toBe(5000000000);
      expect(response.body.data.summary.key_insights).toHaveLength(2);
    });
  });

  describe('Analytics CRUD', () => {
    test('Should get all analytics', async () => {
      const response = await request(app)
        .get('/api/analytics');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.analytics).toHaveLength(2);
      expect(response.body.data.analytics[0].analytics_type).toBe('user_behavior');
    });

    test('Should filter analytics by type', async () => {
      const response = await request(app)
        .get('/api/analytics')
        .query({ analytics_type: 'financial_performance' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.analytics).toHaveLength(1);
      expect(response.body.data.analytics[0].analytics_type).toBe('financial_performance');
    });

    test('Should filter analytics by category', async () => {
      const response = await request(app)
        .get('/api/analytics')
        .query({ category: 'dashboard' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.analytics).toHaveLength(1);
      expect(response.body.data.analytics[0].category).toBe('dashboard');
    });

    test('Should get single analytics by ID', async () => {
      const response = await request(app)
        .get(`/api/analytics/${mockAnalytics[0]._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.analytics.analytics_type).toBe('user_behavior');
    });

    test('Should return 404 for non-existent analytics', async () => {
      const response = await request(app)
        .get('/api/analytics/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('تحلیل یافت نشد');
    });

    test('Should create new analytics', async () => {
      const newAnalytics = {
        analytics_type: 'system_performance',
        category: 'reports',
        period: 'daily',
        start_date: '2024-02-01',
        end_date: '2024-02-28',
        description: 'تحلیل عملکرد سیستم',
        tags: ['performance', 'system'],
        visibility: 'private'
      };

      const response = await request(app)
        .post('/api/analytics')
        .send(newAnalytics);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.analytics.analytics_type).toBe('system_performance');
      expect(mockAnalytics).toHaveLength(3);
    });
  });

  describe('Market Insights API', () => {
    test('Should get market insights', async () => {
      const response = await request(app)
        .get('/api/analytics/market-insights');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.market_data.total_volume).toBe(10000000000);
      expect(response.body.data.insights).toHaveLength(2);
      expect(response.body.data.trends.direction).toBe('upward');
    });

    test('Should get market insights with custom period', async () => {
      const response = await request(app)
        .get('/api/analytics/market-insights')
        .query({ period: '7d' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.period).toBe('7d');
    });
  });

  describe('User Behavior Analytics API', () => {
    test('Should get user behavior analytics', async () => {
      const response = await request(app)
        .get('/api/analytics/user-behavior');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.behavior_data.page_views).toBe(50000);
      expect(response.body.data.insights).toHaveLength(2);
      expect(response.body.data.engagement.engagement_score).toBe(78);
    });
  });

  describe('Financial Performance API', () => {
    test('Should get financial performance analytics', async () => {
      const response = await request(app)
        .get('/api/analytics/financial-performance');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.financial_data.revenue).toBe(5000000000);
      expect(response.body.data.insights).toHaveLength(2);
      expect(response.body.data.performance.roi).toBe(18.5);
    });
  });

  describe('System Performance API', () => {
    test('Should get system performance analytics', async () => {
      const response = await request(app)
        .get('/api/analytics/system-performance');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.system_data.uptime).toBe(99.95);
      expect(response.body.data.insights).toHaveLength(2);
      expect(response.body.data.performance.performance_score).toBe(92);
    });
  });
});
