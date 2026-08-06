'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Flame,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Zap,
  Percent,
  Star,
  FileText,
} from 'lucide-react';
import DownloadPriceListButton from '@/components/shop/DownloadPriceListButton';

// Firework particle system for Light Theme
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  trail: { x: number; y: number }[];
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  color: string;
  exploded: boolean;
}

const FIREWORK_COLORS = [
  '#d97706', '#ea580c', '#dc2626', '#c026d3', '#0284c7',
  '#16a34a', '#eab308', '#9333ea', '#f97316', '#06b6d4',
];

const promoCards = [
  {
    title: 'Diwali Special Mega Combo Box',
    tag: '💥 FLAT 85% OFF FACTORY PRICE',
    desc: 'Complete family crackers pack with 45+ varieties including Sky Shots, Sparklers & Ground Chakkars.',
    image: '/carousel-1.png',
    badge: 'TOP SELLER 2026',
    price: '₹2,999',
    originalPrice: '₹14,999',
  },
  {
    title: 'Sivakasi Luxury Sky Shots (120 Shots)',
    tag: '✨ MULTI-COLOR AERIAL DISPLAY',
    desc: 'High-altitude multi-shot fireworks with brilliant golden palm tree and multi-color burst effects.',
    image: '/carousel-2.png',
    badge: 'GRAND CELEBRATION',
    price: '₹3,499',
    originalPrice: '₹12,000',
  },
  {
    title: 'Certified Eco-Friendly Green Crackers',
    tag: '🌿 100% CSIR-NEERI CERTIFIED',
    desc: 'Low smoke, zero toxic residues & safe for children. Direct from Sivakasi licensed manufacturers.',
    image: '/carousel-3.png',
    badge: 'KIDS SAFE',
    price: '₹1,899',
    originalPrice: '₹7,500',
  },
];

