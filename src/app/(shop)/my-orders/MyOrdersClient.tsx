'use client';

import { useState, useEffect } from 'react';
import { getOrdersByPhone } from '@/services/order.actions';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  getCustomerDetailsFromCookie,
  getOrderHistoryFromCookie,
  CustomerOrderHistoryItem,
} from '@/lib/customer-cookies';
import { Package, Search, Phone, Clock, FileText, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import Link from 'next/link';

export default function MyOrdersClient() {
  const [phoneInput, setPhoneInput] = useState('');
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [cookieOrders, setCookieOrders] = useState<CustomerOrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. Get saved order history from cookies
    const cookieHistory = getOrderHistoryFromCookie();
    setCookieOrders(cookieHistory);

    // 2. Get saved phone from cookies and auto-fetch from DB
    const savedDetails = getCustomerDetailsFromCookie();
    if (savedDetails && savedDetails.phone) {
      setPhoneInput(savedDetails.phone);
      fetchDbOrders(savedDetails.phone);
    }
  }, []);

  const fetchDbOrders = async (phone: string) => {
    if (!phone || phone.length < 10) return;
    setLoading(true);
    const res = await getOrdersByPhone(phone);
    setLoading(false);
    setSearched(true);
    if (res.success) {
      setDbOrders(res.data);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDbOrders(phoneInput);
  };

  if (!mounted) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-slate-200/80 pb-5 space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1b2342] flex items-center justify-center sm:justify-start gap-3">
          <Package className="w-8 h-8 text-orange-600" /> My Orders & Invoice History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          View your past orders, track order status, and download official PDF tax invoices.
        </p>
      </div>

      {/* Phone Number Lookup Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-orange-600" /> Look up Orders by Mobile Number
        </label>
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="Enter 10-digit mobile number (e.g. 9876543210)"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !phoneInput}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Find My Orders
          </button>
        </form>
      </div>

      {/* ─── DATABASE ORDERS LIST ─── */}
      {dbOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-[#1b2342] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Verified Orders in Database ({dbOrders.length})
          </h2>

          <div className="space-y-4">
            {dbOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      ORDER #{ord.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-3 flex-inline items-center gap-1">
                      <Clock className="w-3.5 h-3.5 inline mr-1" /> {formatDate(ord.created_at)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border ${
                    ord.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    ord.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    ord.status === 'delivered' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    ord.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    ● Status: {ord.status || 'Pending Confirmation'}
                  </span>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 block">{ord.customer_name} ({ord.phone})</span>
                    <span className="text-[11px] text-slate-500">{ord.address}, {ord.city} - {ord.pincode}</span>
                  </div>
                  <div className="sm:text-right font-black text-base text-orange-600 my-auto">
                    Total: {formatCurrency(ord.total_amount)}
                  </div>
                </div>

                {/* PDF Action */}
                <div className="flex justify-end pt-1">
                  <Link
                    href={`/order-success?id=${ord.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Download className="w-4 h-4 text-white" /> Download PDF Invoice <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SAVED COOKIE ORDERS (FALLBACK) ─── */}
      {cookieOrders.length > 0 && dbOrders.length === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-[#1b2342] flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" /> Saved Cookie Orders ({cookieOrders.length})
          </h2>

          <div className="space-y-4">
            {cookieOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      ORDER #{ord.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-3">
                      {formatDate(ord.date)}
                    </span>
                  </div>

                  <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Saved in Cookie
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">{ord.customer_name}</span> ({ord.city})
                    <p className="text-[11px] text-slate-500">{ord.items_count} Item Pack(s)</p>
                  </div>
                  <span className="font-black text-base text-orange-600">
                    {formatCurrency(ord.total_amount)}
                  </span>
                </div>

                <div className="flex justify-end pt-1">
                  <Link
                    href={`/order-success?id=${ord.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Download className="w-4 h-4 text-white" /> Download PDF Invoice <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searched && dbOrders.length === 0 && cookieOrders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No orders were found for mobile number "{phoneInput}". Please double-check your mobile number or place a new order.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      )}

    </main>
  );
}
