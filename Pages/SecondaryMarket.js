import React, { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

// helpers
const currency = (n) => (n || 0).toLocaleString("fa-IR");
const pct = (n) => `${(n || 0).toFixed(1)}%`;
const truncate = (s, n = 28) => (s?.length > n ? s.slice(0, n) + "…" : s);

// demo data
const useHoldings = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
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

const FiltersBar = ({ filters, onChange, onReset }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6" role="region" aria-label="فیلترها">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-slate-800">فیلترهای هوشمند</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            <Search className="w-4 h-4 ml-1" />
            جستجو/فیلتر
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>ریست</Button>
        </div>
      </div>

      {open && (
        <div className="grid md:grid-cols-4 gap-3 mt-4">
          <Input aria-label="جستجو" placeholder="نام ملک یا موقعیت…" value={filters.q} onChange={(e) => onChange({ q: e.target.value })} />
          <Input aria-label="موقعیت" placeholder="مثلا تهران" value={filters.location} onChange={(e) => onChange({ location: e.target.value })} />
          <Input aria-label="حداقل بازدهی" placeholder="حداقل بازدهی % مثلا 15" inputMode="numeric" value={filters.minYield} onChange={(e) => onChange({ minYield: e.target.value })} />
          <Input aria-label="حداکثر قیمت توکن" placeholder="حداکثر قیمت هر توکن" inputMode="numeric" value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value })} />
        </div>
      )}
    </div>
  );
};

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
            <Button className="bg-gradient-to-l from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800" onClick={() => onSell(h)} aria-label={`فروش ${h.title}`}>
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

const ListingsGrid = ({ data, page, perPage, onPage, filters }) => {
  const filtered = useMemo(() => {
    return data.filter((i) => {
      const okQ = filters.q ? (i.title.includes(filters.q) || i.location.includes(filters.q)) : true;
      const okLoc = filters.location ? i.location.includes(filters.location) : true;
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
                    <MapPin className="w-3.5 h-3.5" />
                    {l.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">بازدهی</div>
                  <div className={l.yield >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
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
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={`نقشه ${l.title}`}
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.location)}`, "_blank")}
                >
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

const ChainPreview = ({ estGas = 0.00042, network = "Polygon" }) => (
  <div className="bg-gradient-to-l from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4">
    <div className="flex items-center gap-2 mb-2">
      <Fuel className="w-4 h-4 text-emerald-600" />
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
      <AlertTriangle className="w-4 h-4 mt-0.5" />
      <span>مبالغ و کارمزدها بسته به شرایط شبکه تغییر می‌کنند.</span>
    </div>
  </div>
);

const SellModal = ({ open, onClose, holding, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ qty: "", price: "", duration: "7" });

  useEffect(() => {
    if (open) {
      setStep(1);
      setForm({ qty: "", price: holding?.price?.toString() || "", duration: "7" });
    }
  }, [open, holding]);

  const valid =
    form.qty &&
    form.price &&
    Number(form.qty) > 0 &&
    Number(form.price) > 0 &&
    Number(form.qty) <= (holding?.qty || 0);

  return (
    <Modal isOpen={open} onClose={onClose} title="ثبت آگهی فروش" ariaLabel="ثبت آگهی فروش توکن‌ها">
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
              <select
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                aria-label="مدت نمایش آگهی"
                className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="3">۳ روز</option>
                <option value="7">۷ روز</option>
                <option value="14">۱۴ روز</option>
                <option value="30">۳۰ روز</option>
              </select>
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
            <Info className="w-4 h-4 mt-0.5" />
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
            <Button variant="outline" size="sm" aria-label="راهنما">
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
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-2">نقشه نمایشی است. برای موقعیت دقیق هر ملک روی دکمه «نقشه» در کارت کلیک کنید.</div>
                </CardContent>
              </Card>
            </div>

            <ListingsGrid data={listings} page={page} perPage={6} onPage={setPage} filters={filters} />
          </TabsContent>

          <TabsContent value="holdings" className="mt-5">
            <HoldingsGrid data={holdings} onSell={openSell} />
          </TabsContent>
        </Tabs>

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
        <SellModal open={sellOpen} holding={selectedHolding} onClose={() => setSellOpen(false)} onSubmit={handleSellSubmit} />
      </div>
    </div>
  );
}