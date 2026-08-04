'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, getAllProductImages } from '@/lib/utils';
import { calculateFinalPrice, getEffectiveDiscountPercentage } from '@/lib/discount';
import { useCartStore } from '@/store/cart.store';
import type { Product } from '@/types/product';
import { ShoppingCart, Flame, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useCallback } from 'react';

interface Props {
  product: Product;
  globalDiscount: number;
}

export default function ProductCard({ product, globalDiscount }: Props) {
  const addToCart = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const finalPrice = calculateFinalPrice(product.price, product.discount, globalDiscount);
  const effectiveDiscount = getEffectiveDiscountPercentage(product.discount, globalDiscount);
  const hasDiscount = effectiveDiscount > 0;
  const images = getAllProductImages(product.image_url);
  const hasMultipleImages = images.length > 1;

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
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-amber-500/40 shadow-xs hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      
      {/* Image Carousel & Discount Badge */}
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-square bg-slate-100 overflow-hidden">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentImgIndex]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Prev / Next Arrows (visible on hover when multiple images) */}
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
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-amber-500">
              <Flame className="w-12 h-12 mb-1 animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Sparklers & Fireworks</span>
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-lg shadow-md uppercase flex items-center gap-1 z-[1]">
              <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
              {effectiveDiscount}% OFF
            </div>
          )}

          {/* Image Count Badge */}
          {hasMultipleImages && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-[1]">
              {currentImgIndex + 1}/{images.length}
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

        {/* Price & Add Button */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-emerald-600">
              {formatCurrency(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
              added
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : product.stock === 0
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white hover:from-amber-600 hover:to-red-700 shadow-orange-500/20 active:scale-95'
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
        </div>
      </div>

    </div>
  );
}
