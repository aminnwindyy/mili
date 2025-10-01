import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';

export default function DashboardWidget({ id, index, children }) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative ${snapshot.isDragging ? 'shadow-2xl scale-105' : 'shadow-lg'} transition-all duration-200`}
        >
          {/* Draggable Handle */}
          <div 
            {...provided.dragHandleProps}
            className="absolute top-4 left-4 p-2 bg-slate-100/50 rounded-lg cursor-grab active:cursor-grabbing opacity-30 hover:opacity-100 transition-opacity"
            title="برای جابجایی بکشید"
          >
            <GripVertical className="w-5 h-5 text-slate-500" />
          </div>
          
          {children}
        </div>
      )}
    </Draggable>
  );
}