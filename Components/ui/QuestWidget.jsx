import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Star, 
  Gift, 
  Clock, 
  CheckCircle,
  Zap,
  Trophy,
  Calendar,
  TrendingUp,
  Crown,
  Medal
} from 'lucide-react';

const QuestWidget = ({ userId = "demo_user", compact = false }) => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    fetchQuests();
  }, [userId]);

  const fetchQuests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gamification/quests/${userId}`);
      const data = await response.json();
      
      setQuests(data.data.active_quests);
      setCompletedQuests(data.data.completed_today);
      
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeQuest = async (questId) => {
    // Simulate quest completion
    setShowCompletion(true);
    setTimeout(() => setShowCompletion(false), 3000);
    
    // Refresh quests
    fetchQuests();
  };

  if (loading) {
    return (
      <Card>
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

  const dailyQuests = quests.filter(q => q.category === 'daily');
  const weeklyQuests = quests.filter(q => q.category === 'weekly');

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Target className="w-4 h-4 ml-2 text-blue-500" />
              ماموریت‌های امروز
            </h3>
            <Badge variant="secondary">
              {completedQuests}/{dailyQuests.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {dailyQuests.slice(0, 2).map((quest) => (
              <div key={quest.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-lg">{quest.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{quest.title_fa}</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <span className="text-xs text-gray-600">{quest.progress}/{quest.target}</span>
                  <Progress value={quest.progress_percent} className="w-12 h-1" />
                </div>
              </div>
            ))}
          </div>
          
          {dailyQuests.length > 2 && (
            <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">
              مشاهده همه ({dailyQuests.length} ماموریت)
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quest Completion Animation */}
      {showCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ماموریت کامل شد!</h2>
            <p className="text-lg text-gray-600">امتیاز و جایزه شما اضافه شد</p>
          </div>
        </div>
      )}

      {/* Daily Quests */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 ml-2 text-blue-500" />
              کوئست‌های روزانه
            </CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Badge variant="outline">
                {completedQuests}/{dailyQuests.length} کامل
              </Badge>
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyQuests.map((quest) => (
            <div key={quest.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="text-2xl">{quest.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{quest.title_fa}</h4>
                    <p className="text-sm text-gray-600">{quest.description_fa}</p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-1 space-x-reverse text-yellow-600 mb-1">
                    <Star className="w-4 h-4" />
                    <span className="font-bold">{quest.xp_reward}</span>
                    <span className="text-xs text-gray-600">XP</span>
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse text-green-600">
                    <Gift className="w-3 h-3" />
                    <span className="text-xs">{quest.coin_reward}</span>
                    <span className="text-xs text-gray-600">سکه</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>پیشرفت</span>
                  <span>{quest.progress}/{quest.target}</span>
                </div>
                <Progress value={quest.progress_percent} className="h-2" />
              </div>
              
              {quest.progress >= quest.target && (
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-green-600 hover:bg-green-700"
                  onClick={() => completeQuest(quest.id)}
                >
                  <CheckCircle className="w-4 h-4 ml-1" />
                  دریافت جایزه
                </Button>
              )}
            </div>
          ))}
          
          {dailyQuests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>همه کوئست‌های امروز کامل شد!</p>
              <p className="text-sm">امروز دوباره برگرد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Quests */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 ml-2 text-purple-500" />
              چالش‌های هفتگی
            </CardTitle>
            <Badge variant="outline">
              {weeklyQuests.length} فعال
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyQuests.map((quest) => (
            <div key={quest.id} className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="text-2xl">{quest.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{quest.title_fa}</h4>
                    <p className="text-sm text-gray-600">{quest.description_fa}</p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-1 space-x-reverse text-yellow-600 mb-1">
                    <Star className="w-4 h-4" />
                    <span className="font-bold">{quest.xp_reward}</span>
                    <span className="text-xs text-gray-600">XP</span>
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse text-green-600">
                    <Gift className="w-3 h-3" />
                    <span className="text-xs">{quest.coin_reward}</span>
                    <span className="text-xs text-gray-600">سکه</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>پیشرفت</span>
                  <span>{quest.progress}/{quest.target}</span>
                </div>
                <Progress value={quest.progress_percent} className="h-2" />
              </div>
              
              {quest.badge_reward && (
                <div className="mt-3 flex items-center space-x-2 space-x-reverse">
                  <Medal className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600">جایزه ویژه: {quest.badge_reward}</span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quest Tips */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3 space-x-reverse">
            <Crown className="w-6 h-6 text-amber-500 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">نکته طلایی</h4>
              <p className="text-sm text-gray-700">
                با کامل کردن روزانه کوئست‌ها، سریع‌تر سطح خود را بالا ببرید و به مزایای ویژه دسترسی پیدا کنید!
                هر روز که کوئست‌ها را کامل کنید، 50 امتیاز جایزه اضافی دریافت می‌کنید.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestWidget;