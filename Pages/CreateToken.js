import React, { useState } from 'react';
import { Property } from '@/entities/Property';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

export default function CreateToken() {
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    address: '',
    property_type: 'آپارتمان',
    total_value: '',
    images: [],
    documents: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const user = await User.me();
      await Property.create({
        ...propertyData,
        owner_contact: user.email,
        status: 'در_حال_بررسی',
      });
      alert('ملک شما با موفقیت برای بررسی ثبت شد!');
      // redirect or clear form
    } catch (error) {
      alert('خطا در ثبت ملک.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">ثبت ملک برای توکن‌سازی</h1>
          <p className="text-slate-600">اطلاعات ملک خود را در چند مرحله ساده وارد کنید</p>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardHeader><CardTitle>مرحله {step}: اطلاعات ملک</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="title">عنوان ملک</Label>
                  <Input id="title" name="title" value={propertyData.title} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="address">آدرس</Label>
                  <Input id="address" name="address" value={propertyData.address} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="property_type">نوع ملک</Label>
                  <Select onValueChange={(val) => setPropertyData(p => ({ ...p, property_type: val }))} defaultValue={propertyData.property_type}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="آپارتمان">آپارتمان</SelectItem>
                      <SelectItem value="خانه">خانه</SelectItem>
                      <SelectItem value="تجاری">تجاری</SelectItem>
                      <SelectItem value="اداری">اداری</SelectItem>
                      <SelectItem value="زمین">زمین</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setStep(2)} className="w-full">مرحله بعد</Button>
              </>
            )}
            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="description">توضیحات</Label>
                  <Textarea id="description" name="description" value={propertyData.description} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="total_value">ارزش کل ملک (تومان)</Label>
                  <Input type="number" id="total_value" name="total_value" value={propertyData.total_value} onChange={(e) => setPropertyData(p => ({...p, total_value: parseInt(e.target.value) * 10}))} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setStep(1)} variant="outline" className="w-1/2">قبلی</Button>
                  <Button onClick={() => setStep(3)} className="w-1/2">مرحله بعد</Button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div>
                  <Label>تصاویر ملک</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto w-8 h-8 text-slate-400" />
                    <p>فایل‌ها را اینجا بکشید یا کلیک کنید</p>
                  </div>
                </div>
                <div>
                  <Label>اسناد و مدارک</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto w-8 h-8 text-slate-400" />
                    <p>سند، پایان کار و...</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setStep(2)} variant="outline" className="w-1/2">قبلی</Button>
                  <Button onClick={handleSubmit} className="w-1/2">ثبت و ارسال برای بررسی</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}