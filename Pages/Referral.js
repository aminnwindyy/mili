
import React, { useState, useEffect, useCallback } from 'react';
import { Referral as ReferralEntity } from '@/entities/Referral';
import { User } from '@/entities/User';
import { LoyaltyProgram } from '@/entities/LoyaltyProgram';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, Users, Gift, CheckCircle, MessageCircle, Send } from 'lucide-react';

export default function Referral() {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [refereeEmail, setRefereeEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const loadReferralData = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Generate referral code if not exists
      if (!userData.referral_code) {
        const newCode = generateReferralCode(userData.email);
        await User.updateMyUserData({ referral_code: newCode });
        setReferralCode(newCode);
      } else {
        setReferralCode(userData.referral_code);
      }

      // Load referrals
      const userReferrals = await ReferralEntity.filter({ referrer_email: userData.email });
      setReferrals(userReferrals);
    } catch (error) {
      console.error('Error loading referral data:', error);
      // Demo data for testing
      setReferralCode('MELK-DEMO-123');
      setReferrals([
        { id: 1, referee_email: 'user1@example.com', status: 'completed', reward_amount: 500000 },
        { id: 2, referee_email: 'user2@example.com', status: 'pending', reward_amount: 500000 }
      ]);
    }
    setIsLoading(false);
  }, []); // Empty dependency array as `loadReferralData` itself does not depend on changing props or state inside the component scope directly that aren't setters or stable imports.

  useEffect(() => {
    loadReferralData();
  }, [loadReferralData]); // Now `loadReferralData` is stable due to `useCallback`

  const generateReferralCode = (email) => {
    const prefix = 'MELK';
    const hash = email.split('@')[0].toUpperCase().substring(0, 4);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${hash}-${random}`;
  };

  const sendReferralInvite = async () => {
    if (!refereeEmail) {
      alert('لطفاً ایمیل فرد مورد نظر را وارد کنید');
      return;
    }

    try {
      // Create referral record
      const newReferral = await ReferralEntity.create({
        referrer_email: user.email,
        referee_email: refereeEmail,
        status: 'pending',
        reward_amount: 500000 // 500k rial reward
      });

      // Send invitation email (using SendEmail integration)
      const { SendEmail } = await import('@/integrations/Core');
      const inviteMessage = `
سلام!

${user.full_name || user.email} شما را به پلتفرم MelkChain دعوت کرده است.

MelkChain اولین پلتفرم توکن‌سازی املاک در ایران است که به شما امکان سرمایه‌گذاری در املاک با سرمایه کم را می‌دهد.

کد دعوت شما: ${referralCode}

با استفاده از این کد، هم شما و هم دوست‌تان ۵۰۰ هزار ریال جایزه دریافت خواهید کرد!

لینک ثبت‌نام: ${window.location.origin}?ref=${referralCode}

موفق باشید!
تیم MelkChain
      `;

      await SendEmail({
        to: refereeEmail,
        subject: 'دعوت به پلتفرم MelkChain - سرمایه‌گذاری در املاک',
        body: inviteMessage,
        from_name: 'تیم MelkChain'
      });

      setReferrals([...referrals, newReferral]);
      setRefereeEmail('');
      alert('دعوت‌نامه با موفقیت ارسال شد!');
    } catch (error) {
      console.error('Error sending referral:', error);
      alert('خطا در ارسال دعوت‌نامه');
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('کپی شد!');
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('کپی شد!');
    }
  };

  const shareViaWhatsApp = () => {
    const message = `سلام! 
من از پلتفرم MelkChain برای سرمایه‌گذاری در املاک استفاده می‌کنم.
با کد دعوت من ${referralCode} ثبت‌نام کن تا هردومون ۵۰۰ هزار ریال جایزه بگیریم!
${window.location.origin}?ref=${referralCode}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaTelegram = () => {
    const message = `سلام! من از پلتفرم MelkChain استفاده می‌کنم. با کد ${referralCode} ثبت‌نام کن! ${window.location.origin}?ref=${referralCode}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '?ref=' + referralCode)}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const totalRewards = referrals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.reward_amount, 0);
  const pendingRewards = referrals.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.reward_amount, 0);

  if (isLoading) {
    return <div className="p-6 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-bl from-slate-50 to-purple-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            سیستم ارجاع
          </h1>
          <p className="text-slate-600">دوستان خود را دعوت کنید و پاداش دریافت کنید</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-emerald-50 to-green-50">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <div className="text-2xl font-bold text-slate-900">{referrals.length}</div>
              <div className="text-sm text-slate-600">دعوت‌های شما</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-blue-50 to-indigo-50">
            <CardContent className="p-6 text-center">
              <Gift className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-slate-900">
                {(totalRewards / 1000000).toFixed(1)}م
              </div>
              <div className="text-sm text-slate-600">پاداش دریافتی</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-bl from-amber-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <div className="text-2xl font-bold text-slate-900">
                {referrals.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-sm text-slate-600">دعوت موفق</div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle>کد دعوت شما</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1 p-4 bg-slate-100 rounded-lg font-mono text-lg text-center">
                {referralCode}
              </div>
              <Button onClick={() => handleCopy(referralCode)} className="bg-emerald-600">
                <Copy className="w-4 h-4 mr-2" />
                کپی
              </Button>
            </div>
            <p className="text-sm text-slate-500 mt-2 text-center">
              هر دوست که با این کد ثبت‌نام کند، شما ۵۰۰ هزار ریال پاداش دریافت می‌کنید
            </p>
          </CardContent>
        </Card>

        {/* Send Invitation */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle>دعوت دوستان</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="email"
                value={refereeEmail}
                onChange={(e) => setRefereeEmail(e.target.value)}
                placeholder="ایمیل دوست خود را وارد کنید"
                className="flex-1"
              />
              <Button onClick={sendReferralInvite} className="bg-blue-600">
                <Send className="w-4 h-4 mr-2" />
                ارسال دعوت
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={shareViaWhatsApp} variant="outline" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                واتساپ
              </Button>
              <Button onClick={shareViaTelegram} variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                تلگرام
              </Button>
              <Button 
                onClick={() => handleCopy(`${window.location.origin}?ref=${referralCode}`)} 
                variant="outline" 
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                لینک
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>لیست ارجاع‌های شما</CardTitle>
          </CardHeader>
          <CardContent>
            {referrals.length > 0 ? (
              <div className="space-y-3">
                {referrals.map((ref) => (
                  <div key={ref.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <span className="font-medium text-slate-700">
                        {ref.referee_email}
                      </span>
                      <div className="text-sm text-slate-500">
                        پاداش: {(ref.reward_amount / 1000000).toFixed(1)} میلیون ریال
                      </div>
                    </div>
                    <Badge className={
                      ref.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }>
                      {ref.status === 'completed' ? 'تکمیل شده' : 'در انتظار'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>هنوز کسی را دعوت نکرده‌اید</p>
                <p className="text-sm">دوستان خود را دعوت کنید و پاداش دریافت کنید</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
