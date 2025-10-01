const { validationResult } = require('express-validator');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { sanitizeInput, generateRandomString } = require('../utils/helpers');

// Get user wallet
const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id })
      .populate('user', 'full_name email phone');

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'کیف پول یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { wallet }
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات کیف پول',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Create user wallet
const createWallet = async (req, res) => {
  try {
    // Check if wallet already exists
    const existingWallet = await Wallet.findOne({ user: req.user.id });
    if (existingWallet) {
      return res.status(400).json({
        success: false,
        message: 'کیف پول قبلاً ایجاد شده است'
      });
    }

    const {
      wallet_type = 'primary',
      currency = 'IRR',
      pin,
      two_factor_enabled = false,
      biometric_enabled = false,
      max_daily_transaction = 100000000,
      max_single_transaction = 50000000
    } = req.body;

    const walletData = {
      user: req.user.id,
      user_email: req.user.email,
      wallet_type,
      currency,
      security: {
        pin: pin ? pin.toString() : undefined,
        two_factor_enabled,
        biometric_enabled,
        max_daily_transaction,
        max_single_transaction
      }
    };

    const wallet = new Wallet(walletData);
    await wallet.save();

    // Populate user info
    await wallet.populate('user', 'full_name email');

    res.status(201).json({
      success: true,
      message: 'کیف پول با موفقیت ایجاد شد',
      data: { wallet }
    });

  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد کیف پول',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Update wallet settings
const updateWallet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'کیف پول یافت نشد'
      });
    }

    const updateData = { ...req.body };
    
    // Sanitize text inputs
    if (updateData.notes) updateData.notes = sanitizeInput(updateData.notes);
    if (updateData.security?.pin) updateData.security.pin = updateData.security.pin.toString();

    // Update wallet
    Object.assign(wallet, updateData);
    await wallet.save();

    res.json({
      success: true,
      message: 'کیف پول با موفقیت به‌روزرسانی شد',
      data: { wallet }
    });

  } catch (error) {
    console.error('Update wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی کیف پول',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get wallet balance history
const getBalanceHistory = async (req, res) => {
  try {
    const { page = 1, limit = 50, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'کیف پول یافت نشد'
      });
    }

    let balanceHistory = wallet.getBalanceHistory(parseInt(limit), skip);
    
    // Filter by type if specified
    if (type) {
      balanceHistory = balanceHistory.filter(entry => entry.transaction_type === type);
    }

    res.json({
      success: true,
      data: {
        balance_history: balanceHistory,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(wallet.balance_history.length / parseInt(limit)),
          total_items: wallet.balance_history.length,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get balance history error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تاریخچه موجودی',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Deposit money to wallet
const deposit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const { amount, payment_method, payment_reference, description } = req.body;

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'کیف پول یافت نشد'
      });
    }

    // Check if transaction is allowed
    const canProcess = wallet.canProcessTransaction(amount, 'deposit');
    if (!canProcess.allowed) {
      return res.status(400).json({
        success: false,
        message: canProcess.reason
      });
    }

    // Create transaction
    const transaction = new Transaction({
      user: req.user.id,
      wallet: wallet._id,
      user_email: req.user.email,
      type: 'deposit',
      amount,
      currency: wallet.currency,
      payment_method,
      payment_reference,
      description: sanitizeInput(description) || 'واریز به کیف پول',
      status: 'pending'
    });

    await transaction.save();

    // Update wallet balance
    await wallet.updateBalance(
      amount,
      'deposit',
      description || 'واریز به کیف پول',
      transaction._id
    );

    // Complete transaction
    await transaction.complete();

    res.json({
      success: true,
      message: 'واریز با موفقیت انجام شد',
      data: { 
        transaction,
        new_balance: wallet.balance
      }
    });

  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در واریز',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Withdraw money from wallet
const withdraw = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const { amount, payment_method, payment_reference, description } = req.body;

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'کیف پول یافت نشد'
      });
    }

    // Check if transaction is allowed
    const canProcess = wallet.canProcessTransaction(amount, 'withdrawal');
    if (!canProcess.allowed) {
      return res.status(400).json({
        success: false,
        message: canProcess.reason
      });
    }

    // Create transaction
    const transaction = new Transaction({
      user: req.user.id,
      wallet: wallet._id,
      user_email: req.user.email,
      type: 'withdrawal',
      amount: -amount, // Negative for withdrawal
      currency: wallet.currency,
      payment_method,
      payment_reference,
      description: sanitizeInput(description) || 'برداشت از کیف پول',
      status: 'pending'
    });

    await transaction.save();

    // Update wallet balance
    await wallet.updateBalance(
      -amount,
      'withdrawal',
      description || 'برداشت از کیف پول',
      transaction._id
    );

    // Complete transaction
    await transaction.complete();

    res.json({
      success: true,
      message: 'برداشت با موفقیت انجام شد',
      data: { 
        transaction,
        new_balance: wallet.balance
      }
    });

  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در برداشت',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Transfer money between wallets
