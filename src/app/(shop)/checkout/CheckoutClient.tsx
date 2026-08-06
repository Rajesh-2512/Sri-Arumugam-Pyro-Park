'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cart.store';
import { placeOrder } from '@/services/order.actions';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Phone, MapPin, User, FileText, ArrowLeft, Loader2, ShoppingBag, CheckCircle2, History, Cookie, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import {
  saveCustomerDetailsToCookie,
  getCustomerDetailsFromCookie,
  addOrderToHistoryCookie,
  getOrderHistoryFromCookie,
  CustomerOrderHistoryItem,
} from '@/lib/customer-cookies';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number'),
  address: z.string().min(10, 'Please enter full detailed address'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit PIN code'),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutClient({ isShopOpen = true }: { isShopOpen?: boolean }) {
  const { items, totalAmount, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isRestoredFromCookie, setIsRestoredFromCookie] = useState(false);
  const [orderHistory, setOrderHistory] = useState<CustomerOrderHistoryItem[]>([]);
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  // Watch form fields to auto-save to cookies
  const formValues = watch();

  useEffect(() => {
    setMounted(true);
    // 1. Auto-fill form from saved cookie details
    const saved = getCustomerDetailsFromCookie();
    if (saved) {
      if (saved.customer_name) setValue('customer_name', saved.customer_name);
      if (saved.phone) setValue('phone', saved.phone);
      if (saved.address) setValue('address', saved.address);
      if (saved.city) setValue('city', saved.city);
      if (saved.pincode) setValue('pincode', saved.pincode);
      if (saved.notes) setValue('notes', saved.notes);
      setIsRestoredFromCookie(true);
    }

    // 2. Load order history from cookies
    const history = getOrderHistoryFromCookie();
    setOrderHistory(history);
  }, [setValue]);

  // Auto-save typing changes to cookie
  useEffect(() => {
    if (formValues && (formValues.customer_name || formValues.phone || formValues.address)) {
      saveCustomerDetailsToCookie({
        customer_name: formValues.customer_name || '',
        phone: formValues.phone || '',
        address: formValues.address || '',
        city: formValues.city || '',
        pincode: formValues.pincode || '',
        notes: formValues.notes || '',
      });
    }
  }, [formValues]);

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return;
    if (!isShopOpen) {
      setErrorMessage('⚠️ Shop is currently closed for new orders. Orders placed now will be processed when shop reopens.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');

    // Save details to cookie
    saveCustomerDetailsToCookie(data);

    try {
      const result = await placeOrder({
        ...data,
        items,
        total_amount: totalAmount,
      });

      if (result.success && result.orderId) {
        // Save to order history cookie
        addOrderToHistoryCookie({
          id: result.orderId,
          date: new Date().toISOString(),
          total_amount: totalAmount,
          items_count: items.reduce((sum, i) => sum + i.quantity, 0),
          items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.finalPrice })),
          customer_name: data.customer_name,
          city: data.city,
        });

        clearCart();
        router.push(`/order-success?id=${result.orderId}`);
      } else {
        setErrorMessage(result.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0 && orderHistory.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold">Your cart is empty</h1>
        <Link href="/" className="inline-block bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {!isShopOpen && (
        <div className="bg-red-600 text-white font-extrabold text-xs sm:text-sm text-center p-4 rounded-2xl shadow-md border-2 border-red-500">
          ⚠️ Shop is currently closed for new orders. Orders placed now will be processed when shop reopens.
        </div>
      )}

      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1b2342] flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-amber-600" /> Checkout & Order Confirmation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fill delivery details below to generate your official order PDF invoice
          </p>
        </div>
        <Link href="/cart" className="text-xs font-bold text-slate-500 hover:text-amber-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      {items.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Customer Information Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-5 shadow-xs relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-[#1b2342] flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" /> Shipping & Customer Details
              </h2>
              {isRestoredFromCookie && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-amber-200">
                  <Cookie className="w-3.5 h-3.5 text-amber-600" /> Restored from Cookies
                </span>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                {...register('customer_name')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Ravi Kumar"
              />
              {errors.customer_name && (
                <p className="text-red-600 text-xs mt-1 font-bold">{errors.customer_name.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-600" /> Mobile Number *
              </label>
              <input
                {...register('phone')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="9876543210"
              />
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1 font-bold">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" /> Delivery Address *
              </label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Door No, Street Name, Landmark"
              />
              {errors.address && (
                <p className="text-red-600 text-xs mt-1 font-bold">{errors.address.message}</p>
              )}
            </div>

            {/* City & Pincode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  City / Town *
                </label>
                <input
                  {...register('city')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Chennai / Madurai / Sivakasi"
                />
                {errors.city && (
                  <p className="text-red-600 text-xs mt-1 font-bold">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Pincode *
                </label>
                <input
                  {...register('pincode')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  placeholder="626123"
                />
                {errors.pincode && (
                  <p className="text-red-600 text-xs mt-1 font-bold">{errors.pincode.message}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-600" /> Order Notes / Special Instructions (Optional)
              </label>
              <input
                {...register('notes')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="e.g. Call before delivery, deliver in afternoon"
              />
            </div>

          </div>

          {/* Order Summary Line Items */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-[#1b2342] border-b border-slate-100 pb-3">
              Order Line Items Snapshot ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs py-1 text-slate-700">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-bold text-amber-600">{formatCurrency(item.finalPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline font-black text-lg text-[#1b2342]">
              <span>Total Payable Amount</span>
              <span className="text-2xl text-orange-600">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-4 rounded-2xl">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isShopOpen}
            className={`w-full py-4 px-6 rounded-2xl text-white font-extrabold text-base uppercase tracking-wider shadow-lg flex items-center justify-center gap-3 transition-all ${
              isShopOpen
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 shadow-orange-500/20 hover:scale-[1.01] cursor-pointer'
                : 'bg-red-600 opacity-80 cursor-not-allowed shadow-none'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting Order...
              </>
            ) : !isShopOpen ? (
              <>
                ⚠️ SHOP CLOSED - CANNOT CONFIRM ORDER
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" /> PLACE ORDER ({formatCurrency(totalAmount)})
              </>
            )}
          </button>

          <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Your details are saved in cookies for your next visit. Receipt & PDF invoice will be generated upon submission.
          </div>

        </form>
      )}

      {/* ─── CUSTOMER ORDER HISTORY (Saved in Cookies) ─── */}
      {orderHistory.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-[#1b2342] flex items-center gap-2">
              <History className="w-5 h-5 text-orange-600" /> Your Order History (Saved in Cookies)
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {orderHistory.length} Past Order{orderHistory.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {orderHistory.map((ord) => (
              <div key={ord.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Order #{ord.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" /> {formatDate(ord.date)}
                    </span>
                  </div>
                  <Link
                    href={`/order-success?id=${ord.id}`}
                    className="text-orange-600 hover:text-orange-700 font-extrabold text-[11px] underline"
                  >
                    View Invoice PDF →
                  </Link>
                </div>

                <div className="flex items-center justify-between text-slate-700 pt-1">
                  <div>
                    <span className="font-bold text-slate-900">{ord.customer_name}</span> ({ord.city})
                    <p className="text-[11px] text-slate-500">{ord.items_count} Cracker Pack(s) Ordered</p>
                  </div>
                  <span className="font-black text-sm text-orange-600">
                    {formatCurrency(ord.total_amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}
