const mongoose = require('mongoose');

const trefSchema = new mongoose.Schema({
  // Basic Fund Information
  name: {
    type: String,
    required: [true, 'نام صندوق الزامی است'],
    trim: true,
    maxlength: [200, 'نام صندوق نمی‌تواند بیش از 200 کاراکتر باشد']
  },
  
  description: {
    type: String,
    required: [true, 'توضیحات صندوق الزامی است'],
    maxlength: [2000, 'توضیحات صندوق نمی‌تواند بیش از 2000 کاراکتر باشد']
  },
  
  fund_code: {
    type: String,
    required: [true, 'کد صندوق الزامی است'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^TREF[A-Z0-9]{6}$/, 'کد صندوق باید با TREF شروع شود و 6 کاراکتر بعدی داشته باشد']
  },
  
  // Fund Type and Category
  fund_type: {
    type: String,
    required: [true, 'نوع صندوق الزامی است'],
    enum: ['residential', 'commercial', 'mixed', 'industrial', 'development'],
    default: 'mixed'
  },
  
  category: {
    type: String,
    required: [true, 'دسته‌بندی صندوق الزامی است'],
    enum: ['conservative', 'moderate', 'aggressive', 'growth', 'income'],
    default: 'moderate'
  },
  
  // Fund Manager Information
  fund_manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'مدیر صندوق الزامی است']
  },
  
  fund_manager_name: {
    type: String,
    required: [true, 'نام مدیر صندوق الزامی است'],
    trim: true
  },
  
  fund_manager_contact: {
    type: String,
    required: [true, 'اطلاعات تماس مدیر صندوق الزامی است'],
    trim: true
  },
  
  // Fund Structure
  total_fund_size: {
    type: Number,
    required: [true, 'حجم کل صندوق الزامی است'],
    min: [100000000, 'حداقل حجم صندوق 100 میلیون ریال است'] // 100 million Rial
  },
  
  total_shares: {
    type: Number,
    required: [true, 'تعداد کل سهام الزامی است'],
    min: [1000, 'حداقل تعداد سهام 1000 است']
  },
  
  share_price: {
    type: Number,
    required: [true, 'قیمت هر سهم الزامی است'],
    min: [10000, 'حداقل قیمت سهم 10 هزار ریال است']
  },
  
  available_shares: {
    type: Number,
    default: function() { return this.total_shares; },
    min: [0, 'تعداد سهام موجود نمی‌تواند منفی باشد']
  },
  
  minimum_investment: {
    type: Number,
    default: function() { return this.share_price; },
    min: [10000, 'حداقل سرمایه‌گذاری 10 هزار ریال است']
  },
  
  maximum_investment: {
    type: Number,
    min: [10000, 'حداکثر سرمایه‌گذاری 10 هزار ریال است']
  },
  
  // Fund Performance
  expected_annual_return: {
    type: Number,
    required: [true, 'بازدهی سالانه مورد انتظار الزامی است'],
    min: [0, 'بازدهی سالانه نمی‌تواند منفی باشد'],
    max: [100, 'بازدهی سالانه نمی‌تواند بیش از 100% باشد']
  },
  
  actual_annual_return: {
    type: Number,
    default: 0,
    min: [0, 'بازدهی واقعی نمی‌تواند منفی باشد']
  },
  
  net_asset_value: {
    type: Number,
    default: function() { return this.total_fund_size; },
    min: [0, 'ارزش خالص دارایی نمی‌تواند منفی باشد']
  },
  
  // Fund Status
  status: {
    type: String,
    enum: ['planning', 'launching', 'active', 'closed', 'liquidated', 'suspended'],
    default: 'planning'
  },
  
  launch_date: {
    type: Date
  },
  
  maturity_date: {
    type: Date
  },
  
  // Fund Properties
  properties: [{
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    property_title: {
      type: String,
      required: true
    },
    property_address: {
      type: String,
      required: true
    },
    property_value: {
      type: Number,
      required: true,
      min: [0, 'ارزش ملک نمی‌تواند منفی باشد']
    },
    ownership_percentage: {
      type: Number,
      required: true,
      min: [0.01, 'درصد مالکیت باید حداقل 0.01% باشد'],
      max: [100, 'درصد مالکیت نمی‌تواند بیش از 100% باشد']
    },
    acquisition_date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Fund Performance Metrics
  performance_metrics: {
    total_return: {
      type: Number,
      default: 0
    },
    total_return_percentage: {
      type: Number,
      default: 0
    },
    monthly_return: {
      type: Number,
      default: 0
    },
    quarterly_return: {
      type: Number,
      default: 0
    },
    yearly_return: {
      type: Number,
      default: 0
    },
    volatility: {
      type: Number,
      default: 0
    },
    sharpe_ratio: {
      type: Number,
      default: 0
    },
    max_drawdown: {
      type: Number,
      default: 0
    }
  },
  
  // Fund Fees and Expenses
  management_fee: {
    type: Number,
    required: [true, 'کارمزد مدیریت الزامی است'],
    min: [0, 'کارمزد مدیریت نمی‌تواند منفی باشد'],
    max: [10, 'کارمزد مدیریت نمی‌تواند بیش از 10% باشد']
  },
  
  performance_fee: {
    type: Number,
    default: 0,
    min: [0, 'کارمزد عملکرد نمی‌تواند منفی باشد'],
    max: [20, 'کارمزد عملکرد نمی‌تواند بیش از 20% باشد']
  },
  
  entry_fee: {
    type: Number,
    default: 0,
    min: [0, 'کارمزد ورود نمی‌تواند منفی باشد'],
    max: [5, 'کارمزد ورود نمی‌تواند بیش از 5% باشد']
  },
  
  exit_fee: {
    type: Number,
    default: 0,
    min: [0, 'کارمزد خروج نمی‌تواند منفی باشد'],
    max: [5, 'کارمزد خروج نمی‌تواند بیش از 5% باشد']
  },
  
  // Fund Documents
  documents: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['prospectus', 'financial_report', 'audit_report', 'legal_document', 'other'],
      default: 'other'
    },
    uploaded_at: { type: Date, default: Date.now }
  }],
  
  // Fund Images
  images: [{
    url: { type: String, required: true },
    alt_text: { type: String },
    is_primary: { type: Boolean, default: false },
    uploaded_at: { type: Date, default: Date.now }
  }],
  
  // Risk Assessment
  risk_level: {
    type: String,
    enum: ['low', 'medium', 'high', 'very_high'],
    default: 'medium'
  },
  
  risk_score: {
    type: Number,
    min: [0, 'امتیاز ریسک نمی‌تواند منفی باشد'],
    max: [100, 'امتیاز ریسک نمی‌تواند بیش از 100 باشد']
  },
  
  risk_factors: [{
    factor: { type: String, required: true },
    impact: { 
      type: String, 
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    description: { type: String }
  }],
  
  // Fund Analytics
  total_investors: {
    type: Number,
    default: 0
  },
  
  total_investments: {
    type: Number,
    default: 0
  },
  
  average_investment: {
    type: Number,
    default: 0
  },
  
  // Compliance and Legal
  regulatory_approval: {
    type: Boolean,
    default: false
  },
  
  regulatory_body: {
    type: String,
    trim: true
  },
  
  approval_date: {
    type: Date
  },
  
  compliance_status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  
  // Fund Distribution
  distribution_frequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'semi_annually', 'annually', 'none'],
    default: 'quarterly'
  },
  
  last_distribution_date: {
    type: Date
  },
  
  next_distribution_date: {
    type: Date
  },
  
  distribution_amount: {
    type: Number,
    default: 0,
    min: [0, 'مبلغ توزیع نمی‌تواند منفی باشد']
  },
  
  // Additional Metadata
  tags: [{
    type: String,
    trim: true
  }],
  
  notes: {
    type: String,
    maxlength: [2000, 'یادداشت‌ها نمی‌تواند بیش از 2000 کاراکتر باشد']
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
trefSchema.index({ fund_code: 1 });
trefSchema.index({ fund_type: 1, category: 1 });
trefSchema.index({ status: 1 });
trefSchema.index({ fund_manager: 1 });
trefSchema.index({ expected_annual_return: 1 });
trefSchema.index({ risk_level: 1 });
trefSchema.index({ created_at: -1 });

// Virtual for fund performance
trefSchema.virtual('fund_performance').get(function() {
  const totalValue = this.properties.reduce((sum, prop) => sum + prop.property_value, 0);
  const currentNAV = this.net_asset_value;
  const performance = totalValue > 0 ? ((currentNAV - totalValue) / totalValue) * 100 : 0;
  
  return {
    total_value: totalValue,
    current_nav: currentNAV,
    performance_percentage: Math.round(performance * 100) / 100,
    total_shares: this.total_shares,
    nav_per_share: this.total_shares > 0 ? currentNAV / this.total_shares : 0
  };
});

// Virtual for fund summary
trefSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    name: this.name,
    fund_code: this.fund_code,
    fund_type: this.fund_type,
    category: this.category,
    share_price: this.share_price,
    available_shares: this.available_shares,
    expected_annual_return: this.expected_annual_return,
    status: this.status,
    risk_level: this.risk_level,
    total_investors: this.total_investors,
    images: this.images,
    created_at: this.createdAt
  };
});

