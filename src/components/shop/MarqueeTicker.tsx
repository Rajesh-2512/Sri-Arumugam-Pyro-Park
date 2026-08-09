'use client';

const tickerItems = [
  { text: 'PREMIUM QUALITY VERIFIED FIREWORKS', color: 'text-yellow-300' },
  { text: 'DIWALI 2026 BOOKINGS OPEN! ORDER NOW!', color: 'text-white' },
  { text: '100% SIVAKASI DIRECT FACTORY PRICE', color: 'text-yellow-300' },
  { text: 'WHATSAPP ORDER: 8682913516, 6374041238', color: 'text-yellow-300' },
  { text: 'ENQUIRY: 6379959428, 6374041238', color: 'text-white' },
  { text: 'MIN ORDER ₹3,000 (TN) | ₹5,000 (OTHERS)', color: 'text-yellow-300' },
];

const dotColors = ['text-red-500', 'text-yellow-400', 'text-green-400', 'text-pink-400', 'text-orange-400', 'text-cyan-400', 'text-amber-300'];

export default function MarqueeTicker() {
  return (
    <div className="w-full bg-[rgb(101,11,175)] text-white overflow-hidden py-[6px]">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <span
              className={`text-[13px] font-semibold tracking-wide ${item.color}`}
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              {item.text}
            </span>
            <span className={`${dotColors[idx % dotColors.length]} mx-4 text-base select-none`}>
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
