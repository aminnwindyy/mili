const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile, refreshToken } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('نام باید بین 2 تا 100 کاراکتر باشد'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('ایمیل معتبر وارد کنید'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('رمز عبور باید حداقل 6 کاراکتر باشد')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد'),
  
  body('phone')
    .optional()
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage('شماره موبایل صحیح وارد کنید'),
  
  body('national_id')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('کد ملی باید 10 رقم باشد'),
  
  body('referred_by')
    .optional()
    .isMongoId()
    .withMessage('کد ارجاع نامعتبر است')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('ایمیل معتبر وارد کنید'),
  
  body('password')
    .notEmpty()
    .withMessage('رمز عبور الزامی است')
];

const updateProfileValidation = [
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('نام باید بین 2 تا 100 کاراکتر باشد'),
  
  body('phone')
    .optional()
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage('شماره موبایل صحیح وارد کنید'),
  
  body('national_id')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('کد ملی باید 10 رقم باشد')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfileValidation, updateProfile);

module.exports = router;