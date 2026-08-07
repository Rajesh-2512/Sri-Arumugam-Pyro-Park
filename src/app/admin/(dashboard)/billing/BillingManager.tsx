'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types/product';
import { GiftBox } from '@/types/giftbox';
import { formatCurrency, getProductImage } from '@/lib/utils';
import SafeProductImage from '@/components/shop/SafeProductImage';
import { createAdminBillingOrder, BillingOrderItem } from '@/services/billing.actions';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  Phone,
  Building,
  Printer,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CreditCard,
  Percent,
  Receipt,
  ShoppingCart,
  Gift,
  Package,
  Grid,
  List,
  PauseCircle,
  PlayCircle,
  X,
  QrCode,
  Wallet,
  Eye,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BillingManagerProps {
  products: Product[];
  giftBoxes: GiftBox[];
}

interface HeldBill {
  id: string;
  timestamp: string;
  customerName: string;
  phone: string;
  items: BillingOrderItem[];
  overallDiscountPercent: number;
  gstMode: 'none' | 'exclusive' | 'inclusive';
  gstRate: number;
  paymentMode: 'cash' | 'upi' | 'card' | 'bank_transfer';
}

export default function BillingManager({ products, giftBoxes }: BillingManagerProps) {
  // --- CATALOG & VIEW STATE ---
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [productSearch, setProductSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- DEDICATED PAYMENT CHECKOUT PAGE TOGGLE ---
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // --- CART / LIVE TICKET STATE ---
  const [lineItems, setLineItems] = useState<BillingOrderItem[]>([]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);

  // --- BUYER DETAILS STATE ---
  const [customerName, setCustomerName] = useState('Walk-in Counter Buyer');
  const [phone, setPhone] = useState('9999999999');
  const [address, setAddress] = useState('In-Store Counter');
  const [city, setCity] = useState('Sivakasi');
  const [pincode, setPincode] = useState('626123');
  const [gstin, setGstin] = useState('');

  // --- TAX & PAYMENT STATE ---
  const [gstMode, setGstMode] = useState<'none' | 'exclusive' | 'inclusive'>('none');
  const [gstRate, setGstRate] = useState<number>(18);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card' | 'bank_transfer'>('cash');
  const [overallDiscountPercent, setOverallDiscountPercent] = useState<number>(0);
  const [cashTendered, setCashTendered] = useState<string>('');
  const [notes, setNotes] = useState('');

  // --- HELD BILLS STATE ---
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);
  const [showHeldBillsModal, setShowHeldBillsModal] = useState(false);

  // --- THERMAL RECEIPT MODAL ---
  const [showThermalModal, setShowThermalModal] = useState(false);
  const [lastSavedOrder, setLastSavedOrder] = useState<{
    orderId: string;
    date: string;
    items: BillingOrderItem[];
    customerName: string;
    phone: string;
    subtotal: number;
    discount: number;
    gstAmount: number;
    grandTotal: number;
    paymentMode: string;
  } | null>(null);

  // --- STATUS STATE ---
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  // Focus Search Bar Shortcut (Ctrl+K or /) & Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'F2') {
        e.preventDefault();
        setCustomerName('Walk-in Counter Buyer');
        setPhone('9999999999');
        setAddress('In-Store Counter');
        setCity('Sivakasi');
        setPincode('626123');
      }
      if (e.key === 'F8') {
        e.preventDefault();
        holdCurrentBill();
      }
      if (e.key === 'F9') {
        e.preventDefault();
        if (isCheckoutOpen) {
          handleSaveAndPrint();
        } else if (lineItems.length > 0) {
          setIsCheckoutOpen(true);
        }
      }
      if (e.key === 'Escape') {
        if (showThermalModal) setShowThermalModal(false);
        else if (showHeldBillsModal) setShowHeldBillsModal(false);
        else if (isCheckoutOpen) setIsCheckoutOpen(false);
        else if (productSearch) setProductSearch('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lineItems, customerName, phone, heldBills, showThermalModal, showHeldBillsModal, isCheckoutOpen, productSearch]);

  // Distinct Categories list
  const categoryMap = new Map<string, string>();
  products.forEach((p) => {
    if (p.category_id && p.categories && (p.categories as any).name) {
      categoryMap.set(p.category_id, (p.categories as any).name);
    }
  });

  // Filter Catalog Items
  const filteredProducts = products.filter((p) => {
    if (!p.is_active) return false;
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
    if (selectedCategoryTab === 'giftboxes') return false;
    if (selectedCategoryTab === 'all') return matchesSearch;
    return matchesSearch && p.category_id === selectedCategoryTab;
  });

  const filteredGiftBoxes = giftBoxes.filter((g) => {
    if (!g.is_active) return false;
    const matchesSearch = g.name.toLowerCase().includes(productSearch.toLowerCase());
    if (selectedCategoryTab === 'all' || selectedCategoryTab === 'giftboxes') return matchesSearch;
    return false;
  });

  // Cart Helper Functions
  const addItem = (id: string, name: string, price: number, discount: number, imageUrl?: string | null) => {
    const finalPrice = price * (1 - (discount || 0) / 100);
    setLineItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id, name, price, discount, finalPrice, quantity: 1 }];
    });

    // Trigger visual pulse animation
    setAddedAnimationId(id);
    setTimeout(() => setAddedAnimationId(null), 600);
  };

  const getItemQuantity = (id: string) => {
    const item = lineItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setLineItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setLineItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)));
  };

  const removeItem = (id: string) => {
    setLineItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addCustomItem = () => {
    if (!customItemName || !customItemPrice) return;
    const priceNum = parseFloat(customItemPrice) || 0;
    if (priceNum <= 0) return;

    const id = `custom_${Date.now()}`;
    setLineItems((prev) => [
      ...prev,
      { id, name: customItemName, price: priceNum, discount: 0, finalPrice: priceNum, quantity: 1 },
    ]);
    setCustomItemName('');
    setCustomItemPrice('');
    setShowCustomItemForm(false);
  };

  const clearCart = () => {
    if (lineItems.length === 0) return;
    if (confirm('Clear current live cart items?')) {
      setLineItems([]);
    }
  };

  // Held Bills Operations
  const holdCurrentBill = () => {
    if (lineItems.length === 0) {
      setMessage({ type: 'error', text: 'Cannot hold an empty bill. Add items first.' });
      return;
    }

    const newHeld: HeldBill = {
      id: `HOLD_${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName || 'Walk-in Buyer',
      phone: phone || 'N/A',
      items: [...lineItems],
      overallDiscountPercent,
      gstMode,
      gstRate,
      paymentMode,
    };

    setHeldBills((prev) => [newHeld, ...prev]);
    setLineItems([]);
    setCustomerName('Walk-in Counter Buyer');
    setPhone('9999999999');
    setIsCheckoutOpen(false);
    setMessage({ type: 'success', text: `Ticket #${newHeld.id} saved to Held Bills buffer!` });
  };

  const restoreHeldBill = (held: HeldBill) => {
    setLineItems(held.items);
    setCustomerName(held.customerName);
    setPhone(held.phone);
    setOverallDiscountPercent(held.overallDiscountPercent);
    setGstMode(held.gstMode);
    setGstRate(held.gstRate);
    setPaymentMode(held.paymentMode);
    setHeldBills((prev) => prev.filter((b) => b.id !== held.id));
    setShowHeldBillsModal(false);
    setMessage({ type: 'success', text: `Restored Ticket #${held.id} to Live Order Desk!` });
  };

  // Financial Calculations
  const rawSubtotal = lineItems.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);
  const discountAmount = (rawSubtotal * overallDiscountPercent) / 100;
  const discountedSubtotal = Math.max(0, rawSubtotal - discountAmount);

  let gstAmount = 0;
  let grandTotal = discountedSubtotal;

  if (gstMode === 'exclusive') {
    gstAmount = (discountedSubtotal * gstRate) / 100;
    grandTotal = discountedSubtotal + gstAmount;
  } else if (gstMode === 'inclusive') {
    gstAmount = discountedSubtotal - discountedSubtotal / (1 + gstRate / 100);
    grandTotal = discountedSubtotal;
  }

  const changeReturnAmount = Math.max(0, (parseFloat(cashTendered) || 0) - grandTotal);

  // Helper to load logo image for PDF
  const loadLogoImage = (): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = '/sriarumugamlogo.png';
    });
  };

  // PDF Generation Function — 100% Identical to OrderInvoicePDF Brand Design
  const generatePdfInvoice = async (orderId: string, createdAtDate?: string) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryDark = [27, 35, 66]; // #1b2342
    const amberColor = [217, 119, 6]; // Amber-600
    const brandOrange = [234, 88, 12]; // #ea580c
    const slateGray = [100, 116, 139]; // Slate-500
    const lightBg = [248, 250, 252];

    const shortId = orderId.slice(-8).toUpperCase();
    const formattedDate = createdAtDate 
      ? new Date(createdAtDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

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

    // Invoice Meta (top right)
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
    doc.text(customerName || 'Walk-in Counter Buyer', 18, customerBoxY + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
    doc.text(`Mobile: ${phone ? '+91 ' + phone : 'N/A'}`, 18, customerBoxY + 18);
    doc.text(`Address: ${address || 'In-Store Counter'}, ${city} - ${pincode}`, 18, customerBoxY + 23);

    if (gstin) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
      doc.text(`BUYER GSTIN: ${gstin.toUpperCase()}`, 120, customerBoxY + 13);
    }

    // Programmatic jsPDF AutoTable generation
    const tableHead = [['#', 'Item Name', 'Qty', 'Unit Price (Rs.)', 'Total Amount (Rs.)']];
    const tableData = lineItems.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      item.finalPrice.toFixed(2),
      (item.finalPrice * item.quantity).toFixed(2),
    ]);

    autoTable(doc, {
      startY: customerBoxY + 33,
      head: tableHead,
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [234, 88, 12], // Vibrant Brand Orange
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

    const finalY = (doc as any).lastAutoTable.finalY + 6;

    // Financial Breakdown Container (Subtotal, Discount, GST)
    let breakdownY = finalY;

    if (overallDiscountPercent > 0 || gstMode !== 'none') {
      // Right-aligned summary box for Financial Breakdown
      const lineCount = 1 + (overallDiscountPercent > 0 ? 1 : 0) + (gstMode !== 'none' ? 2 : 0);
      const summaryBoxHeight = 6 + lineCount * 6;

      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(110, breakdownY, 86, summaryBoxHeight, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(110, breakdownY, 86, summaryBoxHeight, 2, 2, 'D');

      let innerY = breakdownY + 6;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
      doc.text('Subtotal:', 115, innerY);
      doc.text(`Rs. ${rawSubtotal.toFixed(2)}`, 190, innerY, { align: 'right' });
      innerY += 5.5;

      if (overallDiscountPercent > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(brandOrange[0], brandOrange[1], brandOrange[2]);
        doc.text(`Discount (${overallDiscountPercent}%):`, 115, innerY);
        doc.text(`- Rs. ${discountAmount.toFixed(2)}`, 190, innerY, { align: 'right' });
        innerY += 5.5;
      }

      if (gstMode !== 'none') {
        const halfGst = (gstAmount / 2).toFixed(2);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
        doc.text(`CGST (${(gstRate / 2).toFixed(1)}%):`, 115, innerY);
        doc.text(`Rs. ${halfGst}`, 190, innerY, { align: 'right' });
        innerY += 5.5;

        doc.text(`SGST (${(gstRate / 2).toFixed(1)}%):`, 115, innerY);
        doc.text(`Rs. ${halfGst}`, 190, innerY, { align: 'right' });
        innerY += 5.5;
      }

      breakdownY += summaryBoxHeight + 6;
    }

    // Summary Card / Total Box — Elegant Light Theme
    doc.setFillColor(255, 247, 237); // Soft Orange Light Fill
    doc.roundedRect(14, breakdownY, 182, 18, 3, 3, 'F');
    doc.setLineWidth(0.4);
    doc.setDrawColor(234, 88, 12); // Brand Orange Border
    doc.roundedRect(14, breakdownY, 182, 18, 3, 3, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text(`Payment Status: Paid (${paymentMode.toUpperCase()})`, 20, breakdownY + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(234, 88, 12); // Brand Orange
    doc.text(`Grand Total: Rs. ${grandTotal.toFixed(2)}`, 190, breakdownY + 11.5, { align: 'right' });

    // Footer
    const footerY = breakdownY + 26;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
    doc.text('Thank you for shopping with Sri Arumugam Pyro Park!', 105, footerY, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Direct Sivakasi Factory Dispatch. Official Computer Generated Invoice.', 105, footerY + 4, { align: 'center' });

    doc.save(`Order_Invoice_${shortId}.pdf`);
  };

  // Submit Order Action
  const handleSaveAndPrint = async () => {
    if (!customerName || !phone) {
      setMessage({ type: 'error', text: 'Please enter Buyer Name and Mobile Number.' });
      return;
    }
    if (lineItems.length === 0) {
      setMessage({ type: 'error', text: 'Cart is empty. Please select products to add to bill.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const res = await createAdminBillingOrder({
      customer_name: customerName,
      phone,
      address,
      city,
      pincode,
      gstin: gstin || undefined,
      gst_rate: gstMode !== 'none' ? gstRate : 0,
      gst_amount: gstAmount,
      payment_mode: paymentMode,
      notes,
      total_amount: grandTotal,
      items: lineItems,
    });

    setSubmitting(false);

    if (res.success && res.orderId) {
      const orderIdStr = res.orderId;
      const orderDateStr = res.createdAt || new Date().toISOString();

      // Save for Thermal Receipt View Modal
      setLastSavedOrder({
        orderId: orderIdStr,
        date: new Date(orderDateStr).toLocaleString('en-IN'),
        items: [...lineItems],
        customerName,
        phone,
        subtotal: rawSubtotal,
        discount: discountAmount,
        gstAmount,
        grandTotal,
        paymentMode,
      });

      setMessage({ type: 'success', text: `Invoice #${orderIdStr.slice(-8).toUpperCase()} created & saved successfully!` });
      
      // Auto-trigger PDF invoice download
      generatePdfInvoice(orderIdStr, orderDateStr);

      // Reset Form State & Close Checkout Page
      setLineItems([]);
      setCustomerName('Walk-in Counter Buyer');
      setPhone('9999999999');
      setGstin('');
      setCashTendered('');
      setOverallDiscountPercent(0);
      setGstMode('none');
      setIsCheckoutOpen(false);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save billing order.' });
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-slate-50 text-slate-800 selection:bg-amber-500 selection:text-white">
      
      {/* ─── TOP CONTROL BAR (HOTKEYS & COUNTER STATUS) ─── */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
        
        {/* Brand & Terminal Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
            <Receipt className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-slate-900 tracking-tight">Sri Arumugam POS Billing Desk</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Counter 01 Active
              </span>
            </div>
          </div>
        </div>

        {/* Hotkeys Bar */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-600 font-mono">
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 font-medium">
            <strong className="text-amber-600 font-extrabold">Ctrl+K</strong> Search
          </span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 font-medium">
            <strong className="text-amber-600 font-extrabold">F2</strong> Walk-In
          </span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 font-medium">
            <strong className="text-amber-600 font-extrabold">F8</strong> Hold Bill
          </span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 font-medium">
            <strong className="text-amber-600 font-extrabold">F9</strong> {isCheckoutOpen ? 'Complete Order' : 'Checkout'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Held Bills Modal Toggle */}
          <button
            onClick={() => setShowHeldBillsModal(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              heldBills.length > 0
                ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 shadow-2xs'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <PauseCircle className="w-4 h-4 text-amber-600" />
            <span>Held Bills</span>
            {heldBills.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[11px] flex items-center justify-center shadow-2xs">
                {heldBills.length}
              </span>
            )}
          </button>

          {/* Thermal Receipt Preview Button */}
          {lastSavedOrder && (
            <button
              onClick={() => setShowThermalModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-600" />
              <span>Last Receipt</span>
            </button>
          )}

        </div>

      </header>

      {/* Message Alert Banner */}
      {message && (
        <div className={`px-4 py-2.5 text-xs font-extrabold flex items-center justify-between shrink-0 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-red-50 text-red-800 border-b border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── DEDICATED PAYMENT CHECKOUT PAGE / OVERLAY ─── */}
      {isCheckoutOpen ? (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-100 overflow-y-auto animate-fadeIn">
          
          {/* Checkout Header Toolbar */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Product Catalog
            </button>

            <div className="text-center">
              <span className="font-black text-sm text-slate-900 block">Payment & Tax Checkout</span>
              <span className="text-[11px] text-slate-500 font-medium">Review order details, discounts & complete transaction</span>
            </div>

            <div className="w-36 text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Due</span>
              <span className="font-mono font-black text-amber-600 text-lg">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* 2-Column Spacious Payment Layout */}
          <div className="flex-1 p-6 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT BOX (5-Cols): Itemized Order Summary */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-600" />
                  <h3 className="font-black text-slate-900 text-sm">Itemized Order Summary</h3>
                </div>
                <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-1 rounded-full">
                  {lineItems.reduce((acc, i) => acc + i.quantity, 0)} Items
                </span>
              </div>

              {/* Scrollable Items List */}
              <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1 text-xs">
                {lineItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900 text-xs block truncate">{item.name}</span>
                      <span className="text-slate-500 text-[11px]">
                        {formatCurrency(item.finalPrice)} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-mono font-black text-slate-900 text-xs">
                      {formatCurrency(item.finalPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Subtotal:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(rawSubtotal)}</span>
                </div>

                {overallDiscountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({overallDiscountPercent}%):</span>
                    <span>- {formatCurrency(discountAmount)}</span>
                  </div>
                )}

                {gstMode !== 'none' && (
                  <div className="flex justify-between text-amber-800 font-semibold">
                    <span>GST ({gstRate}% breakdown):</span>
                    <span>+ {formatCurrency(gstAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                  <span className="font-black text-slate-900 text-xs uppercase tracking-wider">Grand Total:</span>
                  <span className="font-mono font-black text-2xl text-amber-600">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT BOX (7-Cols): Customer Details, Editable Discounts, Editable Tax & Payment Mode */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* 1. Customer Details Section */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-600" />
                    <h3 className="font-black text-slate-900 text-sm">Customer & B2B Details</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerName('Walk-in Counter Buyer');
                      setPhone('9999999999');
                      setAddress('In-Store Counter');
                      setCity('Sivakasi');
                    }}
                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    ⚡ Fill Walk-in Counter Sale (F2)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">Customer / Buyer Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-amber-900 uppercase mb-1">B2B GSTIN (Optional)</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="e.g. 33ABCDE1234F1Z5"
                      className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs text-amber-900 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">City / Location</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Discounts & Tax Settings Section (EDITABLE CUSTOM DISCOUNT & GST RATE) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Percent className="w-5 h-5 text-amber-600" />
                  <h3 className="font-black text-slate-900 text-sm">Discounts & GST Tax Configuration</h3>
                </div>

                <div className="space-y-4 text-xs">
                  
                  {/* EDITABLE DISCOUNT PERCENTAGE */}
                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-2">
                      Discount Percentage (Select Preset or Enter Custom %)
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[0, 5, 10, 15, 20].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setOverallDiscountPercent(pct)}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              overallDiscountPercent === pct
                                ? 'bg-amber-500 text-white border-amber-600 font-black shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>

                      {/* CUSTOM EDITABLE DISCOUNT INPUT */}
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 rounded-xl px-3 py-1.5 shadow-2xs">
                        <span className="text-xs font-black text-amber-900">Custom %:</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={overallDiscountPercent || ''}
                          onChange={(e) => setOverallDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                          placeholder="0"
                          className="w-16 bg-white border border-amber-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono font-black focus:outline-none focus:border-amber-500 text-center"
                        />
                        <span className="text-xs font-black text-amber-900">%</span>
                      </div>
                    </div>
                  </div>

                  {/* GST TAX MODE & EDITABLE GST RATE */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <label className="block font-black text-slate-700 uppercase">GST Tax Mode</label>
                    <div className="flex items-center gap-2">
                      {(['none', 'exclusive', 'inclusive'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setGstMode(mode)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border capitalize transition-all cursor-pointer ${
                            gstMode === mode
                              ? 'bg-amber-500 text-white border-amber-600 font-black shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {mode === 'none' ? 'No GST (0%)' : mode === 'exclusive' ? '+ Exclusive GST' : 'Inclusive GST'}
                        </button>
                      ))}
                    </div>

                    {/* EDITABLE GST RATE INPUT (When GST Enabled) */}
                    {gstMode !== 'none' && (
                      <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                        <span className="text-xs font-extrabold text-amber-900">Select or Enter GST Rate %:</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[5, 12, 18, 28].map((rate) => (
                            <button
                              key={rate}
                              type="button"
                              onClick={() => setGstRate(rate)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                                gstRate === rate
                                  ? 'bg-amber-600 text-white border-amber-600 font-black'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {rate}%
                            </button>
                          ))}

                          {/* CUSTOM EDITABLE GST RATE INPUT */}
                          <div className="flex items-center gap-1 bg-white border border-amber-300 rounded-xl px-2.5 py-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={gstRate || ''}
                              onChange={(e) => setGstRate(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                              placeholder="Rate"
                              className="w-14 bg-transparent text-xs text-slate-900 font-mono font-black focus:outline-none text-center"
                            />
                            <span className="text-xs font-black text-amber-900">%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* 3. Payment Mode & Cash Tendered Section */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <h3 className="font-black text-slate-900 text-sm">Payment Method & Cash Calculator</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'cash', label: 'Cash Payment', icon: Wallet },
                    { id: 'upi', label: 'UPI / QR Code', icon: QrCode },
                    { id: 'card', label: 'Card Terminal', icon: CreditCard },
                    { id: 'bank_transfer', label: 'Bank Transfer', icon: Building },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSel = paymentMode === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMode(pm.id as any)}
                        className={`py-3 px-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          isSel
                            ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white border-amber-600 shadow-md shadow-orange-500/20'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Cash Received Input */}
                {paymentMode === 'cash' && (
                  <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-amber-900">Cash Received from Buyer ₹</span>
                      <input
                        type="number"
                        value={cashTendered}
                        onChange={(e) => setCashTendered(e.target.value)}
                        placeholder="0"
                        className="w-28 bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono font-black"
                      />
                    </div>
                    {parseFloat(cashTendered) > 0 && (
                      <div className="text-right">
                        <span className="text-[10px] text-amber-800 uppercase font-extrabold block">Change to Return</span>
                        <span className="font-mono font-black text-emerald-700 text-base">
                          {formatCurrency(changeReturnAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4. Complete Payment Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={submitting || lineItems.length === 0}
                  onClick={handleSaveAndPrint}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-40"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" /> Processing Transaction...
                    </>
                  ) : (
                    <>
                      <Printer className="w-5 h-5 text-white" /> Confirm Payment & Print GST Tax Invoice PDF (F9)
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* ─── MAIN POS CATALOG & TICKET VIEW ─── */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: CATALOG DESK (70% Width on Desktop)                          */}
          {/* ========================================================================= */}
          <section className="flex-1 flex flex-col min-w-0 bg-slate-50 border-r border-slate-200/80 overflow-hidden">
            
            {/* CATALOG HEADER TOOLBAR: Search & Filters */}
            <div className="p-4 bg-white border-b border-slate-200/80 space-y-3 shrink-0 shadow-2xs">
              
              <div className="flex items-center gap-3">
                
                {/* Product Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by name... (Press Ctrl+K)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* View Mode Toggle Switch (Grid vs Dense List) */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-amber-600 font-black shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-white text-amber-600 font-black shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="High-Speed List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Add Custom Non-Catalog Item Button */}
                <button
                  onClick={() => setShowCustomItemForm(!showCustomItemForm)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    showCustomItemForm
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Custom Charge</span>
                </button>

              </div>

              {/* Inline Form to Add Custom Charge */}
              {showCustomItemForm && (
                <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex flex-col sm:flex-row gap-2 animate-fadeIn">
                  <input
                    type="text"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="Charge Description (e.g. Wooden Box Packing)"
                    className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-medium"
                  />
                  <input
                    type="number"
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(e.target.value)}
                    placeholder="Price ₹"
                    className="w-full sm:w-28 bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold"
                  />
                  <button
                    onClick={addCustomItem}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                  >
                    Add Charge
                  </button>
                </div>
              )}

              {/* Horizontal Category Scroll Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                
                <button
                  onClick={() => setSelectedCategoryTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                    selectedCategoryTab === 'all'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80'
                  }`}
                >
                  All Products ({products.length + giftBoxes.length})
                </button>

                {giftBoxes.length > 0 && (
                  <button
                    onClick={() => setSelectedCategoryTab('giftboxes')}
                    className={`px-3.5 py-1.5 rounded-xl font-extrabold uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      selectedCategoryTab === 'giftboxes'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                        : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" /> Gift Combos ({giftBoxes.length})
                  </button>
                )}

                {Array.from(categoryMap.entries()).map(([catId, catName]) => {
                  const count = products.filter((p) => p.category_id === catId && p.is_active).length;
                  return (
                    <button
                      key={catId}
                      onClick={() => setSelectedCategoryTab(catId)}
                      className={`px-3.5 py-1.5 rounded-xl font-extrabold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                        selectedCategoryTab === catId
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80'
                      }`}
                    >
                      {catName} ({count})
                    </button>
                  );
                })}

              </div>

            </div>

            {/* CATALOG ITEMS SCROLLABLE GRID / LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Gift Boxes Section */}
              {filteredGiftBoxes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-600" /> Gift Box Assortments
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredGiftBoxes.map((box) => {
                      const qtyInCart = getItemQuantity(`giftbox_${box.id}`);
                      const boxImg = getProductImage(box.images);
                      return (
                        <div
                          key={box.id}
                          className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                            qtyInCart > 0
                              ? 'bg-amber-50/90 border-amber-500 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-amber-300 shadow-2xs'
                          }`}
                        >
                          {/* Box Image Thumbnail */}
                          <div className="relative w-full h-32 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                            <SafeProductImage
                              src={boxImg}
                              alt={box.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-900 text-xs block line-clamp-1">{box.name}</span>
                            <span className="font-black text-amber-600 text-sm">{formatCurrency(box.price)}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            {qtyInCart > 0 ? (
                              <div className="flex items-center justify-between bg-white px-2 py-1 rounded-xl border border-amber-300 shadow-2xs">
                                <button
                                  onClick={() => updateQuantity(`giftbox_${box.id}`, qtyInCart - 1)}
                                  className="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-black flex items-center justify-center cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-black text-xs text-slate-900">{qtyInCart} in Cart</span>
                                <button
                                  onClick={() => updateQuantity(`giftbox_${box.id}`, qtyInCart + 1)}
                                  className="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-black flex items-center justify-center cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addItem(`giftbox_${box.id}`, box.name, box.price, 0, boxImg)}
                                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Plus className="w-4 h-4" /> Add Box
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Single Crackers Catalog Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-orange-600" /> Crackers Catalog ({filteredProducts.length})
                  </h3>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                    No products matched your search keyword or selected category tab.
                  </div>
                ) : viewMode === 'grid' ? (
                  /* GRID VIEW WITH PRODUCT IMAGES */
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredProducts.map((p) => {
                      const qtyInCart = getItemQuantity(p.id);
                      const finalPrice = p.price * (1 - (p.discount || 0) / 100);
                      const isJustAdded = addedAnimationId === p.id;
                      const imgUrl = getProductImage(p.image_url);

                      return (
                        <div
                          key={p.id}
                          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 relative overflow-hidden ${
                            qtyInCart > 0
                              ? 'bg-amber-50/90 border-amber-400 shadow-sm'
                              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                          } ${isJustAdded ? 'ring-2 ring-amber-500 scale-[1.02]' : ''}`}
                        >
                          {p.discount > 0 && (
                            <span className="absolute top-2.5 right-2.5 z-10 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-2xs">
                              {p.discount}% OFF
                            </span>
                          )}

                          {/* Product Image Thumbnail */}
                          <div className="relative w-full h-24 sm:h-28 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                            <SafeProductImage
                              src={imgUrl}
                              alt={p.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover transition-transform hover:scale-105"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="font-bold text-slate-900 text-xs block line-clamp-2 leading-tight">
                              {p.name}
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-black text-amber-600 text-sm">{formatCurrency(finalPrice)}</span>
                              {p.discount > 0 && (
                                <span className="text-[10px] text-slate-400 line-through">{formatCurrency(p.price)}</span>
                              )}
                            </div>
                          </div>

                          <div>
                            {qtyInCart > 0 ? (
                              <div className="flex items-center justify-between bg-white px-1.5 py-1 rounded-xl border border-amber-300 shadow-2xs">
                                <button
                                  onClick={() => updateQuantity(p.id, qtyInCart - 1)}
                                  className="w-6 h-6 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-black text-xs flex items-center justify-center cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-black text-xs text-slate-900">{qtyInCart}</span>
                                <button
                                  onClick={() => updateQuantity(p.id, qtyInCart + 1)}
                                  className="w-6 h-6 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-black text-xs flex items-center justify-center cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addItem(p.id, p.name, p.price, p.discount || 0, imgUrl)}
                                className="w-full py-1.5 px-3 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* HIGH SPEED DENSE LIST VIEW WITH THUMBNAIL */
                  <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs shadow-2xs">
                    {filteredProducts.map((p) => {
                      const qtyInCart = getItemQuantity(p.id);
                      const finalPrice = p.price * (1 - (p.discount || 0) / 100);
                      const imgUrl = getProductImage(p.image_url);

                      return (
                        <div
                          key={p.id}
                          className={`p-3 flex items-center justify-between gap-3 transition-colors ${
                            qtyInCart > 0 ? 'bg-amber-50/80' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Small List Thumbnail */}
                            <div className="relative w-10 h-10 rounded-lg bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                              <SafeProductImage
                                src={imgUrl}
                                alt={p.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-slate-900 text-xs block truncate">{p.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-amber-600">{formatCurrency(finalPrice)}</span>
                                {p.discount > 0 && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                                    {p.discount}% OFF
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {qtyInCart > 0 ? (
                              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-amber-300 shadow-2xs">
                                <button
                                  onClick={() => updateQuantity(p.id, qtyInCart - 1)}
                                  className="w-6 h-6 rounded bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-black text-xs text-slate-900 w-6 text-center">{qtyInCart}</span>
                                <button
                                  onClick={() => updateQuantity(p.id, qtyInCart + 1)}
                                  className="w-6 h-6 rounded bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addItem(p.id, p.name, p.price, p.discount || 0, imgUrl)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </section>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: LIVE TICKET / CART & FAST CHECKOUT (30% Width Desktop)     */}
          {/* ========================================================================= */}
          <aside className="w-full md:w-96 lg:w-[420px] flex flex-col bg-white border-t md:border-t-0 md:border-l border-slate-200/90 overflow-hidden shrink-0 shadow-xs">
            
            {/* TICKET HEADER: Order ID, Hold & Clear Actions */}
            <div className="p-4 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-600" />
                <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                  Live Ticket ({lineItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={holdCurrentBill}
                  disabled={lineItems.length === 0}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-amber-500 hover:text-white disabled:opacity-40 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Hold current ticket (F8)"
                >
                  <PauseCircle className="w-3.5 h-3.5" /> Hold
                </button>

                <button
                  onClick={clearCart}
                  disabled={lineItems.length === 0}
                  className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Clear Ticket (Esc)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE LINE ITEMS LIST */}
            <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100 text-xs">
              {lineItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <span className="font-black text-slate-700 block text-xs">Live Ticket is Empty</span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Click products from catalog or search items to add to bill.
                    </span>
                  </div>
                </div>
              ) : (
                lineItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900 text-xs block truncate">{item.name}</span>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span>{formatCurrency(item.finalPrice)}</span>
                        <span>× {item.quantity}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 font-black text-amber-700 flex items-center justify-center hover:bg-slate-200 rounded-l cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-slate-900 text-[11px]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 font-black text-amber-700 flex items-center justify-center hover:bg-slate-200 rounded-r cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono font-black text-amber-600 text-xs w-16 text-right">
                        {formatCurrency(item.finalPrice * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* LIVE TICKET FOOTER: Subtotal & Big Proceed to Checkout Button */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-3 shrink-0 text-xs">
              
              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({lineItems.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(rawSubtotal)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1 border-t border-slate-100">
                  <span className="font-black text-slate-900 text-xs uppercase tracking-wider">Estimated Total:</span>
                  <span className="font-mono font-black text-2xl text-amber-600">
                    {formatCurrency(rawSubtotal)}
                  </span>
                </div>
              </div>

              {/* PROCEED TO CHECKOUT BUTTON */}
              <button
                type="button"
                disabled={lineItems.length === 0}
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-40"
              >
                <span>Proceed to Payment & Checkout (F9)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </aside>

        </div>
      )}

      {/* ─── MODAL 1: HELD BILLS BUFFER MODAL ─── */}
      {showHeldBillsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PauseCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-base text-slate-900">Held Bills Buffer ({heldBills.length})</h3>
              </div>
              <button
                onClick={() => setShowHeldBillsModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {heldBills.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No tickets currently on hold.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {heldBills.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-600 text-xs">{b.id}</span>
                        <span className="text-slate-500 text-[10px]">Held at {b.timestamp}</span>
                      </div>
                      <span className="font-bold text-slate-900 text-xs block">{b.customerName} ({b.phone})</span>
                      <span className="text-slate-500 text-[11px] block">
                        {b.items.reduce((acc, i) => acc + i.quantity, 0)} Items • Total: {formatCurrency(b.items.reduce((acc, i) => acc + i.finalPrice * i.quantity, 0))}
                      </span>
                    </div>

                    <button
                      onClick={() => restoreHeldBill(b)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                    >
                      <PlayCircle className="w-4 h-4" /> Resume Bill
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHeldBillsModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── MODAL 2: THERMAL RECEIPT VIEW MODAL ─── */}
      {showThermalModal && lastSavedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-base text-slate-900">80mm Thermal Receipt View</h3>
              </div>
              <button
                onClick={() => setShowThermalModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 80mm Receipt Paper Styling */}
            <div className="bg-slate-50 text-slate-900 p-6 rounded-2xl font-mono text-[11px] leading-tight space-y-3 shadow-inner max-h-[60vh] overflow-y-auto border border-slate-200">
              
              <div className="text-center space-y-1">
                <span className="font-black text-sm block">SRI ARUMUGAM PYRO PARK</span>
                <span className="text-[10px] text-slate-600 block">Sivakasi Direct Factory Outlet</span>
                <span className="text-[9px] text-slate-500 block">Ph: +91 8682913516 | GSTIN: 33AAAAA0000A1Z5</span>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-1 space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span>INV: #{lastSavedOrder.orderId.slice(-8).toUpperCase()}</span>
                  <span>DATE: {lastSavedOrder.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>CUST: {lastSavedOrder.customerName}</span>
                  <span>MOB: {lastSavedOrder.phone}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold border-b border-slate-300 pb-1 text-[10px]">
                  <span>ITEM</span>
                  <span>QTY × PRICE = TOTAL</span>
                </div>
                {lastSavedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[10px]">
                    <span className="truncate max-w-[160px]">{item.name}</span>
                    <span>{item.quantity} × {item.finalPrice} = ₹{item.quantity * item.finalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>INR {lastSavedOrder.subtotal.toFixed(2)}</span>
                </div>
                {lastSavedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>- INR {lastSavedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                {lastSavedOrder.gstAmount > 0 && (
                  <div className="flex justify-between">
                    <span>GST Tax:</span>
                    <span>+ INR {lastSavedOrder.gstAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-xs border-t border-slate-900 pt-1">
                  <span>TOTAL:</span>
                  <span>INR {lastSavedOrder.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-600">
                  <span>PAYMENT MODE:</span>
                  <span>{lastSavedOrder.paymentMode.toUpperCase()}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[9px] text-slate-500 italic">
                *** Thank You for Shopping with Us! ***
              </div>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generatePdfInvoice(lastSavedOrder.orderId)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-600" /> PDF
                </button>

                {(() => {
                  const cleanPhone = lastSavedOrder.phone.replace(/\D/g, '');
                  const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                  const itemsList = lastSavedOrder.items.map((i) => `• ${i.name} (${i.quantity} qty)`).join('\n');
                  const msgText = `Dear ${lastSavedOrder.customerName},

Thank you for purchasing from Sri Arumugam Pyro Park Sivakasi! 🎆✨

🧾 Invoice No: #${lastSavedOrder.orderId.slice(-8).toUpperCase()}
💰 Total Amount Paid: ${formatCurrency(lastSavedOrder.grandTotal)}
💳 Payment Mode: ${lastSavedOrder.paymentMode.toUpperCase()}

Items Purchased:
${itemsList}

Thank you for shopping with our Sivakasi Direct Factory Outlet!
📞 Contact: +91 8682913516 / 6374041238`;

                  const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msgText)}`;

                  return (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-105"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white" /> WhatsApp
                    </a>
                  );
                })()}
              </div>

              <button
                onClick={() => setShowThermalModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl cursor-pointer shadow-2xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
