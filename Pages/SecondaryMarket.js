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
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [], mid: 0 });
  const [trades, setTrades] = useState([]);
  const [ticker, setTicker] = useState({ last: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0 });
  const [side, setSide] = useState('buy');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMarketData();
    // Poll mock endpoints every 5s
    const interval = setInterval(() => {
      fetch('/api/secondary-market/orderbook').then(r => r.json()).then(setOrderbook).catch(() => {});
      fetch('/api/secondary-market/trades').then(r => r.json()).then(d => setTrades(d.data || [])).catch(() => {});
      fetch('/api/secondary-market/ticker').then(r => r.json()).then(setTicker).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
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
      // First fetch of mock feeds
      const [ob, tr, tk] = await Promise.all([
        fetch('/api/secondary-market/orderbook').then(r => r.json()).catch(() => ({ bids: [], asks: [], mid: 0 })),
        fetch('/api/secondary-market/trades').then(r => r.json()).then(d => setTrades(d.data || [])).catch(() => ({ data: [] })),
        fetch('/api/secondary-market/ticker').then(r => r.json()).then(setTicker).catch(() => ({ last: 0, change24h: 0, high24h: 0, low24h: 0, volume24h: 0 })),
      ]);
      setOrderbook(ob);
      setTrades(tr.data || []);
      setTicker(tk);
    } catch (error) {
      console.error("Error loading market data:", error);
    }
    setIsLoading(false);
  };

  // --- Binance-like Order Book (mock) ---
  const seedOrderBook = () => {
    const mid = 60_000_000; // میانگین قیمت توکن (ریال)
    const genLevels = (count, side) => {
      const levels = [];
      for (let i = 0; i < count; i++) {
        const price = side === 'ask' 
          ? mid + (i + 1) * 200_000 + Math.floor(Math.random() * 50_000)
          : mid - (i + 1) * 200_000 - Math.floor(Math.random() * 50_000);
        const size = Math.floor(5 + Math.random() * 120);
        levels.push({ price, size });
      }
      return levels;
    };
    setOrderBook({
      asks: genLevels(12, 'ask').sort((a,b) => a.price - b.price),
      bids: genLevels(12, 'bid').sort((a,b) => b.price - a.price),
    });
    setTrades([
      { id: 't1', side: 'buy', price: mid + 120_000, size: 12, time: new Date() },
      { id: 't2', side: 'sell', price: mid - 80_000, size: 20, time: new Date(Date.now()-30_000) },
    ]);
  };

  const tickOrderBook = () => {
    setOrderBook(prev => {
      if (!prev || !prev.bids || !prev.asks) return prev;
      // Randomly tweak a level on each side
      const bids = [...prev.bids];
      const asks = [...prev.asks];
      const bi = Math.floor(Math.random() * bids.length);
      const ai = Math.floor(Math.random() * asks.length);
      bids[bi] = { ...bids[bi], size: Math.max(1, bids[bi].size + Math.floor((Math.random()-0.5) * 10)) };
      asks[ai] = { ...asks[ai], size: Math.max(1, asks[ai].size + Math.floor((Math.random()-0.5) * 10)) };
      // Occasionally shift mid by inserting/removing a level
      if (Math.random() > 0.7) {
        bids.pop();
        bids.unshift({ price: bids[0].price + 50_000, size: Math.floor(5 + Math.random()*80) });
      }
      if (Math.random() > 0.7) {
        asks.pop();
        asks.unshift({ price: asks[0].price - 50_000, size: Math.floor(5 + Math.random()*80) });
      }
      return { bids, asks };
    });
    setTrades(prev => {
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const bestBid = orderBook.bids[0]?.price || 59_800_000;
      const bestAsk = orderBook.asks[0]?.price || 60_200_000;
      const price = side === 'buy' ? bestAsk : bestBid;
      const size = Math.floor(1 + Math.random()*40);
      const t = { id: String(Date.now()), side, price, size, time: new Date() };
      return [t, ...(prev||[])].slice(0, 30);
    });
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
          <div className="text-left bg-white rounded-xl shadow px-4 py-2 border">
            <div className="flex gap-4 items-center">
              <div>
                <div className="text-xs text-slate-500">آخرین قیمت</div>
                <div className="font-bold text-slate-900">{(ticker.last / 1_000_000).toFixed(2)} م ریال</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">تغییر ۲۴س</div>
                <div className={`font-bold ${ticker.change24h >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{ticker.change24h >= 0 ? '+' : ''}{ticker.change24h}%</div>
              </div>
              <div className="hidden md:block">
                <div className="text-xs text-slate-500">بالا/پایین ۲۴س</div>
                <div className="font-medium text-slate-700">{(ticker.high24h/1_000_000).toFixed(1)} / {(ticker.low24h/1_000_000).toFixed(1)} م</div>
              </div>
            </div>
          </div>
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

        {/* Market Layout: Left order form, middle orderbook, right trades (Binance-like) */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Order form */}
          <Card className="shadow-lg border-0 lg:col-span-1">
            <CardHeader className="pb-3"><CardTitle>سفارش</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 mb-2">
                <Button onClick={() => setSide('buy')} className={`flex-1 ${side==='buy' ? 'bg-emerald-600' : 'bg-slate-200 text-slate-700'}`}>خرید</Button>
                <Button onClick={() => setSide('sell')} className={`flex-1 ${side==='sell' ? 'bg-red-600' : 'bg-slate-200 text-slate-700'}`}>فروش</Button>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">قیمت (ریال)</div>
                <Input value={price} onChange={e => setPrice(e.target.value)} placeholder={(orderbook.mid||0).toString()} />
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">تعداد توکن</div>
                <Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" />
              </div>
              <Button className={`${side==='buy' ? 'bg-emerald-600' : 'bg-red-600'} w-full`}>ثبت سفارش {side==='buy' ? 'خرید' : 'فروش'}</Button>
            </CardContent>
          </Card>
          {/* Orderbook */}
          <Card className="shadow-lg border-0 lg:col-span-2 overflow-hidden">
            <CardHeader className="pb-3"><CardTitle>دفتر سفارشات</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 p-0">
              <div className="p-4">
                <div className="text-xs text-slate-500 mb-2">فروشندگان (Ask)</div>
                <div className="space-y-1 max-h-80 overflow-auto">
                  {orderbook.asks.slice(0,15).reverse().map((l, i) => (
                    <div key={`a-${i}`} className="flex justify-between text-sm px-2 py-1 bg-red-50/60 rounded">
                      <span className="text-red-600">{(l.price/1_000_000).toFixed(2)}</span>
                      <span className="text-slate-700">{l.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-r border-slate-100">
                <div className="text-xs text-slate-500 mb-2">خریداران (Bid)</div>
                <div className="space-y-1 max-h-80 overflow-auto">
                  {orderbook.bids.slice(0,15).map((l, i) => (
                    <div key={`b-${i}`} className="flex justify-between text-sm px-2 py-1 bg-emerald-50/60 rounded">
                      <span className="text-emerald-700">{(l.price/1_000_000).toFixed(2)}</span>
                      <span className="text-slate-700">{l.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Trades */}
          <Card className="shadow-lg border-0 lg:col-span-1">
            <CardHeader className="pb-3"><CardTitle>معاملات اخیر</CardTitle></CardHeader>
            <CardContent className="space-y-1 max-h-96 overflow-auto">
              {trades.map((t) => (
                <div key={t.id} className={`flex justify-between text-sm px-2 py-1 rounded ${t.side==='buy' ? 'bg-emerald-50/60' : 'bg-red-50/60'}`}>
                  <span className={t.side==='buy' ? 'text-emerald-700' : 'text-red-600'}>{(t.price/1_000_000).toFixed(2)}</span>
                  <span className="text-slate-700">{t.amount}</span>
                  <span className="text-slate-400">{new Date(t.ts).toLocaleTimeString('fa-IR',{hour:'2-digit', minute:'2-digit'})}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

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
}import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import Modal from "@/components/ui/Modal";
import { TrendingUp, TrendingDown, Filter, MapPin, Search, DollarSign, Clock, ShieldCheck, Info, ArrowRightLeft, Wallet, Fuel, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

// Utilities
const currency = (n) => (n || 0).toLocaleString("fa-IR");
const pct = (n) => `${(n || 0).toFixed(1)}%`;
const truncate = (s, n = 28) => (s?.length > n ? s.slice(0, n) + "…" : s);

// Fake data loaders (replace with real API if API_ORIGIN is set)
const useHoldings = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // Example demo holdings
    setData([
      { id: "h1", propertyId: "prop-1", title: "آپارتمان لوکس ولیعصر", location: "تهران، ولیعصر", qty: 18, price: 50_000_000, yield: 18.5, image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=380&fit=crop" },
      { id: "h2", propertyId: "prop-2", title: "مجتمع تجاری تجریش", location: "تهران، تجریش", qty: 7, price: 60_000_000, yield: 22.3, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=380&fit=crop" },
      { id: "h3", propertyId: "prop-4", title: "برج اداری ونک", location: "تهران، ونک", qty: 12, price: 40_000_000, yield: 17.2, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=380&fit=crop" },
    ]);
  }, []);
  return data;
};

const useListings = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // Example demo active listings from other users
    setData([
      { id: "l1", propertyId: "prop-1", title: "آپارتمان لوکس ولیعصر", location: "تهران، ولیعصر", qty: 3, price: 49_800_000, yield: 18.5, seller: "user-239", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=380&fit=crop" },
      { id: "l2", propertyId: "prop-2", title: "مجتمع تجاری تجریش", location: "تهران، تجریش", qty: 5, price: 61_000_000, yield: 22.3, seller: "user-812", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=380&fit=crop" },
      { id: "l3", propertyId: "prop-5", title: "مرکز صنعتی شادآباد", location: "تهران، شادآباد", qty: 2, price: 69_000_000, yield: 19.0, seller: "user-558", image: "https://images.unsplash.com/photo-1582582744564-0896bf55642c?w=600&h=380&fit=crop" },
      { id: "l4", propertyId: "prop-4", title: "برج اداری ونک", location: "تهران، ونک", qty: 10, price: 41_000_000, yield: 17.2, seller: "user-101", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=380&fit=crop" },
      { id: "l5", propertyId: "prop-3", title: "ویلای باغ فردوس", location: "شمیرانات، باغ فردوس", qty: 4, price: 25_500_000, yield: 16.8, seller: "user-414", image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?w=600&h=380&fit=crop" },
    ]);
  }, []);
  return data;
};

// Filter bar
const FiltersBar = ({ filters, onChange, onReset }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6" role="region" aria-label="نوار فیلترها">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span className="font-medium text-slate-800">فیلترهای هوشمند</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShow(!show)} aria-expanded={show} aria-controls="filters-panel">
            <Search className="w-4 h-4 ml-1" />
            جستجو/فیلتر
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>ریست</Button>
        </div>
      </div>

      {show && (
        <div id="filters-panel" className="grid md:grid-cols-4 gap-3 mt-4">
          <Input aria-label="جستجو بر اساس نام ملک یا موقعیت" placeholder="جستجو: نام ملک یا موقعیت…" value={filters.q} onChange={(e) => onChange({ q: e.target.value })} />
          <Select aria-label="فیلتر بر اساس موقعیت" value={filters.location} onChange={(e) => onChange({ location: e.target.value })}>
            <option value="">همه موقعیت‌ها</option>
            <option value="تهران">تهران</option>
            <option value="شمیرانات">شمیرانات</option>
          </Select>
          <Input aria-label="حداقل بازدهی" placeholder="حداقل بازدهی % مثلا 15" inputMode="numeric" value={filters.minYield} onChange={(e) => onChange({ minYield: e.target.value })} />
          <Input aria-label="حداکثر قیمت هر توکن" placeholder="حداکثر قیمت هر توکن" inputMode="numeric" value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value })} />
        </div>
      )}
    </div>
  );
};

// Holdings grid
const HoldingsGrid = ({ data, onSell }) => (
  <div className="grid md:grid-cols-3 gap-6">
    {data.map((h) => (
      <Card key={h.id} className="border-0 shadow-lg hover:shadow-2xl transition-all">
        <div className="relative">
          <img src={h.image} alt={h.title} className="w-full h-40 object-cover" />
          <Badge className="absolute top-3 right-3 bg-emerald-600 text-white">دارایی شما</Badge>
        </div>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-900">{truncate(h.title)}</h3>
              <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {h.location}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">بازدهی</div>
              <div className="font-semibold text-emerald-600">{pct(h.yield)}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm mt-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-slate-500">تعداد</div>
              <div className="font-bold text-slate-900">{currency(h.qty)}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-slate-500">قیمت</div>
              <div className="font-bold text-slate-900">{currency(h.price)} ریال</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-slate-500">ارزش</div>
              <div className="font-bold text-slate-900">{currency(h.qty * h.price)} ریال</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5">
            <Button className="bg-gradient-to-l from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800" onClick={() => onSell(h)} aria-label={`فروش توکن‌های ${h.title}`}>
              فروش
            </Button>
            <div className="flex items-center gap-2 text-xs text-slate-500" title="امنیت قرارداد هوشمند">
              <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              امن
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Listings grid with pagination
const ListingsGrid = ({ data, page, perPage, onPage, filters }) => {
  const filtered = useMemo(() => {
    return data.filter((i) => {
      const okQ = filters.q ? (i.title.includes(filters.q) || i.location.includes(filters.q)) : true;
      const okLoc = filters.location ? i.location.startsWith(filters.location) : true;
      const okYield = filters.minYield ? i.yield >= Number(filters.minYield) : true;
      const okPrice = filters.maxPrice ? i.price <= Number(filters.maxPrice) : true;
      return okQ && okLoc && okYield && okPrice;
    });
  }, [data, filters]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const slice = filtered.slice(start, start + perPage);

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6">
        {slice.map((l) => (
          <Card key={l.id} className="border-0 shadow-lg hover:shadow-2xl transition-all">
            <div className="relative">
              <img src={l.image} alt={l.title} className="w-full h-40 object-cover" />
              <Badge className="absolute top-3 right-3 bg-blue-600 text-white">آگهی فروش</Badge>
            </div>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{truncate(l.title)}</h3>
                  <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    {l.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">بازدهی</div>
                  <div className={clsx("font-semibold", l.yield >= 0 ? "text-emerald-600" : "text-red-600")}>
                    {pct(l.yield)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm mt-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-slate-500">تعداد</div>
                  <div className="font-bold text-slate-900">{currency(l.qty)}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-slate-500">قیمت</div>
                  <div className="font-bold text-slate-900">{currency(l.price)} ریال</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-slate-500">فروشنده</div>
                  <div className="font-bold text-slate-900">{l.seller}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                <Button variant="outline" size="sm" aria-label={`مشاهده روی نقشه ${l.title}`} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.location)}`, "_blank")}>
                  <MapPin className="w-4 h-4 ml-1" /> نقشه
                </Button>
                <Button className="bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  خرید
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        <Button variant="outline" size="sm" onClick={() => onPage(Math.max(1, page - 1))} aria-label="صفحه قبل">
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="text-sm text-slate-600" aria-live="polite">
          صفحه {page} از {pages}
        </div>
        <Button variant="outline" size="sm" onClick={() => onPage(Math.min(pages, page + 1))} aria-label="صفحه بعد">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Gas fee + blockchain preview
