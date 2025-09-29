const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getTREFs, 
  getTREF, 
  createTREF, 
  updateTREF,
  getTREFPerformance,
  getTREFProperties,
  addPropertyToTREF,
  removePropertyFromTREF,
  getTREFMarketStats,
  launchTREF
} = require('../controllers/trefController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createTREFValidation = [
  body('name')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('نام صندوق باید بین 5 تا 200 کاراکتر باشد'),
  
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('توضیحات صندوق باید بین 20 تا 2000 کاراکتر باشد'),
  
  body('fund_type')
    .isIn(['residential', 'commercial', 'mixed', 'industrial', 'development'])
    .withMessage('نوع صندوق نامعتبر است'),
  
  body('category')
    .isIn(['conservative', 'moderate', 'aggressive', 'growth', 'income'])
    .withMessage('دسته‌بندی صندوق نامعتبر است'),
  
  body('total_fund_size')
    .isNumeric()
    .isFloat({ min: 100000000 })
    .withMessage('حجم کل صندوق باید حداقل 100 میلیون ریال باشد'),
  
  body('total_shares')
    .isInt({ min: 1000 })
    .withMessage('تعداد کل سهام باید حداقل 1000 باشد'),
  
  body('expected_annual_return')
    .isNumeric()
    .isFloat({ min: 0, max: 100 })
    .withMessage('بازدهی سالانه مورد انتظار باید بین 0 تا 100 درصد باشد'),
  
  body('management_fee')
    .isNumeric()
    .isFloat({ min: 0, max: 10 })
    .withMessage('کارمزد مدیریت باید بین 0 تا 10 درصد باشد'),
  
  body('performance_fee')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 20 })
    .withMessage('کارمزد عملکرد باید بین 0 تا 20 درصد باشد'),
  
  body('entry_fee')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 5 })
    .withMessage('کارمزد ورود باید بین 0 تا 5 درصد باشد'),
  
  body('exit_fee')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 5 })
    .withMessage('کارمزد خروج باید بین 0 تا 5 درصد باشد'),
  
  body('risk_level')
    .optional()
    .isIn(['low', 'medium', 'high', 'very_high'])
    .withMessage('سطح ریسک نامعتبر است'),
  
  body('distribution_frequency')
    .optional()
    .isIn(['monthly', 'quarterly', 'semi_annually', 'annually', 'none'])
    .withMessage('فرکانس توزیع نامعتبر است'),
  
  body('properties')
    .optional()
    .isArray()
    .withMessage('املاک باید آرایه باشد'),
  
  body('properties.*.property')
    .optional()
    .isMongoId()
    .withMessage('شناسه ملک نامعتبر است'),
  
  body('properties.*.property_value')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('ارزش ملک باید عدد مثبت باشد'),
  
  body('properties.*.ownership_percentage')
    .optional()
    .isNumeric()
    .isFloat({ min: 0.01, max: 100 })
    .withMessage('درصد مالکیت باید بین 0.01 تا 100 باشد'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('یادداشت‌ها نمی‌تواند بیش از 2000 کاراکتر باشد')
];

const updateTREFValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه صندوق نامعتبر است'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('نام صندوق باید بین 5 تا 200 کاراکتر باشد'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('توضیحات صندوق باید بین 20 تا 2000 کاراکتر باشد'),
  
  body('fund_type')
    .optional()
    .isIn(['residential', 'commercial', 'mixed', 'industrial', 'development'])
    .withMessage('نوع صندوق نامعتبر است'),
  
  body('category')
    .optional()
    .isIn(['conservative', 'moderate', 'aggressive', 'growth', 'income'])
    .withMessage('دسته‌بندی صندوق نامعتبر است'),
  
  body('expected_annual_return')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 100 })
    .withMessage('بازدهی سالانه مورد انتظار باید بین 0 تا 100 درصد باشد'),
  
  body('management_fee')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 10 })
    .withMessage('کارمزد مدیریت باید بین 0 تا 10 درصد باشد'),
  
  body('performance_fee')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 20 })
    .withMessage('کارمزد عملکرد باید بین 0 تا 20 درصد باشد'),
  
  body('entry_fee')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 5 })
    .withMessage('کارمزد ورود باید بین 0 تا 5 درصد باشد'),
  
  body('exit_fee')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 5 })
    .withMessage('کارمزد خروج باید بین 0 تا 5 درصد باشد'),
  
  body('risk_level')
    .optional()
    .isIn(['low', 'medium', 'high', 'very_high'])
    .withMessage('سطح ریسک نامعتبر است'),
  
  body('distribution_frequency')
    .optional()
    .isIn(['monthly', 'quarterly', 'semi_annually', 'annually', 'none'])
    .withMessage('فرکانس توزیع نامعتبر است'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('یادداشت‌ها نمی‌تواند بیش از 2000 کاراکتر باشد')
];

const getTREFValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه صندوق نامعتبر است')
];

const addPropertyValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه صندوق نامعتبر است'),
  
  body('property_id')
    .isMongoId()
    .withMessage('شناسه ملک نامعتبر است'),
  
  body('property_value')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('ارزش ملک باید عدد مثبت باشد'),
  
  body('ownership_percentage')
    .isNumeric()
    .isFloat({ min: 0.01, max: 100 })
    .withMessage('درصد مالکیت باید بین 0.01 تا 100 باشد')
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
  
  query('fund_type')
    .optional()
    .isIn(['residential', 'commercial', 'mixed', 'industrial', 'development'])
    .withMessage('نوع صندوق نامعتبر است'),
  
  query('category')
    .optional()
    .isIn(['conservative', 'moderate', 'aggressive', 'growth', 'income'])
    .withMessage('دسته‌بندی صندوق نامعتبر است'),
  
  query('status')
    .optional()
    .isIn(['planning', 'launching', 'active', 'closed', 'liquidated', 'suspended'])
    .withMessage('وضعیت صندوق نامعتبر است'),
  
  query('risk_level')
    .optional()
    .isIn(['low', 'medium', 'high', 'very_high'])
    .withMessage('سطح ریسک نامعتبر است'),
  
  query('min_return')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداقل بازدهی باید عدد مثبت باشد'),
  
  query('max_return')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداکثر بازدهی باید عدد مثبت باشد'),
  
  query('min_investment')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداقل سرمایه‌گذاری باید عدد مثبت باشد'),
  
  query('max_investment')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداکثر سرمایه‌گذاری باید عدد مثبت باشد'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('جستجو باید بین 2 تا 100 کاراکتر باشد'),
  
  query('sort_by')
    .optional()
    .isIn(['created_at', 'name', 'expected_annual_return', 'total_fund_size', 'risk_level'])
    .withMessage('فیلد مرتب‌سازی نامعتبر است'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('ترتیب مرتب‌سازی باید asc یا desc باشد')
];

// Routes
router.get('/', queryValidation, getTREFs);
router.get('/market-stats', getTREFMarketStats);
router.get('/:id', getTREFValidation, getTREF);
router.get('/:id/performance', getTREFValidation, getTREFPerformance);
router.get('/:id/properties', getTREFValidation, getTREFProperties);
router.post('/', auth, createTREFValidation, createTREF);
router.put('/:id', auth, updateTREFValidation, updateTREF);
router.put('/:id/launch', auth, getTREFValidation, launchTREF);
router.post('/:id/properties', auth, addPropertyValidation, addPropertyToTREF);
router.delete('/:id/properties/:property_id', auth, getTREFValidation, removePropertyFromTREF);

module.exports = router;
