const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  // Investor Information
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'سرمایه‌گذار الزامی است']
  },
  
  investor_email: {
    type: String,
    required: [true, 'ایمیل سرمایه‌گذار الزامی است'],
    lowercase: true,
    trim: true
  },
  
  investor_name: {
    type: String,
    required: [true, 'نام سرمایه‌گذار الزامی است'],
    trim: true
  },
  
  // Property Information
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'ملک الزامی است']
  },
  
  property_title: {
    type: String,
    required: [true, 'عنوان ملک الزامی است'],
    trim: true
  },
  
  property_address: {
    type: String,
    required: [true, 'آدرس ملک الزامی است'],
    trim: true
  },
  
  // Investment Details
  investment_amount: {
    type: Number,
    required: [true, 'مبلغ سرمایه‌گذاری الزامی است'],
    min: [10000, 'حداقل سرمایه‌گذاری 10 هزار ریال است']
  },
  
  tokens_purchased: {
    type: Number,
    required: [true, 'تعداد توکن‌های خریداری شده الزامی است'],
    min: [1, 'حداقل یک توکن باید خریداری شود']
  },
  
  token_price_at_purchase: {
    type: Number,
    required: [true, 'قیمت توکن در زمان خرید الزامی است'],
    min: [1000, 'قیمت توکن باید حداقل 1000 ریال باشد']
  },
  
  // Investment Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Payment Information
  payment_method: {
    type: String,
    enum: ['bank_transfer', 'credit_card', 'crypto', 'wallet'],
    required: [true, 'روش پرداخت الزامی است']
  },
  
  payment_reference: {
    type: String,
    trim: true
  },
  
  payment_status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  payment_date: {
    type: Date
  },
  
  // Investment Timeline
  investment_date: {
    type: Date,
    default: Date.now
  },
  
  maturity_date: {
    type: Date
  },
  
  // Returns and Performance
  expected_annual_return: {
    type: Number,
    min: [0, 'بازدهی سالانه نمی‌تواند منفی باشد'],
    max: [100, 'بازدهی سالانه نمی‌تواند بیش از 100% باشد']
  },
  
  actual_return_percentage: {
    type: Number,
    default: 0,
    min: [0, 'بازدهی واقعی نمی‌تواند منفی باشد']
  },
  
  total_return_amount: {
    type: Number,
    default: 0,
    min: [0, 'مبلغ بازدهی نمی‌تواند منفی باشد']
  },
  
  // Dividends and Distributions
  dividends_received: {
    type: Number,
    default: 0,
    min: [0, 'سود سهام نمی‌تواند منفی باشد']
  },
  
  last_dividend_date: {
    type: Date
  },
  
  // Secondary Market
  is_listed_for_sale: {
    type: Boolean,
    default: false
  },
  
  sale_price: {
    type: Number,
    min: [0, 'قیمت فروش نمی‌تواند منفی باشد']
  },
  
  sale_listing_date: {
    type: Date
  },
  
  // Risk Assessment
  risk_level: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  risk_score: {
    type: Number,
    min: [0, 'امتیاز ریسک نمی‌تواند منفی باشد'],
    max: [100, 'امتیاز ریسک نمی‌تواند بیش از 100 باشد']
  },
  
  // Documentation
  investment_agreement: {
    url: String,
    signed_date: Date,
    version: String
  },
  
  certificates: [{
    certificate_number: String,
    issue_date: Date,
    url: String,
    status: {
      type: String,
      enum: ['issued', 'pending', 'cancelled'],
      default: 'pending'
    }
  }],
  
  // Analytics and Tracking
  current_value: {
    type: Number,
    default: function() { return this.investment_amount; }
  },
  
  profit_loss: {
    type: Number,
    default: 0
  },
  
  profit_loss_percentage: {
    type: Number,
    default: 0
  },
  
  // Compliance and Legal
  kyc_status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  
  compliance_notes: {
    type: String,
    maxlength: [1000, 'یادداشت‌های انطباق نمی‌تواند بیش از 1000 کاراکتر باشد']
  },
  
  // Audit Trail
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  approval_date: {
    type: Date
  },
  
  // Additional Metadata
  tags: [{
    type: String,
    trim: true
  }],
  
  notes: {
    type: String,
    maxlength: [2000, 'یادداشت‌ها نمی‌تواند بیش از 2000 کاراکتر باشد']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
investmentSchema.index({ investor: 1 });
investmentSchema.index({ property: 1 });
investmentSchema.index({ status: 1 });
investmentSchema.index({ investment_date: -1 });
investmentSchema.index({ investor_email: 1 });
investmentSchema.index({ payment_status: 1 });
investmentSchema.index({ is_listed_for_sale: 1 });

// Virtual for investment duration in days
investmentSchema.virtual('investment_duration_days').get(function() {
  if (!this.investment_date) return 0;
  const endDate = this.maturity_date || new Date();
  return Math.floor((endDate - this.investment_date) / (1000 * 60 * 60 * 24));
});

// Virtual for current ROI
investmentSchema.virtual('current_roi').get(function() {
  if (this.investment_amount === 0) return 0;
  return ((this.current_value - this.investment_amount) / this.investment_amount) * 100;
});

// Virtual for investment summary
investmentSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    investor_name: this.investor_name,
    property_title: this.property_title,
    investment_amount: this.investment_amount,
    tokens_purchased: this.tokens_purchased,
    status: this.status,
    current_value: this.current_value,
    profit_loss: this.profit_loss,
    profit_loss_percentage: this.profit_loss_percentage,
    investment_date: this.investment_date,
    created_at: this.createdAt
  };
});

