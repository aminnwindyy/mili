import React, { useState, useEffect } from "react";
import { TREF } from "@/entities/TREF";
import { Property } from "@/entities/Property";
import { Investment } from "@/entities/Investment";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, 
  TrendingUp, 
  Building2,
  Users,
  Calendar,
  DollarSign,
  Search,
  Plus,
  Eye,
  Heart,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TREFs() {
  const [trefs, setTrefs] = useState([]);
  const [myInvestments, setMyInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTref, setSelectedTref] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userData, trefsData] = await Promise.all([
        User.me().catch(() => null),
        TREF.list("-created_date")
      ]);
      
      setUser(userData);
      setTrefs(trefsData);
      
      if (userData) {
        const investments = await Investment.filter({ investor_email: userData.email });
        setMyInvestments(investments);
      }
    } catch (error) {
      console.error("Error loading TREFs:", error);
    }
    setIsLoading(false);
  };

  const handleInvestment = async (tref) => {
    if (!user) {
      alert("لطفاً ابتدا وارد حساب کاربری خود شوید");
      return;
    }
    
    if (!investmentAmount || parseFloat(investmentAmount) < tref.token_price) {
      alert(`حداقل مبلغ سرمایه‌گذاری ${(tref.token_price / 1000000).toFixed(1)} میلیون ریال است`);
      return;
    }

    try {
      const units = Math.floor(parseFloat(investmentAmount) / tref.token_price);
      const investmentData = {
        property_id: tref.id,
        investor_email: user.email,
        tokens_purchased: units,
        total_amount: units * tref.token_price,
        purchase_date: new Date().toISOString().split('T')[0],
        status: "فعال"
      };

      await Investment.create(investmentData);
      
      // Update TREF collected amount
      await TREF.update(tref.id, {
        collected_amount: (tref.collected_amount || 0) + investmentData.total_amount,
        available_units: tref.available_units - units
      });

      alert("سرمایه‌گذاری با موفقیت انجام شد!");
      setSelectedTref(null);
      setInvestmentAmount("");
      loadData();
    } catch (error) {
      alert("خطا در انجام سرمایه‌گذاری");
    }
  };

  const filteredTrefs = trefs.filter(tref =>
    searchTerm === "" || 
    tref.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tref.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              صندوق‌های ملکی (TREF)
            </h1>
            <p className="text-slate-600">سرمایه‌گذاری متنوع و کم ریسک در بازار املاک</p>
          </div>
          <Button className="bg-gradient-to-l from-blue-600 to-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            ایجاد صندوق
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-blue-50">
            <CardContent className="p-6 text-center">
              <PieChart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-slate-900">{trefs.length}</div>
              <div className="text-sm text-slate-600">صندوق فعال</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-emerald-50">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <div className="text-2xl font-bold text-slate-900">
                {((trefs.reduce((sum, t) => sum + (t.collected_amount || 0), 0)) / 1000000000).toFixed(1)}میلیارد
              </div>
              <div className="text-sm text-slate-600">سرمایه جمع‌آوری شده</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-purple-50">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-slate-900">
                {trefs.length > 0 ? (trefs.reduce((sum, t) => sum + (t.expected_annual_yield || 0), 0) / trefs.length).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-slate-600">میانگین بازدهی</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-amber-50">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <div className="text-2xl font-bold text-slate-900">
                {myInvestments.length}
              </div>
              <div className="text-sm text-slate-600">سرمایه‌گذاری من</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                placeholder="جستجو در صندوق‌های ملکی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* TREFs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTrefs.map((tref) => {
            const progressPercentage = tref.target_amount ? (tref.collected_amount / tref.target_amount) * 100 : 0;
            const isInvested = myInvestments.some(inv => inv.property_id === tref.id);
            
            return (
              <Card key={tref.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-blue-50 to-indigo-50 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gradient-to-bl from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="text-slate-400 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-slate-400 hover:text-amber-500">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{tref.name}</CardTitle>
                  <p className="text-slate-600 text-sm line-clamp-2">{tref.description}</p>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">نوع صندوق:</span>
                      <Badge variant="outline">{tref.fund_type}</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">بازدهی سالانه:</span>
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {tref.expected_annual_yield}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">حداقل سرمایه:</span>
                      <span className="font-semibold">{(tref.token_price / 1000000).toFixed(1)}م ریال</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">کارمزد مدیریت:</span>
                      <span className="font-semibold text-slate-900">{tref.management_fee || 2}%</span>
                    </div>

                    {tref.manager_name && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">مدیر صندوق:</span>
                        <span className="font-semibold text-slate-900">{tref.manager_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">پیشرفت جذب سرمایه</span>
                      <span className="text-sm font-semibold">{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{((tref.collected_amount || 0) / 1000000000).toFixed(1)}میلیارد</span>
                      <span>{(tref.target_amount / 1000000000).toFixed(1)}میلیارد</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isInvested && (
                    <Badge className="bg-emerald-100 text-emerald-800 mb-4">
                      سرمایه‌گذاری شده
                    </Badge>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-l from-blue-600 to-blue-700"
                      onClick={() => setSelectedTref(tref)}
                      disabled={tref.status === "بسته"}
                    >
                      سرمایه‌گذاری
                    </Button>
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Investment Modal */}
        {selectedTref && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader>
                <CardTitle>سرمایه‌گذاری در {selectedTref.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    مبلغ سرمایه‌گذاری (ریال)
                  </label>
                  <Input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder={`حداقل ${(selectedTref.token_price / 1000000).toFixed(1)} میلیون ریال`}
                  />
                  {investmentAmount && (
                    <p className="text-sm text-slate-500 mt-1">
                      واحدهای قابل خرید: {Math.floor(parseFloat(investmentAmount) / selectedTref.token_price)}
                    </p>
                  )}
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span>بازدهی سالانه:</span>
                    <span className="font-semibold text-emerald-600">{selectedTref.expected_annual_yield}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>کارمزد مدیریت:</span>
                    <span className="font-semibold">{selectedTref.management_fee || 2}%</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleInvestment(selectedTref)}
                    className="flex-1 bg-gradient-to-l from-emerald-600 to-emerald-700"
                  >
                    تایید سرمایه‌گذاری
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedTref(null)}>
                    انصراف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTrefs.length === 0 && (
          <Card className="shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <PieChart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                صندوقی یافت نشد
              </h3>
              <p className="text-slate-500">
                در حال حاضر صندوق ملکی با این مشخصات وجود ندارد
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}