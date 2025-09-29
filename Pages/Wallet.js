import React, { useState, useEffect } from 'react';
import { Transaction } from '@/entities/Transaction';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Wallet as WalletIcon, 
  Plus, 
  Minus, 
  ArrowUpDown, 
  DollarSign,
  TrendingUp,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Send,
  Download,
  CreditCard,
  Banknote
} from 'lucide-react';

export default function Wallet() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('Rial');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      // Initialize wallet balances if not exists
      if (userData.wallet_balance_rial === undefined) {
        await User.updateMyUserData({ 
          wallet_balance_rial: 10000000, // 10M rial demo balance
          wallet_balance_usdt: 100 // 100 USDT demo balance
        });
        userData.wallet_balance_rial = 10000000;
        userData.wallet_balance_usdt = 100;
        setUser(userData);
      }

      // Load transactions
      const userTransactions = await Transaction.filter({ user_email: userData.email });
      
      // If no transactions, create some demo data
      if (userTransactions.length === 0) {
        const demoTransactions = [
          {
            user_email: userData.email,
            type: 'deposit',
            amount: 50000000,
            currency: 'Rial',
            status: 'completed',
            description: 'واریز اولیه'
          },
          {
            user_email: userData.email,
            type: 'investment',
            amount: -25000000,
            currency: 'Rial',
            status: 'completed',
            description: 'سرمایه‌گذاری در برج سعادت‌آباد'
          },
          {
            user_email: userData.email,
            type: 'reward',
            amount: 1000000,
            currency: 'Rial',
            status: 'completed',
            description: 'پاداش وفاداری'
          }
        ];

        // Create demo transactions
        for (const tx of demoTransactions) {
          await Transaction.create(tx);
        }
        
        // Reload transactions
        const newTransactions = await Transaction.filter({ user_email: userData.email });
        setTransactions(newTransactions);
      } else {
        setTransactions(userTransactions);
      }

    } catch (error) {
      console.error('Error loading wallet data:', error);
      // Demo data
      setUser({
        email: 'demo@example.com',
        wallet_balance_rial: 45000000,
        wallet_balance_usdt: 150
      });
      setTransactions([
        { id: 1, type: 'deposit', amount: 50000000, currency: 'Rial', status: 'completed', description: 'واریز اولیه', created_date: new Date().toISOString() },
        { id: 2, type: 'investment', amount: -25000000, currency: 'Rial', status: 'completed', description: 'سرمایه‌گذاری در برج سعادت‌آباد', created_date: new Date().toISOString() },
        { id: 3, type: 'reward', amount: 1000000, currency: 'Rial', status: 'completed', description: 'پاداش وفاداری', created_date: new Date().toISOString() }
      ]);
    }
    setIsLoading(false);
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('مبلغ نامعتبر است');
      return;
    }

    setIsProcessing(true);
    try {
      const amount = parseFloat(depositAmount);
      
      // Create transaction record
      const transaction = {
        user_email: user.email,
        type: 'deposit',
        amount: selectedCurrency === 'Rial' ? amount * 10 : amount, // Convert to rial base unit
        currency: selectedCurrency,
        status: 'completed',
        description: `واریز ${amount.toLocaleString()} ${selectedCurrency === 'Rial' ? 'ریال' : 'USDT'}`
      };

      await Transaction.create(transaction);

      // Update user balance
      const balanceField = selectedCurrency === 'Rial' ? 'wallet_balance_rial' : 'wallet_balance_usdt';
      const currentBalance = user[balanceField] || 0;
      const newBalance = currentBalance + (selectedCurrency === 'Rial' ? amount * 10 : amount);

      await User.updateMyUserData({ [balanceField]: newBalance });
      
      setUser(prev => ({ ...prev, [balanceField]: newBalance }));
      setDepositAmount('');
      
      alert('واریز با موفقیت انجام شد!');
      loadWalletData(); // Refresh data
    } catch (error) {
      console.error('Deposit error:', error);
      alert('خطا در واریز وجه');
    }
    setIsProcessing(false);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('مبلغ نامعتبر است');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    const balanceField = selectedCurrency === 'Rial' ? 'wallet_balance_rial' : 'wallet_balance_usdt';
    const currentBalance = user[balanceField] || 0;
    const withdrawAmountInBaseUnit = selectedCurrency === 'Rial' ? amount * 10 : amount;

    if (withdrawAmountInBaseUnit > currentBalance) {
      alert('موجودی کافی نیست');
      return;
    }

    setIsProcessing(true);
    try {
      // Create transaction record
      const transaction = {
        user_email: user.email,
        type: 'withdrawal',
        amount: -withdrawAmountInBaseUnit,
        currency: selectedCurrency,
        status: 'completed',
        description: `برداشت ${amount.toLocaleString()} ${selectedCurrency === 'Rial' ? 'ریال' : 'USDT'}`
      };

      await Transaction.create(transaction);

      // Update user balance
      const newBalance = currentBalance - withdrawAmountInBaseUnit;
      await User.updateMyUserData({ [balanceField]: newBalance });
      
      setUser(prev => ({ ...prev, [balanceField]: newBalance }));
      setWithdrawAmount('');
      
      alert('برداشت با موفقیت انجام شد!');
      loadWalletData(); // Refresh data
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('خطا در برداشت وجه');
    }
    setIsProcessing(false);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return <Plus className="w-4 h-4 text-emerald-600" />;
      case 'withdrawal': return <Minus className="w-4 h-4 text-red-600" />;
      case 'investment': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'sale': return <ArrowUpDown className="w-4 h-4 text-purple-600" />;
      case 'reward': return <DollarSign className="w-4 h-4 text-amber-600" />;
      default: return <ArrowUpDown className="w-4 h-4 text-slate-600" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit':
      case 'reward':
      case 'sale':
        return 'text-emerald-600';
      case 'withdrawal':
      case 'investment':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const formatBalance = (amount, currency) => {
    if (currency === 'Rial') {
      return (amount / 10000000).toLocaleString('fa-IR', { maximumFractionDigits: 1 }) + ' میلیون ریال';
    } else {
      return amount.toLocaleString('fa-IR', { maximumFractionDigits: 2 }) + ' USDT';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
        <p>در حال بارگذاری کیف پول...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-emerald-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">کیف پول</h1>
            <p className="text-slate-600">مدیریت موجودی و تراکنش‌های مالی</p>
          </div>
          <Button onClick={loadWalletData} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            بروزرسانی
          </Button>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-xl border-0 bg-gradient-to-bl from-emerald-500 to-teal-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">موجودی ریالی</h3>
                    <p className="text-emerald-100 text-sm">ریال ایران</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white hover:bg-white/10"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              <div className="text-3xl font-bold mb-2">
                {showBalance 
                  ? formatBalance(user?.wallet_balance_rial || 0, 'Rial')
                  : '*** میلیون ریال'
                }
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="text-emerald-700"
                  onClick={() => {
                    setSelectedCurrency('Rial');
                    document.getElementById('deposit-tab')?.click();
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  افزایش موجودی
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-bl from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">موجودی دلاری</h3>
                    <p className="text-blue-100 text-sm">USDT</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white hover:bg-white/10"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              <div className="text-3xl font-bold mb-2">
                {showBalance 
                  ? formatBalance(user?.wallet_balance_usdt || 0, 'USDT')
                  : '*** USDT'
                }
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="text-blue-700"
                  onClick={() => {
                    setSelectedCurrency('USDT');
                    document.getElementById('deposit-tab')?.click();
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  افزایش موجودی
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Transactions */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="bg-white shadow-lg p-1">
            <TabsTrigger value="transactions" className="px-6">تراکنش‌ها</TabsTrigger>
            <TabsTrigger value="deposit" id="deposit-tab" className="px-6">واریز</TabsTrigger>
            <TabsTrigger value="withdraw" className="px-6">برداشت</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WalletIcon className="w-5 h-5 text-emerald-600" />
                  تاریخچه تراکنش‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(0, 10).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg">
                            {getTransactionIcon(tx.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{tx.description}</h4>
                            <p className="text-sm text-slate-500">
                              {new Date(tx.created_date).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getTransactionColor(tx.type)}`}>
                            {tx.amount > 0 ? '+' : ''}
                            {formatBalance(Math.abs(tx.amount), tx.currency)}
                          </div>
                          <Badge className={
                            tx.status === 'completed' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : tx.status === 'pending' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-red-100 text-red-800'
                          }>
                            {tx.status === 'completed' ? 'تکمیل' : tx.status === 'pending' ? 'در حال پردازش' : 'لغو شده'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <WalletIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">هیچ تراکنشی یافت نشد</p>
                    <p>اولین واریز خود را انجام دهید</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposit" className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  افزایش موجودی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      نوع ارز
                    </label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Rial">ریال ایران</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      مبلغ واریز
                    </label>
                    <Input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder={selectedCurrency === 'Rial' ? 'مثلاً 1000000' : 'مثلاً 100'}
                      className="text-left"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">روش‌های پرداخت:</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>کارت‌های بانکی (شتاب)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4" />
                      <span>انتقال بانکی</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <WalletIcon className="w-4 h-4" />
                      <span>کیف پول‌های دیجیتال</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-12"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {isProcessing ? 'در حال پردازش...' : 'واریز وجه'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Minus className="w-5 h-5 text-red-600" />
                  برداشت وجه
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      نوع ارز
                    </label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Rial">ریال ایران</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      مبلغ برداشت
                    </label>
                    <Input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder={selectedCurrency === 'Rial' ? 'مثلاً 500000' : 'مثلاً 50'}
                      className="text-left"
                      max={selectedCurrency === 'Rial' 
                        ? (user?.wallet_balance_rial || 0) / 10 
                        : user?.wallet_balance_usdt || 0
                      }
                    />
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">موجودی قابل برداشت:</h4>
                  <div className="text-lg font-bold text-amber-800">
                    {selectedCurrency === 'Rial' 
                      ? formatBalance(user?.wallet_balance_rial || 0, 'Rial')
                      : formatBalance(user?.wallet_balance_usdt || 0, 'USDT')
                    }
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">شرایط برداشت:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• حداقل مبلغ برداشت: {selectedCurrency === 'Rial' ? '100 هزار ریال' : '10 USDT'}</li>
                    <li>• زمان پردازش: 1-2 روز کاری</li>
                    <li>• کارمزد برداشت: {selectedCurrency === 'Rial' ? '5 هزار ریال' : '2 USDT'}</li>
                  </ul>
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 h-12"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isProcessing ? 'در حال پردازش...' : 'درخواست برداشت'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}