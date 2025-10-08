const gamificationData = {
  // Investor Levels with XP requirements and benefits
  levels: [
    {
      id: 1,
      name: "Novice",
      name_fa: "تازه‌کار",
      min_xp: 0,
      max_xp: 99,
      color: "#94a3b8",
      icon: "🌱",
      benefits: ["دسترسی به ملک‌های معمولی", "کوئست‌های روزانه"],
      badge_url: "/badges/novice.svg"
    },
    {
      id: 2,
      name: "Apprentice", 
      name_fa: "شاگرد",
      min_xp: 100,
      max_xp: 299,
      color: "#3b82f6",
      icon: "📚",
      benefits: ["کاهش 5% کارمزد", "دسترسی به تحلیل‌ها", "کوئست‌های هفتگی"],
      badge_url: "/badges/apprentice.svg"
    },
    {
      id: 3,
      name: "Trader",
      name_fa: "معامله‌گر",
      min_xp: 300,
      max_xp: 699,
      color: "#8b5cf6",
      icon: "💼",
      benefits: ["کاهش 10% کارمزد", "دسترسی به ملک‌های VIP", "رقابت در لیگ‌ها"],
      badge_url: "/badges/trader.svg"
    },
    {
      id: 4,
      name: "Expert",
      name_fa: "کارشناس",
      min_xp: 700,
      max_xp: 1499,
      color: "#f59e0b",
      icon: "🎯",
      benefits: ["کاهش 15% کارمزد", "دسترسی به املاک экскلوسیو", "تحلیل‌های پیشرفته"],
      badge_url: "/badges/expert.svg"
    },
    {
      id: 5,
      name: "Master",
      name_fa: "استاد",
      min_xp: 1500,
      max_xp: 2999,
      color: "#ef4444",
      icon: "👑",
      benefits: ["کاهش 20% کارمزد", "دسترسی به همه املاک", "مشاوره خصوصی"],
      badge_url: "/badges/master.svg"
    },
    {
      id: 6,
      name: "Legend",
      name_fa: "افسانه",
      min_xp: 3000,
      max_xp: Infinity,
      color: "#fbbf24",
      icon: "🏆",
      benefits: ["کاهش 25% کارمزد", "اولویت در سرمایه‌گذاری", "کد دعوت ویژه"],
      badge_url: "/badges/legend.svg"
    }
  ],

  // Quests and Missions
  quests: {
    daily: [
      {
        id: "daily_1",
        title: "تحلیلگر روز",
        title_fa: "تحلیلگر روز",
        description: "3 ملک را با هم مقایسه کن",
        description_fa: "۳ ملک را با هم مقایسه کن",
        xp_reward: 100,
        coin_reward: 1000,
        type: "compare_properties",
        target: 3,
        icon: "🔍",
        difficulty: "easy"
      },
      {
        id: "daily_2", 
        title: "جستجوگر حرفه‌ای",
        title_fa: "جستجوگر حرفه‌ای",
        description: "از 5 فیلتر مختلف استفاده کن",
        description_fa: "از ۵ فیلتر مختلف استفاده کن",
        xp_reward: 50,
        coin_reward: 500,
        type: "use_filters",
        target: 5,
        icon: "🔎",
        difficulty: "easy"
      },
      {
        id: "daily_3",
        title: "محقق املاک",
        title_fa: "محقق املاک", 
        description: "10 ملک را مشاهده کن",
        description_fa: "۱۰ ملک را مشاهده کن",
        xp_reward: 75,
        coin_reward: 750,
        type: "view_properties",
        target: 10,
        icon: "👀",
        difficulty: "easy"
      }
    ],
    weekly: [
      {
        id: "weekly_1",
        title: "اولین قدم",
        title_fa: "اولین قدم",
        description: "اولین سرمایه‌گذاری خود را انجام بده",
        description_fa: "اولین سرمایه‌گذاری خود را انجام بده",
        xp_reward: 500,
        coin_reward: 5000,
        type: "first_investment",
        target: 1,
        icon: "🎯",
        difficulty: "medium",
        badge_reward: "first_investor"
      },
      {
        id: "weekly_2",
        title: "تنوع‌بخش",
        title_fa: "تنوع‌بخش",
        description: "در 3 ملک مختلف سرمایه‌گذاری کن",
        description_fa: "در ۳ ملک مختلف سرمایه‌گذاری کن",
        xp_reward: 300,
        coin_reward: 3000,
        type: "diverse_investment",
        target: 3,
        icon: "📊",
        difficulty: "medium"
      }
    ],
    monthly: [
      {
        id: "monthly_1",
        title: "پورتفولیوی متنوع",
        title_fa: "پورتفولیوی متنوع",
        description: "پورتفولیو با 5 ملک مختلف بساز",
        description_fa: "پورتفولیو با ۵ ملک مختلف بساز",
        xp_reward: 1000,
        coin_reward: 10000,
        type: "diverse_portfolio",
        target: 5,
        icon: "💼",
        difficulty: "hard",
        reward: "10% تخفیف کارمزد برای ماه بعد"
      }
    ],
    challenges: [
      {
        id: "challenge_1",
        title: "جنگ سرمایه‌گذاران",
        title_fa: "جنگ سرمایه‌گذاران",
        description: "بیشترین بازدهی در هفته",
        description_fa: "بیشترین بازدهی در هفته",
        xp_reward: 2000,
        coin_reward: 20000,
        type: "highest_return",
        duration: "7_days",
        icon: "⚔️",
        difficulty: "hard",
        leaderboard: true
      },
      {
        id: "challenge_2",
        title: "شاه ملک‌ها",
        title_fa: "شاه ملک‌ها",
        description: "بیشترین تعداد توکن‌های ملک",
        description_fa: "بیشترین تعداد توکن‌های ملک",
        xp_reward: 1500,
        coin_reward: 15000,
        type: "most_tokens",
        duration: "7_days",
        icon: "👑",
        difficulty: "hard",
        leaderboard: true
      }
    ]
  },

  // Achievements and Badges
  achievements: [
    {
      id: "first_investment",
      name: "سرمایه‌گذار نوپا",
      name_fa: "سرمایه‌گذار نوپا",
      description: "اولین سرمایه‌گذاری انجام شد",
      description_fa: "اولین سرمایه‌گذاری انجام شد",
      icon: "🌟",
      xp_reward: 100,
      type: "milestone",
      rarity: "common"
    },
    {
      id: "property_collector",
      name: "جمع‌آورنده ملک",
      name_fa: "جمع‌آورنده ملک",
      description: "5 ملک مختلف در پورتفولیو",
      description_fa: "۵ ملک مختلف در پورتفولیو",
      icon: "🏘️",
      xp_reward: 500,
      type: "collection",
      rarity: "rare"
    },
    {
      id: "trader_master",
      name: "استاد معامله",
      name_fa: "استاد معامله",
      description: "10 معامله موفق در بازار ثانویه",
      description_fa: "۱۰ معامله موفق در بازار ثانویه",
      icon: "💰",
      xp_reward: 1000,
      type: "trading",
      rarity: "epic"
    },
    {
      id: "loyalty_legend",
      name: "وفادار افسانه‌ای",
      name_fa: "وفادار افسانه‌ای",
      description: "30 روز فعال مستمر",
      description_fa: "۳۰ روز فعال مستمر",
      icon: "💎",
      xp_reward: 2000,
      type: "loyalty",
      rarity: "legendary"
    }
  ],

  // XP rewards for different actions
  xpRewards: {
    daily_login: 10,
    property_view: 5,
    property_compare: 20,
    investment: 100,
    investment_million: 50,
    referral_signup: 500,
    quest_completion: 50,
    achievement_unlock: 100,
    leaderboard_win: 1000,
    social_share: 25
  },

  // Leaderboard types
  leaderboardTypes: [
    {
      id: "weekly_xp",
      name: "قهرمان هفته",
      name_fa: "قهرمان هفته",
      description: "بیشترین XP در این هفته",
      description_fa: "بیشترین XP در این هفته",
      period: "weekly",
      metric: "xp_gained"
    },
    {
      id: "total_value",
      name: "پادشاه سرمایه",
      name_fa: "پادشاه سرمایه",
      description: "بیشترین ارزش پورتفولیو",
      description_fa: "بیشترین ارزش پورتفولیو",
      period: "all_time",
      metric: "portfolio_value"
    },
    {
      id: "diversity",
      name: "تنوع‌بخش برتر",
      name_fa: "تنوع‌بخش برتر",
      description: "بیشترین تنوع در سرمایه‌گذاری",
      description_fa: "بیشترین تنوع در سرمایه‌گذاری",
      period: "monthly",
      metric: "property_diversity"
    }
  ]
};

