require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Gamification, gamificationData } = require('./src/models/Gamification');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data for development
const mockProperties = [
  {
    id: 1,
    title: "آپارتمان لوکس در شمال تهران",
    location: "تهران، جردن",
    price: 2000000000,
    tokenPrice: 100000,
    availableTokens: 100,
    image: "https://via.placeholder.com/300x200?text=آپارتمان+جردن",
    description: "آپارتمان ۱۴۰ متری، ۳ خوابه، کاملاً renovated"
  },
  {
    id: 2,
    title: "ویلای ساحلی در کیش",
    location: "کیش، ساحل مرجان",
    price: 5000000000,
    tokenPrice: 250000,
    availableTokens: 50,
    image: "https://via.placeholder.com/300x200?text=ویلا+کیش",
    description: "ویلا ۳۰۰ متری با استخر و باغچه"
  },
  {
    id: 3,
    title: "مغازه تجاری در مرکز شهر",
    location: "تهران، ولیعصر",
    price: 1500000000,
    tokenPrice: 75000,
    availableTokens: 200,
    image: "https://via.placeholder.com/300x200?text=مغازه+ولیعصر",
    description: "مغازه ۸۰ متری، موقعیت عالی برای کسب‌وکار"
  }
];

const mockUser = {
  id: 1,
  name: "علی احمدی",
  email: "ali@example.com",
  wallet: 50000000,
  investments: [
    { propertyId: 1, tokens: 5, totalValue: 500000 }
  ]
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'MelkChain Backend API (Simple Mode)'
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({
      success: true,
      message: 'ورود موفقیت‌آمیز',
      data: {
        user: mockUser,
        token: 'mock-jwt-token-12345',
        refreshToken: 'mock-refresh-token-12345'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'ایمیل و رمز عبور الزامی است'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { full_name, email, password } = req.body;
  if (full_name && email && password) {
    res.json({
      success: true,
      message: 'حساب کاربری با موفقیت ایجاد شد',
      data: {
        user: { ...mockUser, name: full_name, email },
        token: 'mock-jwt-token-12345',
        refreshToken: 'mock-refresh-token-12345'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'تمام فیلدها الزامی هستند'
    });
  }
});

// Properties routes
app.get('/api/properties', (req, res) => {
  res.json({
    success: true,
    data: {
      properties: mockProperties,
      total: mockProperties.length
    }
  });
});

app.get('/api/properties/:id', (req, res) => {
  const property = mockProperties.find(p => p.id === parseInt(req.params.id));
  if (property) {
    res.json({
      success: true,
      data: { property }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'ملک مورد نظر یافت نشد'
    });
  }
});

// Investments routes
app.get('/api/investments', (req, res) => {
  res.json({
    success: true,
    data: {
      investments: mockUser.investments,
      totalValue: mockUser.investments.reduce((sum, inv) => sum + inv.totalValue, 0)
    }
  });
});

// Wallet route
app.get('/api/wallets', (req, res) => {
  res.json({
    success: true,
    data: {
      balance: mockUser.wallet,
      currency: 'IRR'
    }
  });
});

// Gamification routes
app.get('/api/gamification/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userProgress = Gamification.getUserProgress(userId);
    const currentLevelData = gamificationData.levels[userProgress.current_level - 1];
    
    res.json({
      success: true,
      data: {
        user: {
          ...userProgress,
          current_level_data: currentLevelData,
          next_level_data: userProgress.current_level < 6 ? 
            gamificationData.levels[userProgress.current_level] : null
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پروفایل گیمیفیکیشن',
      error: error.message
    });
  }
});

app.get('/api/gamification/quests/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userProgress = Gamification.getUserProgress(userId);
    
    const activeQuests = [];
    const allQuests = gamificationData.quests;
    
    // Get active daily quests
    userProgress.active_quests.daily.forEach(questId => {
      const quest = allQuests.daily.find(q => q.id === questId);
      if (quest) {
        activeQuests.push({
          ...quest,
          category: 'daily',
          progress: userProgress.quest_progress[questId] || 0,
          progress_percent: Math.min(100, ((userProgress.quest_progress[questId] || 0) / quest.target) * 100)
        });
      }
    });
    
    res.json({
      success: true,
      data: {
        active_quests: activeQuests,
        completed_today: userProgress.completed_quests.daily.length,
        total_daily: allQuests.daily.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت کوئست‌ها',
      error: error.message
    });
  }
});

app.post('/api/gamification/track/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { action, metadata = {} } = req.body;
    
    const xpResult = Gamification.trackAction(userId, action, metadata);
    let questUpdates = [];
    
    if (action === 'view_properties') {
      questUpdates = Gamification.updateQuestProgress(userId, 'daily', action, 1);
    } else if (action === 'investment') {
      questUpdates = Gamification.updateQuestProgress(userId, 'weekly', action, 1);
      questUpdates = questUpdates.concat(Gamification.updateQuestProgress(userId, 'monthly', 'diverse_investment', 1));
    }
    
    const userProgress = Gamification.getUserProgress(userId);
    if (action === 'view_properties') {
      userProgress.stats.properties_viewed += 1;
    } else if (action === 'investment') {
      userProgress.stats.investments_made += 1;
      userProgress.stats.total_invested += metadata.amount || 0;
    }
    
    res.json({
      success: true,
      data: {
        xp_awarded: xpResult || { leveledUp: false, currentXP: userProgress.current_xp },
        quests_completed: questUpdates,
        user_stats: userProgress.stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت فعالیت',
      error: error.message
    });
  }
});

app.get('/api/gamification/leaderboard/:type', (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 10 } = req.query;
    
    const leaderboard = Gamification.getLeaderboard(type, parseInt(limit));
    
    res.json({
      success: true,
      data: {
        leaderboard_type: type,
        leaderboard,
        user_rank: leaderboard.find(u => u.isCurrentUser)?.rank || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیدربورد',
      error: error.message
    });
  }
});

app.get('/api/gamification/levels', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        levels: gamificationData.levels
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سطوح',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔧 Running in SIMPLE MODE (no MongoDB, no OAuth)`);
});