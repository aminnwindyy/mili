import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Coins, TrendingUp, Building2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "۱",
      icon: Search,
      title: "انتخاب ملک",
      description: "از بین املاک تایید شده، ملک مورد نظر خود را انتخاب کنید",
      color: "from-blue-500 to-indigo-600"
    },
    {
      step: "۲", 
      icon: Coins,
      title: "خرید توکن",
      description: "تعداد توکن‌های مورد نظر را خریداری کنید",
      color: "from-green-500 to-emerald-600"
    },
    {
      step: "۳",
      icon: TrendingUp,
      title: "کسب درآمد",
      description: "از سود اجاره و افزایش ارزش ملک بهره‌مند شوید",
      color: "from-purple-500 to-violet-600"
    },
    {
      step: "۴",
      icon: Building2,
      title: "معامله آزاد",
      description: "در هر زمان توکن‌های خود را به فروش برسانید",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-bl from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            چگونه <span className="text-blue-600">کار می‌کند</span>؟
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            در ۴ مرحله ساده وارد دنیای سرمایه‌گذاری دیجیتال املاک شوید
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg h-full">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  {/* Step Number */}
                  <div className={`w-12 h-12 mx-auto mb-6 bg-gradient-to-bl ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-bl ${step.color} bg-opacity-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-bl ${step.color}`} style={{ 
                      background: `linear-gradient(135deg, ${step.color.includes('blue') ? '#3B82F6' : step.color.includes('green') ? '#10B981' : step.color.includes('purple') ? '#8B5CF6' : '#F59E0B'}, ${step.color.includes('blue') ? '#4F46E5' : step.color.includes('green') ? '#059669' : step.color.includes('purple') ? '#7C3AED' : '#D97706'})`,
                      WebkitBackgroundClip: 'text',
                      color: step.color.includes('blue') ? '#3B82F6' : step.color.includes('green') ? '#10B981' : step.color.includes('purple') ? '#8B5CF6' : '#F59E0B'
                    }} />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow connector (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-blue-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button size="lg" className="bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4 rounded-xl shadow-xl">
            همین حالا شروع کنید
            <ArrowRight className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}