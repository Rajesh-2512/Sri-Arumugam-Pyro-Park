import Link from 'next/link';
import { ShieldCheck, FileText, Truck, CreditCard, RefreshCw, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Sri Arumugam Pyro Park',
  description: 'Terms of service, order placement rules, minimum order values, shipping policies, payment details, and disclaimers for Sri Arumugam Pyro Park.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20 font-sans">
      
      {/* Header Banner */}
      <section className="relative bg-gradient-to-br from-[#12151e] via-[#1a1f2e] to-[#0f1219] text-white py-14 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto space-y-4 z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Policy & Legal Terms</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            Terms Of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to Sri Arumugam Pyro Park. Please review our terms & conditions regarding order placement, shipping, minimum order values, and disclaimers.
          </p>
          
          <div className="flex justify-center gap-3 pt-2 text-xs">
            <Link href="/terms" className="bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl shadow-md">
              Terms of Service
            </Link>
            <Link href="/privacy" className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        
        {/* Welcome Notice Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h2 className="text-xl font-black text-[#1b2342] flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" /> Welcome to Sri Arumugam Pyro Park
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            This website is owned and operated by <strong className="text-slate-900 font-bold">sriarumugampyropark.in</strong> and is only for your personal use and not for any commercial purpose. Your use of this website is subjected to the following terms and conditions. By checking out, you are agreeing to these terms and conditions of sriarumugampyropark.in. If you do not agree to the terms and conditions and privacy policy posted on the website, please do not use the website or the services offered by this website. The sriarumugampyropark.in holds all the rights to change the terms and conditions at any time without any prior notice. We request our users to check and be aware of the changes in the privacy policy and terms and conditions.
          </p>
        </div>

        {/* Section 1: Order Placement */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              1
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1b2342]">Order Placement</h3>
              <p className="text-xs text-slate-500">Service areas and minimum order requirements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-1">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="font-bold text-amber-600 block text-xs uppercase tracking-wider">Tamil Nadu Minimum Order</span>
              <p className="font-black text-slate-900 text-lg">Rs. 3,000/-</p>
              <p className="text-[11px] text-slate-500">+ GST + Delivery Charges</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="font-bold text-amber-600 block text-xs uppercase tracking-wider">Other States Minimum Order</span>
              <p className="font-black text-slate-900 text-lg">Rs. 5,000/-</p>
              <p className="text-[11px] text-slate-500">+ GST + Delivery Charges</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Sri Arumugam Pyro Park accepts orders only from <strong>Tamil Nadu, Karnataka, Pondicherry, Telangana, Andhra Pradesh</strong>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Sri Arumugam Pyro Park does <strong>not ship crackers to cities where crackers are banned</strong>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>You can use the website to check desired products in cart and drop your order enquiry.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Once we receive the enquiry, our customer care executive will call you to confirm and provide you with the delivery details within <strong>24 hours</strong>.</span>
            </li>
          </ul>
        </div>

        {/* Section 2: Payment Policies */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1b2342]">2. Payment Policies</h3>
              <p className="text-xs text-slate-500">Dispatch terms and digital invoices</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Products will be dispatched <strong>only after 100% payment</strong> is made.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No credit terms</strong> are provided under any circumstances.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Prices may change subject to the rights owned by sriarumugampyropark.in.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>After checkout, you will receive the <strong>order digital invoice copy and payment details</strong> in your mail / system.</span>
            </li>
          </ul>
        </div>

        {/* Section 3: Cancellation & Refund */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1b2342]">3. Cancellation & Refund</h3>
              <p className="text-xs text-slate-500">Processing fees and delivery charges</p>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-xs sm:text-sm space-y-2 text-red-900 font-medium">
            <p className="font-bold">
              ⚠️ 15% cancellation charges will be collected if confirmed order is cancelled after processing (only 85% of the paid money will be refunded).
            </p>
            <p>
              A customer has to bear the delivery charges in case of cancellation.
            </p>
          </div>
        </div>

        {/* Section 4: Shipping & Delivery */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1b2342]">4. Shipping & Delivery</h3>
              <p className="text-xs text-slate-500">Transport logistics and packaging standards</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Delivery is done by <strong>third party transport agencies</strong>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>After the goods are dispatched, we shall inform you of the <strong>Transport Details</strong> (Name of the Transporter, Contact Number, Waybill no, no of parcels, etc).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>It’s your responsibility to coordinate with the transporter and collect the parcels at the earliest.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>If your pin code does not lie within the transport range, you will be instructed to collect the parcels from the local parcel office.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>We do not take responsibility for any damages/product missing incurred by transport. However, we will try and deliver the products without any damage by our continuous and vigilant monitoring.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>After the order has been successfully placed, products will be delivered within <strong>4 to 5 working days</strong>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Goods will be packed only in <strong>special quality heavy-duty carton boxes</strong>.</span>
            </li>
          </ul>
        </div>

        {/* Section 5: Disclaimer */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1b2342]">5. Disclaimer</h3>
              <p className="text-xs text-slate-500">Website usage and product representation</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>sriarumugampyropark.in is just a reference site to check the availability of our products and price list.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Add your desired items in the cart and submit your enquiry. We will contact you within 24 hours.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>The product images on the website are for <strong>representative purpose only</strong>. The delivered product may vary in appearance and packaging.</span>
            </li>
          </ul>
        </div>

        {/* Navigation Link to Privacy Policy */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h4 className="font-extrabold text-base">Looking for Privacy Policy?</h4>
            <p className="text-xs text-slate-400">Read how we collect, store, and protect your personal identification data.</p>
          </div>
          <Link
            href="/privacy"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0"
          >
            Read Privacy Policy <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </main>
    </div>
  );
}
