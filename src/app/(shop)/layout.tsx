import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import MarqueeTicker from '@/components/shop/MarqueeTicker';
import ScrollToTop from '@/components/shop/ScrollToTop';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: settings } = await supabase.from('global_settings').select('*').single();

  const shopName = settings?.shop_name || 'Sri Arumugam Pyro Park';
  const contactNumber = settings?.contact_number || '8682913516';
  const isOpen = settings?.is_shop_open ?? true;

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-slate-800 flex flex-col justify-between selection:bg-amber-500 selection:text-white font-sans relative">
      <div>
        {/* Infinite Running Marquee Ticker */}
        <MarqueeTicker />

        {/* Navbar */}
        <Navbar shopName={shopName} contactNumber={contactNumber} />

        {/* Shop Closed Notice — Below Navbar */}
        {!isOpen && (
          <div className="bg-red-600 text-white text-xs font-bold text-center py-2 px-4 tracking-wider uppercase shadow-sm">
            ⚠️ Shop is currently closed for new orders. Orders placed now will be processed when shop reopens.
          </div>
        )}

        {children}
      </div>

      {/* Floating Actions (Scroll to top + WhatsApp) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        <ScrollToTop />
        <a
          href={`https://wa.me/91${contactNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          title="Contact on WhatsApp"
        >
          <WhatsAppIcon className="w-7 h-7 fill-white" />
        </a>
      </div>

      <Footer shopName={shopName} contactNumber={contactNumber} />
    </div>
  );
}
