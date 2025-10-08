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

import Hero3D from "@/components/home/Hero3D";
import FeatureCard from "@/components/home/FeatureCard";
import StatsSection from "@/components/home/StatsSection";
import EcosystemFlow from "@/components/home/EcosystemFlow";
import AdvancedFeatures from "@/components/home/AdvancedFeatures";
import ProjectsShowcase from "@/components/home/ProjectsShowcase";
import MarketInsights from "@/components/home/MarketInsights";
import PublicHeader from "@/components/home/PublicHeader";
import PublicFooter from "@/components/home/PublicFooter";
import GuestModeButton from "@/components/ui/GuestModeButton"; // Added GuestModeButton
import QuestWidget from "@/components/ui/QuestWidget";
import GamificationWidget from "@/components/ui/GamificationWidget";

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
            <div className="space-y-8 flex flex-col items-start lg:items-start">
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
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px', 
                width: '100%', 
                maxWidth: '320px'
              }}>
                <button 
                  onClick={() => handleGetStarted()}
                  style={{
                    width: '100%',
                    height: '50px',
                    padding: '0 16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    background: 'linear-gradient(to right, #059669, #047857)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #047857, #065f46)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #059669, #047857)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  شروع سرمایه‌گذاری
                  <ArrowUpLeft style={{ width: '18px', height: '18px' }} />
                </button>
                
                <div style={{ width: '100%' }}>
                  <GuestModeButton />
                </div>
              </div>

              {/* کوتاه‌ترین مسیر ثبت‌نام */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                maxWidth: '320px',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '8px'
                }}>
                  <Zap style={{ width: '16px', height: '16px', color: '#059669' }} />
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#374151' 
                  }}>
                    ثبت‌نام فوری
                  </span>
                </div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  margin: 0 
                }}>
                  موبایل → کد → شروع! ⏱️
                </p>
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

      {/* Quest Widget Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              ماموریت‌های <span className="text-blue-600">امروز</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              با کامل کردن کوئست‌ها، امتیاز بگیرید و سطح خود را بالا ببرید!
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <QuestWidget compact={false} />
          </div>
        </div>
      </section>

      {/* Gamification Widget Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              پروفایل <span className="text-emerald-600">گیمیفیکیشن</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              سطح خود را بالا ببرید، در مسابقات شرکت کنید و جوایز ویژه برنده شوید!
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <GamificationWidget userId="demo_user" />
          </div>
        </div>
      </section>

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
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '320px',
            margin: '0 auto',
            padding: '0 16px'
          }}>
            <Link to={createPageUrl("Properties")} style={{ width: '100%', textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                height: '56px',
                fontSize: '18px',
                fontWeight: '600',
                padding: '0 24px',
                borderRadius: '16px',
                background: 'white',
                color: '#047857',
                border: 'none',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 20px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              >
                <Eye style={{ width: '20px', height: '20px' }} />
                شروع سرمایه‌گذاری
              </button>
            </Link>
            
            <Link to={createPageUrl("OwnerPortal")} style={{ width: '100%', textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                height: '56px',
                fontSize: '18px',
                fontWeight: '600',
                padding: '0 24px',
                borderRadius: '16px',
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'white';
              }}
              >
                <Plus style={{ width: '20px', height: '20px' }} />
                ثبت ملک برای توکن‌سازی
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}