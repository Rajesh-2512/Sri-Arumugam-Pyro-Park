import Link from 'next/link';
import { CheckCircle2, MessageSquare, ArrowLeft, Sparkles } from 'lucide-react';

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams?.id || 'N/A';
  const shortId = orderId !== 'N/A' ? orderId.split('-')[0].toUpperCase() : 'N/A';

  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-8">
      
      <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="w-14 h-14" />
      </div>

      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Order Received
        </span>
        <h1 className="text-3xl font-black text-[#1b2342]">Thank You for Your Order!</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
          Your order <strong className="text-amber-600 font-extrabold">#{shortId}</strong> has been logged in our system.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 text-xs text-slate-700 space-y-3 shadow-xs">
        <div className="flex items-center justify-center gap-2 text-emerald-600 font-extrabold text-sm">
          <MessageSquare className="w-4 h-4" /> Next Step: WhatsApp Slip Confirmation
        </div>
        <p className="text-slate-500 leading-relaxed">
          If WhatsApp did not open automatically, please contact our helpline to confirm your order details and delivery arrangement.
        </p>
      </div>

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>

    </main>
  );
}
