import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { calculateFinalPrice, getEffectiveDiscountPercentage } from '@/lib/discount';
import { formatCurrency, getAllProductImages, getProductImage } from '@/lib/utils';
import AddToCartButton from './AddToCartButton';
import ProductImageGallery from '@/components/shop/ProductImageGallery';
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import type { Product } from '@/types/product';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sriarumugampyropark.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: product } = await supabase
    .from('products')
    .select('name, description, price, image_url, discount')
    .eq('slug', slug)
    .single();

  if (!product) return { title: 'Product Not Found' };

  const title = `${product.name} — Buy Online at Sivakasi Factory Outlet Price`;
  const desc =
    product.description ||
    `Buy ${product.name} online at direct Sivakasi factory outlet prices from Sri Arumugam Pyro Park. Genuine quality, wholesale rates, safe delivery across India.`;
  const imgPath = getProductImage(product.image_url) || '/banner-main.png';

  return {
    title,
    description: desc,
    keywords: [
      product.name,
      `${product.name} sivakasi`,
      `buy ${product.name} online`,
      `${product.name} price`,
      'sivakasi crackers',
      'buy diwali crackers online',
      'crackers online shopping',
      'sri arumugam pyro park',
    ],
    alternates: {
      canonical: `${SITE_URL}/products/${slug}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/products/${slug}`,
      type: 'website',
      images: [
        {
          url: imgPath,
          width: 800,
          height: 800,
          alt: `${product.name} — Sri Arumugam Pyro Park Sivakasi`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [imgPath],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: productData } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!productData) {
    notFound();
  }

  const product = productData as unknown as Product;

  const { data: settings } = await supabase
    .from('global_settings')
    .select('*')
    .single();

  const globalDiscount = settings?.global_discount_percentage ?? 0;
  const finalPrice = calculateFinalPrice(product.price, product.discount, globalDiscount);
  const effectiveDiscount = getEffectiveDiscountPercentage(product.discount, globalDiscount);
  const images = getAllProductImages(product.image_url);
  const primaryImage = getProductImage(product.image_url) || '/banner-main.png';

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">

      {/* ─── SEO: Product JSON-LD + Breadcrumb JSON-LD ─── */}
      <ProductJsonLd
        name={product.name}
        description={
          product.description ||
          `Buy ${product.name} online at direct Sivakasi factory outlet prices from Sri Arumugam Pyro Park.`
        }
        image={primaryImage.startsWith('http') ? primaryImage : `${SITE_URL}${primaryImage}`}
        price={finalPrice}
        slug={slug}
        category={product.categories?.name || 'Fireworks & Crackers'}
        inStock={product.stock > 0}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Crackers Catalog', url: `${SITE_URL}/#product-list` },
          { name: product.name, url: `${SITE_URL}/products/${slug}` },
        ]}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-amber-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
        
        {/* Product Image Gallery with Thumbnails */}
        <ProductImageGallery
          images={images}
          productName={product.name}
          effectiveDiscount={effectiveDiscount}
        />

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            {product.categories?.name && (
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {product.categories.name}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-black text-[#1b2342] mt-3 leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 mt-4 leading-relaxed whitespace-pre-line font-medium">
              {product.description || 'Experience high-intensity sound, vibrant colors, and spectacular fireworks displays directly from Sivakasi.'}
            </p>

            {/* Price Box */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline gap-3">
              <span className="text-3xl font-black text-emerald-600">
                {formatCurrency(finalPrice)}
              </span>
              {effectiveDiscount > 0 && (
                <span className="text-sm text-slate-400 line-through font-medium">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <AddToCartButton product={product} finalPrice={finalPrice} />

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Genuine Factory Outlet Stock
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" /> WhatsApp Confirmation Before Shipping
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
