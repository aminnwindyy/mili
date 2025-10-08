import React, { useEffect, useState } from 'react';
import { Crown, Star, Zap, Trophy, Medal } from 'lucide-react';

const LevelUpAnimation = ({ show, levelData, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => setShowConfetti(true), 200);
      setTimeout(() => {
        setIsVisible(false);
        setShowConfetti(false);
        setTimeout(onClose, 300);
      }, 4000);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Confetti Background */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#fbbf24', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6'][Math.floor(Math.random() * 5)]
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Animation Card */}
      <div className={`relative bg-white rounded-3xl p-8 max-w-md mx-4 text-center transform transition-all duration-500 ${
        isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-12'
      }`}>
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Animated Icons */}
          <div className="mb-6 relative">
            <div className="relative inline-block">
              <Crown className={`w-24 h-24 text-yellow-500 mx-auto transform transition-all duration-1000 ${
                isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`} />
              <Star className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
              <Zap className="absolute -bottom-2 -left-2 w-6 h-6 text-blue-500 animate-bounce" />
            </div>
          </div>

          {/* Level Text */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
              تبریک! سطح بالا رفتی!
            </h2>
            
            <div className="text-6xl mb-4 animate-bounce">
              {levelData?.icon || '🌟'}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">
                سطح {levelData?.id || '1'}: {levelData?.name_fa || 'تازه‌کار'}
              </h3>
              <p className="text-lg text-gray-600">
                {levelData?.name || 'Novice'}
              </p>
            </div>

            {/* Benefits */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center justify-center">
                <Trophy className="w-5 h-5 ml-2" />
                مزایای جدید unlocked شد!
              </h4>
              <div className="space-y-2">
                {levelData?.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Medal className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-800">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              عالیه! ادامه بده
            </button>
          </div>
        </div>

        {/* Particle Effects */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelUpAnimation;