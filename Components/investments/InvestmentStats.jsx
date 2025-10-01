import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Building2 } from "lucide-react";

export default function InvestmentStats({ 
  totalInvested, 
  totalCurrentValue, 
  totalProfitLoss, 
  investmentCount 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="shadow-xl border-0 bg-gradient-to-bl from-white to-blue-50 hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">کل سرمایه‌گذاری</p>
              <p className="text-2xl font-bold text-slate-900">
                {(totalInvested / 1000000000).toFixed(1)} میلیارد
              </p>
              <p className="text-xs text-slate-500">ریال</p>
            </div>
            <div className="p-3 bg-gradient-to-bl from-blue-500 to-indigo-600 rounded-xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-gradient-to-bl from-white to-emerald-50 hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">ارزش فعلی</p>
              <p className="text-2xl font-bold text-slate-900">
                {(totalCurrentValue / 1000000000).toFixed(1)} میلیارد
              </p>
              <p className="text-xs text-slate-500">ریال</p>
            </div>
            <div className="p-3 bg-gradient-to-bl from-emerald-500 to-teal-600 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`shadow-xl border-0 hover:shadow-2xl transition-all duration-300 ${
        totalProfitLoss >= 0 
          ? 'bg-gradient-to-bl from-white to-green-50'
          : 'bg-gradient-to-bl from-white to-red-50'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">سود/زیان</p>
              <p className={`text-2xl font-bold ${
                totalProfitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {totalProfitLoss >= 0 ? '+' : ''}{(totalProfitLoss / 1000000000).toFixed(2)} میلیارد
              </p>
              <p className="text-xs text-slate-500">ریال</p>
            </div>
            <div className={`p-3 rounded-xl ${
              totalProfitLoss >= 0 
                ? 'bg-gradient-to-bl from-emerald-500 to-green-600'
                : 'bg-gradient-to-bl from-red-500 to-rose-600'
            }`}>
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="w-6 h-6 text-white" />
              ) : (
                <TrendingDown className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-gradient-to-bl from-white to-purple-50 hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">بازدهی کل</p>
              <p className={`text-2xl font-bold ${
                totalProfitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {totalInvested > 0 ? ((totalProfitLoss / totalInvested) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-slate-500">{investmentCount} سرمایه‌گذاری</p>
            </div>
            <div className={`p-3 rounded-xl ${
              totalProfitLoss >= 0 
                ? 'bg-gradient-to-bl from-purple-500 to-violet-600'
                : 'bg-gradient-to-bl from-gray-500 to-slate-600'
            }`}>
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="w-6 h-6 text-white" />
              ) : (
                <TrendingDown className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}