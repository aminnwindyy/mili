import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Calendar, Coins, TrendingUp, TrendingDown, Eye } from "lucide-react";

const statusColors = {
  "فعال": "bg-green-100 text-green-800 border-green-200",
  "فروخته_شده": "bg-gray-100 text-gray-800 border-gray-200",
  "منقضی": "bg-red-100 text-red-800 border-red-200"
};

export default function InvestmentCard({ investment, property }) {
  const profitLoss = (investment.current_value || investment.total_amount) - investment.total_amount;
  const profitPercentage = investment.total_amount > 0 
    ? ((profitLoss / investment.total_amount) * 100) 
    : 0;

  return (
    <div className="p-6 hover:bg-slate-50 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">
                {property?.title || 'ملک نامشخص'}
              </h3>
              {property?.address && (
                <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{property.address}</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Badge 
                  className={`${statusColors[investment.status]} border text-xs`}
                >
                  {investment.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Coins className="w-3 h-3 mr-1" />
                  {investment.tokens_purchased} توکن
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(investment.purchase_date).toLocaleDateString('fa-IR')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="text-left">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <p className="text-xs text-slate-500">سرمایه اولیه:</p>
                <p className="font-semibold text-slate-900">
                  {(investment.total_amount / 1000000000).toFixed(2)} میلیارد ریال
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">ارزش فعلی:</p>
                <p className="font-semibold text-slate-900">
                  {((investment.current_value || investment.total_amount) / 1000000000).toFixed(2)} میلیارد ریال
                </p>
              </div>
            </div>
            
            <div className="text-center p-2 rounded-lg border">
              <div className={`flex items-center justify-center gap-1 text-sm font-semibold ${
                profitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {profitLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {profitLoss >= 0 ? '+' : ''}{profitPercentage.toFixed(1)}%
              </div>
              <p className={`text-xs ${
                profitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {profitLoss >= 0 ? '+' : ''}{(profitLoss / 1000000).toFixed(1)} میلیون ریال
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              جزئیات
            </Button>
            {investment.status === "فعال" && (
              <Button size="sm" variant="destructive">
                فروش
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}