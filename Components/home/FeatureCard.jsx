import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeatureCard({ icon: Icon, title, description, gradient }) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-white">
      <CardContent className="p-8 text-center">
        <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-bl ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-600 leading-relaxed">
          {description}
        </p>
        
        <div className={`w-0 group-hover:w-12 h-1 bg-gradient-to-l ${gradient} mx-auto mt-6 transition-all duration-300 rounded-full`}></div>
      </CardContent>
    </Card>
  );
}