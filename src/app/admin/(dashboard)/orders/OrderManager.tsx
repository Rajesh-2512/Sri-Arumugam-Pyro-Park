'use client';

import { useState, useMemo } from 'react';
import type { Order, OrderStatus } from '@/types/order';
import { updateOrderStatus } from '@/services/order.actions';
import { formatCurrency } from '@/lib/utils';
import { Phone, MapPin, MessageSquare, Check, Clock, Truck, CheckCircle2, XCircle, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw, X, Eye, Package, ChevronDown } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

const statusOptions: { value: OrderStatus; label: string; icon: any; color: string }[] = [
  { value: 'pending', label: 'Pending Review', icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'confirmed', label: 'Confirmed', icon: Check, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { value: 'processing', label: 'Processing Pack', icon: Clock, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { value: 'dispatched', label: 'Dispatched', icon: Truck, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-700 bg-red-50 border-red-200' },
];

interface CustomStatusDropdownProps {
  orderId: string;
  currentStatus: OrderStatus;
  disabled: boolean;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

function CustomStatusDropdown({ orderId, currentStatus, disabled, onStatusChange }: CustomStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const currentObj = statusOptions.find((s) => s.value === currentStatus) || statusOptions[0];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase border flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs ${currentObj.color}`}
      >
        <span>{currentObj.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* Backdrop overlay to close dropdown */}
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />

          {/* Floating Options Menu */}
          <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-30 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            {statusOptions.map((opt) => {
              const isSelected = opt.value === currentStatus;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onStatusChange(orderId, opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${opt.color} ${
                    isSelected ? 'ring-2 ring-slate-900/10 shadow-xs' : 'opacity-85 hover:opacity-100 hover:scale-[1.02]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {opt.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-slate-800" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Helper to format WhatsApp Thank You message template
function getWhatsAppThankYouLink(order: Order) {
  const shortId = order.id.split('-')[0].toUpperCase();
  const itemsSummary = order.order_items && order.order_items.length > 0
    ? order.order_items.map((i) => `• ${i.product_name} (${i.quantity} qty)`).join('\n')
    : '';

  const text = `Dear ${order.customer_name},

Thank you for your purchase with Sri Arumugam Pyro Park Sivakasi! 🎆✨

🧾 Order ID: #${shortId}
💰 Total Amount: ${formatCurrency(order.total_amount)}
🚚 Status: ${order.status.toUpperCase()}

${itemsSummary ? `Ordered Items:\n${itemsSummary}\n\n` : ''}Thank you for trusting our Sivakasi Direct Factory Outlet! We truly appreciate your order.

Warm regards,
Sri Arumugam Pyro Park
📞 Contact: +91 8682913516 / 6374041238`;

  const cleanPhone = order.phone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
}

export default function OrderManager({ orders }: { orders: Order[] }) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Search & Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          !searchQuery ||
          o.customer_name.toLowerCase().includes(query) ||
          o.phone.includes(query) ||
          o.id.toLowerCase().includes(query) ||
          o.city.toLowerCase().includes(query) ||
          o.address.toLowerCase().includes(query);

        const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;
        let valA: any = a[sortColumn as keyof Order];
        let valB: any = b[sortColumn as keyof Order];

        if (sortColumn === 'created_at') {
          valA = new Date(a.created_at).getTime();
          valB = new Date(b.created_at).getTime();
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = (valB || '').toString().toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [orders, searchQuery, selectedStatus, sortColumn, sortDirection]);

  const renderSortIcon = (col: string) => {
    if (sortColumn !== col) return <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-600 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-600 font-bold" />
    );
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatus(orderId, status);
    setUpdatingId(null);
    if (!res.success) {
      alert('Failed to update status: ' + res.error);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 overflow-hidden">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-3 shrink-0">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders Management</h1>
        <p className="text-xs text-slate-500 font-medium">Manage placed customer orders, update tracking status, and share WhatsApp thank you messages</p>
      </div>

      {/* Top Filter & Search Controls Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3 shrink-0 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, order ID, or city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        {(searchQuery || selectedStatus !== 'all' || sortColumn) && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedStatus('all'); setSortColumn(null); }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-bold px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}

        <span className="ml-auto text-slate-400 text-[11px] font-bold">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* Orders Table View with Clickable Sort Headers & Internal Scroll */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto flex-1 h-full">
          <table className="w-full text-left text-xs text-slate-700 relative">
            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200/80 shadow-2xs">
              <tr>
                <th
                  onClick={() => handleSort('created_at')}
                  className="py-4 px-6 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Order ID & Date</span>
                    {renderSortIcon('created_at')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('customer_name')}
                  className="py-4 px-6 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Customer & Contact</span>
                    {renderSortIcon('customer_name')}
                  </div>
                </th>
                <th className="py-4 px-6 bg-slate-50">Delivery Address</th>
                <th className="py-4 px-6 bg-slate-50">Items List</th>
                <th
                  onClick={() => handleSort('total_amount')}
                  className="py-4 px-6 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Total Amount</span>
                    {renderSortIcon('total_amount')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-4 px-6 text-right bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Status & Action</span>
                    {renderSortIcon('status')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const shortId = order.id.split('-')[0].toUpperCase();
                  const totalItemsCount = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                  const waUrl = getWhatsAppThankYouLink(order);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 block w-fit text-xs">
                          #{shortId}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {new Date(order.created_at).toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-extrabold text-slate-900 block text-sm">{order.customer_name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <a href={`tel:+91${order.phone}`} className="text-slate-600 font-medium hover:text-amber-600">
                            {order.phone}
                          </a>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-lg font-extrabold text-[11px] hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-pointer hover:scale-105 shadow-2xs"
                            title="Send Thank You & Order Summary template on WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 cursor-pointer" /> WhatsApp Thank You
                          </a>
                        </div>
                      </td>

                      <td className="py-4 px-6 max-w-xs">
                        <p className="font-medium text-slate-700">{order.address}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{order.city} - {order.pincode}</p>
                        {order.notes && <p className="text-amber-600 italic text-[10px] mt-0.5">"{order.notes}"</p>}
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedOrderForModal(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 font-extrabold text-xs transition-all cursor-pointer hover:scale-105 shadow-2xs active:scale-95"
                          title="Click to open full order items popup"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-600 cursor-pointer" />
                          View Items ({totalItemsCount})
                        </button>
                      </td>

                      <td className="py-4 px-6 font-black text-slate-900 text-sm">
                        {formatCurrency(order.total_amount)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <CustomStatusDropdown
                          orderId={order.id}
                          currentStatus={order.status}
                          disabled={updatingId === order.id}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No orders found matching your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Separate Order Items Popup Modal Table */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-slate-900">
                      Order #{selectedOrderForModal.id.split('-')[0].toUpperCase()}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      ({new Date(selectedOrderForModal.created_at).toLocaleString('en-IN')})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Customer: <strong className="text-slate-900">{selectedOrderForModal.customer_name}</strong> ({selectedOrderForModal.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Summary Banner */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-700 space-y-1.5 shrink-0">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-bold text-slate-900">Delivery Address:</span>
                <span className="text-slate-600">{selectedOrderForModal.address}, {selectedOrderForModal.city} - {selectedOrderForModal.pincode}</span>
              </p>
              {selectedOrderForModal.notes && (
                <p className="text-amber-700 italic pl-5">Note: "{selectedOrderForModal.notes}"</p>
              )}
            </div>

            {/* Popup Table of Items */}
            <div className="flex-1 min-h-0 border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs flex flex-col bg-white">
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left text-xs text-slate-700 relative">
                  <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200 shadow-2xs">
                    <tr>
                      <th className="py-3 px-4 bg-slate-50">Item Name</th>
                      <th className="py-3 px-4 text-center bg-slate-50">Unit Price</th>
                      <th className="py-3 px-4 text-center bg-slate-50">Quantity</th>
                      <th className="py-3 px-4 text-right bg-slate-50">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrderForModal.order_items?.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {item.product_name}
                        </td>
                        <td className="py-3 px-4 text-center text-slate-600 font-medium">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="py-3 px-4 text-center font-extrabold text-amber-700">
                          ×{item.quantity}
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer with WhatsApp Share Action */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 shrink-0 gap-3">
              <div>
                <span className="text-xs text-slate-400 uppercase font-extrabold tracking-wider block">Total Amount</span>
                <span className="text-2xl font-black text-emerald-600">
                  {formatCurrency(selectedOrderForModal.total_amount)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppThankYouLink(selectedOrderForModal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer hover:scale-105 flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white cursor-pointer" />
                  <span>Send Thank You on WhatsApp</span>
                </a>

                <button
                  onClick={() => setSelectedOrderForModal(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-105"
                >
                  Close Window
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