const ChainPreview = ({ estGas = 0.00042, network = "Polygon" }) => (
  <div className="bg-gradient-to-l from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4">
    <div className="flex items-center gap-2 mb-2">
      <Fuel className="w-4 h-4 text-emerald-600" aria-hidden="true" />
      <span className="font-medium text-slate-800">پیش‌نمایش تراکنش بلاکچین</span>
    </div>
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="bg-white rounded-xl p-3 border border-emerald-100">
        <div className="text-slate-500">شبکه</div>
        <div className="font-semibold text-slate-900">{network}</div>
      </div>
      <div className="bg-white rounded-xl p-3 border border-emerald-100">
        <div className="text-slate-500">گس تخمینی</div>
        <div className="font-semibold text-slate-900">{estGas} MATIC</div>
      </div>
      <div className="bg-white rounded-xl p-3 border border-emerald-100">
        <div className="text-slate-500">کارمزد سیستم</div>
        <div className="font-semibold text-slate-900">۰.۲%</div>
      </div>
    </div>
    <div className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3 mt-3 text-xs">
      <AlertTriangle className="w-4 h-4 mt-0.5" aria-hidden="true" />
      <span>مبالغ و کارمزدها بسته به شرایط شبکه تغییر می‌کنند.</span>
    </div>
  </div>
);

