const request = require('supertest');
const express = require('express');

// Create a simple Express app for testing
const app = express();
app.use(express.json());

// Mock wallet data
const mockWallets = [
  {
    _id: '507f1f77bcf86cd799439011',
    user: '507f1f77bcf86cd799439012',
    user_email: 'user@example.com',
    balance: 50000000, // 50 میلیون ریال
    currency: 'IRR',
    status: 'active',
    wallet_type: 'primary',
    usage_stats: {
      total_transactions: 25,
      total_volume: 150000000,
      daily_volume: 5000000,
      monthly_volume: 50000000,
      last_transaction_date: new Date('2024-01-15')
    },
    created_at: new Date('2024-01-01')
  }
];

// Mock transaction data
const mockTransactions = [
  {
    _id: '507f1f77bcf86cd799439013',
    transaction_id: 'TXN123456789',
    user: '507f1f77bcf86cd799439012',
    wallet: '507f1f77bcf86cd799439011',
    user_email: 'user@example.com',
    type: 'deposit',
    amount: 10000000, // 10 میلیون ریال
    currency: 'IRR',
    status: 'completed',
    payment_method: 'bank_transfer',
    description: 'واریز اولیه',
    created_at: new Date('2024-01-01'),
    completed_at: new Date('2024-01-01')
  },
  {
    _id: '507f1f77bcf86cd799439014',
    transaction_id: 'TXN987654321',
    user: '507f1f77bcf86cd799439012',
    wallet: '507f1f77bcf86cd799439011',
    user_email: 'user@example.com',
    type: 'investment',
    amount: -20000000, // 20 میلیون ریال (منفی برای سرمایه‌گذاری)
    currency: 'IRR',
    status: 'completed',
    payment_method: 'wallet',
    description: 'سرمایه‌گذاری در ملک',
    created_at: new Date('2024-01-10'),
    completed_at: new Date('2024-01-10')
  }
];

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439012',
    email: 'user@example.com',
    full_name: 'کاربر تستی',
    phone: '09123456789',
    role: 'investor'
  };
  next();
};

// Mock admin auth middleware
const adminAuth = (req, res, next) => {
  req.user = {
    id: '507f1f77bcf86cd799439015',
    email: 'admin@example.com',
    full_name: 'مدیر سیستم',
    role: 'admin'
  };
  next();
};

// Wallet Routes
app.get('/api/wallets', auth, (req, res) => {
  const wallet = mockWallets.find(w => w.user === req.user.id);
  
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
});

app.post('/api/wallets', auth, (req, res) => {
  const existingWallet = mockWallets.find(w => w.user === req.user.id);
  if (existingWallet) {
    return res.status(400).json({
      success: false,
      message: 'کیف پول قبلاً ایجاد شده است'
    });
  }

  const newWallet = {
    _id: '507f1f77bcf86cd799439016',
    user: req.user.id,
    user_email: req.user.email,
    balance: 0,
    currency: req.body.currency || 'IRR',
    status: 'active',
    wallet_type: req.body.wallet_type || 'primary',
    usage_stats: {
      total_transactions: 0,
      total_volume: 0,
      daily_volume: 0,
      monthly_volume: 0
    },
    created_at: new Date()
  };

  mockWallets.push(newWallet);

  res.status(201).json({
    success: true,
    message: 'کیف پول با موفقیت ایجاد شد',
    data: { wallet: newWallet }
  });
});

