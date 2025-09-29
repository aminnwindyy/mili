const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Basic Property Info
  title: {
    type: String,
    required: [true, 'عنوان ملک الزامی است'],
    trim: true,
    maxlength: [200, 'عنوان نمی‌تواند بیش از 200 کاراکتر باشد']
  },
  
  description: {
    type: String,
    required: [true, 'توضیحات ملک الزامی است'],
    maxlength: [2000, 'توضیحات نمی‌تواند بیش از 2000 کاراکتر باشد']
  },
  
  address: {
    type: String,
    required: [true, 'آدرس ملک الزامی است'],
    trim: true
  },
  
  // Location Details
  city: {
    type: String,
    required: [true, 'شهر الزامی است'],
    enum: ['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'اهواز', 'قم', 'کرمانشاه', 'ارومیه']
  },
  
  district: {
    type: String,
    trim: true
  },
  
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  
  // Property Specifications
  property_type: {
    type: String,
    required: [true, 'نوع ملک الزامی است'],
    enum: ['آپارتمان', 'خانه', 'اداری', 'تجاری', 'صنعتی', 'زمین', 'ویلا']
  },
  
  area: {
    type: Number,
    required: [true, 'متراژ الزامی است'],
    min: [1, 'متراژ باید بیشتر از صفر باشد']
  },
  
  rooms: {
    type: Number,
    min: [0, 'تعداد اتاق نمی‌تواند منفی باشد']
  },
  
  floors: {
    type: Number,
    min: [1, 'تعداد طبقه باید حداقل 1 باشد']
  },
  
  floor_number: {
    type: Number,
    min: [0, 'شماره طبقه نمی‌تواند منفی باشد']
  },
  
  // Financial Information
  total_value: {
    type: Number,
    required: [true, 'ارزش کل ملک الزامی است'],
    min: [1000000, 'ارزش ملک باید حداقل 1 میلیون ریال باشد']
  },
  
  token_price: {
    type: Number,
    required: [true, 'قیمت توکن الزامی است'],
    min: [10000, 'قیمت توکن باید حداقل 10 هزار ریال باشد']
  },
  
  total_tokens: {
    type: Number,
    required: [true, 'تعداد کل توکن‌ها الزامی است'],
    min: [1, 'تعداد توکن باید حداقل 1 باشد']
  },
  
  available_tokens: {
    type: Number,
    default: function() { return this.total_tokens; },
    min: [0, 'توکن‌های موجود نمی‌تواند منفی باشد']
  },
  
  // Investment Details
  expected_annual_return: {
    type: Number,
    min: [0, 'بازدهی سالانه نمی‌تواند منفی باشد'],
    max: [100, 'بازدهی سالانه نمی‌تواند بیش از 100% باشد']
  },
  
  minimum_investment: {
    type: Number,
    default: function() { return this.token_price; },
    min: [10000, 'حداقل سرمایه‌گذاری باید حداقل 10 هزار ریال باشد']
  },
  
  // Property Status
  status: {
    type: String,
    enum: ['در_حال_بررسی', 'تایید_شده', 'در_حال_فروش', 'فروخته_شده', 'رد_شده', 'تکمیل_شده'],
    default: 'در_حال_بررسی'
  },
  
  // Owner Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'مالک ملک الزامی است']
  },
  
  owner_name: {
    type: String,
    required: [true, 'نام مالک الزامی است']
  },
  
  owner_contact: {
    type: String,
    required: [true, 'اطلاعات تماس مالک الزامی است']
  },
  
  // Documents and Images
  documents: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['سند', 'پروانه', 'تصویر', 'سایر'],
      default: 'سایر'
    },
    uploaded_at: { type: Date, default: Date.now }
  }],
  
  images: [{
    url: { type: String, required: true },
    alt_text: { type: String },
    is_primary: { type: Boolean, default: false },
    uploaded_at: { type: Date, default: Date.now }
  }],
  
  // Additional Features
  features: [{
    type: String,
    enum: ['پارکینگ', 'انباری', 'آسانسور', 'بالکن', 'تراس', 'حیاط', 'استخر', 'سالن ورزش', 'امنیت', 'نگهبانی']
  }],
  
  // Investment Timeline
  investment_start_date: {
    type: Date
  },
  
  investment_end_date: {
    type: Date
  },
  
  // Analytics
  views_count: {
    type: Number,
    default: 0
  },
  
  investment_count: {
    type: Number,
    default: 0
  },
  
  // Verification
  is_verified: {
    type: Boolean,
    default: false
  },
  
  verified_at: {
    type: Date
  },
  
  verified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
propertySchema.index({ title: 'text', description: 'text', address: 'text' });
propertySchema.index({ city: 1, property_type: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ total_value: 1 });
propertySchema.index({ created_at: -1 });

// Virtual for investment progress
propertySchema.virtual('investment_progress').get(function() {
  const soldTokens = this.total_tokens - this.available_tokens;
  return Math.round((soldTokens / this.total_tokens) * 100);
});

// Virtual for total investment amount
propertySchema.virtual('total_investment').get(function() {
  const soldTokens = this.total_tokens - this.available_tokens;
  return soldTokens * this.token_price;
});

// Virtual for property summary
propertySchema.virtual('summary').get(function() {
  return {
    id: this._id,
    title: this.title,
    address: this.address,
    city: this.city,
    property_type: this.property_type,
    area: this.area,
    total_value: this.total_value,
    token_price: this.token_price,
    available_tokens: this.available_tokens,
    investment_progress: this.investment_progress,
    status: this.status,
    images: this.images,
    created_at: this.createdAt
  };
});

// Pre-save middleware to validate token calculations
propertySchema.pre('save', function(next) {
  // Ensure available_tokens doesn't exceed total_tokens
  if (this.available_tokens > this.total_tokens) {
    this.available_tokens = this.total_tokens;
  }
  
  // Ensure available_tokens is not negative
  if (this.available_tokens < 0) {
    this.available_tokens = 0;
  }
  
  // Calculate token price if not provided
  if (!this.token_price && this.total_value && this.total_tokens) {
    this.token_price = Math.floor(this.total_value / this.total_tokens);
  }
  
  next();
});

// Static method to find properties by filters
propertySchema.statics.findByFilters = function(filters) {
  const query = {};
  
  if (filters.city) query.city = filters.city;
  if (filters.property_type) query.property_type = filters.property_type;
  if (filters.min_price) query.token_price = { $gte: filters.min_price };
  if (filters.max_price) {
    query.token_price = { ...query.token_price, $lte: filters.max_price };
  }
  if (filters.min_area) query.area = { $gte: filters.min_area };
  if (filters.max_area) {
    query.area = { ...query.area, $lte: filters.max_area };
  }
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query);
};

module.exports = mongoose.model('Property', propertySchema);
