import React from 'react';
import { Card } from '@/components/ui/card';

export default function StickyMobileActions({ children }) {
  return (
    <Card className="md:hidden fixed bottom-0 left-0 right-0 z-40 rounded-none border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-2xl">
      <div className="flex gap-3 p-4 safe-area-pb">
        {children}
      </div>
    </Card>
  );
}