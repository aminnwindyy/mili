import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Coins } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  "در_حال_بررسی": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "تایید_شده": "bg-blue-100 text-blue-800 border-blue-200",
  "در_حال_فروش": "bg-green-100 text-green-800 border-green-200",
  "فروخته_شده": "bg-gray-100 text-gray-800 border-gray-200",
  "رد_شده": "bg-red-100 text-red-800 border-red-200"
};

const statusLabels = {
  "در_حال_بررسی": "در حال بررسی",
  "تایید_شده": "تایید شده", 
  "در_حال_فروش": "در حال فروش",
  "فروخته_شده": "فروخته شده",
  "رد_شده": "رد شده"
};

export default function RecentProperties({ properties, isLoading }) {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-bl from-white to-slate-50">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building2 className="w-6 h-6 text-blue-600" />
          املاک اخیر
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <div key={property.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{property.address}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="secondary"
                        className={`${statusColors[property.status]} border text-xs`}
                      >
                        {statusLabels[property.status]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Coins className="w-3 h-3 mr-1" />
                        {property.available_tokens || 0} توکن
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {property.property_type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900">
                      {(property.total_value / 1000000000).toFixed(1)} میلیارد
                    </p>
                    <p className="text-xs text-slate-500">ریال</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Building2 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 mb-2">هیچ ملکی ثبت نشده است</p>
              <p className="text-sm text-slate-400">اولین ملک خود را برای توکن‌سازی ثبت کنید</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}