'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, LayoutDashboard, Package, FolderTree, ShoppingBag, Settings, ExternalLink } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#F8FAFC] text-slate-800 selection:bg-amber-500 selection:text-white font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 h-auto md:h-screen bg-white border-b md:border-b-0 md:border-r border-slate-200/80 flex flex-col justify-between shrink-0 shadow-xs z-20 overflow-y-auto">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg text-slate-900 tracking-tight block leading-tight">Admin Portal</span>
              <span className="block text-[10px] text-amber-600 uppercase font-extrabold tracking-widest mt-0.5">Crackers Shop</span>
            </div>
          </div>

          {/* Navigation Links with Active Highlighting */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-extrabold text-slate-700 transition-all border border-slate-200/80 shadow-2xs hover:scale-[1.01]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" /> View Live Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-h-0 overflow-hidden p-6 sm:p-8">
        {children}
      </main>

    </div>
  );
}
