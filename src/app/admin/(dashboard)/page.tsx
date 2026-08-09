import { adminSupabase } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils';
import { Package, ShoppingBag, FolderTree, Percent, TrendingUp, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const { count: productCount } = await adminSupabase.from('products').select('*', { count: 'exact', head: true });
  const { count: categoryCount } = await adminSupabase.from('categories').select('*', { count: 'exact', head: true });
  const { count: orderCount } = await adminSupabase.from('orders').select('*', { count: 'exact', head: true });

  const { data: pendingOrders } = await adminSupabase
    .from('orders')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  const { data: settings } = await adminSupabase
    .from('global_settings')
    .select('*')
    .single();

  const allActiveOrders = await adminSupabase
    .from('orders')
    .select('*')
    .neq('status', 'cancelled')
    .neq('status', 'refunded');

  const totalRevenue = allActiveOrders.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

  // Calculate total pending balance across partial payment orders
  const totalPendingBalance = allActiveOrders.data?.reduce((sum, o) => {
    if (o.remaining_amount !== undefined && o.remaining_amount !== null) {
      return sum + o.remaining_amount;
    }
    if (o.paid_amount !== undefined && o.paid_amount !== null) {
      return sum + Math.max(0, o.total_amount - o.paid_amount);
    }
    if (o.notes && o.notes.includes('Remaining: ₹')) {
      const match = o.notes.match(/Remaining:\s*₹([\d.]+)/);
      if (match && match[1]) {
        return sum + parseFloat(match[1]);
      }
    }
    return sum;
  }, 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Real-time stats and management for Crackers Shop</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(totalRevenue)}</p>
          <span className="text-[11px] text-slate-400 font-medium">From active & confirmed orders</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-rose-200 bg-gradient-to-br from-white to-rose-50/40 shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Pending Balance</span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-700 tracking-tight">{formatCurrency(totalPendingBalance)}</p>
          <span className="text-[11px] text-rose-600 font-extrabold">Remaining partial payments to collect</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{orderCount || 0}</p>
          <span className="text-[11px] text-amber-600 font-bold">{pendingOrders?.length || 0} pending review</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Products</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{productCount || 0}</p>
          <span className="text-[11px] text-slate-400 font-medium">Listed across categories</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Global Discount</span>
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-2xs">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{settings?.global_discount_percentage || 0}% OFF</p>
          <span className="text-[11px] text-slate-400 font-medium">Applied storewide</span>
        </div>

      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Pending Orders Requiring Review</h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-extrabold text-amber-600 hover:text-amber-700 hover:underline uppercase tracking-wider"
          >
            View All Orders →
          </Link>
        </div>

        {pendingOrders && pendingOrders.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {pendingOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      #{order.id.split('-')[0].toUpperCase()}
                    </span>
                    <span className="font-extrabold text-slate-900">{order.customer_name}</span>
                    <span className="text-slate-500">({order.phone})</span>
                  </div>
                  <p className="text-slate-500 mt-1.5 font-medium">{order.address}, {order.city} - {order.pincode}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-emerald-600 text-sm">{formatCurrency(order.total_amount)}</span>
                  <Link
                    href={`/admin/orders`}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs hover:scale-105 transition-all"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-8 text-center font-medium">No pending orders. All orders are up to date!</p>
        )}
      </div>

    </div>
  );
}
