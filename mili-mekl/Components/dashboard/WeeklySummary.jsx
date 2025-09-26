import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  MessageSquare,
  Download,
  Share2
} from 'lucide-react';
import { formatCurrency } from '../ui/formatters';

export default function WeeklySummary({ investments, properties, userEmail }) {
  const [weeklyData, setWeeklyData] = useState({
    profit: 0,
    newInvestments: 0,
    portfolioChange: 0,
    propertiesViewed: 0,
    topPerformer: null
  });

  const generateWeeklySummary = useCallback(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const thisWeekInvestments = investments.filter(inv => 
      new Date(inv.created_date) >= oneWeekAgo
    );

    const totalProfit = investments.reduce((sum, inv) => 
      sum + (inv.profit_loss || 0), 0
    );

    const portfolioValue = investments.reduce((sum, inv) => 
      sum + (inv.current_value || inv.total_amount), 0
    );

    // شبیه‌سازی داده‌های هفته گذشته
    const simulatedLastWeekValue = portfolioValue * 0.95;
    const portfolioChange = portfolioValue - simulatedLastWeekValue;

    setWeeklyData({
      profit: totalProfit,
      newInvestments: thisWeekInvestments.length,
      portfolioChange: portfolioChange,
      propertiesViewed: Math.floor(Math.random() * 10) + 5, // شبیه‌سازی
      topPerformer: investments.length > 0 ? investments[0] : null
    });
  }, [investments]);

  useEffect(() => {
    generateWeeklySummary();
  }, [generateWeeklySummary]);

  const sendWeeklySummary = async (method) => {
    const summaryText = `
🎉 خلاصه هفتگی MelkChain

📈 عملکرد شما:
• سود این هفته: ${formatCurrency(weeklyData.profit)}
• تغییر پورتفو: ${weeklyData.portfolioChange >= 0 ? '+' : ''}${formatCurrency(weeklyData.portfolioChange)}
• سرمایه‌گذاری‌های جدید: ${weeklyData.newInvestments}
• املاک بازدید شده: ${weeklyData.propertiesViewed}

${weeklyData.topPerformer ? `⭐ بهترین عملکرد: ${weeklyData.topPerformer.property_title || 'سرمایه‌گذاری شما'}` : ''}

ادامه موفقیت‌هایتان را در MelkChain دنبال کنید! 🚀
    `;

    if (method === 'email') {
      // ارسال ایمیل (شبیه‌سازی)
      console.log('Sending email summary:', summaryText);
      alert('خلاصه هفتگی به ایمیل شما ارسال شد!');
    } else if (method === 'sms') {
      // ارسال پیامک (شبیه‌سازی)
      console.log('Sending SMS summary:', summaryText);
      alert('خلاصه هفتگی به شماره موبایل شما ارسال شد!');
    }
  };

  const shareWeeklySummary = () => {
    const summaryText = `این هفته در MelkChain ${formatCurrency(Math.abs(weeklyData.profit))} ${weeklyData.profit >= 0 ? 'سود' : 'ضرر'} کردم! 🎯`;
    
    if (navigator.share) {
      navigator.share({
        title: 'خلاصه هفتگی MelkChain',
        text: summaryText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(summaryText);
      alert('متن کپی شد!');
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-bl from-white to-emerald-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          خلاصه هفتگی شما
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* آمار کلیدی */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border">
            <div className="flex items-center gap-2 mb-2">
              {weeklyData.profit >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm font-medium">سود/زیان هفته</span>
            </div>
            <div className={`text-lg font-bold ${
              weeklyData.profit >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {weeklyData.profit >= 0 ? '+' : ''}{formatCurrency(weeklyData.profit)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">تغییر پورتفو</span>
            </div>
            <div className={`text-lg font-bold ${
              weeklyData.portfolioChange >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {weeklyData.portfolioChange >= 0 ? '+' : ''}{formatCurrency(weeklyData.portfolioChange)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border">
            <span className="text-sm font-medium text-slate-600">سرمایه‌گذاری جدید</span>
            <div className="text-lg font-bold text-slate-900">
              {weeklyData.newInvestments} مورد
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border">
            <span className="text-sm font-medium text-slate-600">املاک بازدید شده</span>
            <div className="text-lg font-bold text-slate-900">
              {weeklyData.propertiesViewed} ملک
            </div>
          </div>
        </div>

        {/* پیام تشویقی */}
        <div className="bg-gradient-to-l from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h4 className="font-semibold text-emerald-800 mb-1">
                {weeklyData.profit >= 0 ? 'عالی پیش می‌روید!' : 'نگران نباشید، بازار نوسان دارد!'}
              </h4>
              <p className="text-sm text-emerald-700">
                {weeklyData.profit >= 0 
                  ? `این هفته ${formatCurrency(weeklyData.profit)} سود کردید! ادامه دهید 💪`
                  : 'سرمایه‌گذاری بلندمدت کلید موفقیت است. صبور باشید! 🌱'
                }
              </p>
            </div>
          </div>
        </div>

        {/* بهترین عملکرد */}
        {weeklyData.topPerformer && (
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⭐</span>
              <span className="font-semibold text-amber-800">بهترین عملکرد هفته</span>
            </div>
            <p className="text-sm text-amber-700">
              سرمایه‌گذاری شما در {weeklyData.topPerformer.property_title || 'یکی از املاک'} 
              بهترین عملکرد را داشته است.
            </p>
          </div>
        )}

        {/* دکمه‌های عملیاتی */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={() => sendWeeklySummary('email')}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              ارسال ایمیل
            </Button>
            <Button
              onClick={() => sendWeeklySummary('sms')}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              ارسال پیامک
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={shareWeeklySummary}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              اشتراک‌گذاری
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              دانلود PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}