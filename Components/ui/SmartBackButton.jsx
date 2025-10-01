import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SmartBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lastImportantAction, setLastImportantAction] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Track important actions
    const trackAction = (action) => {
      setLastImportantAction({
        action,
        path: location.pathname,
        timestamp: Date.now()
      });
    };

    // Listen for important events
    window.addEventListener('propertyViewed', () => trackAction('مشاهده ملک'));
    window.addEventListener('investmentStarted', () => trackAction('شروع سرمایه‌گذاری'));
    window.addEventListener('filterApplied', () => trackAction('اعمال فیلتر'));

    // Show button if we have a previous action and we're not on home page
    setShowButton(lastImportantAction && location.pathname !== createPageUrl("Home"));

    return () => {
      window.removeEventListener('propertyViewed', () => {});
      window.removeEventListener('investmentStarted', () => {});
      window.removeEventListener('filterApplied', () => {});
    };
  }, [location, lastImportantAction]);

  const handleSmartBack = () => {
    if (lastImportantAction) {
      navigate(lastImportantAction.path);
    } else {
      navigate(-1);
    }
  };

  if (!showButton) return null;

  return (
    <Button
      onClick={handleSmartBack}
      className="fixed bottom-36 left-4 z-50 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      size="sm"
    >
      <ArrowRight className="w-4 h-4 mr-2" />
      {lastImportantAction ? `برگرد به ${lastImportantAction.action}` : 'برگشت'}
    </Button>
  );
}