'use client';

import { Star, ExternalLink, ShieldCheck } from 'lucide-react';

const GOOGLE_MAPS_REVIEW_URL = "https://www.google.com/maps/place/Sri+Arumugam+Pyro+Park/data=!4m2!3m1!1s0x0:0xfac1f45c99ab30ef?sa=X&ved=1t:2428&ictx=111";

const REAL_GOOGLE_REVIEWS = [
  {
    name: 'KIRAN GSR',
    badge: 'Local Guide • 39 reviews',
    rating: 5,
    time: '9 months ago',
    bg: 'bg-purple-600',
    comment: 'Great products really enjoyed every product and this diwali with cut them will not be this much succes for me. I took platinum combo and their products are really great',
    ownerResponse: 'Thank you for your valuable feedback sir.',
  },
  {
    name: 'kamalesh thangavel',
    badge: '4 reviews',
    rating: 5,
    time: '2 years ago',
    bg: 'bg-amber-600',
    comment: 'Your crackers are good quality products at low prices...keep up your business service 👍 ...',
  },
  {
    name: 'Karthika',
    badge: '1 review',
    rating: 5,
    time: '2 years ago',
    bg: 'bg-emerald-600',
    comment: 'Good quality Product.....👍 👍 ...',
  },
  {
    name: 'venkata narayanan',
    badge: '5 reviews',
    rating: 5,
    time: '9 months ago',
    bg: 'bg-blue-600',
    comment: 'Quality of the crackers are so good. And the prices are reasonable',
    ownerResponse: 'Thank you for your valuable feedback sir.',
  },
  {
    name: 'Chandramouleeswaran S',
    badge: '7 reviews',
    rating: 5,
    time: 'a year ago',
    bg: 'bg-indigo-600',
    comment: 'Very good quality crackers .. Enjoyed the most .. Prompt Service .. will come back every year',
    ownerResponse: 'Tq for your valuable feedback sir.',
  },
  {
    name: 'vinoth vino',
    badge: '12 reviews',
    rating: 5,
    time: '9 months ago',
    bg: 'bg-teal-600',
    comment: 'Good quality and good service.',
    ownerResponse: 'Thanks bro for your valuable feedback',
  },
  {
    name: 'Dr Manikandan Manoharan',
    badge: '8 reviews • 14 photos',
    rating: 5,
    time: '9 months ago',
    bg: 'bg-rose-600',
    comment: 'The crackers are very good. Zero waste',
  },
  {
    name: 'yuva raj',
    badge: '2 reviews • 3 photos',
    rating: 5,
    time: '9 months ago',
    bg: 'bg-orange-600',
    comment: 'Good Quality, Good communication and cooperation, good supporting, worth of cost',
    ownerResponse: 'Tq for your valuable feedback sir.',
  },
  {
    name: 'Muthu Mahesh',
    badge: '2 reviews',
    rating: 5,
    time: 'a year ago',
    bg: 'bg-cyan-600',
    comment: 'Good cracker budget friendly',
  },
];

export default function GoogleReviews() {
  // Triple the array for seamless infinite looping
  const reviewsTripled = [...REAL_GOOGLE_REVIEWS, ...REAL_GOOGLE_REVIEWS, ...REAL_GOOGLE_REVIEWS];

  return (
    <section className="py-10 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 my-8 overflow-hidden">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.7-.06-1.4-.19-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">
              Verified Google Business Reviews
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sri Arumugam Pyro Park
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-slate-900">4.8</span>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500">(31 Verified Google Reviews)</span>
          </div>
        </div>

        <a
          href={GOOGLE_MAPS_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Star className="w-4 h-4 fill-white" /> Review us on Google <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Infinite Horizontal Auto-Scroll Track */}
      <div className="relative overflow-hidden py-2 select-none">
        
        {/* Left & Right Ambient Fades */}
        <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-5 py-2">
          {reviewsTripled.map((rev, idx) => (
            <div
              key={idx}
              className="w-[320px] sm:w-[360px] shrink-0 bg-slate-50 rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3.5 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="space-y-2.5">
                
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${rev.bg} text-white font-black text-xs flex items-center justify-center shadow-xs uppercase`}>
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs leading-tight group-hover:text-orange-600 transition-colors">
                        {rev.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {rev.badge} • {rev.time}
                      </span>
                    </div>
                  </div>

                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex items-center text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {/* Owner Reply */}
                {rev.ownerResponse && (
                  <div className="bg-amber-50/80 border-l-2 border-amber-500 px-3 py-1.5 rounded-r-xl text-[11px] text-amber-900 font-medium space-y-0.5">
                    <span className="font-bold text-[10px] uppercase text-amber-700 block">Response from Owner:</span>
                    <p className="italic">"{rev.ownerResponse}"</p>
                  </div>
                )}

              </div>

              {/* Verified Badge Footer */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Google Maps Review
                </span>
                <span className="text-amber-600 group-hover:underline">View on Google →</span>
              </div>

            </div>
          ))}
        </div>

      </div>

      <p className="text-center text-[11px] text-slate-400 font-medium">
        💡 Hover over any review card to pause scrolling and read details.
      </p>

    </section>
  );
}
