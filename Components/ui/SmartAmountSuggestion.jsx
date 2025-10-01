import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Clock, Zap } from 'lucide-react';
import { formatCurrency, suggestInvestmentAmount, tomanToRial } from './formatters';

export default function SmartAmountSuggestion({ 
  property, 
  userHistory, 
  onAmountSelect,
  currentAmount 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const generateSuggestions = useCallback(() => {
    if (!property) return;
    
    const baseAmount = suggestInvestmentAmount(userHistory, property.token_price);
    
    const suggestions = [
      {
        id: 'conservative',
        label: 'محتاطانه',
        amount: Math.max(property.token_price * 0.5, baseAmount * 0.5),
        reason: 'ریسک کم، شروع آرام',
        icon: '🛡️',
        color: 'bg-blue-100 text-blue-700'
      },
      {
        id: 'smart',
        label: 'هوشمند',
        amount: baseAmount,
        reason: userHistory?.length > 0 
          ? `بر اساس سابقه شما (معمولاً ${formatCurrency(baseAmount)} سرمایه‌گذاری می‌کنید)`
          : 'پیشنهاد سیستم برای شما',
        icon: '🧠',
        color: 'bg-emerald-100 text-emerald-700',
        recommended: true
      },
      {
        id: 'aggressive',
        label: 'پرریسک',
        amount: baseAmount * 1.8,
        reason: 'بازدهی بالاتر، ریسک بیشتر',
        icon: '🚀',
        color: 'bg-purple-100 text-purple-700'
      }
    ];

    setSuggestions(suggestions);
  }, [property, userHistory]);

  useEffect(() => {
    generateSuggestions();
  }, [generateSuggestions]);

  const handleSuggestionSelect = (suggestion) => {
    setSelectedSuggestion(suggestion.id);
    onAmountSelect(suggestion.amount);
  };

  const handleCustomAmountSubmit = () => {
    const amount = parseFloat(customAmount) * 10000; // تبدیل تومان به ریال
    if (amount > 0) {
      onAmountSelect(amount);
      setSelectedSuggestion('custom');
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-slate-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-lg">پیشنهاد هوشمند مبلغ</h3>
        </div>

        {/* پیشنهادات از پیش تعریف شده */}
        <div className="space-y-3 mb-6">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedSuggestion === suggestion.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{suggestion.label}</span>
                      {suggestion.recommended && (
                        <Badge className="bg-emerald-500 text-white text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          پیشنهادی
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{suggestion.reason}</p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg text-slate-900">
                    {formatCurrency(suggestion.amount)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {Math.floor(suggestion.amount / property.token_price)} توکن
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* مبلغ دلخواه */}
        <div className="border-t pt-4">
          <Label className="text-sm font-medium mb-2 block">یا مبلغ دلخواه (تومان)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="مثلاً 5000000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCustomAmountSubmit} variant="outline">
              انتخاب
            </Button>
          </div>
        </div>

        {/* نمایش تحلیل سرمایه‌گذاری */}
        {currentAmount > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-l from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-2">تحلیل سرمایه‌گذاری شما</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">تعداد توکن:</span>
                <span className="font-semibold mr-2">{Math.floor(currentAmount / property.token_price)}</span>
              </div>
              <div>
                <span className="text-slate-600">بازدهی سالانه:</span>
                <span className="font-semibold mr-2 text-emerald-600">
                  {formatCurrency((currentAmount * (property.expected_annual_return || 15)) / 100)}
                </span>
              </div>
              <div>
                <span className="text-slate-600">درصد از کل:</span>
                <span className="font-semibold mr-2">
                  {((currentAmount / property.total_value) * 100).toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-slate-600">بازدهی ماهانه:</span>
                <span className="font-semibold mr-2 text-emerald-600">
                  {formatCurrency((currentAmount * (property.expected_annual_return || 15)) / 1200)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}