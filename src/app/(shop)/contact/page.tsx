'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Option to send enquiry via WhatsApp directly
    const waText = `Hi Sri Arumugam Pyro Park,%0A%0A*New Website Enquiry:*%0A• Name: ${formData.name}%0A• Phone: ${formData.phone}%0A• Email: ${formData.email}%0A• Subject: ${formData.subject}%0A• Message: ${formData.message}`;
    window.open(`https://wa.me/918682913516?text=${waText}`, '_blank');
  };

  const mapUrl = "https://maps.google.com/?q=Sivakasi,+Tamil+Nadu";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16 font-sans">
      
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[#12151e] via-[#1a1f2e] to-[#0f1219] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center space-y-4 z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Sivakasi Direct Supplier</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-[family-name:var(--font-outfit)] tracking-tight uppercase">
            Get In Touch With Us
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about our Diwali crackers, wholesale pricelist, or order shipping? We are here to help 7 days a week!
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Card 1: Phone */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-[family-name:var(--font-outfit)]">Call / WhatsApp</h3>
              <p className="text-xs text-slate-500">Quick assistance & WhatsApp order confirmation.</p>
            </div>
            <div className="space-y-1 pt-2 text-sm font-semibold text-slate-800">
              <a href="tel:+918682913516" className="block hover:text-amber-600 transition-colors">+91 8682913516</a>
              <a href="tel:+916374041238" className="block hover:text-amber-600 transition-colors">+91 6374041238</a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-[family-name:var(--font-outfit)]">Email Support</h3>
              <p className="text-xs text-slate-500">Send us your queries anytime.</p>
            </div>
            <div className="pt-2 text-xs sm:text-sm font-semibold text-slate-800 break-all">
              <a href="mailto:sriarumugampyropark.svks@gmail.com" className="hover:text-amber-600 transition-colors">
                sriarumugampyropark.svks@gmail.com
              </a>
            </div>
          </div>

          {/* Card 3: Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-[family-name:var(--font-outfit)]">Store Location</h3>
              <p className="text-xs text-slate-500">Sivakasi Main Outlet</p>
            </div>
            <div className="pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              4/2017, 56 House Colony, Nalan Crackers Backside, Sivakasi - 626 189
            </div>
          </div>

          {/* Card 4: Working Hours */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-[family-name:var(--font-outfit)]">Working Hours</h3>
              <p className="text-xs text-slate-500">Open 7 days a week</p>
            </div>
            <div className="pt-2 text-xs sm:text-sm font-semibold text-slate-800">
              Monday – Sunday:<br />
              <span className="text-amber-600 font-bold">10:00 AM – 8:00 PM</span>
            </div>
          </div>

        </div>

        {/* Contact Form & Side Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-[family-name:var(--font-outfit)]">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill out the form below or reach us directly on WhatsApp for immediate order confirmation.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900 font-[family-name:var(--font-outfit)]">
                  Thank You for Reaching Out!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700">
                  Your enquiry has been redirected to our WhatsApp team. We will confirm your request within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium bg-slate-50/50 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium bg-slate-50/50 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium bg-slate-50/50 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Order Inquiry / Wholesale"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium bg-slate-50/50 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what products you are looking for..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium bg-slate-50/50 outline-none transition resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & Send via WhatsApp</span>
                  </button>

                  <a
                    href="https://wa.me/918682913516"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>WhatsApp Us Directly</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Legal Compliance Side Banner (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-gradient-to-br from-[#12151e] to-[#1a1f2e] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">
                100% Legal & Statutory Compliances
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                As per 2018 Supreme Court order, online sale of firecrackers are not permitted! We value our customers and respect jurisdiction. We request you to add products to the cart and submit required crackers through the enquiry button. We will contact you within 24 hours to confirm the order.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Licensed Sivakasi Distributor</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Registered & Legal Transport Service</span>
                </div>
              </div>
            </div>

            {/* Quick Link Card to Products */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-base font-bold font-[family-name:var(--font-outfit)]">Ready to Order Crackers?</h4>
                <p className="text-xs text-amber-100">Explore factory price Diwali crackers collection.</p>
              </div>
              <Link
                href="/#product-list"
                className="px-4 py-2 bg-white text-orange-600 hover:bg-orange-50 text-xs font-black rounded-xl shadow-md transition-transform hover:scale-105 shrink-0"
              >
                View Catalog ➔
              </Link>
            </div>

          </div>

        </div>

        {/* Interactive Full Width Google Map Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-extrabold text-slate-900 font-[family-name:var(--font-outfit)]">
                Our Store Location — Sivakasi
              </h2>
            </div>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <span>Open Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
          >
            <div className="relative w-full h-[320px] sm:h-[400px]">
              <iframe
                src="https://maps.google.com/maps?q=Sivakasi,+Tamil+Nadu&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full pointer-events-none"
                title="Sri Arumugam Pyro Park Sivakasi Location Map"
              />
            </div>
          </a>
        </div>

      </main>

    </div>
  );
}
