import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldAlert,
  Eye,
  CheckCircle2,
  XCircle,
  Flame,
  AlertTriangle,
  Sparkles,
  Phone,
  ArrowLeft,
  HeartPulse,
} from 'lucide-react';
import { FAQPageJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sriarumugampyropark.com';

const safetyFAQs = [
  {
    question: 'What safety precautions should I take while bursting Diwali crackers?',
    answer:
      'Always wear protective safety glasses for eye protection, wear tight-fitting 100% cotton clothes, wear covered sturdy footwear, keep water and sand buckets nearby, and use a long incense stick (agarbatti) to light fuses at arm\'s length.',
  },
  {
    question: 'Why is eye protection important during Diwali fireworks?',
    answer:
      'Fireworks emit high-speed flying sparks, hot ash, embers, and pressure bursts that can cause severe permanent eye damage. Wearing clear protective safety glasses or eye goggles is mandatory for everyone — both adults lighting fireworks and spectators.',
  },
  {
    question: 'What should I do if a cracker does not burst after lighting?',
    answer:
      'NEVER try to re-ignite an un-burst cracker. Wait at least 20 minutes, then soak it in a bucket of water. Never approach or bend over a misfired firework.',
  },
  {
    question: 'What type of clothing should I wear while bursting crackers?',
    answer:
      'Wear long-sleeved 100% cotton garments. Avoid synthetic clothes like nylon or polyester as they can catch fire easily and melt onto skin causing severe burns.',
  },
  {
    question: 'What emergency numbers should I keep handy during Diwali?',
    answer:
      'Keep these emergency numbers handy: Ambulance — 108, Fire Control — 101. In case of eye contact with sparks, rinse thoroughly with clean cool water and immediately consult an eye specialist (Ophthalmologist).',
  },
];

export const metadata: Metadata = {
  title: 'Diwali Fireworks Safety Tips & Guidelines | Sri Arumugam Pyro Park Sivakasi',
  description:
    'Essential Diwali fireworks safety guidelines from Sri Arumugam Pyro Park Sivakasi. Always wear protective glasses for eye safety, wear cotton clothes, keep water nearby, and follow official safety rules for a safe Diwali celebration.',
  keywords: [
    'diwali crackers safety tips',
    'fireworks safety guidelines',
    'sivakasi crackers safety',
    'diwali safety rules',
    'crackers eye protection',
    'fireworks safety precautions',
    'how to burst crackers safely',
  ],
  alternates: {
    canonical: `${SITE_URL}/safety-tips`,
  },
  openGraph: {
    title: 'Diwali Fireworks Safety Tips & Guidelines',
    description: 'Essential safety guidelines for a safe Diwali celebration with fireworks.',
    url: `${SITE_URL}/safety-tips`,
  },
};

export default function SafetyTipsPage() {
  return (
    <>
    <FAQPageJsonLd faqs={safetyFAQs} />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back to Shop Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl border border-amber-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Crackers Shop
        </Link>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white p-8 sm:p-12 shadow-xl border-2 border-amber-300/40 text-center sm:text-left">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-amber-100 border border-white/30">
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span>OFFICIAL SIVAKASI SAFETY MANUAL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            Diwali Fireworks Safety & Guidelines
          </h1>

          <p className="text-sm sm:text-base text-amber-100 font-medium leading-relaxed">
            Ensure a safe, joyous, and memorable Diwali for your family by following these essential fireworks safety rules and precautions.
          </p>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 text-white select-none pointer-events-none text-9xl">
          🥽
        </div>
      </div>

      {/* CRITICAL EYE SAFETY WARNING HERO CARD */}
      <section className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-yellow-400 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-red-600 flex items-center justify-center shrink-0 shadow-lg border-2 border-yellow-300 animate-bounce">
            <Eye className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-red-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow-xs">
              <AlertTriangle className="w-4 h-4 fill-red-950 text-yellow-400" />
              <span>MANDATORY SAFETY ADVISORY #1</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              ALWAYS WEAR PROTECTIVE GLASSES FOR EYE SAFETY!
            </h2>

            <p className="text-xs sm:text-sm text-red-100 font-medium leading-relaxed">
              Fireworks emit high-speed flying sparks, hot ash, embers, and pressure bursts that can cause severe permanent eye damage. <strong className="text-yellow-300 font-extrabold underline decoration-yellow-300">Wearing clear protective safety glasses or eye goggles is mandatory for everyone</strong>—both adults lighting fireworks and spectators!
            </p>
          </div>
        </div>
      </section>

      {/* REMEMBER SAFETY CALLOUT BOX */}
      <div className="bg-amber-500/10 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 flex items-start gap-4 shadow-md backdrop-blur-md text-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md font-black text-xl">
          💡
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-amber-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-outfit)' }}>
            Remember
          </h3>
          <p className="text-sm sm:text-base text-slate-700 font-bold leading-relaxed">
            Remember, safety is paramount when using fireworks. Always prioritize caution and follow local laws and regulations regarding their use.
          </p>
        </div>
      </div>

      {/* Do's and Don'ts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* DO's Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                DO&apos;S — Safety Checklist
              </h3>
              <p className="text-xs text-slate-500 font-medium">Follow these mandatory practices before lighting fireworks</p>
            </div>
          </div>

          <ul className="space-y-4 text-xs sm:text-sm text-slate-700 font-medium">
            <li className="flex items-start gap-3 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 font-black block text-sm">🥽 Wear Eye Protection Glasses</strong>
                Always wear clear protective goggles or safety glasses before lighting or approaching any fireworks.
              </div>
            </li>

            <li className="flex items-start gap-3 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 font-black block text-sm">👕 Wear Tight-Fitting Cotton Clothes</strong>
                Wear long-sleeved 100% cotton garments. Avoid synthetic clothes (nylon, polyester) which catch fire easily.
              </div>
            </li>

            <li className="flex items-start gap-3 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 font-black block text-sm">👟 Wear Covered Sturdy Footwear</strong>
                Wear leather or rubber-soled closed shoes to protect your feet from hot embers on the ground.
              </div>
            </li>

            <li className="flex items-start gap-3 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 font-black block text-sm">🪣 Keep Water & Sand Ready nearby</strong>
                Always keep two buckets filled with clean water and dry sand at the site of lighting.
              </div>
            </li>

            <li className="flex items-start gap-3 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 font-black block text-sm">📏 Use Long Incense Stick (Agarbatti)</strong>
                Light fuses at arm&apos;s length using an agarbatti or sparkler, maintaining a safe distance.
              </div>
            </li>
          </ul>
        </div>

        {/* DON'Ts Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-red-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                DON&apos;TS — Dangerous Hazards
              </h3>
              <p className="text-xs text-slate-500 font-medium">Strictly avoid these actions to prevent accidents</p>
            </div>
          </div>

          <ul className="space-y-4 text-xs sm:text-sm text-slate-700 font-medium">
            <li className="flex items-start gap-3 bg-red-50/60 p-3.5 rounded-2xl border border-red-200/80">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-950 font-black block text-sm">🚫 NEVER Bend Over Firecrackers</strong>
                Never lean or place your face directly over a firework while lighting the fuse.
              </div>
            </li>

            <li className="flex items-start gap-3 bg-red-50/60 p-3.5 rounded-2xl border border-red-200/80">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-950 font-black block text-sm">🚫 NEVER Re-Ignite Un-Burst Crackers</strong>
                If a cracker fails to burst, wait 20 minutes and soak it in water. Never try to light it again!
              </div>
            </li>

            <li className="flex items-start gap-3 bg-red-50/60 p-3.5 rounded-2xl border border-red-200/80">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-950 font-black block text-sm">🚫 NEVER Hold Burning Crackers in Hand</strong>
                Never hold ignited sparklers, bombs, or rockets in your hands or throw them at people/vehicles.
              </div>
            </li>

            <li className="flex items-start gap-3 bg-red-50/60 p-3.5 rounded-2xl border border-red-200/80">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-950 font-black block text-sm">🚫 NEVER Burst Indoors or Near Dry Trees</strong>
                Never burst crackers inside rooms, corridors, or near electrical wires, petrol tanks, or dry grass.
              </div>
            </li>

            <li className="flex items-start gap-3 bg-red-50/60 p-3.5 rounded-2xl border border-red-200/80">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-950 font-black block text-sm">🚫 NEVER Store Crackers in Pockets</strong>
                Never carry fireworks in your clothing pockets or near open flames. Store in sealed wooden/cardboard boxes.
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Emergency Hotlines & First Aid Action Bar */}
      <div className="bg-[#1e293b] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 font-bold text-xs">
            <HeartPulse className="w-4 h-4" />
            <span>EMERGENCY ASSISTANCE HOTLINES</span>
          </div>
          <h4 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-outfit)' }}>
            In Case Of Eye Injury Or Burn Emergency
          </h4>
          <p className="text-xs text-slate-300 max-w-xl">
            In case of eye contact with sparks, rinse thoroughly with clean cool water and immediately consult an eye specialist (Ophthalmologist). Do not rub eyes!
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 block font-bold">AMBULANCE</span>
            <span className="text-lg font-black text-amber-400">108</span>
          </div>
          <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 block font-bold">FIRE CONTROL</span>
            <span className="text-lg font-black text-amber-400">101</span>
          </div>
          <a
            href="tel:8682913516"
            className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-md transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4" /> Store Support: 8682913516
          </a>
        </div>
      </div>

    </main>
    </>
  );
}
