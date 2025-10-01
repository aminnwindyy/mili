import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Heart, Share2, BarChart3, Star } from 'lucide-react';

export default function ContextMenu({ 
  x, 
  y, 
  isVisible, 
  onClose, 
  property,
  onViewDetails,
  onAddToWatchlist,
  onShare,
  onCompare,
  onRate
}) {
  if (!isVisible) return null;

  const handleAction = (action) => {
    action(property);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50"
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <Card 
        className="fixed z-50 context-menu shadow-2xl border-0 min-w-[200px]"
        style={{
          left: Math.min(x, window.innerWidth - 220),
          top: Math.min(y, window.innerHeight - 300)
        }}
      >
        <CardContent className="p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9"
              onClick={() => handleAction(onViewDetails)}
            >
              <Eye className="w-4 h-4 mr-3" />
              مشاهده جزئیات
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9"
              onClick={() => handleAction(onAddToWatchlist)}
            >
              <Heart className="w-4 h-4 mr-3" />
              افزودن به علاقه‌مندی‌ها
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9"
              onClick={() => handleAction(onShare)}
            >
              <Share2 className="w-4 h-4 mr-3" />
              اشتراک‌گذاری
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9"
              onClick={() => handleAction(onCompare)}
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              مقایسه با سایر املاک
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9"
              onClick={() => handleAction(onRate)}
            >
              <Star className="w-4 h-4 mr-3" />
              رتبه‌دهی و نظر
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}