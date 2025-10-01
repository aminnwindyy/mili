const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // Basic info
  full_name: {
    type: String,
    required: [true, 'نام کامل الزامی است'],
    trim: true,
    minlength: [3, 'نام باید حداقل 3 کاراکتر باشد'],
    maxlength: [100, 'نام نمی‌تواند بیش از 100 کاراکتر باشد']
  },
  
  email: {
    type: String,
    required: [true, 'ایمیل الزامی است'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'فرمت ایمیل صحیح نیست']
  },
  
  password: {
    type: String,
    required: function() {
      // اگر OAuth نباشد، پسورد الزامی است
      return !this.oauth || !this.oauth.provider;
    },
    minlength: [8, 'رمز عبور باید حداقل 8 کاراکتر باشد'],
    select: false,
    validate: {
      validator: function(password) {
        // حداقل یک حرف بزرگ، یک حرف کوچک، یک عدد
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
      },
      message: 'رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد'
    }
  },
  
  phone: {
    type: String,
    trim: true,
    match: [/^(\+98|0)?9\d{9}$/, 'شماره موبایل صحیح نیست']
  },
  
  national_id: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    validate: {
      validator: function(code) {
        return validateNationalId(code);
      },
      message: 'کد ملی معتبر نیست'
    }
  },
  
  // Role and permissions
  role: {
    type: String,
    enum: {
      values: ['investor', 'admin', 'owner'],
      message: 'نقش انتخاب شده معتبر نیست'
    },
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
    sparse: true,
    uppercase: true
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
  
  // Verification tokens
  email_verification_token: {
    type: String,
    select: false
  },
  
  email_verification_expires: {
    type: Date,
    select: false
  },
  
  // Password reset
  password_reset_token: {
    type: String,
    select: false
  },
  
  password_reset_expires: {
    type: Date,
    select: false
  },
  
  // Security
  failed_login_attempts: {
    type: Number,
    default: 0
  },
  
  account_locked_until: {
    type: Date
  },
  
  password_changed_at: {
    type: Date
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

// OAuth fields
userSchema.add({
  oauth: {
    provider: { 
      type: String, 
      enum: ['google', 'github'],
      sparse: true
    },
    provider_id: { 
      type: String, 
      sparse: true
    },
    avatar_url: { type: String }
  }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ national_id: 1 });
userSchema.index({ referral_code: 1 });
userSchema.index({ 'oauth.provider': 1, 'oauth.provider_id': 1 }, { unique: true, sparse: true });
userSchema.index({ createdAt: 1 });

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
    created_at: this.createdAt,
    avatar_url: this.oauth?.avatar_url
  };
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // فقط اگر پسورد تغییر کرده باشد
  if (!this.isModified('password')) return next();
  
  try {
    // هش کردن پسورد
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // تنظیم تاریخ تغییر پسورد
    if (!this.isNew) {
      this.password_changed_at = Date.now() - 1000;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to generate referral code
userSchema.pre('save', function(next) {
  if (!this.referral_code && !this.isModified('referral_code')) {
    const prefix = 'MELK';
    const hash = this.email.split('@')[0].toUpperCase().substring(0, 4).padEnd(4, 'X');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.referral_code = `${prefix}-${hash}-${random}`;
  }
  next();
});

// Instance method: Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method: Generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  
  this.email_verification_token = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // توکن 24 ساعت اعتبار دارد
  this.email_verification_expires = Date.now() + 24 * 60 * 60 * 1000;
  
  return token;
};

// Instance method: Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  
  this.password_reset_token = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // توکن 1 ساعت اعتبار دارد
  this.password_reset_expires = Date.now() + 60 * 60 * 1000;
  
  return token;
};

// Instance method: Check if password was changed after JWT issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.password_changed_at) {
    const changedTimestamp = parseInt(this.password_changed_at.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method: Check if account is locked
userSchema.methods.isAccountLocked = function() {
  return this.account_locked_until && this.account_locked_until > Date.now();
};

// Instance method: Increment failed login attempts
userSchema.methods.incLoginAttempts = async function() {
  // اگر قفل منقضی شده، ریست کن
  if (this.account_locked_until && this.account_locked_until < Date.now()) {
    return await this.updateOne({
      $set: { failed_login_attempts: 1 },
      $unset: { account_locked_until: 1 }
    });
  }
  
  const updates = { $inc: { failed_login_attempts: 1 } };
  
  // قفل کردن حساب بعد از 5 تلاش ناموفق
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 ساعت
  
  if (this.failed_login_attempts + 1 >= maxAttempts && !this.isAccountLocked()) {
    updates.$set = { account_locked_until: Date.now() + lockTime };
  }
  
  return await this.updateOne(updates);
};

// Instance method: Reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { failed_login_attempts: 0 },
    $unset: { account_locked_until: 1 }
  });
};

// Static method: Find by credentials
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('ایمیل یا رمز عبور اشتباه است');
  }
  
  // بررسی قفل بودن حساب
  if (user.isAccountLocked()) {
    throw new Error('حساب شما به دلیل تلاش‌های ناموفق متعدد قفل شده است');
  }
  
  // بررسی فعال بودن حساب
  if (!user.is_active) {
    throw new Error('حساب کاربری غیرفعال است');
  }
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    await user.incLoginAttempts();
    throw new Error('ایمیل یا رمز عبور اشتباه است');
  }
  
  // ریست کردن تلاش‌های ناموفق در صورت موفقیت
  if (user.failed_login_attempts > 0) {
    await user.resetLoginAttempts();
  }
  
  return user;
};

// Helper function: Validate Iranian National ID
function validateNationalId(code) {
  if (!code || !/^\d{10}$/.test(code)) return false;
  
  const check = parseInt(code[9]);
  const sum = code.split('').slice(0, 9).reduce((acc, digit, index) => {
    return acc + parseInt(digit) * (10 - index);
  }, 0);
  
  const remainder = sum % 11;
  
  return (remainder < 2 && check === remainder) || 
         (remainder >= 2 && check === 11 - remainder);
}

module.exports = mongoose.model('User', userSchema);