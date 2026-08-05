'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/types/product';
import { Filter, X } from 'lucide-react';

interface Props {
  categories: Category[];
  active?: string;
}

export default function CategoryFilter({ categories, active }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setCategory = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set('category', id);
    else params.delete('category');
    router.push(`/?${params.toString()}#product-list`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/90 rounded-2xl px-3.5 py-2 shadow-2xs hover:border-amber-400 transition-colors">
        <Filter className="w-4 h-4 text-amber-600 shrink-0" />
        <select
          value={active || 'all'}
          onChange={(e) => setCategory(e.target.value === 'all' ? null : e.target.value)}
          className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer pr-6"
        >
          <option value="all">Filter Category: All Products ({categories.length} Categories)</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {active && (
        <button
          onClick={() => setCategory(null)}
          className="px-3.5 py-2 rounded-2xl bg-red-50 text-red-600 border border-red-200 text-xs font-extrabold hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <X className="w-3.5 h-3.5" /> Clear Filter
        </button>
      )}
    </div>
  );
}
