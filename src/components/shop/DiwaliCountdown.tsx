'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Flame, Clock } from 'lucide-react';

export default function DiwaliCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target Diwali Date (e.g., Nov 8, 2026 or upcoming Diwali date)
    const targetDate = new Date('2026-11-08T00:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-300/40">
      
      {/* Background Decorative Sparkles */}
      <div className="absolute top-2 right-4 text-amber-200/30 text-6xl select-none font-black animate-pulse">
        ✨
      </div>
      <div className="absolute -bottom-4 -left-4 text-amber-200/20 text-8xl select-none font-black">
        💥
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="space-y-2 max-w-md">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-100 border border-white/30">
            <Flame className="w-4 h-4 text-amber-300 animate-bounce" /> DIWALI 2026 GRAND FESTIVAL
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Diwali Countdown & Pre-Booking
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
            Pre-book your Sivakasi crackers early to lock in <strong className="text-white font-extrabold underline decoration-amber-300">up to 85% OFF factory outlet prices</strong> before stock sells out!
          </p>
        </div>

        {/* Countdown Timer Boxes */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center shrink-0">
          
          <div className="bg-white/95 backdrop-blur-md text-[#1b2342] rounded-2xl p-3 sm:p-4 min-w-[65px] sm:min-w-[85px] shadow-lg border border-white/60 hover:scale-105 transition-transform">
            <span className="text-2xl sm:text-4xl font-black block tracking-tight text-amber-600">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-500 block mt-0.5">
              Days
            </span>
          </div>

          <div className="bg-white/95 backdrop-blur-md text-[#1b2342] rounded-2xl p-3 sm:p-4 min-w-[65px] sm:min-w-[85px] shadow-lg border border-white/60 hover:scale-105 transition-transform">
            <span className="text-2xl sm:text-4xl font-black block tracking-tight text-amber-600">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-500 block mt-0.5">
              Hours
            </span>
          </div>

          <div className="bg-white/95 backdrop-blur-md text-[#1b2342] rounded-2xl p-3 sm:p-4 min-w-[65px] sm:min-w-[85px] shadow-lg border border-white/60 hover:scale-105 transition-transform">
            <span className="text-2xl sm:text-4xl font-black block tracking-tight text-amber-600">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-500 block mt-0.5">
              Mins
            </span>
          </div>

          <div className="bg-white/95 backdrop-blur-md text-[#1b2342] rounded-2xl p-3 sm:p-4 min-w-[65px] sm:min-w-[85px] shadow-lg border border-white/60 hover:scale-105 transition-transform">
            <span className="text-2xl sm:text-4xl font-black block tracking-tight font-mono text-red-600">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-500 block mt-0.5">
              Secs
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
