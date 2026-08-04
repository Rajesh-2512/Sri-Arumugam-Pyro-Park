'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cart.store';
import { placeOrder } from '@/services/order.actions';
import { generateWhatsAppURL } from '@/lib/whatsapp';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, MessageSquare, Phone, MapPin, User, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number'),
  address: z.string().min(10, 'Please enter full detailed address'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit PIN code'),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await placeOrder({
        ...data,
        items,
        total_amount: totalAmount,
      });

      if (result.success && result.orderId) {
        const waURL = generateWhatsAppURL({
          orderId: result.orderId,
          customerName: data.customer_name,
          items,
          totalAmount,
          address: `${data.address}, ${data.city} - ${data.pincode}`,
        });
        
        clearCart();
        window.open(waURL, '_blank');
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

  if (items.length === 0) {
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
      
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1b2342] flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-emerald-600" /> Checkout & WhatsApp Slip Confirmation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fill delivery details below to generate your official order slip
          </p>
        </div>
        <Link href="/cart" className="text-xs font-bold text-slate-500 hover:text-amber-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Customer Information Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-5 shadow-xs">
          <h2 className="text-lg font-bold text-[#1b2342] flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-amber-600" /> Shipping & Customer Details
          </h2>

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
              <Phone className="w-3.5 h-3.5 text-amber-600" /> WhatsApp Mobile Number *
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
              placeholder="Door No, Street Name, Area / Landmark"
            />
            {errors.address && (
              <p className="text-red-600 text-xs mt-1 font-bold">{errors.address.message}</p>
            )}
          </div>

          {/* City & PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City / Town *
              </label>
              <input
                {...register('city')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Chennai"
              />
              {errors.city && (
                <p className="text-red-600 text-xs mt-1 font-bold">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                PIN Code *
              </label>
              <input
                {...register('pincode')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="600001"
              />
              {errors.pincode && (
                <p className="text-red-600 text-xs mt-1 font-bold">{errors.pincode.message}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-600" /> Order Notes (Optional)
            </label>
            <input
              {...register('notes')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Preferred delivery time or special instructions..."
            />
          </div>

        </div>

        {/* Order Summary Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-4 shadow-xs">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
            Order Summary ({items.length} item types)
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-xs py-1 text-slate-700">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-bold text-emerald-600">{formatCurrency(item.finalPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline font-black text-lg text-[#1b2342]">
            <span>Total Payable Amount</span>
            <span className="text-2xl text-amber-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-4 rounded-2xl">
            {errorMessage}
          </div>
        )}

        {/* Submit & WhatsApp Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-base uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Processing Order...
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5 fill-white" /> Place Order via WhatsApp
            </>
          )}
        </button>

        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          No online payment required now. Order is confirmed manually over call/WhatsApp message.
        </div>

      </form>

    </main>
  );
}
