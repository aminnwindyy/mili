import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Shield,
  Gift,
  Banknote,
  Building,
  Percent,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const EmbeddedBankingWidget = ({ userId = "demo_user" }) => {
  const [bankAccount, setBankAccount] = useState(null);
  const [loans, setLoans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('investment');

  useEffect(() => {
    fetchBankingData();
  }, [userId]);

  const fetchBankingData = async () => {
    try {
      setLoading(true);
      
      // Mock banking data
      const mockBankAccount = {
        id: 1,
        account_number: "****1234",
        balance: 500000000,
        available_credit: 200000000,
        credit_score: 750,
        account_type: "premium",
        cashback_rate: 0.02,
        monthly_spending: 85000000,
        token_cashback: 12500000
      };

      const mockLoans = [
        {
          id: 1,
          type: "investment_loan",
          amount: 300000000,
          interest_rate: 0.08,
          term_months: 24,
          remaining_months: 18,
          monthly_payment: 13500000,
          status: "active",
          collateral: "property_tokens"
        },
        {
          id: 2,
          type: "personal_loan",
          amount: 100000000,
          interest_rate: 0.12,
          term_months: 12,
          remaining_months: 6,
          monthly_payment: 8880000,
          status: "active",
          collateral: "none"
        }
      ];

      const mockTransactions = [
        {
          id: 1,
          type: "cashback",
          amount: 250000,
          description: "کش‌بک خرید توکن ملک",
          date: "2024-01-08",
          status: "completed"
        },
        {
          id: 2,
          type: "loan_payment",
          amount: -13500000,
          description: "پرداخت قسط وام سرمایه‌گذاری",
          date: "2024-01-07",
          status: "completed"
        },
        {
          id: 3,
          type: "investment_deposit",
          amount: 50000000,
          description: "واریز برای سرمایه‌گذاری",
          date: "2024-01-06",
          status: "completed"
        }
      ];

      setBankAccount(mockBankAccount);
      setLoans(mockLoans);
      setTransactions(mockTransactions);
      
    } catch (error) {
      console.error('Error fetching banking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoanRequest = async () => {
    try {
      // Mock loan request
      const newLoan = {
        id: loans.length + 1,
        type: "investment_loan",
        amount: parseInt(loanAmount),
        interest_rate: 0.08,
        term_months: 24,
        monthly_payment: Math.round(parseInt(loanAmount) * 1.08 / 24),
        status: "pending",
        collateral: "property_tokens"
      };

      setLoans([...loans, newLoan]);
      setShowLoanModal(false);
      setLoanAmount('');
      
    } catch (error) {
      console.error('Error requesting loan:', error);
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

  if (!bankAccount) return null;

  return (
    <div className="space-y-6">
      {/* Bank Account Overview */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 ml-2 text-blue-600" />
            حساب بانکی یکپارچه
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-6">
          {/* Account Balance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="w-5 h-5 text-green-600" />
                <Badge variant="secondary" className="text-xs">موجودی</Badge>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {bankAccount.balance.toLocaleString('fa-IR')} تومان
              </p>
              <p className="text-sm text-green-700">حساب {bankAccount.account_number}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <Badge variant="secondary" className="text-xs">اعتبار</Badge>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {bankAccount.available_credit.toLocaleString('fa-IR')} تومان
              </p>
              <p className="text-sm text-blue-700">امتیاز اعتباری: {bankAccount.credit_score}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <Gift className="w-5 h-5 text-purple-600" />
                <Badge variant="secondary" className="text-xs">کش‌بک</Badge>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {bankAccount.token_cashback.toLocaleString('fa-IR')} تومان
              </p>
              <p className="text-sm text-purple-700">نرخ: {(bankAccount.cashback_rate * 100).toFixed(1)}%</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowLoanModal(true)}
              className="text-right"
            >
              <TrendingUp className="w-4 h-4 ml-1" />
              وام سرمایه‌گذاری
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-right"
            >
              <CreditCard className="w-4 h-4 ml-1" />
              درخواست کارت
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-right"
            >
              <PiggyBank className="w-4 h-4 ml-1" />
              پس‌انداز
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-right"
            >
              <Shield className="w-4 h-4 ml-1" />
              بیمه
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Loans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Banknote className="w-5 h-5 ml-2 text-orange-600" />
            وام‌های فعال
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loans.map((loan) => (
            <div key={loan.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className={`w-3 h-3 rounded-full ${
                    loan.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="font-semibold">
                    {loan.type === 'investment_loan' ? 'وام سرمایه‌گذاری' : 'وام شخصی'}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {(loan.interest_rate * 100).toFixed(1)}% سالانه
                  </Badge>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">{loan.amount.toLocaleString('fa-IR')} تومان</p>
                  <p className="text-sm text-gray-600">قسط: {loan.monthly_payment.toLocaleString('fa-IR')}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>پرداخت شده</span>
                  <span>{((loan.term_months - loan.remaining_months) / loan.term_months * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(loan.term_months - loan.remaining_months) / loan.term_months * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{loan.term_months - loan.remaining_months} ماه پرداخت شده</span>
                  <span>{loan.remaining_months} ماه مانده</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowUpRight className="w-5 h-5 ml-2 text-blue-600" />
            تراکنش‌های اخیر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'cashback' ? 'bg-green-100' :
                  transaction.type === 'loan_payment' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {transaction.type === 'cashback' ? <Gift className="w-4 h-4 text-green-600" /> :
                   transaction.type === 'loan_payment' ? <ArrowDownLeft className="w-4 h-4 text-red-600" /> :
                   <ArrowUpRight className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-600">{transaction.date}</p>
                </div>
              </div>
              <div className="text-left">
                <p className={`font-bold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('fa-IR')} تومان
                </p>
                <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                  {transaction.status === 'completed' ? 'موفق' : 'در حال بررسی'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Loan Request Modal */}
      {showLoanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 ml-2 text-blue-600" />
                درخواست وام سرمایه‌گذاری
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مبلغ وام (تومان)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="مبلغ مورد نظر را وارد کنید"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  هدف وام
                </label>
                <select
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="investment">سرمایه‌گذاری در ملک</option>
                  <option value="renovation">بازسازی ملک</option>
                  <option value="diversification">تنوع‌بخشی پورتفولیو</option>
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-900">
                    نرخ بهره: 8% سالانه | دوره بازپرداخت: 24 ماه
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button 
                  onClick={handleLoanRequest}
                  className="flex-1"
                  disabled={!loanAmount || parseInt(loanAmount) < 10000000}
                >
                  ثبت درخواست
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowLoanModal(false)}
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

export default EmbeddedBankingWidget;