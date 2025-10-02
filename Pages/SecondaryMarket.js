import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Modal from "@/components/ui/Modal";
import { 
  TrendingUp, 
  TrendingDown,
  Filter,
  MapPin,
  Search,
  DollarSign,
  Clock,
  ShieldCheck,
  Info,
  ArrowRightLeft,
  Wallet,
  Fuel,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";

// helpers
const currency = (n) => (n || 0).toLocaleString("fa-IR");
const pct = (n) => `${(n || 0).toFixed(1)}%`;
const truncate = (s, n = 28) => (s?.length > n ? s.slice(0, n) + "…" : s);

// Mock data
const mockTicker = {
  last: 60000000,
  change24h: 2.5,
  high24h: 61500000,
  low24h: 58000000,
  volume24h: 1200
};

const mockOrderbook = {
  asks: [
    { price: 60200000, size: 15 },
    { price: 60350000, size: 8 },
    { price: 60500000, size: 22 },
    { price: 60650000, size: 12 },
    { price: 60800000, size: 18 },
    { price: 60950000, size: 6 },
    { price: 61100000, size: 25 },
    { price: 61250000, size: 14 },
    { price: 61400000, size: 9 },
    { price: 61550000, size: 31 }
  ],
  bids: [
    { price: 59800000, size: 20 },
    { price: 59650000, size: 12 },
    { price: 59500000, size: 18 },
    { price: 59350000, size: 25 },
    { price: 59200000, size: 16 },
    { price: 59050000, size: 22 },
    { price: 58900000, size: 14 },
    { price: 58750000, size: 19 },
    { price: 58600000, size: 27 },
    { price: 58450000, size: 11 }
  ]
};

const mockTrades = [
  { id: 't1', side: 'buy', price: 60120000, size: 12, time: new Date().toISOString() },
  { id: 't2', side: 'sell', price: 59980000, size: 20, time: new Date(Date.now() - 30000).toISOString() },
  { id: 't3', side: 'buy', price: 60050000, size: 8, time: new Date(Date.now() - 60000).toISOString() },
  { id: 't4', side: 'sell', price: 59850000, size: 15, time: new Date(Date.now() - 90000).toISOString() },
  { id: 't5', side: 'buy', price: 60080000, size: 25, time: new Date(Date.now() - 120000).toISOString() }
];

const mockHoldings = [
  {
    id: "h1",
    title: "آپارتمان ولیعصر - واحد ۵۰۱",
    location: "تهران، ولیعصر",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    qty: 15,
    price: 58000000,
    yield: 18.5,
  },
  {
    id: "h2", 
    title: "مجتمع تجاری تجریش - طبقه ۳",
    location: "تهران، تجریش",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    qty: 8,
    price: 72000000,
    yield: 22.1,
  },
  {
    id: "h3",
    title: "ویلای شمال - کلکسیون",
    location: "مازندران، نوشهر",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    qty: 6,
    price: 85000000,
    yield: 15.8,
  },
];

const mockListings = [
  {
    id: "l1",
    title: "آپارتمان پاسداران - واحد ۲۰۲",
    location: "تهران، پاسداران",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    price: 65000000,
    yield: 19.2,
    seller: "احمد محمدی",
    duration: "۷ روز",
    qty: 12,
  },
  {
    id: "l2",
    title: "ویلای شمال - کلکسیون",
    location: "مازندران، نوشهر",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    price: 85000000,
    yield: 15.8,
    seller: "فاطمه احمدی",
    duration: "۱۴ روز",
    qty: 6,
  },
  {
    id: "l3",
    title: "دفتر کار مرکز - طبقه ۸",
    location: "تهران، مرکز",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    price: 45000000,
    yield: 25.3,
    seller: "علی رضایی",
    duration: "۳ روز",
    qty: 20,
  },
  {
    id: "l4",
    title: "مغازه تجاری کریمخان",
    location: "تهران، کریمخان",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    price: 38000000,
    yield: 28.5,
    seller: "مریم حسینی",
    duration: "۵ روز",
    qty: 25,
  },
  {
    id: "l5",
    title: "آپارتمان نیاوران - پنت‌هاوس",
    location: "تهران، نیاوران",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    price: 120000000,
    yield: 12.3,
    seller: "حسن کریمی",
    duration: "۱۰ روز",
    qty: 3,
  },
  {
    id: "l6",
    title: "زمین کشاورزی ورامین",
    location: "تهران، ورامین",
    image: "https://images.unsplash.com/photo-15003820174682-96b4ddf4b86e?w=400&h=300&fit=crop",
    price: 25000000,
    yield: 35.2,
    seller: "رضا احمدی",
    duration: "۲۱ روز",
    qty: 40,
  },
];

// Orderbook component
const OrderBook = ({ book }) => {
  const asks = (book.asks || []).slice(0, 10);
  const bids = (book.bids || []).slice(0, 10);
  
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-900 text-base">دفتر سفارشات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span>قیمت (ریال)</span><span>حجم</span>
            </div>
            <div className="space-y-1">
              {asks.map((a, i) => (
                <div key={`a-${i}`} className="flex items-center justify-between bg-red-50/60 rounded p-2">
                  <span className="text-red-600 font-semibold">{currency(a.price)}</span>
                  <span className="text-slate-700">{currency(a.size)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span>قیمت (ریال)</span><span>حجم</span>
            </div>
            <div className="space-y-1">
              {bids.map((b, i) => (
                <div key={`b-${i}`} className="flex items-center justify-between bg-emerald-50/70 rounded p-2">
                  <span className="text-emerald-600 font-semibold">{currency(b.price)}</span>
                  <span className="text-slate-700">{currency(b.size)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Trades ticker
const TradesTicker = ({ trades }) => (
  <Card className="border-0 shadow-md">
    <CardHeader className="pb-2">
      <CardTitle className="text-slate-900 text-base">معاملات اخیر</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 text-xs text-slate-500 mb-2">
        <span>قیمت</span><span>حجم</span><span>زمان</span>
      </div>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {trades.map((t) => (
          <div key={t.id} className="grid grid-cols-3 text-sm items-center bg-white rounded border p-2">
            <span className={t.side === 'buy' ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
              {currency(t.price)}
            </span>
            <span className="text-slate-700">{currency(t.size)}</span>
            <span className="text-slate-500">{new Date(t.time).toLocaleTimeString('fa-IR')}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Order form with fee preview
const OrderForm = () => {
  const [side, setSide] = useState('sell');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const feePct = 0.002; // 0.2%
  const total = (Number(qty) || 0) * (Number(price) || 0);
  const fee = total * feePct;
  
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-900 text-base">ثبت سفارش</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={side === 'buy' ? 'default' : 'outline'} 
            onClick={() => setSide('buy')}
          >
            خرید
          </Button>
          <Button 
            size="sm" 
            variant={side === 'sell' ? 'default' : 'outline'} 
            onClick={() => setSide('sell')}
          >
            فروش
          </Button>
        </div>
        <div>
          <label className="text-sm text-slate-600 mb-1 block">تعداد</label>
          <Input 
            inputMode="numeric" 
            placeholder="مثلا 5" 
            value={qty} 
            onChange={(e) => setQty(e.target.value)} 
          />
        </div>
        <div>
          <label className="text-sm text-slate-600 mb-1 block">قیمت هر توکن (ریال)</label>
          <Input 
            inputMode="numeric" 
            placeholder="مثلا 50000000" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
          />
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-sm border border-emerald-100">
          <div className="flex items-center gap-2 text-slate-700">
            <Fuel className="w-4 h-4 text-emerald-600" /> پیش‌نمایش کارمزد
          </div>
          <div className="flex items-center justify-between mt-2">
            <span>مبلغ کل</span>
            <span className="font-semibold">{currency(total)} ریال</span>
          </div>
          <div className="flex items-center justify-between">
            <span>کارمزد (۰.۲٪)</span>
            <span className="font-semibold">{currency(Math.floor(fee))} ریال</span>
          </div>
        </div>
        <Button 
          className="w-full bg-gradient-to-l from-blue-600 to-blue-700" 
          disabled={!qty || !price}
        >
          ارسال سفارش
        </Button>
      </CardContent>
    </Card>
  );
};

// Filters bar
const FiltersBar = ({ filters, onChange, onReset }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">فیلترها</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
            <Search className="w-4 h-4 ml-1" />
            {open ? 'بستن' : 'جستجو'}
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            ریست
          </Button>
        </div>
      </div>

      {open && (
        <div className="grid md:grid-cols-4 gap-3 mt-4">
          <Input 
            placeholder="نام ملک یا موقعیت…" 
            value={filters.q} 
            onChange={(e) => onChange({ q: e.target.value })} 
          />
          <Input 
            placeholder="مثلا تهران" 
            value={filters.location} 
            onChange={(e) => onChange({ location: e.target.value })} 
          />
          <Input 
            placeholder="حداقل بازدهی % مثلا 15" 
            inputMode="numeric" 
            value={filters.minYield} 
            onChange={(e) => onChange({ minYield: e.target.value })} 
          />
          <Input 
            placeholder="حداکثر قیمت هر توکن" 
            inputMode="numeric" 
            value={filters.maxPrice} 
            onChange={(e) => onChange({ maxPrice: e.target.value })} 
          />
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
                <MapPin className="w-3.5 h-3.5" /> {h.location}
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
            <Button 
              className="bg-gradient-to-l from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800" 
              onClick={() => onSell(h)}
            >
              فروش
            </Button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              امن
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Listings grid
const ListingsGrid = ({ data, page, perPage, onPage, filters }) => {
  const filtered = data.filter((i) => {
    const okQ = filters.q ? (i.title.includes(filters.q) || i.location.includes(filters.q)) : true;
    const okLoc = filters.location ? i.location.includes(filters.location) : true;
    const okYield = filters.minYield ? i.yield >= Number(filters.minYield) : true;
    const okPrice = filters.maxPrice ? i.price <= Number(filters.maxPrice) : true;
    return okQ && okLoc && okYield && okPrice;
  });

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
                    <MapPin className="w-3.5 h-3.5" /> {l.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">بازدهی</div>
                  <div className="font-semibold text-emerald-600">{pct(l.yield)}</div>
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
                  <div className="font-bold text-slate-900">{truncate(l.seller, 8)}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                <Button className="bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  خرید
                </Button>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-blue-500" />
                  {l.duration}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPage(page - 1)} 
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-slate-600">
            صفحه {page} از {pages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPage(page + 1)} 
            disabled={page === pages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Sell modal
const SellModal = ({ open, holding, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ qty: '', price: '', duration: '7' });

  useEffect(() => {
    if (open) {
      setStep(1);
      setForm({ qty: '', price: '', duration: '7' });
    }
  }, [open]);

  const valid = 
    Number(form.qty) > 0 &&
    Number(form.price) > 0 &&
    Number(form.qty) <= (holding?.qty || 0);

  return (
    <Modal isOpen={open} onClose={onClose} title="ثبت آگهی فروش">
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
            <img src={holding?.image} alt="" className="w-14 h-14 object-cover rounded-lg" />
            <div>
              <div className="font-semibold text-slate-900">{holding?.title}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {holding?.location}
              </div>
            </div>
          </div>
                    
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-slate-600 mb-1 block">تعداد فروش</label>
              <Input 
                inputMode="numeric" 
                placeholder="مثلا 5" 
                value={form.qty} 
                onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))} 
              />
              <div className="text-xs text-slate-500 mt-1">حداکثر: {currency(holding?.qty)} توکن</div>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">قیمت هر توکن (ریال)</label>
              <Input 
                inputMode="numeric" 
                placeholder="مثلا 50000000" 
                value={form.price} 
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} 
              />
              <div className="text-xs text-slate-500 mt-1">قیمت فعلی: {currency(holding?.price)} ریال</div>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">مدت نمایش (روز)</label>
              <select
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="3">۳ روز</option>
                <option value="7">۷ روز</option>
                <option value="14">۱۴ روز</option>
                <option value="30">۳۰ روز</option>
              </select>
            </div>
          </div>
                    
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onClose}>انصراف</Button>
            <Button 
              disabled={!valid} 
              className="bg-gradient-to-l from-emerald-600 to-emerald-700" 
              onClick={() => setStep(2)}
            >
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
              <li className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-600" /> 
                تعداد: {currency(Number(form.qty))} توکن
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> 
                قیمت هر توکن: {currency(Number(form.price))} ریال
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> 
                مدت نمایش: {form.duration} روز
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>بازگشت</Button>
            <Button 
              className="bg-gradient-to-l from-blue-600 to-blue-700" 
              onClick={() => onSubmit?.({ ...form, qty: Number(form.qty), price: Number(form.price) })}
            >
              تایید و انتشار
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default function SecondaryMarket() {
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
    console.log("Sell listing created:", { holding: selectedHolding, payload });
    setSellOpen(false);
    alert("آگهی شما ثبت شد!");
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-bl from-slate-50 to-blue-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">بازار ثانویه</h1>
            <p className="text-slate-600">خرید و فروش توکن‌های ملکی با اطمینان و سرعت</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Info className="w-4 h-4 ml-1" /> راهنما
            </Button>
            <Button size="sm" className="bg-gradient-to-l from-emerald-600 to-emerald-700">
              <Wallet className="w-4 h-4 ml-1" /> اتصال کیف‌پول
            </Button>
          </div>
        </div>

        <Tabs defaultValue="market" className="mb-6">
          <TabsList className="bg-slate-100 rounded-2xl p-1">
            <TabsTrigger value="market" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white">بازار</TabsTrigger>
            <TabsTrigger value="holdings" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white">دارایی‌های من</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="mt-5">
            <FiltersBar filters={filters} onChange={onFilterChange} onReset={onResetFilters} />
            
            {/* Market layout: orderbook + trades + orderform */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                بازار زنده
              </h2>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* KPI bar */}
                  <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-50 to-blue-50">
                    <CardContent className="p-4 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-slate-500">آخرین قیمت</div>
                        <div className="font-bold text-slate-900">{currency(mockTicker.last)} ریال</div>
                      </div>
                      <div>
                        <div className="text-slate-500">تغییر ۲۴س</div>
                        <div className={mockTicker.change24h >= 0 ? 'font-bold text-emerald-600' : 'font-bold text-red-600'}>
                          {mockTicker.change24h >= 0 ? '+' : ''}{pct(mockTicker.change24h)}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">بالا/پایین ۲۴س</div>
                        <div className="font-medium text-slate-700">{currency(mockTicker.high24h)} / {currency(mockTicker.low24h)}</div>
                      </div>
                    </CardContent>
                  </Card>
                  <OrderBook book={mockOrderbook} />
                  <TradesTicker trades={mockTrades} />
                </div>
                <div className="space-y-6">
                  <OrderForm />
                </div>
              </div>
            </div>

            {/* Marketplace listings */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">آگهی‌های فروش</h2>
              <ListingsGrid data={mockListings} page={page} perPage={6} onPage={setPage} filters={filters} />
            </div>
          </TabsContent>

          <TabsContent value="holdings" className="mt-5">
            <HoldingsGrid data={mockHoldings} onSell={openSell} />
          </TabsContent>
        </Tabs>

        <SellModal 
          open={sellOpen} 
          holding={selectedHolding} 
          onClose={() => setSellOpen(false)} 
          onSubmit={handleSellSubmit} 
        />
      </div>
    </div>
  );
}