export default function HeroCarousel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeCard, setActiveCard] = useState(0);

  // Auto rotate showcase cards
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % promoCards.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Canvas fireworks background animation (tailored for light theme)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let rockets: Rocket[] = [];
    let lastLaunch = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 650;
    };
    resize();
    window.addEventListener('resize', resize);

    const explode = (x: number, y: number, color?: string) => {
      const c = color || FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      const count = 40 + Math.floor(Math.random() * 20);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 4.5 + 2.2;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: c,
          size: Math.random() * 2.5 + 1.2,
          decay: Math.random() * 0.015 + 0.008,
          trail: [],
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      explode(e.clientX - rect.left, e.clientY - rect.top);
    };
    canvas.addEventListener('click', handleClick);

    const loop = (ts: number) => {
      // Clear with soft ivory translucent overlay for light theme
      ctx.fillStyle = 'rgba(254, 252, 246, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (ts - lastLaunch > 850 + Math.random() * 600) {
        const x = Math.random() * canvas.width;
        rockets.push({
          x,
          y: canvas.height,
          targetY: Math.random() * canvas.height * 0.45 + canvas.height * 0.08,
          speed: Math.random() * 3.5 + 4.5,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
          exploded: false,
        });
        lastLaunch = ts;
      }

      rockets = rockets.filter((r) => {
        r.y -= r.speed;
        ctx.save();
        ctx.fillStyle = r.color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color);
          return false;
        }
        return true;
      });

      particles = particles.filter((p) => {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045;
        p.vx *= 0.99;
        p.alpha -= p.decay;

        for (let t = 0; t < p.trail.length; t++) {
          ctx.save();
          ctx.globalAlpha = (t / p.trail.length) * p.alpha * 0.3;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.trail[t].x, p.trail[t].y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return p.alpha > 0;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-slate-50 text-slate-800 py-10 sm:py-14 lg:py-16 border-b border-amber-200/80 shadow-xs">
      
      {/* Background Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 cursor-pointer opacity-70"
        title="Click anywhere to trigger fireworks!"
      />

      {/* Decorative Radial Warm Glow Filters */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-200/40 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Decorative Golden Top Border */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column — Content & Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Luxury Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-amber-400/40 text-amber-800 text-xs font-black uppercase tracking-widest shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '5s' }} />
              <span>SIVAKASI DIRECT WHOLESALE OUTLET • 100% ORIGINAL</span>
            </div>

            {/* Main Title with Outfit Font */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#1b2342]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              Celebrate Diwali With <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
                Sri Arumugam Pyro Park
              </span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Buy genuine Sivakasi firecrackers online at <strong className="text-amber-700 font-bold underline decoration-amber-400/60">direct wholesale factory outlet rates</strong>. Over 150+ premium products, custom gift boxes, and fast nationwide delivery.
            </p>

            {/* 3 Key Value Proposition Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/80 backdrop-blur-md border border-amber-200/80 rounded-2xl p-3.5 flex items-center gap-3 text-left shadow-xs hover:shadow-md hover:border-amber-400/60 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                  <Percent className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#1b2342]" style={{ fontFamily: 'var(--font-outfit)' }}>Flat 85% OFF</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Direct Factory Price</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-amber-200/80 rounded-2xl p-3.5 flex items-center gap-3 text-left shadow-xs hover:shadow-md hover:border-amber-400/60 transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 border border-orange-200">
                  <Truck className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#1b2342]" style={{ fontFamily: 'var(--font-outfit)' }}>Safe Shipping</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Tamil Nadu & All States</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-amber-200/80 rounded-2xl p-3.5 flex items-center gap-3 text-left shadow-xs hover:shadow-md hover:border-amber-400/60 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#1b2342]" style={{ fontFamily: 'var(--font-outfit)' }}>Certified Quality</h4>
                  <p className="text-[10px] text-slate-500 font-medium">100% Green Crackers</p>
                </div>
              </div>
            </div>

            {/* Action Buttons (Removed WhatsApp button as requested) */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#product-list"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg shadow-orange-500/25 hover:scale-105 transition-all cursor-pointer border border-amber-300/30"
              >
                <Flame className="w-4 h-4 text-amber-200" />
                <span>Explore Quick Order Sheet</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <DownloadPriceListButton variant="hero" />
            </div>

            {/* Order Terms & Support Hotline Strip */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-1.5 bg-amber-100/70 px-3.5 py-2 rounded-xl border border-amber-200/80">
                <span>🚚 Min Order:</span>
                <strong className="text-amber-900 font-extrabold">₹3,000 (TN) | ₹5,000 (Others)</strong>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-100/70 px-3.5 py-2 rounded-xl border border-amber-200/80">
                <span>📲 Order Hotline:</span>
                <strong className="text-amber-900 font-extrabold">8682913516 / 6374041238</strong>
              </div>
            </div>

          </div>

          {/* Right Column — Elegant Product Showcase Card */}
          <div className="lg:col-span-5 relative">
            
            <div className="relative rounded-3xl bg-white border border-amber-200/90 p-6 shadow-xl shadow-amber-500/10 overflow-hidden group">
              
              {/* Card Top Pill & Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  {promoCards[activeCard].tag}
                </span>
                <span className="text-xs font-extrabold text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {promoCards[activeCard].badge}
                </span>
              </div>

              {/* Showcase Image with Price Badge */}
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden mb-5 border border-slate-100 group-hover:scale-[1.02] transition-transform duration-500 shadow-xs">
                <Image
                  src={promoCards[activeCard].image}
                  alt={promoCards[activeCard].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                
                {/* Offer Price Highlight Tag */}
                <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-xl text-right shadow-md border border-red-500">
                  <span className="text-[10px] text-red-200 line-through block leading-none">{promoCards[activeCard].originalPrice}</span>
                  <span className="text-sm font-black text-amber-200 block leading-tight">{promoCards[activeCard].price}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-black leading-tight drop-shadow-md text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
                    {promoCards[activeCard].title}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 line-clamp-2 leading-relaxed">
                    {promoCards[activeCard].desc}
                  </p>
                </div>
              </div>

              {/* Carousel Indicators / Nav */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  {promoCards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCard(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        activeCard === idx
                          ? 'w-8 bg-amber-500 shadow-xs'
                          : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <a
                  href="#product-list"
                  className="text-xs font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-1 group/link bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
                >
                  Quick Order <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>

            {/* Bottom Corner Floating Badge */}
            <div className="absolute -bottom-18 -right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white border border-amber-300/40 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold pointer-events-none">
              <span className="text-lg">🪔</span>
              <span className="font-extrabold">100% Genuine Sivakasi Quality</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
