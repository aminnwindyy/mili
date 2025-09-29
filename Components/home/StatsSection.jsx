import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Coins, TrendingUp } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: Building2,
      number: "۱۵۰+",
      label: "ملک فعال",
      description: "در سراسر کشور",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Users,
      number: "۵,۰۰۰+",
      label: "سرمایه‌گذار",
      description: "فعال در پلتفرم",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Coins,
      number: "۱۰ میلیارد",
      label: "ریال سرمایه",
      description: "جذب شده",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: TrendingUp,
      number: "۱۸.۲%",
      label: "بازدهی متوسط",
      description: "سالانه",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            اعداد و ارقام <span className="text-blue-600">قابل اعتماد</span>
          </h2>
          <p className="text-xl text-slate-600">
            آمارهای واقعی از عملکرد پلتفرم توکن‌ملک
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.color} opacity-5 rounded-full transform translate-x-8 -translate-y-8 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-bl ${stat.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="relative z-10">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-slate-700 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-slate-500">
                    {stat.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}