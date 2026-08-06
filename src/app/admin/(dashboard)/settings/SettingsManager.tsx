'use client';

import { useState } from 'react';
import type { GlobalSettings } from '@/types/product';
import { updateGlobalSettings, uploadPriceListPdf } from '@/services/settings.actions';
import { Settings, Save, CheckCircle2, AlertCircle, Sparkles, LogOut, FileText, Upload, ExternalLink, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import DownloadPriceListButton from '@/components/shop/DownloadPriceListButton';

export default function SettingsManager({ settings }: { settings: GlobalSettings | null }) {
  const [shopName, setShopName] = useState(settings?.shop_name || 'Sri Arumugam Pyro Park');
  const [contactNumber, setContactNumber] = useState(settings?.contact_number || '8682913516');
  const [globalDiscount, setGlobalDiscount] = useState(settings?.global_discount_percentage || 0);
  const [priceListUrl, setPriceListUrl] = useState(settings?.price_list_url || '');
  const [isOpen, setIsOpen] = useState(settings?.is_shop_open ?? true);

  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      setMessage({ type: 'error', text: 'Please select a valid PDF file (.pdf)' });
      return;
    }

    setUploadingPdf(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadPriceListPdf(formData);
    setUploadingPdf(false);

    if (result.success && result.url) {
      setPriceListUrl(result.url);
      setMessage({ type: 'success', text: 'PDF uploaded successfully! Click Save Settings to update.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to upload PDF file' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await updateGlobalSettings({
      shop_name: shopName,
      contact_number: contactNumber,
      global_discount_percentage: Number(globalDiscount),
      price_list_url: priceListUrl || undefined,
      is_shop_open: isOpen,
    });

    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Store settings updated successfully!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update settings' });
    }
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to sign out of admin dashboard?')) return;
    setLogoutLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
      setLogoutLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 pb-12">
      
      {/* Top Header & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-amber-600" /> Store Settings & Control
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage store parameters, global discount rate, storefront availability, and upload PDF price lists.
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-2xs hover:scale-105 active:scale-95 disabled:opacity-60 shrink-0 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{logoutLoading ? 'Signing Out...' : 'Sign Out / Logout'}</span>
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-xs">
        
        {/* Shop Name */}
        <div>
          <label className="block font-bold text-slate-800 text-xs mb-1.5 uppercase tracking-wider">
            Shop Name *
          </label>
          <input
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 font-bold transition-colors"
            required
          />
        </div>

        {/* WhatsApp Helpline */}
        <div>
          <label className="block font-bold text-slate-800 text-xs mb-1.5 uppercase tracking-wider">
            WhatsApp / Phone Helpline Number *
          </label>
          <input
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="8682913516"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 font-mono font-bold transition-colors"
            required
          />
          <span className="text-[11px] text-slate-500 mt-1 block">Format: Mobile number without plus (+) e.g. 8682913516</span>
        </div>

        {/* Storewide Global Discount */}
        <div>
          <label className="block font-bold text-slate-800 text-xs mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> Storewide Global Discount (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={globalDiscount}
            onChange={(e) => setGlobalDiscount(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 font-bold transition-colors"
            required
          />
          <span className="text-[11px] text-slate-500 mt-1 block">Applied sequentially after product-level discounts on all orders.</span>
        </div>

        {/* Upload Price List PDF File or URL */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4">
          <div className="space-y-1">
            <label className="block font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" /> Upload Price List PDF Document
            </label>
            <p className="text-[11px] text-slate-500">
              Upload your official PDF price list file directly or enter a public PDF URL. When uploaded, all storefront "Download Price List" buttons will download this file.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Direct Upload File Button */}
            <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0">
              {uploadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading PDF...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Upload PDF File
                </>
              )}
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfFileUpload}
                disabled={uploadingPdf}
                className="hidden"
              />
            </label>

            <span className="text-slate-400 font-bold text-xs uppercase hidden sm:inline">OR</span>

            {/* URL Input */}
            <input
              type="url"
              value={priceListUrl}
              onChange={(e) => setPriceListUrl(e.target.value)}
              placeholder="https://.../price-list.pdf"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono transition-colors"
            />
          </div>

          {/* Active PDF Link Preview */}
          {priceListUrl && (
            <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-xs">
              <span className="text-emerald-700 font-bold truncate max-w-md">
                📄 Active Price List PDF: <span className="font-mono underline">{priceListUrl}</span>
              </span>
              <a
                href={priceListUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-extrabold shrink-0 underline"
              >
                Test Download <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Storefront Open Slide Button Switch — VERY IMPORTANT */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-extrabold text-sm text-slate-900 block">
                Storefront Open for Orders
              </span>
              <span className="text-[11px] text-slate-500 block">
                Toggle slide button to temporarily pause or resume new order confirmations.
              </span>
            </div>

            {/* iOS Style Slide Switch Button */}
            <button
              type="button"
              role="switch"
              aria-checked={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isOpen ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            >
              <span className="sr-only">Toggle Storefront Status</span>
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isOpen ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Dynamic Closed Warning Preview */}
          {!isOpen ? (
            <div className="p-3.5 rounded-xl bg-red-600 text-white font-extrabold text-xs shadow-xs animate-in fade-in duration-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>⚠️ Shop is currently closed for new orders. Orders placed now will be processed when shop reopens.</span>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>🟢 Storefront is OPEN. Customers can add products to cart and confirm orders.</span>
            </div>
          )}
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`p-4 rounded-2xl font-bold text-xs flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* Save Settings Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-98 disabled:opacity-60"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving Settings...' : 'Save Settings'}
        </button>

      </form>

      {/* Wholesale Price List PDF Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" /> Wholesale Price List PDF Test
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Test downloading the active PDF price list or auto-generating a catalog PDF.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="space-y-1">
            <span className="font-extrabold text-xs text-slate-800 block">Sivakasi Wholesale Price List 2026</span>
            <span className="text-[11px] text-slate-500 block">Downloads the uploaded PDF file or auto-generates catalog items.</span>
          </div>

          <DownloadPriceListButton variant="primary" customUrl={priceListUrl} />
        </div>
      </div>

    </div>
  );
}
