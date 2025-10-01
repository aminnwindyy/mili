import React, { useState, useEffect } from "react";
import { Investment } from "@/entities/Investment";
import { Property } from "@/entities/Property";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Building2,
  Calendar,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import InvestmentCard from "@/components/investments/InvestmentCard";
import InvestmentStats from "@/components/investments/InvestmentStats";

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [properties, setProperties] = useState({});
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userData, investmentsData, propertiesData] = await Promise.all([
        User.me(),
        Investment.list("-created_date"),
        Property.list()
      ]);
      
      setUser(userData);
      setInvestments(investmentsData.filter(inv => inv.investor_email === userData.email));
      
      // Create properties lookup
      const propertiesMap = {};
      propertiesData.forEach(prop => {
        propertiesMap[prop.id] = prop;
      });
      setProperties(propertiesMap);
      
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + (inv.current_value || inv.total_amount || 0), 0);
  const totalProfitLoss = totalCurrentValue - totalInvested;

  return (
    <div className="p-4 md:p-8 bg-gradient-to-bl from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              سرمایه‌گذاری‌های من
            </h1>
            <p className="text-slate-600">مدیریت و پیگیری سرمایه‌گذاری‌های دیجیتال</p>
          </div>
          <Link to={createPageUrl("Properties")}>
            <Button className="bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              سرمایه‌گذاری جدید
            </Button>
          </Link>
        </div>

        {/* Investment Stats */}
        <InvestmentStats 
          totalInvested={totalInvested}
          totalCurrentValue={totalCurrentValue}
          totalProfitLoss={totalProfitLoss}
          investmentCount={investments.length}
        />

        {/* Portfolio Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="shadow-xl border-0 bg-gradient-to-bl from-white to-blue-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="w-5 h-5 text-blue-600" />
                خلاصه پرتفوی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">کل سرمایه:</span>
                  <span className="font-bold text-slate-900">
                    {(totalInvested / 1000000000).toFixed(1)} میلیارد ریال
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">ارزش فعلی:</span>
                  <span className="font-bold text-slate-900">
                    {(totalCurrentValue / 1000000000).toFixed(1)} میلیارد ریال
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">سود/زیان:</span>
                  <span className={`font-bold flex items-center gap-1 ${
                    totalProfitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {totalProfitLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {totalProfitLoss >= 0 ? '+' : ''}{(totalProfitLoss / 1000000000).toFixed(2)} میلیارد ریال
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-600">بازدهی کل:</span>
                  <span className={`font-bold ${
                    totalProfitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {totalInvested > 0 ? ((totalProfitLoss / totalInvested) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-bl from-white to-green-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="w-5 h-5 text-green-600" />
                توزیع سرمایه‌گذاری
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investments.slice(0, 4).map((investment) => {
                  const property = properties[investment.property_id];
                  const percentage = totalInvested > 0 ? ((investment.total_amount / totalInvested) * 100) : 0;
                  
                  return (
                    <div key={investment.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {property?.title || 'نامشخص'}
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-slate-600 mr-2">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
                
                {investments.length === 0 && (
                  <p className="text-center text-slate-500 py-6">
                    هیچ سرمایه‌گذاری‌ای وجود ندارد
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-bl from-white to-purple-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
                عملکرد اخیر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">+۱۲.۵%</p>
                  <p className="text-sm text-slate-600">بازدهی ۳۰ روز اخیر</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">+۸.۷%</p>
                  <p className="text-sm text-slate-600">بازدهی ۷ روز اخیر</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investments List */}
        <Card className="shadow-xl border-0">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-xl">لیست سرمایه‌گذاری‌ها</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8">
                <div className="animate-pulse space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-8 w-24 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : investments.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {investments.map((investment) => (
                  <InvestmentCard
                    key={investment.id}
                    investment={investment}
                    property={properties[investment.property_id]}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Wallet className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  هیچ سرمایه‌گذاری‌ای وجود ندارد
                </h3>
                <p className="text-slate-500 mb-6">
                  اولین سرمایه‌گذاری خود را در املاک دیجیتال انجام دهید
                </p>
                <Link to={createPageUrl("Properties")}>
                  <Button>
                    <Building2 className="w-4 h-4 mr-2" />
                    مشاهده املاک
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}