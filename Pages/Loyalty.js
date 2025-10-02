import React from 'react';

export default function Loyalty() {
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
        <div className="bg-gradient-to-bl from-yellow-400 to-yellow-600 text-white rounded-xl shadow-xl p-8 text-center mb-8">
          <div className="text-6xl mb-4">🥇</div>
          <h2 className="text-3xl font-bold mb-2">Gold</h2>
          <p className="text-lg opacity-90 mb-6">
            شما در سطح Gold هستید
          </p>
          <div className="text-2xl font-bold mb-2">
            7,500 امتیاز
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>تا سطح Platinum</span>
              <span>12,500 امتیاز</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-white h-3 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-slate-900">7,500</div>
            <div className="text-sm text-slate-600">کل امتیاز</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-slate-900">50.0میلیارد</div>
            <div className="text-sm text-slate-600">کل سرمایه‌گذاری</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">👑</div>
            <div className="text-2xl font-bold text-slate-900">3</div>
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
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">کش‌بک ۱٪ خرید بعدی</h4>
                  <p className="text-sm text-slate-600">دریافت ۱٪ کش‌بک در اولین خرید بعدی</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-amber-500">⭐</span>
                    <span className="text-sm font-medium">500 امتیاز</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('پاداش با موفقیت دریافت شد!')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium"
                >
                  دریافت
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">مشاوره رایگان</h4>
                  <p className="text-sm text-slate-600">۱ ساعت مشاوره رایگان با کارشناسان ما</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-amber-500">⭐</span>
                    <span className="text-sm font-medium">1000 امتیاز</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('پاداش با موفقیت دریافت شد!')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium"
                >
                  دریافت
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">دسترسی زودهنگام</h4>
                  <p className="text-sm text-slate-600">دسترسی ۲۴ ساعته زودتر به پروژه‌های جدید</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-amber-500">⭐</span>
                    <span className="text-sm font-medium">2000 امتیاز</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('پاداش با موفقیت دریافت شد!')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium"
                >
                  دریافت
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">کاهش کارمزد</h4>
                  <p className="text-sm text-slate-600">کاهش ۰.۱٪ کارمزد برای ۳ ماه</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-amber-500">⭐</span>
                    <span className="text-sm font-medium">3000 امتیاز</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('پاداش با موفقیت دریافت شد!')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium"
                >
                  دریافت
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">گفت‌وگو با مدیرعامل</h4>
                  <p className="text-sm text-slate-600">۳۰ دقیقه گفت‌وگوی اختصاصی</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-amber-500">⭐</span>
                    <span className="text-sm font-medium">5000 امتیاز</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('پاداش با موفقیت دریافت شد!')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium"
                >
                  دریافت
                </button>
              </div>
            </div>
          </div>

          {/* Current Benefits */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <h3 className="text-lg font-semibold text-slate-900">مزایای فعلی شما</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-emerald-600">✅</span>
                <span className="text-slate-700">پشتیبانی VIP</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-emerald-600">✅</span>
                <span className="text-slate-700">کاهش ۰.۲٪ کارمزد معاملات</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-emerald-600">✅</span>
                <span className="text-slate-700">دسترسی زودهنگام به پروژه‌ها</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-emerald-600">✅</span>
                <span className="text-slate-700">مشاوره ماهانه رایگان</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-emerald-600">✅</span>
                <span className="text-slate-700">کش‌بک ۱٪ از خریدها</span>
              </div>
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