import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Dot } from 'lucide-react';

const steps = [
  { name: 'ثبت‌نام و احراز هویت', key: 'signup' },
  { name: 'کاوش و انتخاب پروژه', key: 'explore' },
  { name: 'اولین سرمایه‌گذاری', key: 'invest' },
  { name: 'تشکیل پورتفولیو', key: 'portfolio' },
];

export default function InvestmentJourneyWidget({ completedSteps = [] }) {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle>مسیر سرمایه‌گذاری شما</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.key);
            const isCurrent = !isCompleted && (index === 0 || completedSteps.includes(steps[index - 1].key));

            return (
              <li key={step.key} className="flex items-center gap-3">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                ) : isCurrent ? (
                  <div className="relative flex items-center justify-center">
                    <Circle className="w-6 h-6 text-blue-500 animate-pulse" />
                    <Dot className="w-4 h-4 absolute text-blue-500" />
                  </div>
                ) : (
                  <Circle className="w-6 h-6 text-slate-300" />
                )}
                <span className={`font-medium ${isCompleted ? 'text-slate-500 line-through' : isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.name}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}