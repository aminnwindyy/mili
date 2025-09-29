const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'کاربر الزامی است'],
    unique: true
  },
  
  user_email: {
    type: String,
    required: [true, 'ایمیل کاربر الزامی است'],
    lowercase: true,
    trim: true
  },
  
  // Wallet Balance
  balance: {
    type: Number,
    default: 0,
    min: [0, 'موجودی نمی‌تواند منفی باشد']
  },
  
  // Currency Information
  currency: {
    type: String,
    default: 'IRR',
    enum: ['IRR', 'USD', 'EUR', 'BTC', 'ETH'],
    uppercase: true
  },
  
  // Wallet Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'frozen', 'closed'],
    default: 'active'
  },
  
  // Wallet Type
  wallet_type: {
    type: String,
    enum: ['primary', 'investment', 'savings', 'trading'],
    default: 'primary'
  },
  
  // Security Settings
  security: {
    pin: {
      type: String,
      select: false,
      minlength: [4, 'PIN باید حداقل 4 رقم باشد'],
      maxlength: [6, 'PIN نمی‌تواند بیش از 6 رقم باشد']
    },
    
    two_factor_enabled: {
      type: Boolean,
      default: false
    },
    
    biometric_enabled: {
      type: Boolean,
      default: false
    },
    
    max_daily_transaction: {
      type: Number,
      default: 100000000, // 100 million Rial
      min: [0, 'حداکثر تراکنش روزانه نمی‌تواند منفی باشد']
    },
    
    max_single_transaction: {
      type: Number,
      default: 50000000, // 50 million Rial
      min: [0, 'حداکثر تراکنش واحد نمی‌تواند منفی باشد']
    },
    
    auto_lock_enabled: {
      type: Boolean,
      default: true
    },
    
    auto_lock_duration: {
      type: Number,
      default: 15, // 15 minutes
      min: [1, 'مدت قفل خودکار باید حداقل 1 دقیقه باشد']
    }
  },
  
  // Transaction Limits
  limits: {
    daily_limit: {
      type: Number,
      default: 1000000000, // 1 billion Rial
      min: [0, 'حد روزانه نمی‌تواند منفی باشد']
    },
    
    monthly_limit: {
      type: Number,
      default: 10000000000, // 10 billion Rial
      min: [0, 'حد ماهانه نمی‌تواند منفی باشد']
    },
    
    yearly_limit: {
      type: Number,
      default: 100000000000, // 100 billion Rial
      min: [0, 'حد سالانه نمی‌تواند منفی باشد']
    }
  },
  
  // Usage Statistics
  usage_stats: {
    total_transactions: {
      type: Number,
      default: 0
    },
    
    total_volume: {
      type: Number,
      default: 0
    },
    
    daily_volume: {
      type: Number,
      default: 0
    },
    
    monthly_volume: {
      type: Number,
      default: 0
    },
    
    last_transaction_date: {
      type: Date
    },
    
    last_login_date: {
      type: Date
    }
  },
  
  // Wallet Settings
  settings: {
    notifications: {
      transaction_alerts: {
        type: Boolean,
        default: true
      },
      
      balance_alerts: {
        type: Boolean,
        default: true
      },
      
      security_alerts: {
        type: Boolean,
        default: true
      },
      
      marketing_emails: {
        type: Boolean,
        default: false
      }
    },
    
    privacy: {
      show_balance: {
        type: Boolean,
        default: true
      },
      
      transaction_history_visible: {
        type: Boolean,
        default: true
      }
    },
    
    preferences: {
      default_currency: {
        type: String,
        default: 'IRR',
        enum: ['IRR', 'USD', 'EUR']
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
    }
  },
  
  // Wallet History
  balance_history: [{
    amount: {
      type: Number,
      required: true
    },
    
    previous_balance: {
      type: Number,
      required: true
    },
    
    new_balance: {
      type: Number,
      required: true
    },
    
    transaction_type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'investment', 'refund', 'fee', 'interest'],
      required: true
    },
    
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    
    description: {
      type: String,
      trim: true
    },
    
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Backup and Recovery
  backup_codes: [{
    code: {
      type: String,
      select: false
    },
    
    used: {
      type: Boolean,
      default: false
    },
    
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Compliance and KYC
  kyc_status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending'
  },
  
  kyc_level: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    default: 'basic'
  },
  
  verification_date: {
    type: Date
  },
  
  // Additional Metadata
  tags: [{
    type: String,
    trim: true
  }],
  
  notes: {
    type: String,
    maxlength: [1000, 'یادداشت‌ها نمی‌تواند بیش از 1000 کاراکتر باشد']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
walletSchema.index({ user: 1 });
walletSchema.index({ user_email: 1 });
walletSchema.index({ status: 1 });
walletSchema.index({ wallet_type: 1 });
walletSchema.index({ currency: 1 });
walletSchema.index({ created_at: -1 });

// Virtual for wallet summary
walletSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    user_email: this.user_email,
    balance: this.balance,
    currency: this.currency,
    status: this.status,
    wallet_type: this.wallet_type,
    total_transactions: this.usage_stats.total_transactions,
    last_transaction_date: this.usage_stats.last_transaction_date,
    created_at: this.createdAt
  };
});

