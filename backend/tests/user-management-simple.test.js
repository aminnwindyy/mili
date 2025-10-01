const request = require('supertest');
const express = require('express');

// Mock data
let mockUsers = [];
let mockUserManagement = [];

// Mock User model
const mockUser = {
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn()
};

// Mock UserManagement model
const mockUserManagementModel = {
  findOne: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  aggregate: jest.fn(),
  countDocuments: jest.fn(),
  findByFilters: jest.fn(),
  getUserStats: jest.fn()
};

// Mock middleware
const mockAuth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439012',
    email: 'admin@example.com',
    role: 'admin'
  };
  next();
};

const mockAuthorize = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'شما مجوز دسترسی به این بخش را ندارید'
      });
    }
  };
};

// Mock validation result
const mockValidationResult = (req, res, next) => {
  req.validationErrors = [];
  next();
};

// Create Express app
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/user-management/profile', mockAuth, (req, res) => {
  try {
    const userManagement = mockUserManagement.find(um => um.user === req.user.id);
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'پروفایل مدیریت کاربر یافت نشد'
      });
    }

    res.json({
      success: true,
      data: userManagement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پروفایل کاربر'
    });
  }
});

app.put('/api/user-management/profile', mockAuth, mockValidationResult, (req, res) => {
  try {
    const { profile, contact, preferences, financial } = req.body;
    
    let userManagement = mockUserManagement.find(um => um.user === req.user.id);
    
    if (!userManagement) {
      userManagement = {
        _id: '507f1f77bcf86cd799439015',
        user: req.user.id,
        profile: profile || {},
        contact: contact || {},
        preferences: preferences || {},
        financial: financial || {},
        created_by: req.user.id,
        created_at: new Date()
      };
      mockUserManagement.push(userManagement);
    } else {
      if (profile) userManagement.profile = { ...userManagement.profile, ...profile };
      if (contact) userManagement.contact = { ...userManagement.contact, ...contact };
      if (preferences) userManagement.preferences = { ...userManagement.preferences, ...preferences };
      if (financial) userManagement.financial = { ...userManagement.financial, ...financial };
      
      userManagement.last_updated_by = req.user.id;
    }

    res.json({
      success: true,
      message: 'پروفایل کاربر با موفقیت به‌روزرسانی شد',
      data: userManagement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی پروفایل کاربر'
    });
  }
});

app.get('/api/user-management/users', mockAuth, mockAuthorize('admin', 'manager'), (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      kyc_completed,
      is_active,
      is_suspended,
      is_flagged,
      two_factor_enabled,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    let filteredUsers = [...mockUserManagement];

    // Apply filters
    if (role) {
      filteredUsers = filteredUsers.filter(um => 
        um.roles && um.roles.some(r => r.role === role && r.is_active)
      );
    }
    if (kyc_completed !== undefined) {
      filteredUsers = filteredUsers.filter(um => 
        um.verification && um.verification.kyc_completed === (kyc_completed === 'true')
      );
    }
    if (is_active !== undefined) {
      filteredUsers = filteredUsers.filter(um => 
        um.status && um.status.is_active === (is_active === 'true')
      );
    }
    if (is_suspended !== undefined) {
      filteredUsers = filteredUsers.filter(um => 
        um.status && um.status.is_suspended === (is_suspended === 'true')
      );
    }
    if (is_flagged !== undefined) {
      filteredUsers = filteredUsers.filter(um => 
        um.status && um.status.is_flagged === (is_flagged === 'true')
      );
    }
    if (two_factor_enabled !== undefined) {
      filteredUsers = filteredUsers.filter(um => 
        um.security && um.security.two_factor_enabled === (two_factor_enabled === 'true')
      );
    }
    if (search) {
      filteredUsers = filteredUsers.filter(um => 
        (um.profile && um.profile.bio && um.profile.bio.includes(search)) ||
        (um.contact && um.contact.phone && um.contact.phone.includes(search)) ||
        (um.contact && um.contact.address && um.contact.address.city && um.contact.address.city.includes(search))
      );
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aValue = a[sort_by];
      let bValue = b[sort_by];
      
      if (sort_by === 'created_at') {
        aValue = new Date(a.created_at || 0);
        bValue = new Date(b.created_at || 0);
      }
      
      if (sort_order === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedUsers = filteredUsers.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(filteredUsers.length / parseInt(limit)),
        total_items: filteredUsers.length,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست کاربران'
    });
  }
});