// Pre-save middleware to calculate derived fields
investmentSchema.pre('save', function(next) {
  // Calculate current value if not set
  if (!this.current_value) {
    this.current_value = this.investment_amount;
  }
  
  // Calculate profit/loss
  this.profit_loss = this.current_value - this.investment_amount;
  
  // Calculate profit/loss percentage
  if (this.investment_amount > 0) {
    this.profit_loss_percentage = (this.profit_loss / this.investment_amount) * 100;
  }
  
  // Set maturity date if not provided (default to 1 year)
  if (!this.maturity_date && this.investment_date) {
    this.maturity_date = new Date(this.investment_date.getTime() + (365 * 24 * 60 * 60 * 1000));
  }
  
  next();
});

// Static method to find investments by filters
investmentSchema.statics.findByFilters = function(filters) {
  const query = {};
  
  if (filters.investor) query.investor = filters.investor;
  if (filters.property) query.property = filters.property;
  if (filters.status) query.status = filters.status;
  if (filters.payment_status) query.payment_status = filters.payment_status;
  if (filters.min_amount) query.investment_amount = { $gte: filters.min_amount };
  if (filters.max_amount) {
    query.investment_amount = { ...query.investment_amount, $lte: filters.max_amount };
  }
  if (filters.date_from) query.investment_date = { $gte: new Date(filters.date_from) };
  if (filters.date_to) {
    query.investment_date = { ...query.investment_date, $lte: new Date(filters.date_to) };
  }
  if (filters.is_listed_for_sale !== undefined) {
    query.is_listed_for_sale = filters.is_listed_for_sale;
  }
  
  return this.find(query);
};

// Static method to calculate portfolio statistics
investmentSchema.statics.getPortfolioStats = async function(investorId) {
  const stats = await this.aggregate([
    { $match: { investor: mongoose.Types.ObjectId(investorId) } },
    {
      $group: {
        _id: null,
        total_investments: { $sum: 1 },
        total_amount: { $sum: '$investment_amount' },
        total_current_value: { $sum: '$current_value' },
        total_profit_loss: { $sum: '$profit_loss' },
        avg_return_percentage: { $avg: '$profit_loss_percentage' },
        active_investments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        },
        completed_investments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    total_investments: 0,
    total_amount: 0,
    total_current_value: 0,
    total_profit_loss: 0,
    avg_return_percentage: 0,
    active_investments: 0,
    completed_investments: 0
  };
};

module.exports = mongoose.model('Investment', investmentSchema);
