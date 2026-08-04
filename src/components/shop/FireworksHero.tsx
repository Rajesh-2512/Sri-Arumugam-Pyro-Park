'use client';

import { useEffect, useRef } from 'react';
import { Sparkles, Flame, ArrowRight, ShieldCheck } from 'lucide-react';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.color = color;
    this.size = Math.random() * 2.5 + 1.5;
    this.decay = Math.random() * 0.02 + 0.01;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // Gravity
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(this.alpha, 0);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Rocket {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  color: string;
  exploded: boolean;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = height;
    this.targetY = Math.random() * (height * 0.5) + height * 0.1;
    this.speed = Math.random() * 4 + 5;
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#eab308'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.exploded = false;
  }

  update() {
    this.y -= this.speed;
    if (this.y <= this.targetY) {
      this.exploded = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default function FireworksHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let rockets: Rocket[] = [];
    let lastLaunchTime = 0;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const createExplosion = (x: number, y: number, color?: string) => {
      const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#eab308'];
      const chosenColor = color || colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 45; i++) {
        particles.push(new Particle(x, y, chosenColor));
      }
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createExplosion(x, y);
    };

    canvas.addEventListener('click', handleCanvasClick);

    const loop = (timestamp: number) => {
      ctx.fillStyle = 'rgba(27, 35, 66, 0.25)'; // Smooth trails effect over dark navy #1b2342
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Auto launch rockets periodically
      if (timestamp - lastLaunchTime > 900) {
        rockets.push(new Rocket(canvas.width, canvas.height));
        lastLaunchTime = timestamp;
      }

      // Update rockets
      rockets = rockets.filter((rocket) => {
        rocket.update();
        rocket.draw(ctx);
        if (rocket.exploded) {
          createExplosion(rocket.x, rocket.y, rocket.color);
          return false;
        }
        return true;
      });

      // Update particles
      particles = particles.filter((particle) => {
        particle.update();
        particle.draw(ctx);
        return particle.alpha > 0;
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#1b2342] text-white border border-slate-700/60 min-h-[360px] sm:min-h-[420px] flex items-center justify-center p-6 sm:p-12">
      
      {/* Interactive Fireworks Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer z-0"
        title="Click anywhere to trigger fireworks!"
      />

      {/* Hero Overlay Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 pointer-events-none">
        
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-orange-500/20 pointer-events-auto">
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" /> TRUSTED SIVAKASI MANUFACTURERS
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
          Sivakasi Factory Direct <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
            Fireworks & Sparklers
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed drop-shadow-xs">
          Celebrate Diwali & special occasions with 100% authentic Sivakasi firecrackers at wholesale factory prices. Heavy discounts & safe nationwide delivery.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
          <a
            href="#product-list"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-500/30 hover:scale-105 transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-200" /> Explore Crackers Catalog <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/919345870138"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all cursor-pointer hover:scale-105"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Wholesale Price List
          </a>
        </div>

        <p className="text-[10px] text-amber-300/80 font-bold uppercase tracking-widest pt-2">
          ✨ Click anywhere on the banner above to trigger live fireworks!
        </p>

      </div>

    </div>
  );
}