// Sell modal: step 1 form, step 2 confirm
const SellModal = ({ open, onClose, holding, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ qty: "", price: "", duration: "7" });

  useEffect(() => {
    if (open) {
      setStep(1);
      setForm({ qty: "", price: holding?.price?.toString() || "", duration: "7" });
    }
  }, [open, holding]);

  const valid = form.qty && form.price && Number(form.qty) > 0 && Number(form.price) > 0 && Number(form.qty) <= (holding?.qty || 0);

  return (
    <Modal isOpen={open} onClose={onClose} title="ثبت آگهی فروش" ariaLabel="ثبت آگهی فروش توکن‌ها">
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
            <img src={holding?.image} alt="" className="w-14 h-14 object-cover rounded-lg" />
            <div>
              <div className="font-semibold text-slate-900">{holding?.title}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {holding?.location}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-slate-600 mb-1 block">تعداد فروش</label>
              <Input inputMode="numeric" placeholder="مثلا 5" value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))} aria-label="تعداد فروش" />
              <div className="text-xs text-slate-500 mt-1">حداکثر: {currency(holding?.qty)} توکن</div>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">قیمت هر توکن (ریال)</label>
              <Input inputMode="numeric" placeholder="مثلا 50000000" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} aria-label="قیمت هر توکن" />
              <div className="text-xs text-slate-500 mt-1">قیمت فعلی: {currency(holding?.price)} ریال</div>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">مدت نمایش (روز)</label>
              <Select value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} aria-label="مدت نمایش آگهی">
                <option value="3">۳ روز</option>
                <option value="7">۷ روز</option>
                <option value="14">۱۴ روز</option>
                <option value="30">۳۰ روز</option>
              </Select>
            </div>
          </div>

          <ChainPreview />

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onClose}>انصراف</Button>
            <Button disabled={!valid} className="bg-gradient-to-l from-emerald-600 to-emerald-700" onClick={() => setStep(2)}>
              ادامه و تایید
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="font-semibold mb-2 text-slate-900">تایید نهایی</div>
            <ul className="text-sm text-slate-700 space-y-1">
              <li className="flex items-center gap-2"><ArrowRightLeft className="w-4 h-4 text-emerald-600" /> تعداد: {currency(Number(form.qty))} توکن</li>
              <li className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-600" /> قیمت هر توکن: {currency(Number(form.price))} ریال</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600" /> مدت نمایش: {form.duration} روز</li>
            </ul>
          </div>

          <div className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs">
            <Info className="w-4 h-4 mt-0.5" aria-hidden="true" />
            با تایید، آگهی شما بلافاصله در بازار ثانویه نمایش داده می‌شود. امکان لغو قبل از انجام معامله وجود دارد.
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>بازگشت</Button>
            <Button className="bg-gradient-to-l from-blue-600 to-blue-700" onClick={() => onSubmit?.({ ...form, qty: Number(form.qty), price: Number(form.price) })}>
              تایید و انتشار
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default function SecondaryMarket() {
  const holdings = useHoldings();
  const listings = useListings();

  const [filters, setFilters] = useState({ q: "", location: "", minYield: "", maxPrice: "" });
  const [page, setPage] = useState(1);
  const [sellOpen, setSellOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);

  const onFilterChange = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };
  const onResetFilters = () => {
    setFilters({ q: "", location: "", minYield: "", maxPrice: "" });
    setPage(1);
  };

  const openSell = (h) => {
    setSelectedHolding(h);
    setSellOpen(true);
  };
  const handleSellSubmit = (payload) => {
    // TODO: integrate with API/Blockchain
    console.log("Sell listing created:", { holding: selectedHolding, payload });
    setSellOpen(false);
    alert("آگهی شما ثبت شد!");
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-bl from-slate-50 to-blue-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">بازار ثانویه</h1>
            <p className="text-slate-600">خرید و فروش توکن‌های ملکی با اطمینان و سرعت</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" aria-label="راهنما">
              <Info className="w-4 h-4 ml-1" /> راهنما
            </Button>
            <Button size="sm" className="bg-gradient-to-l from-emerald-600 to-emerald-700">
              <Wallet className="w-4 h-4 ml-1" /> اتصال کیف‌پول
            </Button>
          </div>
        </div>

        {/* Tabs: Holdings / Market */}
        <Tabs defaultValue="market" className="mb-6">
          <TabsList className="bg-slate-100 rounded-2xl p-1">
            <TabsTrigger value="market" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white">بازار</TabsTrigger>
            <TabsTrigger value="holdings" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white">دارایی‌های من</TabsTrigger>
          </TabsList>

          {/* Market tab */}
          <TabsContent value="market" className="mt-5">
            <FiltersBar filters={filters} onChange={onFilterChange} onReset={onResetFilters} />
            {/* Map preview (lightweight) */}
            <div className="mb-6">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-900 text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" /> نقشه فرصت‌ها (نمایش سریع)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl overflow-hidden border">
                    <img
                      src="https://maps.googleapis.com/maps/api/staticmap?center=Tehran,Iran&zoom=11&size=1200x300&maptype=roadmap&markers=color:green|Tehran&key=AIzaSyD-FAKE-KEY"
                      alt="نقشه تهران - نمای کلی"
                      className="w-full h-48 object-cover"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-2">نقشه نمایشی است. برای موقعیت دقیق هر ملک روی دکمه «نقشه» در کارت کلیک کنید.</div>
                </CardContent>
              </Card>
            </div>

            <ListingsGrid data={listings} page={page} perPage={6} onPage={setPage} filters={filters} />
          </TabsContent>

          {/* Holdings tab */}
          <TabsContent value="holdings" className="mt-5">
            <HoldingsGrid data={holdings} onSell={openSell} />
          </TabsContent>
        </Tabs>

        {/* Market insights */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> میانگین بازدهی ۳۰ روز
              </div>
              <div className="text-2xl font-bold text-emerald-600 mt-2">+۸.۷%</div>
              <div className="text-xs text-slate-500 mt-1">مبنای ۱۲۶ معامله</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <TrendingDown className="w-4 h-4 text-red-600" /> میانگین کارمزد شبکه
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">۰.۰۰۰۴۲ MATIC</div>
              <div className="text-xs text-slate-500 mt-1">شبکه: Polygon</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <DollarSign className="w-4 h-4 text-blue-600" /> قیمت میانگین هر توکن
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{currency(48_900_000)} ریال</div>
              <div className="text-xs text-slate-500 mt-1">بر اساس ۳۴ ملک</div>
            </CardContent>
          </Card>
        </div>

        {/* Sell modal (multi-step with confirm) */}
        <SellModal open={sellOpen} holding={selectedHolding} onClose={() => setSellOpen(false)} onSubmit={handleSellSubmit} />
      </div>
    </div>
  );
}