import React, { useState, useEffect } from "react";
import { Investment } from "@/entities/Investment";
import { Bid } from "@/entities/Bid";
import { Property } from "@/entities/Property";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  TrendingUp, 
  Clock,
  Building2,
  DollarSign,
  Search,
  Filter,
  Gavel
} from "lucide-react";

export default function SecondaryMarket() {
  const [listings, setListings] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setIsLoading(true);
    try {
      const [userData, investmentsData, bidsData, propertiesData] = await Promise.all([
        User.me(),
        Investment.list("-created_date"),
        Bid.list("-created_date"),
        Property.list()
      ]);
      
      setUser(userData);
      
      // Create mock listings from investments
      const mockListings = investmentsData.filter(inv => inv.status === "فعال").slice(0, 10).map(inv => {
        const property = propertiesData.find(p => p.id === inv.property_id);
        return {
          ...inv,
          property,
          listing_price: (inv.total_amount || 0) * (1 + (Math.random() * 0.3 - 0.1)), // ±10% variation
          seller_email: inv.investor_email,
          tokens_for_sale: Math.floor(inv.tokens_purchased * (0.5 + Math.random() * 0.5)), // 50-100% of tokens
          is_negotiable: Math.random() > 0.5
        };
      });
      
      setListings(mockListings);
      setMyBids(bidsData.filter(bid => bid.bidder_email === userData.email));
    } catch (error) {
      console.error("Error loading market data:", error);
    }
    setIsLoading(false);
  };

  const filteredListings = listings.filter(listing =>
    searchTerm === "" || 
    listing.property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.property?.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const placeBid = async (listing, bidPrice) => {
    try {
      const bidData = {
        property_id: listing.property_id,
        bidder_email: user.email,
        seller_email: listing.seller_email,
        token_quantity: listing.tokens_for_sale,
        bid_price: bidPrice,
        total_amount: bidPrice * listing.tokens_for_sale,
        status: "pending",
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days
      };
      
      await Bid.create(bidData);
      loadMarketData(); // Refresh data
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">بازار ثانویه</h1>
            <p className="text-slate-600">خرید و فروش توکن‌های املاک با سایر سرمایه‌گذاران</p>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-slate-900">{listings.length}</div>
              <div className="text-sm text-slate-600">آگهی فعال</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-slate-900">۲.۱ میلیارد</div>
              <div className="text-sm text-slate-600">حجم معاملات</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <div className="text-2xl font-bold text-slate-900">+۵.۲%</div>
              <div className="text-sm text-slate-600">رشد قیمت</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-slate-900">۲.۳ ساعت</div>
              <div className="text-sm text-slate-600">متوسط زمان معامله</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="جستجوی املاک در بازار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-12"
                />
              </div>
              <Button variant="outline" size="lg">
                <Filter className="w-5 h-5 mr-2" />
                فیلترها
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Market Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="bg-white shadow-lg p-1">
            <TabsTrigger value="listings" className="px-6">
              آگهی‌های فروش ({filteredListings.length})
            </TabsTrigger>
            <TabsTrigger value="my-bids" className="px-6">
              پیشنهادات من ({myBids.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing, index) => (
                <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 mb-1">
                          {listing.property?.title || "ملک نامشخص"}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                          <Building2 className="w-4 h-4" />
                          <span>{listing.property?.address}</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{listing.property?.property_type}</Badge>
                          {listing.is_negotiable && <Badge className="bg-emerald-100 text-emerald-800">قابل مذاکره</Badge>}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-slate-600">قیمت هر توکن</p>
                        <p className="text-xl font-bold text-slate-900">
                          {((listing.listing_price || 0) / listing.tokens_purchased / 1000000).toFixed(1)}م ریال
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500">توکن‌های موجود</p>
                        <p className="font-semibold">{listing.tokens_for_sale}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">مبلغ کل</p>
                        <p className="font-semibold">
                          {(((listing.listing_price || 0) / listing.tokens_purchased * listing.tokens_for_sale) / 1000000).toFixed(1)}م ریال
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">بازدهی تاریخی</p>
                        <p className="font-semibold text-emerald-600">
                          +{((Math.random() * 20) + 5).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">فروشنده</p>
                        <p className="font-semibold">
                          {listing.seller_email?.split('@')[0] || 'ناشناس'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        className="bg-gradient-to-l from-emerald-600 to-emerald-700"
                        onClick={() => placeBid(listing, (listing.listing_price || 0) / listing.tokens_purchased)}
                      >
                        <Gavel className="w-4 h-4 mr-2" />
                        خرید فوری
                      </Button>
                      <Button variant="outline">
                        پیشنهاد قیمت
                      </Button>
                      <Button variant="ghost">
                        جزئیات بیشتر
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    هیچ آگهی فروشی یافت نشد
                  </h3>
                  <p className="text-slate-500">
                    در حال حاضر آگهی فروش توکنی با این مشخصات وجود ندارد
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="my-bids" className="space-y-4">
            {myBids.length > 0 ? (
              myBids.map((bid) => (
                <Card key={bid.id} className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-900">پیشنهاد برای ملک</h3>
                        <p className="text-slate-500 text-sm">
                          {bid.token_quantity} توکن به قیمت {(bid.bid_price / 1000000).toFixed(1)}م ریال
                        </p>
                      </div>
                      <Badge className={`${
                        bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {bid.status === 'pending' ? 'در انتظار' :
                         bid.status === 'accepted' ? 'تایید شده' : 'رد شده'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <p className="text-slate-500">هیچ پیشنهاد قیمتی ندارید</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}