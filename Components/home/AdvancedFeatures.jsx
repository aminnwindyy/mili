import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, CreditCard, Award, ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

export default function AdvancedFeatures() {
  const features = [
    {
      icon: PieChart,
      title: "صندوق‌های سرمایه‌گذاری",
      description: "سرمایه‌گذاری در صندوق‌های متنوع ملکی با مدیریت حرفه‌ای و ریسک توزیع شده",
      benefits: ["متنوع‌سازی خودکار", "مدیریت حرفه‌ای", "حداقل سرمایه کم"],
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      icon: CreditCard,
      title: "وام با وثیقه توکن",
      description: "دریافت نقدینگی با استفاده از توکن‌های املاک خود بدون فروش آن‌ها",
      benefits: ["بدون فروش دارایی", "سود مرکب", "نرخ سود مناسب"],
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      icon: Award,
      title: "برنامه وفاداری",
      description: "کسب امتیاز از فعالیت‌ها و دسترسی به مزایای ویژه بر اساس سطح وفاداری",
      benefits: ["کارمزد کمتر", "دسترسی زودهنگام", "مشاوره رایگان"],
      color: "from-purple-500 to-violet-600",
      bgColor: "from-purple-50 to-violet-50"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            سطح جدیدی از <span className="text-emerald-600">سرمایه‌گذاری</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            خدمات مالی پیشرفته که تجربه سرمایه‌گذاری شما را متحول می‌کند
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-gradient-to-bl ${feature.bgColor}`}>
              <CardContent className="p-8">
                <div className={`w-16 h-16 bg-gradient-to-bl ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-l ${feature.color}`}></div>
                      <span className="text-sm text-slate-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full group-hover:border-emerald-500 group-hover:text-emerald-600 transition-colors">
                  اطلاعات بیشتر
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional info section */}
        <div className="mt-16 bg-gradient-to-l from-slate-50 to-emerald-50 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                آماده کشف آینده سرمایه‌گذاری هستید؟
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                با ابزارهای هوشمند MelkChain، استراتژی سرمایه‌گذاری خود را بهینه کنید و از فرصت‌های منحصر به فرد بهره‌مند شوید.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-l from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                  شروع رایگان
                </Button>
                <Button variant="outline">
                  مشاهده دموی آنلاین
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-2xl text-slate-900">۲۴.۵%</span>
                </div>
                <p className="text-sm text-slate-600">بازدهی صندوق‌ها</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-2xl text-slate-900">۱۰۰%</span>
                </div>
                <p className="text-sm text-slate-600">امنیت تضمین شده</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-2xl text-slate-900">&lt;۲۴س</span>
                </div>
                <p className="text-sm text-slate-600">تایید وام</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-2xl text-slate-900">۵ سطح</span>
                </div>
                <p className="text-sm text-slate-600">برنامه وفاداری</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}