'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatCurrency, getProductImage } from '@/lib/utils';
import { calculateFinalPrice, getEffectiveDiscountPercentage } from '@/lib/discount';
import { useCartStore } from '@/store/cart.store';
import type { Product } from '@/types/product';
import { X, Flame, Plus, Minus, ShoppingCart, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface Props {
  product: Product | null;
  globalDiscount: number;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, globalDiscount, onClose }: Props) {
  const cartItems = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addItem = useCartStore((s) => s.addItem);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const finalPrice = calculateFinalPrice(product.price, product.discount, globalDiscount);
  const effectiveDiscount = getEffectiveDiscountPercentage(product.discount, globalDiscount);
  const cartItem = cartItems.find((item) => item.id === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;
  const imageUrl = getProductImage(product.image_url);

  const handleQtyChange = (newQty: number) => {
    if (newQty < 0) return;
    if (cartItem) {
      updateQuantity(product.id, newQty);
    } else if (newQty > 0) {
      addItem({
        id: product.id,
        name: product.name,
        image_url: imageUrl,
        price: product.price,
        finalPrice,
        stock: product.stock,
      });
      if (newQty > 1) {
        updateQuantity(product.id, newQty);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              Product Details & Quick Order
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Product Image */}
          <div className="md:col-span-5 relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs flex items-center justify-center">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-amber-500">
                <Flame className="w-12 h-12" />
                <span className="text-xs font-bold">Fireworks</span>
              </div>
            )}

            {effectiveDiscount > 0 && (
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-md">
                🔥 {effectiveDiscount}% OFF
              </div>
            )}
          </div>

          {/* Product Info & Pricing */}
          <div className="md:col-span-7 space-y-4">
            
            <div>
              <span className="inline-block bg-amber-100/70 text-amber-900 px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-amber-200">
                {product.categories?.name || 'Crackers'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {product.name}
              </h3>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                {formatCurrency(finalPrice)}
              </span>
              <span className="text-sm font-bold text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs font-bold text-slate-500 ml-auto">
                Factory Outlet Price
              </span>
            </div>

            {/* Product Details / Features */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Sivakasi Green Crackers</span>
              </p>
              <p className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Licensed Direct Wholesale Stock</span>
              </p>
              <p className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Safe Express Packaging & Fast Transport</span>
              </p>
            </div>

            {/* Quantity Controls & Subtotal */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              {product.stock === 0 ? (
                <span className="text-red-600 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                  Out of Stock
                </span>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-slate-300 rounded-2xl bg-slate-50 shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(currentQty - 1)}
                      disabled={currentQty === 0}
                      className="p-2.5 text-slate-600 hover:text-red-600 hover:bg-slate-200 disabled:opacity-30 cursor-pointer transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-black text-sm text-slate-900">
                      {currentQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(currentQty + 1)}
                      className="p-2.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-200 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {currentQty > 0 && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Item Total</span>
                  <span className="text-lg font-black text-emerald-600">
                    {formatCurrency(finalPrice * currentQty)}
                  </span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
