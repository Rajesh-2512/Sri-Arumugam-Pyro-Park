import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import ProductCatalogView from '@/components/shop/ProductCatalogView';
import DiwaliCountdown from '@/components/shop/DiwaliCountdown';
import HeroCarousel from '@/components/shop/HeroCarousel';
import HomeExtraSections from '@/components/shop/HomeExtraSections';
import GiftBoxesSection from '@/components/shop/GiftBoxesSection';
import GoogleReviews from '@/components/shop/GoogleReviews';
import { getActiveGiftBoxes } from '@/services/giftbox.actions';
import { Sparkles, Flame, ShieldCheck } from 'lucide-react';
import type { Product } from '@/types/product';
import {
  LocalBusinessJsonLd,
  OrganizationJsonLd,
  WebSiteJsonLd,
  FAQPageJsonLd,
} from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sriarumugampyropark.com';

export const metadata: Metadata = {
  title:
    'Sri Arumugam Pyro Park | Buy Sivakasi Crackers Online | Diwali Fireworks Direct Factory Outlet',
  description:
    'Buy Sivakasi Diwali crackers & fireworks online at Sri Arumugam Pyro Park — direct factory outlet prices. Sparklers, flower pots, fancy crackers, sound crackers, rockets, bombs, gift boxes. Wholesale & retail. WhatsApp: 8682913516. Free transport across India.',
  keywords: [
    'sivakasi crackers',
    'sivakasi crackers online',
    'buy diwali crackers online',
    'crackers online shopping',
    'diwali crackers',
    'crackers wholesale sivakasi',
    'sivakasi crackers factory outlet',
    'diwali fireworks online',
    'buy crackers direct from sivakasi',
    'crackers shop sivakasi',
    'sri arumugam pyro park',
    'crackers gift box online',
    'diwali crackers 2025',
    'diwali crackers 2026',
    'sivakasi fireworks',
    'crackers factory price',
    'online crackers shop india',
    'wholesale fireworks india',
    'best crackers shop sivakasi',
    'sivakasi crackers delivery',
    'tamil nadu crackers online',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Sri Arumugam Pyro Park | Buy Sivakasi Diwali Crackers Online at Factory Outlet Prices',
    description:
      'Direct factory outlet for Sivakasi Diwali crackers & fireworks. Buy sparklers, flower pots, fancy crackers, sound crackers, rockets, gift boxes & more online at wholesale prices.',
    url: SITE_URL,
    images: [{ url: '/banner-main.png', width: 1200, height: 630, alt: 'Sri Arumugam Pyro Park — Sivakasi Diwali Crackers' }],
  },
};

// Homepage FAQ data for FAQ schema
const homepageFAQs = [
  {
    question: 'Where can I buy Sivakasi crackers online?',
    answer:
      'You can buy genuine Sivakasi crackers online at Sri Arumugam Pyro Park — a direct factory outlet in Sivakasi, Tamil Nadu. Browse our full collection of sparklers, flower pots, fancy crackers, sound crackers, rockets, bombs, and gift boxes at wholesale prices. Contact us on WhatsApp: +91 8682913516.',
  },
  {
    question: 'Is Sri Arumugam Pyro Park a direct factory outlet?',
    answer:
      'Yes! Sri Arumugam Pyro Park is a direct Sivakasi factory outlet located at 4/2017, 56 House Colony, Nalan Crackers Backside, Sivakasi - 626189, Tamil Nadu. We source all crackers directly from Sivakasi manufacturers and offer them at wholesale factory prices.',
  },
  {
    question: 'Do you deliver Diwali crackers across India?',
    answer:
      'Yes, we transport Diwali crackers across India through registered and legal transport service providers. All orders are packed with heavy-duty protective packaging for safe transport. Orders are confirmed via WhatsApp or phone call before shipping.',
  },
  {
    question: 'What types of crackers are available at Sri Arumugam Pyro Park?',
    answer:
      'We offer a complete range of Sivakasi fireworks including Sparklers, Ground Chakkars, Flower Pots, Fountains, Fancy Crackers, Sound Crackers, Novelty Fireworks, Rockets, Bombs, Twinkling Stars, Elite Crackers, Multi Colour Shots, Aerial Colour Novelties, and exclusive Fireworks Gift Boxes.',
  },
  {
    question: 'What payment methods does Sri Arumugam Pyro Park accept?',
    answer:
      'We accept Cash, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Bank Transfers (NEFT/IMPS/RTGS). You can choose your preferred payment method during checkout.',
  },
  {
    question: 'How do I contact Sri Arumugam Pyro Park?',
    answer:
      'You can reach us via WhatsApp or phone call at +91 8682913516 or +91 6374041238. You can also email us at sriarumugampyropark.svks@gmail.com. Our shop is located at 4/2017, 56 House Colony, Nalan Crackers Backside, Sivakasi - 626189.',
  },
];

interface SearchParams {
  category?: string;
}

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category;

  const supabase = await createServerSupabaseClient();

  // Fetch active gift boxes
  const { data: giftBoxes } = await getActiveGiftBoxes();

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
      {/* ─── SEO: JSON-LD Structured Data ─── */}
      <LocalBusinessJsonLd />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <FAQPageJsonLd faqs={homepageFAQs} />

      {/* Hero Banner Carousel — Only on Home Page */}
      <HeroCarousel />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Live Diwali Countdown */}
        <DiwaliCountdown />

        {/* Exclusive Gift Boxes Showcase Section */}
        {giftBoxes && giftBoxes.length > 0 && (
          <GiftBoxesSection giftBoxes={giftBoxes} globalDiscount={globalDiscount} />
        )}

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

        {/* Google Reviews Infinite Auto-Scroller */}
        <GoogleReviews />

        {/* Extra Home Sections (Welcome, Why Choose Us) — Home Page Only */}
        <HomeExtraSections />

      </main>
    </div>
  );
}
