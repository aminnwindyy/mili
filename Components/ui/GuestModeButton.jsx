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
        className="w-full h-14 text-lg font-medium bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 hover:border-amber-400 hover:bg-gradient-to-r hover:from-amber-100 hover:to-yellow-100 text-amber-800 transition-all duration-300 rounded-xl"
      >
        <Eye className="w-5 h-5 mr-2" />
        تست بدون ثبت‌نام
        <Zap className="w-4 h-4 mr-2 text-amber-600" />
      </Button>
    </Link>
  );
}