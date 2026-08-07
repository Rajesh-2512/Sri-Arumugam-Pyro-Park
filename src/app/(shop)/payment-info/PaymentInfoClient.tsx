'use client';

import { useState } from 'react';
import { Copy, Check, QrCode, Building2, Smartphone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

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
            Scan our unified UPI QR code or transfer directly to our official bank accounts listed below. Share your payment screenshot on WhatsApp for instant confirmation.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        
        {/* ─── 1. SINGLE UNIFIED ALL-IN-ONE UPI QR SCANNER CARD ─── */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-amber-400/90 shadow-2xl p-6 sm:p-10 space-y-6 text-center">
          
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" /> Unified All-in-One UPI Scanner
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-[family-name:var(--font-outfit)] uppercase tracking-tight">
              Scan to Pay with Any UPI App
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Accepts Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, Cred & all Mobile Banking Apps
            </p>
          </div>

          {/* QR Code Container */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white space-y-5 shadow-xl max-w-md mx-auto border border-slate-800">
            
            {/* Accepted Apps Badges Row */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] font-extrabold uppercase text-slate-300 bg-slate-800/60 py-2 px-4 rounded-xl border border-slate-700">
              <span className="text-blue-400">Google Pay</span> • <span className="text-purple-400">PhonePe</span> • <span className="text-cyan-400">Paytm</span> • <span className="text-emerald-400">BHIM</span>
            </div>

            {/* Rendered Crisp Unified QR Code */}
            <div className="bg-white p-5 rounded-2xl border-4 border-amber-400/90 inline-block shadow-2xl">
              <svg className="w-52 h-52 sm:w-60 sm:h-60 mx-auto" viewBox="0 0 100 100">
                <rect x="0" y="0" width="100" height="100" fill="white"/>
                
                {/* Top Left Pos Tracker */}
                <rect x="5" y="5" width="25" height="25" fill="#0f172a"/>
                <rect x="8" y="8" width="19" height="19" fill="white"/>
                <rect x="11" y="11" width="13" height="13" fill="#0f172a"/>

                {/* Top Right Pos Tracker */}
                <rect x="70" y="5" width="25" height="25" fill="#0f172a"/>
                <rect x="73" y="8" width="19" height="19" fill="white"/>
                <rect x="76" y="11" width="13" height="13" fill="#0f172a"/>

                {/* Bottom Left Pos Tracker */}
                <rect x="5" y="70" width="25" height="25" fill="#0f172a"/>
                <rect x="8" y="73" width="19" height="19" fill="white"/>
                <rect x="11" y="76" width="13" height="13" fill="#0f172a"/>

                {/* QR Data Pattern */}
                <rect x="35" y="8" width="6" height="6" fill="#ea580c"/>
                <rect x="45" y="8" width="6" height="6" fill="#059669"/>
                <rect x="55" y="8" width="6" height="6" fill="#2563eb"/>
                
                <rect x="35" y="18" width="6" height="6" fill="#0f172a"/>
                <rect x="50" y="18" width="6" height="6" fill="#d97706"/>
                <rect x="60" y="18" width="6" height="6" fill="#0f172a"/>

                <rect x="10" y="35" width="6" height="6" fill="#0f172a"/>
                <rect x="20" y="35" width="6" height="6" fill="#0f172a"/>
                
                {/* Center UPI Logo Shield */}
                <rect x="34" y="34" width="32" height="32" fill="#0f172a" rx="6"/>
                <circle cx="50" cy="50" r="11" fill="#f59e0b"/>
                <text x="50" y="54" fontSize="9" fontWeight="900" fill="#0f172a" textAnchor="middle">UPI</text>

                <rect x="70" y="35" width="6" height="6" fill="#0f172a"/>
                <rect x="82" y="35" width="6" height="6" fill="#0f172a"/>
                <rect x="70" y="45" width="6" height="6" fill="#0f172a"/>

                <rect x="35" y="70" width="6" height="6" fill="#0f172a"/>
                <rect x="48" y="70" width="6" height="6" fill="#0f172a"/>
                <rect x="58" y="75" width="6" height="6" fill="#0f172a"/>
                <rect x="70" y="70" width="22" height="22" fill="#0f172a"/>
              </svg>
            </div>

            {/* Account & UPI Details Box */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Account Name:</span>
                <span className="font-extrabold text-amber-400">A. HARIKRISHNAN / MARIESWARAN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Primary UPI ID:</span>
                <span className="font-mono font-extrabold text-white">krishnanhk55@okaxis</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Secondary UPI ID:</span>
                <span className="font-mono font-bold text-slate-300">6374041238@ybl</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-md mx-auto">
            <button
              onClick={() => copyToClipboard('krishnanhk55@okaxis', 'qr_upi_copy')}
              className="py-3 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copiedField === 'qr_upi_copy' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-600" />}
              <span>{copiedField === 'qr_upi_copy' ? 'UPI ID Copied!' : 'Copy UPI ID'}</span>
            </button>

            <a
              href="https://wa.me/918682913516?text=Hi%20Sri%20Arumugam%20Pyro%20Park,%20I%20have%20completed%20the%20UPI%20payment"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>WhatsApp Payment Slip</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* ─── 2. BANK & DIRECT TRANSFER DETAILS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Card 1: Bank Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/80 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-amber-600 font-[family-name:var(--font-outfit)] uppercase tracking-wider">
                  DIRECT BANK TRANSFER
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">ACCOUNT NAME:</span>
                <span className="font-bold text-slate-900">A.MARIESWARAN</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">BANK NAME:</span>
                <span className="font-bold text-slate-900">KARUR VYSYA BANK LTD</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">ACCOUNT NUMBER:</span>
                  <span className="font-bold text-slate-900 text-sm tracking-wider">1261155000137304</span>
                </div>
                <button
                  onClick={() => copyToClipboard('1261155000137304', 'bank_acc')}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'bank_acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'bank_acc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">IFSC CODE:</span>
                  <span className="font-bold text-slate-900 text-sm tracking-wider">KVBL0001261</span>
                </div>
                <button
                  onClick={() => copyToClipboard('KVBL0001261', 'bank_ifsc')}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'bank_ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'bank_ifsc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">BRANCH:</span>
                <span className="font-bold text-slate-900">SIVAKASI BRANCH</span>
              </div>
            </div>
          </div>

          {/* Card 2: Mobile Numbers */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400/80 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-amber-600 font-[family-name:var(--font-outfit)] uppercase tracking-wider">
                  DIRECT MOBILE PAYMENTS
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">GOOGLE PAY MOBILE:</span>
                  <span className="font-bold text-slate-900 text-sm tracking-wider">63799 59428</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Name: A. MARIESWARAN</span>
                </div>
                <button
                  onClick={() => copyToClipboard('6379959428', 'gpay_phone')}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'gpay_phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'gpay_phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">PHONEPE / PAYTM MOBILE:</span>
                  <span className="font-bold text-slate-900 text-sm tracking-wider">63740 41238</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Name: A. HARIKRISHNAN</span>
                </div>
                <button
                  onClick={() => copyToClipboard('6374041238', 'phonepe_phone')}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'phonepe_phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'phonepe_phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">UPI ID:</span>
                  <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">krishnanhk55@okaxis</span>
                </div>
                <button
                  onClick={() => copyToClipboard('krishnanhk55@okaxis', 'upi_direct')}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'upi_direct' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'upi_direct' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
