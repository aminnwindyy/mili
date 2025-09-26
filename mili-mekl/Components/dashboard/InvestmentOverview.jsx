import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvestmentOverview({ investments, isLoading }) {
  const totalInvestment = investments.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const totalProfit = investments.reduce((sum, inv) => sum + (inv.profit_loss || 0), 0);

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-bl from-white to-slate-50">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="w-5 h-5 text-purple-600" />
          خلاصه سرمایه‌گذاری
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total Investment */}
            <div className="bg-gradient-to-l from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">کل سرمایه‌گذاری</p>
                  <p className="text-xl font-bold text-slate-900">
                    {(totalInvestment / 1000000000).toFixed(2)} میلیارد ریال
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            {/* Profit/Loss */}
            <div className={`p-4 rounded-xl border ${
              totalProfit >= 0 
                ? 'bg-gradient-to-l from-emerald-50 to-green-50 border-emerald-100'
                : 'bg-gradient-to-l from-red-50 to-rose-50 border-red-100'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">سود/زیان کل</p>
                  <p className={`text-xl font-bold ${
                    totalProfit >= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {totalProfit >= 0 ? '+' : ''}{(totalProfit / 1000000000).toFixed(2)} میلیارد ریال
                  </p>
                </div>
                <div className={`text-2xl ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {totalProfit >= 0 ? '📈' : '📉'}
                </div>
              </div>
            </div>

            {/* Recent Investments */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">آخرین سرمایه‌گذاری‌ها</h4>
              <div className="space-y-2">
                {investments.slice(0, 3).map((investment, index) => (
                  <div key={investment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {investment.tokens_purchased} توکن
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(investment.purchase_date).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {(investment.total_amount / 1000000).toFixed(1)}م ریال
                    </p>
                  </div>
                ))}
                
                {investments.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-slate-500 text-sm">هیچ سرمایه‌گذاری‌ای وجود ندارد</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}