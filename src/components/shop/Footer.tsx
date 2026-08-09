'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ExternalLink, ShieldAlert, ArrowUp } from 'lucide-react';

interface FooterProps {
  shopName?: string;
  contactNumber?: string;
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Footer({ shopName = 'Sri Arumugam Pyro Park', contactNumber = '8682913516' }: FooterProps) {
  const mapUrl = "https://maps.google.com/?q=Sivakasi,+Tamil+Nadu";

  const handleScrollTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#12151e] text-slate-300 pt-14 pb-8 font-sans border-t border-slate-800/80 overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Top 3 Column Section — Perfect Top Alignment (items-start) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start pb-12 border-b border-slate-800/60">
          
          {/* Column 1: Logo & Company Description (5 cols) */}
          <div className="md:col-span-6 lg:col-span-5 space-y-5">
            {/* Logo Image */}
            <Link href="/" className="inline-block group">
              <Image
                src="/sriarumugamlogo.png"
                alt={shopName}
                width={220}
                height={75}
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Description Text */}
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md font-sans">
              We are the leading supplier of Sparklers, Ground Chakkars, Flower Pots, Fountains, Fancy Crackers, Sound Crackers, Novelty Fireworks, Rockets, Bombs, Twinkling Stars, Elite Crackers, Fancy Deluxe Fountains, Loose Crackers, Electric Crackers, Super Blast Wala Crackers, Fancy Novelties, Multi Colour Shots, Aerial Colour Novelties, Comets and Fireworks Combo Box.
            </p>

            {/* Branded Social Media Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61550216464067&mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 rounded-xl bg-[#1e2230] border border-slate-800 hover:bg-[#1877F2] hover:border-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/SAPP_SIVAKASI?s=08"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-11 h-11 rounded-xl bg-[#1e2230] border border-slate-800 hover:bg-black hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/sriarumugampyropark/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 rounded-xl bg-[#1e2230] border border-slate-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:border-transparent text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@SriArumugamPyroPark?si=a1eqqiWAc2RU7VIX"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-11 h-11 rounded-xl bg-[#1e2230] border border-slate-800 hover:bg-[#FF0000] hover:border-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-5 md:pl-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-[family-name:var(--font-outfit)]">
              Quick Link
            </h3>
            <ul className="space-y-3 text-base sm:text-lg text-slate-300 font-medium">
              {[
                { href: '/', label: 'Home' },
                { href: '/#product-list', label: 'Products' },
                { href: '/safety-tips', label: 'Safety Tips' },
                { href: '/payment-info', label: 'Payment Information' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 hover:text-amber-400 transition-colors"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contacts Info (4 cols) */}
          <div className="md:col-span-3 lg:col-span-4 space-y-5">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-[family-name:var(--font-outfit)]">
              Contacts
            </h3>
            <div className="space-y-4 text-base sm:text-lg text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="leading-relaxed">
                  <p className="font-semibold text-slate-200">4/2017, 56 House Colony,</p>
                  <p>Nalan Crackers Backside,</p>
                  <p>Sivakasi - 626 189</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-x-2.5 font-medium">
                  <a href="tel:+918682913516" className="hover:text-amber-400 transition-colors">+91 8682913516</a>
                  <span className="text-slate-500">•</span>
                  <a href="tel:+916374041238" className="hover:text-amber-400 transition-colors">+91 6374041238</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:sriarumugampyropark.svks@gmail.com" className="hover:text-amber-400 transition-colors break-all font-medium text-sm sm:text-base">
                  sriarumugampyropark.svks@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Full-Width Store Location Map */}
        <div className="py-8 border-b border-slate-800/60">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-white tracking-wide font-[family-name:var(--font-outfit)]">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>Store Location Map — Sri Arumugam Pyro Park Sivakasi</span>
            </div>
            <a
              href="https://www.google.com/maps/place/Sri+Arumugam+Pyro+Park/data=!4m2!3m1!1s0x0:0xfac1f45c99ab30ef?sa=X&ved=1t:2428&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all px-4 py-2 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <a
            href="https://www.google.com/maps/place/Sri+Arumugam+Pyro+Park/data=!4m2!3m1!1s0x0:0xfac1f45c99ab30ef?sa=X&ved=1t:2428&ictx=111"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 shadow-2xl transition-all duration-300"
            title="Click to open store location in Google Maps"
          >
            <div className="relative w-full h-[250px] sm:h-[300px]">
              <iframe
                src="https://maps.google.com/maps?q=Sri+Arumugam+Pyro+Park+Sivakasi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full pointer-events-none"
                title="Sri Arumugam Pyro Park Sivakasi Map"
              />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-3 right-3 z-10 bg-slate-950/90 backdrop-blur-md text-slate-200 border border-slate-700/80 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-400 transition-all duration-300 shadow-md">
                <MapPin className="w-4 h-4 text-amber-400 group-hover:text-slate-950" />
                <span>Click map for live directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </a>
        </div>

        {/* Legal Disclaimer Container */}
        <div className="py-8">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#1a1e2b]/80 border-l-4 border-amber-500 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Legal & Statutory Compliance Notice</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              As per 2018 supreme court order, online sale of firecrackers are not permitted! We value our customers and at the same time, respect jurisdiction. We request you to add your products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call. Please add and submit your enquiries and enjoy your Diwali with Sri Arumugam Pyro Park. Our License No.----.  Shop as a company following 100% legal & statutory compliances and all our shops, go-downs are maintained as per the explosive acts. We send the parcels through registered and legal transport service providers as like every other major companies in Sivakasi is doing so.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
          <div>
            Copyright © sri arumugampyropark all rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700">|</span>
            <button
              onClick={handleScrollTop}
              className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer"
              title="Go to top of page"
            >
              <span>Top</span>
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
