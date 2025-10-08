import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Users, 
  TrendingUp,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Target,
  Shield
} from 'lucide-react';

const LeaderboardWidget = ({ userId = "demo_user", compact = false }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedType, setSelectedType] = useState('weekly_xp');
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  const leaderboardTypes = [
    { id: 'weekly_xp', name: 'قهرمان هفته', icon: Zap, color: 'blue' },
    { id: 'total_value', name: 'پادشاه سرمایه', icon: Crown, color: 'yellow' },
    { id: 'diversity', name: 'تنوع‌بخش برتر', icon: Target, color: 'green' }
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedType, userId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gamification/leaderboard/${selectedType}?limit=10`);
      const data = await response.json();
      
      setLeaderboard(data.data.leaderboard);
      setUserRank(data.data.user_rank);
      
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-orange-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">{rank}</span>;
    }
  };

  const getRankChange = (rank) => {
    // Mock rank change data
    const changes = { 1: 'up', 2: 'down', 3: 'same', 4: 'up', 5: 'down' };
    const change = changes[rank] || 'same';
    
    switch(change) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      1: 'bg-gray-100 text-gray-700',
      2: 'bg-blue-100 text-blue-700',
      3: 'bg-purple-100 text-purple-700',
      4: 'bg-amber-100 text-amber-700',
      5: 'bg-red-100 text-red-700',
      6: 'bg-yellow-100 text-yellow-700'
    };
    return colors[level] || colors[1];
  };

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Trophy className="w-4 h-4 ml-2 text-yellow-500" />
              برترین هفته
            </h3>
            <Button variant="ghost" size="sm" className="p-1">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {leaderboard.slice(0, 3).map((user) => (
              <div key={user.user_id} className={`flex items-center justify-between p-2 rounded-lg ${
                user.isCurrentUser ? 'bg-yellow-100 border border-yellow-300' : 'bg-white'
              }`}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {getRankIcon(user.rank)}
                  <span className="text-lg">{user.avatar}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                      {user.isCurrentUser && (
                        <Badge variant="secondary" className="mr-1 text-xs">شما</Badge>
                      )}
                    </p>
                    <p className="text-xs text-gray-600">سطح {user.level}</p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-1 space-x-reverse text-yellow-600">
                    <Zap className="w-3 h-3" />
                    <span className="text-sm font-bold">{user.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">
            مشاهده لیدربورد کامل
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 ml-2 text-yellow-500" />
            لیدربورد
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchLeaderboard}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Leaderboard Type Selector */}
        <div className="flex space-x-2 space-x-reverse mt-4">
          {leaderboardTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className="flex items-center space-x-1 space-x-reverse"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{type.name}</span>
              </Button>
            );
          })}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* User's Rank Highlight */}
        {userRank && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {userRank}
                </div>
                <div>
                  <p className="font-semibold text-blue-900">رتبه شما</p>
                  <p className="text-sm text-blue-700">در بین {leaderboard.length} کاربر</p>
                </div>
              </div>
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        )}

        {/* Top 3 Users */}
        <div className="space-y-3">
          {leaderboard.slice(0, 3).map((user) => (
            <div 
              key={user.user_id} 
              className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                user.isCurrentUser 
                  ? 'bg-blue-50 border-blue-300' 
                  : user.rank === 1 
                    ? 'bg-yellow-50 border-yellow-300'
                    : user.rank === 2
                      ? 'bg-gray-50 border-gray-300'
                      : user.rank === 3
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  {getRankIcon(user.rank)}
                  {getRankChange(user.rank)}
                </div>
                <div className="text-2xl">{user.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900 flex items-center">
                    {user.name}
                    {user.isCurrentUser && (
                      <Badge variant="secondary" className="mr-2 text-xs">شما</Badge>
                    )}
                    {user.rank === 1 && (
                      <Badge className="mr-2 bg-yellow-500">قهرمان</Badge>
                    )}
                  </p>
                  <div className="flex items-center space-x-2 space-x-reverse mt-1">
                    <Badge className={getLevelColor(user.level)}>
                      سطح {user.level}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {user.value.toLocaleString()} امتیاز
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-left">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{user.value}</span>
                </div>
                <p className="text-xs text-gray-600">امتیاز کل</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rest of Leaderboard */}
        <div className="space-y-2">
          {leaderboard.slice(3).map((user) => (
            <div 
              key={user.user_id} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                  {user.rank}
                </div>
                <div className="text-lg">{user.avatar}</div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {user.name}
                    {user.isCurrentUser && (
                      <Badge variant="secondary" className="mr-2 text-xs">شما</Badge>
                    )}
                  </p>
                  <Badge className={getLevelColor(user.level)} variant="outline" size="sm">
                    سطح {user.level}
                  </Badge>
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1 space-x-reverse text-yellow-600">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold">{user.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Battle Challenge Button */}
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-red-900 flex items-center">
                  <Target className="w-4 h-4 ml-2" />
                  چالش رقابتی
                </h4>
                <p className="text-sm text-red-700">با کاربران دیگر رقابت کن!</p>
              </div>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                شروع چالش
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;