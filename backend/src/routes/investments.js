const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getInvestments, 
  getInvestment, 
  createInvestment, 
  updateInvestment, 
  getUserInvestments,
  cancelInvestment,
  listForSale,
  removeFromSale,
  getSecondaryMarket
} = require('../controllers/investmentController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createInvestmentValidation = [
  body('property_id')
    .isMongoId()
    .withMessage('شناسه ملک نامعتبر است'),
  
  body('investment_amount')
    .isNumeric()
    .isFloat({ min: 10000 })
    .withMessage('مبلغ سرمایه‌گذاری باید حداقل 10 هزار ریال باشد'),
  
  body('tokens_purchased')
    .isInt({ min: 1 })
    .withMessage('تعداد توکن‌های خریداری شده باید عدد صحیح مثبت باشد'),
  
  body('payment_method')
    .isIn(['bank_transfer', 'credit_card', 'crypto', 'wallet'])
    .withMessage('روش پرداخت نامعتبر است'),
  
  body('payment_reference')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('مرجع پرداخت نمی‌تواند بیش از 100 کاراکتر باشد'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('یادداشت‌ها نمی‌تواند بیش از 2000 کاراکتر باشد')
];

const updateInvestmentValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه سرمایه‌گذاری نامعتبر است'),
  
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'refunded'])
    .withMessage('وضعیت سرمایه‌گذاری نامعتبر است'),
  
  body('payment_status')
    .optional()
    .isIn(['pending', 'processing', 'completed', 'failed', 'refunded'])
    .withMessage('وضعیت پرداخت نامعتبر است'),
  
  body('current_value')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('ارزش فعلی باید عدد مثبت باشد'),
  
  body('actual_return_percentage')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 100 })
    .withMessage('درصد بازدهی واقعی باید بین 0 تا 100 باشد'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('یادداشت‌ها نمی‌تواند بیش از 2000 کاراکتر باشد'),
  
  body('compliance_notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('یادداشت‌های انطباق نمی‌تواند بیش از 1000 کاراکتر باشد')
];

const getInvestmentValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه سرمایه‌گذاری نامعتبر است')
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
  
  query('investor')
    .optional()
    .isMongoId()
    .withMessage('شناسه سرمایه‌گذار نامعتبر است'),
  
  query('property')
    .optional()
    .isMongoId()
    .withMessage('شناسه ملک نامعتبر است'),
  
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'refunded'])
    .withMessage('وضعیت سرمایه‌گذاری نامعتبر است'),
  
  query('payment_status')
    .optional()
    .isIn(['pending', 'processing', 'completed', 'failed', 'refunded'])
    .withMessage('وضعیت پرداخت نامعتبر است'),
  
  query('min_amount')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداقل مبلغ باید عدد مثبت باشد'),
  
  query('max_amount')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداکثر مبلغ باید عدد مثبت باشد'),
  
  query('date_from')
    .optional()
    .isISO8601()
    .withMessage('تاریخ شروع نامعتبر است'),
  
  query('date_to')
    .optional()
    .isISO8601()
    .withMessage('تاریخ پایان نامعتبر است'),
  
  query('is_listed_for_sale')
    .optional()
    .isBoolean()
    .withMessage('وضعیت فروش باید true یا false باشد'),
  
  query('sort_by')
    .optional()
    .isIn(['investment_date', 'investment_amount', 'current_value', 'profit_loss_percentage'])
    .withMessage('فیلد مرتب‌سازی نامعتبر است'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('ترتیب مرتب‌سازی باید asc یا desc باشد')
];

const listForSaleValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه سرمایه‌گذاری نامعتبر است'),
  
  body('sale_price')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('قیمت فروش باید عدد مثبت باشد')
];

// Routes
router.get('/', queryValidation, getInvestments);
router.get('/my-portfolio', auth, getUserInvestments);
router.get('/secondary-market', getSecondaryMarket);
router.get('/:id', getInvestmentValidation, getInvestment);
router.post('/', auth, createInvestmentValidation, createInvestment);
router.put('/:id', auth, updateInvestmentValidation, updateInvestment);
router.put('/:id/cancel', auth, getInvestmentValidation, cancelInvestment);
router.put('/:id/list-for-sale', auth, listForSaleValidation, listForSale);
router.put('/:id/remove-from-sale', auth, getInvestmentValidation, removeFromSale);

module.exports = router;
