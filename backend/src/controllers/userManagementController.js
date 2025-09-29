const UserManagement = require('../models/UserManagement');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get user management profile
const getUserProfile = async (req, res) => {
  try {
    const userManagement = await UserManagement.findOne({ user: req.user.id })
      .populate('user', 'full_name email role')
      .populate('roles.assigned_by', 'full_name email')
      .populate('permissions.granted_by', 'full_name email');

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
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پروفایل کاربر'
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors.array()
      });
    }

    const { profile, contact, preferences, financial } = req.body;
    
    let userManagement = await UserManagement.findOne({ user: req.user.id });
    
    if (!userManagement) {
      // Create new user management record
      userManagement = new UserManagement({
        user: req.user.id,
        profile: profile || {},
        contact: contact || {},
        preferences: preferences || {},
        financial: financial || {},
        created_by: req.user.id
      });
    } else {
      // Update existing record
      if (profile) userManagement.profile = { ...userManagement.profile, ...profile };
      if (contact) userManagement.contact = { ...userManagement.contact, ...contact };
      if (preferences) userManagement.preferences = { ...userManagement.preferences, ...preferences };
      if (financial) userManagement.financial = { ...userManagement.financial, ...financial };
      
      userManagement.last_updated_by = req.user.id;
    }

    await userManagement.save();

    res.json({
      success: true,
      message: 'پروفایل کاربر با موفقیت به‌روزرسانی شد',
      data: userManagement
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی پروفایل کاربر'
    });
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
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
      date_from,
      date_to,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    const filters = {
      role,
      kyc_completed: kyc_completed === 'true' ? true : kyc_completed === 'false' ? false : undefined,
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
      is_suspended: is_suspended === 'true' ? true : is_suspended === 'false' ? false : undefined,
      is_flagged: is_flagged === 'true' ? true : is_flagged === 'false' ? false : undefined,
      two_factor_enabled: two_factor_enabled === 'true' ? true : two_factor_enabled === 'false' ? false : undefined,
      date_from,
      date_to,
      search
    };

    const query = UserManagement.findByFilters(filters)
      .populate('user', 'full_name email role created_at')
      .populate('roles.assigned_by', 'full_name email')
      .populate('permissions.granted_by', 'full_name email')
      .populate('created_by', 'full_name email')
      .populate('last_updated_by', 'full_name email');

    // Apply sorting
    const sortOptions = {};
    sortOptions[sort_by] = sort_order === 'desc' ? -1 : 1;
    query.sort(sortOptions);

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query.skip(skip).limit(parseInt(limit));

    const users = await query.exec();
    const total = await UserManagement.findByFilters(filters).countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست کاربران'
    });
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const userManagement = await UserManagement.findOne({ user: req.params.id })
      .populate('user', 'full_name email role created_at')
      .populate('roles.assigned_by', 'full_name email')
      .populate('permissions.granted_by', 'full_name email')
      .populate('created_by', 'full_name email')
      .populate('last_updated_by', 'full_name email');

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
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات کاربر'
    });
  }
};

// Add role to user (Admin only)
const addUserRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors.array()
      });
    }

    const { role, expires_at } = req.body;
    const userId = req.params.id;

    let userManagement = await UserManagement.findOne({ user: userId });
    
    if (!userManagement) {
      userManagement = new UserManagement({
        user: userId,
        created_by: req.user.id
      });
    }

    await userManagement.addRole(role, req.user.id, expires_at ? new Date(expires_at) : undefined);

    res.json({
      success: true,
      message: 'نقش کاربر با موفقیت اضافه شد'
    });
  } catch (error) {
    console.error('Add user role error:', error);
    
    if (error.message === 'User already has this role') {
      return res.status(400).json({
        success: false,
        message: 'کاربر قبلاً این نقش را دارد'
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در اضافه کردن نقش کاربر'
    });
  }
};

