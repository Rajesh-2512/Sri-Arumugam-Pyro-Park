'use client';

import { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { calculateFinalPrice } from '@/lib/discount';

interface DownloadPriceListButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'compact' | 'hero';
  customUrl?: string | null;
}

export default function DownloadPriceListButton({
  className = '',
  variant = 'primary',
  customUrl,
}: DownloadPriceListButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Check if custom price list URL exists
      let targetUrl = customUrl;
      if (!targetUrl) {
        const { data: settings } = await supabase
          .from('global_settings')
          .select('price_list_url, global_discount_percentage, shop_name, contact_number')
          .single();

        if (settings?.price_list_url) {
          targetUrl = settings.price_list_url;
        }

        if (targetUrl) {
          window.open(targetUrl, '_blank');
          setLoading(false);
          return;
        }

        // Generate live PDF if no custom URL
        const globalDiscount = settings?.global_discount_percentage || 0;
        const shopName = settings?.shop_name || 'Sri Arumugam Pyro Park';
        const contactNumber = settings?.contact_number || '8682913516';

        // Fetch active products with category
        const { data: products } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('is_active', true)
          .order('category_id', { ascending: true })
          .order('name', { ascending: true });

        // Dynamic imports
        const { default: jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();

        // Header Banner
        doc.setFillColor(27, 35, 66);
        doc.rect(0, 0, 210, 36, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(shopName.toUpperCase(), 14, 15);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('OFFICIAL SIVAKASI DIWALI CRACKERS WHOLESALE PRICE LIST 2026', 14, 22);
        doc.text(`Helpline / WhatsApp: +91 ${contactNumber} | Storewide Discount: ${globalDiscount}% OFF`, 14, 28);

        const tableRows: any[] = [];
        (products || []).forEach((prod: any, idx: number) => {
          const catName = prod.categories?.name || 'General Crackers';
          const finalPrice = calculateFinalPrice(prod.price, prod.discount || 0, globalDiscount);
          const discountPct = Math.round(prod.discount || 0);

          tableRows.push([
            idx + 1,
            catName,
            prod.name,
            `Rs. ${prod.price.toFixed(2)}`,
            `${discountPct}%`,
            `Rs. ${finalPrice.toFixed(2)}`,
          ]);
        });

        autoTable(doc, {
          startY: 42,
          head: [['S.No', 'Category', 'Product Name', 'MRP Price', 'Product Disc.', 'Wholesale Price']],
          body: tableRows,
          theme: 'striped',
          headStyles: {
            fillColor: [234, 88, 12],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
          },
          bodyStyles: {
            fontSize: 8,
            textColor: [30, 41, 59],
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          columnStyles: {
            0: { cellWidth: 12, halign: 'center' },
            1: { cellWidth: 38 },
            2: { cellWidth: 65 },
            3: { cellWidth: 28, halign: 'right' },
            4: { cellWidth: 22, halign: 'center' },
            5: { cellWidth: 30, halign: 'right', fontStyle: 'bold', textColor: [16, 185, 129] },
          },
          margin: { top: 40, bottom: 20 },
          didDrawPage: (data) => {
            const pageCount = (doc as any).internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text(
              `Page ${data.pageNumber} of ${pageCount} — Sri Arumugam Pyro Park Sivakasi Crackers Price List`,
              14,
              287
            );
          },
        });

        doc.save(`Sri_Arumugam_Pyro_Park_Price_List_2026.pdf`);
      } else {
        window.open(targetUrl, '_blank');
      }
    } catch (err) {
      console.error('Failed to open/generate Price List PDF:', err);
      alert('Failed to load Price List PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'hero') {
    return (
      <button
        onClick={handleDownloadPDF}
        disabled={loading}
        className={`inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-6 py-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-400 transition-all cursor-pointer ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
        ) : (
          <FileText className="w-4 h-4 text-amber-600" />
        )}
        <span>Download Price List</span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleDownloadPDF}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-60 ${className}`}
        title="Download Official Wholesale Price List PDF"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        <span>Price List PDF</span>
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handleDownloadPDF}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-60 shadow-sm ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span>Download Wholesale Price List (PDF)</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleDownloadPDF}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-60 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span>Download Official Price List PDF 📄</span>
    </button>
  );
}
