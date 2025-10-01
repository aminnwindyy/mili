import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Property } from "@/entities/Property";
import { TREF } from "@/entities/TREF";
import { Watchlist } from "@/entities/Watchlist";
import { User } from "@/entities/User";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { 
  Search, 
  Filter,
  Heart,
  Building2,
  TrendingUp,
  MapPin,
  Star,
  Eye,
  PieChart,
  Coins,
  Users,
  Calendar,
  Target,
  ArrowRight
} from "lucide-react";

export default function Explore() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [trefs, setTrefs] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "همه", property_type: "همه", price_range: "همه" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userData, propertiesData, trefsData, watchlistData] = await Promise.all([
        User.me().catch(() => null),
        Property.list("-created_date"),
        TREF.list("-created_date"),
        User.me().then(user => Watchlist.filter({ user_email: user.email })).catch(() => [])
      ]);
      
      setUser(userData);
      setProperties(propertiesData);
      setTrefs(trefsData);
      setWatchlist(watchlistData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const toggleWatchlist = async (itemId, itemType) => {
    if (!user) {
      alert("برای افزودن به علاقه‌مندی‌ها ابتدا وارد حساب شوید");
      return;
    }
    
    try {
      const existingItem = watchlist.find(w => 
        (itemType === 'property' ? w.property_id : w.tref_id) === itemId
      );
      
      if (existingItem) {
        await Watchlist.delete(existingItem.id);
        setWatchlist(watchlist.filter(w => w.id !== existingItem.id));
      } else {
        const newItem = {
          user_email: user.email,
          item_type: itemType,
          ...(itemType === 'property' ? { property_id: itemId } : { tref_id: itemId })
        };
        const created = await Watchlist.create(newItem);
        setWatchlist([...watchlist, created]);
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  };

  const isInWatchlist = (itemId, itemType) => {
    return watchlist.some(w => 
      (itemType === 'property' ? w.property_id : w.tref_id) === itemId
    );
  };

  const filteredProperties = properties.filter(prop => {
    if (!(activeTab === "all" || activeTab === "properties")) return false;
    const matchesSearch =
      searchTerm === "" ||
      prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === "همه" || prop.status === filters.status;
    const matchesType = filters.property_type === "همه" || prop.property_type === filters.property_type;

    let matchesPrice = true;
    if (filters.price_range !== "همه") {
      const totalValue = Number(prop.total_value || 0);
      switch (filters.price_range) {
        case "زیر ۱ میلیارد":
          matchesPrice = totalValue < 1_000_000_000;
          break;
        case "۱ تا ۵ میلیارد":
          matchesPrice = totalValue >= 1_000_000_000 && totalValue < 5_000_000_000;
          break;
        case "۵ تا ۱۰ میلیارد":
          matchesPrice = totalValue >= 5_000_000_000 && totalValue < 10_000_000_000;
          break;
        case "بالای ۱۰ میلیارد":
          matchesPrice = totalValue >= 10_000_000_000;
          break;
        default:
          matchesPrice = true;
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesPrice;
  });

  const filteredTrefs = trefs.filter(tref =>
    (activeTab === "all" || activeTab === "trefs") &&
    (searchTerm === "" || 
     tref.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-emerald-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            کاوش در فرصت‌های <span className="text-emerald-600">سرمایه‌گذاری</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            بهترین املاک و صندوق‌های سرمایه‌گذاری را کشف کنید
          </p>
        </div>

        {/* Search and Filter */
        }
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="جستجو در املاک و صندوق‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-12"
                />
              </div>
              <div className="flex gap-2 items-center">
                <PropertyFilters filters={filters} setFilters={setFilters} />
                <Button variant="outline" onClick={() => navigate('/PortfolioSimulator')}>
                  <Target className="w-4 h-4 mr-2" />
                  شبیه‌ساز
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full md:w-auto p-1 rounded-full bg-white/80 backdrop-blur border border-slate-200 shadow-sm flex gap-1">
            <TabsTrigger 
              value="all" 
              className="px-5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
            >
              همه
              <span className="mr-2 inline-flex items-center justify-center h-5 min-w-[1.75rem] px-2 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 group-aria-selected:bg-white/20 group-aria-selected:text-white">
                {properties.length + trefs.length}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="properties" 
              className="px-5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
            >
              املاک
              <span className="mr-2 inline-flex items-center justify-center h-5 min-w-[1.75rem] px-2 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 group-aria-selected:bg-white/20 group-aria-selected:text-white">
                {properties.length}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="trefs" 
              className="px-5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
            >
              صندوق‌ها
              <span className="mr-2 inline-flex items-center justify-center h-5 min-w-[1.75rem] px-2 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 group-aria-selected:bg-white/20 group-aria-selected:text-white">
                {trefs.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Properties */}
          {(activeTab === "all" || activeTab === "properties") &&
            filteredProperties.map((property) => (
              <Card key={property.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={property.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=240&fit=crop"}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500 text-white">
                      {property.property_type}
                    </Badge>
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    className={`absolute top-4 left-4 w-8 h-8 ${isInWatchlist(property.id, 'property') ? 'bg-red-500 text-white' : 'bg-white/80'}`}
                    onClick={() => toggleWatchlist(property.id, 'property')}
                  >
                    <Heart className={`w-4 h-4 ${isInWatchlist(property.id, 'property') ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{property.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm truncate">{property.address}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">ارزش کل:</span>
                      <span className="font-semibold">{(property.total_value / 1000000000).toFixed(1)} میلیارد</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">قیمت توکن:</span>
                      <span className="font-semibold text-emerald-600">{(property.token_price / 1000000).toFixed(1)}م ریال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">بازدهی:</span>
                      <span className="font-semibold text-emerald-600">
                        {property.expected_annual_return || 15}%
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-to-l from-emerald-600 to-emerald-700"
                      onClick={() => navigate(`/Properties?focus=${property.id}`)}
                    >
                      سرمایه‌گذاری
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/Properties?focus=${property.id}`)}
                      aria-label="مشاهده جزئیات"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          }

          {/* TREFs */}
          {(activeTab === "all" || activeTab === "trefs") &&
            filteredTrefs.map((tref) => (
              <Card key={tref.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-gradient-to-bl from-white to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-bl from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${isInWatchlist(tref.id, 'tref') ? 'text-red-500' : 'text-slate-400'}`}
                      onClick={() => toggleWatchlist(tref.id, 'tref')}
                    >
                      <Heart className={`w-5 h-5 ${isInWatchlist(tref.id, 'tref') ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-2">{tref.name}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{tref.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">نوع صندوق:</span>
                      <Badge variant="outline">{tref.fund_type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">بازدهی سالانه:</span>
                      <span className="font-semibold text-blue-600">{tref.expected_annual_yield}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">حداقل سرمایه:</span>
                      <span className="font-semibold">{(tref.token_price / 1000000).toFixed(1)}م ریال</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-l from-blue-500 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${(tref.collected_amount / tref.target_amount) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-to-l from-blue-600 to-blue-700"
                      onClick={() => navigate(`/TREFs?focus=${tref.id}`)}
                    >
                      سرمایه‌گذاری
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/TREFs?focus=${tref.id}`)}
                      aria-label="مشاهده جزئیات"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>

        {/* Empty State */}
        {!isLoading && (filteredProperties.length === 0 && filteredTrefs.length === 0) && (
          <Card className="shadow-lg border-0 mt-8">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                نتیجه‌ای یافت نشد
              </h3>
              <p className="text-slate-500 mb-6">
                با تغییر کلمات کلیدی یا فیلترها دوباره جستجو کنید
              </p>
              <Button onClick={() => setSearchTerm("")}>
                پاک کردن جستجو
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}