// Remove role from user (Admin only)
const removeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    const userManagement = await UserManagement.findOne({ user: userId });
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    await userManagement.removeRole(role);

    res.json({
      success: true,
      message: 'نقش کاربر با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('Remove user role error:', error);
    
    if (error.message === 'User does not have this role') {
      return res.status(400).json({
        success: false,
        message: 'کاربر این نقش را ندارد'
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در حذف نقش کاربر'
    });
  }
};

// Add permission to user (Admin only)
const addUserPermission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors.array()
      });
    }

    const { permission, resource, actions, conditions, expires_at } = req.body;
    const userId = req.params.id;

    let userManagement = await UserManagement.findOne({ user: userId });
    
    if (!userManagement) {
      userManagement = new UserManagement({
        user: userId,
        created_by: req.user.id
      });
    }

    userManagement.permissions.push({
      permission,
      resource,
      actions,
      conditions,
      granted_by: req.user.id,
      expires_at: expires_at ? new Date(expires_at) : undefined
    });

    await userManagement.save();

    res.json({
      success: true,
      message: 'مجوز کاربر با موفقیت اضافه شد'
    });
  } catch (error) {
    console.error('Add user permission error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در اضافه کردن مجوز کاربر'
    });
  }
};

// Update user verification status (Admin only)
const updateUserVerification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors.array()
      });
    }

    const { 
      email_verified, 
      phone_verified, 
      identity_verified, 
      kyc_completed, 
      kyc_level 
    } = req.body;
    const userId = req.params.id;

    let userManagement = await UserManagement.findOne({ user: userId });
    
    if (!userManagement) {
      userManagement = new UserManagement({
        user: userId,
        created_by: req.user.id
      });
    }

    if (email_verified !== undefined) userManagement.verification.email_verified = email_verified;
    if (phone_verified !== undefined) userManagement.verification.phone_verified = phone_verified;
    if (identity_verified !== undefined) userManagement.verification.identity_verified = identity_verified;
    if (kyc_completed !== undefined) userManagement.verification.kyc_completed = kyc_completed;
    if (kyc_level) userManagement.verification.kyc_level = kyc_level;

    userManagement.last_updated_by = req.user.id;
    await userManagement.save();

    res.json({
      success: true,
      message: 'وضعیت تأیید کاربر با موفقیت به‌روزرسانی شد'
    });
  } catch (error) {
    console.error('Update user verification error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی وضعیت تأیید کاربر'
    });
  }
};

// Suspend user (Admin only)
const suspendUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors.array()
      });
    }

    const { reason, suspended_until } = req.body;
    const userId = req.params.id;

    const userManagement = await UserManagement.findOne({ user: userId });
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    await userManagement.suspend(reason, req.user.id, suspended_until ? new Date(suspended_until) : undefined);

    res.json({
      success: true,
      message: 'کاربر با موفقیت تعلیق شد'
    });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در تعلیق کاربر'
    });
  }
};

// Unsuspend user (Admin only)
const unsuspendUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const userManagement = await UserManagement.findOne({ user: userId });
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    await userManagement.unsuspend();

    res.json({
      success: true,
      message: 'تعلیق کاربر با موفقیت لغو شد'
    });
  } catch (error) {
    console.error('Unsuspend user error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در لغو تعلیق کاربر'
    });
  }
};

// Flag user (Admin only)
const flagUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors.array()
      });
    }

    const { reason } = req.body;
    const userId = req.params.id;

    const userManagement = await UserManagement.findOne({ user: userId });
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    await userManagement.flag(reason, req.user.id);

    res.json({
      success: true,
      message: 'کاربر با موفقیت پرچم‌گذاری شد'
    });
  } catch (error) {
    console.error('Flag user error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در پرچم‌گذاری کاربر'
    });
  }
};

