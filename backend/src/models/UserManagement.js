const mongoose = require('mongoose');

const userManagementSchema = new mongoose.Schema({
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'کاربر الزامی است'],
    unique: true
  },
  
  // Profile Information
  profile: {
    avatar: {
      type: String,
      trim: true
    },
    
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'بیوگرافی نمی‌تواند بیش از 500 کاراکتر باشد']
    },
    
    date_of_birth: {
      type: Date
    },
    
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say'
    },
    
    nationality: {
      type: String,
      trim: true,
      maxlength: [50, 'ملیت نمی‌تواند بیش از 50 کاراکتر باشد']
    },
    
    occupation: {
      type: String,
      trim: true,
      maxlength: [100, 'شغل نمی‌تواند بیش از 100 کاراکتر باشد']
    },
    
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'نام شرکت نمی‌تواند بیش از 100 کاراکتر باشد']
    },
    
    website: {
      type: String,
      trim: true,
      maxlength: [200, 'آدرس وب‌سایت نمی‌تواند بیش از 200 کاراکتر باشد']
    },
    
    social_links: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
      telegram: { type: String, trim: true }
    }
  },
  
  // Contact Information
  contact: {
    phone: {
      type: String,
      trim: true,
      match: [/^(\+98|0)?9\d{9}$/, 'شماره تلفن نامعتبر است']
    },
    
    alternative_phone: {
      type: String,
      trim: true
    },
    
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postal_code: { type: String, trim: true },
      country: { type: String, trim: true, default: 'Iran' }
    },
    
    emergency_contact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true }
    }
  },
  
  // Role and Permissions
  roles: [{
    role: {
      type: String,
      enum: ['admin', 'manager', 'analyst', 'investor', 'property_owner', 'guest'],
      required: true
    },
    
    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    assigned_at: {
      type: Date,
      default: Date.now
    },
    
    expires_at: {
      type: Date
    },
    
    is_active: {
      type: Boolean,
      default: true
    }
  }],
  
  permissions: [{
    permission: {
      type: String,
      required: true,
      trim: true
    },
    
    resource: {
      type: String,
      required: true,
      trim: true
    },
    
    actions: [{
      type: String,
      enum: ['create', 'read', 'update', 'delete', 'execute'],
      required: true
    }],
    
    conditions: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    
    granted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    granted_at: {
      type: Date,
      default: Date.now
    },
    
    expires_at: {
      type: Date
    }
  }],
  
  // Verification Status
  verification: {
    email_verified: {
      type: Boolean,
      default: false
    },
    
    phone_verified: {
      type: Boolean,
      default: false
    },
    
    identity_verified: {
      type: Boolean,
      default: false
    },
    
    kyc_completed: {
      type: Boolean,
      default: false
    },
    
    kyc_level: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced'],
      default: 'basic'
    },
    
    verification_documents: [{
      type: {
        type: String,
        enum: ['national_id', 'passport', 'driver_license', 'utility_bill', 'bank_statement'],
        required: true
      },
      
      document_url: {
        type: String,
        required: true,
        trim: true
      },
      
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      
      verified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      
      verified_at: {
        type: Date
      },
      
      rejection_reason: {
        type: String,
        trim: true
      }
    }]
  },
  
  // Security Settings
  security: {
    two_factor_enabled: {
      type: Boolean,
      default: false
    },
    
    two_factor_method: {
      type: String,
      enum: ['sms', 'email', 'authenticator', 'hardware'],
      default: 'sms'
    },
    
    login_notifications: {
      type: Boolean,
      default: true
    },
    
    security_alerts: {
      type: Boolean,
      default: true
    },
    
    session_timeout: {
      type: Number,
      default: 30, // minutes
      min: [5, 'زمان انقضای جلسه باید حداقل 5 دقیقه باشد'],
      max: [480, 'زمان انقضای جلسه نمی‌تواند بیش از 8 ساعت باشد']
    },
    
    max_login_attempts: {
      type: Number,
      default: 5,
      min: [3, 'حداکثر تلاش ورود باید حداقل 3 باشد'],
      max: [10, 'حداکثر تلاش ورود نمی‌تواند بیش از 10 باشد']
    },
    
    password_expiry_days: {
      type: Number,
      default: 90,
      min: [30, 'انقضای رمز عبور باید حداقل 30 روز باشد'],
      max: [365, 'انقضای رمز عبور نمی‌تواند بیش از 365 روز باشد']
    }
  },
  
  // Activity Tracking
  activity: {
    last_login: {
      type: Date
    },
    
    last_activity: {
      type: Date
    },
    
    login_count: {
      type: Number,
      default: 0
    },
    
    failed_login_attempts: {
      type: Number,
      default: 0
    },
    
    last_failed_login: {
      type: Date
    },
    
    ip_addresses: [{
      ip: { type: String, required: true },
      first_seen: { type: Date, default: Date.now },
      last_seen: { type: Date, default: Date.now },
      location: { type: String, trim: true },
      is_current: { type: Boolean, default: false }
    }],
    
    devices: [{
      device_id: { type: String, required: true },
      device_name: { type: String, trim: true },
      device_type: { type: String, enum: ['mobile', 'tablet', 'desktop', 'other'] },
      os: { type: String, trim: true },
      browser: { type: String, trim: true },
      first_seen: { type: Date, default: Date.now },
      last_seen: { type: Date, default: Date.now },
      is_current: { type: Boolean, default: false }
    }]
  },
  
  // Preferences
  preferences: {
    language: {
      type: String,
      enum: ['fa', 'en'],
      default: 'fa'
    },
    
    timezone: {
      type: String,
      default: 'Asia/Tehran'
    },
    
    currency: {
      type: String,
      enum: ['IRR', 'USD', 'EUR'],
      default: 'IRR'
    },
    
    date_format: {
      type: String,
      enum: ['jalali', 'gregorian'],
      default: 'jalali'
    },
    
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      
      sms: {
        type: Boolean,
        default: true
      },
      
      push: {
        type: Boolean,
        default: true
      },
      
      in_app: {
        type: Boolean,
        default: true
      },
      
      marketing: {
        type: Boolean,
        default: false
      }
    },
    
    privacy: {
      profile_visibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'private'
      },
      
      show_online_status: {
        type: Boolean,
        default: true
      },
      
      allow_contact: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Financial Information
  financial: {
    annual_income: {
      type: Number,
      min: [0, 'درآمد سالانه نمی‌تواند منفی باشد']
    },
    
    net_worth: {
      type: Number,
      min: [0, 'دارایی خالص نمی‌تواند منفی باشد']
    },
    
    investment_experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    
    risk_tolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate'
    },
    
    investment_goals: [{
      type: String,
      enum: ['capital_growth', 'income_generation', 'capital_preservation', 'speculation']
    }],
    
    bank_accounts: [{
      bank_name: { type: String, trim: true },
      account_number: { type: String, trim: true },
      account_type: { type: String, enum: ['checking', 'savings', 'investment'] },
      is_primary: { type: Boolean, default: false },
      verified: { type: Boolean, default: false }
    }]
  },
  
  // Compliance and Legal
  compliance: {
    terms_accepted: {
      type: Boolean,
      default: false
    },
    
    terms_accepted_at: {
      type: Date
    },
    
    privacy_policy_accepted: {
      type: Boolean,
      default: false
    },
    
    privacy_policy_accepted_at: {
      type: Date
    },
    
    marketing_consent: {
      type: Boolean,
      default: false
    },
    
    marketing_consent_at: {
      type: Date
    },
    
    data_processing_consent: {
      type: Boolean,
      default: false
    },
    
    data_processing_consent_at: {
      type: Date
    }
  },
  
  // Status and Flags
  status: {
    is_active: {
      type: Boolean,
      default: true
    },
    
    is_suspended: {
      type: Boolean,
      default: false
    },
    
    suspension_reason: {
      type: String,
      trim: true
    },
    
    suspended_until: {
      type: Date
    },
    
    is_flagged: {
      type: Boolean,
      default: false
    },
    
    flag_reason: {
      type: String,
      trim: true
    },
    
    flagged_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    flagged_at: {
      type: Date
    }
  },
  
  // Audit Trail
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  last_updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Additional Metadata
  tags: [{
    type: String,
    trim: true
  }],
  
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'یادداشت‌ها نمی‌تواند بیش از 1000 کاراکتر باشد']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userManagementSchema.index({ user: 1 });
userManagementSchema.index({ 'roles.role': 1 });
userManagementSchema.index({ 'roles.is_active': 1 });
userManagementSchema.index({ 'verification.kyc_completed': 1 });
userManagementSchema.index({ 'status.is_active': 1 });
userManagementSchema.index({ 'status.is_suspended': 1 });
userManagementSchema.index({ 'activity.last_login': -1 });
userManagementSchema.index({ created_at: -1 });

