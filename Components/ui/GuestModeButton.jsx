import React from 'react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Eye, Zap } from 'lucide-react';

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
    <Link to={createPageUrl("Dashboard")} style={{ textDecoration: 'none' }}>
      <button
        onClick={handleGuestMode}
        style={{
          width: '100%',
          height: '50px',
          padding: '0 16px',
          fontSize: '16px',
          fontWeight: '500',
          background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          color: '#92400e',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'linear-gradient(to right, #fde68a, #fcd34d)';
          e.target.style.borderColor = '#d97706';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'linear-gradient(to right, #fef3c7, #fde68a)';
          e.target.style.borderColor = '#f59e0b';
        }}
      >
        <Eye style={{ width: '18px', height: '18px' }} />
        تست بدون ثبت‌نام
        <Zap style={{ width: '16px', height: '16px', color: '#d97706' }} />
      </button>
    </Link>
  );
}