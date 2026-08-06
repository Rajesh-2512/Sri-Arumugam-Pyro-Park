'use client';

import { useState } from 'react';
import { Copy, Check, QrCode, Building2, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PaymentInfoClient() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16 font-sans">
      
      {/* Header Banner */}
      <section className="relative bg-gradient-to-br from-[#12151e] via-[#1a1f2e] to-[#0f1219] text-white py-14 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto space-y-3 z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Safe & Direct Bank Transfer</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-[family-name:var(--font-outfit)] tracking-tight uppercase">
            Payment Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Please make payment using any of the bank accounts or UPI methods listed below. After payment, share your screenshot on WhatsApp for instant confirmation.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        
        {/* Top 3 Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Bank Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/80 shadow-md hover:shadow-xl transition-all space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-amber-600 font-[family-name:var(--font-outfit)] uppercase tracking-wider">
                  BANK INFO
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">NAME:</span>
                <span className="font-bold text-slate-900">A.MARIESWARAN</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">BANK:</span>
                <span className="font-bold text-slate-900">KARUR VYSYA BANK LTD</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">A/C NO:</span>
                  <span className="font-bold text-slate-900 text-sm tracking-wider">1261155000137304</span>
                </div>
                <button
                  onClick={() => copyToClipboard('1261155000137304', 'bank_acc')}
                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'bank_acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'bank_acc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">IFSC:</span>
                  <span className="font-bold text-slate-900 text-sm tracking-wider">KVBL0001261</span>
                </div>
                <button
                  onClick={() => copyToClipboard('KVBL0001261', 'bank_ifsc')}
                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'bank_ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'bank_ifsc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">BRANCH:</span>
                <span className="font-bold text-slate-900">SIVAKASI BRANCH</span>
              </div>
            </div>
          </div>

          {/* Card 2: Google Pay */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/80 shadow-md hover:shadow-xl transition-all space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-amber-600 font-[family-name:var(--font-outfit)] uppercase tracking-wider">
                  GOOGLE PAY
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">PHONE NO:</span>
                  <span className="font-bold text-slate-900 text-sm tracking-wider">6379959428</span>
                </div>
                <button
                  onClick={() => copyToClipboard('6379959428', 'gpay_phone')}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'gpay_phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'gpay_phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">NAME:</span>
                <span className="font-bold text-slate-900">A.MARIESWARAN</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">UPI ID:</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">marieswaran050@okicici</span>
                </div>
                <button
                  onClick={() => copyToClipboard('marieswaran050@okicici', 'gpay_upi')}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'gpay_upi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'gpay_upi' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: PhonePe */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/80 shadow-md hover:shadow-xl transition-all space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-amber-600 font-[family-name:var(--font-outfit)] uppercase tracking-wider">
                  PHONE PE
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">PHONE NO:</span>
                  <span className="font-bold text-slate-900 text-sm tracking-wider">63740 41238</span>
                </div>
                <button
                  onClick={() => copyToClipboard('6374041238', 'phonepe_phone')}
                  className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'phonepe_phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'phonepe_phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">NAME:</span>
                <span className="font-bold text-slate-900">A.HARIKRISHNAN</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">UPI ID:</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-wide">6374041238@ybl</span>
                </div>
                <button
                  onClick={() => copyToClipboard('6374041238@ybl', 'phonepe_upi')}
                  className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'phonepe_upi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'phonepe_upi' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom 3 QR Scan Cards Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-[family-name:var(--font-outfit)] uppercase">
              Scan & Pay Options
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Use any UPI Scanner App (GPay, PhonePe, Paytm, BHIM) to scan and make payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* QR Card 1: GOOGLE PAY SCAN */}
            <div className="bg-white p-6 rounded-3xl border-2 border-amber-400/80 shadow-md flex flex-col justify-between items-center text-center space-y-4">
              <h3 className="text-lg font-black text-amber-600 uppercase font-[family-name:var(--font-outfit)]">
                GOOGLE PAY SCAN
              </h3>

              {/* Styled GPay Card Representation */}
              <div className="w-full bg-[#f8fbff] p-5 rounded-2xl border border-blue-100 space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    HK
                  </div>
                  <span className="font-bold text-slate-900 text-sm">Hari Krishnan</span>
                </div>

                {/* Rendered Scannable QR Code */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block shadow-xs">
                  <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="100" height="100" fill="white"/>
                    <rect x="5" y="5" width="25" height="25" fill="#1e293b"/>
                    <rect x="8" y="8" width="19" height="19" fill="white"/>
                    <rect x="11" y="11" width="13" height="13" fill="#1e293b"/>

                    <rect x="70" y="5" width="25" height="25" fill="#1e293b"/>
                    <rect x="73" y="8" width="19" height="19" fill="white"/>
                    <rect x="76" y="11" width="13" height="13" fill="#1e293b"/>

                    <rect x="5" y="70" width="25" height="25" fill="#1e293b"/>
                    <rect x="8" y="73" width="19" height="19" fill="white"/>
                    <rect x="11" y="76" width="13" height="13" fill="#1e293b"/>

                    {/* QR Code Data Dots Pattern */}
                    <rect x="35" y="10" width="6" height="6" fill="#4285F4"/>
                    <rect x="45" y="10" width="6" height="6" fill="#34A853"/>
                    <rect x="55" y="10" width="6" height="6" fill="#EA4335"/>
                    <rect x="35" y="20" width="6" height="6" fill="#1e293b"/>
                    <rect x="50" y="20" width="6" height="6" fill="#FBBC05"/>

                    <rect x="10" y="35" width="6" height="6" fill="#1e293b"/>
                    <rect x="20" y="35" width="6" height="6" fill="#1e293b"/>
                    <rect x="35" y="35" width="30" height="30" fill="#1e293b" rx="4"/>
                    
                    <circle cx="50" cy="50" r="10" fill="white"/>
                    <path d="M53 50c0-1.6-.4-3-1.2-4.2l2.3-2.3c1.7 1.8 2.7 4.1 2.7 6.5 0 2.4-1 4.7-2.7 6.5l-2.3-2.3c.8-1.2 1.2-2.6 1.2-4.2z" fill="#4285F4"/>

                    <rect x="70" y="35" width="6" height="6" fill="#1e293b"/>
                    <rect x="80" y="35" width="6" height="6" fill="#1e293b"/>
                    <rect x="70" y="45" width="6" height="6" fill="#1e293b"/>

                    <rect x="35" y="70" width="6" height="6" fill="#1e293b"/>
                    <rect x="45" y="70" width="6" height="6" fill="#1e293b"/>
                    <rect x="55" y="75" width="6" height="6" fill="#1e293b"/>
                    <rect x="70" y="70" width="20" height="20" fill="#1e293b"/>
                  </svg>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-700">UPI ID: krishnanhk55@okaxis</p>
                  <p className="text-[10px] text-slate-400">Scan to pay with any UPI app</p>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard('krishnanhk55@okaxis', 'gpay_qr_upi')}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedField === 'gpay_qr_upi' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedField === 'gpay_qr_upi' ? 'UPI ID Copied' : 'Copy UPI ID'}</span>
              </button>
            </div>

            {/* QR Card 2: UPI SCAN */}
            <div className="bg-white p-6 rounded-3xl border-2 border-amber-400/80 shadow-md flex flex-col justify-between items-center text-center space-y-4">
              <h3 className="text-lg font-black text-amber-600 uppercase font-[family-name:var(--font-outfit)]">
                ALL UPI APPS SCAN
              </h3>

              <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-4 my-auto min-h-[260px]">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Accepts All UPI Apps</h4>
                  <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                    Scan using Google Pay, PhonePe, Paytm, Cred, or BHIM UPI app.
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/918682913516?text=Hi%20Sri%20Arumugam%20Pyro%20Park,%20I%20want%20to%20confirm%20my%20UPI%20payment"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>WhatsApp Payment Slip</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* QR Card 3: PHONE PE SCAN */}
            <div className="bg-white p-6 rounded-3xl border-2 border-amber-400/80 shadow-md flex flex-col justify-between items-center text-center space-y-4">
              <h3 className="text-lg font-black text-amber-600 uppercase font-[family-name:var(--font-outfit)]">
                PHONE PE SCAN
              </h3>

              {/* Styled PhonePe Dark Card Representation */}
              <div className="w-full bg-[#1b1731] text-white p-5 rounded-2xl border border-purple-950 space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#5f259f] text-white font-bold text-[10px] flex items-center justify-center">
                    Pe
                  </div>
                  <span className="font-bold text-xs">Tamilnad Mercantile Bank - 0752</span>
                </div>

                {/* Rendered PhonePe Dark QR */}
                <div className="bg-[#120f24] p-4 rounded-xl border border-purple-900 inline-block shadow-md">
                  <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="100" height="100" fill="#120f24"/>
                    <rect x="5" y="5" width="25" height="25" fill="white"/>
                    <rect x="8" y="8" width="19" height="19" fill="#120f24"/>
                    <rect x="11" y="11" width="13" height="13" fill="white"/>

                    <rect x="70" y="5" width="25" height="25" fill="white"/>
                    <rect x="73" y="8" width="19" height="19" fill="#120f24"/>
                    <rect x="76" y="11" width="13" height="13" fill="white"/>

                    <rect x="5" y="70" width="25" height="25" fill="white"/>
                    <rect x="8" y="73" width="19" height="19" fill="#120f24"/>
                    <rect x="11" y="76" width="13" height="13" fill="white"/>

                    {/* Data dots */}
                    <rect x="35" y="10" width="6" height="6" fill="#a855f7"/>
                    <rect x="50" y="10" width="6" height="6" fill="white"/>
                    <rect x="35" y="35" width="30" height="30" fill="#5f259f" rx="4"/>
                    <circle cx="50" cy="50" r="9" fill="white"/>
                    <text x="50" y="54" fontSize="10" fontWeight="bold" fill="#5f259f" textAnchor="middle">Pe</text>

                    <rect x="70" y="35" width="6" height="6" fill="white"/>
                    <rect x="80" y="45" width="6" height="6" fill="white"/>
                    <rect x="35" y="70" width="6" height="6" fill="white"/>
                    <rect x="70" y="70" width="20" height="20" fill="white"/>
                  </svg>
                </div>

                <div className="space-y-1 text-left bg-[#120f24]/80 p-2.5 rounded-xl border border-purple-900/60 text-[11px]">
                  <p className="font-bold text-slate-200">UPI IDs:</p>
                  <p className="text-purple-300 font-mono">6374041238@ybl</p>
                  <p className="text-purple-300 font-mono">6374041238@axl</p>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard('6374041238@ybl', 'phonepe_qr_upi')}
                className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedField === 'phonepe_qr_upi' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedField === 'phonepe_qr_upi' ? 'UPI ID Copied' : 'Copy UPI ID'}</span>
              </button>
            </div>

          </div>
        </div>

      </main>

    </div>
  );
}
