'use client';

import { useState, useMemo } from 'react';
import type { GstAuditBill } from '@/services/gst-bill.actions';
import { createGstAuditBill, deleteGstAuditBill } from '@/services/gst-bill.actions';
import { formatCurrency } from '@/lib/utils';
import { generateGSTInvoicePDF } from '@/lib/invoicePdfGenerator';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Search,
  RotateCcw,
  X,
  Building,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Receipt,
  TrendingUp,
  Percent,
  Calendar,
  Sparkles,
  CreditCard,
} from 'lucide-react';

interface Props {
  initialBills: GstAuditBill[];
}

export default function GstBillsManager({ initialBills }: Props) {
  const [bills, setBills] = useState<GstAuditBill[]>(initialBills);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State for creating a Standalone GST Bill
  const [custName, setCustName] = useState('Walk-in Counter Buyer');
  const [phone, setPhone] = useState('9999999999');
  const [address, setAddress] = useState('In-Store Counter');
  const [city, setCity] = useState('Sivakasi');
  const [pincode, setPincode] = useState('626123');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [gstinAadhar, setGstinAadhar] = useState('');
  const [particulars, setParticulars] = useState('Assorted Crackers Variety Pack (HSN 3604)');
  const [totalAmountInput, setTotalAmountInput] = useState<string>('5000');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filtered Bills
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const q = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        b.bill_number.toLowerCase().includes(q) ||
        b.customer_name.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        (b.city && b.city.toLowerCase().includes(q)) ||
        (b.particulars && b.particulars.toLowerCase().includes(q))
      );
    });
  }, [bills, searchQuery]);

  // Overall Financial Stats
  const totalAuditRevenue = useMemo(() => bills.reduce((sum, b) => sum + Number(b.total_amount || 0), 0), [bills]);
  const totalTaxableValue = useMemo(() => bills.reduce((sum, b) => sum + Number(b.taxable_amount || 0), 0), [bills]);
  const totalGstCollected = useMemo(() => bills.reduce((sum, b) => sum + Number(b.gst_amount || 0), 0), [bills]);

  // Calculated Live Values for Modal
  const parsedTotal = parseFloat(totalAmountInput) || 0;
  const liveTaxable = Math.round((parsedTotal / 1.18) * 100) / 100;
  const liveGst = Math.round((parsedTotal - liveTaxable) * 100) / 100;
  const isTN = stateName.toLowerCase().includes('tamil') || (!pincode.startsWith('605') && /^6[0-4]\d{4}$/.test(pincode));
  const liveCgst = isTN ? Math.round((liveGst / 2) * 100) / 100 : 0;
  const liveSgst = isTN ? Math.round((liveGst / 2) * 100) / 100 : 0;
  const liveIgst = !isTN ? liveGst : 0;

  const openCreateModal = () => {
    setCustName('Walk-in Counter Buyer');
    setPhone('9999999999');
    setAddress('In-Store Counter');
    setCity('Sivakasi');
    setPincode('626123');
    setStateName('Tamil Nadu');
    setGstinAadhar('');
    setParticulars('Assorted Crackers Variety Pack (HSN 3604)');
    setTotalAmountInput('5000');
    setMessage(null);
    setIsModalOpen(true);
  };

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedTotal <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid bill total amount' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const inputData = {
      customer_name: custName,
      phone,
      address,
      city,
      pincode,
      state: stateName,
      gstin_aadhar: gstinAadhar,
      particulars,
      total_amount: parsedTotal,
    };

    const res = await createGstAuditBill(inputData);
    setSubmitting(false);

    if (res.success && res.data) {
      const createdBill = res.data;
      setBills((prev) => [createdBill, ...prev]);
      setMessage({ type: 'success', text: `GST Audit Bill #${createdBill.bill_number} saved & generated successfully!` });

      // Automatically generate & download PDF
      await generateGSTInvoicePDF(
        {
          id: createdBill.bill_number,
          customer_name: createdBill.customer_name,
          phone: createdBill.phone,
          address: createdBill.address,
          city: createdBill.city,
          pincode: createdBill.pincode,
          total_amount: createdBill.total_amount,
          status: 'confirmed',
          created_at: createdBill.created_at,
          order_items: [],
        },
        true,
        {
          billNumber: createdBill.bill_number,
          customerName: createdBill.customer_name,
          phone: createdBill.phone,
          address: createdBill.address,
          city: createdBill.city,
          pincode: createdBill.pincode,
          state: createdBill.state,
          gstinAadhar: createdBill.gstin_aadhar,
          particulars: createdBill.particulars,
          totalAmount: createdBill.total_amount,
          taxableAmount: createdBill.taxable_amount,
          gstAmount: createdBill.gst_amount,
          cgst: createdBill.cgst,
          sgst: createdBill.sgst,
          igst: createdBill.igst,
        }
      );

      setTimeout(() => {
        setIsModalOpen(false);
        setMessage(null);
      }, 1000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save GST bill' });
    }
  };

  const handleDownloadExistingPdf = async (bill: GstAuditBill) => {
    await generateGSTInvoicePDF(
      {
        id: bill.bill_number,
        customer_name: bill.customer_name,
        phone: bill.phone,
        address: bill.address,
        city: bill.city,
        pincode: bill.pincode,
        total_amount: Number(bill.total_amount),
        status: 'confirmed',
        created_at: bill.created_at,
        order_items: [],
      },
      true,
      {
        billNumber: bill.bill_number,
        customerName: bill.customer_name,
        phone: bill.phone,
        address: bill.address,
        city: bill.city,
        pincode: bill.pincode,
        state: bill.state,
        gstinAadhar: bill.gstin_aadhar,
        particulars: bill.particulars,
        totalAmount: Number(bill.total_amount),
        taxableAmount: Number(bill.taxable_amount),
        gstAmount: Number(bill.gst_amount),
        cgst: Number(bill.cgst),
        sgst: Number(bill.sgst),
        igst: Number(bill.igst),
      }
    );
  };

  const handleDeleteBill = async (id: string, billNo: string) => {
    if (!confirm(`Are you sure you want to delete GST Audit Bill ${billNo}?`)) return;

    setDeletingId(id);
    const res = await deleteGstAuditBill(id);
    setDeletingId(null);

    if (res.success) {
      setBills((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert('Delete failed: ' + res.error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-amber-600" /> GST Audit Bills & Transport Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage tax invoices for auditing, road courier parcel transport, and 18% GST filing
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Standalone GST Bill
        </button>
      </div>

      {/* Top Overview Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total GST Bills</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{bills.length}</p>
          <span className="text-[11px] text-slate-400 font-medium">Recorded audit invoices</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Audit Gross Turnover</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(totalAuditRevenue)}</p>
          <span className="text-[11px] text-emerald-600 font-bold">Total gross invoice value</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Taxable Value</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(totalTaxableValue)}</p>
          <span className="text-[11px] text-blue-600 font-bold">Excl. 18% GST portion</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-300 bg-gradient-to-br from-amber-50/40 to-white shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">GST Collected (18%)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 tracking-tight">{formatCurrency(totalGstCollected)}</p>
          <span className="text-[11px] text-amber-700 font-extrabold">CGST + SGST / IGST tax</span>
        </div>

      </div>

      {/* Filter & Search Controls Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by GST bill #, customer name, phone, city, or particulars..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-bold px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Search
          </button>
        )}

        <span className="ml-auto text-slate-400 text-[11px] font-bold">
          Showing {filteredBills.length} of {bills.length} GST bills
        </span>
      </div>

      {/* GST Audit Bills Table View */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 relative min-w-[960px]">
          <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200/80 shadow-2xs select-none">
            <tr>
              <th className="py-3.5 px-4 bg-slate-50">GST Bill # & Date</th>
              <th className="py-3.5 px-4 bg-slate-50">Customer & Contact</th>
              <th className="py-3.5 px-4 bg-slate-50">State & Delivery Address</th>
              <th className="py-3.5 px-4 bg-slate-50">Particulars (HSN 3604)</th>
              <th className="py-3.5 px-4 bg-slate-50 text-right">Taxable Val</th>
              <th className="py-3.5 px-4 bg-slate-50 text-right">GST (18%)</th>
              <th className="py-3.5 px-4 bg-slate-50 text-right">Total Amount</th>
              <th className="py-3.5 px-4 text-right bg-slate-50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBills.length > 0 ? (
              filteredBills.map((bill) => {
                const formattedDate = new Date(bill.created_at).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });

                return (
                  <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block text-xs shadow-2xs">
                        {bill.bill_number}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 block mt-1 whitespace-nowrap">
                        {formattedDate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 text-xs block">{bill.customer_name}</span>
                      <span className="text-slate-500 font-bold text-[11px] block mt-0.5">+91 {bill.phone}</span>
                      {bill.gstin_aadhar && (
                        <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                          GST/Aadhar: {bill.gstin_aadhar}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-0.5">
                        {bill.state || 'Tamil Nadu'}
                      </span>
                      <p className="text-slate-600 font-medium text-[11px] line-clamp-1">{bill.address}</p>
                      <p className="text-slate-400 text-[10px]">{bill.city} - {bill.pincode}</p>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                        {bill.particulars}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-600">
                      {formatCurrency(bill.taxable_amount)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-extrabold text-amber-700 block">
                        {formatCurrency(bill.gst_amount)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium block">
                        {Number(bill.cgst) > 0 ? `CGST: ${formatCurrency(bill.cgst)} | SGST: ${formatCurrency(bill.sgst)}` : `IGST: ${formatCurrency(bill.igst)}`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-black text-emerald-600 text-sm block">
                        {formatCurrency(bill.total_amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownloadExistingPdf(bill)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-2xs transition-all cursor-pointer hover:scale-105 inline-flex items-center gap-1"
                          title="Download Stored GST Tax Invoice PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-white" />
                          <span>PDF</span>
                        </button>

                        <button
                          onClick={() => handleDeleteBill(bill.id, bill.bill_number)}
                          disabled={deletingId === bill.id}
                          className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all cursor-pointer hover:scale-105 disabled:opacity-40"
                          title="Delete Bill Record"
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
                <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                  No GST audit bills found. Click "+ Create Standalone GST Bill" above to generate your first audit bill!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Standalone GST Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Receipt className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900">Create Standalone GST Audit Bill</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Generate an official 18% GST tax invoice for audit filing & parcel dispatch
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase mb-1">Delivery Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1">State</label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Tamil Nadu">Tamil Nadu (State Code 33)</option>
                    <option value="Inter-State Transport">Inter-State Transport (IGST)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase mb-1">Aadhar / PAN / GSTIN No. (Optional)</label>
                <input
                  type="text"
                  value={gstinAadhar}
                  onChange={(e) => setGstinAadhar(e.target.value)}
                  placeholder="e.g. 33AAAAA0000A1Z5 or Aadhar No."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase mb-1">Item Particulars Description *</label>
                <input
                  type="text"
                  value={particulars}
                  onChange={(e) => setParticulars(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase mb-1">Target Total GST Bill Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={totalAmountInput}
                  onChange={(e) => setTotalAmountInput(e.target.value)}
                  className="w-full bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-base font-black text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Real-time Tally Calculation Box */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800 shadow-md">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Taxable Subtotal:</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(liveTaxable)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">GST (18% Total):</span>
                  <span className="font-mono font-bold text-amber-400">{formatCurrency(liveGst)}</span>
                </div>
                {isTN ? (
                  <div className="flex justify-between text-[11px] text-slate-400 pl-4 border-l-2 border-amber-500">
                    <span>CGST (9%): {formatCurrency(liveCgst)}</span>
                    <span>SGST (9%): {formatCurrency(liveSgst)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-[11px] text-slate-400 pl-4 border-l-2 border-amber-500">
                    <span>IGST (18%): {formatCurrency(liveIgst)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-800 text-emerald-400">
                  <span>Grand Total (Incl. GST):</span>
                  <span>{formatCurrency(parsedTotal)}</span>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl font-bold text-xs flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50 hover:scale-105"
                >
                  {submitting ? 'Generating PDF & Saving...' : 'Generate & Download GST Bill PDF'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
