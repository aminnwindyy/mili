import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Users, 
  ArrowRight,
  GitCompare,
  Star,
  PieChart
} from "lucide-react";

export default function ProjectsShowcase() {
  const [selectedTab, setSelectedTab] = useState("ready");

  const projects = {
    ready: [
      {
        id: 1,
        title: "برج لوکس سعادت‌آباد",
        location: "تهران، سعادت‌آباد",
        type: "آپارتمان",
        totalValue: "۱۵ میلیارد ریال",
        tokenPrice: "۵۰ میلیون ریال",
        expectedYield: "۱۸.۵%",
        progress: 75,
        investors: 142,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=240&fit=crop",
        status: "فعال",
        compareEnabled: true
      },
      {
        id: 2,
        title: "مجتمع تجاری پاسداران",
        location: "تهران، پاسداران",
        type: "تجاری",
        totalValue: "۲۵ میلیارد ریال",
        tokenPrice: "۱۰۰ میلیون ریال",
        expectedYield: "۲۲.۳%",
        progress: 60,
        investors: 89,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=240&fit=crop",
        status: "فعال",
        compareEnabled: true
      }
    ],
    presale: [
      {
        id: 3,
        title: "پروژه ویلایی کرج",
        location: "کرج، شهرک غرب",
        type: "خانه",
        totalValue: "۱۰ میلیارد ریال",
        tokenPrice: "۲۵ میلیون ریال",
        expectedYield: "۱۶.۸%",
        progress: 25,
        investors: 45,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=240&fit=crop",
        status: "پیش‌فروش",
        compareEnabled: true,
        launchDate: "۱۵ دی ۱۴۰۳"
      }
    ],
    funds: [
      {
        id: 4,
        title: "صندوق املاک مسکونی تهران",
        location: "تهران، مناطق ۱-۵",
        type: "صندوق ملکی",
        totalValue: "۵۰ میلیارد ریال",
        tokenPrice: "۱ میلیون ریال",
        expectedYield: "۱۵.۲%",
        progress: 80,
        investors: 320,
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=240&fit=crop",
        status: "فعال",
        compareEnabled: false,
        properties: 15
      }
    ]
  };

  const currentProjects = projects[selectedTab] || [];

  return (
    <section className="py-20 px-4 bg-gradient-to-bl from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            فرصت‌های <span className="text-emerald-600">سرمایه‌گذاری</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            از املاک آماده تا پروژه‌های پیش‌خرید و صندوق‌های ملکی متنوع
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-slate-100 p-1 rounded-2xl">
            <TabsTrigger value="ready" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              آماده سکونت
            </TabsTrigger>
            <TabsTrigger value="presale" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              پیش‌خرید
            </TabsTrigger>
            <TabsTrigger value="funds" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              صندوق‌های ملکی
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={`${
                    project.status === 'فعال' ? 'bg-emerald-500' : 
                    project.status === 'پیش‌فروش' ? 'bg-amber-500' : 'bg-blue-500'
                  } text-white shadow-lg`}>
                    {project.status}
                  </Badge>
                </div>

                {/* Compare Icon */}
                {project.compareEnabled && (
                  <div className="absolute top-4 left-4">
                    <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/80 hover:bg-white">
                      <GitCompare className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm p-3">
                  <div className="flex justify-between items-center text-white text-sm mb-1">
                    <span>پیشرفت فروش</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-emerald-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                    {project.title}
                  </h3>
                  {selectedTab === 'funds' && (
                    <PieChart className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-1 text-slate-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm truncate">{project.location}</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">ارزش کل:</span>
                    <span className="font-semibold text-slate-900">{project.totalValue}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      {selectedTab === 'funds' ? 'قیمت واحد:' : 'قیمت توکن:'}
                    </span>
                    <span className="font-semibold text-emerald-600">{project.tokenPrice}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">بازدهی مورد انتظار:</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {project.expectedYield}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      {selectedTab === 'funds' ? 'تعداد املاک:' : 'سرمایه‌گذاران:'}
                    </span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedTab === 'funds' ? project.properties : project.investors}
                    </span>
                  </div>

                  {project.launchDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">تاریخ عرضه:</span>
                      <span className="font-semibold text-amber-600 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {project.launchDate}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-l from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                    {project.status === 'پیش‌فروش' ? 'رزرو کنید' : 'سرمایه‌گذاری'}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
            مشاهده همه پروژه‌ها
            <ArrowRight className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}