// User gamification progress storage
let userProgress = {
  // Demo user data
  "demo_user": {
    user_id: "demo_user",
    current_level: 1,
    current_xp: 0,
    total_xp: 0,
    level_progress: 0,
    coins: 1000,
    achievements: [],
    active_quests: {
      daily: ["daily_1", "daily_2", "daily_3"],
      weekly: ["weekly_1"],
      monthly: ["monthly_1"]
    },
    completed_quests: {
      daily: [],
      weekly: [],
      monthly: [],
      challenges: []
    },
    quest_progress: {},
    stats: {
      properties_viewed: 0,
      investments_made: 0,
      total_invested: 0,
      referrals: 0,
      login_streak: 1,
      last_login: new Date().toISOString()
    },
    badges: [],
    leaderboard_rankings: {}
  }
};

class Gamification {
  // Get user's current gamification state
  static getUserProgress(userId) {
    if (!userProgress[userId]) {
      userProgress[userId] = {
        user_id: userId,
        current_level: 1,
        current_xp: 0,
        total_xp: 0,
        level_progress: 0,
        coins: 1000,
        achievements: [],
        active_quests: {
          daily: ["daily_1", "daily_2", "daily_3"],
          weekly: ["weekly_1"],
          monthly: ["monthly_1"]
        },
        completed_quests: {
          daily: [],
          weekly: [],
          monthly: [],
          challenges: []
        },
        quest_progress: {},
        stats: {
          properties_viewed: 0,
          investments_made: 0,
          total_invested: 0,
          referrals: 0,
          login_streak: 1,
          last_login: new Date().toISOString()
        },
        badges: [],
        leaderboard_rankings: {}
      };
    }
    return userProgress[userId];
  }

