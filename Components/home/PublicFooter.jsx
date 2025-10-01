import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Building2, Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-bl from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">MelkChain</h3>
                <p className="text-xs text-slate-400">اکوسیستم توکن‌سازی املاک</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              پلتفرم پیشرو در توکن‌سازی املاک و سرمایه‌گذاری دیجیتال در ایران با استفاده از فناوری‌های نوین
            </p>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                <Twitter className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-bold mb-4 text-emerald-400">خدمات</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to={createPageUrl("Properties")} className="hover:text-emerald-400 transition-colors">توکن‌سازی املاک</Link></li>
              <li><Link to={createPageUrl("TREFs")} className="hover:text-emerald-400 transition-colors">صندوق‌های ملکی</Link></li>
              <li><Link to={createPageUrl("PortfolioSimulator")} className="hover:text-emerald-400 transition-colors">شبیه‌ساز پورتفولیو</Link></li>
              <li><Link to={createPageUrl("SecondaryMarket")} className="hover:text-emerald-400 transition-colors">بازار ثانویه</Link></li>
              <li><Link to={createPageUrl("Loyalty")} className="hover:text-emerald-400 transition-colors">برنامه وفاداری</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-emerald-400">پشتیبانی</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">راهنمای کاربری</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">سوالات متداول</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">تماس با ما</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">امنیت و حریم خصوصی</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">قوانین و مقررات</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-emerald-400">ارتباط با ما</h4>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>۰۲۱-۸۸۸۸۸۸۸۸</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>info@melkchain.ir</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-1" />
                <span>تهران، میرداماد، خیابان نلسون ماندلا، برج میلاد نور، طبقه ۱۵</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              <p>&copy; ۱۴۰۳ MelkChain. تمامی حقوق محفوظ است.</p>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">حریم خصوصی</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">شرایط استفاده</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">کوکی‌ها</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}