const transfer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const { amount, to_user_email, description } = req.body;

    const fromWallet = await Wallet.findOne({ user: req.user.id });
    if (!fromWallet) {
      return res.status(404).json({
        success: false,
        message: 'کیف پول مبدأ یافت نشد'
      });
    }

    // Find destination user
    const toUser = await User.findOne({ email: to_user_email.toLowerCase() });
    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: 'کاربر مقصد یافت نشد'
      });
    }

    const toWallet = await Wallet.findOne({ user: toUser._id });
    if (!toWallet) {
      return res.status(404).json({
        success: false,
        message: 'کیف پول مقصد یافت نشد'
      });
    }

    // Check if transfer is allowed
    const canProcess = fromWallet.canProcessTransaction(amount, 'withdrawal');
    if (!canProcess.allowed) {
      return res.status(400).json({
        success: false,
        message: canProcess.reason
      });
    }

    // Create transfer out transaction
    const transferOutTransaction = new Transaction({
      user: req.user.id,
      wallet: fromWallet._id,
      user_email: req.user.email,
      type: 'transfer_out',
      amount: -amount,
      currency: fromWallet.currency,
      payment_method: 'wallet',
      description: sanitizeInput(description) || `انتقال به ${toUser.full_name}`,
      transfer_to_user: toUser._id,
      transfer_to_wallet: toWallet._id,
      status: 'pending'
    });

    await transferOutTransaction.save();

    // Create transfer in transaction
    const transferInTransaction = new Transaction({
      user: toUser._id,
      wallet: toWallet._id,
      user_email: toUser.email,
      type: 'transfer_in',
      amount: amount,
      currency: toWallet.currency,
      payment_method: 'wallet',
      description: sanitizeInput(description) || `انتقال از ${req.user.full_name}`,
      transfer_to_user: req.user.id,
      transfer_to_wallet: fromWallet._id,
      status: 'pending'
    });

    await transferInTransaction.save();

    // Update both wallets
    await fromWallet.updateBalance(
      -amount,
      'transfer_out',
      `انتقال به ${toUser.full_name}`,
      transferOutTransaction._id
    );

    await toWallet.updateBalance(
      amount,
      'transfer_in',
      `انتقال از ${req.user.full_name}`,
      transferInTransaction._id
    );

    // Complete both transactions
    await transferOutTransaction.complete();
    await transferInTransaction.complete();

    res.json({
      success: true,
      message: 'انتقال با موفقیت انجام شد',
      data: { 
        transfer_out: transferOutTransaction,
        transfer_in: transferInTransaction,
        new_balance: fromWallet.balance
      }
    });

  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در انتقال',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get wallet statistics
const getWalletStats = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'کیف پول یافت نشد'
      });
    }

    // Get transaction statistics
    const transactionStats = await Transaction.getTransactionStats({
      user: req.user.id,
      date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    });

    const stats = {
      wallet: {
        balance: wallet.balance,
        currency: wallet.currency,
        status: wallet.status,
        total_transactions: wallet.usage_stats.total_transactions,
        total_volume: wallet.usage_stats.total_volume
      },
      transactions: transactionStats,
      limits: wallet.limits,
      security: wallet.security_status
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get wallet stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار کیف پول',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get all wallets (admin only)
const getAllWallets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      wallet_type,
      currency,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter object
    const filters = {};
    if (status) filters.status = status;
    if (wallet_type) filters.wallet_type = wallet_type;
    if (currency) filters.currency = currency;

    // Build sort object
    const sort = {};
    sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const wallets = await Wallet.find(filters)
      .populate('user', 'full_name email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Wallet.countDocuments(filters);

    res.json({
      success: true,
      data: {
        wallets,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all wallets error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست کیف پول‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
  getWallet,
  createWallet,
  updateWallet,
  getBalanceHistory,
  deposit,
  withdraw,
  transfer,
  getWalletStats,
  getAllWallets
};
