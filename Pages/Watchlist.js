import React, { useState, useEffect } from "react";
import { Watchlist as WatchlistEntity } from "@/entities/Watchlist";
import { Property } from "@/entities/Property";
import { TREF } from "@/entities/TREF";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Heart, 
  Building2,
  PieChart,
  Trash2,
  Edit3,
  Bell,
  TrendingUp,
  MapPin,
  Eye,
  Plus
} from "lucide-react";

export default function Watchlist() {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [properties, setProperties] = useState([]);
  const [trefs, setTrefs] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [notes, setNotes] = useState("");
  const [priceAlert, setPriceAlert] = useState("");

  useEffect(() => {
    loadWatchlistData();
  }, []);

  const loadWatchlistData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const [watchlistData, propertiesData, trefsData] = await Promise.all([
        WatchlistEntity.filter({ user_email: userData.email }),
        Property.list(),
        TREF.list()
      ]);
      
      setWatchlistItems(watchlistData);
      setProperties(propertiesData);
      setTrefs(trefsData);
    } catch (error) {
      console.error("Error loading watchlist:", error);
    }
    setIsLoading(false);
  };

  const removeFromWatchlist = async (itemId) => {
    try {
      await WatchlistEntity.delete(itemId);
      setWatchlistItems(watchlistItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  const updateWatchlistItem = async (item) => {
    try {
      const updateData = {
        notes: notes || item.notes,
        price_alert: priceAlert ? parseFloat(priceAlert) : item.price_alert
      };
      
      await WatchlistEntity.update(item.id, updateData);
      setWatchlistItems(watchlistItems.map(w => w.id === item.id ? { ...w, ...updateData } : w));
      setEditingItem(null);
      setNotes("");
      setPriceAlert("");
    } catch (error) {
      console.error("Error updating watchlist item:", error);
    }
  };

  const getItemData = (watchlistItem) => {
    if (watchlistItem.item_type === 'property') {
      return properties.find(p => p.id === watchlistItem.property_id);
    } else {
      return trefs.find(t => t.id === watchlistItem.tref_id);
    }
  };

  const propertyItems = watchlistItems.filter(item => item.item_type === 'property');
  const trefItems = watchlistItems.filter(item => item.item_type === 'tref');

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-pink-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              لیست علاقه‌مندی‌ها
            </h1>
            <p className="text-slate-600">مدیریت املاک و صندوق‌های مورد علاقه شما</p>
          </div>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            تنظیم هشدارها
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-pink-50">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <div className="text-2xl font-bold text-slate-900">{watchlistItems.length}</div>
              <div className="text-sm text-slate-600">کل آیتم‌های علاقه‌مندی</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-emerald-50">
            <CardContent className="p-6 text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <div className="text-2xl font-bold text-slate-900">{propertyItems.length}</div>
              <div className="text-sm text-slate-600">املاک</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-white to-blue-50">
            <CardContent className="p-6 text-center">
              <PieChart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-slate-900">{trefItems.length}</div>
              <div className="text-sm text-slate-600">صندوق‌های ملکی</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-white shadow-lg p-1">
            <TabsTrigger value="all" className="px-6">همه ({watchlistItems.length})</TabsTrigger>
            <TabsTrigger value="properties" className="px-6">املاک ({propertyItems.length})</TabsTrigger>
            <TabsTrigger value="trefs" className="px-6">صندوق‌ها ({trefItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {watchlistItems.length > 0 ? (
              watchlistItems.map((item) => {
                const itemData = getItemData(item);
                if (!itemData) return null;
                
                return (
                  <Card key={item.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            item.item_type === 'property' 
                              ? 'bg-gradient-to-bl from-emerald-500 to-emerald-600'
                              : 'bg-gradient-to-bl from-blue-500 to-blue-600'
                          }`}>
                            {item.item_type === 'property' ? 
                              <Building2 className="w-6 h-6 text-white" /> : 
                              <PieChart className="w-6 h-6 text-white" />
                            }
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-slate-900 mb-1">
                              {itemData.title || itemData.name}
                            </h3>
                            
                            {item.item_type === 'property' && (
                              <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{itemData.address}</span>
                              </div>
                            )}
                            
                            <div className="flex gap-2 mb-3">
                              <Badge variant="outline">
                                {item.item_type === 'property' ? itemData.property_type : itemData.fund_type}
                              </Badge>
                              {item.price_alert && (
                                <Badge className="bg-amber-100 text-amber-800">
                                  هشدار قیمت: {(item.price_alert / 1000000).toFixed(1)}م
                                </Badge>
                              )}
                            </div>
                            
                            {item.notes && (
                              <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingItem(item);
                              setNotes(item.notes || "");
                              setPriceAlert(item.price_alert || "");
                            }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => removeFromWatchlist(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>
                              {item.item_type === 'property' 
                                ? `${itemData.expected_annual_return || 15}% بازدهی`
                                : `${itemData.expected_annual_yield}% بازدهی`
                              }
                            </span>
                          </div>
                          {item.item_type === 'property' && (
                            <span>قیمت: {(itemData.token_price / 1000000).toFixed(1)}م ریال</span>
                          )}
                        </div>
                        
                        <Button className="bg-gradient-to-l from-emerald-600 to-emerald-700">
                          <Eye className="w-4 h-4 mr-2" />
                          مشاهده جزئیات
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    لیست علاقه‌مندی‌ها خالی است
                  </h3>
                  <p className="text-slate-500 mb-6">
                    املاک و صندوق‌های مورد علاقه خود را اضافه کنید
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    کاوش املاک
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            {/* Similar structure for properties only */}
          </TabsContent>

          <TabsContent value="trefs" className="space-y-4">
            {/* Similar structure for TREFs only */}
          </TabsContent>
        </Tabs>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader>
                <CardTitle>ویرایش یادداشت و هشدار</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    یادداشت شخصی
                  </label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="یادداشت خود را بنویسید..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    هشدار قیمت (ریال)
                  </label>
                  <Input
                    type="number"
                    value={priceAlert}
                    onChange={(e) => setPriceAlert(e.target.value)}
                    placeholder="هنگام رسیدن به این قیمت اطلاع دهید"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => updateWatchlistItem(editingItem)}
                    className="flex-1"
                  >
                    ذخیره تغییرات
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(null)}>
                    انصراف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}