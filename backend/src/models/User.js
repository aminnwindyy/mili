const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic info
  full_name: {
    type: String,
    required: [true, 'نام کامل الزامی است'],
    trim: true,
    maxlength: [100, 'نام نمی‌تواند بیش از 100 کاراکتر باشد']
  },
  
  email: {
    type: String,
    required: [true, 'ایمیل الزامی است'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'فرمت ایمیل صحیح نیست']
  },
  
  password: {
    type: String,
    required: [true, 'رمز عبور الزامی است'],
    minlength: [6, 'رمز عبور باید حداقل 6 کاراکتر باشد']
  },
  
  phone: {
    type: String,
    match: [/^(\+98|0)?9\d{9}$/, 'شماره موبایل صحیح نیست']
  },
  
  national_id: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\d{10}$/, 'کد ملی باید 10 رقم باشد']
  },
  
  // Role and permissions
  role: {
    type: String,
    enum: ['investor', 'admin', 'owner'],
    default: 'investor'
  },
  
  // Account status
  is_verified: {
    type: Boolean,
    default: false
  },
  
  is_active: {
    type: Boolean,
    default: true
  },
  
  // Demo mode for testing
  demo_mode: {
    type: Boolean,
    default: false
  },
  
  // Referral system
  referral_code: {
    type: String,
    unique: true,
    sparse: true
  },
  
  referred_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Profile completion
  profile_completed: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  last_login: {
    type: Date
  },
  
  email_verified_at: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ national_id: 1 });
userSchema.index({ referral_code: 1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    full_name: this.full_name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    is_verified: this.is_verified,
    demo_mode: this.demo_mode,
    referral_code: this.referral_code,
    profile_completed: this.profile_completed,
    created_at: this.createdAt
  };
});

// Pre-save middleware to generate referral code
userSchema.pre('save', function(next) {
  if (!this.referral_code) {
    const prefix = 'MELK';
    const hash = this.email.split('@')[0].toUpperCase().substring(0, 4);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.referral_code = `${prefix}-${hash}-${random}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);