import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Building2, 
  TrendingUp, 
  Coins,
  Heart,
  Share2,
  Calculator,
  Eye,
  DollarSign,
  Calendar,
  User,
  Phone
} from 'lucide-react';
import { formatCurrency } from '@/components/ui/formatters';
import RelatedProperties from './RelatedProperties';

export default function PropertyQuickView({ property, onClose, onInvest }) {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!property) return null;

  const tokensForAmount = investmentAmount ? 
    Math.floor(parseFloat(investmentAmount) * 10 / (property.token_price || 1)) : 0;

  const estimatedAnnualReturn = investmentAmount ?
    (parseFloat(investmentAmount) * 10 * (property.expected_annual_return || 15) / 100) : 0;

  const handleInvestment = () => {
    if (tokensForAmount > 0) {
      // Trigger investment process
      window.dispatchEvent(new CustomEvent('investmentStarted'));
      onInvest({
        property,
        amount: parseFloat(investmentAmount) * 10,
        tokens: tokensForAmount
      });
      onClose();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `املاک ${property.title} در ${property.address}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="max-w-4xl mx-auto max-h-[80vh] overflow-y-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative">
            <img 
              src={property.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop"}
              alt={property.title}
              className="w-full h-64 object-cover rounded-xl"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/80 backdrop-blur-sm"
                onClick={() => setIsInWishlist(!isInWishlist)}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/80 backdrop-blur-sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Property Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{property.title}</h2>
                <div className="flex items-center gap-1 text-slate-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}</span>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">
                {property.property_type}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                <div className="text-sm text-slate-600">ارزش کل</div>
                <div className="font-bold text-slate-900">
                  {formatCurrency(property.total_value)}
                </div>
              </div>
              
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Coins className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                <div className="text-sm text-slate-600">قیمت توکن</div>
                <div className="font-bold text-slate-900">
                  {formatCurrency(property.token_price)}
                </div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                <div className="text-sm text-slate-600">بازدهی سالانه</div>
                <div className="font-bold text-slate-900">
                  {property.expected_annual_return || 15}%
                </div>
              </div>
              
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <Building2 className="w-6 h-6 mx-auto mb-1 text-amber-600" />
                <div className="text-sm text-slate-600">توکن موجود</div>
                <div className="font-bold text-slate-900">
                  {property.available_tokens || property.total_tokens}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="space-y-4">
            <div className="flex border-b border-slate-200">
              {[
                { id: 'overview', label: 'نمای کلی' },
                { id: 'details', label: 'جزئیات' },
                { id: 'documents', label: 'اسناد' },
                { id: 'location', label: 'موقعیت' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[200px]">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    {property.description || "این ملک فرصت عالی برای سرمایه‌گذاری در بازار املاک است. با موقعیت استراتژیک و پتانسیل رشد بالا، این پروژه برای سرمایه‌گذاران محتاط و جسور مناسب است."}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900">مشخصات کلیدی</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-slate-600">نوع ملک:</span>
                          <span className="font-medium">{property.property_type}</span>
                        </li>
                        {property.area && (
                          <li className="flex justify-between">
                            <span className="text-slate-600">متراژ:</span>
                            <span className="font-medium">{property.area} متر مربع</span>
                          </li>
                        )}
                        <li className="flex justify-between">
                          <span className="text-slate-600">وضعیت:</span>
                          <Badge variant="outline">
                            {property.status === "در_حال_فروش" ? "در حال فروش" : property.status}
                          </Badge>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900">اطلاعات مالی</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-slate-600">حداقل سرمایه:</span>
                          <span className="font-medium text-emerald-600">
                            {formatCurrency(property.token_price)}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-600">بازدهی ماهانه:</span>
                          <span className="font-medium text-emerald-600">
                            {((property.expected_annual_return || 15) / 12).toFixed(1)}%
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-600">دوره سرمایه‌گذاری:</span>
                          <span className="font-medium">بلندمدت</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">اطلاعات مالک</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-500" />
                          <span>{property.owner_name || "نامشخص"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span>{property.owner_contact || "در دسترس نیست"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">تاریخ‌های مهم</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span>تاریخ ثبت: {new Date(property.created_date).toLocaleDateString('fa-IR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span>آخرین به‌روزرسانی: {new Date(property.updated_date).toLocaleDateString('fa-IR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'documents' && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">مستندات ملک</h4>
                  {property.documents && property.documents.length > 0 ? (
                    <div className="grid gap-3">
                      {property.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Eye className="w-4 h-4 text-slate-500" />
                          <span className="flex-1">{doc.title}</span>
                          <Button variant="outline" size="sm">مشاهده</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500">اسناد در حال آپلود است...</p>
                  )}
                </div>
              )}
              
              {activeTab === 'location' && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">موقعیت مکانی</h4>
                  <div className="bg-slate-100 rounded-lg p-8 text-center">
                    <MapPin className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-600">نقشه در حال بارگذاری...</p>
                    <p className="text-sm text-slate-500 mt-2">{property.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Investment Calculator */}
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-emerald-50 to-green-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="w-5 h-5 text-emerald-600" />
                محاسبه سرمایه‌گذاری
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  مبلغ سرمایه‌گذاری (تومان)
                </label>
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="مثلاً ۱۰۰۰۰۰۰"
                  className="text-left"
                />
              </div>
              
              {investmentAmount && (
                <div className="space-y-3 p-3 bg-white rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">تعداد توکن:</span>
                    <span className="font-semibold">{tokensForAmount.toLocaleString('fa-IR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">درآمد سالانه تخمینی:</span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(estimatedAnnualReturn)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">درآمد ماهانه تخمینی:</span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(estimatedAnnualReturn / 12)}
                    </span>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleInvestment}
                disabled={!investmentAmount || tokensForAmount === 0}
                className="w-full bg-gradient-to-l from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                شروع سرمایه‌گذاری
              </Button>
              
              <p className="text-xs text-slate-500 text-center">
                حداقل مبلغ سرمایه‌گذاری: {formatCurrency(property.token_price)}
              </p>
            </CardContent>
          </Card>

          {/* Related Properties */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <RelatedProperties 
                currentProperty={property} 
                onPropertySelect={(prop) => {
                  // Trigger property viewed event
                  window.dispatchEvent(new CustomEvent('propertyViewed'));
                  // Here you could open another quick view or navigate
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}