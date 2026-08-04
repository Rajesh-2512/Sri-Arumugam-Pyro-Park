import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import MarqueeTicker from '@/components/shop/MarqueeTicker';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: settings } = await supabase.from('global_settings').select('*').single();

  const shopName = settings?.shop_name || 'Crackers Shop';
  const contactNumber = settings?.contact_number || '919876543210';
  const isOpen = settings?.is_shop_open ?? true;

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-slate-800 flex flex-col justify-between selection:bg-amber-500 selection:text-white font-sans relative">
      <div>
        {/* Infinite Running News & Discount Ticker */}
        <MarqueeTicker />

        {!isOpen && (
          <div className="bg-red-600 text-white text-xs font-bold text-center py-2 px-4 tracking-wider uppercase shadow-sm">
            ⚠️ Shop is currently closed for new orders. Orders placed now will be processed when shop reopens.
          </div>
        )}
        <Navbar shopName={shopName} contactNumber={contactNumber} />
        {children}
      </div>

      {/* Floating Action Buttons (NPK Crackers Style) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a
          href={`https://wa.me/${contactNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          title="Contact on WhatsApp"
        >
          <MessageSquare className="w-6 h-6 fill-white" />
        </a>
      </div>

      <Footer shopName={shopName} contactNumber={contactNumber} />
    </div>
  );
}
