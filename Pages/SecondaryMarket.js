import React, { useState } from "react";

export default function SecondaryMarket() {
  const [activeTab, setActiveTab] = useState("market");

  // Mock data
  const ticker = {
    last: 60000000,
    change24h: 2.5,
    high24h: 61500000,
    low24h: 58000000,
  };

  const orderbook = {
    asks: [
      { price: 60200000, size: 15 },
      { price: 60350000, size: 8 },
      { price: 60500000, size: 22 },
    ],
    bids: [
      { price: 59800000, size: 20 },
      { price: 59650000, size: 12 },
      { price: 59500000, size: 18 },
    ]
  };

  const trades = [
    { id: 1, side: 'buy', price: 60120000, size: 12, time: '14:30:25' },
    { id: 2, side: 'sell', price: 59980000, size: 20, time: '14:29:45' },
    { id: 3, side: 'buy', price: 60050000, size: 8, time: '14:29:12' },
  ];

  const holdings = [
    {
      id: 1,
      title: "آپارتمان ولیعصر",
      location: "تهران، ولیعصر",
      qty: 15,
      price: 58000000,
      yield: 18.5,
    },
    {
      id: 2,
      title: "مجتمع تجاری تجریش",
      location: "تهران، تجریش",
      qty: 8,
      price: 72000000,
      yield: 22.1,
    }
  ];

  const listings = [
    {
      id: 1,
      title: "آپارتمان پاسداران",
      location: "تهران، پاسداران",
      price: 65000000,
      yield: 19.2,
      qty: 12,
    },
    {
      id: 2,
      title: "ویلای شمال",
      location: "مازندران، نوشهر",
      price: 85000000,
      yield: 15.8,
      qty: 6,
    }
  ];

  const currency = (n) => (n || 0).toLocaleString("fa-IR");
  const pct = (n) => `${(n || 0).toFixed(1)}%`;

  return (
    <div className="p-4 md:p-8 bg-gradient-to-bl from-slate-50 to-blue-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">بازار ثانویه</h1>
          <p className="text-slate-600">خرید و فروش توکن‌های ملکی با اطمینان و سرعت</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex bg-slate-100 rounded-2xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("market")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "market" 
                  ? "bg-emerald-500 text-white" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              بازار
            </button>
            <button
              onClick={() => setActiveTab("holdings")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "holdings" 
                  ? "bg-emerald-500 text-white" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              دارایی‌های من
            </button>
          </div>
        </div>

        {/* Market Tab */}
        {activeTab === "market" && (
          <div>
            {/* Live Market */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">بازار زنده</h2>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Ticker */}
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-slate-500">آخرین قیمت</div>
                        <div className="font-bold text-slate-900">{currency(ticker.last)} ریال</div>
                      </div>
                      <div>
                        <div className="text-slate-500">تغییر ۲۴س</div>
                        <div className="font-bold text-emerald-600">+{pct(ticker.change24h)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">بالا/پایین ۲۴س</div>
                        <div className="font-medium text-slate-700">{currency(ticker.high24h)} / {currency(ticker.low24h)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Orderbook */}
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">دفتر سفارشات</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex justify-between text-slate-500 mb-2">
                          <span>قیمت (ریال)</span><span>حجم</span>
                        </div>
                        {orderbook.asks.map((ask, i) => (
                          <div key={i} className="flex justify-between bg-red-50 rounded p-2 mb-1">
                            <span className="text-red-600 font-semibold">{currency(ask.price)}</span>
                            <span className="text-slate-700">{ask.size}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-500 mb-2">
                          <span>قیمت (ریال)</span><span>حجم</span>
                        </div>
                        {orderbook.bids.map((bid, i) => (
                          <div key={i} className="flex justify-between bg-emerald-50 rounded p-2 mb-1">
                            <span className="text-emerald-600 font-semibold">{currency(bid.price)}</span>
                            <span className="text-slate-700">{bid.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Trades */}
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">معاملات اخیر</h3>
                    <div className="grid grid-cols-3 text-xs text-slate-500 mb-2">
                      <span>قیمت</span><span>حجم</span><span>زمان</span>
                    </div>
                    {trades.map((trade) => (
                      <div key={trade.id} className="grid grid-cols-3 text-sm items-center bg-slate-50 rounded p-2 mb-1">
                        <span className={trade.side === 'buy' ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                          {currency(trade.price)}
                        </span>
                        <span className="text-slate-700">{trade.size}</span>
                        <span className="text-slate-500">{trade.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Form */}
                <div>
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">ثبت سفارش</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button className="px-3 py-2 bg-emerald-600 text-white rounded text-sm">خرید</button>
                        <button className="px-3 py-2 border border-slate-300 text-slate-700 rounded text-sm">فروش</button>
                      </div>
                      <div>
                        <label className="text-sm text-slate-600 mb-1 block">تعداد</label>
                        <input 
                          type="number" 
                          placeholder="مثلا 5" 
                          className="w-full p-2 border border-slate-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-600 mb-1 block">قیمت هر توکن (ریال)</label>
                        <input 
                          type="number" 
                          placeholder="مثلا 50000000" 
                          className="w-full p-2 border border-slate-300 rounded text-sm"
                        />
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded font-medium">
                        ارسال سفارش
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Listings */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">آگهی‌های فروش</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-xl shadow-lg p-5">
                    <h3 className="font-bold text-slate-900 mb-1">{listing.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{listing.location}</p>
                    
                    <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                      <div className="bg-slate-50 rounded p-2">
                        <div className="text-slate-500">تعداد</div>
                        <div className="font-bold">{listing.qty}</div>
                      </div>
                      <div className="bg-slate-50 rounded p-2">
                        <div className="text-slate-500">قیمت</div>
                        <div className="font-bold">{currency(listing.price)}</div>
                      </div>
                      <div className="bg-slate-50 rounded p-2">
                        <div className="text-slate-500">بازدهی</div>
                        <div className="font-bold text-emerald-600">{pct(listing.yield)}</div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white py-2 rounded font-medium">
                      خرید
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Holdings Tab */}
        {activeTab === "holdings" && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">دارایی‌های من</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {holdings.map((holding) => (
                <div key={holding.id} className="bg-white rounded-xl shadow-lg p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{holding.title}</h3>
                      <p className="text-sm text-slate-500">{holding.location}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs">دارایی شما</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-slate-500">تعداد</div>
                      <div className="font-bold">{holding.qty}</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-slate-500">قیمت</div>
                      <div className="font-bold">{currency(holding.price)}</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-slate-500">بازدهی</div>
                      <div className="font-bold text-emerald-600">{pct(holding.yield)}</div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-emerald-600 text-white py-2 rounded font-medium">
                    فروش
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}