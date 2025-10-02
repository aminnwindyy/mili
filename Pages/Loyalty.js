import React from 'react';

export default function Loyalty() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: 'rtl',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#1e293b', 
            marginBottom: '10px' 
          }}>
            برنامه وفاداری ملک‌چین
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
            فعالیت بیشتر، پاداش بیشتر! 🎁
          </p>
        </div>

        {/* Current Status Card */}
        <div style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: 'white',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          marginBottom: '40px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🥇</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
            طلایی (Gold)
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '30px' }}>
            شما در سطح طلایی قرار دارید
          </p>
          
          <div style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            ۷,۵۰۰ امتیاز
          </div>
          
          {/* Progress Bar */}
          <div style={{ marginTop: '30px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.9rem', 
              marginBottom: '10px',
              opacity: 0.9
            }}>
              <span>تا سطح پلاتینیوم</span>
              <span>۱۲,۵۰۰ امتیاز باقی‌مانده</span>
            </div>
            <div style={{ 
              width: '100%', 
              backgroundColor: 'rgba(255,255,255,0.3)', 
              borderRadius: '10px', 
              height: '12px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '37%', 
                backgroundColor: 'white', 
                height: '100%', 
                borderRadius: '10px',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
                </div>
              </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '40px' 
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏆</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>۷,۵۰۰</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>کل امتیاز کسب شده</div>
              </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>۵۰ میلیارد</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>کل سرمایه‌گذاری (ریال)</div>
              </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>۳</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>دعوت موفق از دوستان</div>
              </div>
        </div>

          {/* Available Rewards */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '40px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginBottom: '25px' 
          }}>
            <span style={{ fontSize: '2rem' }}>🎁</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                پاداش‌های قابل دریافت
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* Reward 1 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '5px', color: '#166534' }}>
                  کش‌بک ۱٪ خرید بعدی
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#15803d', marginBottom: '8px' }}>
                  دریافت ۱٪ کش‌بک در اولین خرید بعدی شما
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#f59e0b' }}>⭐</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#166534' }}>
                    ۵۰۰ امتیاز
                  </span>
                        </div>
                      </div>
              <button 
                onClick={() => alert('پاداش با موفقیت دریافت شد! 🎉')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
                      >
                        دریافت
              </button>
                    </div>

            {/* Reward 2 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '5px', color: '#166534' }}>
                  مشاوره رایگان
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#15803d', marginBottom: '8px' }}>
                  ۱ ساعت مشاوره رایگان با کارشناسان ما
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#f59e0b' }}>⭐</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#166534' }}>
                    ۱,۰۰۰ امتیاز
                  </span>
                </div>
              </div>
              <button 
                onClick={() => alert('پاداش با موفقیت دریافت شد! 🎉')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                دریافت
              </button>
            </div>

          </div>
        </div>

        {/* How to Earn Points */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1e293b', 
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            چگونه امتیاز کسب کنیم؟ 🎯
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px' 
          }}>
            
            <div style={{
              textAlign: 'center',
              padding: '25px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#166534' }}>
                سرمایه‌گذاری
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#15803d' }}>
                ۱ امتیاز به ازای هر میلیون ریال
              </p>
              </div>

            <div style={{
              textAlign: 'center',
              padding: '25px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1e40af' }}>
                دعوت دوستان
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#1d4ed8' }}>
                ۵۰۰ امتیاز به ازای هر دعوت موفق
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}