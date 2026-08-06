'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock, Key, AlertCircle, ArrowLeft, ShieldCheck, Package, BarChart3, Settings2, Sparkles, CheckCircle2, Eye, EyeOff, Gift } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const FEATURES = [
  { icon: Package, label: 'Products Catalog', desc: 'Real-time stock & price control' },
  { icon: Gift, label: 'Gift Combos', desc: 'Manage family packs & discounts' },
  { icon: BarChart3, label: 'Live Orders', desc: 'Instant WhatsApp & online tracking' },
  { icon: ShieldCheck, label: 'Secure Access', desc: 'Encrypted Supabase authentication' },
];

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message || 'Invalid email or password');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Connection failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex font-sans selection:bg-orange-500 selection:text-white bg-[#fafafa]">
      
      {/* ─── LEFT PANEL — Vibrant Saffron & Gold Theme (No scroll, crisp alignment) ─── */}
      <div
        className="hidden lg:flex lg:w-[50%] xl:w-[52%] h-full relative overflow-hidden flex-col justify-between p-10 xl:p-14 text-white shrink-0"
        style={{
          background: 'linear-gradient(135deg, #9a3412 0%, #c2410c 25%, #ea580c 55%, #f97316 85%, #f59e0b 100%)',
        }}
      >
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Brand Header */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0 border border-amber-300">
            <Image src="/sriarumugamlogo.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <h2 className="text-base font-black text-white leading-tight drop-shadow-xs">Sri Arumugam Pyro Park</h2>
            <span className="text-[11px] font-bold text-amber-100 uppercase tracking-widest block">Sivakasi Direct Factory Outlet</span>
          </div>
        </div>

        {/* Hero Content — Perfectly Centered */}
        <div className="relative z-10 my-auto space-y-6 max-w-lg">
          
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Admin Control Portal
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-xs">
            Manage Your <br />
            <span className="text-amber-100">Sivakasi Cracker Empire</span>
          </h1>

          <p className="text-orange-50 text-xs xl:text-sm font-medium leading-relaxed max-w-md">
            All-in-one control center to manage live orders, product pricing, global discount rates, and family gift combo packs.
          </p>

          {/* Feature Grid — Crisp high contrast tiles */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/25 space-y-1 hover:bg-white/20 transition-all cursor-default"
              >
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-xs font-black text-white">{label}</h4>
                <p className="text-[10px] text-orange-100 font-medium leading-tight">{desc}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Security Highlights */}
        <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-orange-100 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-200" />
            <span>Supabase Encrypted 256-bit Sessions</span>
          </div>
          <span className="text-[10px] font-bold text-white/70">Admin Access Only</span>
        </div>

      </div>

      {/* ─── RIGHT PANEL — Elevated Pure White Form (Zero Scroll, Centered) ─── */}
      <div className="w-full lg:w-[50%] xl:w-[48%] h-full flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-y-auto">
        
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-6">
          <Image src="/sriarumugamlogo.png" alt="Logo" width={36} height={36} className="object-contain" />
          <div>
            <h2 className="text-sm font-black text-slate-900">Sri Arumugam Pyro Park</h2>
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block">Admin Portal</span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-6">

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-200/80 p-8 sm:p-10 space-y-6">
            
            {/* Form Title Header */}
            <div className="space-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-white p-2 border border-amber-300/80 shadow-md flex items-center justify-center mb-3">
                <Image src="/sriarumugamlogo.png" alt="Sri Arumugam Logo" width={48} height={48} className="object-contain" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-xs text-slate-500 font-medium">Sign in with your credentials to access the admin portal.</p>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sriarumugam.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>

            </form>

          </div>

          {/* Return link */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Customer Storefront
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
