const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  addUserRole,
  removeUserRole,
  addUserPermission,
  updateUserVerification,
  suspendUser,
  unsuspendUser,
  flagUser,
  unflagUser,
  updateUserSecurity,
  getUserStats,
  getUserActivity,
  updateUserPreferences
} = require('../controllers/userManagementController');

// Get current user profile
router.get('/profile', auth, getUserProfile);

// Update current user profile
router.put('/profile', [
  auth,
  body('profile.bio').optional().isLength({ max: 500 }).withMessage('بیوگرافی نمی‌تواند بیش از 500 کاراکتر باشد'),
  body('profile.website').optional().isURL().withMessage('آدرس وب‌سایت نامعتبر است'),
  body('profile.social_links.linkedin').optional().isURL().withMessage('آدرس LinkedIn نامعتبر است'),
  body('profile.social_links.twitter').optional().isURL().withMessage('آدرس Twitter نامعتبر است'),
  body('profile.social_links.instagram').optional().isURL().withMessage('آدرس Instagram نامعتبر است'),
  body('profile.social_links.telegram').optional().isURL().withMessage('آدرس Telegram نامعتبر است'),
  body('contact.phone').optional().matches(/^(\+98|0)?9\d{9}$/).withMessage('شماره تلفن نامعتبر است'),
  body('contact.alternative_phone').optional().matches(/^(\+98|0)?9\d{9}$/).withMessage('شماره تلفن جایگزین نامعتبر است'),
  body('financial.annual_income').optional().isNumeric().isFloat({ min: 0 }).withMessage('درآمد سالانه باید عدد مثبت باشد'),
  body('financial.net_worth').optional().isNumeric().isFloat({ min: 0 }).withMessage('دارایی خالص باید عدد مثبت باشد')
], updateUserProfile);

