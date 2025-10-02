import React, { useState } from 'react';

export default function Loyalty() {
  const [loyaltyData] = useState({
    current_tier: 'Gold',
    total_points: 7500,
    lifetime_investment: 50000000000,
    referrals_count: 3,
  });

  const [availableRewards] = useState([
    {
      id: 1,
      title: 'کش‌بک ۱٪ خرید بعدی',
      description: 'دریافت ۱٪ کش‌بک در اولین خرید بعدی',
      points_required: 500,
    },
    {
      id: 2,
      title: 'مشاوره رایگان',
      description: '۱ ساعت مشاوره رایگان با کارشناسان ما',
      points_required: 1000,
    },
    {
      id: 3,
      title: 'دسترسی زودهنگام',
      description: 'دسترسی ۲۴ ساعته زودتر به پروژه‌های جدید',
      points_required: 2000,
    },
    {
      id: 4,
      title: 'کاهش کارمزد',
      description: 'کاهش ۰.۱٪ کارمزد برای ۳ ماه',
      points_required: 3000,
    },
    {
      id: 5,
      title: 'گفت‌وگو با مدیرعامل',
      description: '۳۰ دقیقه گفت‌وگوی اختصاصی',
      points_required: 5000,
    }
  ]);

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

  const tiers = {
    Bronze: { points: 0, icon: '🥉', color: 'from-amber-600 to-yellow-700' },
    Silver: { points: 1000, icon: '🥈', color: 'from-slate-400 to-slate-600' },
    Gold: { points: 5000, icon: '🥇', color: 'from-yellow-400 to-yellow-600' },
    Platinum: { points: 20000, icon: '💎', color: 'from-purple-400 to-purple-600' },
    Diamond: { points: 100000, icon: '👑', color: 'from-blue-400 to-indigo-600' }
  };

  const claimReward = (reward) => {
    if (loyaltyData.total_points < reward.points_required) {
      alert('امتیاز کافی ندارید!');
      return;
    }
    alert(`پاداش "${reward.title}" با موفقیت دریافت شد!`);
  };

  const currentTierIndex = Object.keys(tiers).indexOf(loyaltyData.current_tier);
  const nextTierName = Object.keys(tiers)[currentTierIndex + 1];
  const currentTierPointsEarned = loyaltyData.total_points - tiers[loyaltyData.current_tier].points;
  const pointsNeededForNextTier = nextTierName ? tiers[nextTierName].points - tiers[loyaltyData.current_tier].points : 0;
  const progressPercentage = pointsNeededForNextTier > 0 ? (currentTierPointsEarned / pointsNeededForNextTier) * 100 : 100;

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-amber-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            برنامه وفاداری
          </h1>
          <p className="text-slate-600">فعالیت بیشتر، پاداش بیشتر!</p>
        </div>

        {/* Current Status */}
        <div className={`bg-gradient-to-bl ${tiers[loyaltyData.current_tier].color} text-white rounded-xl shadow-xl p-8 text-center mb-8`}>
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
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-slate-900">
              {loyaltyData.total_points.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">کل امتیاز</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-slate-900">
              {(loyaltyData.lifetime_investment / 1000000000).toFixed(1)}میلیارد
            </div>
            <div className="text-sm text-slate-600">کل سرمایه‌گذاری</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">👑</div>
            <div className="text-2xl font-bold text-slate-900">
              {loyaltyData.referrals_count}
            </div>
            <div className="text-sm text-slate-600">دعوت موفق</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Rewards */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎁</span>
              <h3 className="text-lg font-semibold text-slate-900">پاداش‌های قابل دریافت</h3>
            </div>
            
            {availableRewards.filter(reward => loyaltyData.total_points >= reward.points_required).length > 0 ? (
              <div className="space-y-4">
                {availableRewards
                  .filter(reward => loyaltyData.total_points >= reward.points_required)
                  .map(reward => (
                    <div key={reward.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{reward.title}</h4>
                        <p className="text-sm text-slate-600">{reward.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-amber-500">⭐</span>
                          <span className="text-sm font-medium">{reward.points_required} امتیاز</span>
                        </div>
                      </div>
                      <button
                        onClick={() => claimReward(reward)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium"
                      >
                        دریافت
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <div className="text-4xl mb-4 opacity-50">🎁</div>
                <p>پاداش قابل دریافتی ندارید</p>
                <p className="text-sm">بیشتر فعالیت کنید تا امتیاز کسب کنید</p>
              </div>
            )}
          </div>

          {/* Current Benefits */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <h3 className="text-lg font-semibold text-slate-900">مزایای فعلی شما</h3>
            </div>
            
            <div className="space-y-3">
              {benefits[loyaltyData.current_tier].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-emerald-600">✅</span>
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">چگونه امتیاز کسب کنیم؟</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold mb-1">سرمایه‌گذاری</h4>
              <p className="text-sm text-slate-600">۱ امتیاز به ازای هر میلیون ریال</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">👥</div>
              <h4 className="font-semibold mb-1">دعوت دوستان</h4>
              <p className="text-sm text-slate-600">۵۰۰ امتیاز به ازای هر دعوت موفق</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-2">⭐</div>
              <h4 className="font-semibold mb-1">نظر و امتیاز</h4>
              <p className="text-sm text-slate-600">۵۰ امتیاز برای هر نظر</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-semibold mb-1">فعالیت روزانه</h4>
              <p className="text-sm text-slate-600">۱۰ امتیاز روزانه برای ورود</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}