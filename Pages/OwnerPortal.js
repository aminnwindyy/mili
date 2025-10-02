import React, { useState, useEffect } from 'react';
import { Property } from '@/entities/Property';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Building2, TrendingUp, Users, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/components/ui/formatters';

export default function OwnerPortal() {
  const [myProperties, setMyProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        const propertiesData = await Property.filter({ owner_contact: user.email }); // Assuming email is used as contact
        setMyProperties(propertiesData);
      } catch (error) {
        // Load from localStorage (submitted properties) + Mock data for demo
        const submittedProperties = JSON.parse(localStorage.getItem('owner-properties') || '[]');
        const mockProperties = [
          { id: 1, title: 'آپارتمان نیاوران', status: 'فروخته_شده', total_value: 200000000000, collected: 200000000000 },
          { id: 2, title: 'ویلای لواسان', status: 'در_حال_فروش', total_value: 500000000000, collected: 150000000000 },
          { id: 3, title: 'مجتمع تجاری سعادت آباد', status: 'در_حال_بررسی', total_value: 800000000000, collected: 0 }
        ];
        setMyProperties([...submittedProperties, ...mockProperties]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const totalListedValue = myProperties.reduce((sum, p) => sum + p.total_value, 0);
  const totalFunded = myProperties.filter(p => p.status === 'فروخته_شده').length;

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">پورتال مالکین</h1>
            <p className="text-slate-600">املاک خود را برای توکن‌سازی مدیریت کنید</p>
          </div>
          <Link to={createPageUrl("CreateToken")}>
            <Button className="bg-gradient-to-l from-purple-600 to-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              ثبت ملک جدید
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader><CardTitle>تعداد املاک ثبت شده</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{myProperties.length}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>ارزش کل املاک</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{formatCurrency(totalListedValue)}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>پروژه‌های موفق</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{totalFunded}</p></CardContent>
          </Card>
        </div>

        {/* My Properties List */}
        <Card>
          <CardHeader><CardTitle>لیست املاک شما</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <p>در حال بارگذاری...</p>
            ) : myProperties.length > 0 ? (
              <div className="space-y-4">
                {myProperties.map(prop => (
                  <Card key={prop.id} className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-semibold">{prop.title}</h3>
                      <p className="text-sm text-slate-500">ارزش کل: {formatCurrency(prop.total_value)}</p>
                    </div>
                    <Badge variant={
                      prop.status === 'فروخته_شده' ? 'default' :
                      prop.status === 'در_حال_فروش' ? 'secondary' : 'destructive'
                    }>
                      {prop.status.replace(/_/g, ' ')}
                    </Badge>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center py-8">هنوز ملکی ثبت نکرده‌اید.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}