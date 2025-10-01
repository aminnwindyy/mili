import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef(null);
  const threshold = 70;

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isPulling || window.scrollY > 0) return;

    currentY.current = e.touches[0].clientY;
    const pullDistance = Math.max(0, currentY.current - startY.current);
    
    if (pullDistance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(pullDistance * 0.5, 100));
    }
  }, [isPulling]);

  const handleTouchEnd = useCallback(async () => {
    setIsPulling(false);
    
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white flex items-center justify-center transition-all duration-300 overflow-hidden"
        style={{
          height: `${pullDistance}px`,
          transform: `translateY(-${Math.max(0, pullDistance - 20)}px)`
        }}
      >
        <div className="flex items-center gap-2">
          <RefreshCw className={`w-5 h-5 ${isRefreshing || pullDistance > threshold ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">
            {isRefreshing ? 'در حال بروزرسانی...' : pullDistance > threshold ? 'رها کنید' : 'برای بروزرسانی بکشید'}
          </span>
        </div>
      </div>
      
      {children}
    </div>
  );
}