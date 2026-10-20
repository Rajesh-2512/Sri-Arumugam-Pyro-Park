'use client';

import { useState, useMemo } from 'react';
import type { Order, OrderItem, OrderStatus } from '@/types/order';
import type { Product } from '@/types/product';
import type { GiftBox } from '@/types/giftbox';
import { deleteOrder, updateOrderStatus } from '@/services/order.actions';
import { formatCurrency } from '@/lib/utils';
import { calculateFinalPrice } from '@/lib/discount';
import { Phone, MapPin, MessageSquare, Check, Clock, Truck, CheckCircle2, XCircle, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw, X, Eye, Package, ChevronDown, Download, DollarSign, Edit2, FileText, Receipt, AlertCircle, Trash2, Plus, Minus, Percent, CreditCard } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { generateInvoicePDF, generateGSTInvoicePDF } from '@/lib/invoicePdfGenerator';
import { createGstAuditBill } from '@/services/gst-bill.actions';
import { updateAdminBillingOrder, type BillingOrderItem } from '@/services/billing.actions';

const statusOptions: { value: OrderStatus; label: string; icon: any; color: string }[] = [
  { value: 'pending', label: 'Pending Review', icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'confirmed', label: 'Confirmed', icon: Check, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { value: 'processing', label: 'Processing Pack', icon: Clock, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { value: 'dispatched', label: 'Dispatched', icon: Truck, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-700 bg-red-50 border-red-200' },
  { value: 'refunded', label: 'Refunded', icon: RotateCcw, color: 'text-rose-700 bg-rose-50 border-rose-200' },
];

interface CustomStatusDropdownProps {
  orderId: string;
  currentStatus: OrderStatus;
  disabled: boolean;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

function CustomStatusDropdown({ orderId, currentStatus, disabled, onStatusChange }: CustomStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const currentObj = statusOptions.find((s) => s.value === currentStatus) || statusOptions[0];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase border flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs whitespace-nowrap ${currentObj.color}`}
      >
        <span className="whitespace-nowrap">{currentObj.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* Backdrop overlay to close dropdown */}
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />

          {/* Floating Options Menu */}
          <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-30 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            {statusOptions.map((opt) => {
              const isSelected = opt.value === currentStatus;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onStatusChange(orderId, opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${opt.color} ${
                    isSelected ? 'ring-2 ring-slate-900/10 shadow-xs' : 'opacity-85 hover:opacity-100 hover:scale-[1.02]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {opt.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-slate-800" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Helper to format WhatsApp Thank You message template
function getWhatsAppThankYouLink(order: Order) {
  const shortId = order.id.split('-')[0].toUpperCase();
  const itemsSummary = order.order_items && order.order_items.length > 0
    ? order.order_items.map((i) => `• ${i.product_name} (${i.quantity} qty)`).join('\n')
    : '';

  const text = `Dear ${order.customer_name},

Thank you for your purchase with Sri Arumugam Pyro Park Sivakasi! 🎆✨

🧾 Order ID: #${shortId}
💰 Total Amount: ${formatCurrency(order.total_amount)}
🚚 Status: ${order.status.toUpperCase()}

${itemsSummary ? `Ordered Items:\n${itemsSummary}\n\n` : ''}Thank you for trusting our Sivakasi Direct Factory Outlet! We truly appreciate your order.

Warm regards,
Sri Arumugam Pyro Park
📞 Contact: +91 8682913516 / 6374041238`;

  const cleanPhone = order.phone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
}

interface OrderManagerProps {
  orders: Order[];
  products?: Product[];
  giftBoxes?: GiftBox[];
}

export default function OrderManager({ orders, products = [], giftBoxes = [] }: OrderManagerProps) {
  const [visibleOrders, setVisibleOrders] = useState<Order[]>(orders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [editingProducts, setEditingProducts] = useState(false);
  const [editedItems, setEditedItems] = useState<OrderItem[]>([]);
  const [savingProducts, setSavingProducts] = useState(false);
  const [editedInvoiceNumber, setEditedInvoiceNumber] = useState('');
  const [editedPaidAmount, setEditedPaidAmount] = useState('');
  const [editedDiscountPercent, setEditedDiscountPercent] = useState<number>(0);
  const [editedExtraDiscount, setEditedExtraDiscount] = useState<string>('0');

  // Search & Catalog Adder in Edit Modal
  const [catalogSearch, setCatalogSearch] = useState('');
  const [showCatalogPicker, setShowCatalogPicker] = useState(false);
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemQty, setCustomItemQty] = useState('1');

  // GST Audit Bill Generator Modal State
  const [gstModalOrder, setGstModalOrder] = useState<Order | null>(null);
  const [gstCustName, setGstCustName] = useState('');
  const [gstPhone, setGstPhone] = useState('');
  const [gstAddress, setGstAddress] = useState('');
  const [gstCity, setGstCity] = useState('');
  const [gstPincode, setGstPincode] = useState('');
  const [gstState, setGstState] = useState('Tamil Nadu');
  const [gstAadhar, setGstAadhar] = useState('');
  const [gstParticulars, setGstParticulars] = useState('Assorted Crackers Variety Pack (HSN 3604)');
  const [gstTotalAmount, setGstTotalAmount] = useState<string>('');
  const [gstMode, setGstMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [gstRate, setGstRate] = useState<number>(18);
  const [generatingGst, setGeneratingGst] = useState(false);

  // Search & Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Live calculations for Edit Mode
  const editedSubtotal = useMemo(() => {
    return editedItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  }, [editedItems]);

  const editedDiscountAmount = useMemo(() => {
    return Math.round(((editedSubtotal * editedDiscountPercent) / 100) * 100) / 100;
  }, [editedSubtotal, editedDiscountPercent]);

  const editedExtraDiscountAmount = useMemo(() => {
    const val = parseFloat(editedExtraDiscount);
    return isNaN(val) || val < 0 ? 0 : val;
  }, [editedExtraDiscount]);

  const editedTotalAmount = useMemo(() => {
    return Math.max(0, Math.round((editedSubtotal - editedDiscountAmount - editedExtraDiscountAmount) * 100) / 100);
  }, [editedSubtotal, editedDiscountAmount, editedExtraDiscountAmount]);

  const filteredCatalogItems = useMemo(() => {
    if (!catalogSearch.trim()) return [];
    const q = catalogSearch.toLowerCase().trim();
    const matchedProducts = products
      .filter((p) => p.name.toLowerCase().includes(q) || (p.categories?.name && p.categories.name.toLowerCase().includes(q)))
      .slice(0, 8)
      .map((p) => ({ ...p, isCombo: false }));
    const matchedCombos = giftBoxes
      .filter((b) => b.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((b) => ({ ...b, isCombo: true }));
    return [...matchedProducts, ...matchedCombos];
  }, [catalogSearch, products, giftBoxes]);

  const openOrderItems = (order: Order, edit = false) => {
    setSelectedOrderForModal(order);
    const items = order.order_items ? [...order.order_items] : [];
    setEditedItems(items);
    setEditingProducts(edit);
    setEditedInvoiceNumber(order.invoice_number || order.id.split('-')[0].toUpperCase());
    const breakdown = getOrderPaymentBreakdown(order);
    setEditedPaidAmount(breakdown.paidAmount.toString());

    // Parse discount & extra discount from notes or calculate
    let initDiscountPct = 0;
    let initExtraDisc = 0;
    if (order.notes) {
      const pctMatch = order.notes.match(/Discount:\s*([\d.]+)%/i);
      if (pctMatch && pctMatch[1]) initDiscountPct = parseFloat(pctMatch[1]) || 0;

      const extraMatch = order.notes.match(/Extra Discount:\s*₹?\s*([\d.]+)/i);
      if (extraMatch && extraMatch[1]) initExtraDisc = parseFloat(extraMatch[1]) || 0;
    }

    const itemsSubtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    if (initDiscountPct === 0 && initExtraDisc === 0 && itemsSubtotal > order.total_amount) {
      const diff = itemsSubtotal - order.total_amount;
      initDiscountPct = Math.round((diff / itemsSubtotal) * 100);
    }

    setEditedDiscountPercent(initDiscountPct);
    setEditedExtraDiscount(initExtraDisc.toString());
    setCatalogSearch('');
    setShowCatalogPicker(false);
    setShowCustomItemForm(false);
  };

  const closeOrderItems = () => {
    setSelectedOrderForModal(null);
    setEditingProducts(false);
    setEditedItems([]);
    setShowCatalogPicker(false);
    setShowCustomItemForm(false);
  };

  const removeEditedItem = (index: number) => {
    setEditedItems((items) => items.filter((_, idx) => idx !== index));
  };

  const updateEditedQuantity = (index: number, quantity: number) => {
    setEditedItems((items) => items.map((item, idx) => (
      idx === index ? { ...item, quantity: Math.max(1, quantity) } : item
    )));
  };

  const updateEditedPrice = (index: number, price: number) => {
    setEditedItems((items) => items.map((item, idx) => (
      idx === index ? { ...item, price: Math.max(0, price) } : item
    )));
  };

  const updateEditedName = (index: number, name: string) => {
    setEditedItems((items) => items.map((item, idx) => (
      idx === index ? { ...item, product_name: name } : item
    )));
  };

  const addCatalogProductToOrder = (item: Product | GiftBox, isCombo = false) => {
    const finalPrice = isCombo
      ? (item as GiftBox).price
      : calculateFinalPrice((item as Product).price, (item as Product).discount || 0);
    const existingIndex = editedItems.findIndex((i) => i.product_id === item.id || i.product_name === item.name);
    if (existingIndex >= 0) {
      setEditedItems((items) => items.map((i, idx) => (
        idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i
      )));
    } else {
      const newItem: OrderItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        order_id: selectedOrderForModal?.id || '',
        product_id: item.id,
        product_name: isCombo ? `${item.name} Combo` : item.name,
        quantity: 1,
        price: finalPrice,
        created_at: new Date().toISOString(),
      };
      setEditedItems((items) => [...items, newItem]);
    }
  };

  const addCustomItemToOrder = () => {
    const name = customItemName.trim();
    const price = parseFloat(customItemPrice);
    const qty = parseInt(customItemQty, 10);
    if (!name) {
      alert('Please enter a product name');
      return;
    }
    if (isNaN(price) || price < 0) {
      alert('Please enter a valid unit price');
      return;
    }
    const safeQty = isNaN(qty) || qty < 1 ? 1 : qty;
    const newItem: OrderItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      order_id: selectedOrderForModal?.id || '',
      product_id: null,
      product_name: name,
      quantity: safeQty,
      price: price,
      created_at: new Date().toISOString(),
    };
    setEditedItems((items) => [...items, newItem]);
    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemQty('1');
    setShowCustomItemForm(false);
  };

  const handleSaveOrderEdits = async () => {
    if (!selectedOrderForModal) return;

    const invoiceNumber = editedInvoiceNumber.trim();
    const paidAmount = Number(editedPaidAmount);

    if (!invoiceNumber) {
      alert('Invoice number cannot be empty.');
      return;
    }
    if (!Number.isFinite(paidAmount) || paidAmount < 0) {
      alert('Please enter a valid paid amount.');
      return;
    }
    if (editedItems.length === 0) {
      alert('At least one product must remain on the order.');
      return;
    }

    setSavingProducts(true);

    const itemsSubtotal = editedItems.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    const percentDiscountAmt = Math.round(((itemsSubtotal * editedDiscountPercent) / 100) * 100) / 100;
    const extraDiscountAmt = Math.max(0, parseFloat(editedExtraDiscount) || 0);
    const totalDiscountAmt = percentDiscountAmt + extraDiscountAmt;
    const finalTotalAmount = Math.max(0, Math.round((itemsSubtotal - totalDiscountAmt) * 100) / 100);

    const items: BillingOrderItem[] = editedItems.map((item) => ({
      id: item.product_id || item.id || `order_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: item.product_name,
      price: Number(item.price) || 0,
      discount: 0,
      finalPrice: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));

    // Keep non-audit base notes and append clean audit note
    const baseNotes = (selectedOrderForModal.notes || '')
      .replace(/\[(?:POS BILLING|Order Edited|Edited)\].*$/i, '')
      .trim();
    const remainingAmount = Math.max(0, finalTotalAmount - paidAmount);
    const auditNote = `[Order Edited] Discount: ${editedDiscountPercent}% | Extra Discount: ₹${extraDiscountAmt} | Paid: ₹${paidAmount} | Remaining: ₹${remainingAmount}`;
    const newNotes = baseNotes ? `${baseNotes} | ${auditNote}` : auditNote;

    const result = await updateAdminBillingOrder({
      orderId: selectedOrderForModal.id,
      totalAmount: finalTotalAmount,
      paidAmount,
      invoiceNumber,
      items,
      notes: newNotes,
    });
    setSavingProducts(false);

    if (!result.success) {
      alert(result.error || 'Failed to update order products.');
      return;
    }

    const updatedOrder: Order = {
      ...selectedOrderForModal,
      invoice_number: invoiceNumber,
      total_amount: finalTotalAmount,
      paid_amount: paidAmount,
      remaining_amount: remainingAmount,
      notes: newNotes,
      order_items: editedItems.map((item) => ({
        ...item,
        order_id: selectedOrderForModal.id,
      })),
    };

    setVisibleOrders((currentOrders) => currentOrders.map((order) => (
      order.id === updatedOrder.id ? updatedOrder : order
    )));
    setSelectedOrderForModal(updatedOrder);
    setEditingProducts(false);
  };

  const openGstModal = (order: Order) => {
    setGstModalOrder(order);
    setGstCustName(order.customer_name || 'Walk-in Counter Buyer');
    setGstPhone(order.phone || '9999999999');
    setGstAddress(order.address || 'In-Store Counter');
    setGstCity(order.city || 'Sivakasi');
    setGstPincode(order.pincode || '626123');

    const pin = (order.pincode || '').trim();
    const isTN = !pin.startsWith('605') && /^6[0-4]\d{4}$/.test(pin);
    setGstState(isTN ? 'Tamil Nadu' : 'Inter-State Transport');

    const aadharVal = order.aadhar_pan || order.notes?.match(/Aadhar\/PAN:\s*([^\s|]+)/)?.[1] || '';
    setGstAadhar(aadharVal);

    setGstParticulars('Assorted Crackers Variety Pack (HSN 3604)');
    setGstTotalAmount(order.total_amount.toString());
    setGstMode('exclusive');
    setGstRate(18);
  };

  const handleGenerateCustomGstBill = async () => {
    if (!gstModalOrder) return;
    const inputVal = parseFloat(gstTotalAmount);
    if (isNaN(inputVal) || inputVal <= 0) {
      alert('Please enter a valid GST bill amount.');
      return;
    }

    if (!gstAadhar.trim()) {
      alert('Customer Aadhar / PAN / GSTIN No. is required for GST Bill.');
      return;
    }

    setGeneratingGst(true);

    let taxableAmt = 0;
    let gstAmt = 0;
    let grandTotalAmt = 0;

    if (gstMode === 'exclusive') {
      taxableAmt = Math.round(inputVal * 100) / 100;
      gstAmt = Math.round((taxableAmt * (gstRate / 100)) * 100) / 100;
      grandTotalAmt = Math.round((taxableAmt + gstAmt) * 100) / 100;
    } else {
      grandTotalAmt = Math.round(inputVal * 100) / 100;
      taxableAmt = Math.round((grandTotalAmt / (1 + gstRate / 100)) * 100) / 100;
      gstAmt = Math.round((grandTotalAmt - taxableAmt) * 100) / 100;
    }

    const pin = (gstPincode || '').trim();
    const isTN = gstState.toLowerCase().includes('tamil') || (!pin.startsWith('605') && /^6[0-4]\d{4}$/.test(pin));
    const cgstVal = isTN ? Math.round((gstAmt / 2) * 100) / 100 : 0;
    const sgstVal = isTN ? Math.round((gstAmt / 2) * 100) / 100 : 0;
    const igstVal = !isTN ? gstAmt : 0;

    const customData = {
      order_id: gstModalOrder.id,
      customer_name: gstCustName,
      phone: gstPhone,
      address: gstAddress,
      city: gstCity,
      pincode: gstPincode,
      state: gstState,
      gstin_aadhar: gstAadhar,
      particulars: gstParticulars,
      amount: taxableAmt,
      total_amount: grandTotalAmt,
      gst_rate: gstRate,
      gst_mode: gstMode,
    };

    // Save GST bill record to database for audit trail
    const res = await createGstAuditBill(customData);
    const billNumber = res.data?.bill_number;

    // Generate & download PDF invoice
    await generateGSTInvoicePDF(
      {
        ...gstModalOrder,
        customer_name: gstCustName,
        phone: gstPhone,
        address: gstAddress,
        city: gstCity,
        pincode: gstPincode,
        total_amount: grandTotalAmt,
        order_items: gstModalOrder.order_items || [],
      },
      true,
      {
        billNumber: billNumber,
        customerName: gstCustName,
        phone: gstPhone,
        address: gstAddress,
        city: gstCity,
        pincode: gstPincode,
        state: gstState,
        gstinAadhar: gstAadhar,
        particulars: gstParticulars,
        totalAmount: grandTotalAmt,
        taxableAmount: taxableAmt,
        gstAmount: gstAmt,
        cgst: cgstVal,
        sgst: sgstVal,
        igst: igstVal,
        gstRate,
        gstMode,
      }
    );

    setGeneratingGst(false);
    setGstModalOrder(null);
  };

  const getOrderPaymentBreakdown = (order: Order) => {
    let paid: number | null = null;
    let remaining: number | null = null;

    if (order.remaining_amount !== undefined && order.remaining_amount !== null) {
      remaining = Number(order.remaining_amount);
    }
    if (order.paid_amount !== undefined && order.paid_amount !== null) {
      paid = Number(order.paid_amount);
      if (remaining === null) {
        remaining = Math.max(0, order.total_amount - paid);
      }
    }

    // Fallback to parsing order.notes if database fields were null/empty
    if (order.notes) {
      const remMatch = order.notes.match(/Remaining:\s*₹?\s*([\d.]+)/i);
      const paidMatch = order.notes.match(/Paid:\s*₹?\s*([\d.]+)/i);

      if (remMatch && remMatch[1]) {
        const parsedRem = parseFloat(remMatch[1]);
        if (!isNaN(parsedRem)) {
          remaining = parsedRem;
        }
      }
      if (paidMatch && paidMatch[1]) {
        const parsedPaid = parseFloat(paidMatch[1]);
        if (!isNaN(parsedPaid)) {
          paid = parsedPaid;
          if (remaining === null) {
            remaining = Math.max(0, order.total_amount - paid);
          }
        }
      }
    }

    const finalRemaining = remaining !== null ? remaining : 0;
    const finalPaid = paid !== null ? paid : Math.max(0, order.total_amount - finalRemaining);

    return {
      paidAmount: finalPaid,
      remainingAmount: finalRemaining,
      isPending: finalRemaining > 0,
    };
  };

  const triggerOrderInvoicePDF = (order: Order) => {
    const items = order.order_items || [];
    const itemsSubtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

    let discountPercent = 0;
    let extraDiscount = 0;

    if (order.notes) {
      const pctMatch = order.notes.match(/Discount[:\s]*([\d.]+)%/i)
        || order.notes.match(/([\d.]+)%\s*Discount/i)
        || order.notes.match(/Discount[:\s]*(\d+)(?!\d|\.)/i);
      if (pctMatch && pctMatch[1]) discountPercent = parseFloat(pctMatch[1]) || 0;

      const extraMatch = order.notes.match(/Extra\s*(?:Amount\s*)?Discount[:\s]*(?:Rs\.?|₹)?\s*([\d.]+)/i);
      if (extraMatch && extraMatch[1]) extraDiscount = parseFloat(extraMatch[1]) || 0;
    }

    let discountAmount = 0;
    if (discountPercent > 0) {
      discountAmount = Math.round(((itemsSubtotal * discountPercent) / 100) * 100) / 100;
    } else if (itemsSubtotal > (order.total_amount + extraDiscount)) {
      discountAmount = Math.max(0, Math.round((itemsSubtotal - (order.total_amount + extraDiscount)) * 100) / 100);
      if (itemsSubtotal > 0) {
        discountPercent = Math.round((discountAmount / itemsSubtotal) * 100);
      }
    } else if (itemsSubtotal > order.total_amount) {
      discountAmount = Math.max(0, Math.round((itemsSubtotal - order.total_amount) * 100) / 100);
      if (itemsSubtotal > 0) {
        discountPercent = Math.round((discountAmount / itemsSubtotal) * 100);
      }
    }

    const breakdown = getOrderPaymentBreakdown(order);

    const pdfOrderData = {
      ...order,
      subtotal: itemsSubtotal > 0 ? itemsSubtotal : order.total_amount,
      discount_percent: discountPercent,
      discount_amount: discountAmount,
      extra_discount: extraDiscount,
      total_amount: order.total_amount,
      paid_amount: breakdown.paidAmount,
      remaining_amount: breakdown.remainingAmount,
      order_items: items.map((item) => ({
        ...item,
        original_price: item.price,
        final_price: item.price,
      })),
    };

    generateInvoicePDF(pdfOrderData as any, true);
  };

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const filteredOrders = useMemo(() => {
    return visibleOrders
      .filter((o) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          !searchQuery ||
          o.customer_name.toLowerCase().includes(query) ||
          o.phone.includes(query) ||
          o.id.toLowerCase().includes(query) ||
          o.city.toLowerCase().includes(query) ||
          o.address.toLowerCase().includes(query);

        const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;
        let valA: any = a[sortColumn as keyof Order];
        let valB: any = b[sortColumn as keyof Order];

        if (sortColumn === 'created_at') {
          valA = new Date(a.created_at).getTime();
          valB = new Date(b.created_at).getTime();
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = (valB || '').toString().toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [visibleOrders, searchQuery, selectedStatus, sortColumn, sortDirection]);

  const renderSortIcon = (col: string) => {
    if (sortColumn !== col) return <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-600 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-600 font-bold" />
    );
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatus(orderId, status);
    setUpdatingId(null);
    if (!res.success) {
      alert('Failed to update status: ' + res.error);
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    const invoiceNumber = order.invoice_number || order.id.split('-')[0].toUpperCase();
    if (!confirm(`Permanently delete order #${invoiceNumber}? Any linked GST audit bills will be retained.`)) return;

    setDeletingOrderId(order.id);
    const result = await deleteOrder(order.id);
    setDeletingOrderId(null);

    if (!result.success) {
      alert('Failed to delete order: ' + result.error);
      return;
    }

    setVisibleOrders((currentOrders) => currentOrders.filter((currentOrder) => currentOrder.id !== order.id));
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto w-full pb-10">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders Management</h1>
        <p className="text-xs text-slate-500 font-medium">Manage placed customer orders, update tracking status, and share WhatsApp thank you messages</p>
      </div>

      {/* Top Filter & Search Controls Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, order ID, or city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        {(searchQuery || selectedStatus !== 'all' || sortColumn) && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedStatus('all'); setSortColumn(null); }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-bold px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}

        <span className="ml-auto text-slate-400 text-[11px] font-bold">
          Showing {filteredOrders.length} of {visibleOrders.length} orders
        </span>
      </div>

      {/* Orders Table View with Clickable Sort Headers */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 relative">
            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200/80 shadow-2xs">
              <tr>
                <th
                  onClick={() => handleSort('created_at')}
                  className="py-3 px-3.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none min-w-[130px]"
                >
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span>Order ID & Date</span>
                    {renderSortIcon('created_at')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('customer_name')}
                  className="py-3 px-3.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none min-w-[170px]"
                >
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span>Customer & Contact</span>
                    {renderSortIcon('customer_name')}
                  </div>
                </th>
                <th className="py-3 px-3.5 bg-slate-50 min-w-[180px] whitespace-nowrap">Delivery Address</th>
                <th className="py-3 px-3.5 bg-slate-50 min-w-[115px] whitespace-nowrap">Items List</th>
                <th
                  onClick={() => handleSort('total_amount')}
                  className="py-3 px-3.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none min-w-[130px]"
                >
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span>Payment & Balance</span>
                    {renderSortIcon('total_amount')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3.5 px-3.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none min-w-[135px]"
                >
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span>Order Status</span>
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th className="py-3 px-3.5 pr-6 text-right bg-slate-50 min-w-[155px] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const shortId = order.invoice_number || order.id.split('-')[0].toUpperCase();
                  const totalItemsCount = (order.order_items && order.order_items.length > 0)
                    ? order.order_items.reduce((sum, item) => sum + item.quantity, 0)
                    : 1;

                  // Extract clean customer notes without raw POS metadata, redundant Aadhar, or buyer type tags
                  let cleanNotes = (order.notes || '')
                    .replace(/\[(?:POS BILLING|Order Edited|Edited)\].*$/i, '')
                    .replace(/Aadhar\/PAN:\s*[^\s|]+(?:\s*\|\s*)?/gi, '')
                    .replace(/Paid:\s*₹?\s*[\d.]+(?:\s*\|\s*)?/gi, '')
                    .replace(/Remaining:\s*₹?\s*[\d.]+(?:\s*\|\s*)?/gi, '')
                    .replace(/Discount:\s*[\d.]+%(?:\s*\|\s*)?/gi, '')
                    .replace(/Extra Discount:\s*₹?\s*[\d.]+(?:\s*\|\s*)?/gi, '')
                    .replace(/\|\s*retail\b/gi, '')
                    .replace(/\bretail\b/gi, '')
                    .replace(/\|\s*wholesale\b/gi, '')
                    .replace(/\bwholesale\b/gi, '')
                    .replace(/\|\s*walk-?in\b/gi, '')
                    .replace(/\bwalk-?in\b/gi, '')
                    .replace(/^[|,\s"'-]+|[|,\s"'-]+$/g, '')
                    .trim();

                  if (cleanNotes.length < 3) cleanNotes = '';

                  const aadharNum = order.aadhar_pan || order.notes?.match(/Aadhar\/PAN:\s*([^\s|]+)/)?.[1];

                  const formattedDate = new Date(order.created_at).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  });

                  const breakdown = getOrderPaymentBreakdown(order);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ORDER ID & DATE */}
                      <td className="py-3 px-3.5 align-middle">
                        <div className="space-y-0.5">
                          <span className="font-mono font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 inline-block text-xs shadow-2xs">
                            #{shortId}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 block whitespace-nowrap">
                            {formattedDate}
                          </span>
                        </div>
                      </td>

                      {/* CUSTOMER & CONTACT */}
                      <td className="py-3 px-3.5 align-middle">
                        <div className="space-y-1">
                          <span className="font-extrabold text-slate-900 text-xs block leading-tight">
                            {order.customer_name}
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <a
                              href={`tel:+91${order.phone}`}
                              className="inline-flex items-center gap-1 text-slate-700 hover:text-amber-700 font-bold text-[11px] bg-slate-100 hover:bg-amber-50 px-2 py-0.5 rounded-md border border-slate-200 hover:border-amber-200 transition-colors"
                              title="Call customer"
                            >
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{order.phone}</span>
                            </a>
                            {aadharNum && (
                              <span
                                className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200/90 px-1.5 py-0.5 rounded-md"
                                title="Customer Aadhar / PAN ID"
                              >
                                <CreditCard className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                <span>{aadharNum}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* DELIVERY ADDRESS */}
                      <td className="py-3 px-3.5 align-middle max-w-[220px]">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800 text-[11px] leading-snug line-clamp-2" title={order.address}>
                            {order.address}
                          </p>
                          <p className="text-slate-500 font-medium text-[10px] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>{order.city} - {order.pincode}</span>
                          </p>
                          {cleanNotes && (
                            <p className="text-amber-800 font-medium text-[10px] bg-amber-50 border border-amber-200/70 rounded px-1.5 py-0.5 inline-block leading-tight" title={cleanNotes}>
                              Note: &ldquo;{cleanNotes}&rdquo;
                            </p>
                          )}
                        </div>
                      </td>

                      {/* ITEMS LIST */}
                      <td className="py-3 px-3.5 align-middle">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openOrderItems(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-extrabold text-[11px] transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-95"
                            title="Click to view ordered products"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            <span>{totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openOrderItems(order, true)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 border border-slate-200 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                            title="Edit order products & price"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                          </button>
                        </div>
                      </td>

                      {/* PAYMENT & BALANCE */}
                      <td className="py-3 px-3.5 align-middle">
                        <div className="space-y-0.5">
                          <span className="font-black text-slate-900 text-xs block">
                            {formatCurrency(order.total_amount)}
                          </span>
                          {breakdown.isPending ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs whitespace-nowrap">
                              Pending: {formatCurrency(breakdown.remainingAmount)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs whitespace-nowrap">
                              Fully Paid
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ORDER STATUS */}
                      <td className="py-3 px-3.5 align-middle">
                        <CustomStatusDropdown
                          orderId={order.id}
                          currentStatus={order.status}
                          disabled={updatingId === order.id}
                          onStatusChange={handleStatusChange}
                        />
                      </td>

                      {/* DOWNLOAD BILL PDFs (Standard & GST Audit Bill) */}
                      <td className="py-3 px-3.5 pr-6 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => triggerOrderInvoicePDF(order)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-amber-500 text-slate-700 hover:text-white border border-slate-200 transition-all cursor-pointer hover:scale-105 active:scale-95 inline-flex items-center justify-center shrink-0 shadow-2xs"
                            title="Download Standard Customer PDF Receipt"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openGstModal(order)}
                            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95 inline-flex items-center gap-1 shrink-0"
                            title="Generate Formal 18% GST Tax Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-white" />
                            <span>GST Bill</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order)}
                            disabled={deletingOrderId === order.id}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center shrink-0 shadow-2xs"
                            title="Delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders found matching your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>

      {/* Separate Order Items Popup Modal Table */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className={`bg-white border border-slate-200 rounded-3xl w-full ${editingProducts ? 'max-w-5xl lg:max-w-6xl' : 'max-w-3xl'} shadow-2xl flex flex-col max-h-[94vh] overflow-hidden`}>
            
            {/* Modal Header (Fixed at top) */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-lg text-slate-900">
                      Order #{selectedOrderForModal.invoice_number || selectedOrderForModal.id.split('-')[0].toUpperCase()}
                    </h3>
                    {editingProducts ? (
                      <span className="text-[10px] uppercase tracking-wider font-black text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                        <Edit2 className="w-3 h-3 text-amber-700" />
                        <span>Full Edit Mode</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingProducts(true)}
                        className="text-[11px] font-extrabold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Edit2 className="w-3 h-3 text-amber-600" />
                        <span>Edit Order</span>
                      </button>
                    )}
                    <span className="text-xs text-slate-400 font-mono">
                      ({new Date(selectedOrderForModal.created_at).toLocaleString('en-IN')})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Customer: <strong className="text-slate-900">{selectedOrderForModal.customer_name}</strong> ({selectedOrderForModal.phone})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeOrderItems}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                title="Close Window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {editingProducts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/60">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Invoice Number</label>
                    <input
                      type="text"
                      maxLength={50}
                      value={editedInvoiceNumber}
                      onChange={(event) => setEditedInvoiceNumber(event.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-black uppercase text-slate-600">Paid Amount (₹)</label>
                      <button
                        type="button"
                        onClick={() => setEditedPaidAmount(editedTotalAmount.toString())}
                        className="text-[10px] font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                      >
                        Paid Full (₹{editedTotalAmount})
                      </button>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editedPaidAmount}
                      onChange={(event) => setEditedPaidAmount(event.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {/* Customer Details Summary Banner */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-bold text-slate-900">Delivery Address:</span>
                  <span className="text-slate-600">{selectedOrderForModal.address}, {selectedOrderForModal.city} - {selectedOrderForModal.pincode}</span>
                </p>
                {selectedOrderForModal.notes && (
                  <p className="text-amber-700 italic pl-5">Note: "{selectedOrderForModal.notes}"</p>
                )}
              </div>

              {/* Add Products to Order Toolbar in Edit Mode */}
              {editingProducts && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-amber-600" /> Add Products to Order
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCatalogPicker(!showCatalogPicker);
                          setShowCustomItemForm(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          showCatalogPicker ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400'
                        }`}
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>From Catalog</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomItemForm(!showCustomItemForm);
                          setShowCatalogPicker(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          showCustomItemForm ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Custom Item</span>
                      </button>
                    </div>
                  </div>

                  {/* Catalog Search & Dropdown Picker */}
                  {showCatalogPicker && (
                    <div className="pt-2 border-t border-slate-200/80 space-y-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search crackers, sparklers, gift boxes by name..."
                          value={catalogSearch}
                          onChange={(e) => setCatalogSearch(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                          autoFocus
                        />
                      </div>
                      {catalogSearch.trim() && (
                        <div className="max-h-48 overflow-y-auto bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-lg">
                          {filteredCatalogItems.length > 0 ? (
                            filteredCatalogItems.map((item: any) => {
                              const price = item.isCombo ? item.price : calculateFinalPrice(item);
                              return (
                                <div key={`${item.id}-${item.isCombo}`} className="flex items-center justify-between p-2.5 hover:bg-amber-50/50 transition-colors">
                                  <div>
                                    <p className="font-bold text-xs text-slate-900">{item.name}</p>
                                    <p className="text-[10px] text-slate-500">
                                      {item.isCombo ? 'Combo Box' : item.category_name || 'Crackers'} • Price: <strong className="text-amber-700">{formatCurrency(price)}</strong>
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => addCatalogProductToOrder(item, item.isCombo)}
                                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold cursor-pointer transition-transform active:scale-95 flex items-center gap-1"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add
                                  </button>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-3 text-center text-xs text-slate-400">No matching catalog items found</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Custom Item Form */}
                  {showCustomItemForm && (
                    <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Custom Product Name"
                          value={customItemName}
                          onChange={(e) => setCustomItemName(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Unit Price (₹)"
                          value={customItemPrice}
                          onChange={(e) => setCustomItemPrice(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={customItemQty}
                          onChange={(e) => setCustomItemQty(e.target.value)}
                          className="w-16 bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-center text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={addCustomItemToOrder}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-1.5 text-xs font-extrabold cursor-pointer whitespace-nowrap"
                        >
                          Add Item
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Order Items Table Card */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
                <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-600" />
                    Order Products ({editedItems.length} {editedItems.length === 1 ? 'item' : 'items'})
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Subtotal: <strong className="text-slate-900 font-mono">{formatCurrency(editingProducts ? editedSubtotal : selectedOrderForModal.total_amount)}</strong>
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-600 font-black uppercase tracking-wider border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">#</th>
                        <th className="py-2.5 px-3 min-w-[180px]">Item Name</th>
                        <th className="py-2.5 px-3 text-center min-w-[120px]">Unit Price</th>
                        <th className="py-2.5 px-3 text-center min-w-[140px]">Quantity</th>
                        <th className="py-2.5 px-3 text-right min-w-[110px]">Subtotal</th>
                        {editingProducts && <th className="py-2.5 px-3 text-center min-w-[110px]">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editedItems && editedItems.length > 0 ? (
                        editedItems.map((item, index) => (
                          <tr key={item.id || `${item.product_name}-${index}`} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                              {index + 1}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              {editingProducts ? (
                                <input
                                  type="text"
                                  value={item.product_name}
                                  onChange={(e) => updateEditedName(index, e.target.value)}
                                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-colors"
                                />
                              ) : (
                                item.product_name
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-600 font-medium">
                              {editingProducts ? (
                                <div className="flex items-center justify-center gap-1">
                                  <span className="text-[11px] font-bold text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={item.price}
                                    onChange={(e) => updateEditedPrice(index, Number(e.target.value))}
                                    className="w-24 border border-slate-200 rounded-lg px-2 py-1 text-center text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                                  />
                                </div>
                              ) : (
                                formatCurrency(item.price)
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-extrabold text-amber-700">
                              {editingProducts ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => updateEditedQuantity(index, item.quantity - 1)}
                                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer transition-colors"
                                    title="Decrease quantity"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(event) => updateEditedQuantity(index, Number(event.target.value))}
                                    className="w-14 border border-slate-200 rounded-lg px-1.5 py-1 text-center text-slate-900 font-bold text-xs bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateEditedQuantity(index, item.quantity + 1)}
                                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer transition-colors"
                                    title="Increase quantity"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="font-bold">× {item.quantity}</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900 whitespace-nowrap">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                            {editingProducts && (
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeEditedItem(index)}
                                  className="px-2.5 py-1 rounded-lg text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 font-bold text-[11px] cursor-pointer inline-flex items-center gap-1 transition-all shadow-2xs"
                                  title="Remove item from order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={editingProducts ? 6 : 5} className="py-8 text-center text-slate-400">
                            <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p className="font-medium text-xs">No items in this order.</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Use "From Catalog" or "Custom Item" above to add products.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Financial & Discount Breakdown in Edit Mode */}
              {editingProducts && (
                <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Items Subtotal:</span>
                    <span className="font-mono text-slate-900 text-sm">{formatCurrency(editedSubtotal)}</span>
                  </div>

                  {/* Percentage Discount */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5 text-amber-600" /> Percentage Discount:
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {editedDiscountPercent > 0 ? `- ${formatCurrency(editedDiscountAmount)} (${editedDiscountPercent}%)` : '₹0.00'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[0, 10, 15, 20, 25, 30, 40, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setEditedDiscountPercent(pct)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            editedDiscountPercent === pct
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-0.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editedDiscountPercent}
                          onChange={(e) => setEditedDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                          className="w-10 text-xs font-bold text-slate-900 text-center focus:outline-none"
                        />
                        <span className="text-xs text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Extra Flat Discount */}
                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-amber-200/60">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block">
                        Extra Flat Rupee Discount (₹):
                      </label>
                      <span className="text-[10px] text-slate-500">Negotiated / special counter discount</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-2xs">
                        <span className="text-xs font-bold text-slate-500">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={editedExtraDiscount}
                          onChange={(e) => setEditedExtraDiscount(e.target.value)}
                          placeholder="0"
                          className="w-24 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      {editedExtraDiscountAmount > 0 && (
                        <span className="text-xs font-mono font-bold text-emerald-700">
                          - {formatCurrency(editedExtraDiscountAmount)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financial Totals Row */}
                  <div className="pt-2 border-t border-amber-200 grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-xl p-2 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Order Total</span>
                      <span className="text-sm font-black text-slate-900">{formatCurrency(editedTotalAmount)}</span>
                    </div>
                    <div className="bg-white rounded-xl p-2 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Paid Amount</span>
                      <span className="text-sm font-black text-emerald-600">{formatCurrency(parseFloat(editedPaidAmount) || 0)}</span>
                    </div>
                    <div className="bg-white rounded-xl p-2 border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Balance Due</span>
                      <span className={`text-sm font-black ${Math.max(0, editedTotalAmount - (parseFloat(editedPaidAmount) || 0)) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {formatCurrency(Math.max(0, editedTotalAmount - (parseFloat(editedPaidAmount) || 0)))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Actions (Fixed at bottom, never cut off!) */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 shrink-0 gap-3 z-10">
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-black tracking-wider block">Total Amount</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600">
                  {formatCurrency(editingProducts ? editedTotalAmount : selectedOrderForModal.total_amount)}
                </span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap justify-end">
                {!editingProducts && (
                  <a
                    href={getWhatsAppThankYouLink(selectedOrderForModal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer hover:scale-102 flex items-center gap-1.5"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                )}

                {!editingProducts && (
                  <button
                    type="button"
                    onClick={() => triggerOrderInvoicePDF(selectedOrderForModal)}
                    className="bg-white hover:bg-amber-500 hover:text-white text-slate-800 border border-slate-200 font-extrabold px-3.5 py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Receipt PDF</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={editingProducts ? () => setEditingProducts(false) : closeOrderItems}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer hover:scale-102"
                >
                  {editingProducts ? 'Cancel Edit' : 'Close Window'}
                </button>

                {editingProducts && (
                  <button
                    type="button"
                    onClick={handleSaveOrderEdits}
                    disabled={savingProducts || editedItems.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 hover:scale-102 flex items-center gap-1.5"
                  >
                    {savingProducts ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Order Changes</span>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* GST Audit Bill Customization Modal */}
      {gstModalOrder && (() => {
        const inputVal = parseFloat(gstTotalAmount) || 0;
        let liveTaxable = 0;
        let liveGst = 0;
        let liveGrandTotal = 0;

        if (gstMode === 'exclusive') {
          liveTaxable = Math.round(inputVal * 100) / 100;
          liveGst = Math.round((liveTaxable * (gstRate / 100)) * 100) / 100;
          liveGrandTotal = Math.round((liveTaxable + liveGst) * 100) / 100;
        } else {
          liveGrandTotal = Math.round(inputVal * 100) / 100;
          liveTaxable = Math.round((liveGrandTotal / (1 + gstRate / 100)) * 100) / 100;
          liveGst = Math.round((liveGrandTotal - liveTaxable) * 100) / 100;
        }

        const pin = (gstPincode || '').trim();
        const isTN = gstState.toLowerCase().includes('tamil') || (!pin.startsWith('605') && /^6[0-4]\d{4}$/.test(pin));
        const liveCgst = isTN ? Math.round((liveGst / 2) * 100) / 100 : 0;
        const liveSgst = isTN ? Math.round((liveGst / 2) * 100) / 100 : 0;
        const liveIgst = !isTN ? liveGst : 0;

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto my-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                    <Receipt className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900">Generate GST Tax Invoice & Audit Bill</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Order #{gstModalOrder.invoice_number || gstModalOrder.id.split('-')[0].toUpperCase()} • Enter custom amount for GST tax invoice
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setGstModalOrder(null)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">Customer Name *</label>
                    <input
                      type="text"
                      value={gstCustName}
                      onChange={(e) => setGstCustName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">Mobile Phone *</label>
                    <input
                      type="text"
                      value={gstPhone}
                      onChange={(e) => setGstPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    value={gstAddress}
                    onChange={(e) => setGstAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">City *</label>
                    <input
                      type="text"
                      value={gstCity}
                      onChange={(e) => setGstCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={gstPincode}
                      onChange={(e) => setGstPincode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">State</label>
                    <select
                      value={gstState}
                      onChange={(e) => setGstState(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Tamil Nadu">Tamil Nadu (State Code 33)</option>
                      <option value="Inter-State Transport">Inter-State Transport (IGST)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1">Aadhar / PAN / GSTIN No. *</label>
                  <input
                    type="text"
                    required
                    value={gstAadhar}
                    onChange={(e) => setGstAadhar(e.target.value)}
                    placeholder="e.g. 33AAAAA0000A1Z5 or Aadhar / PAN No."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1">Item Particulars Description *</label>
                  <input
                    type="text"
                    value={gstParticulars}
                    onChange={(e) => setGstParticulars(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">GST Calculation Mode</label>
                    <select
                      value={gstMode}
                      onChange={(e) => setGstMode(e.target.value as 'exclusive' | 'inclusive')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="exclusive">Add GST on Top (Amount + GST)</option>
                      <option value="inclusive">GST Included in Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">GST Rate %</label>
                    <select
                      value={gstRate}
                      onChange={(e) => setGstRate(parseFloat(e.target.value) || 18)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value={18}>18% GST (Standard Fireworks Rate)</option>
                      <option value={12}>12% GST</option>
                      <option value={5}>5% GST</option>
                      <option value={28}>28% GST</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1">
                    {gstMode === 'exclusive' ? 'Taxable Amount (₹) [GST will be added on top] *' : 'Total Bill Amount (₹) [GST Included] *'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={gstTotalAmount}
                    onChange={(e) => setGstTotalAmount(e.target.value)}
                    className="w-full bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-base font-black text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Pre-filled with actual order amount ({formatCurrency(gstModalOrder.total_amount)}). You can edit this to any amount for audit filing.
                  </span>
                </div>

                {/* Real-time Tally Calculation Box */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800 shadow-md">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Taxable Subtotal Amount:</span>
                    <span className="font-mono font-bold text-white">{formatCurrency(liveTaxable)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">GST ({gstRate}% Total):</span>
                    <span className="font-mono font-bold text-amber-400">+ {formatCurrency(liveGst)}</span>
                  </div>
                  {isTN ? (
                    <div className="flex justify-between text-[11px] text-slate-400 pl-4 border-l-2 border-amber-500">
                      <span>CGST ({gstRate / 2}%): {formatCurrency(liveCgst)}</span>
                      <span>SGST ({gstRate / 2}%): {formatCurrency(liveSgst)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-[11px] text-slate-400 pl-4 border-l-2 border-amber-500">
                      <span>IGST ({gstRate}%): {formatCurrency(liveIgst)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-800 text-emerald-400">
                    <span>Grand Total ({gstMode === 'exclusive' ? 'Amount + GST' : 'Incl. GST'}):</span>
                    <span>{formatCurrency(liveGrandTotal)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setGstModalOrder(null)}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateCustomGstBill}
                    disabled={generatingGst}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50 hover:scale-105"
                  >
                    {generatingGst ? 'Generating & Saving...' : 'Generate & Save GST Bill PDF'}
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
