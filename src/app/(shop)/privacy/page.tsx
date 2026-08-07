import Link from 'next/link';
import { ShieldCheck, UserCheck, EyeOff, Cookie, Lock, CheckCircle2, ChevronRight } from 'lucide-react';

import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sriarumugampyropark.com';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sri Arumugam Pyro Park Sivakasi',
  description: 'Privacy policy for Sri Arumugam Pyro Park Sivakasi detailing personal identification data collection, cookies policy, data security, and customer protection.',
  keywords: [
    'sri arumugam pyro park privacy policy',
    'sivakasi crackers privacy policy',
    'sivakasi crackers customer data safety',
  ],
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20 font-sans">
      
      {/* Header Banner */}
      <section className="relative bg-gradient-to-br from-[#12151e] via-[#1a1f2e] to-[#0f1219] text-white py-14 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto space-y-4 z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Safe & Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Sri Arumugam Pyro Park privacy policy clearly tells you the methods we use to collect data, maintain and how we disclose the data from the users we collect.
          </p>
          
          <div className="flex justify-center gap-3 pt-2 text-xs">
            <Link href="/privacy" className="bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-xl shadow-md">
              Privacy Policy
            </Link>
            <Link href="/terms" className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        
        {/* Intro Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h2 className="text-xl font-black text-[#1b2342] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Sri Arumugam Pyro Park Privacy Commitment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Sri Arumugam Pyro Park privacy policy clearly tells you the methods we use to collect data, maintain and how we disclose the data from the users we collect. This privacy policy is applicable to this site and all the products that are included in it and sold by us.
          </p>
        </div>

        {/* Section 1: Personal Identification Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1b2342]">Personal Identification Information</h3>
              <p className="text-xs text-slate-500">How personal details are requested and collected</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            This type of information may be collected to ensure the user-friendliness of the website. Personal identification information will be collected from our users during instances like browsing our site, when they place an order, or during the time when they fill out a form. Details that will be collected mostly include name, email and shipping address and phone number. Collecting information from our side is totally based on user opinion. They can choose to submit or not submit personal information asked on our site.
          </p>
        </div>

        {/* Section 2: Non-personal Identification Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1b2342]">Non-personal Identification Information</h3>
              <p className="text-xs text-slate-500">Technical analytics and browser details</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            This type of data includes the name of the browser being used, the model of the computer and other technical information about the individual using the site. Non-personal identification may be collected by us wherever users surf and interact with our site.
          </p>
        </div>

        {/* Section 3: Browser Cookies */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1b2342]">Browser Cookies</h3>
              <p className="text-xs text-slate-500">User experience optimization</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            We collect cookies and store them to enhance the user experience on our website. However, users may choose to refuse the collection of cookies from their browser settings. Users can also choose to alert themselves during instances of cookies being sent.
          </p>
        </div>

        {/* Section 4: Protection of Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1b2342]">Protection of Information</h3>
              <p className="text-xs text-slate-500">Data encryption and access safety</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            We make sure all data stored on our website is safe. No unauthorized access, disclosure, or alteration of our personal information and other collected information like passwords, or transaction information is possible on our site.
          </p>
        </div>

        {/* Section 5: Policy Acceptance */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1b2342]">Policy Acceptance</h3>
              <p className="text-xs text-slate-500">User agreement terms</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            When users log into our site, they naturally accept our site’s privacy policy. Users can deactivate their account to no longer stay bound by the site’s terms and privacy policy.
          </p>
        </div>

        {/* Navigation Link to Terms of Service */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h4 className="font-extrabold text-base">Looking for Terms of Service?</h4>
            <p className="text-xs text-slate-400">Read order placement rules, shipping terms, and cancellation policies.</p>
          </div>
          <Link
            href="/terms"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0"
          >
            Read Terms of Service <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </main>
    </div>
  );
}