// Virtual for security status
walletSchema.virtual('security_status').get(function() {
  return {
    two_factor_enabled: this.security.two_factor_enabled,
    biometric_enabled: this.security.biometric_enabled,
    pin_set: !!this.security.pin,
    auto_lock_enabled: this.security.auto_lock_enabled,
    kyc_status: this.kyc_status,
    kyc_level: this.kyc_level
  };
});

// Pre-save middleware to update usage statistics
walletSchema.pre('save', function(next) {
  // Update last login date if wallet is being accessed
  if (this.isModified('usage_stats.last_login_date')) {
    this.usage_stats.last_login_date = new Date();
  }
  
  next();
});

// Method to check if transaction is allowed
walletSchema.methods.canProcessTransaction = function(amount, transactionType) {
  // Check if wallet is active
  if (this.status !== 'active') {
    return { allowed: false, reason: 'کیف پول غیرفعال است' };
  }
  
  // Check daily limit
  if (this.usage_stats.daily_volume + amount > this.limits.daily_limit) {
    return { allowed: false, reason: 'حد روزانه تراکنش تجاوز شده است' };
  }
  
  // Check monthly limit
  if (this.usage_stats.monthly_volume + amount > this.limits.monthly_limit) {
    return { allowed: false, reason: 'حد ماهانه تراکنش تجاوز شده است' };
  }
  
  // Check single transaction limit
  if (amount > this.security.max_single_transaction) {
    return { allowed: false, reason: 'مبلغ تراکنش از حد مجاز تجاوز می‌کند' };
  }
  
  // Check balance for withdrawals
  if (transactionType === 'withdrawal' && this.balance < amount) {
    return { allowed: false, reason: 'موجودی کافی نیست' };
  }
  
  return { allowed: true };
};

// Method to update balance
walletSchema.methods.updateBalance = function(amount, transactionType, description, transactionId) {
  const previousBalance = this.balance;
  const newBalance = this.balance + amount;
  
  // Add to balance history
  this.balance_history.push({
    amount,
    previous_balance: previousBalance,
    new_balance: newBalance,
    transaction_type: transactionType,
    transaction_id: transactionId,
    description,
    created_at: new Date()
  });
  
  // Update balance
  this.balance = newBalance;
  
  // Update usage statistics
  this.usage_stats.total_transactions += 1;
  this.usage_stats.total_volume += Math.abs(amount);
  this.usage_stats.daily_volume += Math.abs(amount);
  this.usage_stats.monthly_volume += Math.abs(amount);
  this.usage_stats.last_transaction_date = new Date();
  
  return this.save();
};

// Method to get balance history
walletSchema.methods.getBalanceHistory = function(limit = 50, offset = 0) {
  return this.balance_history
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(offset, offset + limit);
};

// Static method to get wallet statistics
walletSchema.statics.getWalletStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total_wallets: { $sum: 1 },
        total_balance: { $sum: '$balance' },
        active_wallets: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        total_transactions: { $sum: '$usage_stats.total_transactions' },
        total_volume: { $sum: '$usage_stats.total_volume' },
        avg_balance: { $avg: '$balance' }
      }
    }
  ]);
  
  return stats[0] || {
    total_wallets: 0,
    total_balance: 0,
    active_wallets: 0,
    total_transactions: 0,
    total_volume: 0,
    avg_balance: 0
  };
};

module.exports = mongoose.model('Wallet', walletSchema);
