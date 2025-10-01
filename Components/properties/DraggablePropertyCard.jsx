import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, TrendingUp, Eye, Heart, Coins, Grip } from 'lucide-react';
import { motion } from 'framer-motion';
import ContextMenu from '../ui/ContextMenu';

export default function DraggablePropertyCard({ property, index, onDoubleClick }) {
  const [contextMenu, setContextMenu] = useState({ isVisible: false, x: 0, y: 0 });

  const getStatusColor = (status) => {
    switch (status) {
      case 'تایید_شده':
        return 'bg-emerald-100 text-emerald-800';
      case 'در_حال_فروش':
        return 'bg-blue-100 text-blue-800';
      case 'فروخته_شده':
        return 'bg-green-100 text-green-800';
      case 'رد_شده':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const progressPercentage = property.total_tokens > 0 
    ? ((property.total_tokens - property.available_tokens) / property.total_tokens) * 100 
    : 0;

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      isVisible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, isVisible: false });
  };

  return (
    <>
      <Draggable draggableId={JSON.stringify(property)} index={index}>
        {(provided, snapshot) => (
          <motion.div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="select-none"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`group transition-all duration-500 border-0 shadow-lg overflow-hidden cursor-move ${
                snapshot.isDragging 
                  ? 'shadow-2xl ring-2 ring-emerald-400 ring-opacity-60 rotate-3 scale-105' 
                  : 'hover:shadow-2xl hover:-translate-y-2'
              }`}
              onDoubleClick={() => onDoubleClick(property)}
              onContextMenu={handleContextMenu}
            >
              <div className="relative">
                <img 
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=240&fit=crop"}
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Drag Handle */}
                <div {...provided.dragHandleProps} className="absolute top-2 left-2 p-1 bg-black/20 rounded-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Grip className="w-4 h-4 text-white" />
                </div>
                
                <div className="absolute top-4 right-4">
                  <Badge className={getStatusColor(property.status)}>
                    {property.status?.replace('_', ' ')}
                  </Badge>
                </div>

                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 left-4 w-8 h-8 bg-white/80 hover:bg-white hover:text-red-500 transition-all duration-300 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to watchlist logic
                  }}
                >
                  <Heart className="w-4 h-4" />
                </Button>

                {/* Progress overlay for active properties */}
                {property.status === 'در_حال_فروش' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm p-3">
                    <div className="flex justify-between items-center text-white text-sm mb-1">
                      <span>پیشرفت فروش</span>
                      <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="bg-emerald-400 h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                )}

                {/* Dragging Indicator */}
                {snapshot.isDragging && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-white font-bold text-lg animate-bounce">
                      🎯 بکشید به سبد خرید
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                    {property.title}
                  </h3>
                  <Badge variant="outline">{property.property_type}</Badge>
                </div>

                <div className="flex items-center gap-1 text-slate-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm truncate">{property.address}</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">ارزش کل:</span>
                    <span className="font-semibold text-slate-900">
                      {(property.total_value / 1000000000).toFixed(1)} میلیارد ریال
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">قیمت توکن:</span>
                    <span className="font-semibold text-emerald-600">
                      {(property.token_price / 1000000).toFixed(1)} میلیون ریال
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">بازدهی مورد انتظار:</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {property.expected_annual_return || 15}%
                    </span>
                  </div>
                  
                  {property.available_tokens && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">توکن‌های موجود:</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        {property.available_tokens} / {property.total_tokens}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-l from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 hover:shadow-lg">
                    {property.status === 'در_حال_فروش' ? 'سرمایه‌گذاری' : 'مشاهده جزئیات'}
                  </Button>
                  <Button variant="outline" size="icon" className="hover:bg-slate-100 transition-all duration-300 hover:scale-110">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Draggable>

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isVisible={contextMenu.isVisible}
        onClose={handleCloseContextMenu}
        property={property}
        onViewDetails={(prop) => onDoubleClick(prop)}
        onAddToWatchlist={(prop) => console.log('Add to watchlist:', prop.title)}
        onShare={(prop) => {
          if (navigator.share) {
            navigator.share({
              title: prop.title,
              text: `مشاهده این فرصت سرمایه‌گذاری: ${prop.title}`,
              url: window.location.href + `?property=${prop.id}`
            });
          } else {
            navigator.clipboard.writeText(window.location.href + `?property=${prop.id}`);
            alert('لینک کپی شد!');
          }
        }}
        onCompare={(prop) => alert(`قابلیت مقایسه برای ${prop.title} در حال توسعه...`)}
        onRate={(prop) => alert(`قابلیت رتبه‌دهی برای ${prop.title} در حال توسعه...`)}
      />
    </>
  );
}