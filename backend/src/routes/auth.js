const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
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

// OAuth: Google
router.get('/oauth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/oauth/google/callback', passport.authenticate('google', { session: false, failureRedirect: process.env.OAUTH_FAILURE_REDIRECT || '/' }), (req, res) => {
  // Passport strategy puts { jwt, refreshToken } on req.auth
  const successUrl = new URL(process.env.OAUTH_SUCCESS_REDIRECT || 'http://localhost:5173/auth/callback');
  successUrl.searchParams.set('token', req.auth.jwt);
  successUrl.searchParams.set('refreshToken', req.auth.refreshToken);
  res.redirect(successUrl.toString());
});

// OAuth: GitHub
router.get('/oauth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/oauth/github/callback', passport.authenticate('github', { session: false, failureRedirect: process.env.OAUTH_FAILURE_REDIRECT || '/' }), (req, res) => {
  const successUrl = new URL(process.env.OAUTH_SUCCESS_REDIRECT || 'http://localhost:5173/auth/callback');
  successUrl.searchParams.set('token', req.auth.jwt);
  successUrl.searchParams.set('refreshToken', req.auth.refreshToken);
  res.redirect(successUrl.toString());
});

module.exports = router;