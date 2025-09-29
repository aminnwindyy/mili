import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

export default function PropertyFilters({ filters, setFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "همه",
      property_type: "همه", 
      price_range: "همه"
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== "همه").length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="lg" className="relative">
          <Filter className="w-4 h-4 mr-2" />
          فیلترها
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">فیلترهای جستجو</h4>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                پاک کردن
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">وضعیت</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="همه">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="تایید_شده">تایید شده</SelectItem>
                  <SelectItem value="در_حال_فروش">در حال فروش</SelectItem>
                  <SelectItem value="فروخته_شده">فروخته شده</SelectItem>
                  <SelectItem value="در_حال_بررسی">در حال بررسی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">نوع ملک</label>
              <Select value={filters.property_type} onValueChange={(value) => handleFilterChange('property_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="همه">همه انواع</SelectItem>
                  <SelectItem value="آپارتمان">آپارتمان</SelectItem>
                  <SelectItem value="خانه">خانه</SelectItem>
                  <SelectItem value="اداری">اداری</SelectItem>
                  <SelectItem value="تجاری">تجاری</SelectItem>
                  <SelectItem value="صنعتی">صنعتی</SelectItem>
                  <SelectItem value="زمین">زمین</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">محدوده قیمت</label>
              <Select value={filters.price_range} onValueChange={(value) => handleFilterChange('price_range', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="همه">همه محدوده‌ها</SelectItem>
                  <SelectItem value="زیر ۱ میلیارد">زیر ۱ میلیارد ریال</SelectItem>
                  <SelectItem value="۱ تا ۵ میلیارد">۱ تا ۵ میلیارد ریال</SelectItem>
                  <SelectItem value="۵ تا ۱۰ میلیارد">۵ تا ۱۰ میلیارد ریال</SelectItem>
                  <SelectItem value="بالای ۱۰ میلیارد">بالای ۱۰ میلیارد ریال</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={() => setIsOpen(false)} className="flex-1">
              اعمال فیلترها
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}