// Virtual for user summary
userManagementSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    user: this.user,
    roles: this.roles.filter(r => r.is_active).map(r => r.role),
    verification_status: {
      email_verified: this.verification.email_verified,
      phone_verified: this.verification.phone_verified,
      identity_verified: this.verification.identity_verified,
      kyc_completed: this.verification.kyc_completed,
      kyc_level: this.verification.kyc_level
    },
    status: {
      is_active: this.status.is_active,
      is_suspended: this.status.is_suspended,
      is_flagged: this.status.is_flagged
    },
    last_login: this.activity.last_login,
    created_at: this.createdAt
  };
});

// Virtual for security status
userManagementSchema.virtual('security_status').get(function() {
  return {
    two_factor_enabled: this.security.two_factor_enabled,
    two_factor_method: this.security.two_factor_method,
    login_notifications: this.security.login_notifications,
    security_alerts: this.security.security_alerts,
    failed_login_attempts: this.activity.failed_login_attempts,
    last_failed_login: this.activity.last_failed_login
  };
});

// Method to add role
userManagementSchema.methods.addRole = function(role, assignedBy, expiresAt) {
  const existingRole = this.roles.find(r => r.role === role && r.is_active);
  if (existingRole) {
    throw new Error('User already has this role');
  }
  
  this.roles.push({
    role,
    assigned_by: assignedBy,
    assigned_at: new Date(),
    expires_at: expiresAt,
    is_active: true
  });
  
  return this.save();
};

