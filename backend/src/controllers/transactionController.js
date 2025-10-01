const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const { sanitizeInput } = require('../utils/helpers');

// Get all transactions with filters
const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      payment_method,
      currency,
      min_amount,
      max_amount,
      date_from,
      date_to,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter object
    const filters = { user: req.user.id };
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (payment_method) filters.payment_method = payment_method;
    if (currency) filters.currency = currency;
    if (min_amount) filters.min_amount = parseFloat(min_amount);
    if (max_amount) filters.max_amount = parseFloat(max_amount);
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;
    if (search) filters.search = sanitizeInput(search);

    // Build sort object
    const sort = {};
    sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const transactions = await Transaction.findByFilters(filters)
      .populate('wallet', 'balance currency')
      .populate('related_investment', 'property_title investment_amount')
      .populate('related_property', 'title address')
      .populate('related_tref', 'name fund_code')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Transaction.findByFilters(filters).countDocuments();

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست تراکنش‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get single transaction by ID
const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user.id
    })
      .populate('wallet', 'balance currency')
      .populate('related_investment', 'property_title investment_amount tokens_purchased')
      .populate('related_property', 'title address city property_type')
      .populate('related_tref', 'name fund_code expected_annual_return')
      .populate('transfer_to_user', 'full_name email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'تراکنش یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { transaction }
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات تراکنش',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const {
      type,
      amount,
      currency = 'IRR',
      payment_method,
      payment_reference,
      description,
      related_investment,
      related_property,
      related_tref,
      fee_amount = 0,
      fee_percentage = 0,
      notes
    } = req.body;

    // Get user's wallet
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'کیف پول یافت نشد'
      });
    }

    // Check if transaction is allowed
    const canProcess = wallet.canProcessTransaction(Math.abs(amount), type);
    if (!canProcess.allowed) {
      return res.status(400).json({
        success: false,
        message: canProcess.reason
      });
    }

    // Calculate net amount
    const netAmount = amount - fee_amount;

    // Create transaction
    const transactionData = {
      user: req.user.id,
      wallet: wallet._id,
      user_email: req.user.email,
      type,
      amount,
      currency,
      payment_method,
      payment_reference,
      description: sanitizeInput(description) || '',
      related_investment,
      related_property,
      related_tref,
      fee_amount,
      fee_percentage,
      net_amount: netAmount,
      notes: sanitizeInput(notes) || '',
      status: 'pending'
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update wallet balance if transaction is not pending
    if (type !== 'pending') {
      await wallet.updateBalance(
        amount,
        type,
        description || '',
        transaction._id
      );
    }

    // Populate related data
    await transaction.populate([
      { path: 'wallet', select: 'balance currency' },
      { path: 'related_investment', select: 'property_title investment_amount' },
      { path: 'related_property', select: 'title address' },
      { path: 'related_tref', select: 'name fund_code' }
    ]);

    res.status(201).json({
      success: true,
      message: 'تراکنش با موفقیت ایجاد شد',
      data: { transaction }
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد تراکنش',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Update transaction status
const updateTransactionStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, error_code, error_message } = req.body;

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'تراکنش یافت نشد'
      });
    }

    // Update transaction status
    transaction.status = status;
    
    if (status === 'completed') {
      await transaction.complete();
    } else if (status === 'failed') {
      await transaction.fail(error_code, error_message);
    }

    res.json({
      success: true,
      message: 'وضعیت تراکنش با موفقیت به‌روزرسانی شد',
      data: { transaction }
    });

  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی وضعیت تراکنش',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Retry failed transaction
const retryTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'تراکنش یافت نشد'
      });
    }

    if (!transaction.canRetry()) {
      return res.status(400).json({
        success: false,
        message: 'این تراکنش قابل تلاش مجدد نیست'
      });
    }

    await transaction.retry();

    res.json({
      success: true,
      message: 'تراکنش برای تلاش مجدد ارسال شد',
      data: { transaction }
    });

  } catch (error) {
    console.error('Retry transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در تلاش مجدد تراکنش',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get transaction statistics
const getTransactionStats = async (req, res) => {
  try {
    const {
      date_from,
      date_to,
      type,
      status
    } = req.query;

    const filters = { user: req.user.id };
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;
    if (type) filters.type = type;
    if (status) filters.status = status;

    const stats = await Transaction.getTransactionStats(filters);

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار تراکنش‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get all transactions (admin only)
const getAllTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      user,
      type,
      status,
      payment_method,
      currency,
      min_amount,
      max_amount,
      date_from,
      date_to,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter object
    const filters = {};
    if (user) filters.user = user;
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (payment_method) filters.payment_method = payment_method;
    if (currency) filters.currency = currency;
    if (min_amount) filters.min_amount = parseFloat(min_amount);
    if (max_amount) filters.max_amount = parseFloat(max_amount);
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;
    if (search) filters.search = sanitizeInput(search);

    // Build sort object
    const sort = {};
    sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const transactions = await Transaction.findByFilters(filters)
      .populate('user', 'full_name email')
      .populate('wallet', 'balance currency')
      .populate('related_investment', 'property_title investment_amount')
      .populate('related_property', 'title address')
      .populate('related_tref', 'name fund_code')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Transaction.findByFilters(filters).countDocuments();

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست تراکنش‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get transaction analytics
const getTransactionAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFrom;
    switch (period) {
      case '7d':
        dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        dateFrom = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get transaction statistics
    const stats = await Transaction.getTransactionStats({
      user: req.user.id,
      date_from: dateFrom
    });

    // Get daily transaction volume
    const dailyVolume = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          created_at: { $gte: dateFrom },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' },
            day: { $dayOfMonth: '$created_at' }
          },
          total_amount: { $sum: '$amount' },
          transaction_count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get transaction types distribution
    const typeDistribution = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          created_at: { $gte: dateFrom },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          total_amount: { $sum: '$amount' }
        }
      }
    ]);

    const analytics = {
      period,
      stats,
      daily_volume: dailyVolume,
      type_distribution: typeDistribution
    };

    res.json({
      success: true,
      data: { analytics }
    });

  } catch (error) {
    console.error('Get transaction analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تحلیل تراکنش‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransactionStatus,
  retryTransaction,
  getTransactionStats,
  getAllTransactions,
  getTransactionAnalytics
};
