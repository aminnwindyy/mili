// تابع‌های کمکی برای فرمت کردن اعداد و ارز

// تبدیل ریال به تومان و فرمت خوانا
export const formatCurrency = (amount, showCurrency = true) => {
    if (!amount || amount === 0) return showCurrency ? '0 تومان' : '0';
    
    const tomanAmount = Math.round(amount / 10); // تبدیل ریال به تومان
    
    if (tomanAmount >= 1000000000) {
      return `${(tomanAmount / 1000000000).toFixed(1)} میلیارد${showCurrency ? ' تومان' : ''}`;
    } else if (tomanAmount >= 1000000) {
      return `${(tomanAmount / 1000000).toFixed(1)} میلیون${showCurrency ? ' تومان' : ''}`;
    } else if (tomanAmount >= 1000) {
      return `${(tomanAmount / 1000).toFixed(1)} هزار${showCurrency ? ' تومان' : ''}`;
    }
    
    return `${tomanAmount.toLocaleString('fa-IR')}${showCurrency ? ' تومان' : ''}`;
  };
  
  // فرمت عدد با جداکننده
  export const formatNumber = (number) => {
    if (!number) return '0';
    return number.toLocaleString('fa-IR');
  };
  
  // تبدیل تومان به ریال برای ذخیره در دیتابیس
  export const tomanToRial = (tomanAmount) => {
    return tomanAmount * 10;
  };
  
  // محاسبه پیشنهاد هوشمند مبلغ
  export const suggestInvestmentAmount = (userHistory, propertyPrice) => {
    if (!userHistory || userHistory.length === 0) {
      // برای کاربران جدید، 10% از قیمت توکن
      return Math.max(propertyPrice * 0.1, 1000000); // حداقل 100 هزار تومان
    }
    
    const avgInvestment = userHistory.reduce((sum, inv) => sum + inv.amount, 0) / userHistory.length;
    const lastInvestment = userHistory[userHistory.length - 1]?.amount || avgInvestment;
    
    // ترکیب میانگین و آخرین سرمایه‌گذاری
    const suggested = (avgInvestment * 0.7) + (lastInvestment * 0.3);
    
    // محدود کردن به بازه معقول
    return Math.min(Math.max(suggested, propertyPrice * 0.05), propertyPrice * 2);
  };