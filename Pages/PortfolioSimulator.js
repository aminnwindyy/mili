import React, { useState, useEffect, useRef } from 'react';
import { Property } from '@/entities/Property';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Target, 
  TrendingUp, 
  DollarSign,
  PieChart,
  BarChart3,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Save,
  Download
} from 'lucide-react';

export default function PortfolioSimulator() {
  const [properties, setProperties] = useState([]);
  const [simulationData, setSimulationData] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [totalBudget, setTotalBudget] = useState(100000000); // 100M rial
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(500); // milliseconds
  const intervalRef = useRef(null);
  
  const [selectedStrategy, setSelectedStrategy] = useState('balanced');
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [timeHorizon, setTimeHorizon] = useState(12); // months

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const propertiesData = await Property.list();
      setProperties(propertiesData.filter(p => p.status === 'در_حال_فروش'));
    } catch (error) {
      console.error('Error loading properties:', error);
      // Demo properties
      setProperties([
        {
          id: 1,
          title: 'برج لوکس سعادت‌آباد',
          token_price: 50000000,
          expected_annual_return: 18.5,
          total_tokens: 1000,
          available_tokens: 750,
          property_type: 'آپارتمان',
          risk_level: 'medium'
        },
        {
          id: 2,
          title: 'مجتمع تجاری پاسداران',
          token_price: 100000000,
          expected_annual_return: 22.3,
          total_tokens: 500,
          available_tokens: 200,
          property_type: 'تجاری',
          risk_level: 'high'
        },
        {
          id: 3,
          title: 'ویلای باغ فردوس',
          token_price: 25000000,
          expected_annual_return: 16.8,
          total_tokens: 800,
          available_tokens: 600,
          property_type: 'خانه',
          risk_level: 'low'
        }
      ]);
    }
  };

  const addToPortfolio = (property, amount) => {
    const tokens = Math.floor(amount / property.token_price);
    if (tokens === 0) {
      alert('مبلغ کافی نیست');
      return;
    }

    const totalCost = tokens * property.token_price;
    if (getTotalInvestment() + totalCost > totalBudget) {
      alert('از بودجه تعریف شده تجاوز می‌کند');
      return;
    }

    const existingItem = portfolioItems.find(item => item.property.id === property.id);
    if (existingItem) {
      setPortfolioItems(portfolioItems.map(item =>
        item.property.id === property.id
          ? { ...item, tokens: item.tokens + tokens, investment: item.investment + totalCost }
          : item
      ));
    } else {
      setPortfolioItems([...portfolioItems, {
        property,
        tokens,
        investment: totalCost,
        currentValue: totalCost
      }]);
    }
  };

  const removeFromPortfolio = (propertyId) => {
    setPortfolioItems(portfolioItems.filter(item => item.property.id !== propertyId));
  };

  const getTotalInvestment = () => {
    return portfolioItems.reduce((sum, item) => sum + item.investment, 0);
  };

  const calculatePortfolioReturn = () => {
    const totalInvestment = getTotalInvestment();
    if (totalInvestment === 0) return 0;

    const weightedReturn = portfolioItems.reduce((sum, item) => {
      const weight = item.investment / totalInvestment;
      return sum + (weight * item.property.expected_annual_return);
    }, 0);

    return weightedReturn;
  };

  const calculateRiskScore = () => {
    const totalInvestment = getTotalInvestment();
    if (totalInvestment === 0) return 0;

    const riskScores = { low: 1, medium: 2, high: 3 };
    const weightedRisk = portfolioItems.reduce((sum, item) => {
      const weight = item.investment / totalInvestment;
      const risk = riskScores[item.property.risk_level] || 2;
      return sum + (weight * risk);
    }, 0);

    return Math.round(weightedRisk * 10) / 10;
  };

  const startSimulation = () => {
    if (portfolioItems.length === 0) {
      alert('ابتدا پورتفولیو خود را بسازید');
      return;
    }

    setIsSimulating(true);
    setCurrentStep(0);
    setSimulationResults([]);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        
        // Generate simulation data for this month
        const monthData = {
          month: nextStep,
          portfolioValue: 0,
          totalReturn: 0,
          properties: portfolioItems.map(item => ({
            ...item,
            currentValue: calculatePropertyValue(item, nextStep)
          }))
        };

        // Compute portfolio value from this step's computed properties to avoid stale state
        monthData.portfolioValue = monthData.properties.reduce((total, item) => total + item.currentValue, 0);
        monthData.totalReturn = ((monthData.portfolioValue - getTotalInvestment()) / getTotalInvestment()) * 100;

        setSimulationResults(prev => [...prev, monthData]);

        // Update portfolio items
        setPortfolioItems(monthData.properties);

        if (nextStep >= timeHorizon) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsSimulating(false);
          return nextStep;
        }

        return nextStep;
      });
    }, simulationSpeed);
  };

  const calculateMonthlyValue = (month) => {
    return portfolioItems.reduce((total, item) => {
      return total + calculatePropertyValue(item, month);
    }, 0);
  };

  const calculatePropertyValue = (item, month) => {
    // Simulate market volatility and growth
    const annualReturn = item.property.expected_annual_return / 100;
    const monthlyReturn = annualReturn / 12;
    
    // Add some random volatility based on risk level
    const volatilityFactors = { low: 0.02, medium: 0.05, high: 0.08 };
    const volatility = volatilityFactors[item.property.risk_level] || 0.05;
    const randomFactor = (Math.random() - 0.5) * volatility;
    
    const growth = Math.pow(1 + monthlyReturn + randomFactor, month);
    return Math.round(item.investment * growth);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentStep(0);
    setSimulationResults([]);
    setPortfolioItems(prev => prev.map(item => ({
      ...item,
      currentValue: item.investment
    })));
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const savePortfolio = async () => {
    try {
      const user = await User.me();
      const portfolioData = {
        user_email: user.email,
        portfolio_items: portfolioItems,
        total_budget: totalBudget,
        strategy: selectedStrategy,
        risk_tolerance: riskTolerance,
        created_at: new Date().toISOString()
      };
      
      // Save to localStorage for now (could be extended to use entities)
      localStorage.setItem('saved_portfolio_simulation', JSON.stringify(portfolioData));
      alert('پورتفولیو ذخیره شد!');
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('خطا در ذخیره پورتفولیو');
    }
  };

  const exportResults = () => {
    const data = {
      portfolio: portfolioItems,
      simulation_results: simulationResults,
      total_budget: totalBudget,
      final_return: simulationResults[simulationResults.length - 1]?.totalReturn || 0
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `portfolio-simulation-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const strategySuggestions = {
    conservative: { 
      description: 'محافظه‌کارانه: تمرکز بر املاک کم ریسک',
      allocation: { low: 70, medium: 25, high: 5 }
    },
    balanced: { 
      description: 'متعادل: ترکیب مناسب از ریسک و بازده',
      allocation: { low: 40, medium: 45, high: 15 }
    },
    aggressive: { 
      description: 'تهاجمی: تمرکز بر بازده بالا',
      allocation: { low: 15, medium: 35, high: 50 }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            شبیه‌ساز پورتفولیو
          </h1>
          <p className="text-slate-600">استراتژی سرمایه‌گذاری خود را قبل از شروع تست کنید</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Portfolio Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Settings */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  تنظیمات شبیه‌سازی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      بودجه کل (ریال)
                    </label>
                    <Input
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Number(e.target.value))}
                      placeholder="100000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      استراتژی
                    </label>
                    <select
                      value={selectedStrategy}
                      onChange={(e) => setSelectedStrategy(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    >
                      {Object.entries(strategySuggestions).map(([key, strategy]) => (
                        <option key={key} value={key}>
                          {strategy.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      افق زمانی (ماه)
                    </label>
                    <Input
                      type="number"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(Number(e.target.value))}
                      min="1"
                      max="60"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Properties */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>املاک موجود برای سرمایه‌گذاری</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{property.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-600 mt-2">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100">بازده: {property.expected_annual_return}%</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100">قیمت توکن: {(property.token_price / 1000000).toFixed(1)}م ریال</span>
                          <Badge
                            className={`${
                              property.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                              property.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            } rounded-full px-3`}
                          >
                            {property.risk_level === 'low' ? 'کم ریسک' :
                             property.risk_level === 'medium' ? 'متوسط' : 'پر ریسک'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-auto">
                        <Input
                          type="number"
                          placeholder="مبلغ (ریال)"
                          className="w-36 h-10 rounded-full text-center border-slate-300"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addToPortfolio(property, Number(e.target.value));
                              e.target.value = '';
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          className="h-10 rounded-full px-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={(e) => {
                            const container = e.currentTarget.parentElement;
                            const input = container ? container.querySelector('input') : null;
                            if (input) {
                              addToPortfolio(property, Number(input.value));
                              input.value = '';
                            }
                          }}
                        >
                          افزودن
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Simulation Chart */}
            {simulationResults.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>نتایج شبیه‌سازی</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simulationResults}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${(value / 1000000).toFixed(1)}م ریال`, 'ارزش پورتفولیو']} />
                        <Line 
                          type="monotone" 
                          dataKey="portfolioValue" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          dot={{ fill: '#8884d8' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portfolio Summary */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-600" />
                  خلاصه پورتفولیو
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {(getTotalInvestment() / 1000000).toFixed(1)}م ریال
                    </div>
                    <div className="text-sm text-slate-600">کل سرمایه‌گذاری</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-emerald-600">
                      {calculatePortfolioReturn().toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-600">بازده مورد انتظار</div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-semibold text-amber-600">
                      {calculateRiskScore()}/3
                    </div>
                    <div className="text-sm text-slate-600">امتیاز ریسک</div>
                  </div>

                  <Progress 
                    value={(getTotalInvestment() / totalBudget) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-slate-500 text-center">
                    {((getTotalInvestment() / totalBudget) * 100).toFixed(1)}% از بودجه استفاده شده
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Items */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>آیتم‌های پورتفولیو</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolioItems.length > 0 ? (
                  <div className="space-y-3">
                    {portfolioItems.map((item) => (
                      <div key={item.property.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{item.property.title}</h5>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromPortfolio(item.property.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            حذف
                          </Button>
                        </div>
                        <div className="text-xs text-slate-600 space-y-1">
                          <div>توکن‌ها: {item.tokens}</div>
                          <div>سرمایه: {(item.investment / 1000000).toFixed(1)}م ریال</div>
                          <div className={`${
                            item.currentValue > item.investment ? 'text-emerald-600' : 
                            item.currentValue < item.investment ? 'text-red-600' : 
                            'text-slate-600'
                          }`}>
                            ارزش فعلی: {(item.currentValue / 1000000).toFixed(1)}م ریال
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">پورتفولیو خالی است</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Simulation Controls */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>کنترل شبیه‌سازی</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={startSimulation}
                  disabled={isSimulating || portfolioItems.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      در حال شبیه‌سازی...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      شروع شبیه‌سازی
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetSimulation}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  بازنشانی
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    onClick={savePortfolio}
                    variant="outline"
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    ذخیره
                  </Button>
                  
                  <Button
                    onClick={exportResults}
                    variant="outline"
                    className="flex-1"
                    disabled={simulationResults.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    خروجی
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Simulation Status */}
            {isSimulating && (
              <Card className="shadow-lg border-0 bg-gradient-to-l from-purple-50 to-indigo-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-800">
                      ماه {currentStep} از {timeHorizon}
                    </div>
                    <Progress 
                      value={(currentStep / timeHorizon) * 100} 
                      className="h-2 mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}