// Pre-save middleware to calculate derived fields
trefSchema.pre('save', function(next) {
  // Calculate share price if not provided
  if (!this.share_price && this.total_fund_size && this.total_shares) {
    this.share_price = Math.floor(this.total_fund_size / this.total_shares);
  }
  
  // Ensure available_shares doesn't exceed total_shares
  if (this.available_shares > this.total_shares) {
    this.available_shares = this.total_shares;
  }
  
  // Ensure available_shares is not negative
  if (this.available_shares < 0) {
    this.available_shares = 0;
  }
  
  // Calculate minimum investment if not provided
  if (!this.minimum_investment) {
    this.minimum_investment = this.share_price;
  }
  
  // Set maturity date if not provided (default to 5 years)
  if (!this.maturity_date && this.launch_date) {
    this.maturity_date = new Date(this.launch_date.getTime() + (5 * 365 * 24 * 60 * 60 * 1000));
  }
  
  next();
});

// Static method to find TREFs by filters
trefSchema.statics.findByFilters = function(filters) {
  const query = {};
  
  if (filters.fund_type) query.fund_type = filters.fund_type;
  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;
  if (filters.risk_level) query.risk_level = filters.risk_level;
  if (filters.min_return) query.expected_annual_return = { $gte: filters.min_return };
  if (filters.max_return) {
    query.expected_annual_return = { ...query.expected_annual_return, $lte: filters.max_return };
  }
  if (filters.min_investment) query.minimum_investment = { $lte: filters.min_investment };
  if (filters.max_investment) {
    query.maximum_investment = { ...query.maximum_investment, $gte: filters.max_investment };
  }
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { fund_code: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return this.find(query);
};

// Static method to get fund performance statistics
trefSchema.statics.getPerformanceStats = async function() {
  const stats = await this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: null,
        total_funds: { $sum: 1 },
        total_assets: { $sum: '$net_asset_value' },
        avg_return: { $avg: '$expected_annual_return' },
        avg_risk_score: { $avg: '$risk_score' },
        total_investors: { $sum: '$total_investors' },
        total_investments: { $sum: '$total_investments' }
      }
    }
  ]);
  
  return stats[0] || {
    total_funds: 0,
    total_assets: 0,
    avg_return: 0,
    avg_risk_score: 0,
    total_investors: 0,
    total_investments: 0
  };
};

module.exports = mongoose.model('TREF', trefSchema);
