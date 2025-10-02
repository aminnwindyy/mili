import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Camera, 
  FileText, 
  DollarSign, 
  Users, 
  Calendar,
  Upload,
  Check,
  AlertCircle,
  Home,
  Briefcase,
  ShoppingBag,
  Warehouse,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';

export default function CreateToken() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // اطلاعات کلی ملک
    title: '',
    description: '',
    property_type: '',
    area: '',
    rooms: '',
    year_built: '',
    
    // موقعیت مکانی
    province: '',
    city: '',
    district: '',
    address: '',
    postal_code: '',
    
    // اطلاعات مالی
    total_value: '',
    token_price: '',
    min_investment: '',
    expected_yield: '',
    rental_income: '',
    
    // مدارک
    ownership_document: null,
    property_images: [],
    valuation_report: null,
    rental_agreement: null,
    
    // اطلاعات مالک
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    owner_national_id: '',
    
    // تنظیمات توکن
    token_symbol: '',
    total_tokens: '',
    sale_start_date: '',
    sale_end_date: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyTypes = [
    { value: 'residential', label: 'مسکونی', icon: Home },
    { value: 'commercial', label: 'تجاری', icon: Briefcase },
    { value: 'retail', label: 'خرده‌فروشی', icon: ShoppingBag },
    { value: 'industrial', label: 'صنعتی', icon: Warehouse }
  ];

  const provinces = [
    'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی', 'خوزستان', 
    'مازندران', 'کرمان', 'آذربایجان غربی', 'گیلان', 'کردستان', 'همدان'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = (field, files) => {
    if (field === 'property_images') {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], ...Array.from(files)] }));
    } else {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title) newErrors.title = 'عنوان ملک الزامی است';
        if (!formData.property_type) newErrors.property_type = 'نوع ملک الزامی است';
        if (!formData.area) newErrors.area = 'متراژ الزامی است';
        break;
      case 2:
        if (!formData.province) newErrors.province = 'استان الزامی است';
        if (!formData.city) newErrors.city = 'شهر الزامی است';
        if (!formData.address) newErrors.address = 'آدرس الزامی است';
        break;
      case 3:
        if (!formData.total_value) newErrors.total_value = 'ارزش کل ملک الزامی است';
        if (!formData.token_price) newErrors.token_price = 'قیمت هر توکن الزامی است';
        if (!formData.expected_yield) newErrors.expected_yield = 'بازدهی مورد انتظار الزامی است';
        break;
      case 4:
        if (!formData.ownership_document) newErrors.ownership_document = 'سند مالکیت الزامی است';
        if (formData.property_images.length === 0) newErrors.property_images = 'حداقل یک عکس از ملک الزامی است';
        break;
      case 5:
        if (!formData.owner_name) newErrors.owner_name = 'نام مالک الزامی است';
        if (!formData.owner_phone) newErrors.owner_phone = 'شماره تماس الزامی است';
        if (!formData.owner_email) newErrors.owner_email = 'ایمیل الزامی است';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setIsSubmitting(true);
    
    // شبیه‌سازی ارسال فرم
    setTimeout(() => {
      setCurrentStep(6);
      setIsSubmitting(false);
      
      // ذخیره در localStorage برای نمایش در پورتال مالکین
      const existingProperties = JSON.parse(localStorage.getItem('owner-properties') || '[]');
      const newProperty = {
        id: Date.now(),
        ...formData,
        status: 'در_حال_بررسی',
        created_at: new Date().toISOString(),
        collected: 0
      };
      existingProperties.push(newProperty);
      localStorage.setItem('owner-properties', JSON.stringify(existingProperties));
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                عنوان ملک *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="مثال: آپارتمان لوکس ولیعصر"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-slate-300'}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                نوع ملک *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {propertyTypes.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('property_type', type.value)}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        formData.property_type === type.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <IconComponent className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.property_type && <p className="text-red-500 text-sm mt-1">{errors.property_type}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  متراژ (متر مربع) *
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="120"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.area ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  تعداد اتاق
                </label>
                <select
                  value={formData.rooms}
                  onChange={(e) => handleInputChange('rooms', e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="1">1 اتاق</option>
                  <option value="2">2 اتاق</option>
                  <option value="3">3 اتاق</option>
                  <option value="4">4 اتاق</option>
                  <option value="5+">5+ اتاق</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  سال ساخت
                </label>
                <input
                  type="number"
                  value={formData.year_built}
                  onChange={(e) => handleInputChange('year_built', e.target.value)}
                  placeholder="1400"
                  min="1300"
                  max="1403"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                توضیحات ملک
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="توضیحات کاملی از ملک، امکانات، موقعیت و ویژگی‌های خاص آن ارائه دهید..."
                rows={4}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  استان *
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.province ? 'border-red-500' : 'border-slate-300'}`}
                >
                  <option value="">انتخاب استان</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  شهر *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="نام شهر"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                منطقه/محله
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                placeholder="نام منطقه یا محله"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                آدرس کامل *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="آدرس دقیق ملک را وارد کنید..."
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-slate-300'}`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                کد پستی
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="1234567890"
                maxLength={10}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 3:
  return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ارزش کل ملک (ریال) *
                </label>
                <input
                  type="number"
                  value={formData.total_value}
                  onChange={(e) => handleInputChange('total_value', e.target.value)}
                  placeholder="5000000000"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.total_value ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.total_value && <p className="text-red-500 text-sm mt-1">{errors.total_value}</p>}
                <p className="text-xs text-slate-500 mt-1">
                  {formData.total_value && `معادل ${(formData.total_value / 10000000000).toFixed(1)} میلیارد تومان`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  قیمت هر توکن (ریال) *
                </label>
                <input
                  type="number"
                  value={formData.token_price}
                  onChange={(e) => handleInputChange('token_price', e.target.value)}
                  placeholder="50000000"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.token_price ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.token_price && <p className="text-red-500 text-sm mt-1">{errors.token_price}</p>}
                <p className="text-xs text-slate-500 mt-1">
                  {formData.token_price && `معادل ${(formData.token_price / 100000000).toFixed(1)} میلیون تومان`}
                </p>
              </div>
        </div>
        
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  حداقل سرمایه‌گذاری (ریال)
                </label>
                <input
                  type="number"
                  value={formData.min_investment}
                  onChange={(e) => handleInputChange('min_investment', e.target.value)}
                  placeholder="100000000"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.min_investment && `معادل ${(formData.min_investment / 100000000).toFixed(1)} میلیون تومان`}
                </p>
                </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  بازدهی مورد انتظار (درصد سالانه) *
                </label>
                <input
                  type="number"
                  value={formData.expected_yield}
                  onChange={(e) => handleInputChange('expected_yield', e.target.value)}
                  placeholder="15"
                  step="0.1"
                  min="0"
                  max="100"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.expected_yield ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.expected_yield && <p className="text-red-500 text-sm mt-1">{errors.expected_yield}</p>}
              </div>
                </div>

                <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                درآمد اجاره ماهانه (ریال)
              </label>
              <input
                type="number"
                value={formData.rental_income}
                onChange={(e) => handleInputChange('rental_income', e.target.value)}
                placeholder="50000000"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">
                {formData.rental_income && `معادل ${(formData.rental_income / 100000000).toFixed(1)} میلیون تومان ماهانه`}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">نکات مهم:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• ارزش ملک باید بر اساس کارشناسی رسمی باشد</li>
                    <li>• بازدهی باید واقع‌بینانه و قابل دستیابی باشد</li>
                    <li>• قیمت توکن باید متناسب با ارزش کل ملک باشد</li>
                  </ul>
                </div>
              </div>
            </div>
                </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                سند مالکیت *
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.ownership_document ? 'border-red-500' : 'border-slate-300'}`}>
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-600 mb-2">فایل سند مالکیت را آپلود کنید</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('ownership_document', e.target.files)}
                  className="hidden"
                  id="ownership-upload"
                />
                <label htmlFor="ownership-upload" className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  انتخاب فایل
                </label>
                {formData.ownership_document && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.ownership_document.name}</p>
                )}
              </div>
              {errors.ownership_document && <p className="text-red-500 text-sm mt-1">{errors.ownership_document}</p>}
            </div>

                <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                تصاویر ملک *
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.property_images ? 'border-red-500' : 'border-slate-300'}`}>
                <Camera className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-600 mb-2">تصاویر با کیفیت از ملک آپلود کنید</p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => handleFileUpload('property_images', e.target.files)}
                  className="hidden"
                  id="images-upload"
                />
                <label htmlFor="images-upload" className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  انتخاب تصاویر
                </label>
                {formData.property_images.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.property_images.length} تصویر انتخاب شده</p>
                )}
              </div>
              {errors.property_images && <p className="text-red-500 text-sm mt-1">{errors.property_images}</p>}
                </div>

                <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                گزارش کارشناسی
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-600 mb-2">گزارش کارشناسی رسمی (اختیاری)</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload('valuation_report', e.target.files)}
                  className="hidden"
                  id="valuation-upload"
                />
                <label htmlFor="valuation-upload" className="cursor-pointer bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                  انتخاب فایل
                </label>
                {formData.valuation_report && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.valuation_report.name}</p>
                )}
                </div>
                </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                قرارداد اجاره
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-600 mb-2">قرارداد اجاره فعلی (در صورت وجود)</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('rental_agreement', e.target.files)}
                  className="hidden"
                  id="rental-upload"
                />
                <label htmlFor="rental-upload" className="cursor-pointer bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                  انتخاب فایل
                </label>
                {formData.rental_agreement && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.rental_agreement.name}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  نام و نام خانوادگی *
                </label>
                <input
                  type="text"
                  value={formData.owner_name}
                  onChange={(e) => handleInputChange('owner_name', e.target.value)}
                  placeholder="نام کامل مالک"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.owner_name ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.owner_name && <p className="text-red-500 text-sm mt-1">{errors.owner_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  کد ملی
                </label>
                <input
                  type="text"
                  value={formData.owner_national_id}
                  onChange={(e) => handleInputChange('owner_national_id', e.target.value)}
                  placeholder="1234567890"
                  maxLength={10}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  شماره تماس *
                </label>
                <input
                  type="tel"
                  value={formData.owner_phone}
                  onChange={(e) => handleInputChange('owner_phone', e.target.value)}
                  placeholder="09123456789"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.owner_phone ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.owner_phone && <p className="text-red-500 text-sm mt-1">{errors.owner_phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ایمیل *
                </label>
                <input
                  type="email"
                  value={formData.owner_email}
                  onChange={(e) => handleInputChange('owner_email', e.target.value)}
                  placeholder="example@email.com"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.owner_email ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.owner_email && <p className="text-red-500 text-sm mt-1">{errors.owner_email}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  نماد توکن
                </label>
                <input
                  type="text"
                  value={formData.token_symbol}
                  onChange={(e) => handleInputChange('token_symbol', e.target.value.toUpperCase())}
                  placeholder="PROP001"
                  maxLength={10}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">نماد یکتا برای توکن ملک شما</p>
              </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  تعداد کل توکن‌ها
                </label>
                <input
                  type="number"
                  value={formData.total_tokens}
                  onChange={(e) => handleInputChange('total_tokens', e.target.value)}
                  placeholder="100"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                  </div>
                </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  تاریخ شروع فروش
                </label>
                <input
                  type="date"
                  value={formData.sale_start_date}
                  onChange={(e) => handleInputChange('sale_start_date', e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  تاریخ پایان فروش
                </label>
                <input
                  type="date"
                  value={formData.sale_end_date}
                  onChange={(e) => handleInputChange('sale_end_date', e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
                  </div>
                </div>
        );

      case 6:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">درخواست شما ثبت شد!</h3>
            <p className="text-slate-600 mb-6">
              درخواست توکن‌سازی ملک شما با موفقیت ثبت شد و در حال بررسی توسط تیم کارشناسان ما است.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                <strong>مراحل بعدی:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• بررسی مدارک توسط تیم حقوقی (1-2 روز کاری)</li>
                <li>• کارشناسی ملک توسط کارشناس رسمی (3-5 روز کاری)</li>
                <li>• تایید نهایی و شروع فرآیند توکن‌سازی (1-2 روز کاری)</li>
              </ul>
            </div>
            <Button 
              onClick={() => window.location.href = '/OwnerPortal'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              بازگشت به پورتال مالکین
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: 'اطلاعات کلی', icon: Building2 },
    { number: 2, title: 'موقعیت مکانی', icon: MapPin },
    { number: 3, title: 'اطلاعات مالی', icon: DollarSign },
    { number: 4, title: 'مدارک', icon: FileText },
    { number: 5, title: 'تکمیل اطلاعات', icon: Users },
    { number: 6, title: 'تایید', icon: Check }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            ثبت ملک برای توکن‌سازی
          </h1>
          <p className="text-slate-600">
            ملک خود را به صورت دیجیتال توکن‌سازی کنید و از مزایای سرمایه‌گذاری جمعی بهره‌مند شوید
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-purple-600 text-white' :
                    'bg-slate-200 text-slate-500'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs text-center ${isActive ? 'text-purple-600 font-medium' : 'text-slate-500'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
                </div>

        {/* Form Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              مرحله قبل
            </Button>
            
            {currentStep < 5 ? (
              <Button
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                مرحله بعد
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال ثبت...
                  </>
                ) : (
                  <>
                    ثبت درخواست
                    <Check className="w-4 h-4" />
              </>
            )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}