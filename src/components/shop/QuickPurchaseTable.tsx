'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, getProductImage } from '@/lib/utils';
import { calculateFinalPrice, getEffectiveDiscountPercentage } from '@/lib/discount';
import { useCartStore } from '@/store/cart.store';
import type { Product } from '@/types/product';
import ProductDetailsModal from '@/components/shop/ProductDetailsModal';
import SafeProductImage from '@/components/shop/SafeProductImage';
import { ShoppingCart, Flame, Plus, Minus, Search, ArrowRight, Eye, Check } from 'lucide-react';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.categories?.name && p.categories.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      
      {/* Quick Table Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crackers by name in quick list..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-800 font-bold focus:bg-white focus:outline-none focus:border-amber-500 transition-colors placeholder:font-medium placeholder:text-slate-400"
          />
        </div>
        <span className="text-slate-600 font-extrabold text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          Showing <strong className="text-amber-600 font-black">{filteredProducts.length}</strong> items in quick list
        </span>
      </div>

      {/* MOBILE ADAPTIVE VIEW (< md screens) */}
      <div className="block md:hidden space-y-3">
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
              <div
                key={product.id}
                className={`bg-white rounded-2xl p-4 border transition-all duration-200 shadow-xs space-y-3 ${
                  currentQty > 0 ? 'border-amber-400 bg-amber-50/50 shadow-md' : 'border-slate-200/90'
                }`}
              >
                {/* Header: Thumbnail, Name, Discount Tag */}
                <div className="flex items-start gap-3 justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      onClick={() => setSelectedProduct(product)}
                      className="w-14 h-14 rounded-xl bg-slate-100 relative shrink-0 overflow-hidden border border-slate-200 shadow-2xs group cursor-pointer"
                    >
                      <SafeProductImage
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                        {product.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                          {product.categories?.name || 'Crackers'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 hover:underline cursor-pointer"
                        >
                          <Eye className="w-3 h-3" /> Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {effectiveDiscount > 0 && (
                    <span className="shrink-0 font-black text-[11px] text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg">
                      {effectiveDiscount}% OFF
                    </span>
                  )}
                </div>

                {/* Pricing & Subtotal Bar */}
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Wholesale Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-emerald-600 text-base">
                        {formatCurrency(finalPrice)}
                      </span>
                      {effectiveDiscount > 0 && (
                        <span className="text-[11px] text-slate-400 line-through font-semibold">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {itemSubtotal > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Subtotal</span>
                      <span className="font-black text-amber-600 text-sm">
                        {formatCurrency(itemSubtotal)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="pt-1 flex items-center justify-between">
                  {product.stock === 0 ? (
                    <span className="w-full text-center text-red-600 font-bold text-xs bg-red-50 py-2 rounded-xl border border-red-200">
                      Out of Stock
                    </span>
                  ) : (
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="text-xs font-bold text-slate-500">Select Qty:</span>
                      <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(currentQty - 1)}
                          disabled={currentQty === 0}
                          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-red-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer active:scale-95 transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={currentQty}
                          onChange={(e) => handleQtyChange(parseInt(e.target.value) || 0)}
                          className="w-12 text-center font-black text-sm text-slate-900 bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleQtyChange(currentQty + 1)}
                          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:bg-slate-100 cursor-pointer active:scale-95 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-white p-8 text-center text-slate-400 font-medium rounded-2xl border border-slate-200">
            No crackers found matching search.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (>= md screens) */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            {/* Dark Slate Table Header */}
            <thead className="bg-[#1b2342] text-white font-black uppercase tracking-wider text-xs border-b border-slate-700 select-none">
              <tr>
                <th className="py-4 px-6 min-w-[240px]">Crackers Product</th>
                <th className="py-4 px-6 text-center">Category</th>
                <th className="py-4 px-4 text-center whitespace-nowrap">MRP Price</th>
                <th className="py-4 px-4 text-center whitespace-nowrap">Discount</th>
                <th className="py-4 px-4 text-center whitespace-nowrap">Wholesale Price</th>
                <th className="py-4 px-4 text-center min-w-[140px] whitespace-nowrap">Quantity</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Subtotal</th>
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
                      className={`hover:bg-amber-50/50 transition-colors ${
                        currentQty > 0 ? 'bg-amber-50/80 font-medium' : ''
                      }`}
                    >
                      {/* Product Thumbnail, Name & View Details Button */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3.5">
                          <div
                            onClick={() => setSelectedProduct(product)}
                            className="w-12 h-12 rounded-xl bg-slate-100 relative shrink-0 overflow-hidden border border-slate-200 shadow-2xs group cursor-pointer"
                            title="Click to view details"
                          >
                            <SafeProductImage
                              src={imageUrl}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <span className="font-extrabold text-slate-900 block text-xs sm:text-sm leading-snug">
                              {product.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedProduct(product)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:text-amber-700 hover:underline mt-0.5 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" /> View Details
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-6 text-center">
                        <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider border border-slate-200 whitespace-nowrap">
                          {product.categories?.name || 'Crackers'}
                        </span>
                      </td>

                      {/* Actual MRP Price */}
                      <td className="py-3.5 px-4 text-center text-slate-400 line-through font-bold text-xs sm:text-sm whitespace-nowrap">
                        {formatCurrency(product.price)}
                      </td>

                      {/* Dedicated DISCOUNT Column */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {effectiveDiscount > 0 ? (
                          <span className="inline-block font-black text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl">
                            {effectiveDiscount}%
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium text-xs">-</span>
                        )}
                      </td>

                      {/* Final Wholesale Offer Price */}
                      <td className="py-3.5 px-4 text-center font-black text-emerald-600 text-sm sm:text-base whitespace-nowrap">
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
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentQty}
                              onChange={(e) => handleQtyChange(parseInt(e.target.value) || 0)}
                              className="w-11 text-center font-black text-xs sm:text-sm text-slate-900 bg-transparent focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleQtyChange(currentQty + 1)}
                              className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Subtotal Column */}
                      <td className="py-3.5 px-6 text-right font-black text-slate-900 text-sm sm:text-base whitespace-nowrap">
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
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No crackers found in quick order list.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Quick Checkout Order Summary Bar — Sleek Dark Theme Bar */}
      {totalItems > 0 && (
        <div className="sticky bottom-4 z-40 bg-[#0f172a] text-white p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-amber-400 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-lg shadow-lg">
              {totalItems}
            </div>
            <div>
              <span className="text-amber-200/80 text-xs uppercase font-extrabold tracking-wider block">
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
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-500/30 transition-all cursor-pointer hover:scale-105 flex items-center gap-2 border border-amber-300/40"
            >
              <ShoppingCart className="w-4 h-4" /> View Cart & Order <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Product Details Popup Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          globalDiscount={globalDiscount}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
}
