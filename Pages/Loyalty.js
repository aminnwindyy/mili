import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Star, Zap, Percent, Gift, CheckCircle, Trophy, Crown, Users } from 'lucide-react';

const tiers = {
  Bronze: { points: 0, icon: '🥉', color: 'from-amber-600 to-yellow-700' },
  Silver: { points: 1000, icon: '🥈', color: 'from-slate-400 to-slate-600' },
  Gold: { points: 5000, icon: '🥇', color: 'from-yellow-400 to-yellow-600' },
  Platinum: { points: 20000, icon: '💎', color: 'from-purple-400 to-purple-600' },
  Diamond: { points: 100000, icon: '👑', color: 'from-blue-400 to-indigo-600' }
};

const benefits = {
  Bronze: [
    "پشتیبانی استاندارد",
    "دسترسی به تمام املاک",
    "گزارش‌های پایه"
  ],
  Silver: [
    "پشتیبانی اولویت‌دار",
    "کاهش ۰.۱٪ کارمزد معاملات",
    "دسترسی به وبینارها",
    "گزارش‌های تفصیلی"
  ],
  Gold: [
    "پشتیبانی VIP",
    "کاهش ۰.۲٪ کارمزد معاملات",
    "دسترسی زودهنگام به پروژه‌ها",
    "مشاوره ماهانه رایگان",
    "کش‌بک ۱٪ از خریدها"
  ],
  Platinum: [
    "پشتیبانی اختصاصی ۲۴/۷",
    "کاهش ۰.۳٪ کارمزد معاملات",
    "دعوت به رویدادهای ویژه",
    "مشاوره هفتگی رایگان",
    "کش‌بک ۲٪ از خریدها",
    "دسترسی به صندوق‌های premium"
  ],
  Diamond: [
    "مدیر حساب اختصاصی",
    "معافیت کامل از کارمزد",
    "دعوت به کمیته مشاورین",
    "مشاوره نامحدود",
    "کش‌بک ۳٪ از خریدها",
    "اولویت در IPO املاک",
    "هدایای لوکس سالانه"
  ]
};

