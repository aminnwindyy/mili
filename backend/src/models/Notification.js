const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Notification Identification
  notification_id: {
    type: String,
    required: [true, 'شناسه اطلاع‌رسانی الزامی است'],
    unique: true,
    uppercase: true,
    trim: true
  },
  
  // Recipient Information
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'گیرنده الزامی است']
  },
  
  recipient_email: {
    type: String,
    required: [true, 'ایمیل گیرنده الزامی است'],
    lowercase: true,
    trim: true
  },
  
  recipient_phone: {
    type: String,
    trim: true
  },
  
  // Notification Content
  title: {
    type: String,
    required: [true, 'عنوان اطلاع‌رسانی الزامی است'],
    trim: true,
    maxlength: [200, 'عنوان نمی‌تواند بیش از 200 کاراکتر باشد']
  },
  
  message: {
    type: String,
    required: [true, 'پیام اطلاع‌رسانی الزامی است'],
    trim: true,
    maxlength: [1000, 'پیام نمی‌تواند بیش از 1000 کاراکتر باشد']
  },
  
  short_message: {
    type: String,
    trim: true,
    maxlength: [160, 'پیام کوتاه نمی‌تواند بیش از 160 کاراکتر باشد']
  },
  
  // Notification Type and Category
  type: {
    type: String,
    required: [true, 'نوع اطلاع‌رسانی الزامی است'],
    enum: [
      'investment',        // سرمایه‌گذاری
      'property',          // ملک
      'transaction',       // تراکنش
      'wallet',           // کیف پول
      'tref',             // صندوق
      'system',           // سیستم
      'security',         // امنیت
      'marketing',        // بازاریابی
      'reminder',         // یادآوری
      'alert',            // هشدار
      'announcement',     // اعلان
      'update'            // به‌روزرسانی
    ]
  },
  
  category: {
    type: String,
    required: [true, 'دسته‌بندی اطلاع‌رسانی الزامی است'],
    enum: [
      'success',          // موفقیت
      'error',            // خطا
      'warning',          // هشدار
      'info',             // اطلاعات
      'urgent',           // فوری
      'promotional'       // تبلیغاتی
    ]
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Delivery Channels
  channels: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push', 'in_app', 'webhook'],
      required: true
    },
    
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'],
      default: 'pending'
    },
    
    sent_at: {
      type: Date
    },
    
    delivered_at: {
      type: Date
    },
    
    failure_reason: {
      type: String,
      trim: true
    },
    
    external_id: {
      type: String,
      trim: true
    }
  }],
  
  // Notification Status
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'delivered', 'failed', 'cancelled'],
    default: 'draft'
  },
  
  // Scheduling
  scheduled_at: {
    type: Date
  },
  
  sent_at: {
    type: Date
  },
  
  delivered_at: {
    type: Date
  },
  
  expires_at: {
    type: Date
  },
  
  // Related Entities
  related_entity_type: {
    type: String,
    enum: ['investment', 'property', 'transaction', 'wallet', 'tref', 'user', 'system']
  },
  
  related_entity_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  
  // Action Data
  action: {
    type: {
      type: String,
      enum: ['url', 'deep_link', 'api_call', 'none'],
      default: 'none'
    },
    
    url: {
      type: String,
      trim: true
    },
    
    deep_link: {
      type: String,
      trim: true
    },
    
    api_endpoint: {
      type: String,
      trim: true
    },
    
    parameters: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  
  // Template Information
  template_id: {
    type: String,
    trim: true
  },
  
  template_variables: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Personalization
  personalization: {
    user_name: {
      type: String,
      trim: true
    },
    
    user_preferences: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    
    language: {
      type: String,
      default: 'fa',
      enum: ['fa', 'en']
    },
    
    timezone: {
      type: String,
      default: 'Asia/Tehran'
    }
  },
  
  // Delivery Settings
  delivery_settings: {
    retry_count: {
      type: Number,
      default: 0,
      min: [0, 'تعداد تلاش نمی‌تواند منفی باشد']
    },
    
    max_retries: {
      type: Number,
      default: 3,
      min: [0, 'حداکثر تلاش نمی‌تواند منفی باشد']
    },
    
    retry_interval: {
      type: Number,
      default: 300, // 5 minutes in seconds
      min: [60, 'فاصله تلاش مجدد باید حداقل 60 ثانیه باشد']
    },
    
    batch_id: {
      type: String,
      trim: true
    },
    
    campaign_id: {
      type: String,
      trim: true
    }
  },
  
  // Tracking and Analytics
  tracking: {
    opened: {
      type: Boolean,
      default: false
    },
    
    opened_at: {
      type: Date
    },
    
    clicked: {
      type: Boolean,
      default: false
    },
    
    clicked_at: {
      type: Date
    },
    
    click_count: {
      type: Number,
      default: 0,
      min: [0, 'تعداد کلیک نمی‌تواند منفی باشد']
    },
    
    device_info: {
      type: String,
      trim: true
    },
    
    ip_address: {
      type: String,
      trim: true
    },
    
    user_agent: {
      type: String,
      trim: true
    }
  },
  
  // Compliance and Legal
  compliance: {
    gdpr_compliant: {
      type: Boolean,
      default: true
    },
    
    consent_given: {
      type: Boolean,
      default: false
    },
    
    consent_date: {
      type: Date
    },
    
    opt_out_available: {
      type: Boolean,
      default: true
    },
    
    legal_basis: {
      type: String,
      enum: ['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests'],
      default: 'consent'
    }
  },
  
  // Error Handling
  errors: [{
    channel: {
      type: String,
      required: true
    },
    
    error_code: {
      type: String,
      required: true,
      trim: true
    },
    
    error_message: {
      type: String,
      required: true,
      trim: true
    },
    
    occurred_at: {
      type: Date,
      default: Date.now
    },
    
    retry_attempt: {
      type: Number,
      default: 0
    }
  }],
  
  // Additional Metadata
  tags: [{
    type: String,
    trim: true
  }],
  
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'یادداشت‌ها نمی‌تواند بیش از 1000 کاراکتر باشد']
  },
  
  // Audit Trail
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
notificationSchema.index({ notification_id: 1 });
notificationSchema.index({ recipient: 1 });
notificationSchema.index({ type: 1, category: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ scheduled_at: 1 });
notificationSchema.index({ created_at: -1 });
notificationSchema.index({ 'channels.status': 1 });
notificationSchema.index({ 'tracking.opened': 1 });

