import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Property } from "@/entities/Property";
import { Investment } from "@/entities/Investment";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { formatCurrency } from "@/components/ui/formatters";
import { 
  Building2, 
  Coins, 
  TrendingUp, 
  DollarSign, 
  Plus,
  ArrowUpRight,
  Activity,
  RefreshCw,
  Settings
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import RecentProperties from "@/components/dashboard/RecentProperties";
import InvestmentOverview from "@/components/dashboard/InvestmentOverview";
import InvestmentJourneyWidget from "@/components/dashboard/InvestmentJourneyWidget";
import InteractiveChart from "@/components/dashboard/InteractiveChart";
import WeeklySummary from "@/components/dashboard/WeeklySummary";
import SimpleAdvancedToggle from "@/components/ui/SimpleAdvancedToggle";
import DashboardWidget from "@/components/dashboard/DashboardWidget";
import GamificationWidget from "@/components/ui/GamificationWidget";
import LeaderboardWidget from "@/components/ui/LeaderboardWidget";

const initialWidgetsConfig = [
  { id: 'stats', component: StatsCard },
  { id: 'gamification', component: GamificationWidget },
  { id: 'leaderboard', component: LeaderboardWidget },
  { id: 'chart', component: InteractiveChart, advancedOnly: true },
  { id: 'journey', component: InvestmentJourneyWidget },
  { id: 'recent', component: RecentProperties },
  { id: 'overview', component: InvestmentOverview },
  { id: 'weekly', component: WeeklySummary, advancedOnly: true },
  { id: 'market', component: 'MarketActivity', advancedOnly: true }
];

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [widgetOrder, setWidgetOrder] = useState(() => {
    try {
      const savedOrder = localStorage.getItem('dashboard-widget-order');
      return savedOrder ? JSON.parse(savedOrder) : initialWidgetsConfig.map(w => w.id);
    } catch {
      return initialWidgetsConfig.map(w => w.id);
    }
  });

  useEffect(() => {
    loadData();
    loadUserSettings();
    generateChartData();
  }, []);

  const loadData = async (isRefresh = false) => {
    setIsLoading(true);
    if (isRefresh) {
      // Add a small delay for better UX on manual refresh
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    try {
      const [propertiesData, investmentsData, userData] = await Promise.all([
        Property.list("-created_date", 10),
        Investment.list("-created_date", 10),
        User.me().catch(() => null)
      ]);
      setProperties(propertiesData);
      setInvestments(investmentsData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };
  
  const handleRefresh = () => {
    loadData(true);
  };

  const loadUserSettings = () => {
    const simpleMode = localStorage.getItem('simple_mode') === 'true';
    setIsSimpleMode(simpleMode);
  };

  const generateChartData = () => {
    const data = [];
    const baseValue = 50000000; 
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 0.1;
      const value = baseValue * (1 + variation * i * 0.1);
      data.push({
        name: date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
        value: Math.round(value)
      });
    }
    setChartData(data);
  };

  const handleModeToggle = (newSimpleMode) => {
    setIsSimpleMode(newSimpleMode);
    localStorage.setItem('simple_mode', newSimpleMode);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(widgetOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgetOrder(items);
    localStorage.setItem('dashboard-widget-order', JSON.stringify(items));
  };
  
  const demoMode = user?.demo_mode;
  const totalValue = demoMode ? 10000000000 : properties.reduce((sum, prop) => sum + (prop.total_value || 0), 0);
  const totalInvestment = demoMode ? 1000000000 : investments.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const activeProperties = demoMode ? 5 : properties.filter(p => p.status === "در_حال_فروش").length;
  
  const journeySteps = [];
  if (user) journeySteps.push('signup');
  if (investments.length > 0 || demoMode) {
    journeySteps.push('explore');
    journeySteps.push('invest');
    if (investments.length > 1 || demoMode) {
      journeySteps.push('portfolio');
    }
  }

  const renderWidget = (widgetId) => {
    const widgetConfig = initialWidgetsConfig.find(w => w.id === widgetId);
    if (!widgetConfig) return null;
    
    // Hide advanced widgets in simple mode
    if (widgetConfig.advancedOnly && isSimpleMode) return null;

    switch(widgetId) {
      case 'stats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="کل ارزش املاک" value={formatCurrency(totalValue)} icon={DollarSign} gradient="from-emerald-500 to-teal-600" trend={demoMode ? "حساب دمو" : "+۱۲% این ماه"} />
            <StatsCard title="املاک فعال" value={activeProperties.toString()} icon={Building2} gradient="from-blue-500 to-indigo-600" trend={demoMode ? "حساب دمو" : `از ${properties.length} ملک`} />
            <StatsCard title="کل سرمایه‌گذاری" value={formatCurrency(totalInvestment)} icon={Coins} gradient="from-amber-500 to-orange-600" trend={demoMode ? "حساب دمو" : "+۸% این هفته"} />
            <StatsCard title="بازدهی میانگین" value={demoMode ? "۱۸.۵%" : "۱۵.۲%"} icon={TrendingUp} gradient="from-purple-500 to-pink-600" trend="سالانه" />
          </div>
        );
      case 'gamification':
        return <GamificationWidget userId={user?.id || "demo_user"} />;
      case 'leaderboard':
        return <LeaderboardWidget userId={user?.id || "demo_user"} />;
      case 'chart':
        return <InteractiveChart data={chartData} title="روند ارزش پورتفو (7 روز گذشته)" />;
      case 'journey':
        return <InvestmentJourneyWidget completedSteps={journeySteps} />;
      case 'recent':
        return <RecentProperties properties={properties} isLoading={isLoading} isSimpleMode={isSimpleMode} />;
      case 'overview':
        return <InvestmentOverview investments={investments} isLoading={isLoading} isSimpleMode={isSimpleMode} />;
      case 'weekly':
        return <WeeklySummary investments={investments} properties={properties} userEmail={user?.email} />;
      case 'market':
        return (
          <Card className="shadow-xl border-0 bg-gradient-to-bl from-white to-slate-50">
            <CardHeader className="pb-4"><CardTitle className="flex items-center gap-2 text-lg"><Activity className="w-5 h-5 text-blue-600" />فعالیت بازار</CardTitle></CardHeader>
            <CardContent><div className="space-y-4"><div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"><div className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-sm font-medium">فروش توکن آپارتمان میرداماد</span></div><span className="text-xs text-green-600">۵ دقیقه پیش</span></div><div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"><div className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div><span className="text-sm font-medium">ثبت ملک تجاری جدید</span></div><span className="text-xs text-blue-600">۱۵ دقیقه پیش</span></div><div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100"><div className="flex items-center gap-3"><div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div><span className="text-sm font-medium">تایید مستندات ملک</span></div><span className="text-xs text-amber-600">۳۰ دقیقه پیش</span></div></div></CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-bl from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">داشبورد</h1>
            <p className="text-slate-600">برای شخصی‌سازی، ویجت‌ها را بکشید و رها کنید.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button onClick={handleRefresh} variant="outline" size="icon" className="h-10 w-10"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /></Button>
            <SimpleAdvancedToggle isSimpleMode={isSimpleMode} onToggle={handleModeToggle} />
            <Button variant="ghost" size="icon" className="h-10 w-10"><Settings className="w-5 h-5" /></Button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="dashboard-widgets">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="space-y-8"
              >
                {widgetOrder.map((widgetId, index) => (
                  <DashboardWidget key={widgetId} id={widgetId} index={index}>
                    {renderWidget(widgetId)}
                  </DashboardWidget>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}