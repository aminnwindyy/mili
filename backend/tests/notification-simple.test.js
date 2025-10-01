const request = require('supertest');
const express = require('express');

// Create a simple Express app for testing
const app = express();
app.use(express.json());

// Mock notification data
const mockNotifications = [
  {
    _id: '507f1f77bcf86cd799439011',
    notification_id: 'NOTIF123456789',
    recipient: '507f1f77bcf86cd799439012',
    recipient_email: 'user@example.com',
    title: 'سرمایه‌گذاری جدید',
    message: 'سرمایه‌گذاری شما در ملک جدید با موفقیت انجام شد',
    type: 'investment',
    category: 'success',
    priority: 'medium',
    status: 'delivered',
    channels: [
      { type: 'email', status: 'delivered', sent_at: new Date() }
    ],
    tracking: {
      opened: true,
      opened_at: new Date(),
      clicked: false,
      click_count: 0
    },
    created_at: new Date('2024-01-01')
  },
  {
    _id: '507f1f77bcf86cd799439013',
    notification_id: 'NOTIF987654321',
    recipient: '507f1f77bcf86cd799439012',
    recipient_email: 'user@example.com',
    title: 'هشدار امنیتی',
    message: 'ورود غیرعادی به حساب کاربری شما تشخیص داده شد',
    type: 'security',
    category: 'warning',
    priority: 'high',
    status: 'sent',
    channels: [
      { type: 'email', status: 'sent', sent_at: new Date() },
      { type: 'sms', status: 'sent', sent_at: new Date() }
    ],
    tracking: {
      opened: false,
      clicked: false,
      click_count: 0
    },
    created_at: new Date('2024-01-02')
  }
];

// Mock user data
const mockUsers = [
  {
    _id: '507f1f77bcf86cd799439012',
    full_name: 'کاربر تستی',
    email: 'user@example.com',
    phone: '09123456789'
  }
];

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439012',
    email: 'user@example.com',
    full_name: 'کاربر تستی',
    role: 'investor'
  };
  next();
};

// Mock admin auth middleware
const adminAuth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439015',
    email: 'admin@example.com',
    full_name: 'مدیر سیستم',
    role: 'admin'
  };
  next();
};

// Notification Routes
app.get('/api/notifications', auth, (req, res) => {
  const { type, category, status, unread_only } = req.query;
  let filteredNotifications = [...mockNotifications];

  // Apply filters
  if (type) {
    filteredNotifications = filteredNotifications.filter(n => n.type === type);
  }
  
  if (category) {
    filteredNotifications = filteredNotifications.filter(n => n.category === category);
  }
  
  if (status) {
    filteredNotifications = filteredNotifications.filter(n => n.status === status);
  }
  
  if (unread_only === 'true') {
    filteredNotifications = filteredNotifications.filter(n => !n.tracking.opened);
  }

  res.json({
    success: true,
    data: {
      notifications: filteredNotifications,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: filteredNotifications.length,
        items_per_page: 20
      }
    }
  });
});

app.get('/api/notifications/stats', auth, (req, res) => {
  const stats = {
    total_notifications: mockNotifications.length,
    sent_notifications: mockNotifications.filter(n => n.status === 'sent' || n.status === 'delivered').length,
    delivered_notifications: mockNotifications.filter(n => n.status === 'delivered').length,
    failed_notifications: mockNotifications.filter(n => n.status === 'failed').length,
    opened_notifications: mockNotifications.filter(n => n.tracking.opened).length,
    clicked_notifications: mockNotifications.filter(n => n.tracking.clicked).length
  };

  res.json({
    success: true,
    data: { stats }
  });
});

app.get('/api/notifications/:id', auth, (req, res) => {
  const notification = mockNotifications.find(n => n._id === req.params.id);
  
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
});

