import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  TrendingUp,
  Crown,
  Medal,
  Gift,
  ArrowUp,
  Calendar,
  Users
} from 'lucide-react';
import LevelUpAnimation from './LevelUpAnimation';
import QuestCompleteAnimation from './QuestCompleteAnimation';

const GamificationWidget = ({ userId = "demo_user" }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [quests, setQuests] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showQuestComplete, setShowQuestComplete] = useState(false);
  const [completedQuestData, setCompletedQuestData] = useState(null);

  useEffect(() => {
    fetchGamificationData();
  }, [userId]);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileResponse = await fetch(`/api/gamification/profile/${userId}`);
      const profileData = await profileResponse.json();
      
      // Fetch quests
      const questsResponse = await fetch(`/api/gamification/quests/${userId}`);
      const questsData = await questsResponse.json();
      
      // Fetch leaderboard
      const leaderboardResponse = await fetch(`/api/gamification/leaderboard/weekly_xp?limit=5`);
      const leaderboardData = await leaderboardResponse.json();
      
      setUserProfile(profileData.data.user);
      setQuests(questsData.data.active_quests);
      setLeaderboard(leaderboardData.data.leaderboard);
      
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackAction = async (action, metadata = {}) => {
    try {
      const response = await fetch(`/api/gamification/track/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, metadata })
      });
      
      const result = await response.json();
      
      if (result.data.xp_awarded?.leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 5000);
      }
      
      if (result.data.quests_completed?.length > 0) {
        setCompletedQuestData(result.data.quests_completed[0]);
        setShowQuestComplete(true);
        setTimeout(() => setShowQuestComplete(false), 4000);
      }
      
      // Refresh data
      fetchGamificationData();
      
    } catch (error) {
      console.error('Error tracking action:', error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) return null;

  const levelData = userProfile.current_level_data;
  const nextLevelData = userProfile.next_level_data;

  return (
    <div className="space-y-6">
      {/* Level Up Animation */}
      <LevelUpAnimation 
        show={showLevelUp} 
        levelData={levelData}
        onClose={() => setShowLevelUp(false)}
      />

      {/* Quest Complete Animation */}
      <QuestCompleteAnimation 
        show={showQuestComplete}
        questData={completedQuestData}
        onClose={() => setShowQuestComplete(false)}
      />

      {/* User Level Card */}
      <Card className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ backgroundColor: levelData.color }}
        />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="text-4xl">{levelData.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  سطح {userProfile.current_level}: {levelData.name_fa}
                </h3>
                <p className="text-sm text-gray-600">{levelData.name}</p>
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-gray-900">{userProfile.current_xp}</span>
                <span className="text-sm text-gray-600">XP</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse mt-1">
                <Gift className="w-4 h-4 text-green-500" />
                <span className="text-lg font-semibold text-green-600">{userProfile.coins}</span>
                <span className="text-xs text-gray-600">سکه</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          {nextLevelData && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>پیشرفت به سطح بعدی</span>
                <span>{userProfile.level_progress.toFixed(1)}%</span>
              </div>
              <Progress 
                value={userProfile.level_progress} 
                className="h-3"
                style={{ 
                  backgroundColor: '#e5e7eb',
                  '--progress-background': levelData.color 
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{userProfile.current_xp} XP</span>
                <span>{nextLevelData.min_xp} XP</span>
              </div>
            </div>
          )}

          {/* Level Benefits */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">مزایای سطح فعلی:</h4>
            <div className="flex flex-wrap gap-2">
              {levelData.benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Quests */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Target className="w-5 h-5 ml-2 text-blue-500" />
              کوئست‌های روزانه
            </h3>
            <Badge variant="outline">
              {quests.filter(q => q.category === 'daily').length}/{quests.filter(q => q.category === 'daily').length}
            </Badge>
          </div>

          <div className="space-y-3">
            {quests.filter(q => q.category === 'daily').map((quest) => (
              <div key={quest.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-xl">{quest.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{quest.title_fa}</h4>
                      <p className="text-xs text-gray-600">{quest.description_fa}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-1 space-x-reverse text-yellow-600">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{quest.xp_reward}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse text-green-600">
                      <Gift className="w-3 h-3" />
                      <span className="text-xs">{quest.coin_reward}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>پیشرفت</span>
                    <span>{quest.progress}/{quest.target}</span>
                  </div>
                  <Progress value={quest.progress_percent} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Leaderboard */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Trophy className="w-5 h-5 ml-2 text-yellow-500" />
              قهرمانان هفته
            </h3>
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4 ml-1" />
              مشاهده همه
            </Button>
          </div>

          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div 
                key={user.user_id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  user.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1 ? 'bg-yellow-500 text-white' :
                    user.rank === 2 ? 'bg-gray-400 text-white' :
                    user.rank === 3 ? 'bg-orange-600 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="text-2xl">{user.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user.name}
                      {user.isCurrentUser && (
                        <Badge variant="secondary" className="mr-2 text-xs">شما</Badge>
                      )}
                    </p>
                    <p className="text-xs text-gray-600">سطح {user.level}</p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-1 space-x-reverse text-yellow-600">
                    <Zap className="w-4 h-4" />
                    <span className="font-bold">{user.value}</span>
                    <span className="text-xs text-gray-600">XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 ml-2 text-green-500" />
            فعالیت‌های سریع
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => trackAction('view_properties')}
              className="text-right"
            >
              <ArrowUp className="w-4 h-4 ml-1" />
              مشاهده ملک (+5 XP)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => trackAction('compare_properties')}
              className="text-right"
            >
              <Target className="w-4 h-4 ml-1" />
              مقایسه ملک (+20 XP)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => trackAction('daily_login')}
              className="text-right"
            >
              <Calendar className="w-4 h-4 ml-1" />
              ورود روزانه (+10 XP)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => trackAction('social_share')}
              className="text-right"
            >
              <Users className="w-4 h-4 ml-1" />
              اشتراک‌گذاری (+25 XP)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationWidget;