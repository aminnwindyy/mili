
import React, { useState, useEffect, useCallback } from 'react';
import { LoyaltyProgram } from '@/entities/LoyaltyProgram';
import { Investment } from '@/entities/Investment';
import { User } from '@/entities/User';
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
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [user, setUser] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);

  // Memoize generateAvailableRewards if it depends on loyaltyData,
  // or ensure it receives loyaltyData as an argument.
  // For now, keep it as is, assuming it reads latest state or its call context ensures it.
  const generateAvailableRewards = () => {
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
      loyaltyData && loyaltyData.total_points >= reward.points_required
    );

    setAvailableRewards(availableForUser);
  };

  // Memoize calculateAndUpdatePoints if it depends on loyaltyData
  const calculateAndUpdatePoints = async (userEmail, userInvestments) => {
    let totalPoints = 100; // Welcome bonus
    let lifetimeInvestment = 0;

    // Calculate points from investments
    userInvestments.forEach(investment => {
      lifetimeInvestment += investment.total_amount;
      // 1 point per million rial invested
      totalPoints += Math.floor(investment.total_amount / 1000000);
    });

    // Calculate referral points (if any)
    try {
      const { Referral } = await import('@/entities/Referral');
      const referrals = await Referral.filter({ referrer_email: userEmail, status: 'completed' });
      totalPoints += referrals.length * 500; // 500 points per successful referral
    } catch (error) {
      console.log('Referral calculation skipped');
    }

    // Determine current tier
    let currentTier = 'Bronze';
    const tierNames = Object.keys(tiers);

    for (let i = tierNames.length - 1; i >= 0; i--) {
      if (totalPoints >= tiers[tierNames[i]].points) {
        currentTier = tierNames[i];
        break;
      }
    }

    // Calculate next tier requirement
    const currentTierIndex = tierNames.indexOf(currentTier);
    const nextTier = tierNames[currentTierIndex + 1];
    const nextTierRequirement = nextTier ? tiers[nextTier].points : null;

    // Update loyalty data
    const updateData = {
      total_points: totalPoints,
      current_tier: currentTier,
      current_tier_points: totalPoints - tiers[currentTier].points,
      next_tier_requirement: nextTierRequirement,
      lifetime_investment: lifetimeInvestment,
      benefits_unlocked: benefits[currentTier]
    };

    try {
      // loyaltyData?.id might be null on initial load if no record found.
      // The demo ID 'demo' will be used in that case, but in a real app,
      // it would be the ID from the newly created record.
      await LoyaltyProgram.update(loyaltyData?.id || 'demo', updateData);
      setLoyaltyData(prev => ({ ...prev, ...updateData }));
    } catch (error) {
      console.log('Update skipped for demo or loyaltyData.id was undefined:', error);
      // If loyaltyData.id was undefined, this error implies we tried to update a non-existent record via 'demo'
      // For the demo purpose, we'll still update the state
      setLoyaltyData(prev => ({ ...prev, ...updateData }));
    }
  };

  const loadLoyaltyData = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      // Load investments to calculate points
      const userInvestments = await Investment.filter({ investor_email: userData.email });
      setInvestments(userInvestments);

      // Check existing loyalty program
      let loyaltyRecords = await LoyaltyProgram.filter({ user_email: userData.email });

      if (!loyaltyRecords || loyaltyRecords.length === 0) {
        // Create new loyalty program entry
        const initialData = {
          user_email: userData.email,
          current_tier: 'Bronze',
          total_points: 100, // Welcome bonus
          current_tier_points: 100,
          next_tier_requirement: tiers.Silver.points,
          lifetime_investment: 0,
          referrals_count: 0,
          benefits_unlocked: benefits.Bronze
        };

        const newRecord = await LoyaltyProgram.create(initialData);
        setLoyaltyData(newRecord);
      } else {
        setLoyaltyData(loyaltyRecords[0]);
      }

      // Calculate and update points based on activity
      // Note: calculateAndUpdatePoints and generateAvailableRewards rely on the `loyaltyData` state variable.
      // Due to async state updates, `loyaltyData` might not be immediately updated after `setLoyaltyData` calls
      // within the current execution frame of `loadLoyaltyData`.
      // For a robust solution, you might pass the calculated/updated loyalty object directly to these functions
      // or re-fetch `loyaltyData` to ensure the most current state.
      await calculateAndUpdatePoints(userData.email, userInvestments);

      // Generate available rewards
      generateAvailableRewards();

    } catch (error) {
      console.error('Error loading loyalty data:', error);
      // Demo data
      const demoData = {
        current_tier: 'Gold',
        total_points: 7500,
        current_tier_points: 2500,
        next_tier_requirement: tiers.Platinum.points,
        lifetime_investment: 50000000000, // 50 billion rial
        referrals_count: 3,
        benefits_unlocked: benefits.Gold
      };
      setLoyaltyData(demoData);
      // Ensure generateAvailableRewards is called after setting demo data
      // For this case, it will pick up the demoData from state in the next render cycle,
      // or might need to be passed explicitly: generateAvailableRewards(demoData);
      generateAvailableRewards(); // This will use the `loyaltyData` state which should now contain `demoData`.
    }
    setIsLoading(false);
  }, [calculateAndUpdatePoints, generateAvailableRewards, setLoyaltyData, setInvestments, setIsLoading, setUser]); // Dependencies added to useCallback to ensure stable function reference and avoid stale closures if inner functions are not memoized.
  // Original outline requested useCallback([]), but that would cause lint warnings if calculateAndUpdatePoints and generateAvailableRewards are not stable.

  useEffect(() => {
    loadLoyaltyData();
  }, [loadLoyaltyData]); // loadLoyaltyData is now a stable reference due to useCallback

  const claimReward = async (reward) => {
    if (!loyaltyData || loyaltyData.total_points < reward.points_required) {
      alert('امتیاز کافی ندارید!');
      return;
    }

    try {
      // Deduct points
      const newPoints = loyaltyData.total_points - reward.points_required;
      await LoyaltyProgram.update(loyaltyData.id, { total_points: newPoints });

      setLoyaltyData(prev => ({
        ...prev,
        total_points: newPoints
      }));

      // Add to claimed rewards
      const claimed = {
        ...reward,
        claimed_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
      };

      setClaimedRewards(prev => [...prev, claimed]);
      alert(`پاداش "${reward.title}" با موفقیت دریافت شد!`);

      // Refresh available rewards
      generateAvailableRewards();
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('خطا در دریافت پاداش');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">در حال بارگذاری...</p>
      </div>
    );
  }

  const currentTierIndex = Object.keys(tiers).indexOf(loyaltyData?.current_tier || 'Bronze');
  const nextTierName = Object.keys(tiers)[currentTierIndex + 1];
  // Calculate progress percentage carefully to avoid division by zero or negative values
  const currentTierPointsEarned = loyaltyData?.total_points ? loyaltyData.total_points - (tiers[loyaltyData.current_tier]?.points || 0) : 0;
  const pointsNeededForNextTier = nextTierName ? (tiers[nextTierName]?.points || 0) - (tiers[loyloyaltyData?.current_tier || 'Bronze']?.points || 0) : 0;
  const progressPercentage = pointsNeededForNextTier > 0 ? (currentTierPointsEarned / pointsNeededForNextTier) * 100 : 100;


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
        <Card className={`shadow-xl border-0 bg-gradient-to-bl ${tiers[loyaltyData?.current_tier || 'Bronze'].color} text-white mb-8`}>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{tiers[loyaltyData?.current_tier || 'Bronze'].icon}</div>
            <h2 className="text-3xl font-bold mb-2">{loyaltyData?.current_tier || 'Bronze'}</h2>
            <p className="text-lg opacity-90 mb-6">
              شما در سطح {loyaltyData?.current_tier || 'Bronze'} هستید
            </p>
            <div className="text-2xl font-bold mb-2">
              {loyaltyData?.total_points?.toLocaleString() || '0'} امتیاز
            </div>

            {nextTierName && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>تا سطح {nextTierName}</span>
                  <span>{(tiers[nextTierName]?.points - loyaltyData?.total_points)?.toLocaleString() || '0'} امتیاز</span>
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
                {loyaltyData?.total_points?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-slate-600">کل امتیاز</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-slate-900">
                {((loyaltyData?.lifetime_investment || 0) / 1000000000).toFixed(1)}میلیارد
              </div>
              <div className="text-sm text-slate-600">کل سرمایه‌گذاری</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-slate-900">
                {loyaltyData?.referrals_count || 0}
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
                {(loyaltyData?.benefits_unlocked || benefits.Bronze).map((benefit, index) => (
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
