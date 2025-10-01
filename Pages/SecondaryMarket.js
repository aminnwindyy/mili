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
}