app.get('/api/user-management/users/:id', mockAuth, mockAuthorize('admin', 'manager'), (req, res) => {
  try {
    const userManagement = mockUserManagement.find(um => um.user === req.params.id);
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    res.json({
      success: true,
      data: userManagement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات کاربر'
    });
  }
});

app.post('/api/user-management/users/:id/roles', mockAuth, mockAuthorize('admin'), mockValidationResult, (req, res) => {
  try {
    const { role, expires_at } = req.body;
    const userId = req.params.id;

    let userManagement = mockUserManagement.find(um => um.user === userId);
    
    if (!userManagement) {
      userManagement = {
        _id: '507f1f77bcf86cd799439016',
        user: userId,
        roles: [],
        created_by: req.user.id,
        created_at: new Date()
      };
      mockUserManagement.push(userManagement);
    }

    // Check if user already has this role
    const existingRole = userManagement.roles && userManagement.roles.find(r => r.role === role && r.is_active);
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'کاربر قبلاً این نقش را دارد'
      });
    }

    // Add role
    if (!userManagement.roles) userManagement.roles = [];
    userManagement.roles.push({
      role,
      assigned_by: req.user.id,
      assigned_at: new Date(),
      expires_at: expires_at ? new Date(expires_at) : undefined,
      is_active: true
    });

    res.json({
      success: true,
      message: 'نقش کاربر با موفقیت اضافه شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در اضافه کردن نقش کاربر'
    });
  }
});

app.delete('/api/user-management/users/:id/roles', mockAuth, mockAuthorize('admin'), mockValidationResult, (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    const userManagement = mockUserManagement.find(um => um.user === userId);
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    if (!userManagement.roles) {
      return res.status(400).json({
        success: false,
        message: 'کاربر این نقش را ندارد'
      });
    }

    const roleIndex = userManagement.roles.findIndex(r => r.role === role && r.is_active);
    if (roleIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'کاربر این نقش را ندارد'
      });
    }

    userManagement.roles[roleIndex].is_active = false;

    res.json({
      success: true,
      message: 'نقش کاربر با موفقیت حذف شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در حذف نقش کاربر'
    });
  }
});

app.post('/api/user-management/users/:id/permissions', mockAuth, mockAuthorize('admin'), mockValidationResult, (req, res) => {
  try {
    const { permission, resource, actions, conditions, expires_at } = req.body;
    const userId = req.params.id;

    let userManagement = mockUserManagement.find(um => um.user === userId);
    
    if (!userManagement) {
      userManagement = {
        _id: '507f1f77bcf86cd799439017',
        user: userId,
        permissions: [],
        created_by: req.user.id,
        created_at: new Date()
      };
      mockUserManagement.push(userManagement);
    }

    if (!userManagement.permissions) userManagement.permissions = [];
    userManagement.permissions.push({
      permission,
      resource,
      actions,
      conditions,
      granted_by: req.user.id,
      expires_at: expires_at ? new Date(expires_at) : undefined
    });

    res.json({
      success: true,
      message: 'مجوز کاربر با موفقیت اضافه شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در اضافه کردن مجوز کاربر'
    });
  }
});

