'use client';

import { useCartStore } from '@/store/cart.store';
import { getProductImage } from '@/lib/utils';
import type { Product } from '@/types/product';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  product: Product;
  finalPrice: number;
}

export default function AddToCartButton({ product, finalPrice }: Props) {
  const addToCart = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (product.stock === 0) return;
    addToCart({
      id: product.id,
      name: product.name,
      image_url: getProductImage(product.image_url),
      price: product.price,
      finalPrice,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock === 0}
      className={`w-full py-4 px-6 rounded-2xl text-sm font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 shadow-md ${
        added
          ? 'bg-emerald-600 text-white shadow-emerald-500/30'
          : product.stock === 0
          ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white shadow-orange-500/25 active:scale-98'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" /> Added to Cart!
        </>
      ) : product.stock === 0 ? (
        'Out of Stock'
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" /> Add to Shopping Cart
        </>
      )}
    </button>
  );
}
