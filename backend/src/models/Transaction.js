const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Transaction Identification
  transaction_id: {
    type: String,
    required: [true, 'شناسه تراکنش الزامی است'],
    unique: true,
    uppercase: true,
    trim: true
  },
  
  reference_number: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  
  // User and Wallet Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'کاربر الزامی است']
  },
  
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: [true, 'کیف پول الزامی است']
  },
  
  user_email: {
    type: String,
    required: [true, 'ایمیل کاربر الزامی است'],
    lowercase: true,
    trim: true
  },
  
  // Transaction Details
  type: {
    type: String,
    required: [true, 'نوع تراکنش الزامی است'],
    enum: [
      'deposit',           // واریز
      'withdrawal',        // برداشت
      'transfer_in',       // انتقال ورودی
      'transfer_out',      // انتقال خروجی
      'investment',        // سرمایه‌گذاری
      'refund',           // بازگشت
      'fee',              // کارمزد
      'interest',         // سود
      'dividend',         // سود سهام
      'purchase',         // خرید
      'sale',             // فروش
      'exchange'          // تبدیل ارز
    ]
  },
  
  category: {
    type: String,
    enum: [
      'investment',       // سرمایه‌گذاری
      'trading',          // معاملات
      'payment',          // پرداخت
      'transfer',         // انتقال
      'fee',              // کارمزد
      'reward',           // پاداش
      'refund',           // بازگشت
      'other'             // سایر
    ],
    default: 'other'
  },
  
  // Amount Information
  amount: {
    type: Number,
    required: [true, 'مبلغ تراکنش الزامی است'],
    min: [0, 'مبلغ تراکنش نمی‌تواند منفی باشد']
  },
  
  currency: {
    type: String,
    required: [true, 'واحد پول الزامی است'],
    enum: ['IRR', 'USD', 'EUR', 'BTC', 'ETH'],
    uppercase: true,
    default: 'IRR'
  },
  
  exchange_rate: {
    type: Number,
    min: [0, 'نرخ تبدیل نمی‌تواند منفی باشد']
  },
  
  // Transaction Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Payment Information
  payment_method: {
    type: String,
    enum: [
      'bank_transfer',    // انتقال بانکی
      'credit_card',      // کارت اعتباری
      'debit_card',       // کارت نقدی
      'crypto',           // ارز دیجیتال
      'wallet',           // کیف پول
      'cash',             // نقد
      'check',            // چک
      'other'             // سایر
    ],
    required: [true, 'روش پرداخت الزامی است']
  },
  
  payment_gateway: {
    type: String,
    enum: ['zarinpal', 'payir', 'idpay', 'bank', 'crypto', 'manual'],
    default: 'manual'
  },
  
  payment_reference: {
    type: String,
    trim: true
  },
  
  payment_token: {
    type: String,
    select: false,
    trim: true
  },
  
  // Related Entities
  related_investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  },
  
  related_property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  
  related_tref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TREF'
  },
  
  // Transfer Information
  transfer_to_wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  },
  
  transfer_to_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Fee Information
  fee_amount: {
    type: Number,
    default: 0,
    min: [0, 'مبلغ کارمزد نمی‌تواند منفی باشد']
  },
  
  fee_percentage: {
    type: Number,
    default: 0,
    min: [0, 'درصد کارمزد نمی‌تواند منفی باشد'],
    max: [100, 'درصد کارمزد نمی‌تواند بیش از 100 باشد']
  },
  
  net_amount: {
    type: Number,
    default: function() { return this.amount - this.fee_amount; },
    min: [0, 'مبلغ خالص نمی‌تواند منفی باشد']
  },
  
  // Transaction Metadata
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'توضیحات نمی‌تواند بیش از 500 کاراکتر باشد']
  },
  
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'یادداشت‌ها نمی‌تواند بیش از 1000 کاراکتر باشد']
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  // Timestamps
  processed_at: {
    type: Date
  },
  
  completed_at: {
    type: Date
  },
  
  failed_at: {
    type: Date
  },
  
  // Error Information
  error_code: {
    type: String,
    trim: true
  },
  
  error_message: {
    type: String,
    trim: true
  },
  
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
  
  // Compliance and Audit
  compliance_status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },
  
  compliance_notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'یادداشت‌های انطباق نمی‌تواند بیش از 1000 کاراکتر باشد']
  },
  
  // IP and Device Information
  ip_address: {
    type: String,
    trim: true
  },
  
  user_agent: {
    type: String,
    trim: true
  },
  
  device_info: {
    type: String,
    trim: true
  },
  
  // Location Information
  location: {
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  
  // Additional Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
transactionSchema.index({ transaction_id: 1 });
transactionSchema.index({ user: 1 });
transactionSchema.index({ wallet: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ payment_method: 1 });
transactionSchema.index({ created_at: -1 });
transactionSchema.index({ amount: 1 });
transactionSchema.index({ currency: 1 });

// Virtual for transaction summary
transactionSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    transaction_id: this.transaction_id,
    type: this.type,
    amount: this.amount,
    currency: this.currency,
    status: this.status,
    payment_method: this.payment_method,
    created_at: this.createdAt,
    completed_at: this.completed_at
  };
});