// Get all users (Admin only)
router.get('/users', [
  auth,
  authorize('admin', 'manager'),
  query('page').optional().isInt({ min: 1 }).withMessage('شماره صفحه باید عدد مثبت باشد'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('تعداد آیتم‌ها باید بین 1 تا 100 باشد'),
  query('role').optional().isIn(['admin', 'manager', 'analyst', 'investor', 'property_owner', 'guest']).withMessage('نقش نامعتبر است'),
  query('kyc_completed').optional().isBoolean().withMessage('وضعیت KYC باید true یا false باشد'),
  query('is_active').optional().isBoolean().withMessage('وضعیت فعال بودن باید true یا false باشد'),
  query('is_suspended').optional().isBoolean().withMessage('وضعیت تعلیق باید true یا false باشد'),
  query('is_flagged').optional().isBoolean().withMessage('وضعیت پرچم‌گذاری باید true یا false باشد'),
  query('two_factor_enabled').optional().isBoolean().withMessage('وضعیت دو مرحله‌ای باید true یا false باشد'),
  query('sort_by').optional().isIn(['created_at', 'last_login', 'full_name', 'email']).withMessage('فیلد مرتب‌سازی نامعتبر است'),
  query('sort_order').optional().isIn(['asc', 'desc']).withMessage('ترتیب مرتب‌سازی نامعتبر است')
], getAllUsers);

// Get user by ID (Admin only)
router.get('/users/:id', [
  auth,
  authorize('admin', 'manager'),
  param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است')
], getUserById);

// Add role to user (Admin only)
router.post('/users/:id/roles', [
  auth,
  authorize('admin'),
  param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'),
  body('role').isIn(['admin', 'manager', 'analyst', 'investor', 'property_owner', 'guest']).withMessage('نقش نامعتبر است'),
  body('expires_at').optional().isISO8601().withMessage('تاریخ انقضا نامعتبر است')
], addUserRole);

// Remove role from user (Admin only)
router.delete('/users/:id/roles', [
  auth,
  authorize('admin'),
  param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'),
  body('role').isIn(['admin', 'manager', 'analyst', 'investor', 'property_owner', 'guest']).withMessage('نقش نامعتبر است')
], removeUserRole);

// Add permission to user (Admin only)
router.post('/users/:id/permissions', [
  auth,
  authorize('admin'),
  param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'),
  body('permission').notEmpty().withMessage('نام مجوز الزامی است'),
  body('resource').notEmpty().withMessage('منبع مجوز الزامی است'),
  body('actions').isArray({ min: 1 }).withMessage('حداقل یک عمل باید مشخص شود'),
  body('actions.*').isIn(['create', 'read', 'update', 'delete', 'execute']).withMessage('عمل نامعتبر است'),
  body('expires_at').optional().isISO8601().withMessage('تاریخ انقضا نامعتبر است')
], addUserPermission);

// Update user verification status (Admin only)
router.put('/users/:id/verification', [
  auth,
  authorize('admin', 'manager'),
  param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'),
  body('email_verified').optional().isBoolean().withMessage('وضعیت تأیید ایمیل باید true یا false باشد'),
  body('phone_verified').optional().isBoolean().withMessage('وضعیت تأیید تلفن باید true یا false باشد'),
  body('identity_verified').optional().isBoolean().withMessage('وضعیت تأیید هویت باید true یا false باشد'),
  body('kyc_completed').optional().isBoolean().withMessage('وضعیت تکمیل KYC باید true یا false باشد'),
  body('kyc_level').optional().isIn(['basic', 'intermediate', 'advanced']).withMessage('سطح KYC نامعتبر است')
], updateUserVerification);

// Suspend user (Admin only)
router.post('/users/:id/suspend', [
  auth,
  authorize('admin'),
  param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'),
  body('reason').notEmpty().withMessage('دلیل تعلیق الزامی است'),
  body('suspended_until').optional().isISO8601().withMessage('تاریخ پایان تعلیق نامعتبر است')
], suspendUser);

// Unsuspend user (Admin only)
router.post('/users/:id/unsuspend', [
  auth,
  authorize('admin'),
  param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است')
], unsuspendUser);

// Flag user (Admin only)
router.post('/users/:id/flag', [
  auth,
  authorize('admin'),
  param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'),
  body('reason').notEmpty().withMessage('دلیل پرچم‌گذاری الزامی است')
], flagUser);

// Unflag user (Admin only)
router.post('/users/:id/unflag', [
  auth,
  authorize('admin'),
  param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است')
], unflagUser);

// Update user security settings
router.put('/security', [
  auth,
  body('two_factor_enabled').optional().isBoolean().withMessage('وضعیت دو مرحله‌ای باید true یا false باشد'),
  body('two_factor_method').optional().isIn(['sms', 'email', 'authenticator', 'hardware']).withMessage('روش دو مرحله‌ای نامعتبر است'),
  body('login_notifications').optional().isBoolean().withMessage('اعلان‌های ورود باید true یا false باشد'),
  body('security_alerts').optional().isBoolean().withMessage('هشدارهای امنیتی باید true یا false باشد'),
  body('session_timeout').optional().isInt({ min: 5, max: 480 }).withMessage('زمان انقضای جلسه باید بین 5 تا 480 دقیقه باشد'),
  body('max_login_attempts').optional().isInt({ min: 3, max: 10 }).withMessage('حداکثر تلاش ورود باید بین 3 تا 10 باشد'),
  body('password_expiry_days').optional().isInt({ min: 30, max: 365 }).withMessage('انقضای رمز عبور باید بین 30 تا 365 روز باشد')
], updateUserSecurity);

// Get user statistics (Admin only)
router.get('/stats', [
  auth,
  authorize('admin', 'manager')
], getUserStats);

// Get user activity (Admin only)
router.get('/users/:id/activity', [
  auth,
  authorize('admin', 'manager'),
  param('id').isMongoId().withMessage('شناسه کاربر نامعتبر است'),
  query('days').optional().isInt({ min: 1, max: 365 }).withMessage('تعداد روزها باید بین 1 تا 365 باشد')
], getUserActivity);

// Update user preferences
router.put('/preferences', [
  auth,
  body('language').optional().isIn(['fa', 'en']).withMessage('زبان نامعتبر است'),
  body('timezone').optional().isString().withMessage('منطقه زمانی نامعتبر است'),
  body('currency').optional().isIn(['IRR', 'USD', 'EUR']).withMessage('واحد پول نامعتبر است'),
  body('date_format').optional().isIn(['jalali', 'gregorian']).withMessage('فرمت تاریخ نامعتبر است'),
  body('notifications.email').optional().isBoolean().withMessage('اعلان ایمیل باید true یا false باشد'),
  body('notifications.sms').optional().isBoolean().withMessage('اعلان پیامک باید true یا false باشد'),
  body('notifications.push').optional().isBoolean().withMessage('اعلان Push باید true یا false باشد'),
  body('notifications.in_app').optional().isBoolean().withMessage('اعلان درون برنامه باید true یا false باشد'),
  body('notifications.marketing').optional().isBoolean().withMessage('اعلان بازاریابی باید true یا false باشد'),
  body('privacy.profile_visibility').optional().isIn(['public', 'friends', 'private']).withMessage('وضعیت نمایش پروفایل نامعتبر است'),
  body('privacy.show_online_status').optional().isBoolean().withMessage('نمایش وضعیت آنلاین باید true یا false باشد'),
  body('privacy.allow_contact').optional().isBoolean().withMessage('اجازه تماس باید true یا false باشد')
], updateUserPreferences);

module.exports = router;
