import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X, Plus, Minus, Zap } from 'lucide-react';
import { useDragDropCart } from './DragDropProvider';

export default function InvestmentCart() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartItem,
    playSound,
    vibrateDevice
  } = useDragDropCart();

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.investment_amount * item.quantity), 0);

  const handleInvest = async () => {
    // Simulate investment process
    playSound('success');
    vibrateDevice([200, 100, 200]);
    
    // Here you would make actual investment API calls
    alert(`سرمایه‌گذاری ${cartItems.length} پروژه با مبلغ کل ${(totalAmount / 1000000).toFixed(1)} میلیون ریال با موفقیت انجام شد!`);
    
    // Clear cart after successful investment
    cartItems.forEach(item => removeFromCart(item.id));
    setIsCartOpen(false);
  };

  if (!isCartOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="bg-gradient-to-l from-emerald-600 to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          سبد سرمایه‌گذاری
          {cartItems.length > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-96 z-50">
      <Card className="shadow-2xl border-2 border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            سبد سرمایه‌گذاری
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(false)}
            className="hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>سبد شما خالی است</p>
              <p className="text-sm">پروژه‌ها را اضافه کنید</p>
            </div>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm truncate flex-1">{item.title}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateCartItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                          className="h-6 w-6"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-medium text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateCartItem(item.id, { quantity: item.quantity + 1 })}
                          className="h-6 w-6"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <Input
                          type="number"
                          value={item.investment_amount}
                          onChange={(e) => updateCartItem(item.id, { investment_amount: parseInt(e.target.value) || 0 })}
                          className="h-8 w-24 text-xs"
                          placeholder="مبلغ"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          {((item.investment_amount * item.quantity) / 1000000).toFixed(1)}م ریال
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">مجموع:</span>
                  <span className="font-bold text-lg text-emerald-600">
                    {(totalAmount / 1000000).toFixed(1)} میلیون ریال
                  </span>
                </div>
                <Button
                  onClick={handleInvest}
                  className="w-full bg-gradient-to-l from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 animate-pulse hover:animate-none"
                  size="lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  سرمایه‌گذاری فوری
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}