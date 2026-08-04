'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart.store';
import { formatCurrency, getProductImage } from '@/lib/utils';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ArrowLeft, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-500 shadow-xl">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-100">Your Cart is Empty</h1>
          <p className="text-xs text-slate-400">
            Looks like you haven't added any crackers to your order yet.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Crackers Catalog
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1b2342] flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-amber-600" /> Your Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {totalItems} item{totalItems > 1 ? 's' : ''} in your order
          </p>
        </div>
        <Link
          href="/"
          className="text-xs font-bold text-slate-500 hover:text-amber-600 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {/* Cart Items List */}
      <div className="space-y-4">
        {items.map((item) => {
          const itemImg = getProductImage(item.image_url);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xs justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  {itemImg ? (
                    <img src={itemImg} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-500">
                      <Flame className="w-8 h-8" />
                    </div>
                  )}
                </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#1b2342] text-sm">{item.name}</h3>
                <p className="text-xs text-emerald-600 font-extrabold">
                  {formatCurrency(item.finalPrice)} <span className="text-slate-400 font-normal">/ unit</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-black text-amber-600">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="text-sm font-black text-[#1b2342]">
                  {formatCurrency(item.finalPrice * item.quantity)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
      </div>

      {/* Cart Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div className="space-y-3 border-b border-slate-100 pb-4">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal ({totalItems} items)</span>
            <span className="font-bold text-slate-800">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Estimated Transport Charge</span>
            <span className="text-emerald-600 font-bold">Calculated on WhatsApp Slip</span>
          </div>
          <div className="flex justify-between text-base font-black text-[#1b2342] pt-2 border-t border-slate-100">
            <span>Grand Total</span>
            <span className="text-2xl text-amber-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
        >
          Proceed to Checkout <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

    </main>
  );
}
