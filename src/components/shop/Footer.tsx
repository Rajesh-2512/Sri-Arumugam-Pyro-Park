import { Sparkles, Phone, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer({ shopName = 'Crackers Shop', contactNumber = '9876543210' }: { shopName?: string; contactNumber?: string }) {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-[#1b2342]">{shopName}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bringing light, joy, and celebration to your festivals with genuine Sivakasi quality crackers delivered directly to your doorstep.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-black text-[#1b2342] uppercase tracking-wider mb-4">Quality Assured</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Licensed & Certified Crackers
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Direct Wholesale Factory Prices
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Safe Packaging & Express Dispatch
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-[#1b2342] uppercase tracking-wider mb-4">Contact & Support</h4>
            <div className="space-y-3 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600" /> +{contactNumber}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" /> Sivakasi Wholesale Distributor, India
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {shopName}. All rights reserved. Order confirmation is handled manually via Phone / WhatsApp.
        </div>
      </div>
    </footer>
  );
}
