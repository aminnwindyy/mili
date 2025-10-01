import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { createPageUrl } from "@/utils";
import { 
  Building2, 
  Coins, 
  Shield, 
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Globe,
  Zap,
  Award,
  Eye,
  Plus,
  PieChart,
  CreditCard,
  Gift,
  Search,
  BookOpen,
  BarChart3,
  Newspaper,
  GraduationCap,
  ChevronRight,
  Target,
  Wallet,
  RefreshCw,
  Phone, // Added Phone icon
  Key,   // Added Key icon
  ArrowUpLeft // Added ArrowUpLeft icon
} from "lucide-react";

import Hero3D from "../components/home/Hero3D";
import FeatureCard from "../components/home/FeatureCard";
import StatsSection from "../components/home/StatsSection";
import EcosystemFlow from "../components/home/EcosystemFlow";
import AdvancedFeatures from "../components/home/AdvancedFeatures";
import ProjectsShowcase from "../components/home/ProjectsShowcase";
import MarketInsights from "../components/home/MarketInsights";
import PublicHeader from "../components/home/PublicHeader";
import PublicFooter from "../components/home/PublicFooter";
import GuestModeButton from "../components/ui/GuestModeButton"; // Added GuestModeButton

export default function Home() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleGetStarted = () => {
    // Navigate to a registration or login page, or a general onboarding page
    navigate(createPageUrl("Dashboard"));
  };

  return (
    <div className="bg-gradient-to-bl from-slate-50 via-blue-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  سرمایه‌گذاری در 
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-blue-600"> املاک</span>
                  <br />
                  با تکنولوژی 
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-purple-600"> بلاک‌چین</span>
                </h1>
                <p className="text-xl text-slate-600 mt-6 leading-relaxed">
                  اولین پلتفرم توکن‌سازی املاک در ایران. 
                  از همین امروز با سرمایه کم وارد بازار املاک شوید.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <GuestModeButton />
                <Button 
                  onClick={() => handleGetStarted()}
                  className="h-14 px-8 text-lg bg-gradient-to-l from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  شروع سرمایه‌گذاری
                  <ArrowUpLeft className="mr-2 w-5 h-5" />
                </Button>
              </div>

              {/* کوتاه‌ترین مسیر ثبت‌نام */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>شماره موبایل</span>
                  </div>
                  <ArrowUpLeft className="w-4 h-4 text-emerald-600" />
                  <div className="flex items-center gap-1">
                    <Key className="w-4 h-4" />
                    <span>کد تایید</span>
                  </div>
                  <ArrowUpLeft className="w-4 h-4 text-emerald-600" />
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    <span>شروع!</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">ثبت‌نام در کمتر از 30 ثانیه ⏱️</p>
              </div>
            </div>

            <div className="relative min-h-[450px]">
              <Hero3D />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Showcase with New Filters */}
      <ProjectsShowcase />

      {/* Ecosystem Flow Section */}
      <EcosystemFlow />

      {/* Advanced Features Section */}
      <AdvancedFeatures />

      {/* Enhanced Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              چرا <span className="text-emerald-600">MelkChain</span>؟
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              پلتفرمی امن، شفاف و نوآورانه برای سرمایه‌گذاری در بازار املاک با فناوری بلاک‌چین
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="امنیت بلاک‌چینی"
              description="استفاده از فناوری بلاک‌چین برای تضمین امنیت و شفافیت کامل معاملات"
              gradient="from-emerald-500 to-teal-600"
            />
            <FeatureCard
              icon={PieChart}
              title="صندوق‌های ملکی"
              description="سرمایه‌گذاری در صندوق‌های متنوع با ریسک پایین و بازدهی پایدار"
              gradient="from-blue-500 to-indigo-600"
            />
            <FeatureCard
              icon={Target}
              title="شبیه‌ساز پورتفولیو"
              description="تست استراتژی‌های سرمایه‌گذاری قبل از سرمایه‌گذاری واقعی"
              gradient="from-purple-500 to-violet-600"
            />
            <FeatureCard
              icon={CreditCard}
              title="وام با وثیقه توکن"
              description="دریافت وام با استفاده از توکن‌های املاک به عنوان وثیقه"
              gradient="from-amber-500 to-orange-600"
            />
            <FeatureCard
              icon={RefreshCw}
              title="بازار ثانویه فعال"
              description="خرید و فروش آنی توکن‌ها با نقدینگی بالا"
              gradient="from-pink-500 to-rose-600"
            />
            <FeatureCard
              icon={Award}
              title="برنامه وفاداری"
              description="کسب امتیاز و دریافت مزایای ویژه با فعالیت در پلتفرم"
              gradient="from-cyan-500 to-teal-600"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Market Insights Section */}
      <MarketInsights />

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-l from-emerald-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            آماده ورود به آینده سرمایه‌گذاری هستید؟
          </h2>
          <p className="text-xl mb-12 opacity-90">
            به جمع بیش از ۱۰ هزار سرمایه‌گذار هوشمند بپیوندید
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to={createPageUrl("Properties")}>
              <Button size="lg" variant="secondary" className="text-xl px-10 py-6 rounded-2xl bg-white text-emerald-700 hover:bg-gray-100">
                <Eye className="w-6 h-6 mr-3" />
                شروع سرمایه‌گذاری
              </Button>
            </Link>
            <Link to={createPageUrl("OwnerPortal")}>
              <Button size="lg" variant="outline" className="text-xl px-10 py-6 rounded-2xl border-2 border-white text-white hover:bg-white/10">
                <Plus className="w-6 h-6 mr-3" />
                ثبت ملک برای توکن‌سازی
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}