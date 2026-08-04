'use client';

import { useState } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import QuickPurchaseTable from '@/components/shop/QuickPurchaseTable';
import CategoryFilter from '@/components/shop/CategoryFilter';
import type { Product, Category } from '@/types/product';
import { Flame, LayoutGrid, Table, Sparkles } from 'lucide-react';

interface Props {
  products: Product[];
  categories: Category[];
  activeCategory?: string;
  globalDiscount: number;
}

export default function ProductCatalogView({ products, categories, activeCategory, globalDiscount }: Props) {
  // Default to Wholesale Table View for fast Sivakasi crackers bulk ordering!
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  return (
    <section className="space-y-6 pt-4" id="product-list">
      
      {/* Header & View Mode Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1b2342] flex items-center gap-2">
              <Flame className="w-7 h-7 text-orange-500 fill-orange-400" /> Crackers Quick Order Sheet
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-300 uppercase tracking-wider">
              ⚡️ Fast Bulk Order
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Enter quantities directly into the wholesale table for instant calculation & order placement
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Category Filter Dropdown */}
          <CategoryFilter categories={categories} active={activeCategory} />

          {/* View Mode Toggle Buttons */}
          <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-4 h-4" /> Table View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Grid View
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Render */}
      {products.length > 0 ? (
        viewMode === 'table' ? (
          <QuickPurchaseTable products={products} globalDiscount={globalDiscount} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                globalDiscount={globalDiscount}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <Flame className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No Crackers Available</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are currently no crackers listed in this category. Select another category or check back soon.
          </p>
        </div>
      )}

    </section>
  );
}
