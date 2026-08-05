import { createServerSupabaseClient } from '@/lib/supabase/server';
import ProductCatalogView from '@/components/shop/ProductCatalogView';
import DiwaliCountdown from '@/components/shop/DiwaliCountdown';
import HeroCarousel from '@/components/shop/HeroCarousel';
import HomeExtraSections from '@/components/shop/HomeExtraSections';
import { Sparkles, Flame, ShieldCheck } from 'lucide-react';
import type { Product } from '@/types/product';

interface SearchParams {
  category?: string;
}

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category;

  const supabase = await createServerSupabaseClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  // Fetch active products
  let query = supabase
    .from('products')
    .select('*, categories(id, name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category_id', category);
  }

  const { data: rawProducts } = await query;
  const products = (rawProducts ?? []) as unknown as Product[];

  // Fetch global settings
  const { data: settings } = await supabase
    .from('global_settings')
    .select('*')
    .single();

  const globalDiscount = settings?.global_discount_percentage ?? 0;

  return (
    <div>
      {/* Hero Banner Carousel — Only on Home Page */}
      <HeroCarousel />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Live Diwali Countdown */}
        <DiwaliCountdown />

        {/* Main Collection Quick Order Table & Grid View Switcher */}
        <ProductCatalogView
          products={products}
          categories={categories ?? []}
          activeCategory={category}
          globalDiscount={globalDiscount}
        />

        {/* Trust Badges Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1b2342]">100% Licensed & Quality Guaranteed</h4>
              <p className="text-xs text-slate-500 mt-0.5">Directly sourced from trusted Sivakasi manufacturers.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1b2342]">Safe & Protective Transport</h4>
              <p className="text-xs text-slate-500 mt-0.5">Heavy-duty protective packaging for transport safety.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1b2342]">WhatsApp Slip Confirmation</h4>
              <p className="text-xs text-slate-500 mt-0.5">Orders confirmed directly via WhatsApp or Call.</p>
            </div>
          </div>
        </section>

        {/* Extra Home Sections (Welcome, Why Choose Us, Google Reviews) — Home Page Only */}
        <HomeExtraSections />

      </main>
    </div>
  );
}