// Virtual for transaction duration
transactionSchema.virtual('duration').get(function() {
  if (this.completed_at && this.created_at) {
    return Math.floor((this.completed_at - this.created_at) / 1000); // in seconds
  }
  return null;
});

// Pre-save middleware to generate transaction ID
transactionSchema.pre('save', function(next) {
  if (!this.transaction_id) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.transaction_id = `TXN${timestamp}${random}`.toUpperCase();
  }
  
  if (!this.reference_number && this.status === 'completed') {
    this.reference_number = `REF${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase();
  }
  
  // Update timestamps based on status
  if (this.isModified('status')) {
    switch (this.status) {
      case 'processing':
        this.processed_at = new Date();
        break;
      case 'completed':
        this.completed_at = new Date();
        break;
      case 'failed':
        this.failed_at = new Date();
        break;
    }
  }
  
  next();
});

// Method to check if transaction can be retried
transactionSchema.methods.canRetry = function() {
  return this.status === 'failed' && 
         this.retry_count < this.max_retries &&
         this.created_at > new Date(Date.now() - 24 * 60 * 60 * 1000); // Within 24 hours
};

// Method to retry transaction
transactionSchema.methods.retry = function() {
  if (this.canRetry()) {
    this.status = 'pending';
    this.retry_count += 1;
    this.error_code = undefined;
    this.error_message = undefined;
    return this.save();
  }
  throw new Error('Transaction cannot be retried');
};

// Method to complete transaction
transactionSchema.methods.complete = function() {
  this.status = 'completed';
  this.completed_at = new Date();
  return this.save();
};

// Method to fail transaction
transactionSchema.methods.fail = function(errorCode, errorMessage) {
  this.status = 'failed';
  this.failed_at = new Date();
  this.error_code = errorCode;
  this.error_message = errorMessage;
  return this.save();
};

// Static method to get transaction statistics
transactionSchema.statics.getTransactionStats = async function(filters = {}) {
  const matchStage = {};
  
  if (filters.user) matchStage.user = mongoose.Types.ObjectId(filters.user);
  if (filters.type) matchStage.type = filters.type;
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
        total_transactions: { $sum: 1 },
        total_amount: { $sum: '$amount' },
        total_fees: { $sum: '$fee_amount' },
        completed_transactions: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        failed_transactions: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        pending_transactions: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        avg_amount: { $avg: '$amount' },
        max_amount: { $max: '$amount' },
        min_amount: { $min: '$amount' }
      }
    }
  ]);
  
  return stats[0] || {
    total_transactions: 0,
    total_amount: 0,
    total_fees: 0,
    completed_transactions: 0,
    failed_transactions: 0,
    pending_transactions: 0,
    avg_amount: 0,
    max_amount: 0,
    min_amount: 0
  };
};

// Static method to find transactions by filters
transactionSchema.statics.findByFilters = function(filters) {
  const query = {};
  
  if (filters.user) query.user = filters.user;
  if (filters.wallet) query.wallet = filters.wallet;
  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  if (filters.payment_method) query.payment_method = filters.payment_method;
  if (filters.currency) query.currency = filters.currency;
  if (filters.min_amount) query.amount = { $gte: filters.min_amount };
  if (filters.max_amount) {
    query.amount = { ...query.amount, $lte: filters.max_amount };
  }
  if (filters.date_from) query.created_at = { $gte: new Date(filters.date_from) };
  if (filters.date_to) {
    query.created_at = { ...query.created_at, $lte: new Date(filters.date_to) };
  }
  if (filters.search) {
    query.$or = [
      { transaction_id: { $regex: filters.search, $options: 'i' } },
      { reference_number: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return this.find(query);
};

module.exports = mongoose.model('Transaction', transactionSchema);
