'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cart.store';
import { placeOrder } from '@/services/order.actions';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Phone, MapPin, User, FileText, ArrowLeft, Loader2, ShoppingBag, CheckCircle2, History, Cookie, Clock, Sparkles, CreditCard, Download } from 'lucide-react';
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
  state: z.string().min(1, 'State selection is required'),
  address: z.string().min(10, 'Please enter full detailed address'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit PIN code'),
  aadhar_pan: z.string()
    .min(1, 'Aadhar or PAN number is required')
    .refine((val) => {
      const clean = (val || '').replace(/\s+/g, '').toUpperCase();
      const isAadhar = /^\d{12}$/.test(clean);
      const isPan = /^[A-Z]{5}\d{4}[A-Z]$/.test(clean);
      return isAadhar || isPan;
    }, {
      message: 'Enter valid 12-digit Aadhar (e.g. 564986799886) or 10-char PAN (e.g. ABCDE1234F)',
    }),
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
    defaultValues: {
      state: 'Tamil Nadu',
    },
  });

  // Watch form fields to compute min order rules & save to cookies
  const formValues = watch();
  const rawPincode = (formValues.pincode || '').trim().replace(/\D/g, '');

  // Smart Pincode evaluation:
  // Tamil Nadu Pincodes start with 60xxxx - 64xxxx (excluding 605xxx Pondicherry)
  let isTN = true; // Default to Tamil Nadu
  if (rawPincode.length === 6) {
    if (rawPincode.startsWith('605') || !/^6[0-4]\d{4}$/.test(rawPincode)) {
      isTN = false; // Outside TN
    } else {
      isTN = true; // TN
    }
  }

  const regionLabel = isTN
    ? 'Tamil Nadu'
    : `Other State / Outside TN (Pincode ${rawPincode})`;

  const minRequiredAmount = isTN ? 3000 : 5000;
  const isMinAmountMet = totalAmount >= minRequiredAmount;
  const amountNeeded = Math.max(0, minRequiredAmount - totalAmount);

  useEffect(() => {
    setMounted(true);
    // 1. Auto-fill form from saved cookie details
    const saved = getCustomerDetailsFromCookie();
    if (saved) {
      if (saved.customer_name) setValue('customer_name', saved.customer_name);
      if (saved.phone) setValue('phone', saved.phone);
      if (saved.address) setValue('address', saved.address);
      if (saved.city) setValue('city', saved.city);
      if (saved.state) setValue('state', saved.state);
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
        state: formValues.state || 'Tamil Nadu',
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
    if (!isMinAmountMet) {
      setErrorMessage(`⚠️ Minimum Order Amount for ${regionLabel} is ${formatCurrency(minRequiredAmount)}. Current total is ${formatCurrency(totalAmount)}. Please add ${formatCurrency(amountNeeded)} more to your cart.`);
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

            {/* Customer Aadhar / PAN No */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Customer Aadhar / PAN No *
              </label>
              <input
                {...register('aadhar_pan')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors uppercase font-mono"
                placeholder="e.g. 564986799886 / ABCDE1234F"
              />
              {errors.aadhar_pan && (
                <p className="text-red-600 text-xs mt-1 font-bold">{errors.aadhar_pan.message}</p>
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

          {/* MINIMUM ORDER AMOUNT RESTRICTION BANNER */}
          {!isMinAmountMet && (
            <div className="bg-gradient-to-r from-red-50 to-amber-50 border-2 border-red-300 p-5 rounded-2xl space-y-3 shadow-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-red-200/60 pb-2">
                <div className="flex items-center gap-2 text-red-900 font-black text-sm uppercase">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  Minimum Order Restriction ({regionLabel})
                </div>
                <span className="bg-red-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full uppercase">
                  Cannot Submit Order
                </span>
              </div>
              <p className="text-xs text-red-800 font-medium leading-relaxed">
                Minimum required order amount for <strong>{regionLabel}</strong> is{' '}
                <strong className="text-red-950 font-black">{formatCurrency(minRequiredAmount)}</strong>.
                Your current cart total is <strong className="text-slate-900 font-black">{formatCurrency(totalAmount)}</strong>.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-red-200/60">
                <span className="text-xs font-black text-red-700">
                  ⚠️ Add {formatCurrency(amountNeeded)} more worth of crackers to submit your order
                </span>
                <Link
                  href="/"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer"
                >
                  + Add More Crackers
                </Link>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-4 rounded-2xl">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isShopOpen || !isMinAmountMet}
            className={`w-full py-4 px-6 rounded-2xl text-white font-extrabold text-base uppercase tracking-wider shadow-lg flex items-center justify-center gap-3 transition-all ${
              !isMinAmountMet
                ? 'bg-red-600 opacity-90 cursor-not-allowed shadow-none'
                : isShopOpen
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 shadow-orange-500/20 hover:scale-[1.01] cursor-pointer'
                : 'bg-red-600 opacity-80 cursor-not-allowed shadow-none'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting Order...
              </>
            ) : !isMinAmountMet ? (
              <>
                ⚠️ MIN ORDER {formatCurrency(minRequiredAmount)} REQUIRED (ADD {formatCurrency(amountNeeded)} MORE)
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
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/order-success?id=${ord.id}`}
                      className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-extrabold px-3 py-1 rounded-xl text-[11px] transition-colors cursor-pointer"
                      title="Download PDF Bill Invoice"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-600" />
                      <span>Download Bill</span>
                    </Link>
                  </div>
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
