import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  Copy, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Star,
  Award,
  Target,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  BarChart3,
  Zap,
  Crown,
  Shield,
  Activity,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

const SocialTradingWidget = ({ userId = "demo_user" }) => {
  const [topTraders, setTopTraders] = useState([]);
  const [socialFeed, setSocialFeed] = useState([]);
  const [copyTrades, setCopyTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [copyAmount, setCopyAmount] = useState('');

  useEffect(() => {
    fetchSocialTradingData();
  }, [userId]);

  const fetchSocialTradingData = async () => {
    try {
      setLoading(true);
      
      // Mock top traders data
      const mockTopTraders = [
        {
          id: 1,
          name: "علی رضایی",
          username: "@ali_trader",
          avatar: "👨‍💼",
          level: 5,
          followers: 1234,
          total_return: 85.5,
          monthly_return: 12.3,
          win_rate: 78.5,
          risk_score: "medium",
          portfolio_value: 2500000000,
          copied_by: 89,
          is_verified: true,
          badges: ["Expert", "High Win Rate"],
          strategy: "Long-term Real Estate"
        },
        {
          id: 2,
          name: "سارا محمدی",
          username: "@sara_investor",
          avatar: "👩‍💼",
          level: 4,
          followers: 856,
          total_return: 62.3,
          monthly_return: 8.7,
          win_rate: 72.1,
          risk_score: "low",
          portfolio_value: 1800000000,
          copied_by: 56,
          is_verified: true,
          badges: ["Conservative", "Steady Growth"],
          strategy: "Diversified Portfolio"
        },
        {
          id: 3,
          name: "رضا قاسمی",
          username: "@reza_pro",
          avatar: "👨‍💻",
          level: 6,
          followers: 2156,
          total_return: 125.8,
          monthly_return: 18.9,
          win_rate: 65.2,
          risk_score: "high",
          portfolio_value: 5000000000,
          copied_by: 156,
          is_verified: true,
          badges: ["Aggressive", "High Returns"],
          strategy: "High-Risk High-Reward"
        }
      ];

      const mockSocialFeed = [
        {
          id: 1,
          trader: mockTopTraders[0],
          action: "buy",
          property: "آپارتمان در سعادت‌آباد",
          amount: 50000000,
          tokens: 500,
          reason: "موقعیت عالی برای رشد قیمت",
          timestamp: "2 ساعت پیش",
          likes: 45,
          comments: 12,
          shares: 8,
          performance: "+15.2%"
        },
        {
          id: 2,
          trader: mockTopTraders[1],
          action: "sell",
          property: "ویلای شمال",
          amount: 120000000,
          tokens: 480,
          reason: "رسیدن به هدف سود 25%",
          timestamp: "4 ساعت پیش",
          likes: 32,
          comments: 8,
          shares: 5,
          performance: "+25.0%"
        },
        {
          id: 3,
          trader: mockTopTraders[2],
          action: "analysis",
          property: "بازار مسکن تهران",
          amount: null,
          tokens: null,
          reason: "پیش‌بینی رشد 20% در 6 ماه آینده",
          timestamp: "6 ساعت پیش",
          likes: 89,
          comments: 23,
          shares: 15,
          performance: null
        }
      ];

      const mockCopyTrades = [
        {
          id: 1,
          trader: mockTopTraders[0],
          original_amount: 50000000,
          copied_amount: 10000000,
          property: "آپارتمان در سعادت‌آباد",
          copy_ratio: 0.2,
          current_return: 15.2,
          status: "active",
          start_date: "2024-01-01"
        },
        {
          id: 2,
          trader: mockTopTraders[1],
          original_amount: 80000000,
          copied_amount: 16000000,
          property: "مغازه تجاری",
          copy_ratio: 0.2,
          current_return: 8.7,
          status: "active",
          start_date: "2024-01-05"
        }
      ];

      setTopTraders(mockTopTraders);
      setSocialFeed(mockSocialFeed);
      setCopyTrades(mockCopyTrades);
      
    } catch (error) {
      console.error('Error fetching social trading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrader = async () => {
    try {
      // Mock copy trade
      const newCopyTrade = {
        id: copyTrades.length + 1,
        trader: selectedTrader,
        original_amount: 100000000,
        copied_amount: parseInt(copyAmount),
        property: "Portfolio Copy",
        copy_ratio: parseInt(copyAmount) / 100000000,
        current_return: 0,
        status: "active",
        start_date: new Date().toISOString().split('T')[0]
      };

      setCopyTrades([...copyTrades, newCopyTrade]);
      setShowCopyModal(false);
      setSelectedTrader(null);
      setCopyAmount('');
      
    } catch (error) {
      console.error('Error copying trader:', error);
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskText = (risk) => {
    switch(risk) {
      case 'low': return 'پایین';
      case 'medium': return 'متوسط';
      case 'high': return 'بالا';
      default: return 'نامشخص';
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

  return (
    <div className="space-y-6">
      {/* Top Traders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="w-5 h-5 ml-2 text-yellow-600" />
            برترین معامله‌گران
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topTraders.map((trader) => (
            <div key={trader.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="text-3xl">{trader.avatar}</div>
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <p className="font-semibold text-gray-900">{trader.name}</p>
                      {trader.is_verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                      <Badge variant="secondary" className="text-xs">
                        سطح {trader.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{trader.username}</p>
                    <div className="flex items-center space-x-2 space-x-reverse mt-1">
                      {trader.badges.map((badge, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-green-600">
                    +{trader.total_return}%
                  </p>
                  <p className="text-sm text-gray-600">بازدهی کل</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">{trader.followers}</p>
                  <p className="text-xs text-gray-600">دنبال‌کننده</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">{trader.win_rate}%</p>
                  <p className="text-xs text-gray-600">نرخ برد</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-purple-600">
                    +{trader.monthly_return}%
                  </p>
                  <p className="text-xs text-gray-600">بازدهی ماهانه</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-orange-600">{trader.copied_by}</p>
                  <p className="text-xs text-gray-600">کپی شده</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm text-gray-600">استراتژی:</span>
                  <span className="text-sm font-medium">{trader.strategy}</span>
                </div>
                <Badge className={getRiskColor(trader.risk_score)}>
                  ریسک: {getRiskText(trader.risk_score)}
                </Badge>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button 
                  size="sm"
                  onClick={() => {
                    setSelectedTrader(trader);
                    setShowCopyModal(true);
                  }}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 ml-1" />
                  کپی معاملات
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 ml-1" />
                  مشاهده پروفایل
                </Button>
                <Button variant="ghost" size="sm">
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Social Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 ml-2 text-blue-600" />
            فید اجتماعی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialFeed.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="text-2xl">{post.trader.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.trader.name}</p>
                    <p className="text-sm text-gray-600">{post.timestamp}</p>
                  </div>
                </div>
                {post.performance && (
                  <Badge className="bg-green-100 text-green-800">
                    {post.performance}
                  </Badge>
                )}
              </div>

              <div className="mb-3">
                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                  {post.action === 'buy' && <ArrowUpRight className="w-4 h-4 text-green-600" />}
                  {post.action === 'sell' && <ArrowDownLeft className="w-4 h-4 text-red-600" />}
                  {post.action === 'analysis' && <BarChart3 className="w-4 h-4 text-blue-600" />}
                  <span className="font-medium">
                    {post.action === 'buy' ? 'خرید' : 
                     post.action === 'sell' ? 'فروش' : 'تحلیل'}
                  </span>
                  {post.property && <span>{post.property}</span>}
                </div>
                {post.amount && (
                  <p className="text-sm text-gray-600">
                    مبلغ: {post.amount.toLocaleString('fa-IR')} تومان
                  </p>
                )}
                <p className="text-sm text-gray-700 mt-2">{post.reason}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-red-600">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-blue-600">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-green-600">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">{post.shares}</span>
                  </button>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedTrader(post.trader);
                    setShowCopyModal(true);
                  }}
                >
                  <Copy className="w-4 h-4 ml-1" />
                  کپی
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Copy Trades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Copy className="w-5 h-5 ml-2 text-purple-600" />
            معاملات کپی شده
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {copyTrades.map((trade) => (
            <div key={trade.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="text-2xl">{trade.trader.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900">کپی از {trade.trader.name}</p>
                    <p className="text-sm text-gray-600">{trade.property}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`font-bold text-lg ${
                    trade.current_return >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trade.current_return >= 0 ? '+' : ''}{trade.current_return}%
                  </p>
                  <p className="text-sm text-gray-600">بازدهی</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-sm text-gray-600">مبلغ اصلی</p>
                  <p className="font-semibold">
                    {trade.original_amount.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">مبلغ کپی</p>
                  <p className="font-semibold">
                    {trade.copied_amount.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Badge variant="outline" className="text-xs">
                    نسبت کپی: {(trade.copy_ratio * 100).toFixed(0)}%
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    از {trade.start_date}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  متوقف کردن
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Copy Trader Modal */}
      {showCopyModal && selectedTrader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Copy className="w-5 h-5 ml-2 text-purple-600" />
                کپی معاملات {selectedTrader.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                  <div className="text-2xl">{selectedTrader.avatar}</div>
                  <div>
                    <p className="font-semibold">{selectedTrader.name}</p>
                    <p className="text-sm text-gray-600">
                      بازدهی کل: +{selectedTrader.total_return}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-blue-900">
                  استراتژی: {selectedTrader.strategy}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مبلغ سرمایه‌گذاری (تومان)
                </label>
                <input
                  type="number"
                  value={copyAmount}
                  onChange={(e) => setCopyAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="مبلغ مورد نظر را وارد کنید"
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    حداقل مبلغ: 1,000,000 تومان
                    <br />
                    کارمزد کپی: 2% از سود
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button 
                  onClick={handleCopyTrader}
                  className="flex-1"
                  disabled={!copyAmount || parseInt(copyAmount) < 1000000}
                >
                  شروع کپی
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCopyModal(false)}
                  className="flex-1"
                >
                  انصراف
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SocialTradingWidget;