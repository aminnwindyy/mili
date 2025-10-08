import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { 
  Store, 
  Users, 
  Home, 
  Shield, 
  FileText, 
  Calculator,
  Search,
  Star,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Briefcase,
  Wrench,
  Heart,
  Camera,
  Key,
  Building,
  User,
  Calendar
} from 'lucide-react';

const MarketplaceWidget = ({ userId = "demo_user" }) => {
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const categories = [
    { id: 'all', name: 'همه', icon: Store },
    { id: 'consulting', name: 'مشاوره', icon: Users },
    { id: 'legal', name: 'حقوقی', icon: Shield },
    { id: 'insurance', name: 'بیمه', icon: Heart },
    { id: 'accounting', name: 'حسابداری', icon: Calculator },
    { id: 'renovation', name: 'بازسازی', icon: Wrench },
    { id: 'photography', name: 'عکاسی', icon: Camera },
    { id: 'inspection', name: 'بازرسی', icon: Search }
  ];

  useEffect(() => {
    fetchMarketplaceData();
  }, [selectedCategory]);

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);
      
      // Mock services data
      const mockServices = [
        {
          id: 1,
          title: "مشاوره سرمایه‌گذاری ملکی",
          category: "consulting",
          provider: "مرکز مشاوره املاک تهران",
          provider_avatar: "🏢",
          price: 500000,
          price_unit: "session",
          rating: 4.8,
          reviews: 124,
          description: "تحلیل کامل بازار و پیشنهاد بهترین فرصت‌های سرمایه‌گذاری",
          features: ["تحلیل بازار", "پیشنهاد سرمایه‌گذاری", "مدیریت ریسک"],
          availability: "available",
          response_time: "2 ساعت",
          location: "تهران",
          verified: true,
          badge: "Top Rated"
        },
        {
          id: 2,
          title: "بیمه ملک جامع",
          category: "insurance",
          provider: "شرکت بیمه ایران",
          provider_avatar: "🛡️",
          price: 0.02,
          price_unit: "property_value",
          rating: 4.6,
          reviews: 89,
          description: "پوشش کامل بیمه‌ای برای تمام ریسک‌های ملکی",
          features: ["آتش‌سوزی", "زلزله", "سرقت", "آسیب‌های طبیعی"],
          availability: "available",
          response_time: "24 ساعت",
          location: "سراسر کشور",
          verified: true,
          badge: "Official"
        },
        {
          id: 3,
          title: "بازسازی و نوسازی آپارتمان",
          category: "renovation",
          provider: "مجموعه ساختمانی مدرن",
          provider_avatar: "🔨",
          price: 2000000,
          price_unit: "square_meter",
          rating: 4.9,
          reviews: 67,
          description: "بازسازی کامل با بهترین متریال و تضمین کیفیت",
          features: ["طراحی 3D", "متریال باکیفیت", "ضمانت 5 ساله"],
          availability: "limited",
          response_time: "4 ساعت",
          location: "تهران و کرج",
          verified: true,
          badge: "Premium"
        },
        {
          id: 4,
          title: "عکاسی حرفه‌ای از ملک",
          category: "photography",
          provider: "استودیو عکس پرو",
          provider_avatar: "📸",
          price: 800000,
          price_unit: "session",
          rating: 4.7,
          reviews: 45,
          description: "عکاسی و فیلم‌برداری حرفه‌ای برای تبلیغات ملک",
          features: ["عکاسی 360 درجه", "ویدیو تبلیغاتی", "ادیت حرفه‌ای"],
          availability: "available",
          response_time: "1 ساعت",
          location: "تهران",
          verified: false,
          badge: null
        },
        {
          id: 5,
          title: "وکیل متخصص املاک",
          category: "legal",
          provider: "دفتر وکالت دکتر احمدی",
          provider_avatar: "⚖️",
          price: 1500000,
          price_unit: "hour",
          rating: 4.9,
          reviews: 156,
          description: "مشاوره حقوقی و انجام امور قانونی معاملات ملکی",
          features: ["قراردادنامه", "انتقال سند", "حل اختلافات"],
          availability: "busy",
          response_time: "6 ساعت",
          location: "تهران",
          verified: true,
          badge: "Expert"
        },
        {
          id: 6,
          title: "بازرسی فنی ملک",
          category: "inspection",
          provider: "مرکز بازرسی فنی ایران",
          provider_avatar: "🔍",
          price: 1200000,
          price_unit: "inspection",
          rating: 4.8,
          reviews: 93,
          description: "بررسی کامل فنی و ساختاری ملک قبل از خرید",
          features: ["بررسی سازه", "تاسیسات", "مستندات کامل"],
          availability: "available",
          response_time: "3 ساعت",
          location: "سراسر کشور",
          verified: true,
          badge: "Certified"
        }
      ];

      const mockProfessionals = [
        {
          id: 1,
          name: "مهندس سارا محمدی",
          profession: "مشاور سرمایه‌گذاری",
          avatar: "👩‍💼",
          experience: 8,
          rating: 4.9,
          completed_projects: 234,
          specialties: ["تحلیل بازار", "ارزیابی ملک", "سرمایه‌گذاری"],
          hourly_rate: 400000,
          available: true,
          response_time: "1 ساعت",
          languages: ["فارسی", "انگلیسی"],
          verified: true,
          badge: "Top Expert"
        },
        {
          id: 2,
          name: "دکتر رضا قاسمی",
          profession: "وکیل املاک",
          avatar: "👨‍⚖️",
          experience: 12,
          rating: 4.8,
          completed_projects: 456,
          specialties: ["قراردادها", "انتقال سند", "حل اختلاف"],
          hourly_rate: 800000,
          available: false,
          response_time: "24 ساعت",
          languages: ["فارسی", "عربی", "انگلیسی"],
          verified: true,
          badge: "Senior Lawyer"
        },
        {
          id: 3,
          name: "معمار مریم کریمی",
          profession: "طراح داخلی",
          avatar: "👩‍🎨",
          experience: 6,
          rating: 4.7,
          completed_projects: 123,
          specialties: ["طراحی داخلی", "بازسازی", "دکوراسیون"],
          hourly_rate: 350000,
          available: true,
          response_time: "2 ساعت",
          languages: ["فارسی", "انگلیسی"],
          verified: false,
          badge: null
        }
      ];

      const filteredServices = selectedCategory === 'all' 
        ? mockServices 
        : mockServices.filter(service => service.category === selectedCategory);

      setServices(filteredServices);
      setProfessionals(mockProfessionals);
      
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async () => {
    try {
      // Mock booking
      alert('درخواست شما با موفقیت ثبت شد. به زودی با شما تماس گرفته خواهد شد.');
      setShowServiceModal(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Error booking service:', error);
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : Store;
  };

  const formatPrice = (price, unit) => {
    if (unit === 'property_value') {
      return `${(price * 100).toFixed(1)}% ارزش ملک`;
    }
    return `${price.toLocaleString('fa-IR')} تومان ${unit === 'session' ? 'برای هر جلسه' : unit === 'hour' ? 'برای هر ساعت' : unit === 'square_meter' ? 'برای هر متر مربع' : ''}`;
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

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="w-5 h-5 ml-2 text-purple-600" />
            بازار خدمات ملکی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-1 space-x-reverse"
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="w-5 h-5 ml-2 text-blue-600" />
            خدمات موجود
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service) => {
            const CategoryIcon = getCategoryIcon(service.category);
            return (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <CategoryIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 space-x-reverse mb-1">
                        <h4 className="font-semibold text-gray-900">{service.title}</h4>
                        {service.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        )}
                        {service.badge && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            {service.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Building className="w-4 h-4" />
                          <span>{service.provider}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <MapPin className="w-4 h-4" />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Clock className="w-4 h-4" />
                          <span>{service.response_time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(service.price, service.price_unit)}
                    </p>
                    <div className="flex items-center space-x-1 space-x-reverse mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{service.rating}</span>
                      <span className="text-sm text-gray-600">({service.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {service.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Badge 
                    variant={service.availability === 'available' ? 'default' : 
                            service.availability === 'limited' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {service.availability === 'available' ? 'موجود' :
                     service.availability === 'limited' ? 'محدود' : 'پر'}
                  </Badge>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedService(service);
                        setShowServiceModal(true);
                      }}
                    >
                      <MessageCircle className="w-4 h-4 ml-1" />
                      تماس
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedService(service);
                        setShowServiceModal(true);
                      }}
                      disabled={service.availability === 'busy'}
                    >
                      رزرو
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Top Professionals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 ml-2 text-green-600" />
            متخصصان برتر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {professionals.map((professional) => (
            <div key={professional.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="text-3xl">{professional.avatar}</div>
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <h4 className="font-semibold text-gray-900">{professional.name}</h4>
                      {professional.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                      {professional.badge && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          {professional.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{professional.profession}</p>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500 mt-1">
                      <span>{professional.experience} سال سابقه</span>
                      <span>{professional.completed_projects} پروژه</span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-1 space-x-reverse mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{professional.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {professional.hourly_rate.toLocaleString('fa-IR')} تومان/ساعت
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {professional.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    professional.available ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={professional.available ? 'text-green-600' : 'text-red-600'}>
                    {professional.available ? 'موجود' : 'مشغول'}
                  </span>
                  <span className="text-gray-500">
                    پاسخ در {professional.response_time}
                  </span>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 ml-1" />
                    تماس
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 ml-1" />
                    پیام
                  </Button>
                  <Button size="sm" disabled={!professional.available}>
                    رزرو
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Service Booking Modal */}
      {showServiceModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 ml-2 text-blue-600" />
                رزرو خدمات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-1">{selectedService.title}</h4>
                <p className="text-sm text-blue-700">{selectedService.provider}</p>
                <p className="text-sm text-blue-800 mt-2">
                  قیمت: {formatPrice(selectedService.price, selectedService.price_unit)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات مورد نیاز (اختیاری)
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                  placeholder="لطفاً توضیحات خود را وارد کنید..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  زمان مورد نظر
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    زمان پاسخ‌دهی: {selectedService.response_time}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button 
                  onClick={handleBookService}
                  className="flex-1"
                >
                  تایید رزرو
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowServiceModal(false)}
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

export default MarketplaceWidget;