app.post('/api/wallets/deposit', auth, (req, res) => {
  const wallet = mockWallets.find(w => w.user === req.user.id);
  if (!wallet) {
    return res.status(404).json({
      success: false,
      message: 'کیف پول یافت نشد'
    });
  }

  const { amount } = req.body;
  
  // Check daily limit
  if (wallet.usage_stats.daily_volume + amount > 100000000) {
    return res.status(400).json({
      success: false,
      message: 'حد روزانه تراکنش تجاوز شده است'
    });
  }

  // Update wallet balance
  wallet.balance += amount;
  wallet.usage_stats.total_transactions += 1;
  wallet.usage_stats.total_volume += amount;
  wallet.usage_stats.daily_volume += amount;
  wallet.usage_stats.monthly_volume += amount;
  wallet.usage_stats.last_transaction_date = new Date();

  // Create transaction
  const transaction = {
    _id: '507f1f77bcf86cd799439017',
    transaction_id: `TXN${Date.now()}`,
    user: req.user.id,
    wallet: wallet._id,
    user_email: req.user.email,
    type: 'deposit',
    amount,
    currency: wallet.currency,
    status: 'completed',
    payment_method: req.body.payment_method,
    description: req.body.description || 'واریز به کیف پول',
    created_at: new Date(),
    completed_at: new Date()
  };

  mockTransactions.push(transaction);

  res.json({
    success: true,
    message: 'واریز با موفقیت انجام شد',
    data: { 
      transaction,
      new_balance: wallet.balance
    }
  });
});

app.post('/api/wallets/withdraw', auth, (req, res) => {
  const wallet = mockWallets.find(w => w.user === req.user.id);
  if (!wallet) {
    return res.status(404).json({
      success: false,
      message: 'کیف پول یافت نشد'
    });
  }

  const { amount } = req.body;
  
  // Check balance
  if (wallet.balance < amount) {
    return res.status(400).json({
      success: false,
      message: 'موجودی کافی نیست'
    });
  }

  // Check daily limit
  if (wallet.usage_stats.daily_volume + amount > 100000000) {
    return res.status(400).json({
      success: false,
      message: 'حد روزانه تراکنش تجاوز شده است'
    });
  }

  // Update wallet balance
  wallet.balance -= amount;
  wallet.usage_stats.total_transactions += 1;
  wallet.usage_stats.total_volume += amount;
  wallet.usage_stats.daily_volume += amount;
  wallet.usage_stats.monthly_volume += amount;
  wallet.usage_stats.last_transaction_date = new Date();

  // Create transaction
  const transaction = {
    _id: '507f1f77bcf86cd799439018',
    transaction_id: `TXN${Date.now()}`,
    user: req.user.id,
    wallet: wallet._id,
    user_email: req.user.email,
    type: 'withdrawal',
    amount: -amount,
    currency: wallet.currency,
    status: 'completed',
    payment_method: req.body.payment_method,
    description: req.body.description || 'برداشت از کیف پول',
    created_at: new Date(),
    completed_at: new Date()
  };

  mockTransactions.push(transaction);

  res.json({
    success: true,
    message: 'برداشت با موفقیت انجام شد',
    data: { 
      transaction,
      new_balance: wallet.balance
    }
  });
});

app.get('/api/wallets/balance-history', auth, (req, res) => {
  const wallet = mockWallets.find(w => w.user === req.user.id);
  if (!wallet) {
    return res.status(404).json({
      success: false,
      message: 'کیف پول یافت نشد'
    });
  }

  const balanceHistory = [
    {
      amount: 10000000,
      previous_balance: 0,
      new_balance: 10000000,
      transaction_type: 'deposit',
      description: 'واریز اولیه',
      created_at: new Date('2024-01-01')
    },
    {
      amount: -20000000,
      previous_balance: 10000000,
      new_balance: -10000000,
      transaction_type: 'investment',
      description: 'سرمایه‌گذاری',
      created_at: new Date('2024-01-10')
    }
  ];

  res.json({
    success: true,
    data: {
      balance_history: balanceHistory,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: balanceHistory.length,
        items_per_page: 50
      }
    }
  });
});

app.get('/api/wallets/stats', auth, (req, res) => {
  const wallet = mockWallets.find(w => w.user === req.user.id);
  if (!wallet) {
    return res.status(404).json({
      success: false,
      message: 'کیف پول یافت نشد'
    });
  }

  const stats = {
    wallet: {
      balance: wallet.balance,
      currency: wallet.currency,
      status: wallet.status,
      total_transactions: wallet.usage_stats.total_transactions,
      total_volume: wallet.usage_stats.total_volume
    },
    transactions: {
      total_transactions: 2,
      total_amount: 30000000,
      completed_transactions: 2,
      failed_transactions: 0,
      avg_amount: 15000000
    }
  };

  res.json({
    success: true,
    data: { stats }
  });
});

