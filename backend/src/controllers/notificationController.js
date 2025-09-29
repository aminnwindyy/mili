const { validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sanitizeInput, generateRandomString } = require('../utils/helpers');
const bus = require('../realtime/eventBus');

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      status,
      priority,
      unread_only = false,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter object
    const filters = { recipient: req.user.id };
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (search) filters.search = sanitizeInput(search);

    // Build sort object
    const sort = {};
    sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    let notifications = await Notification.findByFilters(filters)
      .populate('recipient', 'full_name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Filter unread notifications if requested
    if (unread_only === 'true') {
      notifications = notifications.filter(n => !n.tracking?.opened);
    }

    // Get total count for pagination
    const total = await Notification.findByFilters(filters).countDocuments();

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاع‌رسانی‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get single notification
const getNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user.id
    }).populate('recipient', 'full_name email');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'اطلاع‌رسانی یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { notification }
    });

  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات اطلاع‌رسانی',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Create new notification
const createNotification = async (req, res) => {
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
      recipient,
      title,
      message,
      type,
      category,
      priority = 'medium',
      channels = ['email'],
      scheduled_at,
      action,
      template_id,
      template_variables,
      personalization
    } = req.body;

    // Verify recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        message: 'گیرنده یافت نشد'
      });
    }

    // Prepare channels
    const channelConfigs = channels.map(channelType => ({
      type: channelType,
      status: 'pending'
    }));

    const notificationData = {
      recipient,
      recipient_email: recipientUser.email,
      recipient_phone: recipientUser.phone,
      title: sanitizeInput(title),
      message: sanitizeInput(message),
      short_message: sanitizeInput(message).substring(0, 160),
      type,
      category,
      priority,
      channels: channelConfigs,
      scheduled_at: scheduled_at ? new Date(scheduled_at) : undefined,
      action: action || { type: 'none' },
      template_id,
      template_variables: template_variables || {},
      personalization: {
        user_name: recipientUser.full_name,
        language: personalization?.language || 'fa',
        timezone: personalization?.timezone || 'Asia/Tehran',
        ...personalization
      },
      created_by: req.user.id
    };

    const notification = new Notification(notificationData);
    await notification.save();

    // Populate recipient info
    await notification.populate('recipient', 'full_name email');

    // Emit realtime event
    try {
      bus.emit('notification', {
        event: 'created',
        recipient: String(notification.recipient?._id || notification.recipient),
        notification: {
          id: String(notification._id),
          title: notification.title,
          message: notification.message,
          type: notification.type,
          category: notification.category,
          status: notification.status || 'draft',
          created_at: notification.created_at || new Date()
        }
      });
    } catch {}

    res.status(201).json({
      success: true,
      message: 'اطلاع‌رسانی با موفقیت ایجاد شد',
      data: { notification }
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد اطلاع‌رسانی',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'اطلاع‌رسانی یافت نشد'
      });
    }

    if (!notification.tracking.opened) {
      notification.tracking.opened = true;
      notification.tracking.opened_at = new Date();
      await notification.save();
    }

    res.json({
      success: true,
      message: 'اطلاع‌رسانی به عنوان خوانده شده علامت‌گذاری شد'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در علامت‌گذاری اطلاع‌رسانی',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Mark notification as clicked
const markAsClicked = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'اطلاع‌رسانی یافت نشد'
      });
    }

    notification.tracking.clicked = true;
    notification.tracking.clicked_at = new Date();
    notification.tracking.click_count += 1;
    await notification.save();

    res.json({
      success: true,
      message: 'کلیک ثبت شد'
    });

  } catch (error) {
    console.error('Mark as clicked error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت کلیک',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'اطلاع‌رسانی یافت نشد'
      });
    }

    await Notification.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'اطلاع‌رسانی با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف اطلاع‌رسانی',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get notification statistics
const getNotificationStats = async (req, res) => {
  try {
    const {
      date_from,
      date_to,
      type,
      category
    } = req.query;

    const filters = { recipient: req.user.id };
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;
    if (type) filters.type = type;
    if (category) filters.category = category;

    const stats = await Notification.getNotificationStats(filters);

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار اطلاع‌رسانی‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Send notification immediately
const sendNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'اطلاع‌رسانی یافت نشد'
      });
    }

    if (notification.status === 'sent' || notification.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'این اطلاع‌رسانی قبلاً ارسال شده است'
      });
    }

    // Simulate sending notification
    notification.status = 'sending';
    await notification.save();

    // Emit sending event
    try {
      bus.emit('notification', {
        event: 'status',
        recipient: String(notification.recipient),
        notification: { id: String(notification._id), status: 'sending' }
      });
    } catch {}

    // Simulate delivery
    setTimeout(async () => {
      try {
        await notification.markAsSent('email');
        try {
          bus.emit('notification', {
            event: 'status',
            recipient: String(notification.recipient),
            notification: { id: String(notification._id), status: 'sent' }
          });
        } catch {}
        console.log(`Notification ${notification.notification_id} sent successfully`);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }, 1000);

    res.json({
      success: true,
      message: 'اطلاع‌رسانی در حال ارسال است',
      data: { notification }
    });

  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ارسال اطلاع‌رسانی',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get all notifications (admin only)
const getAllNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      recipient,
      type,
      category,
      status,
      priority,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter object
    const filters = {};
    if (recipient) filters.recipient = recipient;
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (search) filters.search = sanitizeInput(search);

    // Build sort object
    const sort = {};
    sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const notifications = await Notification.findByFilters(filters)
      .populate('recipient', 'full_name email')
      .populate('created_by', 'full_name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Notification.findByFilters(filters).countDocuments();

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست اطلاع‌رسانی‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Bulk create notifications
const bulkCreateNotifications = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const { notifications } = req.body;

    if (!Array.isArray(notifications) || notifications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'لیست اطلاع‌رسانی‌ها الزامی است'
      });
    }

    const createdNotifications = [];

    for (const notificationData of notifications) {
      const {
        recipient,
        title,
        message,
        type,
        category,
        priority = 'medium',
        channels = ['email']
      } = notificationData;

      // Verify recipient exists
      const recipientUser = await User.findById(recipient);
      if (!recipientUser) {
        continue; // Skip invalid recipients
      }

      const notification = new Notification({
        recipient,
        recipient_email: recipientUser.email,
        recipient_phone: recipientUser.phone,
        title: sanitizeInput(title),
        message: sanitizeInput(message),
        short_message: sanitizeInput(message).substring(0, 160),
        type,
        category,
        priority,
        channels: channels.map(channelType => ({
          type: channelType,
          status: 'pending'
        })),
        created_by: req.user.id
      });

      await notification.save();
      createdNotifications.push(notification);
    }

    res.status(201).json({
      success: true,
      message: `${createdNotifications.length} اطلاع‌رسانی با موفقیت ایجاد شد`,
      data: { notifications: createdNotifications }
    });

  } catch (error) {
    console.error('Bulk create notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد اطلاع‌رسانی‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
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
};
