'use client';

import { useState } from 'react';
import type { GlobalSettings } from '@/types/product';
import { updateGlobalSettings } from '@/services/settings.actions';
import { Settings, Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function SettingsManager({ settings }: { settings: GlobalSettings | null }) {
  const [shopName, setShopName] = useState(settings?.shop_name || 'Crackers Shop');
  const [contactNumber, setContactNumber] = useState(settings?.contact_number || '919876543210');
  const [globalDiscount, setGlobalDiscount] = useState(settings?.global_discount_percentage || 0);
  const [festivalBannerUrl, setFestivalBannerUrl] = useState(settings?.festival_banner_url || '');
  const [isOpen, setIsOpen] = useState(settings?.is_shop_open ?? true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await updateGlobalSettings({
      shop_name: shopName,
      contact_number: contactNumber,
      global_discount_percentage: Number(globalDiscount),
      festival_banner_url: festivalBannerUrl || undefined,
      is_shop_open: isOpen,
    });

    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Global store settings updated successfully!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update settings' });
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-600" /> Store Settings & Global Discount
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure store name, helpline, global discount rate, and festival banners</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5 text-xs">
        
        <div>
          <label className="block font-bold text-slate-700 mb-1.5">Shop Name *</label>
          <input
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5">WhatsApp / Phone Helpline Number *</label>
          <input
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="919876543210"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
            required
          />
          <span className="text-[11px] text-slate-500 mt-1 block">Format: Country code + mobile number without plus (+) e.g. 919876543210</span>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> Storewide Global Discount (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={globalDiscount}
            onChange={(e) => setGlobalDiscount(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
            required
          />
          <span className="text-[11px] text-slate-500 mt-1 block">Applied sequentially after product-level discounts on all orders.</span>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5">Festival Announcement Banner Image URL</label>
          <input
            value={festivalBannerUrl}
            onChange={(e) => setFestivalBannerUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="is_open"
            checked={isOpen}
            onChange={(e) => setIsOpen(e.target.checked)}
            className="w-4 h-4 rounded text-amber-500 bg-slate-50 border-slate-300"
          />
          <label htmlFor="is_open" className="font-bold text-slate-700">
            Storefront Open for Orders (Uncheck to temporarily pause new order creation)
          </label>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl font-bold text-xs flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-60"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving Settings...' : 'Save Settings'}
        </button>

      </form>

    </div>
  );
}