// Transaction Routes
app.get('/api/transactions', auth, (req, res) => {
  const userTransactions = mockTransactions.filter(t => t.user === req.user.id);
  
  const { type, status } = req.query;
  let filteredTransactions = userTransactions;

  if (type) {
    filteredTransactions = filteredTransactions.filter(t => t.type === type);
  }
  
  if (status) {
    filteredTransactions = filteredTransactions.filter(t => t.status === status);
  }

  res.json({
    success: true,
    data: {
      transactions: filteredTransactions,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: filteredTransactions.length,
        items_per_page: 10
      }
    }
  });
});

app.get('/api/transactions/stats', auth, (req, res) => {
  const userTransactions = mockTransactions.filter(t => t.user === req.user.id);
  
  const stats = {
    total_transactions: userTransactions.length,
    total_amount: userTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0),
    completed_transactions: userTransactions.filter(t => t.status === 'completed').length,
    failed_transactions: userTransactions.filter(t => t.status === 'failed').length,
    pending_transactions: userTransactions.filter(t => t.status === 'pending').length,
    avg_amount: userTransactions.length > 0 ? userTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / userTransactions.length : 0
  };

  res.json({
    success: true,
    data: { stats }
  });
});

app.get('/api/transactions/analytics', auth, (req, res) => {
  const analytics = {
    period: '30d',
    stats: {
      total_transactions: 2,
      total_amount: 30000000,
      completed_transactions: 2
    },
    daily_volume: [
      { _id: { year: 2024, month: 1, day: 1 }, total_amount: 10000000, transaction_count: 1 },
      { _id: { year: 2024, month: 1, day: 10 }, total_amount: 20000000, transaction_count: 1 }
    ],
    type_distribution: [
      { _id: 'deposit', count: 1, total_amount: 10000000 },
      { _id: 'investment', count: 1, total_amount: 20000000 }
    ]
  };

  res.json({
    success: true,
    data: { analytics }
  });
});

app.get('/api/transactions/:id', auth, (req, res) => {
  const transaction = mockTransactions.find(t => t._id === req.params.id && t.user === req.user.id);
  
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
});

app.post('/api/transactions', auth, (req, res) => {
  const { type, amount, payment_method, description } = req.body;
  
  const wallet = mockWallets.find(w => w.user === req.user.id);
  if (!wallet) {
    return res.status(404).json({
      success: false,
      message: 'کیف پول یافت نشد'
    });
  }

  const transaction = {
    _id: '507f1f77bcf86cd799439019',
    transaction_id: `TXN${Date.now()}`,
    user: req.user.id,
    wallet: wallet._id,
    user_email: req.user.email,
    type,
    amount,
    currency: wallet.currency,
    status: 'pending',
    payment_method,
    description: description || '',
    created_at: new Date()
  };

  mockTransactions.push(transaction);

  res.status(201).json({
    success: true,
    message: 'تراکنش با موفقیت ایجاد شد',
    data: { transaction }
  });
});

