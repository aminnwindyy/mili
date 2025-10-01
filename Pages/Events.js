import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Mic, Building2, Megaphone } from 'lucide-react';

export default function Events() {
  const events = [
    { title: 'وبینار: تحلیل بازار مسکن در زمستان ۱۴۰۳', type: 'webinar', date: '۱۵ دی ۱۴۰۳', icon: Mic },
    { title: 'عرضه اولیه پروژه لوکس فرمانیه', type: 'new_listing', date: '۲۰ دی ۱۴۰۳', icon: Building2 },
    { title: 'جلسه پرسش و پاسخ با مدیران MelkChain', type: 'announcement', date: '۲۵ دی ۱۴۰۳', icon: Megaphone }
  ];

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-cyan-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">رویدادها و تقویم</h1>
          <p className="text-slate-600">از آخرین رویدادها و وبینارهای ما باخبر شوید</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              رویدادهای پیش رو
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {events.map((event, index) => (
                <li key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-cyan-100 p-3 rounded-full">
                      <event.icon className="w-5 h-5 text-cyan-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-slate-500">{event.date}</p>
                    </div>
                  </div>
                  <Button variant="outline">ثبت نام</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}