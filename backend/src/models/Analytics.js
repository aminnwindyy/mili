const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Analytics Type and Category
  analytics_type: {
    type: String,
    required: [true, 'نوع تحلیل الزامی است'],
    enum: [
      'user_behavior',      // رفتار کاربران
      'financial_performance', // عملکرد مالی
      'market_trends',      // روندهای بازار
      'property_analytics', // تحلیل املاک
      'investment_analytics', // تحلیل سرمایه‌گذاری
      'transaction_analytics', // تحلیل تراکنش‌ها
      'system_performance', // عملکرد سیستم
      'compliance_metrics'  // معیارهای انطباق
    ]
  },
  
  category: {
    type: String,
    required: [true, 'دسته‌بندی تحلیل الزامی است'],
    enum: [
      'dashboard',          // داشبورد
      'reports',           // گزارش‌ها
      'insights',          // بینش‌ها
      'predictions',       // پیش‌بینی‌ها
      'alerts',            // هشدارها
      'benchmarks'         // معیارها
    ]
  },
  
  // Time Period
  period: {
    type: String,
    required: [true, 'دوره زمانی الزامی است'],
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'real_time'],
    default: 'daily'
  },
  
  start_date: {
    type: Date,
    required: [true, 'تاریخ شروع الزامی است']
  },
  
  end_date: {
    type: Date,
    required: [true, 'تاریخ پایان الزامی است']
  },
  
  // Analytics Data
  metrics: {
    // User Metrics
    total_users: {
      type: Number,
      default: 0
    },
    
    active_users: {
      type: Number,
      default: 0
    },
    
    new_users: {
      type: Number,
      default: 0
    },
    
    user_retention_rate: {
      type: Number,
      default: 0
    },
    
    user_engagement_score: {
      type: Number,
      default: 0
    },
    
    // Financial Metrics
    total_revenue: {
      type: Number,
      default: 0
    },
    
    total_volume: {
      type: Number,
      default: 0
    },
    
    average_transaction_value: {
      type: Number,
      default: 0
    },
    
    revenue_growth_rate: {
      type: Number,
      default: 0
    },
    
    profit_margin: {
      type: Number,
      default: 0
    },
    
    // Property Metrics
    total_properties: {
      type: Number,
      default: 0
    },
    
    active_properties: {
      type: Number,
      default: 0
    },
    
    property_views: {
      type: Number,
      default: 0
    },
    
    average_property_value: {
      type: Number,
      default: 0
    },
    
    property_conversion_rate: {
      type: Number,
      default: 0
    },
    
    // Investment Metrics
    total_investments: {
      type: Number,
      default: 0
    },
    
    total_investment_amount: {
      type: Number,
      default: 0
    },
    
    average_investment_size: {
      type: Number,
      default: 0
    },
    
    investment_success_rate: {
      type: Number,
      default: 0
    },
    
    roi_average: {
      type: Number,
      default: 0
    },
    
    // Transaction Metrics
    total_transactions: {
      type: Number,
      default: 0
    },
    
    successful_transactions: {
      type: Number,
      default: 0
    },
    
    failed_transactions: {
      type: Number,
      default: 0
    },
    
    transaction_success_rate: {
      type: Number,
      default: 0
    },
    
    average_processing_time: {
      type: Number,
      default: 0
    },
    
    // System Metrics
    system_uptime: {
      type: Number,
      default: 0
    },
    
    response_time_avg: {
      type: Number,
      default: 0
    },
    
    error_rate: {
      type: Number,
      default: 0
    },
    
    api_calls_count: {
      type: Number,
      default: 0
    },
    
    // Market Metrics
    market_cap: {
      type: Number,
      default: 0
    },
    
    market_volume: {
      type: Number,
      default: 0
    },
    
    price_volatility: {
      type: Number,
      default: 0
    },
    
    market_trend: {
      type: String,
      enum: ['bullish', 'bearish', 'sideways', 'volatile'],
      default: 'sideways'
    }
  },
  
  // Trend Analysis
  trends: {
    user_growth_trend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable', 'volatile'],
      default: 'stable'
    },
    
    revenue_trend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable', 'volatile'],
      default: 'stable'
    },
    
    market_trend: {
      type: String,
      enum: ['bullish', 'bearish', 'sideways', 'volatile'],
      default: 'sideways'
    },
    
    performance_trend: {
      type: String,
      enum: ['improving', 'declining', 'stable', 'volatile'],
      default: 'stable'
    }
  },
  
  // Comparative Analysis
  comparisons: {
    previous_period: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    year_over_year: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    industry_benchmark: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    competitor_analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  
  // Insights and Predictions
  insights: [{
    type: {
      type: String,
      enum: ['opportunity', 'risk', 'trend', 'anomaly', 'recommendation'],
      required: true
    },
    
    title: {
      type: String,
      required: true,
      trim: true
    },
    
    description: {
      type: String,
      required: true,
      trim: true
    },
    
    impact_score: {
      type: Number,
      min: 0,
      max: 10,
      default: 5
    },
    
    confidence_level: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    
    actionable: {
      type: Boolean,
      default: false
    },
    
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Predictions
  predictions: [{
    metric_name: {
      type: String,
      required: true,
      trim: true
    },
    
    predicted_value: {
      type: Number,
      required: true
    },
    
    confidence_interval: {
      lower: { type: Number, required: true },
      upper: { type: Number, required: true }
    },
    
    prediction_date: {
      type: Date,
      required: true
    },
    
    accuracy_score: {
      type: Number,
      min: 0,
      max: 100
    },
    
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Alerts and Notifications
  alerts: [{
    alert_type: {
      type: String,
      enum: ['threshold_exceeded', 'anomaly_detected', 'trend_change', 'performance_issue'],
      required: true
    },
    
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    
    message: {
      type: String,
      required: true,
      trim: true
    },
    
    threshold_value: {
      type: Number
    },
    
    actual_value: {
      type: Number
    },
    
    is_resolved: {
      type: Boolean,
      default: false
    },
    
    resolved_at: {
      type: Date
    },
    
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Data Sources
  data_sources: [{
    source_name: {
      type: String,
      required: true,
      trim: true
    },
    
    source_type: {
      type: String,
      enum: ['database', 'api', 'file', 'external_service', 'user_input'],
      required: true
    },
    
    reliability_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 80
    },
    
    last_updated: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Visualization Data
  charts: [{
    chart_type: {
      type: String,
      enum: ['line', 'bar', 'pie', 'scatter', 'area', 'heatmap', 'gauge'],
      required: true
    },
    
    title: {
      type: String,
      required: true,
      trim: true
    },
    
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    is_public: {
      type: Boolean,
      default: false
    }
  }],
  
  // Access Control
  visibility: {
    type: String,
    enum: ['public', 'private', 'restricted', 'admin_only'],
    default: 'private'
  },
  
  allowed_roles: [{
    type: String,
    enum: ['admin', 'manager', 'analyst', 'investor', 'property_owner']
  }],
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'توضیحات نمی‌تواند بیش از 1000 کاراکتر باشد']
  },
  
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'یادداشت‌ها نمی‌تواند بیش از 2000 کاراکتر باشد']
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
analyticsSchema.index({ analytics_type: 1, category: 1 });
analyticsSchema.index({ period: 1 });
analyticsSchema.index({ start_date: 1, end_date: 1 });
analyticsSchema.index({ visibility: 1 });
analyticsSchema.index({ created_at: -1 });
analyticsSchema.index({ 'metrics.total_revenue': -1 });
analyticsSchema.index({ 'metrics.total_users': -1 });

// Virtual for analytics summary
analyticsSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    analytics_type: this.analytics_type,
    category: this.category,
    period: this.period,
    start_date: this.start_date,
    end_date: this.end_date,
    key_metrics: {
      total_users: this.metrics.total_users,
      total_revenue: this.metrics.total_revenue,
      total_transactions: this.metrics.total_transactions,
      system_uptime: this.metrics.system_uptime
    },
    trends: this.trends,
    insights_count: this.insights.length,
    alerts_count: this.alerts.filter(a => !a.is_resolved).length,
    created_at: this.createdAt
  };
});

// Virtual for performance score
analyticsSchema.virtual('performance_score').get(function() {
  const metrics = this.metrics;
  let score = 0;
  let factors = 0;
  
  // User engagement (0-25 points)
  if (metrics.user_retention_rate > 0) {
    score += Math.min(25, metrics.user_retention_rate * 0.25);
    factors++;
  }
  
  // Financial performance (0-25 points)
  if (metrics.revenue_growth_rate > 0) {
    score += Math.min(25, Math.max(0, metrics.revenue_growth_rate * 2.5));
    factors++;
  }
  
  // System performance (0-25 points)
  if (metrics.system_uptime > 0) {
    score += Math.min(25, metrics.system_uptime * 0.25);
    factors++;
  }
  
  // Transaction success (0-25 points)
  if (metrics.transaction_success_rate > 0) {
    score += Math.min(25, metrics.transaction_success_rate * 0.25);
    factors++;
  }
  
  return factors > 0 ? Math.round(score / factors) : 0;
});

// Pre-save middleware to calculate derived metrics
analyticsSchema.pre('save', function(next) {
  // Calculate growth rates
  if (this.comparisons.previous_period && this.comparisons.previous_period.total_revenue > 0) {
    this.metrics.revenue_growth_rate = ((this.metrics.total_revenue - this.comparisons.previous_period.total_revenue) / this.comparisons.previous_period.total_revenue) * 100;
  }
  
  // Calculate success rates
  if (this.metrics.total_transactions > 0) {
    this.metrics.transaction_success_rate = (this.metrics.successful_transactions / this.metrics.total_transactions) * 100;
  }
  
  if (this.metrics.total_investments > 0) {
    this.metrics.investment_success_rate = (this.metrics.total_investments / this.metrics.total_investments) * 100; // This needs proper calculation
  }
  
  // Calculate averages
  if (this.metrics.total_transactions > 0) {
    this.metrics.average_transaction_value = this.metrics.total_volume / this.metrics.total_transactions;
  }
  
  if (this.metrics.total_properties > 0) {
    this.metrics.average_property_value = this.metrics.total_volume / this.metrics.total_properties; // This needs proper calculation
  }
  
  next();
});

// Static method to get analytics by filters
analyticsSchema.statics.getAnalyticsByFilters = function(filters) {
  const query = {};
  
  if (filters.analytics_type) query.analytics_type = filters.analytics_type;
  if (filters.category) query.category = filters.category;
  if (filters.period) query.period = filters.period;
  if (filters.visibility) query.visibility = filters.visibility;
  if (filters.start_date) query.start_date = { $gte: new Date(filters.start_date) };
  if (filters.end_date) query.end_date = { $lte: new Date(filters.end_date) };
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  
  return this.find(query);
};

// Static method to get dashboard summary
analyticsSchema.statics.getDashboardSummary = async function() {
  const latestAnalytics = await this.findOne({ is_active: true })
    .sort({ created_at: -1 });
  
  if (!latestAnalytics) {
    return {
      total_users: 0,
      total_revenue: 0,
      total_transactions: 0,
      system_uptime: 0,
      performance_score: 0,
      active_alerts: 0,
      key_insights: []
    };
  }
  
  return {
    total_users: latestAnalytics.metrics.total_users,
    total_revenue: latestAnalytics.metrics.total_revenue,
    total_transactions: latestAnalytics.metrics.total_transactions,
    system_uptime: latestAnalytics.metrics.system_uptime,
    performance_score: latestAnalytics.performance_score,
    active_alerts: latestAnalytics.alerts.filter(a => !a.is_resolved).length,
    key_insights: latestAnalytics.insights.slice(0, 5)
  };
};

module.exports = mongoose.model('Analytics', analyticsSchema);