// Method to remove role
userManagementSchema.methods.removeRole = function(role) {
  const roleIndex = this.roles.findIndex(r => r.role === role && r.is_active);
  if (roleIndex === -1) {
    throw new Error('User does not have this role');
  }
  
  this.roles[roleIndex].is_active = false;
  return this.save();
};

// Method to has role
userManagementSchema.methods.hasRole = function(role) {
  return this.roles.some(r => r.role === role && r.is_active);
};

// Method to has permission
userManagementSchema.methods.hasPermission = function(permission, resource, action) {
  return this.permissions.some(p => 
    p.permission === permission && 
    p.resource === resource && 
    p.actions.includes(action) &&
    (!p.expires_at || p.expires_at > new Date())
  );
};

// Method to update activity
userManagementSchema.methods.updateActivity = function(ipAddress, deviceInfo) {
  this.activity.last_activity = new Date();
  
  // Update IP address
  const existingIP = this.activity.ip_addresses.find(ip => ip.ip === ipAddress);
  if (existingIP) {
    existingIP.last_seen = new Date();
    existingIP.is_current = true;
  } else {
    this.activity.ip_addresses.push({
      ip: ipAddress,
      first_seen: new Date(),
      last_seen: new Date(),
      is_current: true
    });
  }
  
  // Update device
  if (deviceInfo && deviceInfo.device_id) {
    const existingDevice = this.activity.devices.find(d => d.device_id === deviceInfo.device_id);
    if (existingDevice) {
      existingDevice.last_seen = new Date();
      existingDevice.is_current = true;
    } else {
      this.activity.devices.push({
        device_id: deviceInfo.device_id,
        device_name: deviceInfo.device_name || 'Unknown Device',
        device_type: deviceInfo.device_type || 'other',
        os: deviceInfo.os || 'Unknown OS',
        browser: deviceInfo.browser || 'Unknown Browser',
        first_seen: new Date(),
        last_seen: new Date(),
        is_current: true
      });
    }
  }
  
  return this.save();
};

