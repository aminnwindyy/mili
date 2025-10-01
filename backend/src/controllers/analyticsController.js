const { validationResult } = require('express-validator');
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Property = require('../models/Property');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const TREF = require('../models/TREF');
const { sanitizeInput } = require('../utils/helpers');

// Get dashboard summary
const getDashboardSummary = async (req, res) => {
  try {
    const summary = await Analytics.getDashboardSummary();
    
    // Get additional real-time data
    const realTimeData = await getRealTimeMetrics();
    
    res.json({
      success: true,
      data: {
        summary: {
          ...summary,
          ...realTimeData
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت خلاصه داشبورد',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get analytics by filters
const getAnalytics = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      analytics_type,
      category,
      period,
      start_date,
      end_date,
      tags,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter object
    const filters = {};
    if (analytics_type) filters.analytics_type = analytics_type;
    if (category) filters.category = category;
    if (period) filters.period = period;
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;
    if (tags) filters.tags = Array.isArray(tags) ? tags : [tags];

    // Build sort object
    const sort = {};
    sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const analytics = await Analytics.getAnalyticsByFilters(filters)
      .populate('created_by', 'full_name email')
      .populate('last_updated_by', 'full_name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Analytics.getAnalyticsByFilters(filters).countDocuments();

    res.json({
      success: true,
      data: {
        analytics,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تحلیل‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get single analytics by ID
const getAnalyticsById = async (req, res) => {
  try {
    const { id } = req.params;

    const analytics = await Analytics.findById(id)
      .populate('created_by', 'full_name email')
      .populate('last_updated_by', 'full_name email');

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

  } catch (error) {
    console.error('Get analytics by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات تحلیل',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Create new analytics
const createAnalytics = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const {
      analytics_type,
      category,
      period,
      start_date,
      end_date,
      description,
      tags,
      visibility = 'private',
      allowed_roles = ['admin']
    } = req.body;

    // Calculate metrics based on analytics type
    const metrics = await calculateMetrics(analytics_type, start_date, end_date);
    
    // Generate insights
    const insights = await generateInsights(analytics_type, metrics);
    
    // Generate predictions
    const predictions = await generatePredictions(analytics_type, metrics);
    
    // Check for alerts
    const alerts = await checkAlerts(analytics_type, metrics);

    const analyticsData = {
      analytics_type,
      category,
      period,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      metrics,
      insights,
      predictions,
      alerts,
      description: sanitizeInput(description) || '',
      tags: tags || [],
      visibility,
      allowed_roles,
      created_by: req.user.id
    };

    const analytics = new Analytics(analyticsData);
    await analytics.save();

    res.status(201).json({
      success: true,
      message: 'تحلیل با موفقیت ایجاد شد',
      data: { analytics }
    });

  } catch (error) {
    console.error('Create analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد تحلیل',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get market insights
const getMarketInsights = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFrom;
    switch (period) {
      case '7d':
        dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        dateFrom = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get market data
    const marketData = await getMarketData(dateFrom);
    
    // Generate market insights
    const insights = await generateMarketInsights(marketData);
    
    // Get trend analysis
    const trends = await analyzeTrends(marketData);

    res.json({
      success: true,
      data: {
        period,
        market_data: marketData,
        insights,
        trends
      }
    });

  } catch (error) {
    console.error('Get market insights error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت بینش‌های بازار',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get user behavior analytics
const getUserBehaviorAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFrom;
    switch (period) {
      case '7d':
        dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        dateFrom = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get user behavior data
    const behaviorData = await getUserBehaviorData(dateFrom);
    
    // Generate user insights
    const insights = await generateUserInsights(behaviorData);
    
    // Get engagement metrics
    const engagement = await calculateEngagementMetrics(behaviorData);

    res.json({
      success: true,
      data: {
        period,
        behavior_data: behaviorData,
        insights,
        engagement
      }
    });

  } catch (error) {
    console.error('Get user behavior analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تحلیل رفتار کاربران',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get financial performance analytics
const getFinancialPerformance = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFrom;
    switch (period) {
      case '7d':
        dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        dateFrom = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get financial data
    const financialData = await getFinancialData(dateFrom);
    
    // Generate financial insights
    const insights = await generateFinancialInsights(financialData);
    
    // Get performance metrics
    const performance = await calculatePerformanceMetrics(financialData);

    res.json({
      success: true,
      data: {
        period,
        financial_data: financialData,
        insights,
        performance
      }
    });

  } catch (error) {
    console.error('Get financial performance error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تحلیل عملکرد مالی',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get system performance analytics
const getSystemPerformance = async (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    let dateFrom;
    switch (period) {
      case '1h':
        dateFrom = new Date(Date.now() - 60 * 60 * 1000);
        break;
      case '24h':
        dateFrom = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    // Get system data
    const systemData = await getSystemData(dateFrom);
    
    // Generate system insights
    const insights = await generateSystemInsights(systemData);
    
    // Get performance metrics
    const performance = await calculateSystemMetrics(systemData);

    res.json({
      success: true,
      data: {
        period,
        system_data: systemData,
        insights,
        performance
      }
    });

  } catch (error) {
    console.error('Get system performance error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تحلیل عملکرد سیستم',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Helper function to get real-time metrics
const getRealTimeMetrics = async () => {
  try {
    const [
      totalUsers,
      totalProperties,
      totalInvestments,
      totalTransactions,
      totalWallets
    ] = await Promise.all([
      User.countDocuments({ is_active: true }),
      Property.countDocuments({ status: 'active' }),
      Investment.countDocuments({ status: 'active' }),
      Transaction.countDocuments({ status: 'completed' }),
      Wallet.countDocuments({ status: 'active' })
    ]);

    return {
      total_users: totalUsers,
      total_properties: totalProperties,
      total_investments: totalInvestments,
      total_transactions: totalTransactions,
      total_wallets: totalWallets
    };
  } catch (error) {
    console.error('Get real-time metrics error:', error);
    return {};
  }
};

// Helper function to calculate metrics
const calculateMetrics = async (analyticsType, startDate, endDate) => {
  const metrics = {};
  
  switch (analyticsType) {
    case 'user_behavior':
      metrics.total_users = await User.countDocuments({ 
        created_at: { $gte: startDate, $lte: endDate } 
      });
      metrics.active_users = await User.countDocuments({ 
        is_active: true,
        last_login: { $gte: startDate, $lte: endDate }
      });
      break;
      
    case 'financial_performance':
      const transactions = await Transaction.find({
        created_at: { $gte: startDate, $lte: endDate },
        status: 'completed'
      });
      
      metrics.total_revenue = transactions.reduce((sum, t) => sum + t.amount, 0);
      metrics.total_transactions = transactions.length;
      metrics.average_transaction_value = transactions.length > 0 ? 
        metrics.total_revenue / transactions.length : 0;
      break;
      
    case 'property_analytics':
      metrics.total_properties = await Property.countDocuments({
        created_at: { $gte: startDate, $lte: endDate }
      });
      metrics.active_properties = await Property.countDocuments({
        status: 'active',
        created_at: { $gte: startDate, $lte: endDate }
      });
      break;
      
    case 'investment_analytics':
      metrics.total_investments = await Investment.countDocuments({
        created_at: { $gte: startDate, $lte: endDate }
      });
      metrics.total_investment_amount = await Investment.aggregate([
        { $match: { created_at: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$total_investment_amount' } } }
      ]);
      break;
      
    default:
      break;
  }
  
  return metrics;
};

// Helper function to generate insights
const generateInsights = async (analyticsType, metrics) => {
  const insights = [];
  
  // Generate insights based on metrics
  if (metrics.total_users > 1000) {
    insights.push({
      type: 'opportunity',
      title: 'رشد کاربران',
      description: 'تعداد کاربران از 1000 نفر تجاوز کرده است',
      impact_score: 8,
      confidence_level: 90,
      actionable: true
    });
  }
  
  if (metrics.total_revenue > 1000000000) { // 1 billion
    insights.push({
      type: 'trend',
      title: 'درآمد بالا',
      description: 'درآمد کل از 1 میلیارد ریال تجاوز کرده است',
      impact_score: 9,
      confidence_level: 95,
      actionable: false
    });
  }
  
  return insights;
};

// Helper function to generate predictions
const generatePredictions = async (analyticsType, metrics) => {
  const predictions = [];
  
  // Simple prediction logic (in real app, use ML models)
  if (metrics.total_users > 0) {
    predictions.push({
      metric_name: 'total_users',
      predicted_value: Math.round(metrics.total_users * 1.1), // 10% growth
      confidence_interval: {
        lower: Math.round(metrics.total_users * 0.95),
        upper: Math.round(metrics.total_users * 1.25)
      },
      prediction_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      accuracy_score: 75
    });
  }
  
  return predictions;
};

// Helper function to check alerts
const checkAlerts = async (analyticsType, metrics) => {
  const alerts = [];
  
  // Check for threshold alerts
  if (metrics.error_rate > 5) {
    alerts.push({
      alert_type: 'threshold_exceeded',
      severity: 'high',
      message: 'نرخ خطا از 5% تجاوز کرده است',
      threshold_value: 5,
      actual_value: metrics.error_rate
    });
  }
  
  if (metrics.system_uptime < 99) {
    alerts.push({
      alert_type: 'performance_issue',
      severity: 'critical',
      message: 'زمان فعالیت سیستم کمتر از 99% است',
      threshold_value: 99,
      actual_value: metrics.system_uptime
    });
  }
  
  return alerts;
};

// Additional helper functions (simplified for demo)
const getMarketData = async (dateFrom) => {
  // Mock market data
  return {
    total_volume: 5000000000,
    average_price: 1000000,
    price_change: 5.2,
    market_cap: 10000000000
  };
};

const generateMarketInsights = async (marketData) => {
  return [
    {
      type: 'trend',
      title: 'رشد بازار',
      description: 'بازار در حال رشد است',
      impact_score: 7,
      confidence_level: 80
    }
  ];
};

const analyzeTrends = async (marketData) => {
  return {
    direction: 'upward',
    strength: 'moderate',
    volatility: 'low'
  };
};

const getUserBehaviorData = async (dateFrom) => {
  return {
    page_views: 10000,
    unique_visitors: 5000,
    session_duration: 300,
    bounce_rate: 25
  };
};

const generateUserInsights = async (behaviorData) => {
  return [
    {
      type: 'opportunity',
      title: 'بهبود تجربه کاربری',
      description: 'نرخ پرش قابل بهبود است',
      impact_score: 6,
      confidence_level: 75
    }
  ];
};

const calculateEngagementMetrics = async (behaviorData) => {
  return {
    engagement_score: 75,
    retention_rate: 60,
    conversion_rate: 15
  };
};

const getFinancialData = async (dateFrom) => {
  return {
    revenue: 1000000000,
    expenses: 600000000,
    profit: 400000000,
    growth_rate: 12.5
  };
};

const generateFinancialInsights = async (financialData) => {
  return [
    {
      type: 'opportunity',
      title: 'رشد درآمد',
      description: 'درآمد در حال رشد است',
      impact_score: 8,
      confidence_level: 85
    }
  ];
};

const calculatePerformanceMetrics = async (financialData) => {
  return {
    roi: 15.5,
    profit_margin: 40,
    revenue_growth: 12.5
  };
};

const getSystemData = async (dateFrom) => {
  return {
    uptime: 99.9,
    response_time: 150,
    error_rate: 0.1,
    cpu_usage: 45
  };
};

const generateSystemInsights = async (systemData) => {
  return [
    {
      type: 'trend',
      title: 'عملکرد سیستم',
      description: 'سیستم در وضعیت مطلوب است',
      impact_score: 9,
      confidence_level: 95
    }
  ];
};

const calculateSystemMetrics = async (systemData) => {
  return {
    performance_score: 95,
    reliability: 99.9,
    efficiency: 85
  };
};

module.exports = {
  getDashboardSummary,
  getAnalytics,
  getAnalyticsById,
  createAnalytics,
  getMarketInsights,
  getUserBehaviorAnalytics,
  getFinancialPerformance,
  getSystemPerformance
};
