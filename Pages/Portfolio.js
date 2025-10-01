import React, { useState, useEffect } from "react";
import { Investment } from "@/entities/Investment";
import { Property } from "@/entities/Property";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, 
  TrendingUp, 
  Building2,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Coins
} from "lucide-react";
import { formatCurrency } from "@/components/ui/formatters";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Portfolio() {
  const [investments, setInvestments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);
      
      if (userData) {
        const [investmentsData, propertiesData] = await Promise.all([
          Investment.filter({ investor_email: userData.email }),
          Property.list()
        ]);
        setInvestments(investmentsData);
        setProperties(propertiesData);
      }
    } catch (error) {
      console.error("Error loading portfolio data:", error);
    }
    setIsLoading(false);
  };

  // محاسبات پورتفولیو
  const totalInvestment = investments.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const currentValue = investments.reduce((sum, inv) => sum + (inv.current_value || inv.total_amount || 0), 0);
  const totalProfit = currentValue - totalInvestment;
  const profitPercentage = totalInvestment > 0 ? ((totalProfit / totalInvestment) * 100) : 0;

  // آمار دمو برای حالت نمایشی
  const demoMode = user?.demo_mode || !user;
  const displayStats = demoMode ? {
    totalInvestment: 10000000000, // 1 میلیارد ریال
    currentValue: 12000000000, // 1.2 میلیارد ریال
    totalProfit: 2000000000, // 200 میلیون ریال
    profitPercentage: 20
  } : {
    totalInvestment,
    currentValue,
    totalProfit,
    profitPercentage
  };

  const portfolioBreakdown = investments.reduce((acc, inv) => {
    const property = properties.find(p => p.id === inv.property_id);
    if (property) {
      const type = property.property_type;
      acc[type] = (acc[type] || 0) + inv.total_amount;
    }
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-emerald-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              پورتفوی من
            </h1>
            <p className="text-slate-600">مدیریت و نظارت بر سرمایه‌گذاری‌های شما</p>
          </div>
          {demoMode && (
            <Badge className="bg-amber-100 text-amber-800">
              حالت نمایشی
            </Badge>
          )}
        </div>

        {/* آمار کلی پورتفولیو */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <Badge variant="outline">کل سرمایه</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {formatCurrency(displayStats.totalInvestment)}
              </div>
              <p className="text-sm text-slate-600">سرمایه‌گذاری شده</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Badge variant="outline">ارزش فعلی</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {formatCurrency(displayStats.currentValue)}
              </div>
              <p className="text-sm text-slate-600">ارزش بازار</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  displayStats.totalProfit >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {displayStats.totalProfit >= 0 ? 
                    <ArrowUpRight className="w-6 h-6 text-white" /> : 
                    <ArrowDownRight className="w-6 h-6 text-white" />
                  }
                </div>
                <Badge variant="outline">سود/زیان</Badge>
              </div>
              <div className={`text-2xl font-bold mb-1 ${
                displayStats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(Math.abs(displayStats.totalProfit))}
              </div>
              <p className="text-sm text-slate-600">
                {displayStats.profitPercentage >= 0 ? '+' : ''}{displayStats.profitPercentage.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <Badge variant="outline">تنوع</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {Object.keys(portfolioBreakdown).length || (demoMode ? 4 : 0)}
              </div>
              <p className="text-sm text-slate-600">نوع ملک</p>
            </CardContent>
          </Card>
        </div>

        {/* چارت و جزئیات */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Portfolio Breakdown */}
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                توزیع پورتفولیو
              </CardTitle>
            </CardHeader>
            <CardContent>
              {demoMode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="font-medium">آپارتمان</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">400 میلیون تومان</div>
                      <div className="text-sm text-slate-500">40%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                      <span className="font-medium">تجاری</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">300 میلیون تومان</div>
                      <div className="text-sm text-slate-500">30%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="font-medium">اداری</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">200 میلیون تومان</div>
                      <div className="text-sm text-slate-500">20%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-amber-500 rounded"></div>
                      <span className="font-medium">زمین</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">100 میلیون تومان</div>
                      <div className="text-sm text-slate-500">10%</div>
                    </div>
                  </div>
                </div>
              ) : Object.keys(portfolioBreakdown).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(portfolioBreakdown).map(([type, amount], index) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded bg-${['blue', 'emerald', 'purple', 'amber'][index % 4]}-500`}></div>
                        <span className="font-medium">{type}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(amount)}</div>
                        <div className="text-sm text-slate-500">
                          {((amount / totalInvestment) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    هنوز سرمایه‌گذاری نکرده‌اید
                  </h3>
                  <p className="text-slate-600 mb-6">برای شروع، یک ملک انتخاب کنید</p>
                  <Link to={createPageUrl("Properties")}>
                    <Button className="bg-gradient-to-l from-emerald-600 to-emerald-700">
                      <Plus className="w-4 h-4 mr-2" />
                      شروع سرمایه‌گذاری
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                عملکرد اخیر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">بازدهی ماهانه</span>
                  <span className="text-sm font-bold text-green-600">+3.2%</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">بازدهی سالانه</span>
                  <span className="text-sm font-bold text-blue-600">+18.5%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-800">نسبت به بازار</span>
                  <span className="text-sm font-bold text-purple-600">+5.3%</span>
                </div>
                <Progress value={53} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <Link to={createPageUrl("Properties")}>
                  <Button variant="outline" className="w-full">
                    <Target className="w-4 h-4 mr-2" />
                    افزودن سرمایه‌گذاری
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* لیست سرمایه‌گذاری‌ها */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>سرمایه‌گذاری‌های من</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : demoMode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop" 
                    alt="آپارتمان لوکس" 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">آپارتمان لوکس ولیعصر</h3>
                    <p className="text-sm text-slate-600">10 توکن • خریداری شده 2 ماه پیش</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">500 میلیون تومان</div>
                    <div className="text-sm text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      +15.2%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=64&h=64&fit=crop" 
                    alt="مجتمع تجاری" 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">مجتمع تجاری تجریش</h3>
                    <p className="text-sm text-slate-600">5 توکن • خریداری شده 1 ماه پیش</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">300 میلیون تومان</div>
                    <div className="text-sm text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      +8.7%
                    </div>
                  </div>
                </div>
              </div>
            ) : investments.length > 0 ? (
              <div className="space-y-4">
                {investments.map((investment) => {
                  const property = properties.find(p => p.id === investment.property_id);
                  const currentValue = investment.current_value || investment.total_amount;
                  const profit = currentValue - investment.total_amount;
                  const profitPercentage = ((profit / investment.total_amount) * 100);
                  
                  return (
                    <div key={investment.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                      <img 
                        src={property?.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop"}
                        alt={property?.title || "ملک"} 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{property?.title || "نامشخص"}</h3>
                        <p className="text-sm text-slate-600">
                          {investment.tokens_purchased} توکن • 
                          خریداری شده {new Date(investment.purchase_date).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{formatCurrency(currentValue)}</div>
                        <div className={`text-sm flex items-center gap-1 ${
                          profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {profit >= 0 ? 
                            <ArrowUpRight className="w-3 h-3" /> : 
                            <ArrowDownRight className="w-3 h-3" />
                          }
                          {profit >= 0 ? '+' : ''}{profitPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Coins className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  هیچ سرمایه‌گذاری‌ای ندارید
                </h3>
                <p className="text-slate-600 mb-6">
                  برای شروع، از صفحه املاک یک پروژه انتخاب کنید
                </p>
                <Link to={createPageUrl("Properties")}>
                  <Button className="bg-gradient-to-l from-emerald-600 to-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
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