'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart.store';
import { ShoppingBag, Sparkles, PhoneCall, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '#product-list', label: 'Quick Order' },
  { href: '#categories', label: 'Categories' },
  { href: '#about-us', label: 'About Us' },
  { href: '#contact-us', label: 'Contact Us' },
];

export default function Navbar({ shopName = 'Crackers Shop', contactNumber = '9876543210' }: { shopName?: string; contactNumber?: string }) {
  const totalItems = useCartStore((s) => s.totalItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1b2342] block leading-none">
                {shopName}
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-amber-600 uppercase mt-1">
                Authentic Sivakasi Direct
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-amber-600 transition-colors py-1 border-b-2 border-transparent hover:border-amber-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions: Phone Contact Button & Shopping Cart */}
          <div className="flex items-center gap-3.5">
            
            {/* Phone Call Support Button */}
            <a
              href={`tel:+${contactNumber}`}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs hover:scale-105"
            >
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>+{contactNumber}</span>
            </a>

            {/* Shopping Cart Icon Button */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

          </div>

        </div>
      </div>
    </header>
  );
}
