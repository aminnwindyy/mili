const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getWallet, 
  createWallet, 
  updateWallet,
  getBalanceHistory,
  deposit,
  withdraw,
  transfer,
  getWalletStats,
  getAllWallets
} = require('../controllers/walletController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createWalletValidation = [
  body('wallet_type')
    .optional()
    .isIn(['primary', 'investment', 'savings', 'trading'])
    .withMessage('نوع کیف پول نامعتبر است'),
  
  body('currency')
    .optional()
    .isIn(['IRR', 'USD', 'EUR', 'BTC', 'ETH'])
    .withMessage('واحد پول نامعتبر است'),
  
  body('pin')
    .optional()
    .isLength({ min: 4, max: 6 })
    .isNumeric()
    .withMessage('PIN باید بین 4 تا 6 رقم باشد'),
  
  body('two_factor_enabled')
    .optional()
    .isBoolean()
    .withMessage('فعال‌سازی دو مرحله‌ای باید true یا false باشد'),
  
  body('biometric_enabled')
    .optional()
    .isBoolean()
    .withMessage('فعال‌سازی بیومتریک باید true یا false باشد'),
  
  body('max_daily_transaction')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداکثر تراکنش روزانه باید عدد مثبت باشد'),
  
  body('max_single_transaction')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداکثر تراکنش واحد باید عدد مثبت باشد')
];

const updateWalletValidation = [
  body('wallet_type')
    .optional()
    .isIn(['primary', 'investment', 'savings', 'trading'])
    .withMessage('نوع کیف پول نامعتبر است'),
  
  body('currency')
    .optional()
    .isIn(['IRR', 'USD', 'EUR', 'BTC', 'ETH'])
    .withMessage('واحد پول نامعتبر است'),
  
  body('status')
    .optional()
    .isIn(['active', 'suspended', 'frozen', 'closed'])
    .withMessage('وضعیت کیف پول نامعتبر است'),
  
  body('pin')
    .optional()
    .isLength({ min: 4, max: 6 })
    .isNumeric()
    .withMessage('PIN باید بین 4 تا 6 رقم باشد'),
  
  body('two_factor_enabled')
    .optional()
    .isBoolean()
    .withMessage('فعال‌سازی دو مرحله‌ای باید true یا false باشد'),
  
  body('biometric_enabled')
    .optional()
    .isBoolean()
    .withMessage('فعال‌سازی بیومتریک باید true یا false باشد'),
  
  body('max_daily_transaction')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداکثر تراکنش روزانه باید عدد مثبت باشد'),
  
  body('max_single_transaction')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداکثر تراکنش واحد باید عدد مثبت باشد'),
  
  body('daily_limit')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حد روزانه باید عدد مثبت باشد'),
  
  body('monthly_limit')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حد ماهانه باید عدد مثبت باشد'),
  
  body('yearly_limit')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حد سالانه باید عدد مثبت باشد'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('یادداشت‌ها نمی‌تواند بیش از 1000 کاراکتر باشد')
];

const depositValidation = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 1000 })
    .withMessage('مبلغ واریز باید حداقل 1000 ریال باشد'),
  
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
    .withMessage('توضیحات نمی‌تواند بیش از 500 کاراکتر باشد')
];

const withdrawValidation = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 1000 })
    .withMessage('مبلغ برداشت باید حداقل 1000 ریال باشد'),
  
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
    .withMessage('توضیحات نمی‌تواند بیش از 500 کاراکتر باشد')
];

const transferValidation = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 1000 })
    .withMessage('مبلغ انتقال باید حداقل 1000 ریال باشد'),
  
  body('to_user_email')
    .isEmail()
    .normalizeEmail()
    .withMessage('ایمیل کاربر مقصد نامعتبر است'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('توضیحات نمی‌تواند بیش از 500 کاراکتر باشد')
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
    .isIn(['active', 'suspended', 'frozen', 'closed'])
    .withMessage('وضعیت کیف پول نامعتبر است'),
  
  query('wallet_type')
    .optional()
    .isIn(['primary', 'investment', 'savings', 'trading'])
    .withMessage('نوع کیف پول نامعتبر است'),
  
  query('currency')
    .optional()
    .isIn(['IRR', 'USD', 'EUR', 'BTC', 'ETH'])
    .withMessage('واحد پول نامعتبر است'),
  
  query('sort_by')
    .optional()
    .isIn(['created_at', 'balance', 'total_transactions', 'total_volume'])
    .withMessage('فیلد مرتب‌سازی نامعتبر است'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('ترتیب مرتب‌سازی باید asc یا desc باشد')
];

// Routes
router.get('/', auth, getWallet);
router.post('/', auth, createWalletValidation, createWallet);
router.put('/', auth, updateWalletValidation, updateWallet);
router.get('/balance-history', auth, getBalanceHistory);
router.get('/stats', auth, getWalletStats);
router.post('/deposit', auth, depositValidation, deposit);
router.post('/withdraw', auth, withdrawValidation, withdraw);
router.post('/transfer', auth, transferValidation, transfer);

// Admin routes
router.get('/all', auth, authorize('admin'), queryValidation, getAllWallets);

module.exports = router;
