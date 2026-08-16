'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, CheckCircle2, Sparkles, Phone, User, Calendar, FileText, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OrderItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes?: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

import { generateInvoicePDF } from '@/lib/invoicePdfGenerator';

export default function OrderInvoicePDF({ order }: { order: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const shortId = order.id.slice(-6).toUpperCase();
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const generatePDF = async (triggerDownload = true) => {
    setIsGenerating(true);
    try {
      await generateInvoicePDF(order, triggerDownload);
      if (triggerDownload) {
        setDownloaded(true);
      }
    } catch (err) {
      console.error('Invoice PDF generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      generatePDF(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Download / Print Control Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden select-none">
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Your Order Invoice is Ready</h3>
            <p className="text-xs text-slate-400">
              {downloaded 
                ? 'Your PDF invoice has been downloaded automatically. You can click below to re-download.'
                : 'Generating and downloading your official order PDF invoice automatically...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => generatePDF(true)}
            disabled={isGenerating}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <Download className="w-4 h-4 animate-bounce" />
            {isGenerating ? 'Downloading PDF...' : 'Download PDF Invoice'}
          </button>
        </div>
      </div>

      {/* Visual Invoice Display Card */}
      <div className="print:p-0">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 space-y-8 text-slate-800 print:shadow-none print:border-none print:p-0 print:rounded-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-100 pb-6 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/sriarumugamlogo.png"
                  alt="Sri Arumugam Pyro Park"
                  width={240}
                  height={80}
                  className="h-14 sm:h-16 w-auto object-contain select-none"
                  priority
                />
              </div>
              <p className="text-xs text-amber-600 font-extrabold uppercase tracking-wider select-none">
                Direct Sivakasi Factory Outlet • Official Order Receipt
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 bg-amber-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-amber-100 sm:border-none w-full sm:w-auto select-none">
              <span className="inline-block bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1">
                OFFICIAL INVOICE
              </span>
              <p className="text-lg font-black text-[#1b2342]">
                Invoice #: <span className="text-amber-600">#{shortId}</span>
              </p>
              <p className="text-xs text-slate-500 font-medium flex items-center sm:justify-end gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formattedDate}
              </p>
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-200 pb-2 select-none">
                <User className="w-4 h-4 text-amber-600" /> Billed To / Customer Details
              </h3>
              <p className="text-base font-extrabold text-[#1b2342]">{order.customer_name}</p>
              <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-600" /> +91 {order.phone}
              </p>
              {(order.aadhar_pan || (order.notes && order.notes.includes('Aadhar'))) && (
                <p className="text-xs font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-md inline-block">
                  Aadhar / PAN No: {order.aadhar_pan || order.notes?.match(/Aadhar\/PAN:\s*([^\s|]+)/)?.[1]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-200 pb-2 select-none">
                <MapPin className="w-4 h-4 text-amber-600" /> Shipping & Delivery Address
              </h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {order.address}
              </p>
              <p className="text-xs font-bold text-slate-900">
                {order.city} - {order.pincode}
              </p>
              {order.notes && (
                <p className="text-[11px] text-slate-500 italic mt-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-amber-600" /> Note: {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* Order Items Table — Sleek & Clean Styling */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 select-none">
              Itemized Order Summary
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-extrabold uppercase tracking-wider text-[11px] select-none">
                    <th className="py-3.5 px-4 text-center w-12">#</th>
                    <th className="py-3.5 px-4">Item Name</th>
                    <th className="py-3.5 px-4 text-center">Qty</th>
                    <th className="py-3.5 px-4 text-right">Unit Price</th>
                    <th className="py-3.5 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 bg-white">
                  {(order.order_items || []).map((item: OrderItem, idx: number) => (
                    <tr key={item.id || idx} className="hover:bg-amber-50/40 transition-colors odd:bg-white even:bg-slate-50/60">
                      <td className="py-3.5 px-4 text-slate-400 font-bold text-center">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-[#1b2342]">{item.product_name}</td>
                      <td className="py-3.5 px-4 text-center font-extrabold text-amber-600 bg-amber-500/5">{item.quantity}</td>
                      <td className="py-3.5 px-4 text-right text-slate-600 font-semibold">{formatCurrency(item.price)}</td>
                      <td className="py-3.5 px-4 text-right font-black text-orange-600">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Total Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white p-6 rounded-2xl gap-4 select-none">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs text-white font-bold">
                <CheckCircle2 className="w-4 h-4" /> Order Submitted Successfully
              </div>
              <p className="text-[11px] text-orange-100 font-medium">Payment Status: Manual Confirmation / COD</p>
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 border-white/20 pt-3 sm:pt-0 w-full sm:w-auto">
              <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">Grand Total Amount</p>
              <p className="text-3xl font-black text-white">{formatCurrency(order.total_amount)}</p>
            </div>
          </div>

          {/* Signature Block */}
          <div className="flex justify-end pt-2">
            <div className="text-right space-y-1 select-none">
              <p className="text-xs font-bold text-slate-800">For SRI ARUMUGAM PYRO PARK</p>
              <div className="flex justify-end py-1">
                <Image
                  src="/signature.png"
                  alt="Authorized Signature A. Marieswaran"
                  width={140}
                  height={50}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-[11px] font-bold text-slate-600">Authorized Signature: A. Marieswaran</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-100 pt-4 text-center space-y-1 text-[11px] text-slate-400 font-medium select-none">
            <p className="font-bold text-slate-600">Thank you for ordering with Sri Arumugam Pyro Park!</p>
            <p>This is an official computer-generated order receipt. Direct Sivakasi Factory Dispatch.</p>
          </div>

        </div>
      </div>

    </div>
  );
}