export default function Loyalty() {
  const [loyaltyData, setLoyaltyData] = useState({
    current_tier: 'Gold',
    total_points: 7500,
    current_tier_points: 2500,
    next_tier_requirement: 20000,
    lifetime_investment: 50000000000,
    referrals_count: 3,
    benefits_unlocked: benefits.Gold
  });
  
  const [availableRewards, setAvailableRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate available rewards based on current points
  useEffect(() => {
    const rewards = [
      {
        id: 1,
        title: 'کش‌بک ۱٪ خرید بعدی',
        description: 'دریافت ۱٪ کش‌بک در اولین خرید بعدی',
        points_required: 500,
        type: 'cashback',
        value: 0.01
      },
      {
        id: 2,
        title: 'مشاوره رایگان',
        description: '۱ ساعت مشاوره رایگان با کارشناسان ما',
        points_required: 1000,
        type: 'consultation',
        value: 1
      },
      {
        id: 3,
        title: 'دسترسی زودهنگام',
        description: 'دسترسی ۲۴ ساعته زودتر به پروژه‌های جدید',
        points_required: 2000,
        type: 'early_access',
        value: 24
      },
      {
        id: 4,
        title: 'کاهش کارمزد',
        description: 'کاهش ۰.۱٪ کارمزد برای ۳ ماه',
        points_required: 3000,
        type: 'fee_reduction',
        value: 0.001
      },
      {
        id: 5,
        title: 'گفت‌وگو با مدیرعامل',
        description: '۳۰ دقیقه گفت‌وگوی اختصاصی',
        points_required: 5000,
        type: 'exclusive_meeting',
        value: 30
      }
    ];

    const availableForUser = rewards.filter(reward =>
      loyaltyData.total_points >= reward.points_required
    );

    setAvailableRewards(availableForUser);
  }, [loyaltyData.total_points]);

  const claimReward = (reward) => {
    if (loyaltyData.total_points < reward.points_required) {
      alert('امتیاز کافی ندارید!');
      return;
    }

    // Deduct points
    const newPoints = loyaltyData.total_points - reward.points_required;
    setLoyaltyData(prev => ({
      ...prev,
      total_points: newPoints
    }));

    // Add to claimed rewards
    const claimed = {
      ...reward,
      claimed_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };

    setClaimedRewards(prev => [...prev, claimed]);
    alert(`پاداش "${reward.title}" با موفقیت دریافت شد!`);
  };

  const currentTierIndex = Object.keys(tiers).indexOf(loyaltyData.current_tier);
  const nextTierName = Object.keys(tiers)[currentTierIndex + 1];
  const currentTierPointsEarned = loyaltyData.total_points - tiers[loyaltyData.current_tier].points;
  const pointsNeededForNextTier = nextTierName ? tiers[nextTierName].points - tiers[loyaltyData.current_tier].points : 0;
  const progressPercentage = pointsNeededForNextTier > 0 ? (currentTierPointsEarned / pointsNeededForNextTier) * 100 : 100;

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-amber-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            برنامه وفاداری
          </h1>
          <p className="text-slate-600">فعالیت بیشتر، پاداش بیشتر!</p>
        </div>

        {/* Current Status */}
        <Card className={`shadow-xl border-0 bg-gradient-to-bl ${tiers[loyaltyData.current_tier].color} text-white mb-8`}>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{tiers[loyaltyData.current_tier].icon}</div>
            <h2 className="text-3xl font-bold mb-2">{loyaltyData.current_tier}</h2>
            <p className="text-lg opacity-90 mb-6">
              شما در سطح {loyaltyData.current_tier} هستید
            </p>
            <div className="text-2xl font-bold mb-2">
              {loyaltyData.total_points.toLocaleString()} امتیاز
            </div>

            {nextTierName && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>تا سطح {nextTierName}</span>
                  <span>{(tiers[nextTierName].points - loyaltyData.total_points).toLocaleString()} امتیاز</span>
                </div>
                <Progress value={progressPercentage} className="h-3 bg-white/20" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <div className="text-2xl font-bold text-slate-900">
                {loyaltyData.total_points.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">کل امتیاز</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-slate-900">
                {(loyaltyData.lifetime_investment / 1000000000).toFixed(1)}میلیارد
              </div>
              <div className="text-sm text-slate-600">کل سرمایه‌گذاری</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-slate-900">
                {loyaltyData.referrals_count}
              </div>
              <div className="text-sm text-slate-600">دعوت موفق</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Rewards */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                پاداش‌های قابل دریافت
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableRewards.length > 0 ? (
                <div className="space-y-4">
                  {availableRewards.map(reward => (
                    <div key={reward.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{reward.title}</h4>
                        <p className="text-sm text-slate-600">{reward.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium">{reward.points_required} امتیاز</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => claimReward(reward)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        دریافت
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>پاداش قابل دریافتی ندارید</p>
                  <p className="text-sm">بیشتر فعالیت کنید تا امتیاز کسب کنید</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Benefits */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                مزایای فعلی شما
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loyaltyData.benefits_unlocked.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Earn Points */}
        <Card className="shadow-lg border-0 mt-8">
          <CardHeader>
            <CardTitle>چگونه امتیاز کسب کنیم؟</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <Zap className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <h4 className="font-semibold mb-1">سرمایه‌گذاری</h4>
                <p className="text-sm text-slate-600">۱ امتیاز به ازای هر میلیون ریال</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-semibold mb-1">دعوت دوستان</h4>
                <p className="text-sm text-slate-600">۵۰۰ امتیاز به ازای هر دعوت موفق</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Star className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-semibold mb-1">نظر و امتیاز</h4>
                <p className="text-sm text-slate-600">۵۰ امتیاز برای هر نظر</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <Award className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h4 className="font-semibold mb-1">فعالیت روزانه</h4>
                <p className="text-sm text-slate-600">۱۰ امتیاز روزانه برای ورود</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}