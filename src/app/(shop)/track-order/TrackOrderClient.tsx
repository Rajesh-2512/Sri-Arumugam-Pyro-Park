'use client';

import { useState, useEffect } from 'react';
import { getOrdersByQuery } from '@/services/order.actions';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  getCustomerDetailsFromCookie,
  getOrderHistoryFromCookie,
  CustomerOrderHistoryItem,
} from '@/lib/customer-cookies';
import {
  Package,
  Search,
  Phone,
  Clock,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquareHeart,
  Star,
  Send,
  Users,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
} from 'lucide-react';
import Link from 'next/link';

import { submitFeedback } from '@/services/feedback.actions';

export default function TrackOrderClient() {
  const [searchInput, setSearchInput] = useState('');
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [cookieOrders, setCookieOrders] = useState<CustomerOrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. Get saved cookie orders
    const history = getOrderHistoryFromCookie();
    setCookieOrders(history);

    // 2. Pre-fill from cookies if available
    const saved = getCustomerDetailsFromCookie();
    if (saved) {
      if (saved.phone) {
        setSearchInput(saved.phone);
        setFeedbackPhone(saved.phone);
        fetchOrders(saved.phone);
      }
      if (saved.customer_name) {
        setFeedbackName(saved.customer_name);
      }
    }
  }, []);

  const fetchOrders = async (query: string) => {
    if (!query || query.trim().length < 2) return;
    setLoading(true);
    setSearched(true);
    const res = await getOrdersByQuery(query);
    setLoading(false);
    if (res.success) {
      setDbOrders(res.data);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(searchInput);
  };

  const toggleItemsExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setFeedbackSubmitting(true);

    // 1. Save to Database
    const res = await submitFeedback({
      name: feedbackName || 'Valued Customer',
      phone_or_order: feedbackPhone || undefined,
      rating: feedbackRating,
      message: feedbackMessage,
    });

    setFeedbackSubmitting(false);

    if (res.success) {
      setFeedbackSubmitted(true);
      setFeedbackMessage('');
      setTimeout(() => setFeedbackSubmitted(false), 7000);
    } else {
      alert('Error submitting feedback: ' + (res.error || 'Please try again.'));
    }
  };

  const getStepProgress = (statusRaw: string) => {
    const s = (statusRaw || '').toString().trim().toLowerCase();
    if (s.includes('deliver') || s.includes('complete')) return 4;
    if (s.includes('dispatch') || s.includes('ship') || s.includes('transit') || s.includes('out')) return 3;
    if (s.includes('confirm') || s.includes('process') || s.includes('packed') || s.includes('ready')) return 2;
    return 1;
  };

  if (!mounted) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* ─── 1. HERO BANNER WITH 5,000+ CUSTOMERS MENTION ─── */}
      <div className="bg-gradient-to-br from-[#12151e] via-[#1a1f2e] to-[#0f1219] rounded-3xl p-8 sm:p-10 text-white space-y-4 text-center relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          <Users className="w-4 h-4 text-amber-400" /> Trusted by 5,000+ Happy Sivakasi Diwali Families
        </div>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-[family-name:var(--font-outfit)]">
          Live Order Status & Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
          Enter your 10-digit mobile number or Order ID below (e.g. <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">E59B9B5F</code> or <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">9876543210</code>) to track your orders and download official PDF tax invoices.
        </p>
      </div>

      {/* ─── 2. TRACK ORDER SEARCH BAR ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Search className="w-4 h-4 text-orange-600" /> Search by Mobile Number or Order ID
        </label>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="e.g. E59B9B5F or 9876543210"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500 transition-colors uppercase"
          />
          <button
            type="submit"
            disabled={loading || !searchInput}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Track My Order
          </button>
        </form>
      </div>

      {/* ─── 3. SEARCH RESULTS & STATUS TIMELINE ─── */}
      {dbOrders.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-[#1b2342] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" /> Found {dbOrders.length} Order{dbOrders.length > 1 ? 's' : ''}
            </span>
            <span className="text-xs text-slate-400 font-normal">Showing newest orders first</span>
          </h2>

          <div className="space-y-6">
            {dbOrders.map((ord) => {
              const statusRaw = (ord.status || 'pending').toString().trim().toUpperCase();
              const stepLevel = getStepProgress(statusRaw);
              const itemsList = ord.order_items || [];
              const isExpanded = expandedOrders[ord.id] ?? false;
              const displayItems = isExpanded ? itemsList : itemsList.slice(0, 4);

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6 hover:shadow-lg transition-all"
                >
                  {/* Order Top Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-slate-900 bg-amber-50 px-3 py-1 rounded-lg border border-amber-300 uppercase">
                          ORDER #{ord.id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          <Clock className="w-3.5 h-3.5 inline mr-1" /> {formatDate(ord.created_at)}
                        </span>
                      </div>
                    </div>

                    <span className={`text-xs font-black uppercase px-4 py-1.5 rounded-full border shadow-2xs ${
                      stepLevel === 4 ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      stepLevel === 3 ? 'bg-amber-50 text-amber-800 border-amber-300' :
                      stepLevel === 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      ● STATUS: {statusRaw || 'PENDING CONFIRMATION'}
                    </span>
                  </div>

                  {/* Clean Flexbox Stepper UI */}
                  <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-3">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 text-center sm:text-left">
                      Live Delivery Progress
                    </h4>
                    
                    <div className="flex items-center justify-between w-full max-w-lg mx-auto py-2">
                      
                      {/* Step 1 */}
                      <div className="flex flex-col items-center text-center space-y-1.5 shrink-0">
                        <div className={`w-10 h-10 rounded-full font-black flex items-center justify-center text-xs transition-all ${
                          stepLevel >= 1 ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
                        }`}>
                          ✓
                        </div>
                        <span className={`text-[11px] font-black ${stepLevel >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                          1. Placed
                        </span>
                      </div>

                      {/* Line 1-2 */}
                      <div className={`flex-1 h-1.5 mx-2 sm:mx-3 rounded-full transition-all ${
                        stepLevel >= 2 ? 'bg-emerald-500' : 'bg-slate-200'
                      }`} />

                      {/* Step 2 */}
                      <div className="flex flex-col items-center text-center space-y-1.5 shrink-0">
                        <div className={`w-10 h-10 rounded-full font-black flex items-center justify-center text-xs transition-all ${
                          stepLevel >= 2 ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {stepLevel >= 2 ? '✓' : '2'}
                        </div>
                        <span className={`text-[11px] font-black ${stepLevel >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
                          2. Confirmed
                        </span>
                      </div>

                      {/* Line 2-3 */}
                      <div className={`flex-1 h-1.5 mx-2 sm:mx-3 rounded-full transition-all ${
                        stepLevel >= 3 ? 'bg-amber-500' : 'bg-slate-200'
                      }`} />

                      {/* Step 3 */}
                      <div className="flex flex-col items-center text-center space-y-1.5 shrink-0">
                        <div className={`w-10 h-10 rounded-full font-black flex items-center justify-center text-xs transition-all ${
                          stepLevel >= 3 ? 'bg-amber-500 text-white shadow-md ring-4 ring-amber-100' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {stepLevel >= 3 ? '✓' : '3'}
                        </div>
                        <span className={`text-[11px] font-black ${stepLevel >= 3 ? 'text-amber-700' : 'text-slate-400'}`}>
                          3. Dispatched
                        </span>
                      </div>

                      {/* Line 3-4 */}
                      <div className={`flex-1 h-1.5 mx-2 sm:mx-3 rounded-full transition-all ${
                        stepLevel >= 4 ? 'bg-purple-600' : 'bg-slate-200'
                      }`} />

                      {/* Step 4 */}
                      <div className="flex flex-col items-center text-center space-y-1.5 shrink-0">
                        <div className={`w-10 h-10 rounded-full font-black flex items-center justify-center text-xs transition-all ${
                          stepLevel >= 4 ? 'bg-purple-600 text-white shadow-md ring-4 ring-purple-100' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {stepLevel >= 4 ? '✓' : '4'}
                        </div>
                        <span className={`text-[11px] font-black ${stepLevel >= 4 ? 'text-purple-700' : 'text-slate-400'}`}>
                          4. Delivered
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Customer Info & Grand Total Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-amber-500/5 p-5 rounded-2xl border border-amber-200/70">
                    <div className="sm:col-span-2 space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                        <User className="w-4 h-4 text-amber-600" />
                        <span>{ord.customer_name}</span>
                        <span className="text-xs text-slate-500 font-bold">({ord.phone})</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-slate-600 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{ord.address}, {ord.city} - {ord.pincode}</span>
                      </div>
                      {ord.notes && <p className="text-[11px] text-amber-800 italic pt-1">Note: "{ord.notes}"</p>}
                    </div>

                    <div className="sm:text-right space-y-0.5 border-t sm:border-t-0 sm:border-l border-amber-200/60 pt-3 sm:pt-0 sm:pl-4 my-auto">
                      <span className="text-[11px] text-slate-500 font-bold uppercase block">Grand Total</span>
                      <span className="font-black text-2xl text-orange-600 block">
                        {formatCurrency(ord.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Itemized Order Breakdown Table */}
                  {itemsList.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-orange-600" /> Cracker Items ({itemsList.length})
                        </h4>
                        {itemsList.length > 4 && (
                          <button
                            onClick={() => toggleItemsExpand(ord.id)}
                            className="text-xs font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                          >
                            {isExpanded ? (
                              <>Show Less <ChevronUp className="w-4 h-4" /></>
                            ) : (
                              <>View All {itemsList.length} Items <ChevronDown className="w-4 h-4" /></>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Clean Item Table */}
                      <div className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden text-xs divide-y divide-slate-200/60">
                        {displayItems.map((item: any, i: number) => (
                          <div key={i} className="p-3 flex items-center justify-between gap-4 hover:bg-white transition-colors">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <span className="font-bold text-slate-900">{item.product_name}</span>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <span className="bg-white border border-slate-200 text-slate-700 font-extrabold px-2.5 py-0.5 rounded-md text-[11px]">
                                Qty: {item.quantity}
                              </span>
                              <span className="font-black text-slate-900 w-20 text-right">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PDF Download Button */}
                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <Link
                      href={`/order-success?id=${ord.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-amber-400" /> Download PDF Tax Invoice <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Saved Cookie Orders Fallback */}
      {cookieOrders.length > 0 && dbOrders.length === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-[#1b2342] flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" /> Saved Cookie Orders ({cookieOrders.length})
          </h2>

          <div className="space-y-4">
            {cookieOrders.map((ord) => (
              <div key={ord.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                    ORDER #{ord.id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{formatDate(ord.date)}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">{ord.customer_name}</span> ({ord.city})
                    <p className="text-[11px] text-slate-400">{ord.items_count} Cracker Pack(s)</p>
                  </div>
                  <span className="font-black text-base text-orange-600">{formatCurrency(ord.total_amount)}</span>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/order-success?id=${ord.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                  >
                    <FileText className="w-4 h-4" /> Download PDF Invoice <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty Search State */}
      {searched && dbOrders.length === 0 && cookieOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No matching orders were found for "{searchInput}". Please double-check your 10-digit mobile number or Order ID.
          </p>
        </div>
      )}

      {/* ─── 4. SHARE FEEDBACK SECTION ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-10 space-y-6">
        
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-black px-3.5 py-1 rounded-full border border-amber-200">
            <MessageSquareHeart className="w-4 h-4 text-amber-600" /> Share Your Feedback & Suggestions
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            We are ready to receive any type of feedback!
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Your honest feedback helps us improve our fireworks quality and delivery service for all 5,000+ customers.
          </p>
        </div>

        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          
          {/* Rating Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Rate Your Experience *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= feedbackRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-extrabold text-amber-600 ml-2">
                {feedbackRating} / 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                placeholder="Ravi Kumar"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mobile Number / Order ID
              </label>
              <input
                type="text"
                value={feedbackPhone}
                onChange={(e) => setFeedbackPhone(e.target.value)}
                placeholder="9876543210 or E59B9B5F"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500 transition-colors uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Your Feedback or Suggestion *
            </label>
            <textarea
              rows={4}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Tell us what you loved about our crackers or any suggestions to improve..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          {feedbackSubmitted && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your feedback has been saved and submitted to Sri Arumugam Pyro Park team.</span>
              </div>
              <a
                href={`https://wa.me/918682913516?text=${encodeURIComponent(`*CUSTOMER FEEDBACK / RATING*\n\n⭐ *Rating:* ${feedbackRating}/5 Stars\n👤 *Name:* ${feedbackName || 'Valued Customer'}\n📞 *Mobile / Order ID:* ${feedbackPhone || 'N/A'}\n\n💬 *Feedback:* ${feedbackMessage}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-300 transition-colors shrink-0 flex items-center gap-1"
              >
                Also Send via WhatsApp →
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={feedbackSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
          >
            {feedbackSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Feedback...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Feedback to Team
              </>
            )}
          </button>

        </form>

      </div>

    </main>
  );
}
