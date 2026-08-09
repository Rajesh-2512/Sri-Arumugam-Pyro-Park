'use client';

import Link from 'next/link';
import SafeProductImage from '@/components/shop/SafeProductImage';
import { useCartStore } from '@/store/cart.store';
import { formatCurrency, formatDate, getProductImage } from '@/lib/utils';
import { getOrdersByPhone } from '@/services/order.actions';
import {
  getCustomerDetailsFromCookie,
  getOrderHistoryFromCookie,
  CustomerOrderHistoryItem,
} from '@/lib/customer-cookies';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ArrowLeft, Package, Phone, Search, Loader2, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartClient() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [cookieOrders, setCookieOrders] = useState<CustomerOrderHistoryItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Get saved cookie orders
    const history = getOrderHistoryFromCookie();
    setCookieOrders(history);

    // 2. Get saved customer phone and auto-fetch past orders from database
    const saved = getCustomerDetailsFromCookie();
    if (saved && saved.phone) {
      setPhoneInput(saved.phone);
      fetchDbOrders(saved.phone);
    }
  }, []);

  const fetchDbOrders = async (phone: string) => {
    if (!phone || phone.length < 10) return;
    setLoadingOrders(true);
    const res = await getOrdersByPhone(phone);
    setLoadingOrders(false);
    if (res.success) {
      setDbOrders(res.data);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDbOrders(phoneInput);
  };

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1b2342] flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-amber-600" /> Your Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {totalItems} item{totalItems > 1 ? 's' : ''} in your current cart session
          </p>
        </div>
        <Link
          href="/"
          className="text-xs font-bold text-slate-500 hover:text-amber-600 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {/* Cart Items List or Empty Cart Banner */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center space-y-4 border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-amber-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">Your Cart is Currently Empty</h2>
            <p className="text-xs text-slate-500">
              Browse our crackers catalog to add items or check your past order history below.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Browse Crackers Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {items.map((item) => {
              const itemImg = getProductImage(item.image_url);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xs justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <SafeProductImage
                        src={itemImg}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-[#1b2342] text-sm">{item.name}</h3>
                      <p className="text-xs text-emerald-600 font-extrabold">
                        {formatCurrency(item.finalPrice)} <span className="text-slate-400 font-normal">/ unit</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                    <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 select-none">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-black text-amber-600">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-[#1b2342]">
                        {formatCurrency(item.finalPrice * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold text-slate-800">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Estimated Transport Charge</span>
                <span className="text-emerald-600 font-bold">Calculated on Order Invoice</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#1b2342] pt-2 border-t border-slate-100">
                <span>Grand Total</span>
                <span className="text-2xl text-orange-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Minimum Order Amount Info Banner */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 font-bold">
              <span>Min Order: ₹3,000 (TN) | ₹5,000 (Outside TN)</span>
              {totalAmount < 3000 ? (
                <span className="text-rose-600 font-extrabold">Add {formatCurrency(3000 - totalAmount)} more for TN</span>
              ) : totalAmount < 5000 ? (
                <span className="text-amber-800 font-extrabold">TN Eligible (Add {formatCurrency(5000 - totalAmount)} for Others)</span>
              ) : (
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All States Eligible
                </span>
              )}
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* ─── YOUR PAST ORDERS & INVOICE HISTORY (On Cart Page) ─── */}
      <div className="pt-6 border-t border-slate-200/80 space-y-6">
        
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#1b2342] flex items-center gap-2.5">
            <Package className="w-6 h-6 text-orange-600" /> Your Past Orders & Tax Invoices
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter your mobile number to retrieve past orders and download PDF invoices anytime.
          </p>
        </div>

        {/* Search Mobile Number Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loadingOrders || !phoneInput}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              {loadingOrders ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Fetch My Orders
            </button>
          </form>
        </div>

        {/* Database Orders List */}
        {dbOrders.length > 0 && (
          <div className="space-y-3">
            {dbOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded text-xs border border-slate-200">
                      ORDER #{ord.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {formatDate(ord.created_at)}
                    </span>
                  </div>

                  <span className={`text-[11px] font-black uppercase px-3 py-0.5 rounded-full border ${
                    ord.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    ord.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    ord.status === 'delivered' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    ord.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    ● Status: {ord.status || 'Pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">{ord.customer_name}</span> ({ord.city})
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-sm text-orange-600">
                      {formatCurrency(ord.total_amount)}
                    </span>
                    <Link
                      href={`/order-success?id=${ord.id}`}
                      className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" /> Invoice PDF
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Saved Cookie Orders List */}
        {cookieOrders.length > 0 && dbOrders.length === 0 && (
          <div className="space-y-3">
            {cookieOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded text-xs border border-slate-200">
                      ORDER #{ord.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {formatDate(ord.date)}
                    </span>
                  </div>

                  <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Cookie Saved Order
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">{ord.customer_name}</span> ({ord.city})
                    <p className="text-[11px] text-slate-400">{ord.items_count} Cracker Pack(s)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-sm text-orange-600">
                      {formatCurrency(ord.total_amount)}
                    </span>
                    <Link
                      href={`/order-success?id=${ord.id}`}
                      className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" /> Invoice PDF
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </main>
  );
}
