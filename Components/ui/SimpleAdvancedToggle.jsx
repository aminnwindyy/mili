import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export default function SimpleAdvancedToggle({ isSimpleMode, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2">
        {isSimpleMode ? <Eye className="w-4 h-4 text-slate-500" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
        <Label className="text-sm font-medium text-slate-700">
          {isSimpleMode ? 'نمای ساده' : 'نمای پیشرفته'}
        </Label>
      </div>
      <Switch
        checked={!isSimpleMode}
        onCheckedChange={(checked) => onToggle(!checked)}
        aria-label="toggle-dashboard-mode"
      />
    </div>
  );
}