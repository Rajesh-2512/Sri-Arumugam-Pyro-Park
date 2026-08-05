'use client';

import Link from 'next/link';
import { Star, Sparkles, ArrowRight, Rocket, Smile } from 'lucide-react';

export default function HomeExtraSections() {
  return (
    <div className="space-y-14 pt-8 pb-4 font-sans">
      
      {/* 1. Welcome Section — Premium Full-Width Banner */}
      <section className="relative text-center w-full px-6 py-10 sm:py-12 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-red-500/10 rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-500/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="absolute top-4 left-6 text-amber-500/40">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div className="absolute top-4 right-6 text-amber-500/40">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-outfit)] uppercase leading-tight">
            WELCOME TO{' '}
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent font-black">
              SRI ARUMUGAM PYRO PARK
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-3xl mx-auto">
            Sri Arumugam Pyro Park is One of the leading wholesale and retail crackers shop in sivakasi. Order to Sivakasi Crackers Online at factory price in India on sriarumugampyropark.in. Order best quality fireworks for diwali on our online crackers shop. Sri Arumugam Pyro Park earned the trust of 1,000+ customers in the past 3 years and continue to be a leading website of dealing diwali crackers online.
          </p>
        </div>
      </section>

      {/* 2. WHY CHOOSE US? Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight font-[family-name:var(--font-outfit)]">
            WHY CHOOSE US?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Quality Assurance */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-13 h-13 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs">
                <Star className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-[family-name:var(--font-outfit)]">
                Quality Assurance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Every product we offer is of the highest quality and affordably priced for all customer.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/#product-list"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer group/btn"
              >
                <span className="cursor-pointer">Explore Our Products</span>
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center group-hover/btn:translate-x-1 transition-transform cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Card 2: Wide Range of Products */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
                <Rocket className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-[family-name:var(--font-outfit)]">
                Wide Range of Products
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                We provide crackers that revolutionize fireworks with innovative design products.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/#product-list"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer group/btn"
              >
                <span className="cursor-pointer">Explore Our Products</span>
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center group-hover/btn:translate-x-1 transition-transform cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Card 3: Customer Satisfaction */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-13 h-13 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-xs">
                <Smile className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-[family-name:var(--font-outfit)]">
                Customer Satisfaction
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Ensuring every customer leaves delighted with our products and services.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/#product-list"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer group/btn"
              >
                <span className="cursor-pointer">Explore Our Products</span>
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center group-hover/btn:translate-x-1 transition-transform cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Google Reviews Section */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        {/* Header with Google Logo */}
        <div className="flex items-center justify-center gap-3">
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.35 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
          </svg>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-[family-name:var(--font-outfit)]">
            Google Reviews
          </h2>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Score Summary Box */}
          <div className="md:col-span-4 bg-slate-50/80 p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between items-center text-center space-y-4">
            <div className="space-y-2">
              <h4 className="text-base font-bold text-slate-900 font-[family-name:var(--font-outfit)]">Sri Arumugam Pyro Park</h4>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-black text-slate-900 font-[family-name:var(--font-outfit)]">4.8</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Based on 25 reviews powered by <span className="font-semibold text-slate-700">Google</span>
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Sivakasi,+Tamil+Nadu"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#4285F4] hover:bg-[#3367d6] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <span>review us on</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              </svg>
            </a>
          </div>

          {/* User Review Cards (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Review 1 */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                      Y
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 font-[family-name:var(--font-outfit)]">Yuva Raj</h5>
                      <p className="text-[10px] text-slate-400">1 years ago</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  </svg>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Good quality and good approach and good support...Everything is good
                </p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-lime-800 text-white font-bold flex items-center justify-center text-xs">
                      T
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 font-[family-name:var(--font-outfit)]">Thiru Manikandan</h5>
                      <p className="text-[10px] text-slate-400">1 years ago</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  </svg>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Good quality and good service
                </p>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-700 text-white font-bold flex items-center justify-center text-xs">
                      M
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 font-[family-name:var(--font-outfit)]">Muthu Mahesh</h5>
                      <p className="text-[10px] text-slate-400">10 months ago</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  </svg>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Good cracker budget friendly
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
