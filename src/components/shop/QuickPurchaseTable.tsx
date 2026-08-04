'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, getProductImage } from '@/lib/utils';
import { calculateFinalPrice, getEffectiveDiscountPercentage } from '@/lib/discount';
import { useCartStore } from '@/store/cart.store';
import type { Product } from '@/types/product';
import { ShoppingCart, Flame, Plus, Minus, Search, ArrowRight, Check } from 'lucide-react';

interface Props {
  products: Product[];
  globalDiscount: number;
}

export default function QuickPurchaseTable({ products, globalDiscount }: Props) {
  const cartItems = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addItem = useCartStore((s) => s.addItem);
  const totalAmount = useCartStore((s) => s.totalAmount);
  const totalItems = useCartStore((s) => s.totalItems);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.categories?.name && p.categories.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      
      {/* Quick Table Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crackers by name in quick list..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <span className="text-slate-400 font-bold text-[11px]">
          Showing {filteredProducts.length} items in quick table
        </span>
      </div>

      {/* Main Wholesale Quick Order Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-[#1b2342] text-white font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-700 sticky top-0 z-10">
              <tr>
                <th className="py-4 px-4 sm:px-6">Crackers Product</th>
                <th className="py-4 px-4 text-center">Category</th>
                <th className="py-4 px-4 text-center">MRP Price</th>
                <th className="py-4 px-4 text-center">Wholesale Price</th>
                <th className="py-4 px-4 text-center min-w-[140px]">Quantity</th>
                <th className="py-4 px-6 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const finalPrice = calculateFinalPrice(product.price, product.discount, globalDiscount);
                  const effectiveDiscount = getEffectiveDiscountPercentage(product.discount, globalDiscount);
                  const cartItem = cartItems.find((item) => item.id === product.id);
                  const currentQty = cartItem ? cartItem.quantity : 0;
                  const itemSubtotal = finalPrice * currentQty;
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
                    <tr
                      key={product.id}
                      className={`hover:bg-amber-50/40 transition-colors ${
                        currentQty > 0 ? 'bg-amber-50/60 font-medium' : ''
                      }`}
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 relative shrink-0 overflow-hidden border border-slate-200">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-amber-500 bg-amber-50">
                                <Flame className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">
                              {product.name}
                            </span>
                            {effectiveDiscount > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-200 mt-0.5">
                                {effectiveDiscount}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {product.categories?.name || 'Crackers'}
                        </span>
                      </td>

                      {/* Actual MRP Price */}
                      <td className="py-3.5 px-4 text-center text-slate-400 line-through font-medium">
                        {formatCurrency(product.price)}
                      </td>

                      {/* Final Wholesale Offer Price */}
                      <td className="py-3.5 px-4 text-center font-extrabold text-emerald-600 text-sm">
                        {formatCurrency(finalPrice)}
                      </td>

                      {/* Interactive Quantity Selector */}
                      <td className="py-3.5 px-4 text-center">
                        {product.stock === 0 ? (
                          <span className="text-red-500 font-bold text-[11px] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                            Out of Stock
                          </span>
                        ) : (
                          <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(currentQty - 1)}
                              disabled={currentQty === 0}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentQty}
                              onChange={(e) => handleQtyChange(parseInt(e.target.value) || 0)}
                              className="w-10 text-center font-black text-xs text-slate-900 bg-transparent focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleQtyChange(currentQty + 1)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Subtotal Column */}
                      <td className="py-3.5 px-6 text-right font-black text-slate-900 text-sm">
                        {itemSubtotal > 0 ? (
                          <span className="text-emerald-600 font-black">{formatCurrency(itemSubtotal)}</span>
                        ) : (
                          <span className="text-slate-300 font-medium">₹0.00</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No crackers found in quick order list.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating / Sticky Quick Checkout Order Summary Bar */}
      {totalItems > 0 && (
        <div className="sticky bottom-4 z-40 bg-gradient-to-r from-[#1b2342] via-slate-900 to-black text-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-amber-500/40 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-lg shadow-lg">
              {totalItems}
            </div>
            <div>
              <span className="text-slate-400 text-xs uppercase font-extrabold tracking-wider block">
                Wholesale Order Total ({totalItems} items)
              </span>
              <span className="text-2xl font-black text-amber-400 tracking-tight">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/cart"
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-500/30 transition-all cursor-pointer hover:scale-105 flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> View Cart & Order <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