describe('Wallet & Transaction API Tests (Simple Mock)', () => {
  beforeEach(() => {
    // Reset mock data
    mockWallets.length = 1;
    mockWallets[0].balance = 50000000;
    mockWallets[0].usage_stats.daily_volume = 0;
    
    mockTransactions.length = 2;
  });

  describe('Wallet API', () => {
    test('Should get user wallet', async () => {
      const response = await request(app)
        .get('/api/wallets');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.wallet.balance).toBe(50000000);
      expect(response.body.data.wallet.currency).toBe('IRR');
    });

    test('Should create new wallet', async () => {
      // First remove existing wallet
      mockWallets.length = 0;

      const newWallet = {
        currency: 'USD',
        wallet_type: 'investment',
        pin: '1234'
      };

      const response = await request(app)
        .post('/api/wallets')
        .send(newWallet);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.wallet.currency).toBe('USD');
      expect(response.body.data.wallet.wallet_type).toBe('investment');
      expect(mockWallets).toHaveLength(1);
    });

    test('Should reject creating duplicate wallet', async () => {
      const response = await request(app)
        .post('/api/wallets')
        .send({ currency: 'IRR' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('کیف پول قبلاً ایجاد شده است');
    });

    test('Should deposit money to wallet', async () => {
      const depositData = {
        amount: 10000000, // 10 میلیون ریال
        payment_method: 'bank_transfer',
        description: 'واریز تستی'
      };

      const response = await request(app)
        .post('/api/wallets/deposit')
        .send(depositData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.new_balance).toBe(60000000); // 50M + 10M
      expect(response.body.data.transaction.type).toBe('deposit');
      expect(mockTransactions).toHaveLength(3);
    });

    test('Should withdraw money from wallet', async () => {
      const withdrawData = {
        amount: 5000000, // 5 میلیون ریال
        payment_method: 'bank_transfer',
        description: 'برداشت تستی'
      };

      const response = await request(app)
        .post('/api/wallets/withdraw')
        .send(withdrawData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.new_balance).toBe(45000000); // 50M - 5M
      expect(response.body.data.transaction.type).toBe('withdrawal');
    });

    test('Should reject withdrawal with insufficient balance', async () => {
      const withdrawData = {
        amount: 100000000, // 100 میلیون ریال (بیشتر از موجودی)
        payment_method: 'bank_transfer'
      };

      const response = await request(app)
        .post('/api/wallets/withdraw')
        .send(withdrawData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('موجودی کافی نیست');
    });

    test('Should get balance history', async () => {
      const response = await request(app)
        .get('/api/wallets/balance-history');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.balance_history).toHaveLength(2);
      expect(response.body.data.balance_history[0].transaction_type).toBe('deposit');
    });

    test('Should get wallet statistics', async () => {
      const response = await request(app)
        .get('/api/wallets/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stats.wallet.balance).toBe(50000000);
      expect(response.body.data.stats.transactions.total_transactions).toBe(2);
    });
  });

  describe('Transaction API', () => {
    test('Should get user transactions', async () => {
      const response = await request(app)
        .get('/api/transactions');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toHaveLength(2);
      expect(response.body.data.transactions[0].type).toBe('deposit');
    });

    test('Should filter transactions by type', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .query({ type: 'deposit' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toHaveLength(1);
      expect(response.body.data.transactions[0].type).toBe('deposit');
    });

    test('Should filter transactions by status', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .query({ status: 'completed' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toHaveLength(2);
      expect(response.body.data.transactions.every(t => t.status === 'completed')).toBe(true);
    });

    test('Should get single transaction by ID', async () => {
      const response = await request(app)
        .get(`/api/transactions/${mockTransactions[0]._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction.type).toBe('deposit');
    });

    test('Should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .get('/api/transactions/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('تراکنش یافت نشد');
    });

    test('Should create new transaction', async () => {
      const transactionData = {
        type: 'investment',
        amount: 15000000, // 15 میلیون ریال
        payment_method: 'wallet',
        description: 'سرمایه‌گذاری جدید'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(transactionData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction.type).toBe('investment');
      expect(response.body.data.transaction.amount).toBe(15000000);
      expect(mockTransactions).toHaveLength(3);
    });

    test('Should get transaction statistics', async () => {
      const response = await request(app)
        .get('/api/transactions/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stats.total_transactions).toBe(2);
      expect(response.body.data.stats.completed_transactions).toBe(2);
    });

    test('Should get transaction analytics', async () => {
      const response = await request(app)
        .get('/api/transactions/analytics');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.analytics.stats.total_transactions).toBe(2);
      expect(response.body.data.analytics.daily_volume).toHaveLength(2);
      expect(response.body.data.analytics.type_distribution).toHaveLength(2);
    });
  });
});
