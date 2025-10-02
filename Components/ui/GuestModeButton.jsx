import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Zap } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function GuestModeButton() {
  const handleGuestMode = () => {
    // فعال‌سازی حالت مهمان با دیتای دمو
    localStorage.setItem('guest-mode', 'true');
    localStorage.setItem('demo-data', JSON.stringify({
      wallet_balance_rial: 10000000000, // 1 میلیارد ریال = 100 میلیون تومان
      properties_viewed: [],
      last_visit: new Date().toISOString()
    }));
  };

  return (
    <Link to={createPageUrl("Dashboard")}>
      <Button
        onClick={handleGuestMode}
        variant="outline"
        className="w-full h-12 sm:h-14 text-sm sm:text-lg bg-gradient-to-l from-amber-50 to-yellow-50 border-2 border-amber-200 hover:border-amber-300 transition-all duration-300"
      >
        <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
        تست بدون ثبت‌نام
        <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" />
      </Button>
    </Link>
  );
}