// Virtual for notification summary
notificationSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    notification_id: this.notification_id,
    title: this.title,
    message: this.message,
    type: this.type,
    category: this.category,
    priority: this.priority,
    status: this.status,
    recipient: this.recipient,
    created_at: this.createdAt
  };
});

// Virtual for delivery status
notificationSchema.virtual('delivery_status').get(function() {
  const channels = this.channels || [];
  const totalChannels = channels.length;
  const sentChannels = channels.filter(c => c.status === 'sent' || c.status === 'delivered').length;
  const failedChannels = channels.filter(c => c.status === 'failed').length;
  
  return {
    total_channels: totalChannels,
    sent_channels: sentChannels,
    failed_channels: failedChannels,
    success_rate: totalChannels > 0 ? (sentChannels / totalChannels) * 100 : 0,
    is_fully_delivered: sentChannels === totalChannels,
    has_failures: failedChannels > 0
  };
});

// Pre-save middleware to generate notification ID
notificationSchema.pre('save', function(next) {
  if (!this.notification_id) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.notification_id = `NOTIF${timestamp}${random}`.toUpperCase();
  }
  
  // Set expiration date if not provided (default to 30 days)
  if (!this.expires_at) {
    this.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  // Update status based on scheduling
  if (this.scheduled_at && this.scheduled_at > new Date()) {
    this.status = 'scheduled';
  } else if (this.status === 'draft' && !this.scheduled_at) {
    this.status = 'sending';
  }
  
  next();
});

