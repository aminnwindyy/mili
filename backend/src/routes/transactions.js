const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getTransactions, 
  getTransaction, 
  createTransaction,
  updateTransactionStatus,
  retryTransaction,
  getTransactionStats,
  getAllTransactions,
  getTransactionAnalytics
} = require('../controllers/transactionController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createTransactionValidation = [
  body('type')
    .isIn(['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'investment', 'refund', 'fee', 'interest', 'dividend', 'purchase', 'sale', 'exchange'])
    .withMessage('نوع تراکنش نامعتبر است'),
  
  body('amount')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('مبلغ تراکنش باید عدد مثبت باشد'),
  
  body('currency')
    .optional()
    .isIn(['IRR', 'USD', 'EUR', 'BTC', 'ETH'])
    .withMessage('واحد پول نامعتبر است'),
  
  body('payment_method')
    .isIn(['bank_transfer', 'credit_card', 'debit_card', 'crypto', 'wallet', 'cash', 'check', 'other'])
    .withMessage('روش پرداخت نامعتبر است'),
  
  body('payment_reference')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('مرجع پرداخت نمی‌تواند بیش از 100 کاراکتر باشد'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('توضیحات نمی‌تواند بیش از 500 کاراکتر باشد'),
  
  body('related_investment')
    .optional()
    .isMongoId()
    .withMessage('شناسه سرمایه‌گذاری نامعتبر است'),
  
  body('related_property')
    .optional()
    .isMongoId()
    .withMessage('شناسه ملک نامعتبر است'),
  
  body('related_tref')
    .optional()
    .isMongoId()
    .withMessage('شناسه صندوق نامعتبر است'),
  
  body('fee_amount')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('مبلغ کارمزد باید عدد مثبت باشد'),
  
  body('fee_percentage')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 100 })
    .withMessage('درصد کارمزد باید بین 0 تا 100 باشد'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('یادداشت‌ها نمی‌تواند بیش از 1000 کاراکتر باشد')
];

const updateTransactionStatusValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه تراکنش نامعتبر است'),
  
  body('status')
    .isIn(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'])
    .withMessage('وضعیت تراکنش نامعتبر است'),
  
  body('error_code')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('کد خطا نمی‌تواند بیش از 50 کاراکتر باشد'),
  
  body('error_message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('پیام خطا نمی‌تواند بیش از 500 کاراکتر باشد')
];

const getTransactionValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه تراکنش نامعتبر است')
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
  
  query('type')
    .optional()
    .isIn(['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'investment', 'refund', 'fee', 'interest', 'dividend', 'purchase', 'sale', 'exchange'])
    .withMessage('نوع تراکنش نامعتبر است'),
  
  query('status')
    .optional()
    .isIn(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'])
    .withMessage('وضعیت تراکنش نامعتبر است'),
  
  query('payment_method')
    .optional()
    .isIn(['bank_transfer', 'credit_card', 'debit_card', 'crypto', 'wallet', 'cash', 'check', 'other'])
    .withMessage('روش پرداخت نامعتبر است'),
  
  query('currency')
    .optional()
    .isIn(['IRR', 'USD', 'EUR', 'BTC', 'ETH'])
    .withMessage('واحد پول نامعتبر است'),
  
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
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('جستجو باید بین 2 تا 100 کاراکتر باشد'),
  
  query('sort_by')
    .optional()
    .isIn(['created_at', 'amount', 'status', 'type'])
    .withMessage('فیلد مرتب‌سازی نامعتبر است'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('ترتیب مرتب‌سازی باید asc یا desc باشد')
];

const analyticsQueryValidation = [
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y'])
    .withMessage('دوره زمانی نامعتبر است')
];

// Routes
router.get('/', auth, queryValidation, getTransactions);
router.get('/stats', auth, getTransactionStats);
router.get('/analytics', auth, analyticsQueryValidation, getTransactionAnalytics);
router.get('/:id', auth, getTransactionValidation, getTransaction);
router.post('/', auth, createTransactionValidation, createTransaction);
router.put('/:id/status', auth, updateTransactionStatusValidation, updateTransactionStatus);
router.put('/:id/retry', auth, getTransactionValidation, retryTransaction);

// Admin routes
router.get('/admin/all', auth, authorize('admin'), queryValidation, getAllTransactions);

module.exports = router;
