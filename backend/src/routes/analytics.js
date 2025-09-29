const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getDashboardSummary,
  getAnalytics,
  getAnalyticsById,
  createAnalytics,
  getMarketInsights,
  getUserBehaviorAnalytics,
  getFinancialPerformance,
  getSystemPerformance
} = require('../controllers/analyticsController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createAnalyticsValidation = [
  body('analytics_type')
    .isIn(['user_behavior', 'financial_performance', 'market_trends', 'property_analytics', 'investment_analytics', 'transaction_analytics', 'system_performance', 'compliance_metrics'])
    .withMessage('نوع تحلیل نامعتبر است'),
  
  body('category')
    .isIn(['dashboard', 'reports', 'insights', 'predictions', 'alerts', 'benchmarks'])
    .withMessage('دسته‌بندی تحلیل نامعتبر است'),
  
  body('period')
    .isIn(['hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'real_time'])
    .withMessage('دوره زمانی نامعتبر است'),
  
  body('start_date')
    .isISO8601()
    .withMessage('تاریخ شروع نامعتبر است'),
  
  body('end_date')
    .isISO8601()
    .withMessage('تاریخ پایان نامعتبر است'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('توضیحات نمی‌تواند بیش از 1000 کاراکتر باشد'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('برچسب‌ها باید آرایه باشد'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'private', 'restricted', 'admin_only'])
    .withMessage('وضعیت نمایش نامعتبر است'),
  
  body('allowed_roles')
    .optional()
    .isArray()
    .withMessage('نقش‌های مجاز باید آرایه باشد')
];

const getAnalyticsValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه تحلیل نامعتبر است')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('شماره صفحه باید عدد صحیح مثبت باشد'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('تعداد آیتم‌ها باید بین 1 تا 100 باشد'),
  
  query('analytics_type')
    .optional()
    .isIn(['user_behavior', 'financial_performance', 'market_trends', 'property_analytics', 'investment_analytics', 'transaction_analytics', 'system_performance', 'compliance_metrics'])
    .withMessage('نوع تحلیل نامعتبر است'),
  
  query('category')
    .optional()
    .isIn(['dashboard', 'reports', 'insights', 'predictions', 'alerts', 'benchmarks'])
    .withMessage('دسته‌بندی تحلیل نامعتبر است'),
  
  query('period')
    .optional()
    .isIn(['hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'real_time'])
    .withMessage('دوره زمانی نامعتبر است'),
  
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('تاریخ شروع نامعتبر است'),
  
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('تاریخ پایان نامعتبر است'),
  
  query('tags')
    .optional()
    .isArray()
    .withMessage('برچسب‌ها باید آرایه باشد'),
  
  query('sort_by')
    .optional()
    .isIn(['created_at', 'analytics_type', 'category', 'period'])
    .withMessage('فیلد مرتب‌سازی نامعتبر است'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('ترتیب مرتب‌سازی باید asc یا desc باشد')
];

const periodValidation = [
  query('period')
    .optional()
    .isIn(['1h', '24h', '7d', '30d', '90d', '1y'])
    .withMessage('دوره زمانی نامعتبر است')
];

// Routes
router.get('/dashboard', auth, getDashboardSummary);
router.get('/', auth, queryValidation, getAnalytics);
router.get('/market-insights', auth, periodValidation, getMarketInsights);
router.get('/user-behavior', auth, periodValidation, getUserBehaviorAnalytics);
router.get('/financial-performance', auth, periodValidation, getFinancialPerformance);
router.get('/system-performance', auth, periodValidation, getSystemPerformance);
router.get('/:id', auth, getAnalyticsValidation, getAnalyticsById);
router.post('/', auth, authorize('admin', 'analyst'), createAnalyticsValidation, createAnalytics);

module.exports = router;
