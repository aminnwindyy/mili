import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, gradient, trend }) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-bl ${gradient} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
            <span className="text-emerald-600 font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}