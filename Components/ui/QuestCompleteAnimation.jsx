import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Gift, Zap, Trophy } from 'lucide-react';

const QuestCompleteAnimation = ({ show, questData, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => setShowReward(true), 500);
      setTimeout(() => {
        setIsVisible(false);
        setShowReward(false);
        setTimeout(onClose, 300);
      }, 3000);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 max-w-sm mx-4 text-center border-2 border-green-200 transform transition-all duration-500 ${
        isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-6'
      }`}>
        {/* Success Icon */}
        <div className="mb-4">
          <div className={`relative inline-block transform transition-all duration-700 ${
            isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <CheckCircle className="w-20 h-20 text-green-500" />
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Quest Info */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-green-800">
            کوئست کامل شد!
          </h3>
          
          <div className="text-4xl mb-2">
            {questData?.icon || '✨'}
          </div>
          
          <p className="text-lg text-green-700 font-medium">
            {questData?.title_fa || 'ماموریت انجام شد!'}
          </p>

          {/* Rewards */}
          <div className={`transform transition-all duration-500 ${
            showReward ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}>
            <div className="bg-white rounded-xl p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center justify-center">
                <Gift className="w-5 h-5 ml-2" />
                جوایز شما
              </h4>
              
              <div className="space-y-2">
                {/* XP Reward */}
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-yellow-800">امتیاز XP</span>
                  </div>
                  <span className="font-bold text-yellow-600">
                    +{questData?.xp_reward || 0}
                  </span>
                </div>

                {/* Coin Reward */}
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Zap className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-800">سکه</span>
                  </div>
                  <span className="font-bold text-green-600">
                    +{questData?.coin_reward || 0}
                  </span>
                </div>

                {/* Badge Reward */}
                {questData?.badge_reward && (
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Trophy className="w-5 h-5 text-purple-500" />
                      <span className="font-medium text-purple-800">نجوای ویژه</span>
                    </div>
                    <span className="font-bold text-purple-600 text-sm">
                      {questData.badge_reward}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="mt-4 px-6 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
          >
            عالی!
          </button>
        </div>

        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestCompleteAnimation;