import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  BookOpen, 
  Newspaper, 
  GraduationCap, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Eye,
  Calendar
} from "lucide-react";

export default function MarketInsights() {
  const insights = [
    {
      id: 1,
      category: "تحلیل منطقه",
      title: "رشد ۲۵ درصدی قیمت املاک در شمال تهران",
      excerpt: "بررسی عوامل موثر بر رشد قیمت املاک در مناطق ۱ تا ۵ تهران و پیش‌بینی روند آتی بازار",
      author: "تیم تحلیل MelkChain",
      date: "۵ دی ۱۴۰۳",
      readTime: "۶ دقیقه",
      views: 1240,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
      icon: BarChart3,
      color: "emerald"
    },
    {
      id: 2,
      category: "آموزش",
      title: "راهنمای کامل سرمایه‌گذاری در توکن‌های املاک",
      excerpt: "آموزش گام به گام برای تازه‌واردان: از انتخاب ملک تا مدیریت پرتفوی",
      author: "مهندس احمد رضایی",
      date: "۲ دی ۱۴۰۳",
      readTime: "۱۲ دقیقه",
      views: 2100,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
      icon: GraduationCap,
      color: "blue"
    },
    {
      id: 3,
      category: "اخبار",
      title: "قانون جدید توکن‌سازی املاک در مجلس تصویب شد",
      excerpt: "تحلیل تاثیرات قانون جدید بر صنعت توکن‌سازی املاک و فرصت‌های پیش رو",
      author: "مریم احمدی",
      date: "۱ دی ۱۴۰۳",
      readTime: "۴ دقیقه",
      views: 890,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      icon: Newspaper,
      color: "amber"
    }
  ];

  return (
    <section id="insights" className="py-20 px-4 bg-gradient-to-bl from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            بینش‌های <span className="text-emerald-600">بازار املاک</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            آخرین تحلیل‌ها، آموزش‌ها و اخبار بازار املاک و توکن‌سازی
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <Tabs defaultValue="all" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-2xl shadow-lg">
              <TabsTrigger value="all" className="rounded-xl">همه</TabsTrigger>
              <TabsTrigger value="analysis" className="rounded-xl">تحلیل</TabsTrigger>
              <TabsTrigger value="education" className="rounded-xl">آموزش</TabsTrigger>
              <TabsTrigger value="news" className="rounded-xl">اخبار</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Insights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {insights.map((insight) => (
            <Card key={insight.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-white">
              <div className="relative overflow-hidden">
                <img 
                  src={insight.image} 
                  alt={insight.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute top-4 right-4">
                  <Badge className={`${
                    insight.color === 'emerald' ? 'bg-emerald-500' :
                    insight.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
                  } text-white shadow-lg`}>
                    {insight.category}
                  </Badge>
                </div>

                <div className={`absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center ${
                  insight.color === 'emerald' ? 'text-emerald-600' :
                  insight.color === 'blue' ? 'text-blue-600' : 'text-amber-600'
                }`}>
                  <insight.icon className="w-5 h-5" />
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-3 line-clamp-2 leading-tight">
                  {insight.title}
                </h3>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {insight.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{insight.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{insight.views}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{insight.date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    نویسنده: {insight.author}
                  </div>
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                    ادامه مطالب
                    <ArrowRight className="w-4 h-4 mr-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <Card className="bg-gradient-to-l from-emerald-600 to-teal-700 text-white border-0 shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                از آخرین تحلیل‌ها باخبر شوید
              </h3>
              <p className="text-emerald-100 mb-8 text-lg">
                هفته‌نامه تحلیل بازار املاک و فرصت‌های سرمایه‌گذاری را مستقیم در ایمیل خود دریافت کنید
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="آدرس ایمیل شما"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-emerald-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-xl">
                  عضویت
                </Button>
              </div>
              
              <p className="text-xs text-emerald-200 mt-4">
                با عضویت، شرایط و قوانین را می‌پذیرید. لغو عضویت در هر زمان امکان‌پذیر است.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button size="lg" variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
            مشاهده همه مقالات
            <BookOpen className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}