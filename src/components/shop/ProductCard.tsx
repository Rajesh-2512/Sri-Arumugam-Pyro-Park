'use client';

import Link from 'next/link';
import SafeProductImage from '@/components/shop/SafeProductImage';
import { formatCurrency, getAllProductImages } from '@/lib/utils';
import { calculateFinalPrice, getEffectiveDiscountPercentage } from '@/lib/discount';
import { useCartStore } from '@/store/cart.store';
import type { Product } from '@/types/product';
import { ShoppingCart, Flame, Check, ChevronLeft, ChevronRight, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

interface Props {
  product: Product;
  globalDiscount: number;
}

export default function ProductCard({ product, globalDiscount }: Props) {
  const cartItems = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const [added, setAdded] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const finalPrice = calculateFinalPrice(product.price, product.discount, globalDiscount);
  const effectiveDiscount = getEffectiveDiscountPercentage(product.discount, globalDiscount);
  const hasDiscount = effectiveDiscount > 0;
  const images = getAllProductImages(product.image_url);
  const hasMultipleImages = images.length > 1;

  const inCartItem = mounted ? cartItems.find((i) => i.id === product.id) : undefined;
  const inCartQty = inCartItem ? inCartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart({
      id: product.id,
      name: product.name,
      image_url: images[0] || null,
      price: product.price,
      finalPrice,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden ${
      inCartQty > 0
        ? 'border-amber-400 shadow-md ring-2 ring-amber-500/20'
        : 'border-slate-200/80 hover:border-amber-500/40 shadow-xs hover:shadow-xl'
    }`}>
      
      {/* Image Carousel & Discount Badge */}
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-square bg-slate-100 overflow-hidden">
          <SafeProductImage
            src={images[currentImgIndex]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Prev / Next Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm shadow-md text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white z-[2]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm shadow-md text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white z-[2]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-[2]">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex(i); }}
                  className={`rounded-full transition-all cursor-pointer ${
                    i === currentImgIndex
                      ? 'w-4 h-1.5 bg-amber-500 shadow-sm'
                      : 'w-1.5 h-1.5 bg-white/70 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-lg shadow-md uppercase flex items-center gap-1 z-[1]">
              <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
              {effectiveDiscount}% OFF
            </div>
          )}

          {/* Persistent In-Cart Badge Top Right */}
          {inCartQty > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-lg shadow-md uppercase flex items-center gap-1 z-[2] animate-in fade-in">
              <CheckCircle2 className="w-3 h-3 text-white" />
              {inCartQty} IN CART
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[3]">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-extrabold text-sm text-[#1b2342] line-clamp-2 group-hover:text-amber-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.categories?.name && (
            <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
              {product.categories.name}
            </p>
          )}
        </div>

        {/* Price & Quantity / Add Controls */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-orange-600">
              {formatCurrency(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {inCartQty > 0 ? (
            <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, inCartQty - 1)}
                className="w-8 h-8 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-black text-amber-950 text-xs">
                {inCartQty} in Cart
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, inCartQty + 1)}
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white hover:from-amber-600 hover:to-red-700 flex items-center justify-center font-bold transition-colors shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                added
                  ? 'bg-amber-600 text-white shadow-amber-500/30'
                  : product.stock === 0
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white hover:from-amber-600 hover:to-red-700 shadow-orange-500/20 active:scale-95 cursor-pointer'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart!
                </>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