app.put('/api/user-management/users/:id/verification', mockAuth, mockAuthorize('admin', 'manager'), mockValidationResult, (req, res) => {
  try {
    const { 
      email_verified, 
      phone_verified, 
      identity_verified, 
      kyc_completed, 
      kyc_level 
    } = req.body;
    const userId = req.params.id;

    let userManagement = mockUserManagement.find(um => um.user === userId);
    
    if (!userManagement) {
      userManagement = {
        _id: '507f1f77bcf86cd799439018',
        user: userId,
        verification: {},
        created_by: req.user.id,
        created_at: new Date()
      };
      mockUserManagement.push(userManagement);
    }

    if (!userManagement.verification) userManagement.verification = {};

    if (email_verified !== undefined) userManagement.verification.email_verified = email_verified;
    if (phone_verified !== undefined) userManagement.verification.phone_verified = phone_verified;
    if (identity_verified !== undefined) userManagement.verification.identity_verified = identity_verified;
    if (kyc_completed !== undefined) userManagement.verification.kyc_completed = kyc_completed;
    if (kyc_level) userManagement.verification.kyc_level = kyc_level;

    userManagement.last_updated_by = req.user.id;

    res.json({
      success: true,
      message: 'وضعیت تأیید کاربر با موفقیت به‌روزرسانی شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی وضعیت تأیید کاربر'
    });
  }
});

app.post('/api/user-management/users/:id/suspend', mockAuth, mockAuthorize('admin'), mockValidationResult, (req, res) => {
  try {
    const { reason, suspended_until } = req.body;
    const userId = req.params.id;

    const userManagement = mockUserManagement.find(um => um.user === userId);
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    if (!userManagement.status) userManagement.status = {};
    userManagement.status.is_suspended = true;
    userManagement.status.suspension_reason = reason;
    userManagement.status.suspended_until = suspended_until ? new Date(suspended_until) : undefined;

    res.json({
      success: true,
      message: 'کاربر با موفقیت تعلیق شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در تعلیق کاربر'
    });
  }
});

app.post('/api/user-management/users/:id/unsuspend', mockAuth, mockAuthorize('admin'), (req, res) => {
  try {
    const userId = req.params.id;

    const userManagement = mockUserManagement.find(um => um.user === userId);
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    if (userManagement.status) {
      userManagement.status.is_suspended = false;
      userManagement.status.suspension_reason = undefined;
      userManagement.status.suspended_until = undefined;
    }

    res.json({
      success: true,
      message: 'تعلیق کاربر با موفقیت لغو شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در لغو تعلیق کاربر'
    });
  }
});

app.post('/api/user-management/users/:id/flag', mockAuth, mockAuthorize('admin'), mockValidationResult, (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.params.id;

    const userManagement = mockUserManagement.find(um => um.user === userId);
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    if (!userManagement.status) userManagement.status = {};
    userManagement.status.is_flagged = true;
    userManagement.status.flag_reason = reason;
    userManagement.status.flagged_by = req.user.id;
    userManagement.status.flagged_at = new Date();

    res.json({
      success: true,
      message: 'کاربر با موفقیت پرچم‌گذاری شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در پرچم‌گذاری کاربر'
    });
  }
});

app.post('/api/user-management/users/:id/unflag', mockAuth, mockAuthorize('admin'), (req, res) => {
  try {
    const userId = req.params.id;

    const userManagement = mockUserManagement.find(um => um.user === userId);
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    if (userManagement.status) {
      userManagement.status.is_flagged = false;
      userManagement.status.flag_reason = undefined;
      userManagement.status.flagged_by = undefined;
      userManagement.status.flagged_at = undefined;
    }

    res.json({
      success: true,
      message: 'پرچم‌گذاری کاربر با موفقیت لغو شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در لغو پرچم‌گذاری کاربر'
    });
  }
});

app.put('/api/user-management/security', mockAuth, mockValidationResult, (req, res) => {
  try {
    const { 
      two_factor_enabled, 
      two_factor_method, 
      login_notifications, 
      security_alerts,
      session_timeout,
      max_login_attempts,
      password_expiry_days
    } = req.body;

    let userManagement = mockUserManagement.find(um => um.user === req.user.id);
    
    if (!userManagement) {
      userManagement = {
        _id: '507f1f77bcf86cd799439019',
        user: req.user.id,
        security: {},
        created_by: req.user.id,
        created_at: new Date()
      };
      mockUserManagement.push(userManagement);
    }

    if (!userManagement.security) userManagement.security = {};

    if (two_factor_enabled !== undefined) userManagement.security.two_factor_enabled = two_factor_enabled;
    if (two_factor_method) userManagement.security.two_factor_method = two_factor_method;
    if (login_notifications !== undefined) userManagement.security.login_notifications = login_notifications;
    if (security_alerts !== undefined) userManagement.security.security_alerts = security_alerts;
    if (session_timeout !== undefined) userManagement.security.session_timeout = session_timeout;
    if (max_login_attempts !== undefined) userManagement.security.max_login_attempts = max_login_attempts;
    if (password_expiry_days !== undefined) userManagement.security.password_expiry_days = password_expiry_days;

    userManagement.last_updated_by = req.user.id;

    res.json({
      success: true,
      message: 'تنظیمات امنیتی با موفقیت به‌روزرسانی شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی تنظیمات امنیتی'
    });
  }
});

