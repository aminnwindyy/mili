import React, { useState } from 'react';
import { Calculator, X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FloatingCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    return (numValue * 10).toLocaleString('fa-IR') + ' ریال';
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
        size="icon"
      >
        <Calculator className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 left-4 z-50 w-80 shadow-2xl border-0 bg-white/95 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">ماشین حساب</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-slate-100 rounded-lg p-3">
          <div className="text-right text-2xl font-mono">{display}</div>
          <div className="text-right text-sm text-slate-600 mt-1">
            {formatCurrency(display)}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" onClick={clear} className="col-span-2">پاک کردن</Button>
          <Button variant="outline" onClick={() => inputOperation('÷')}>÷</Button>
          <Button variant="outline" onClick={() => inputOperation('×')}>×</Button>
          
          <Button variant="outline" onClick={() => inputNumber(7)}>۷</Button>
          <Button variant="outline" onClick={() => inputNumber(8)}>۸</Button>
          <Button variant="outline" onClick={() => inputNumber(9)}>۹</Button>
          <Button variant="outline" onClick={() => inputOperation('-')}>-</Button>
          
          <Button variant="outline" onClick={() => inputNumber(4)}>۴</Button>
          <Button variant="outline" onClick={() => inputNumber(5)}>۵</Button>
          <Button variant="outline" onClick={() => inputNumber(6)}>۶</Button>
          <Button variant="outline" onClick={() => inputOperation('+')} className="row-span-2">+</Button>
          
          <Button variant="outline" onClick={() => inputNumber(1)}>۱</Button>
          <Button variant="outline" onClick={() => inputNumber(2)}>۲</Button>
          <Button variant="outline" onClick={() => inputNumber(3)}>۳</Button>
          
          <Button variant="outline" onClick={() => inputNumber(0)} className="col-span-2">۰</Button>
          <Button variant="outline" onClick={() => setDisplay(display + '.')}>.</Button>
          <Button 
            onClick={performCalculation}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
          >
            =
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}