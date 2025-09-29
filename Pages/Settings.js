import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  User as UserIcon,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Volume2,
  Phone,
  Mail
} from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // States for user settings
  const [fullName, setFullName] = useState("");
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      setFullName(userData.full_name || "");
      setIsSimpleMode(userData.simple_mode ?? true);
      setSoundEffects(userData.sound_effects ?? true);
      setVibration(userData.vibration ?? true);
      // Assuming notification settings are stored similarly
      setEmailNotifications(userData.email_notifications ?? true);
      setSmsNotifications(userData.sms_notifications ?? false);
    } catch (error) {
      console.error("Error loading user settings:", error);
    }
    setIsLoading(false);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const settingsData = {
        full_name: fullName,
        simple_mode: isSimpleMode,
        sound_effects: soundEffects,
        vibration: vibration,
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications
      };
      await User.updateMyUserData(settingsData);
      alert("تنظیمات با موفقیت ذخیره شد!");
    } catch (error) {
      alert("خطا در ذخیره تنظیمات.");
    }
    setIsLoading(false);
  };

  if (isLoading && !user) {
    return (
      <div className="p-6 text-center">
        <p>در حال بارگذاری تنظیمات...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-emerald-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">تنظیمات</h1>
          <p className="text-slate-600">مدیریت حساب کاربری و تنظیمات پلتفرم</p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-emerald-600" />
                اطلاعات حساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">نام کامل</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="نام خود را وارد کنید"
                />
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">{user?.phone || "شماره موبایل ثبت نشده"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-600" />
                تنظیمات نمایش
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="simpleMode">حالت ساده/پیشرفته</Label>
                  <p className="text-sm text-slate-500">
                    {isSimpleMode ? 'نمایش ساده و ضروری' : 'نمایش تمام جزئیات'}
                  </p>
                </div>
                <Switch 
                  id="simpleMode" 
                  checked={!isSimpleMode} 
                  onCheckedChange={(checked) => setIsSimpleMode(!checked)} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Sound & Haptics */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-purple-600" />
                صدا و لرزش
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <Label htmlFor="soundEffects">افکت‌های صوتی</Label>
                <Switch 
                  id="soundEffects" 
                  checked={soundEffects} 
                  onCheckedChange={setSoundEffects} 
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <Label htmlFor="vibration">لرزش (در موبایل)</Label>
                <Switch 
                  id="vibration" 
                  checked={vibration} 
                  onCheckedChange={setVibration} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                اعلانات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <Label htmlFor="emailNotifications">دریافت ایمیل</Label>
                <Switch 
                  id="emailNotifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <Label htmlFor="smsNotifications">دریافت پیامک</Label>
                <Switch 
                  id="smsNotifications" 
                  checked={smsNotifications} 
                  onCheckedChange={setSmsNotifications} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveChanges} 
              className="bg-gradient-to-l from-emerald-600 to-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}