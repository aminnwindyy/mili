import React, { useState, useEffect } from 'react';
import { Property } from '@/entities/Property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, TrendingUp, Eye } from 'lucide-react';
import { formatCurrency } from '@/components/ui/formatters';

export default function RelatedProperties({ currentProperty, onPropertySelect }) {
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const findRelatedProperties = async () => {
      if (!currentProperty) return;
      
      setIsLoading(true);
      try {
        const allProperties = await Property.list();
        
        // Algorithm similar to Netflix recommendations
        const related = allProperties
          .filter(prop => prop.id !== currentProperty.id)
          .map(prop => {
            let score = 0;
            
            // Same property type (highest weight)
            if (prop.property_type === currentProperty.property_type) {
              score += 40;
            }
            
            // Similar price range (30% weight)
            const priceDiff = Math.abs(prop.total_value - currentProperty.total_value) / currentProperty.total_value;
            if (priceDiff < 0.3) score += 30;
            else if (priceDiff < 0.5) score += 20;
            else if (priceDiff < 1) score += 10;
            
            // Similar expected return (20% weight)  
            if (prop.expected_annual_return && currentProperty.expected_annual_return) {
              const returnDiff = Math.abs(prop.expected_annual_return - currentProperty.expected_annual_return);
              if (returnDiff < 2) score += 20;
              else if (returnDiff < 5) score += 10;
            }
            
            // Same city/area (10% weight)
            if (prop.address && currentProperty.address) {
              const currentCity = currentProperty.address.split(' ')[0];
              const propCity = prop.address.split(' ')[0];
              if (currentCity === propCity) score += 10;
            }
            
            return { ...prop, relevanceScore: score };
          })
          .filter(prop => prop.relevanceScore > 20)
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 4);
        
        setRelatedProperties(related);
      } catch (error) {
        console.error('Error finding related properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    findRelatedProperties();
  }, [currentProperty]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-slate-900 mb-4">املاک مشابه</h3>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-200 rounded-lg h-24"></div>
        ))}
      </div>
    );
  }

  if (relatedProperties.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
        <p className="text-slate-500">هیچ ملک مشابهی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-600" />
        <h3 className="font-semibold text-lg text-slate-900">املاک مشابه</h3>
        <Badge variant="secondary" className="text-xs">
          بر اساس علایق شما
        </Badge>
      </div>
      
      <div className="space-y-3">
        {relatedProperties.map((property) => (
          <Card 
            key={property.id} 
            className="hover:shadow-md transition-shadow cursor-pointer border border-slate-200"
            onClick={() => onPropertySelect(property)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <img 
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=60&fit=crop"}
                  alt={property.title}
                  className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate text-sm">
                    {property.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{property.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">
                      {formatCurrency(property.total_value)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {property.expected_annual_return || 15}%
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-emerald-100 text-emerald-700"
                      >
                        {Math.round(property.relevanceScore)}% مشابه
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center pt-2">
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          مشاهده بیشتر
        </Button>
      </div>
    </div>
  );
}