  // Add XP to user and check for level up
  static addXP(userId, amount, reason = "general") {
    const user = this.getUserProgress(userId);
    user.total_xp += amount;
    user.current_xp += amount;
    
    const oldLevel = user.current_level;
    const newLevel = this.calculateLevel(user.total_xp);
    
    if (newLevel > oldLevel) {
      user.current_level = newLevel;
      user.current_xp = user.total_xp - gamificationData.levels[newLevel - 1].min_xp;
      return {
        leveledUp: true,
        oldLevel,
        newLevel,
        levelData: gamificationData.levels[newLevel - 1]
      };
    }
    
    user.level_progress = (user.current_xp / (gamificationData.levels[user.current_level - 1].max_xp - gamificationData.levels[user.current_level - 1].min_xp + 1)) * 100;
    
    return {
      leveledUp: false,
      currentXP: user.current_xp,
      levelProgress: user.level_progress
    };
  }

  // Calculate user level based on total XP
  static calculateLevel(totalXP) {
    for (let i = gamificationData.levels.length - 1; i >= 0; i--) {
      if (totalXP >= gamificationData.levels[i].min_xp) {
        return i + 1;
      }
    }
    return 1;
  }

  // Update quest progress
  static updateQuestProgress(userId, questType, action, amount = 1) {
    const user = this.getUserProgress(userId);
    const activeQuests = user.active_quests[questType] || [];
    
    const completedQuests = [];
    
    for (const questId of activeQuests) {
      const quest = this.findQuest(questId);
      if (quest && quest.type === action) {
        if (!user.quest_progress[questId]) {
          user.quest_progress[questId] = 0;
        }
        
        user.quest_progress[questId] += amount;
        
        if (user.quest_progress[questId] >= quest.target) {
          // Quest completed!
          completedQuests.push(quest);
          user.completed_quests[questType].push(questId);
          
          // Remove from active quests
          const index = user.active_quests[questType].indexOf(questId);
          if (index > -1) {
            user.active_quests[questType].splice(index, 1);
          }
          
          // Add rewards
          this.addXP(userId, quest.xp_reward, `quest_${questId}`);
          user.coins += quest.coin_reward;
        }
      }
    }
    
    return completedQuests;
  }

  // Find quest by ID
  static findQuest(questId) {
    for (const category of ['daily', 'weekly', 'monthly', 'challenges']) {
      const quest = gamificationData.quests[category].find(q => q.id === questId);
      if (quest) return quest;
    }
    return null;
  }

  // Get all gamification data
  static getAllData() {
    return gamificationData;
  }

  // Get leaderboard data
  static getLeaderboard(type, limit = 10) {
    const leaderboardType = gamificationData.leaderboardTypes.find(lt => lt.id === type);
    if (!leaderboardType) return [];

    // Mock leaderboard data
    const mockUsers = [
      { user_id: "user1", name: "علی احمدی", value: 2500, level: 4, avatar: "👨‍💼" },
      { user_id: "user2", name: "مریم رضایی", value: 2200, level: 3, avatar: "👩‍💼" },
      { user_id: "user3", name: "رضا محمدی", value: 1800, level: 3, avatar: "👨‍💻" },
      { user_id: "user4", name: "سارا کریمی", value: 1500, level: 2, avatar: "👩‍🎓" },
      { user_id: "demo_user", name: "شما", value: 350, level: 1, avatar: "🎯" }
    ];

    return mockUsers
      .sort((a, b) => b.value - a.value)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        isCurrentUser: user.user_id === "demo_user"
      }));
  }

  // Track user action and award XP
  static trackAction(userId, action, metadata = {}) {
    const xpReward = gamificationData.xpRewards[action] || 0;
    if (xpReward > 0) {
      return this.addXP(userId, xpReward, action);
    }
    return null;
  }
}

module.exports = { Gamification, gamificationData };