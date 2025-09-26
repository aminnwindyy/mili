import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';

export default function HelpTooltips() {
  const [hoveredElement, setHoveredElement] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoverTimer, setHoverTimer] = useState(null);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const element = e.target.closest('[data-help]');
      if (element) {
        const helpText = element.getAttribute('data-help');
        if (helpText && helpText !== hoveredElement?.text) {
          if (hoverTimer) clearTimeout(hoverTimer);
          
          const timer = setTimeout(() => {
            const rect = element.getBoundingClientRect();
            setTooltipPosition({
              x: rect.left + rect.width / 2,
              y: rect.top - 10
            });
            setHoveredElement({
              element,
              text: helpText
            });
            setShowTooltip(true);
          }, 1500); // Show after 1.5 seconds
          
          setHoverTimer(timer);
        }
      }
    };

    const handleMouseOut = (e) => {
      const element = e.target.closest('[data-help]');
      if (element && element === hoveredElement?.element) {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          setHoverTimer(null);
        }
        
        setTimeout(() => {
          setShowTooltip(false);
          setHoveredElement(null);
        }, 500);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (hoverTimer) clearTimeout(hoverTimer);
    };
  }, [hoveredElement, hoverTimer]);

  if (!showTooltip || !hoveredElement) return null;

  return (
    <div 
      className="fixed z-[100] pointer-events-none"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: 'translateX(-50%) translateY(-100%)'
      }}
    >
      <Card className="bg-slate-800 text-white border-0 shadow-2xl max-w-xs pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm">{hoveredElement.text}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-700"
              onClick={() => setShowTooltip(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
        
        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>
      </Card>
    </div>
  );
}