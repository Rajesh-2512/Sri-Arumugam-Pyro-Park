'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

interface Props {
  images: string[];
  productName: string;
  effectiveDiscount: number;
}

export default function ProductImageGallery({ images, productName, effectiveDiscount }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const prevImage = () => setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  if (images.length === 0) {
    return (
      <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-inner">
        <div className="w-full h-full flex flex-col items-center justify-center text-amber-500 bg-gradient-to-br from-slate-50 to-slate-100">
          <Flame className="w-20 h-20 mb-2 animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Sivakasi Sparklers</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="group relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-inner">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300"
          priority
        />

        {/* Prev / Next Arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        {hasMultiple && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Discount Badge */}
        {effectiveDiscount > 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-extrabold tracking-wider px-3 py-1.5 rounded-xl shadow-lg uppercase flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-300" />
            {effectiveDiscount}% OFF TOTAL
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {hasMultiple && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                i === selectedIndex
                  ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-md scale-105'
                  : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
