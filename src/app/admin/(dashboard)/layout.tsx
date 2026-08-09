'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Settings,
  ExternalLink,
  LogOut,
  Gift,
  FileText,
  MessageSquareHeart,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
  { href: '/admin/billing', label: 'POS Billing Desk', icon: FileText },
  { href: '/admin/products', label: 'Product Inventory', icon: Package },
  { href: '/admin/gift-boxes', label: 'Combo Boxes', icon: Gift },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders', label: 'Orders & Receipts', icon: ShoppingBag },
  { href: '/admin/feedbacks', label: 'Customer Feedbacks', icon: MessageSquareHeart },
  { href: '/admin/settings', label: 'Admin Settings', icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isBillingPage = pathname === '/admin/billing';

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to sign out?')) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#F8FAFC] text-slate-800 selection:bg-amber-500 selection:text-white font-sans">
      
      {/* Icon-Only Compact Sidebar Navigation */}
      <aside className="w-full md:w-20 h-auto md:h-screen bg-white border-b md:border-b-0 md:border-r border-slate-200/80 flex flex-col justify-between items-center py-4 px-2 shrink-0 shadow-2xs z-30">
        
        <div className="flex flex-col items-center w-full space-y-6">
          {/* Logo Badge */}
          <Link
            href="/admin"
            className="relative group flex items-center justify-center"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform cursor-pointer">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white font-black text-xs rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
              Admin Portal • Crackers Shop
            </span>
          </Link>

          {/* Navigation Links with Hover Tooltips */}
          <nav className="flex flex-col items-center w-full space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));

              return (
                <div key={item.href} className="relative group flex items-center justify-center w-full">
                  <Link
                    href={item.href}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-md shadow-orange-500/25 scale-105'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                  </Link>

                  {/* Sleek Tooltip */}
                  <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white font-black text-xs rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Action Icons */}
        <div className="flex flex-col items-center w-full space-y-2 pt-4 border-t border-slate-100">
          
          {/* Storefront Tooltip Link */}
          <div className="relative group flex items-center justify-center w-full">
            <Link
              href="/"
              target="_blank"
              className="w-11 h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all border border-slate-200/80 shadow-2xs hover:scale-105"
            >
              <ExternalLink className="w-4 h-4 text-amber-600" />
            </Link>
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white font-black text-xs rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
              View Live Storefront
            </span>
          </div>

          {/* Logout Tooltip Button */}
          <div className="relative group flex items-center justify-center w-full">
            <button
              onClick={handleLogout}
              className="w-11 h-11 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all border border-red-200/80 cursor-pointer hover:scale-105"
            >
              <LogOut className="w-4 h-4 text-red-600" />
            </button>
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white font-black text-xs rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
              Sign Out / Logout
            </span>
          </div>

        </div>

      </aside>

      {/* Main Content Area: Zero padding on Billing POS page for true 100% full height */}
      <main className={`flex-1 flex flex-col h-screen min-h-0 overflow-hidden ${isBillingPage ? 'p-0' : 'p-6 sm:p-8 overflow-y-auto'}`}>
        {children}
      </main>

    </div>
  );
}