app.post('/api/notifications', auth, (req, res) => {
  const {
    recipient,
    title,
    message,
    type,
    category,
    priority = 'medium',
    channels = ['email']
  } = req.body;

  // Check if recipient exists
  const recipientUser = mockUsers.find(u => u._id === recipient);
  if (!recipientUser) {
    return res.status(404).json({
      success: false,
      message: 'گیرنده یافت نشد'
    });
  }

  const newNotification = {
    _id: '507f1f77bcf86cd799439014',
    notification_id: `NOTIF${Date.now()}`,
    recipient,
    recipient_email: recipientUser.email,
    title,
    message,
    type,
    category,
    priority,
    status: 'draft',
    channels: channels.map(channelType => ({
      type: channelType,
      status: 'pending'
    })),
    tracking: {
      opened: false,
      clicked: false,
      click_count: 0
    },
    created_by: req.user.id,
    created_at: new Date()
  };

  mockNotifications.push(newNotification);

  res.status(201).json({
    success: true,
    message: 'اطلاع‌رسانی با موفقیت ایجاد شد',
    data: { notification: newNotification }
  });
});

app.put('/api/notifications/:id/read', auth, (req, res) => {
  const notification = mockNotifications.find(n => n._id === req.params.id);
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'اطلاع‌رسانی یافت نشد'
    });
  }

  if (!notification.tracking.opened) {
    notification.tracking.opened = true;
    notification.tracking.opened_at = new Date();
  }

  res.json({
    success: true,
    message: 'اطلاع‌رسانی به عنوان خوانده شده علامت‌گذاری شد'
  });
});

app.put('/api/notifications/:id/click', auth, (req, res) => {
  const notification = mockNotifications.find(n => n._id === req.params.id);
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'اطلاع‌رسانی یافت نشد'
    });
  }

  notification.tracking.clicked = true;
  notification.tracking.clicked_at = new Date();
  notification.tracking.click_count += 1;

  res.json({
    success: true,
    message: 'کلیک ثبت شد'
  });
});

app.put('/api/notifications/:id/send', auth, (req, res) => {
  const notification = mockNotifications.find(n => n._id === req.params.id);
  
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

  notification.status = 'sending';
  
  // Simulate sending
  setTimeout(() => {
    notification.status = 'sent';
    notification.channels.forEach(channel => {
      channel.status = 'sent';
      channel.sent_at = new Date();
    });
  }, 100);

  res.json({
    success: true,
    message: 'اطلاع‌رسانی در حال ارسال است',
    data: { notification }
  });
});

app.delete('/api/notifications/:id', auth, (req, res) => {
  const notificationIndex = mockNotifications.findIndex(n => n._id === req.params.id);
  
  if (notificationIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'اطلاع‌رسانی یافت نشد'
    });
  }

  mockNotifications.splice(notificationIndex, 1);

  res.json({
    success: true,
    message: 'اطلاع‌رسانی با موفقیت حذف شد'
  });
});

app.post('/api/notifications/bulk', adminAuth, (req, res) => {
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

    // Check if recipient exists
    const recipientUser = mockUsers.find(u => u._id === recipient);
    if (!recipientUser) {
      continue; // Skip invalid recipients
    }

    const newNotification = {
      _id: `507f1f77bcf86cd7994390${Date.now()}`,
      notification_id: `NOTIF${Date.now()}`,
      recipient,
      recipient_email: recipientUser.email,
      title,
      message,
      type,
      category,
      priority,
      status: 'draft',
      channels: channels.map(channelType => ({
        type: channelType,
        status: 'pending'
      })),
      tracking: {
        opened: false,
        clicked: false,
        click_count: 0
      },
      created_by: req.user.id,
      created_at: new Date()
    };

    mockNotifications.push(newNotification);
    createdNotifications.push(newNotification);
  }

  res.status(201).json({
    success: true,
    message: `${createdNotifications.length} اطلاع‌رسانی با موفقیت ایجاد شد`,
    data: { notifications: createdNotifications }
  });
});