// Method to record login
userManagementSchema.methods.recordLogin = function(ipAddress, deviceInfo) {
  this.activity.last_login = new Date();
  this.activity.login_count += 1;
  this.activity.failed_login_attempts = 0;
  
  return this.updateActivity(ipAddress, deviceInfo);
};

// Method to record failed login
userManagementSchema.methods.recordFailedLogin = function(ipAddress) {
  this.activity.failed_login_attempts += 1;
  this.activity.last_failed_login = new Date();
  
  return this.save();
};

// Method to suspend user
userManagementSchema.methods.suspend = function(reason, suspendedBy, suspendedUntil) {
  this.status.is_suspended = true;
  this.status.suspension_reason = reason;
  this.status.suspended_until = suspendedUntil;
  
  return this.save();
};

// Method to unsuspend user
userManagementSchema.methods.unsuspend = function() {
  this.status.is_suspended = false;
  this.status.suspension_reason = undefined;
  this.status.suspended_until = undefined;
  
  return this.save();
};

// Method to flag user
userManagementSchema.methods.flag = function(reason, flaggedBy) {
  this.status.is_flagged = true;
  this.status.flag_reason = reason;
  this.status.flagged_by = flaggedBy;
  this.status.flagged_at = new Date();
  
  return this.save();
};

// Method to unflag user
userManagementSchema.methods.unflag = function() {
  this.status.is_flagged = false;
  this.status.flag_reason = undefined;
  this.status.flagged_by = undefined;
  this.status.flagged_at = undefined;
  
  return this.save();
};

// Static method to get user statistics
userManagementSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total_users: { $sum: 1 },
        active_users: {
          $sum: { $cond: ['$status.is_active', 1, 0] }
        },
        suspended_users: {
          $sum: { $cond: ['$status.is_suspended', 1, 0] }
        },
        flagged_users: {
          $sum: { $cond: ['$status.is_flagged', 1, 0] }
        },
        verified_users: {
          $sum: { $cond: ['$verification.kyc_completed', 1, 0] }
        },
        two_factor_enabled: {
          $sum: { $cond: ['$security.two_factor_enabled', 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    total_users: 0,
    active_users: 0,
    suspended_users: 0,
    flagged_users: 0,
    verified_users: 0,
    two_factor_enabled: 0
  };
};

// Static method to find users by filters
userManagementSchema.statics.findByFilters = function(filters) {
  const query = {};
  
  if (filters.role) query['roles.role'] = filters.role;
  if (filters.kyc_completed !== undefined) query['verification.kyc_completed'] = filters.kyc_completed;
  if (filters.is_active !== undefined) query['status.is_active'] = filters.is_active;
  if (filters.is_suspended !== undefined) query['status.is_suspended'] = filters.is_suspended;
  if (filters.is_flagged !== undefined) query['status.is_flagged'] = filters.is_flagged;
  if (filters.two_factor_enabled !== undefined) query['security.two_factor_enabled'] = filters.two_factor_enabled;
  if (filters.date_from) query.created_at = { $gte: new Date(filters.date_from) };
  if (filters.date_to) {
    query.created_at = { ...query.created_at, $lte: new Date(filters.date_to) };
  }
  if (filters.search) {
    query.$or = [
      { 'profile.bio': { $regex: filters.search, $options: 'i' } },
      { 'contact.phone': { $regex: filters.search, $options: 'i' } },
      { 'contact.address.city': { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return this.find(query);
};

module.exports = mongoose.model('UserManagement', userManagementSchema);