// Unflag user (Admin only)
const unflagUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const userManagement = await UserManagement.findOne({ user: userId });
    
    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    await userManagement.unflag();

    res.json({
      success: true,
      message: 'پرچم‌گذاری کاربر با موفقیت لغو شد'
    });
  } catch (error) {
    console.error('Unflag user error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در لغو پرچم‌گذاری کاربر'
    });
  }
};

// Update user security settings
const updateUserSecurity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors.array()
      });
    }

    const { 
      two_factor_enabled, 
      two_factor_method, 
      login_notifications, 
      security_alerts,
      session_timeout,
      max_login_attempts,
      password_expiry_days
    } = req.body;

    let userManagement = await UserManagement.findOne({ user: req.user.id });
    
    if (!userManagement) {
      userManagement = new UserManagement({
        user: req.user.id,
        created_by: req.user.id
      });
    }

    if (two_factor_enabled !== undefined) userManagement.security.two_factor_enabled = two_factor_enabled;
    if (two_factor_method) userManagement.security.two_factor_method = two_factor_method;
    if (login_notifications !== undefined) userManagement.security.login_notifications = login_notifications;
    if (security_alerts !== undefined) userManagement.security.security_alerts = security_alerts;
    if (session_timeout !== undefined) userManagement.security.session_timeout = session_timeout;
    if (max_login_attempts !== undefined) userManagement.security.max_login_attempts = max_login_attempts;
    if (password_expiry_days !== undefined) userManagement.security.password_expiry_days = password_expiry_days;

    userManagement.last_updated_by = req.user.id;
    await userManagement.save();

    res.json({
      success: true,
      message: 'تنظیمات امنیتی با موفقیت به‌روزرسانی شد'
    });
  } catch (error) {
    console.error('Update user security error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی تنظیمات امنیتی'
    });
  }
};

// Get user statistics (Admin only)
const getUserStats = async (req, res) => {
  try {
    const stats = await UserManagement.getUserStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار کاربران'
    });
  }
};

// Get user activity (Admin only)
const getUserActivity = async (req, res) => {
  try {
    const userId = req.params.id;
    const { days = 30 } = req.query;

    const userManagement = await UserManagement.findOne({ user: userId })
      .select('activity');

    if (!userManagement) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    const activity = userManagement.activity;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    res.json({
      success: true,
      data: {
        last_login: activity.last_login,
        last_activity: activity.last_activity,
        login_count: activity.login_count,
        failed_login_attempts: activity.failed_login_attempts,
        last_failed_login: activity.last_failed_login,
        recent_ip_addresses: activity.ip_addresses.filter(ip => ip.last_seen >= cutoffDate),
        recent_devices: activity.devices.filter(device => device.last_seen >= cutoffDate)
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت فعالیت کاربر'
    });
  }
};

// Update user preferences
const updateUserPreferences = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر است',
        errors: errors.array()
      });
    }

    const { 
      language, 
      timezone, 
      currency, 
      date_format, 
      notifications, 
      privacy 
    } = req.body;

    let userManagement = await UserManagement.findOne({ user: req.user.id });
    
    if (!userManagement) {
      userManagement = new UserManagement({
        user: req.user.id,
        created_by: req.user.id
      });
    }

    if (language) userManagement.preferences.language = language;
    if (timezone) userManagement.preferences.timezone = timezone;
    if (currency) userManagement.preferences.currency = currency;
    if (date_format) userManagement.preferences.date_format = date_format;
    if (notifications) userManagement.preferences.notifications = { ...userManagement.preferences.notifications, ...notifications };
    if (privacy) userManagement.preferences.privacy = { ...userManagement.preferences.privacy, ...privacy };

    userManagement.last_updated_by = req.user.id;
    await userManagement.save();

    res.json({
      success: true,
      message: 'تنظیمات کاربری با موفقیت به‌روزرسانی شد'
    });
  } catch (error) {
    console.error('Update user preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی تنظیمات کاربری'
    });
  }
};

module.exports = {
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
};