// Method to mark as sent
notificationSchema.methods.markAsSent = function(channelType) {
  const channel = this.channels.find(c => c.type === channelType);
  if (channel) {
    channel.status = 'sent';
    channel.sent_at = new Date();
  }
  
  // Check if all channels are sent
  const allChannelsSent = this.channels.every(c => c.status === 'sent' || c.status === 'delivered');
  if (allChannelsSent) {
    this.status = 'sent';
    this.sent_at = new Date();
  }
  
  return this.save();
};

// Method to mark as delivered
notificationSchema.methods.markAsDelivered = function(channelType) {
  const channel = this.channels.find(c => c.type === channelType);
  if (channel) {
    channel.status = 'delivered';
    channel.delivered_at = new Date();
  }
  
  // Check if all channels are delivered
  const allChannelsDelivered = this.channels.every(c => c.status === 'delivered');
  if (allChannelsDelivered) {
    this.status = 'delivered';
    this.delivered_at = new Date();
  }
  
  return this.save();
};

// Method to mark as failed
notificationSchema.methods.markAsFailed = function(channelType, errorCode, errorMessage) {
  const channel = this.channels.find(c => c.type === channelType);
  if (channel) {
    channel.status = 'failed';
    channel.failure_reason = errorMessage;
  }
  
  // Add to errors array
  this.errors.push({
    channel: channelType,
    error_code: errorCode,
    error_message: errorMessage,
    occurred_at: new Date(),
    retry_attempt: this.delivery_settings.retry_count
  });
  
  return this.save();
};

// Method to retry delivery
notificationSchema.methods.retryDelivery = function() {
  if (this.delivery_settings.retry_count < this.delivery_settings.max_retries) {
    this.delivery_settings.retry_count += 1;
    this.status = 'sending';
    
    // Reset failed channels
    this.channels.forEach(channel => {
      if (channel.status === 'failed') {
        channel.status = 'pending';
        channel.failure_reason = undefined;
      }
    });
    
    return this.save();
  }
  
  throw new Error('Maximum retry attempts exceeded');
};

// Static method to get notification statistics
notificationSchema.statics.getNotificationStats = async function(filters = {}) {
  const matchStage = {};
  
  if (filters.recipient) matchStage.recipient = mongoose.Types.ObjectId(filters.recipient);
  if (filters.type) matchStage.type = filters.type;
  if (filters.category) matchStage.category = filters.category;
  if (filters.status) matchStage.status = filters.status;
  if (filters.date_from) matchStage.created_at = { $gte: new Date(filters.date_from) };
  if (filters.date_to) {
    matchStage.created_at = { ...matchStage.created_at, $lte: new Date(filters.date_to) };
  }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total_notifications: { $sum: 1 },
        sent_notifications: {
          $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] }
        },
        delivered_notifications: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        failed_notifications: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        opened_notifications: {
          $sum: { $cond: ['$tracking.opened', 1, 0] }
        },
        clicked_notifications: {
          $sum: { $cond: ['$tracking.clicked', 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    total_notifications: 0,
    sent_notifications: 0,
    delivered_notifications: 0,
    failed_notifications: 0,
    opened_notifications: 0,
    clicked_notifications: 0
  };
};

// Static method to find notifications by filters
notificationSchema.statics.findByFilters = function(filters) {
  const query = {};
  
  if (filters.recipient) query.recipient = filters.recipient;
  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.date_from) query.created_at = { $gte: new Date(filters.date_from) };
  if (filters.date_to) {
    query.created_at = { ...query.created_at, $lte: new Date(filters.date_to) };
  }
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { message: { $regex: filters.search, $options: 'i' } },
      { notification_id: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return this.find(query);
};

module.exports = mongoose.model('Notification', notificationSchema);
