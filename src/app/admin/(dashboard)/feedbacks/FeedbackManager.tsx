'use client';

import { useState } from 'react';
import type { Feedback } from '@/types/feedback';
import { toggleFeedbackApproval, deleteFeedback } from '@/services/feedback.actions';
import { formatDate } from '@/lib/utils';
import {
  MessageSquareHeart,
  Star,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
  Phone,
  MessageCircle,
  ThumbsUp,
  Award,
  Users,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

interface FeedbackManagerProps {
  initialFeedbacks: Feedback[];
}

export default function FeedbackManager({ initialFeedbacks }: FeedbackManagerProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'hidden'>('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Compute metrics
  const totalCount = feedbacks.length;
  const avgRating = totalCount > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalCount).toFixed(1)
    : '0.0';
  const fiveStarCount = feedbacks.filter((f) => f.rating === 5).length;
  const approvedCount = feedbacks.filter((f) => f.is_approved).length;

  // Filtered List
  const filteredFeedbacks = feedbacks.filter((f) => {
    if (ratingFilter !== 'all' && f.rating !== ratingFilter) return false;
    if (approvalFilter === 'approved' && !f.is_approved) return false;
    if (approvalFilter === 'hidden' && f.is_approved) return false;
    return true;
  });

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    const newStatus = !currentStatus;
    const res = await toggleFeedbackApproval(id, newStatus);
    setLoadingId(null);

    if (res.success) {
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, is_approved: newStatus } : f))
      );
    } else {
      alert('Failed to update status: ' + res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer feedback record?')) return;
    setLoadingId(id);
    const res = await deleteFeedback(id);
    setLoadingId(null);

    if (res.success) {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } else {
      alert('Failed to delete feedback: ' + res.error);
    }
  };

  return (
    <div className="space-y-8 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            <MessageSquareHeart className="w-4 h-4 text-amber-600" /> Customer Ratings & Reviews
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1b2342] tracking-tight">
            Customer Feedback Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Review, approve, and manage customer feedback submitted via the Storefront & Tracking Desk.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Feedbacks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Reviews</span>
            <span className="text-2xl font-black text-[#1b2342]">{totalCount}</span>
          </div>
        </div>

        {/* Card 2: Average Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Rating</span>
            <span className="text-2xl font-black text-[#1b2342] flex items-center gap-1">
              {avgRating} <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
            </span>
          </div>
        </div>

        {/* Card 3: 5-Star Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">5-Star Ratings</span>
            <span className="text-2xl font-black text-emerald-600">{fiveStarCount}</span>
          </div>
        </div>

        {/* Card 4: Approved Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Published Reviews</span>
            <span className="text-2xl font-black text-blue-600">{approvedCount}</span>
          </div>
        </div>

      </div>

      {/* Filter Control Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Star Rating Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Rating:
          </span>
          <button
            onClick={() => setRatingFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              ratingFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Ratings ({feedbacks.length})
          </button>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = feedbacks.filter((f) => f.rating === star).length;
            return (
              <button
                key={star}
                onClick={() => setRatingFilter(star)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  ratingFilter === star
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{star}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-[10px] text-slate-400 font-normal">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Approval Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setApprovalFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              approvalFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Show All
          </button>
          <button
            onClick={() => setApprovalFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              approvalFilter === 'approved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setApprovalFilter('hidden')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              approvalFilter === 'hidden' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Hidden
          </button>
        </div>

      </div>

      {/* Feedbacks Grid */}
      {filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <MessageSquareHeart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Feedbacks Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No customer feedbacks match your selected filter options.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeedbacks.map((f) => {
            const cleanPhone = f.phone_or_order ? f.phone_or_order.replace(/\D/g, '') : '';
            const hasPhone = cleanPhone.length >= 10;

            return (
              <div
                key={f.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Top Bar: Stars + Approval Status Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= f.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-extrabold text-slate-700 ml-1.5">
                        {f.rating}.0
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleApproval(f.id, f.is_approved)}
                      disabled={loadingId === f.id}
                      className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                        f.is_approved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Click to toggle public status"
                    >
                      {f.is_approved ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Published
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-amber-600" /> Hidden
                        </>
                      )}
                    </button>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {f.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      {f.phone_or_order && (
                        <span>Mobile/ID: <strong className="text-slate-700">{f.phone_or_order}</strong></span>
                      )}
                      <span>•</span>
                      <span>{formatDate(f.created_at)}</span>
                    </div>
                  </div>

                  {/* Feedback Message */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-slate-700 text-xs leading-relaxed italic whitespace-pre-line">
                    "{f.message}"
                  </div>

                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {hasPhone && (
                      <a
                        href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                          `Dear ${f.name},\n\nThank you so much for your ${f.rating}-star review and feedback to Sri Arumugam Pyro Park! 🎇✨ We truly appreciate your support!\n\nBest regards,\nSri Arumugam Pyro Park Sivakasi`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
                        title="Send thank you message on WhatsApp"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-emerald-600" /> WhatsApp Thank You
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(f.id)}
                    disabled={loadingId === f.id}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete feedback record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
