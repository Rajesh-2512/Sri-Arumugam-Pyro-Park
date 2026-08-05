'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart.store';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#product-list', label: 'Products' },
  { href: '/safety-tips', label: 'Safety Tips' },
  { href: '/payment-info', label: 'Payment Information' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Navbar({ shopName = 'Sri Arumugam Pyro Park', contactNumber = '8682913516' }: { shopName?: string; contactNumber?: string }) {
  const totalItems = useCartStore((s) => s.totalItems);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-slate-200/80 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            <Image
              src="/logo.png"
              alt={shopName}
              width={150}
              height={150}
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Navigation Links — Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-slate-600">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-orange-500 font-bold'
                      : 'hover:text-orange-500'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Shopping Cart Icon Button */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-orange-50 border border-slate-200 text-slate-700 hover:text-orange-500 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  isActive
                    ? 'text-orange-500 bg-orange-50'
                    : 'text-slate-700 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
