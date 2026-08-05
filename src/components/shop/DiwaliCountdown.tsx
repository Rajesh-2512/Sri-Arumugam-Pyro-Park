'use client';

import { useState, useEffect, useRef } from 'react';
import { Flame, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Spinning Ground Chakkar SVG & Animation Component
function AnimatedChakkar({ size = 70, rev = false }: { size?: number; rev?: boolean }) {
  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${rev ? 'animate-chakkar-spin-rev' : 'animate-chakkar-spin'}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Spark Rays */}
        <circle cx="50" cy="50" r="46" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
        <circle cx="50" cy="50" r="38" stroke="#F97316" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.9" />
        
        {/* Spiral Blades of Chakkar */}
        <path d="M50 50 Q65 25 85 35 Q65 50 50 50 Q35 75 15 65 Q35 50 50 50Z" fill="url(#chakkarGrad1)" />
        <path d="M50 50 Q75 65 65 85 Q50 65 50 50 Q25 35 35 15 Q50 35 50 50Z" fill="url(#chakkarGrad2)" />

        {/* Center Glowing Core */}
        <circle cx="50" cy="50" r="12" fill="#FEF08A" />
        <circle cx="50" cy="50" r="6" fill="#EF4444" />
        <circle cx="50" cy="50" r="3" fill="#FFFFFF" />

        <defs>
          <linearGradient id="chakkarGrad1" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="chakkarGrad2" x1="100" y1="0" x2="0" y2="100">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      {/* Outer Glow Halo */}
      <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md pointer-events-none" />
    </div>
  );
}

// Flower Pot Pyrotechnic Fountain Animation Component
function AnimatedFlowerPot() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let fountainSparks: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
    }[] = [];

    const colors = ['#FEF08A', '#FDE047', '#F59E0B', '#EF4444', '#F97316', '#FFFFFF'];

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Emit new sparks from base center
      for (let i = 0; i < 4; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.75;
        const speed = Math.random() * 5 + 3.5;
        fountainSparks.push({
          x: canvas.width / 2,
          y: canvas.height - 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
        });
      }

      // Update & Draw Sparks
      fountainSparks = fountainSparks.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.12; // Gravity effect cascading down
        s.alpha -= s.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(s.alpha, 0);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return s.alpha > 0;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative flex flex-col items-center pointer-events-none select-none">
      {/* Fountain Canvas */}
      <canvas ref={canvasRef} width={120} height={120} className="mb-[-10px] pointer-events-none" />
      {/* Flower Pot Golden Base Cone */}
      <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 32L32 32L26 0L14 0L8 32Z" fill="url(#potGrad)" stroke="#F59E0B" strokeWidth="1.5" />
        <ellipse cx="20" cy="4" rx="6" ry="2" fill="#FEF08A" />
        <defs>
          <linearGradient id="potGrad" x1="0" y1="0" x2="40" y2="32">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Countdown Digit Box
function DigitBox({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  const prevRef = useRef(value);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 400);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center group cursor-default">
      <div
        className={`relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 min-w-[75px] sm:min-w-[105px] md:min-w-[125px] shadow-lg border-2 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${
          highlight
            ? 'border-amber-500 shadow-amber-500/25 ring-2 ring-amber-400/50'
            : 'border-slate-200/90 hover:border-amber-400/80 shadow-slate-200/60'
        } ${pulsing ? 'animate-digit-pulse scale-105' : 'scale-100'}`}
      >
        <span
          className={`relative z-20 text-3xl sm:text-5xl md:text-6xl font-black block tracking-tight ${
            highlight
              ? 'text-transparent bg-clip-text bg-gradient-to-b from-amber-600 via-orange-600 to-red-600'
              : 'text-[#1b2342]'
          }`}
          style={{
            fontFamily: 'var(--font-outfit), system-ui, sans-serif',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>

      <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-600 mt-2.5">
        {label}
      </span>
    </div>
  );
}

function ColonSeparator() {
  return (
    <div className="hidden sm:flex flex-col items-center justify-center gap-2 pt-2 self-center">
      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shadow-md shadow-amber-500/50" />
      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shadow-md shadow-amber-500/50" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}

export default function DiwaliCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetDate = new Date('2026-11-08T00:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-100/40 border-2 border-amber-300/80 p-8 sm:p-12 lg:p-14 shadow-xl">
      
      {/* Background Decorative Sparkles */}
      <div className="absolute top-4 left-6 text-amber-500/40 text-4xl select-none sparkle-1">✨</div>
      <div className="absolute bottom-6 right-8 text-orange-500/30 text-5xl select-none sparkle-1" style={{ animationDelay: '1s' }}>💥</div>

      {/* Animated Ground Chakkars (Left & Right Sides) */}
      <div className="hidden md:block absolute top-10 left-8">
        <AnimatedChakkar size={75} />
      </div>
      <div className="hidden md:block absolute top-10 right-8">
        <AnimatedChakkar size={75} rev={true} />
      </div>

      {/* Animated Flower Pot Fountains (Bottom Left & Right) */}
      <div className="hidden lg:block absolute bottom-4 left-10">
        <AnimatedFlowerPot />
      </div>
      <div className="hidden lg:block absolute bottom-4 right-10">
        <AnimatedFlowerPot />
      </div>

      {/* Center Main Countdown Container */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-7 max-w-4xl mx-auto">
        
        {/* Top Diwali Pill Badge */}
        <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 backdrop-blur-md px-5 py-2 rounded-full border border-amber-400/50 text-amber-900 text-xs font-black uppercase tracking-widest shadow-xs">
          <span className="text-lg flame-flicker">🪔</span>
          <span>DIWALI 2026 GRAND CELEBRATION COUNTDOWN</span>
          <span className="text-lg flame-flicker" style={{ animationDelay: '0.4s' }}>🪔</span>
        </div>

        {/* Grand Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1b2342] leading-tight" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
          Countdown To The{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
            Festival Of Lights
          </span>
        </h2>

        {/* Clean Digit Countdown Boxes */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 py-2">
          {mounted ? (
            <>
              <DigitBox value={timeLeft.days} label="Days" />
              <ColonSeparator />
              <DigitBox value={timeLeft.hours} label="Hours" />
              <ColonSeparator />
              <DigitBox value={timeLeft.minutes} label="Mins" />
              <ColonSeparator />
              <DigitBox value={timeLeft.seconds} label="Secs" highlight={true} />
            </>
          ) : (
            <>
              <DigitBox value={0} label="Days" />
              <ColonSeparator />
              <DigitBox value={0} label="Hours" />
              <ColonSeparator />
              <DigitBox value={0} label="Mins" />
              <ColonSeparator />
              <DigitBox value={0} label="Secs" highlight={true} />
            </>
          )}
        </div>

        {/* High-Converting Pre-Book Button */}
        <div className="pt-2">
          <a
            href="#product-list"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-widest px-9 py-4 rounded-2xl shadow-lg shadow-orange-500/25 hover:scale-105 transition-all cursor-pointer border border-amber-300/40"
          >
            <Flame className="w-5 h-5 text-yellow-200 flame-flicker" />
            <span>Pre-Book Diwali Crackers Sheet</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </a>
        </div>

      </div>

    </section>
  );
}
