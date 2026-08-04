'use client';

import { Sparkles, Flame, Percent, Zap, Gift } from 'lucide-react';

const newsItems = [
  { icon: Flame, text: '🔥 DIWALI MEGA SALE: FLAT 80% OFF SIVAKASI FACTORY OUTLET PRICES!', color: 'text-amber-300' },
  { icon: Sparkles, text: '✨ FREE EXPRESS ALL-INDIA SHIPPING ON ORDERS ABOVE ₹3,000!', color: 'text-yellow-300' },
  { icon: Percent, text: '💥 EXCLUSIVE DIRECT WHOLESALE RATES ON GROUND CHAKKARS, SPARKLERS & ROCKETS!', color: 'text-orange-300' },
  { icon: Zap, text: '⚡️ 24-HOUR FAST DISPATCH WITH REAL-TIME WHATSAPP ORDER TRACKING!', color: 'text-[#ff5252]' },
  { icon: Gift, text: '🎁 PRE-BOOK NOW FOR GUARANTEED DIWALI STOCK & EXTRA GIFT BOXES!', color: 'text-emerald-300' },
];

export default function MarqueeTicker() {
  return (
    <div className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white overflow-hidden py-2.5 border-b border-orange-400/30 shadow-md">
      <div className="flex animate-marquee whitespace-nowrap gap-12 font-extrabold text-xs uppercase tracking-wider items-center">
        {/* Double the news items array to create seamless 100% infinite loop */}
        {[...newsItems, ...newsItems, ...newsItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 shrink-0 hover:scale-105 transition-transform cursor-pointer">
              <Icon className={`w-4 h-4 ${item.color} animate-pulse`} />
              <span className="drop-shadow-xs">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
