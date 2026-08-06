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

export default function OrderInvoicePDF({ order }: { order: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const shortId = order.id.split('-')[0].toUpperCase();
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const loadLogoImage = (): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = '/sriarumugamlogo.png';
    });
  };

  const generatePDF = async (triggerDownload = true) => {
    setIsGenerating(true);

    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Colors
      const primaryDark = [27, 35, 66]; // #1b2342
      const amberColor = [217, 119, 6]; // Amber-600
      const slateGray = [100, 116, 139]; // Slate-500
      const lightBg = [248, 250, 252];

      // Load logo image for PDF
      const logoImg = await loadLogoImage();
      let headerY = 20;

      if (logoImg) {
        doc.addImage(logoImg, 'PNG', 14, 10, 48, 16);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
        doc.text('DIRECT SIVAKASI FACTORY OUTLET | OFFICIAL ORDER RECEIPT', 14, 30);
        headerY = 32;
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
        doc.text('SRI ARUMUGAM PYRO PARK', 14, 20);

        doc.setFontSize(9);
        doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
        doc.text('DIRECT SIVAKASI FACTORY OUTLET | OFFICIAL ORDER RECEIPT', 14, 26);
        headerY = 28;
      }

      // Invoice info block (top right)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
      doc.text(`INVOICE #: #${shortId}`, 196, 20, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
      doc.text(`Date: ${formattedDate}`, 196, 26, { align: 'right' });

      // Horizontal Divider
      doc.setLineWidth(0.5);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, headerY + 2, 196, headerY + 2);

      const customerBoxY = headerY + 6;

      // Customer Details Section Box
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(14, customerBoxY, 182, 28, 3, 3, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, customerBoxY, 182, 28, 3, 3, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
      doc.text('BILLED TO / CUSTOMER DETAILS:', 18, customerBoxY + 7);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
      doc.text(order.customer_name, 18, customerBoxY + 13);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
      doc.text(`Mobile: +91 ${order.phone}`, 18, customerBoxY + 18);
      doc.text(`Address: ${order.address}, ${order.city} - ${order.pincode}`, 18, customerBoxY + 23);

      // Programmatic jsPDF AutoTable generation
      const tableHead = [['#', 'Item Name', 'Qty', 'Unit Price (Rs.)', 'Total Amount (Rs.)']];
      const tableData = (order.order_items || []).map((item: OrderItem, index: number) => [
        index + 1,
        item.product_name,
        item.quantity,
        item.price.toFixed(2),
        (item.price * item.quantity).toFixed(2),
      ]);

      autoTable(doc, {
        startY: customerBoxY + 33,
        head: tableHead,
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [27, 35, 66],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'left',
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
          3: { cellWidth: 35, halign: 'right' },
          4: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
      });

      // Get final Y position after table
      const finalY = (doc as any).lastAutoTable.finalY + 8;

      // Summary Card / Total Box
      doc.setFillColor(27, 35, 66);
      doc.roundedRect(14, finalY, 182, 18, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text('Payment Status: Manual Confirmation / COD', 20, finalY + 11);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text('Grand Total:', 140, finalY + 11);

      doc.setFontSize(14);
      doc.setTextColor(251, 191, 36); // Amber
      doc.text(`Rs. ${order.total_amount.toFixed(2)}`, 190, finalY + 11.5, { align: 'right' });

      // Footer
      const footerY = finalY + 28;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
      doc.text('Thank you for shopping with Sri Arumugam Pyro Park!', 105, footerY, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.text('Direct Sivakasi Factory Dispatch. Official Computer Generated Invoice.', 105, footerY + 4, { align: 'center' });

      if (triggerDownload) {
        doc.save(`Order_Invoice_${shortId}.pdf`);
        setDownloaded(true);
      }
    } catch (err) {
      console.error('jsPDF generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Automatically download PDF upon component submission / landing
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
                  <tr className="bg-[#1b2342] text-white font-extrabold uppercase tracking-wider text-[11px] select-none">
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
                      <td className="py-3.5 px-4 text-right font-black text-emerald-600">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Total Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-[#1b2342] text-white p-6 rounded-2xl gap-4 select-none">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Order Submitted Successfully
              </div>
              <p className="text-[11px] text-slate-400">Payment Status: Manual Confirmation / COD</p>
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 border-slate-700 pt-3 sm:pt-0 w-full sm:w-auto">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Grand Total Amount</p>
              <p className="text-3xl font-black text-amber-400">{formatCurrency(order.total_amount)}</p>
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

