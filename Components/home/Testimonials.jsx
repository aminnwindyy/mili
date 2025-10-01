import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "احمد رضایی",
      role: "سرمایه‌گذار",
      content: "با توکن‌ملک توانستم با مبلغ کمی در یکی از بهترین املاک تهران سرمایه‌گذاری کنم. بازدهی عالی و امنیت بالا.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "مریم احمدی",
      role: "کارآفرین",
      content: "پلتفرم فوق‌العاده‌ای است. رابط کاربری ساده و عملکرد سریع. توصیه می‌کنم به همه دوستان.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b353?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "علی محمدی",
      role: "مالک ملک", 
      content: "ملک خود را از طریق توکن‌ملک به فروش رساندم. فرآیند ساده و سود بیشتری نسبت به روش‌های سنتی کسب کردم.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            نظر <span className="text-blue-600">کاربران</span> ما
          </h2>
          <p className="text-xl text-slate-600">
            تجربه واقعی افرادی که در توکن‌ملک سرمایه‌گذاری کرده‌اند
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Quote className="w-12 h-12 text-blue-200 mx-auto mb-4" />
                  <p className="text-slate-700 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {testimonial.role}
                    </div>
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