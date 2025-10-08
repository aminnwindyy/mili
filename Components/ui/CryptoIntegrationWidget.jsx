import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { 
  Bitcoin, 
  Ethereum, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Shield,
  Zap,
  Coins,
  PiggyBank,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  BarChart3,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock
} from 'lucide-react';

const CryptoIntegrationWidget = ({ userId = "demo_user" }) => {
  const [cryptoBalance, setCryptoBalance] = useState(null);
  const [stakingRewards, setStakingRewards] = useState([]);
  const [defiLoans, setDefiLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');

  const cryptoOptions = [
    { symbol: 'BTC', name: 'Bitcoin', icon: Bitcoin, color: 'orange', price: 45000000 },
    { symbol: 'ETH', name: 'Ethereum', icon: Ethereum, color: 'blue', price: 12000000 },
    { symbol: 'USDT', name: 'Tether', icon: DollarSign, color: 'green', price: 42000 }
  ];

  useEffect(() => {
    fetchCryptoData();
  }, [userId]);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      
      // Mock crypto data
      const mockCryptoBalance = {
        total_value_usd: 12500,
        total_value_irt: 525000000,
        assets: [
          { symbol: 'BTC', amount: 0.15, value_usd: 6750, value_irt: 283500000 },
          { symbol: 'ETH', amount: 2.5, value_usd: 3000, value_irt: 126000000 },
          { symbol: 'USDT', amount: 1000, value_usd: 1000, value_irt: 42000000 },
          { symbol: 'MELK', amount: 5000, value_usd: 1750, value_irt: 73500000 }
        ]
      };

      const mockStakingRewards = [
        {
          id: 1,
          token_symbol: 'MELK',
          staked_amount: 3000,
          reward_rate: 0.15,
          daily_reward: 1.23,
          total_earned: 456.78,
          apr: 15.5,
          lock_period: 90,
          days_remaining: 45
        },
        {
          id: 2,
          token_symbol: 'ETH',
          staked_amount: 1.5,
          reward_rate: 0.08,
          daily_reward: 0.00033,
          total_earned: 0.123,
          apr: 8.2,
          lock_period: 30,
          days_remaining: 12
        }
      ];

      const mockDefiLoans = [
        {
          id: 1,
          type: 'borrow',
          collateral_token: 'MELK',
          collateral_amount: 2000,
          borrowed_token: 'USDT',
          borrowed_amount: 500,
          interest_rate: 0.12,
          health_factor: 1.85,
          liquidation_price: 15000
        },
        {
          id: 2,
          type: 'lend',
          supplied_token: 'USDT',
          supplied_amount: 2000,
          interest_rate: 0.06,
          daily_earnings: 0.33,
          total_earned: 12.45
        }
      ];

      setCryptoBalance(mockCryptoBalance);
      setStakingRewards(mockStakingRewards);
      setDefiLoans(mockDefiLoans);
      
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCrypto = async () => {
    try {
      // Mock buy crypto
      const crypto = cryptoOptions.find(c => c.symbol === selectedCrypto);
      const newAsset = {
        symbol: selectedCrypto,
        amount: parseFloat(amount) / crypto.price,
        value_usd: parseFloat(amount),
        value_irt: parseFloat(amount) * 42000
      };

      setCryptoBalance(prev => ({
        ...prev,
        total_value_usd: prev.total_value_usd + parseFloat(amount),
        total_value_irt: prev.total_value_irt + (parseFloat(amount) * 42000),
        assets: [...prev.assets, newAsset]
      }));

      setShowBuyModal(false);
      setAmount('');
      setSelectedCrypto('BTC');
      
    } catch (error) {
      console.error('Error buying crypto:', error);
    }
  };

  const handleStakeTokens = async () => {
    try {
      // Mock staking
      const newStake = {
        id: stakingRewards.length + 1,
        token_symbol: 'MELK',
        staked_amount: parseFloat(amount),
        reward_rate: 0.15,
        daily_reward: parseFloat(amount) * 0.15 / 365,
        total_earned: 0,
        apr: 15.5,
        lock_period: 90,
        days_remaining: 90
      };

      setStakingRewards([...stakingRewards, newStake]);
      setShowStakeModal(false);
      setAmount('');
      
    } catch (error) {
      console.error('Error staking tokens:', error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cryptoBalance) return null;

  return (
    <div className="space-y-6">
      {/* Crypto Portfolio Overview */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-10"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center">
            <Coins className="w-5 h-5 ml-2 text-purple-600" />
            پرتفوی کریپتو
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-6">
          {/* Total Balance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="w-5 h-5 text-purple-600" />
                <Badge variant="secondary" className="text-xs">ارزش کل</Badge>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                ${cryptoBalance.total_value_usd.toLocaleString()}
              </p>
              <p className="text-sm text-purple-700">
                {cryptoBalance.total_value_irt.toLocaleString('fa-IR')} تومان
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <Badge variant="secondary" className="text-xs">بازدهی 24h</Badge>
              </div>
              <p className="text-2xl font-bold text-green-900">+5.8%</p>
              <p className="text-sm text-green-700">+$725</p>
            </div>
          </div>

          {/* Asset Holdings */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">دارایی‌ها</h4>
            {cryptoBalance.assets.map((asset, index) => {
              const crypto = cryptoOptions.find(c => c.symbol === asset.symbol) || 
                           { symbol: asset.symbol, name: asset.symbol, icon: Star, color: 'purple' };
              const Icon = crypto.icon;
              
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-10 h-10 rounded-full bg-${crypto.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${crypto.color}-600`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{crypto.name}</p>
                      <p className="text-sm text-gray-600">{asset.amount} {asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">${asset.value_usd.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">
                      {asset.value_irt.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBuyModal(true)}
              className="text-right"
            >
              <ArrowUpRight className="w-4 h-4 ml-1" />
              خرید کریپتو
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowStakeModal(true)}
              className="text-right"
            >
              <Lock className="w-4 h-4 ml-1" />
              استیکینگ
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-right"
            >
              <Shield className="w-4 h-4 ml-1" />
              وام DeFi
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-right"
            >
              <BarChart3 className="w-4 h-4 ml-1" />
              تحلیل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staking Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PiggyBank className="w-5 h-5 ml-2 text-green-600" />
            پاداش‌های استیکینگ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stakingRewards.map((stake) => (
            <div key={stake.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Coins className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">استیکینگ {stake.token_symbol}</p>
                    <p className="text-sm text-gray-600">APR: {stake.apr}%</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">{stake.staked_amount} {stake.token_symbol}</p>
                  <p className="text-sm text-gray-600">پاداش روزانه: {stake.daily_reward}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>پاداش کل کسب شده</span>
                  <span className="font-semibold text-green-600">{stake.total_earned} {stake.token_symbol}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>زمان باقی‌مانده</span>
                  <span>{stake.days_remaining} روز</span>
                </div>
                <Progress 
                  value={(stake.lock_period - stake.days_remaining) / stake.lock_period * 100} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* DeFi Loans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 ml-2 text-blue-600" />
            وام‌های DeFi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {defiLoans.map((loan) => (
            <div key={loan.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    loan.type === 'borrow' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {loan.type === 'borrow' ? 
                      <ArrowDownLeft className="w-4 h-4 text-red-600" /> :
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    }
                  </div>
                  <div>
                    <p className="font-semibold">
                      {loan.type === 'borrow' ? 'وام گرفته شده' : 'وام داده شده'}
                    </p>
                    <p className="text-sm text-gray-600">
                      نرخ بهره: {(loan.interest_rate * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">
                    {loan.borrowed_amount || loan.supplied_amount} {loan.borrowed_token || loan.supplied_token}
                  </p>
                  {loan.type === 'borrow' && (
                    <p className="text-sm text-gray-600">
                      ضریب سلامتی: {loan.health_factor}
                    </p>
                  )}
                </div>
              </div>
              
              {loan.type === 'borrow' && (
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      قیمت نقدینگی: ${loan.liquidation_price.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              
              {loan.type === 'lend' && (
                <div className="bg-green-50 p-2 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      درآمد روزانه: {loan.daily_earnings} {loan.supplied_token}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Buy Crypto Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpRight className="w-5 h-5 ml-2 text-blue-600" />
                خرید کریپتو
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ارز دیجیتال
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {cryptoOptions.map((crypto) => {
                    const Icon = crypto.icon;
                    return (
                      <Button
                        key={crypto.symbol}
                        variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCrypto(crypto.symbol)}
                        className="flex items-center justify-center space-x-1 space-x-reverse"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{crypto.symbol}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مبلغ (دلار)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="مبلغ مورد نظر را وارد کنید"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-900">
                    کارمزد: 0.5% | حداقل خرید: $10
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button 
                  onClick={handleBuyCrypto}
                  className="flex-1"
                  disabled={!amount || parseFloat(amount) < 10}
                >
                  خرید
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1"
                >
                  انصراف
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stake Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 ml-2 text-green-600" />
                استیکینگ توکن
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توکن MELK
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="مقدار توکن را وارد کنید"
                />
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Star className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-900">
                    APR: 15.5% | دوره قفل: 90 روز
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button 
                  onClick={handleStakeTokens}
                  className="flex-1"
                  disabled={!amount || parseFloat(amount) < 100}
                >
                  استیک کردن
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowStakeModal(false)}
                  className="flex-1"
                >
                  انصراف
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CryptoIntegrationWidget;