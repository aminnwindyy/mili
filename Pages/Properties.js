import React, { useState, useEffect, useCallback } from "react";
import { Property } from "@/entities/Property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Search, 
  Filter,
  Plus,
  Coins,
  TrendingUp,
  Eye,
  ShoppingCart,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import Modal from "@/components/ui/Modal";
import PropertyQuickView from "@/components/properties/PropertyQuickView";
import DragDropProvider from "@/components/ui/DragDropProvider";
import InvestmentCart from "@/components/ui/InvestmentCart";
import { useSmartCache } from "@/components/ui/SmartCache";
import VoiceSearchButton from "@/components/properties/VoiceSearchButton";
import StickyMobileActions from "@/components/ui/StickyMobileActions";
import { formatCurrency } from "@/components/ui/formatters";

function PropertiesContent() {
  const { data: properties, loading: isLoading, invalidate } = useSmartCache(
    'properties-list',
    () => Property.list("-created_date"),
    []
  );

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(() => {
    try {
      const savedFilters = localStorage.getItem('property_filters');
      return savedFilters ? JSON.parse(savedFilters) : {
        status: "همه",
        property_type: "همه",
        price_range: "همه"
      };
    } catch {
      return { status: "همه", property_type: "همه", price_range: "همه" };
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [sortKey, setSortKey] = useState('newest'); // newest | priceAsc | priceDesc | yieldDesc
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const applyFilters = useCallback(() => {
    let currentProperties = properties || [];
    let filtered = currentProperties;

    if (searchTerm) {
      filtered = filtered.filter(prop => 
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.status !== "همه") filtered = filtered.filter(prop => prop.status === filters.status);
    if (filters.property_type !== "همه") filtered = filtered.filter(prop => prop.property_type === filters.property_type);
    if (filters.price_range !== "همه") {
      const ranges = { 
        "زیر ۱ میلیارد": [0, 10000000000], 
        "۱ تا ۵ میلیارد": [10000000000, 50000000000], 
        "۵ تا ۱۰ میلیارد": [50000000000, 100000000000], 
        "بالای ۱۰ میلیارد": [100000000000, Infinity] 
      };
      if (ranges[filters.price_range]) {
        const [min, max] = ranges[filters.price_range];
        filtered = filtered.filter(prop => prop.total_value >= min && prop.total_value < max);
      }
    }
    setFilteredProperties(filtered);
  }, [properties, searchTerm, filters]);

  useEffect(() => {
    if (properties) applyFilters();
  }, [properties, searchTerm, filters, applyFilters]);

  useEffect(() => {
    localStorage.setItem('property_filters', JSON.stringify(filters));
  }, [filters]);

  const handleDoubleClick = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleRefresh = async () => {
    invalidate();
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // آمار سریع املاک
  const totalProperties = properties?.length || 0;
  const activeProperties = properties?.filter(p => p.status === "در_حال_فروش").length || 0;
  const totalValue = properties?.reduce((sum, prop) => sum + (prop.total_value || 0), 0) || 0;
  const avgReturn = properties?.reduce((sum, prop) => sum + (prop.expected_annual_return || 0), 0) / Math.max(totalProperties, 1) || 0;

  return (
    <div className="p-4 md:p-8 bg-gradient-to-bl from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">املاک قابل توکن‌سازی</h1>
            <p className="text-slate-600">انتخاب و سرمایه‌گذاری در بهترین املاک</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="icon" 
              className="h-12 w-12"
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Link to={createPageUrl("CreateToken")}>
              <Button className="bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hidden md:flex">
                <Plus className="w-4 h-4 mr-2" /> ثبت ملک جدید
              </Button>
            </Link>
          </div>
        </div>

        {/* آمار سریع */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-emerald-50 to-green-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span className="text-2xl font-bold text-emerald-600">{totalProperties}</span>
              </div>
              <p className="text-sm text-slate-600">کل املاک</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-bl from-blue-50 to-indigo-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{activeProperties}</span>
              </div>
              <p className="text-sm text-slate-600">در حال فروش</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-bl from-amber-50 to-yellow-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-amber-600" />
                <span className="text-lg font-bold text-amber-600">
                  {formatCurrency(totalValue, false)}
                </span>
              </div>
              <p className="text-sm text-slate-600">ارزش کل</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-bl from-purple-50 to-pink-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{avgReturn.toFixed(1)}%</span>
              </div>
              <p className="text-sm text-slate-600">بازده میانگین</p>
            </CardContent>
          </Card>
        </div>

        {/* جستجو و فیلتر */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="جستجو در عنوان یا آدرس..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pr-10 border-slate-200 focus:border-blue-500 rounded-xl h-10" 
              />
            </div>
            <VoiceSearchButton onResult={setSearchTerm} />
            <PropertyFilters filters={filters} setFilters={setFilters} />
          </div>
          {/* Sort & Page size */}
          <div className="mt-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-600">مرتب‌سازی:</span>
              <Button variant={sortKey==='newest'?'default':'outline'} size="sm" onClick={()=>setSortKey('newest')}>جدیدترین</Button>
              <Button variant={sortKey==='priceAsc'?'default':'outline'} size="sm" onClick={()=>setSortKey('priceAsc')}>قیمت ↑</Button>
              <Button variant={sortKey==='priceDesc'?'default':'outline'} size="sm" onClick={()=>setSortKey('priceDesc')}>قیمت ↓</Button>
              <Button variant={sortKey==='yieldDesc'?'default':'outline'} size="sm" onClick={()=>setSortKey('yieldDesc')}>بازدهی ↑</Button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-600">در هر صفحه:</span>
              <Button variant={pageSize===9?'default':'outline'} size="sm" onClick={()=>{setPageSize(9);setPage(1);}}>9</Button>
              <Button variant={pageSize===12?'default':'outline'} size="sm" onClick={()=>{setPageSize(12);setPage(1);}}>12</Button>
              <Button variant={pageSize===18?'default':'outline'} size="sm" onClick={()=>{setPageSize(18);setPage(1);}}>18</Button>
            </div>
          </div>
        </div>

        {/* لیست املاک */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-5 bg-slate-200 rounded-lg w-full"></div>
                  <div className="h-4 bg-slate-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-10 w-2/3 bg-slate-200 rounded-lg"></div>
                    <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredProperties && filteredProperties.length > 0 ? (
            // sort & paginate
            (()=>{
              const sorted = [...filteredProperties].sort((a,b)=>{
                switch (sortKey) {
                  case 'priceAsc': return (a.token_price||0)-(b.token_price||0);
                  case 'priceDesc': return (b.token_price||0)-(a.token_price||0);
                  case 'yieldDesc': return (b.expected_annual_return||0)-(a.expected_annual_return||0);
                  default: return 0;
                }
              });
              const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
              const currentPage = Math.min(page, totalPages);
              const paged = sorted.slice((currentPage-1)*pageSize, currentPage*pageSize);
              return paged.map((property) => (
              <PropertyCard key={property.id} property={property} onDoubleClick={() => handleDoubleClick(property)} />
              ));
            })()
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
              <Building2 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">هیچ ملکی یافت نشد</h3>
              <p className="text-slate-500 mb-6">با تغییر فیلترها یا جستجوی دیگر تلاش کنید</p>
              <Link to={createPageUrl("CreateToken")}>
                <Button><Plus className="w-4 h-4 mr-2" />ثبت ملک جدید</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProperties && filteredProperties.length > 0 && (
          (()=>{
            const totalPages = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
            const currentPage = Math.min(page, totalPages);
            return (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" disabled={currentPage===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>قبلی</Button>
                <div className="text-sm text-slate-700">صفحه {currentPage} از {totalPages}</div>
                <Button variant="outline" disabled={currentPage===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>بعدی</Button>
              </div>
            );
          })()
        )}
      </div>

      <InvestmentCart />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`خلاصه وضعیت: ${selectedProperty?.title || ''}`}>
        <PropertyQuickView 
          property={selectedProperty} 
          onClose={handleCloseModal} 
          onInvest={() => handleCloseModal()} 
        />
      </Modal>

      <StickyMobileActions>
        <Link to={createPageUrl("CreateToken")} className="flex-1">
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" /> ثبت ملک
          </Button>
        </Link>
        <Button onClick={() => {}} className="flex-1 bg-gradient-to-l from-emerald-600 to-emerald-700">
          <ShoppingCart className="w-4 h-4 mr-2" /> سبد خرید
        </Button>
      </StickyMobileActions>
    </div>
  );
}

export default function Properties() {
  return (
    <DragDropProvider>
      <PropertiesContent />
    </DragDropProvider>
  );
}