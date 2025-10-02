import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  Building2, 
  Coins, 
  TrendingUp, 
  User,
  LayoutDashboard,
  Search,
  PieChart,
  Briefcase,
  ShoppingCart,
  Heart,
  Users,
  Wallet,
  Award,
  Share2,
  Calendar,
  Settings,
  Target
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { User as UserEntity } from "@/entities/User";
import FloatingCalculator from "@/components/ui/FloatingCalculator";
import SmartBackButton from "@/components/ui/SmartBackButton";
import HelpTooltips from "@/components/ui/HelpTooltips";
import VoiceAssistant from "@/components/ui/VoiceAssistant";
const HELP_ENABLED = false;

const navigationItems = [
  {
    title: "نمای کلی",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "کاوش",
    url: createPageUrl("Explore"),
    icon: Search,
  },
  {
    title: "تمام پروژه‌ها",
    url: createPageUrl("Properties"),
    icon: Building2,
  },
  {
    title: "صندوق‌های ملکی",
    url: createPageUrl("TREFs"),
    icon: PieChart,
  },
  {
    title: "شبیه‌ساز پورتفولیو",
    url: createPageUrl("PortfolioSimulator"),
    icon: Target,
  },
  {
    title: "پورتفوی من",
    url: createPageUrl("Portfolio"),
    icon: Briefcase,
  },
  {
    title: "بازار ثانویه",
    url: createPageUrl("SecondaryMarket"),
    icon: ShoppingCart,
  },
  {
    title: "لیست علاقه‌مندی‌ها",
    url: createPageUrl("Watchlist"),
    icon: Heart,
  },
  {
    title: "پورتال مالک",
    url: createPageUrl("OwnerPortal"),
    icon: Users,
  },
  {
    title: "کیف پول",
    url: createPageUrl("Wallet"),
    icon: Wallet,
  },
  {
    title: "برنامه وفاداری",
    url: createPageUrl("Loyalty"),
    icon: Award,
  },
  {
    title: "سیستم ارجاع",
    url: createPageUrl("Referral"),
    icon: Share2,
  },
  {
    title: "رویدادها و تقویم",
    url: createPageUrl("Events"),
    icon: Calendar,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await UserEntity.me();
      setUser(userData);
    } catch (error) {
      console.error("User not authenticated");
    }
  };

  // Show minimal layout for Home page
  if (location.pathname === createPageUrl("Home") || location.pathname === "/") {
    return (
      <div dir="rtl" className="font-sans">
        <style>
          {`
            :root {
              --primary: 16 185 129;
              --primary-foreground: 255 255 255;
              --secondary: 217 119 6;
              --secondary-foreground: 0 0 0;
              --accent: 236 254 255;
              --accent-foreground: 15 23 42;
              --muted: 248 250 252;
              --muted-foreground: 100 116 139;
              --emerald: 16 185 129;
              --gold: 217 119 6;
            }
            
            .font-sans {
              font-family: 'Inter', 'Segoe UI', 'Tahoma', sans-serif;
            }

            /* Micro-animations for buttons */
            button:hover {
              transition: all 0.2s ease-in-out;
              transform: translateY(-1px);
            }

            button:active {
              transform: translateY(0px);
            }

            /* Smooth hover effects for cards */
            .hover\\:shadow-2xl {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Custom scrollbar */
            ::-webkit-scrollbar {
              width: 6px;
            }

            ::-webkit-scrollbar-track {
              background: #f1f5f9;
            }

            ::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 3px;
            }

            ::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }

            /* Gradient animations */
            .animate-gradient {
              background-size: 300% 300%;
              animation: gradientShift 3s ease infinite;
            }

            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }

            /* Context menu animations */
            .context-menu {
              animation: contextMenuAppear 0.15s ease-out;
            }

            @keyframes contextMenuAppear {
              from {
                opacity: 0;
                transform: scale(0.8) translateY(-10px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            /* Drag and drop highlight */
            .drag-over {
              background: linear-gradient(45deg, #10b981, #059669) !important;
              transform: scale(1.05);
              transition: all 0.2s ease-in-out;
            }

            /* Tooltip styles */
            [data-help] {
              position: relative;
              cursor: help;
            }

            [data-help]:hover::after {
              content: attr(data-help);
              position: absolute;
              bottom: 100%;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 8px 12px;
              border-radius: 4px;
              font-size: 12px;
              white-space: nowrap;
              z-index: 1000;
              opacity: 0;
              animation: tooltipFadeIn 0.3s ease forwards;
            }

            @keyframes tooltipFadeIn {
              from { opacity: 0; transform: translateX(-50%) translateY(5px); }
              to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}
        </style>
        {children}
      </div>
    );
  }

  return (
    <div dir="rtl" className="font-sans">
      <style>
        {`
          :root {
            --primary: 16 185 129;
            --primary-foreground: 255 255 255;
            --secondary: 217 119 6;
            --secondary-foreground: 0 0 0;
            --accent: 236 254 255;
            --accent-foreground: 15 23 42;
            --muted: 248 250 252;
            --muted-foreground: 100 116 139;
            --emerald: 16 185 129;
            --gold: 217 119 6;
          }
          
          .font-sans {
            font-family: 'Inter', 'Segoe UI', 'Tahoma', sans-serif;
          }

          .text-glow-white {
            text-shadow: 0 1px 1px rgba(0,0,0,0.25);
          }

          .text-glow-emerald {
            text-shadow: 0 1px 1px rgba(16,185,129,0.25);
          }

          /* Micro-animations for buttons */
          button:hover {
            transition: all 0.2s ease-in-out;
            transform: translateY(-1px);
          }

          button:active {
            transform: translateY(0px);
          }

          /* Smooth hover effects for cards */
          .hover\\:shadow-2xl {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f5f9;
          }

          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          /* Gradient animations */
          .animate-gradient {
            background-size: 300% 300%;
            animation: gradientShift 3s ease infinite;
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Context menu animations */
          .context-menu {
            animation: contextMenuAppear 0.15s ease-out;
          }

          @keyframes contextMenuAppear {
            from {
              opacity: 0;
              transform: scale(0.8) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          /* Drag and drop highlight */
          .drag-over {
            background: linear-gradient(45deg, #10b981, #059669) !important;
            transform: scale(1.05);
            transition: all 0.2s ease-in-out;
          }

          /* Tooltip styles */
          [data-help] {
            position: relative;
            cursor: help;
          }

          [data-help]:hover::after {
            content: attr(data-help);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            opacity: 0;
            animation: tooltipFadeIn 0.3s ease forwards;
          }

          @keyframes tooltipFadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(5px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}
      </style>
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-bl from-slate-50 to-emerald-50">
          <Sidebar className="border-l border-slate-200 shadow-lg">
            <SidebarHeader className="border-b border-slate-200 p-6 bg-white">
              <Link to={"/"} className="flex items-center gap-3">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">MelkChain</h2>
                  <p className="text-[12px] text-slate-500">اکوسیستم توکن‌سازی املاک</p>
                </div>
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </Link>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 rounded-xl mb-1 p-3 ${
                            location.pathname === item.url 
                              ? 'bg-gradient-to-l from-emerald-600 to-emerald-700 text-white shadow-md' 
                              : 'text-slate-700'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3" data-help={`رفتن به ${item.title}`}>
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium tracking-tight">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider px-3 py-2">
                  آمار سریع
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-2 space-y-3">
                    <div className="flex items-center justify-between text-sm bg-gradient-to-l from-emerald-50 to-green-50 p-3 rounded-lg" data-help="ارزش کل دارایی‌های شما">
                      <span className="text-slate-700">پورتفوی فعلی</span>
                      <span className="font-bold text-emerald-700">
                        {user?.demo_mode ? '۱ میلیارد تومان' : '۰ تومان'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm bg-gradient-to-l from-amber-50 to-yellow-50 p-3 rounded-lg" data-help="تعداد املاک در لیست علاقه‌مندی‌های شما">
                      <span className="text-slate-700">املاک علاقه‌مندی</span>
                      <span className="font-bold text-amber-700">۰</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-200 p-4 bg-slate-50">
              <Link to={createPageUrl("Settings")} className="flex items-center gap-3 hover:bg-slate-100 p-2 rounded-lg transition-colors" data-help="تنظیمات حساب کاربری">
                <div className="w-10 h-10 bg-gradient-to-bl from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">
                    {user?.full_name || 'کاربر'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.role === 'admin' ? 'مدیر سیستم' : 'سرمایه‌گذار'}
                    {user?.demo_mode && ' (دمو)'}
                  </p>
                </div>
                <Settings className="w-4 h-4 text-slate-400" />
              </Link>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 md:hidden shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                <h1 className="text-xl font-bold text-slate-800 text-glow-white">MelkChain</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>

        {/* قابلیت‌های شناور */}
        <FloatingCalculator />
        <SmartBackButton />
        <VoiceAssistant />
        {HELP_ENABLED && <HelpTooltips />}
      </SidebarProvider>
    </div>
  );
}