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

    </div>
  );
}
