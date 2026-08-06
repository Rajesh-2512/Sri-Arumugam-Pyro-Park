import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, ArrowLeft, Sparkles, FileText, Flame, PartyPopper } from 'lucide-react';
import { getOrderById } from '@/services/order.actions';
import OrderInvoicePDF from '@/components/shop/OrderInvoicePDF';

export const metadata: Metadata = {
  title: 'Order Confirmed - Official Invoice',
  description: 'Your order has been placed successfully. View and download your official order PDF invoice.',
};

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams?.id || '';
  
  let order = null;
  if (orderId) {
    const res = await getOrderById(orderId);
    if (res.success && res.data) {
      order = res.data;
    }
  }

  const shortId = orderId ? orderId.split('-')[0].toUpperCase() : 'N/A';

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 selection:bg-amber-500 selection:text-white">
      
      {/* Animated Header Banner */}
      <div className="text-center space-y-4 max-w-xl mx-auto animate-in fade-in slide-in-from-top-6 duration-700">
        
        {/* Animated Glowing Ring & Checkmark */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 border-4 border-white animate-in zoom-in-75 duration-500">
            <CheckCircle2 className="w-11 h-11 stroke-[2.5]" />
          </div>
          <Flame className="w-6 h-6 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
          <Sparkles className="w-5 h-5 text-amber-400 absolute -bottom-1 -left-1 animate-pulse" />
        </div>

        <div className="space-y-2.5">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md animate-pulse">
            <PartyPopper className="w-4 h-4" /> Order Placed Successfully
          </span>
          
          <h1 className="text-3xl sm:text-4xl font-black text-[#1b2342] tracking-tight">
            Thank You for Your Order!
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
            Your order <strong className="text-amber-600 font-black text-base">#{shortId}</strong> has been logged in our system. Your official order PDF invoice is generated below.
          </p>
        </div>

      </div>

      {/* PDF Invoice Component with Staggered Entrance */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        {order ? (
          <OrderInvoicePDF order={order as any} />
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-3 shadow-xs">
            <FileText className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Order Slip #{shortId}</h3>
            <p className="text-xs text-slate-500">Your order has been recorded successfully.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex items-center justify-center gap-4 print:hidden animate-in fade-in duration-1000">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>

    </main>
  );
}


