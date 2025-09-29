import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Building2, Coins, DollarSign, RefreshCw } from "lucide-react";

export default function EcosystemFlow() {
  const flowSteps = [
    {
      icon: Users,
      title: "سرمایه‌گذاران",
      description: "ورود سرمایه به پلتفرم",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Building2,
      title: "مالکین",
      description: "ثبت املاک برای توکن‌سازی",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Coins,
      title: "املاک توکنیزه شده",
      description: "تقسیم املاک به توکن‌های قابل معامله",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: DollarSign,
      title: "درآمدهای ماهانه",
      description: "توزیع سود اجاره و رشد ارزش",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: RefreshCw,
      title: "بازار ثانویه",
      description: "معامله آزاد توکن‌ها",
      color: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-bl from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            اکوسیستم <span className="text-emerald-600">یکپارچه</span> MelkChain
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            جریان دایره‌ای ارزش که همه ذی‌نفعان را به هم متصل می‌کند
          </p>
        </div>

        <div className="relative">
          {/* Flow visualization for desktop */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between relative">
              {flowSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <Card className="w-32 h-32 flex items-center justify-center mb-4 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className={`w-16 h-16 bg-gradient-to-bl ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </Card>
                  <h3 className="font-bold text-slate-900 mb-2 text-center">{step.title}</h3>
                  <p className="text-sm text-slate-600 text-center max-w-32">{step.description}</p>
                  
                  {/* Arrow connector */}
                  {index < flowSteps.length - 1 && (
                    <ArrowRight className="absolute top-16 -left-8 w-6 h-6 text-emerald-400 z-0" />
                  )}
                  
                  {/* Circular connection from last to first */}
                  {index === flowSteps.length - 1 && (
                    <div className="absolute top-16 -right-[600px] w-[600px] h-12 border-t-2 border-r-2 border-emerald-400 rounded-tr-full opacity-30"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Flow visualization for mobile */}
          <div className="lg:hidden space-y-8">
            {flowSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <Card className="w-20 h-20 flex items-center justify-center flex-shrink-0 shadow-lg border-0">
                  <div className={`w-12 h-12 bg-gradient-to-bl ${step.color} rounded-xl flex items-center justify-center`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </Card>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
                {index < flowSteps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-emerald-400 rotate-90 lg:rotate-0" />
                )}
              </div>
            ))}
          </div>

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-emerald-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-amber-300 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Key benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-bl from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">جریان مداوم درآمد</h4>
            <p className="text-slate-600">سود ماهانه از اجاره و رشد ارزش املاک</p>
          </Card>
          
          <Card className="p-6 text-center shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-bl from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">نقدینگی بالا</h4>
            <p className="text-slate-600">امکان خرید و فروش توکن‌ها در هر زمان</p>
          </Card>
          
          <Card className="p-6 text-center shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-bl from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">اجتماع فعال</h4>
            <p className="text-slate-600">شبکه‌ای از سرمایه‌گذاران و مالکین حرفه‌ای</p>
          </Card>
        </div>
      </div>
    </section>
  );
}