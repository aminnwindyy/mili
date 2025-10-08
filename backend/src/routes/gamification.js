const express = require('express');
const router = express.Router();
const { Gamification, gamificationData } = require('../models/Gamification');

// Get user's complete gamification profile
router.get('/profile/:userId', (req, res) => {
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

// Get available quests for user
router.get('/quests/:userId', (req, res) => {
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
    
    // Get active weekly quests
    userProgress.active_quests.weekly.forEach(questId => {
      const quest = allQuests.weekly.find(q => q.id === questId);
      if (quest) {
        activeQuests.push({
          ...quest,
          category: 'weekly',
          progress: userProgress.quest_progress[questId] || 0,
          progress_percent: Math.min(100, ((userProgress.quest_progress[questId] || 0) / quest.target) * 100)
        });
      }
    });
    
    // Get active monthly quests
    userProgress.active_quests.monthly.forEach(questId => {
      const quest = allQuests.monthly.find(q => q.id === questId);
      if (quest) {
        activeQuests.push({
          ...quest,
          category: 'monthly',
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

// Track user action and update progress
router.post('/track/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { action, metadata = {} } = req.body;
    
    // Award XP for action
    const xpResult = Gamification.trackAction(userId, action, metadata);
    
    // Update quest progress
    let questUpdates = [];
    if (action === 'view_properties') {
      questUpdates = Gamification.updateQuestProgress(userId, 'daily', action, 1);
    } else if (action === 'compare_properties') {
      questUpdates = Gamification.updateQuestProgress(userId, 'daily', action, 1);
    } else if (action === 'investment') {
      questUpdates = Gamification.updateQuestProgress(userId, 'weekly', action, 1);
      questUpdates = questUpdates.concat(Gamification.updateQuestProgress(userId, 'monthly', 'diverse_investment', 1));
    }
    
    // Update user stats
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
        xp_awarded: xpResult,
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

// Get leaderboard data
router.get('/leaderboard/:type', (req, res) => {
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

// Get all available achievements
router.get('/achievements', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        achievements: gamificationData.achievements
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دستاوردها',
      error: error.message
    });
  }
});

// Get levels information
router.get('/levels', (req, res) => {
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

// Simulate battle/challenge with another user
router.post('/battle/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { opponentId, battleType } = req.body;
    
    // Mock battle result
    const userProgress = Gamification.getUserProgress(userId);
    const opponentProgress = Gamification.getUserProgress(opponentId);
    
    const userPower = userProgress.total_xp + (userProgress.stats.investments_made * 100);
    const opponentPower = opponentProgress.total_xp + (opponentProgress.stats.investments_made * 100);
    
    const userWon = userPower > opponentPower;
    
    const result = {
      battle_id: `battle_${Date.now()}`,
      user_won: userWon,
      user_power: userPower,
      opponent_power: opponentPower,
      xp_reward: userWon ? 50 : 10,
      coin_reward: userWon ? 500 : 100,
      battle_type: battleType || 'power_comparison'
    };
    
    if (userWon) {
      Gamification.addXP(userId, result.xp_reward, 'battle_win');
      userProgress.coins += result.coin_reward;
    } else {
      Gamification.addXP(userId, result.xp_reward, 'battle_loss');
      userProgress.coins += result.coin_reward;
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در اجرای چالش',
      error: error.message
    });
  }
});

// Get user's achievements and badges
router.get('/achievements/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userProgress = Gamification.getUserProgress(userId);
    
    const userAchievements = gamificationData.achievements.filter(achievement => 
      userProgress.achievements.includes(achievement.id)
    );
    
    const lockedAchievements = gamificationData.achievements.filter(achievement => 
      !userProgress.achievements.includes(achievement.id)
    );
    
    res.json({
      success: true,
      data: {
        unlocked: userAchievements,
        locked: lockedAchievements,
        total_unlocked: userAchievements.length,
        total_available: gamificationData.achievements.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دستاوردهای کاربر',
      error: error.message
    });
  }
});

module.exports = router;