app.get('/api/notifications/admin/all', adminAuth, (req, res) => {
  const { recipient, type, category, status } = req.query;
  let filteredNotifications = [...mockNotifications];

  // Apply filters
  if (recipient) {
    filteredNotifications = filteredNotifications.filter(n => n.recipient === recipient);
  }
  
  if (type) {
    filteredNotifications = filteredNotifications.filter(n => n.type === type);
  }
  
  if (category) {
    filteredNotifications = filteredNotifications.filter(n => n.category === category);
  }
  
  if (status) {
    filteredNotifications = filteredNotifications.filter(n => n.status === status);
  }

  res.json({
    success: true,
    data: {
      notifications: filteredNotifications,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: filteredNotifications.length,
        items_per_page: 20
      }
    }
  });
});

describe('Notification API Tests (Simple Mock)', () => {
  beforeEach(() => {
    // Reset mock data
    mockNotifications.length = 0;
    mockNotifications.push(
      {
        _id: '507f1f77bcf86cd799439011',
        notification_id: 'NOTIF123456789',
        recipient: '507f1f77bcf86cd799439012',
        recipient_email: 'user@example.com',
        title: 'سرمایه‌گذاری جدید',
        message: 'سرمایه‌گذاری شما در ملک جدید با موفقیت انجام شد',
        type: 'investment',
        category: 'success',
        priority: 'medium',
        status: 'delivered',
        channels: [
          { type: 'email', status: 'delivered', sent_at: new Date() }
        ],
        tracking: {
          opened: true,
          opened_at: new Date(),
          clicked: false,
          click_count: 0
        },
        created_at: new Date('2024-01-01')
      },
      {
        _id: '507f1f77bcf86cd799439013',
        notification_id: 'NOTIF987654321',
        recipient: '507f1f77bcf86cd799439012',
        recipient_email: 'user@example.com',
        title: 'هشدار امنیتی',
        message: 'ورود غیرعادی به حساب کاربری شما تشخیص داده شد',
        type: 'security',
        category: 'warning',
        priority: 'high',
        status: 'sent',
        channels: [
          { type: 'email', status: 'sent', sent_at: new Date() },
          { type: 'sms', status: 'sent', sent_at: new Date() }
        ],
        tracking: {
          opened: false,
          clicked: false,
          click_count: 0
        },
        created_at: new Date('2024-01-02')
      }
    );
  });

  describe('Get Notifications', () => {
    test('Should get user notifications', async () => {
      const response = await request(app)
        .get('/api/notifications');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.notifications).toHaveLength(2);
      expect(response.body.data.notifications[0].type).toBe('investment');
    });

    test('Should filter notifications by type', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .query({ type: 'investment' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.notifications).toHaveLength(1);
      expect(response.body.data.notifications[0].type).toBe('investment');
    });

    test('Should filter notifications by category', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .query({ category: 'success' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.notifications).toHaveLength(1);
      expect(response.body.data.notifications[0].category).toBe('success');
    });

    test('Should filter unread notifications', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .query({ unread_only: 'true' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.notifications).toHaveLength(1);
      expect(response.body.data.notifications[0].tracking.opened).toBe(false);
    });
  });

  describe('Get Notification Stats', () => {
    test('Should get notification statistics', async () => {
      const response = await request(app)
        .get('/api/notifications/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stats.total_notifications).toBe(2);
      expect(response.body.data.stats.opened_notifications).toBe(1);
    });
  });

  describe('Get Single Notification', () => {
    test('Should get single notification by ID', async () => {
      const response = await request(app)
        .get(`/api/notifications/${mockNotifications[0]._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.notification.type).toBe('investment');
    });

    test('Should return 404 for non-existent notification', async () => {
      const response = await request(app)
        .get('/api/notifications/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('اطلاع‌رسانی یافت نشد');
    });
  });

  describe('Create Notification', () => {
    test('Should create new notification', async () => {
      const notificationData = {
        recipient: '507f1f77bcf86cd799439012',
        title: 'تست اطلاع‌رسانی',
        message: 'این یک اطلاع‌رسانی تستی است',
        type: 'system',
        category: 'info',
        priority: 'medium',
        channels: ['email', 'sms']
      };

      const response = await request(app)
        .post('/api/notifications')
        .send(notificationData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.notification.title).toBe('تست اطلاع‌رسانی');
      expect(mockNotifications).toHaveLength(3);
    });

    test('Should return 404 for invalid recipient', async () => {
      const notificationData = {
        recipient: 'nonexistent',
        title: 'تست اطلاع‌رسانی',
        message: 'این یک اطلاع‌رسانی تستی است',
        type: 'system',
        category: 'info'
      };

      const response = await request(app)
        .post('/api/notifications')
        .send(notificationData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('گیرنده یافت نشد');
    });
  });

  describe('Mark as Read', () => {
    test('Should mark notification as read', async () => {
      const response = await request(app)
        .put(`/api/notifications/${mockNotifications[1]._id}/read`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockNotifications[1].tracking.opened).toBe(true);
    });
  });

  describe('Mark as Clicked', () => {
    test('Should mark notification as clicked', async () => {
      const response = await request(app)
        .put(`/api/notifications/${mockNotifications[0]._id}/click`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockNotifications[0].tracking.clicked).toBe(true);
      expect(mockNotifications[0].tracking.click_count).toBe(1);
    });
  });

  describe('Send Notification', () => {
    test('Should send notification', async () => {
      // First create a draft notification
      const draftNotification = {
        _id: '507f1f77bcf86cd799439014',
        notification_id: 'NOTIF999999999',
        recipient: '507f1f77bcf86cd799439012',
        recipient_email: 'user@example.com',
        title: 'تست ارسال',
        message: 'این یک اطلاع‌رسانی تستی است',
        type: 'system',
        category: 'info',
        priority: 'medium',
        status: 'draft',
        channels: [
          { type: 'email', status: 'pending' }
        ],
        tracking: {
          opened: false,
          clicked: false,
          click_count: 0
        },
        created_at: new Date()
      };
      
      mockNotifications.push(draftNotification);

      const response = await request(app)
        .put(`/api/notifications/${draftNotification._id}/send`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('اطلاع‌رسانی در حال ارسال است');
    });

    test('Should return 400 for already sent notification', async () => {
      // First mark as sent
      mockNotifications[0].status = 'sent';
      
      const response = await request(app)
        .put(`/api/notifications/${mockNotifications[0]._id}/send`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('این اطلاع‌رسانی قبلاً ارسال شده است');
    });
  });

  describe('Delete Notification', () => {
    test('Should delete notification', async () => {
      const response = await request(app)
        .delete(`/api/notifications/${mockNotifications[0]._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockNotifications).toHaveLength(1);
    });

    test('Should return 404 for non-existent notification', async () => {
      const response = await request(app)
        .delete('/api/notifications/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('اطلاع‌رسانی یافت نشد');
    });
  });

  describe('Bulk Create Notifications', () => {
    test('Should create multiple notifications', async () => {
      const notifications = [
        {
          recipient: '507f1f77bcf86cd799439012',
          title: 'اطلاع‌رسانی 1',
          message: 'پیام اول',
          type: 'system',
          category: 'info'
        },
        {
          recipient: '507f1f77bcf86cd799439012',
          title: 'اطلاع‌رسانی 2',
          message: 'پیام دوم',
          type: 'system',
          category: 'info'
        }
      ];

      const response = await request(app)
        .post('/api/notifications/bulk')
        .send({ notifications });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.notifications).toHaveLength(2);
      expect(mockNotifications).toHaveLength(4);
    });

    test('Should return 400 for empty notifications array', async () => {
      const response = await request(app)
        .post('/api/notifications/bulk')
        .send({ notifications: [] });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('لیست اطلاع‌رسانی‌ها الزامی است');
    });
  });

  describe('Admin - Get All Notifications', () => {
    test('Should get all notifications for admin', async () => {
      const response = await request(app)
        .get('/api/notifications/admin/all');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.notifications).toHaveLength(2);
    });

    test('Should filter all notifications by type', async () => {
      const response = await request(app)
        .get('/api/notifications/admin/all')
        .query({ type: 'investment' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.notifications).toHaveLength(1);
      expect(response.body.data.notifications[0].type).toBe('investment');
    });
  });
});
