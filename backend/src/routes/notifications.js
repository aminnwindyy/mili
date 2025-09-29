const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getUserNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAsClicked,
  deleteNotification,
  getNotificationStats,
  sendNotification,
  getAllNotifications,
  bulkCreateNotifications
} = require('../controllers/notificationController');
const { auth, authorize } = require('../middleware/auth');
const bus = require('../realtime/eventBus');

const router = express.Router();

// Validation rules
const createNotificationValidation = [
  body('recipient')
    .isMongoId()
    .withMessage('شناسه گیرنده نامعتبر است'),
  
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('عنوان باید بین 5 تا 200 کاراکتر باشد'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('پیام باید بین 10 تا 1000 کاراکتر باشد'),
  
  body('type')
    .isIn(['investment', 'property', 'transaction', 'wallet', 'tref', 'system', 'security', 'marketing', 'reminder', 'alert', 'announcement', 'update'])
    .withMessage('نوع اطلاع‌رسانی نامعتبر است'),
  
  body('category')
    .isIn(['success', 'error', 'warning', 'info', 'urgent', 'promotional'])
    .withMessage('دسته‌بندی اطلاع‌رسانی نامعتبر است'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('اولویت نامعتبر است'),
  
  body('channels')
    .optional()
    .isArray()
    .withMessage('کانال‌ها باید آرایه باشد'),
  
  body('channels.*')
    .optional()
    .isIn(['email', 'sms', 'push', 'in_app', 'webhook'])
    .withMessage('نوع کانال نامعتبر است'),
  
  body('scheduled_at')
    .optional()
    .isISO8601()
    .withMessage('تاریخ برنامه‌ریزی نامعتبر است'),
  
  body('action.type')
    .optional()
    .isIn(['url', 'deep_link', 'api_call', 'none'])
    .withMessage('نوع عمل نامعتبر است'),
  
  body('action.url')
    .optional()
    .isURL()
    .withMessage('URL نامعتبر است'),
  
  body('template_id')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('شناسه قالب نمی‌تواند بیش از 100 کاراکتر باشد'),
  
  body('personalization.language')
    .optional()
    .isIn(['fa', 'en'])
    .withMessage('زبان نامعتبر است'),
  
  body('personalization.timezone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('منطقه زمانی نامعتبر است')
];

const bulkCreateValidation = [
  body('notifications')
    .isArray({ min: 1 })
    .withMessage('لیست اطلاع‌رسانی‌ها الزامی است'),
  
  body('notifications.*.recipient')
    .isMongoId()
    .withMessage('شناسه گیرنده نامعتبر است'),
  
  body('notifications.*.title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('عنوان باید بین 5 تا 200 کاراکتر باشد'),
  
  body('notifications.*.message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('پیام باید بین 10 تا 1000 کاراکتر باشد'),
  
  body('notifications.*.type')
    .isIn(['investment', 'property', 'transaction', 'wallet', 'tref', 'system', 'security', 'marketing', 'reminder', 'alert', 'announcement', 'update'])
    .withMessage('نوع اطلاع‌رسانی نامعتبر است'),
  
  body('notifications.*.category')
    .isIn(['success', 'error', 'warning', 'info', 'urgent', 'promotional'])
    .withMessage('دسته‌بندی اطلاع‌رسانی نامعتبر است')
];

const getNotificationValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه اطلاع‌رسانی نامعتبر است')
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
    .isIn(['investment', 'property', 'transaction', 'wallet', 'tref', 'system', 'security', 'marketing', 'reminder', 'alert', 'announcement', 'update'])
    .withMessage('نوع اطلاع‌رسانی نامعتبر است'),
  
  query('category')
    .optional()
    .isIn(['success', 'error', 'warning', 'info', 'urgent', 'promotional'])
    .withMessage('دسته‌بندی اطلاع‌رسانی نامعتبر است'),
  
  query('status')
    .optional()
    .isIn(['draft', 'scheduled', 'sending', 'sent', 'delivered', 'failed', 'cancelled'])
    .withMessage('وضعیت اطلاع‌رسانی نامعتبر است'),
  
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('اولویت نامعتبر است'),
  
  query('unread_only')
    .optional()
    .isBoolean()
    .withMessage('فیلتر خوانده نشده باید true یا false باشد'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('جستجو باید بین 2 تا 100 کاراکتر باشد'),
  
  query('sort_by')
    .optional()
    .isIn(['created_at', 'title', 'type', 'category', 'priority', 'status'])
    .withMessage('فیلد مرتب‌سازی نامعتبر است'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('ترتیب مرتب‌سازی باید asc یا desc باشد')
];

// Routes
router.get('/', auth, queryValidation, getUserNotifications);
router.get('/stats', auth, getNotificationStats);
router.get('/:id', auth, getNotificationValidation, getNotification);
router.post('/', auth, createNotificationValidation, createNotification);
router.post('/bulk', auth, authorize('admin', 'manager'), bulkCreateValidation, bulkCreateNotifications);
router.put('/:id/read', auth, getNotificationValidation, markAsRead);
router.put('/:id/click', auth, getNotificationValidation, markAsClicked);
router.put('/:id/send', auth, getNotificationValidation, sendNotification);
router.delete('/:id', auth, getNotificationValidation, deleteNotification);

// Admin routes
router.get('/admin/all', auth, authorize('admin'), queryValidation, getAllNotifications);

// SSE stream for real-time notifications
router.get('/stream', auth, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (event) => {
    // Filter by user if present
    if (event?.recipient && req.user?.id && event.recipient !== req.user.id) return;
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  bus.on('notification', sendEvent);

  req.on('close', () => {
    bus.off('notification', sendEvent);
  });
});

module.exports = router;