app.get('/api/user-management/stats', mockAuth, mockAuthorize('admin', 'manager'), (req, res) => {
  try {
    const stats = {
      total_users: mockUserManagement.length,
      active_users: mockUserManagement.filter(um => um.status && um.status.is_active).length,
      suspended_users: mockUserManagement.filter(um => um.status && um.status.is_suspended).length,
      flagged_users: mockUserManagement.filter(um => um.status && um.status.is_flagged).length,
      verified_users: mockUserManagement.filter(um => um.verification && um.verification.kyc_completed).length,
      two_factor_enabled: mockUserManagement.filter(um => um.security && um.security.two_factor_enabled).length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار کاربران'
    });
  }
});

app.get('/api/user-management/users/:id/activity', mockAuth, mockAuthorize('admin', 'manager'), (req, res) => {
  try {
    const userId = req.params.id;
    const { days = 30 } = req.query;

    const userManagement = mockUserManagement.find(um => um.user === userId);
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    const activity = userManagement.activity || {};
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    res.json({
      success: true,
      data: {
        last_login: activity.last_login,
        last_activity: activity.last_activity,
        login_count: activity.login_count || 0,
        failed_login_attempts: activity.failed_login_attempts || 0,
        last_failed_login: activity.last_failed_login,
        recent_ip_addresses: (activity.ip_addresses || []).filter(ip => ip.last_seen >= cutoffDate),
        recent_devices: (activity.devices || []).filter(device => device.last_seen >= cutoffDate)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت فعالیت کاربر'
    });
  }
});

app.put('/api/user-management/preferences', mockAuth, mockValidationResult, (req, res) => {
  try {
    const { 
      language, 
      timezone, 
      currency, 
      date_format, 
      notifications, 
      privacy 
    } = req.body;

    let userManagement = mockUserManagement.find(um => um.user === req.user.id);
    
    if (!userManagement) {
      userManagement = {
        _id: '507f1f77bcf86cd799439020',
        user: req.user.id,
        preferences: {},
        created_by: req.user.id,
        created_at: new Date()
      };
      mockUserManagement.push(userManagement);
    }

    if (!userManagement.preferences) userManagement.preferences = {};

    if (language) userManagement.preferences.language = language;
    if (timezone) userManagement.preferences.timezone = timezone;
    if (currency) userManagement.preferences.currency = currency;
    if (date_format) userManagement.preferences.date_format = date_format;
    if (notifications) userManagement.preferences.notifications = { ...userManagement.preferences.notifications, ...notifications };
    if (privacy) userManagement.preferences.privacy = { ...userManagement.preferences.privacy, ...privacy };

    userManagement.last_updated_by = req.user.id;

    res.json({
      success: true,
      message: 'تنظیمات کاربری با موفقیت به‌روزرسانی شد'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی تنظیمات کاربری'
    });
  }
});

describe('User Management API Tests (Simple Mock)', () => {
  beforeEach(() => {
    // Reset mock data
    mockUserManagement.length = 0;
    mockUserManagement.push(
      {
        _id: '507f1f77bcf86cd799439011',
        user: '507f1f77bcf86cd799439012',
        profile: {
          bio: 'کاربر تستی',
          website: 'https://example.com'
        },
        contact: {
          phone: '09123456789'
        },
        roles: [
          {
            role: 'admin',
            assigned_by: '507f1f77bcf86cd799439012',
            assigned_at: new Date(),
            is_active: true
          }
        ],
        verification: {
          email_verified: true,
          phone_verified: true,
          identity_verified: true,
          kyc_completed: true,
          kyc_level: 'advanced'
        },
        status: {
          is_active: true,
          is_suspended: false,
          is_flagged: false
        },
        security: {
          two_factor_enabled: true,
          two_factor_method: 'sms',
          login_notifications: true,
          security_alerts: true
        },
        preferences: {
          language: 'fa',
          timezone: 'Asia/Tehran',
          currency: 'IRR',
          date_format: 'jalali'
        },
        activity: {
          last_login: new Date(),
          last_activity: new Date(),
          login_count: 10,
          failed_login_attempts: 0
        },
        created_at: new Date('2024-01-01')
      },
      {
        _id: '507f1f77bcf86cd799439013',
        user: '507f1f77bcf86cd799439014',
        profile: {
          bio: 'کاربر عادی'
        },
        roles: [
          {
            role: 'investor',
            assigned_by: '507f1f77bcf86cd799439012',
            assigned_at: new Date(),
            is_active: true
          }
        ],
        verification: {
          email_verified: true,
          phone_verified: false,
          identity_verified: false,
          kyc_completed: false,
          kyc_level: 'basic'
        },
        status: {
          is_active: true,
          is_suspended: false,
          is_flagged: false
        },
        security: {
          two_factor_enabled: false,
          two_factor_method: 'sms',
          login_notifications: true,
          security_alerts: true
        },
        preferences: {
          language: 'fa',
          timezone: 'Asia/Tehran',
          currency: 'IRR',
          date_format: 'jalali'
        },
        activity: {
          last_login: new Date(),
          last_activity: new Date(),
          login_count: 5,
          failed_login_attempts: 1
        },
        created_at: new Date('2024-01-02')
      }
    );
  });

  describe('Get User Profile', () => {
    test('Should get current user profile', async () => {
      const response = await request(app)
        .get('/api/user-management/profile');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user).toBe('507f1f77bcf86cd799439012');
    });

    test('Should return 404 for non-existent profile', async () => {
      // Clear mock data to simulate no profile
      mockUserManagement.length = 0;

      const response = await request(app)
        .get('/api/user-management/profile');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('پروفایل مدیریت کاربر یافت نشد');
    });
  });

  describe('Update User Profile', () => {
    test('Should update user profile', async () => {
      const updateData = {
        profile: {
          bio: 'بیوگرافی جدید',
          website: 'https://newsite.com'
        },
        contact: {
          phone: '09987654321'
        },
        preferences: {
          language: 'en',
          currency: 'USD'
        }
      };

      const response = await request(app)
        .put('/api/user-management/profile')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('پروفایل کاربر با موفقیت به‌روزرسانی شد');
    });

    test('Should create new profile if not exists', async () => {
      // Clear mock data to simulate no existing profile
      mockUserManagement.length = 0;

      const updateData = {
        profile: {
          bio: 'پروفایل جدید'
        }
      };

      const response = await request(app)
        .put('/api/user-management/profile')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserManagement.length).toBe(1);
    });
  });

  describe('Get All Users (Admin)', () => {
    test('Should get all users', async () => {
      const response = await request(app)
        .get('/api/user-management/users');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.pagination).toBeDefined();
    });

    test('Should filter users by role', async () => {
      const response = await request(app)
        .get('/api/user-management/users?role=admin');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    test('Should filter users by KYC status', async () => {
      const response = await request(app)
        .get('/api/user-management/users?kyc_completed=true');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    test('Should search users', async () => {
      const response = await request(app)
        .get('/api/user-management/users')
        .query({ search: 'تستی' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Get User by ID (Admin)', () => {
    test('Should get user by ID', async () => {
      const response = await request(app)
        .get('/api/user-management/users/507f1f77bcf86cd799439012');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    test('Should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/user-management/users/507f1f77bcf86cd799439999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('کاربر یافت نشد');
    });
  });

  describe('User Roles Management', () => {
    test('Should add role to user', async () => {
      const response = await request(app)
        .post('/api/user-management/users/507f1f77bcf86cd799439014/roles')
        .send({
          role: 'manager'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('نقش کاربر با موفقیت اضافه شد');
    });

    test('Should return 400 for duplicate role', async () => {
      const response = await request(app)
        .post('/api/user-management/users/507f1f77bcf86cd799439012/roles')
        .send({
          role: 'admin'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('کاربر قبلاً این نقش را دارد');
    });

    test('Should remove role from user', async () => {
      const response = await request(app)
        .delete('/api/user-management/users/507f1f77bcf86cd799439012/roles')
        .send({
          role: 'admin'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('نقش کاربر با موفقیت حذف شد');
    });

    test('Should return 400 for non-existent role', async () => {
      const response = await request(app)
        .delete('/api/user-management/users/507f1f77bcf86cd799439014/roles')
        .send({
          role: 'admin'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('کاربر این نقش را ندارد');
    });
  });

  describe('User Permissions Management', () => {
    test('Should add permission to user', async () => {
      const response = await request(app)
        .post('/api/user-management/users/507f1f77bcf86cd799439014/permissions')
        .send({
          permission: 'read_properties',
          resource: 'properties',
          actions: ['read']
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('مجوز کاربر با موفقیت اضافه شد');
    });
  });

  describe('User Verification Management', () => {
    test('Should update user verification status', async () => {
      const response = await request(app)
        .put('/api/user-management/users/507f1f77bcf86cd799439014/verification')
        .send({
          email_verified: true,
          phone_verified: true,
          kyc_completed: true,
          kyc_level: 'intermediate'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('وضعیت تأیید کاربر با موفقیت به‌روزرسانی شد');
    });
  });

  describe('User Suspension Management', () => {
    test('Should suspend user', async () => {
      const response = await request(app)
        .post('/api/user-management/users/507f1f77bcf86cd799439014/suspend')
        .send({
          reason: 'نقض قوانین'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('کاربر با موفقیت تعلیق شد');
    });

    test('Should unsuspend user', async () => {
      // First suspend the user
      mockUserManagement[1].status.is_suspended = true;
      mockUserManagement[1].status.suspension_reason = 'نقض قوانین';

      const response = await request(app)
        .post('/api/user-management/users/507f1f77bcf86cd799439014/unsuspend');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('تعلیق کاربر با موفقیت لغو شد');
    });
  });

  describe('User Flag Management', () => {
    test('Should flag user', async () => {
      const response = await request(app)
        .post('/api/user-management/users/507f1f77bcf86cd799439014/flag')
        .send({
          reason: 'فعالیت مشکوک'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('کاربر با موفقیت پرچم‌گذاری شد');
    });

    test('Should unflag user', async () => {
      // First flag the user
      mockUserManagement[1].status.is_flagged = true;
      mockUserManagement[1].status.flag_reason = 'فعالیت مشکوک';

      const response = await request(app)
        .post('/api/user-management/users/507f1f77bcf86cd799439014/unflag');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('پرچم‌گذاری کاربر با موفقیت لغو شد');
    });
  });

  describe('User Security Settings', () => {
    test('Should update user security settings', async () => {
      const response = await request(app)
        .put('/api/user-management/security')
        .send({
          two_factor_enabled: true,
          two_factor_method: 'authenticator',
          login_notifications: false,
          session_timeout: 60
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('تنظیمات امنیتی با موفقیت به‌روزرسانی شد');
    });
  });

  describe('User Statistics', () => {
    test('Should get user statistics', async () => {
      const response = await request(app)
        .get('/api/user-management/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.total_users).toBe(2);
    });
  });

  describe('User Activity', () => {
    test('Should get user activity', async () => {
      const response = await request(app)
        .get('/api/user-management/users/507f1f77bcf86cd799439012/activity');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    test('Should return 404 for non-existent user activity', async () => {
      const response = await request(app)
        .get('/api/user-management/users/507f1f77bcf86cd799439999/activity');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('کاربر یافت نشد');
    });
  });

  describe('User Preferences', () => {
    test('Should update user preferences', async () => {
      const response = await request(app)
        .put('/api/user-management/preferences')
        .send({
          language: 'en',
          currency: 'USD',
          notifications: {
            email: false,
            sms: true
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('تنظیمات کاربری با موفقیت به‌روزرسانی شد');
    });
  });
});
