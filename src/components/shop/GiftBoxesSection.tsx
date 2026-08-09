'use client';

import { useState, useEffect } from 'react';
import { GiftBox } from '@/types/giftbox';
import { useCartStore } from '@/store/cart.store';
import { formatCurrency } from '@/lib/utils';
import {
  Gift,
  CheckCircle2,
  ShoppingBag,
  X,
  Plus,
  Minus,
  Sparkles,
  PackageCheck,
  Eye,
  Check,
} from 'lucide-react';
import SafeProductImage from './SafeProductImage';

interface Props {
  giftBoxes: GiftBox[];
  globalDiscount: number;
}

export default function GiftBoxesSection({ giftBoxes, globalDiscount }: Props) {
  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const [selectedBox, setSelectedBox] = useState<GiftBox | null>(null);
  const [modalQty, setModalQty] = useState<number>(1);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!giftBoxes || giftBoxes.length === 0) return null;

  const handleOpenModal = (box: GiftBox) => {
    setSelectedBox(box);
    const existing = cartItems.find((i) => i.id === box.id);
    setModalQty(existing ? existing.quantity : 1);
    setActiveImgIdx(0);
  };

  const handleCloseModal = () => {
    setSelectedBox(null);
  };

  const handleAddToCart = (box: GiftBox, finalPrice: number, qty: number = 1) => {
    const mainImg = (box.images && box.images.length > 0) ? box.images[0] : '/carousel-2.png';
    const existing = cartItems.find((i) => i.id === box.id);

    if (existing) {
      updateQuantity(box.id, existing.quantity + qty);
    } else {
      for (let i = 0; i < qty; i++) {
        addItem({
          id: box.id,
          name: box.name,
          image_url: mainImg,
          price: box.price,
          finalPrice: finalPrice,
          stock: box.stock || 100,
        });
      }
    }

    setAddedIds((prev) => ({ ...prev, [box.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [box.id]: false }));
    }, 1800);
  };

  return (
    <section id="gift-boxes" className="py-12 sm:py-16 bg-gradient-to-b from-amber-50/40 via-orange-50/20 to-white rounded-3xl my-8 border border-amber-200/80 shadow-xs px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Subtle Flare */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header — Perfectly Centered Stack */}
      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-3 mb-10 relative z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-orange-700 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-2xs">
            <Gift className="w-3.5 h-3.5 text-orange-600" /> EXCLUSIVE FAMILY PACKS
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
          FESTIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-600 to-red-600">COMBO PACKS</span>
        </h2>
        
        <div className="h-1 w-20 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-full shadow-xs" />

        <p className="text-xs sm:text-sm text-slate-600 font-medium pt-1 max-w-xl">
          Pre-defined high value assorted cracker boxes for grand family celebrations
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto relative z-10">
        {giftBoxes.map((box) => {
          const effectiveDisc = (box.discount && box.discount > 0) ? box.discount : globalDiscount;
          const finalPrice = Math.round(box.price * (1 - effectiveDisc / 100));
          const totalDisc = Math.round(effectiveDisc);
          const imagesList = (box.images && box.images.length > 0) ? box.images : ['/carousel-2.png'];
          const mainImg = imagesList[0];
          const isJustAdded = addedIds[box.id];
          const totalItemsCount = box.contents?.length || 0;

          const inCartItem = mounted ? cartItems.find((i) => i.id === box.id) : undefined;
          const inCartQty = inCartItem ? inCartItem.quantity : 0;

          return (
            <div
              key={box.id}
              onClick={() => handleOpenModal(box)}
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer hover:-translate-y-1 relative ${
                inCartQty > 0
                  ? 'border-amber-500 shadow-lg ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl'
              }`}
            >
              {/* Card Image Header */}
              <div className="relative w-full h-64 sm:h-72 bg-slate-50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
                
                {/* Discount Badge (Saffron-Red Gradient) */}
                {totalDisc > 0 && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-md z-10 uppercase tracking-wider">
                    -{totalDisc}% OFF
                  </span>
                )}

                {/* Persistent In-Cart Badge Top Right (Warm Amber/Saffron Theme) */}
                {inCartQty > 0 && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-md z-10 flex items-center gap-1.5 uppercase tracking-wider animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" /> {inCartQty} IN CART
                  </span>
                )}

                {/* Poster Image */}
                <div className="relative w-full h-full">
                  <SafeProductImage
                    src={mainImg}
                    alt={box.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Quick View Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-slate-900 font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 border border-slate-200">
                    <Eye className="w-4 h-4 text-orange-600" /> Click to View Full Details
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 space-y-3">
                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">
                  {totalItemsCount > 0 ? `${totalItemsCount} Cracker Varieties Included` : 'Assorted Family Pack'}
                </span>

                <h3 className="text-lg font-black text-slate-900 uppercase group-hover:text-orange-600 transition-colors">
                  {box.name}
                </h3>

                <div className="flex items-baseline gap-2.5 pt-1">
                  <span className="text-xl sm:text-2xl font-black text-orange-600">
                    {formatCurrency(finalPrice)}
                  </span>
                  {box.price > finalPrice && (
                    <span className="text-xs text-slate-400 line-through font-semibold">
                      {formatCurrency(box.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Action Controls — Warm Saffron / Orange Theme */}
              <div className="p-6 pt-0">
                {inCartQty > 0 ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between bg-amber-50/80 border border-amber-200 rounded-2xl p-1.5 shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => updateQuantity(box.id, inCartQty - 1)}
                      className="w-10 h-10 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 flex items-center justify-center font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-black text-amber-950 text-xs uppercase tracking-wider">
                      {inCartQty} Box{inCartQty > 1 ? 'es' : ''} in Cart
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(box.id, inCartQty + 1)}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white hover:from-amber-600 hover:to-red-700 flex items-center justify-center font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(box, finalPrice);
                    }}
                    className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isJustAdded
                        ? 'bg-amber-600 text-white shadow-amber-500/30'
                        : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 animate-bounce" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add Combo Pack
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ─── FULL DETAILS MODAL POPUP ─── */}
      {selectedBox && (() => {
        const effectiveDisc = (selectedBox.discount && selectedBox.discount > 0) ? selectedBox.discount : globalDiscount;
        const finalPrice = Math.round(selectedBox.price * (1 - effectiveDisc / 100));
        const totalDisc = Math.round(effectiveDisc);
        const imagesList = (selectedBox.images && selectedBox.images.length > 0) ? selectedBox.images : ['/carousel-2.png'];
        const currentModalImg = imagesList[activeImgIdx] || imagesList[0];
        const isJustAdded = addedIds[selectedBox.id];
        
        const inCartItem = mounted ? cartItems.find((i) => i.id === selectedBox.id) : undefined;
        const inCartQty = inCartItem ? inCartItem.quantity : 0;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden relative my-auto max-h-[90vh] flex flex-col">
              
              {/* Modal Close Header Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto p-6 sm:p-8 space-y-6">

                {/* Top Grid: Image + Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Left: Image Viewer & Carousel */}
                  <div className="space-y-3">
                    <div className="relative w-full h-72 sm:h-80 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                      <SafeProductImage
                        src={currentModalImg}
                        alt={selectedBox.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain"
                      />
                      {totalDisc > 0 && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-md uppercase">
                          -{totalDisc}% OFF
                        </span>
                      )}
                    </div>

                    {/* Image Thumbnails */}
                    {imagesList.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {imagesList.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImgIdx(i)}
                            className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                              i === activeImgIdx ? 'border-orange-500 scale-105' : 'border-slate-200 opacity-70'
                            }`}
                          >
                            <SafeProductImage src={img} alt="thumb" fill sizes="64px" className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Info & Pricing */}
                  <div className="space-y-4">
                    <div>
                      <span className="bg-orange-100 text-orange-900 font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border border-orange-200 inline-block mb-2">
                        OFFICIAL SIVAKASI COMBO PACK
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 uppercase">{selectedBox.name}</h2>
                    </div>

                    {/* Persistent Cart Status Tag */}
                    {inCartQty > 0 && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl font-bold text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>This Combo Box is currently in your cart ({inCartQty} Pack{inCartQty > 1 ? 's' : ''})</span>
                      </div>
                    )}

                    {selectedBox.description && (
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {selectedBox.description}
                      </p>
                    )}

                    {/* Price Breakdown Box */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Factory Wholesale Rate</span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-orange-600">
                          {formatCurrency(finalPrice * modalQty)}
                        </span>
                        {selectedBox.price > finalPrice && (
                          <span className="text-sm text-slate-400 line-through font-semibold">
                            {formatCurrency(selectedBox.price * modalQty)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold block pt-1">
                        ✓ Savings: {formatCurrency((selectedBox.price - finalPrice) * modalQty)} ({totalDisc}% Discount Applied)
                      </span>
                    </div>

                    {/* Quantity Selector & Add Button */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Packs:</span>
                        <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-black text-sm text-slate-900">{modalQty}</span>
                          <button
                            type="button"
                            onClick={() => setModalQty(modalQty + 1)}
                            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (inCartQty > 0) {
                            updateQuantity(selectedBox.id, modalQty);
                          } else {
                            handleAddToCart(selectedBox, finalPrice, modalQty);
                          }
                          handleCloseModal();
                        }}
                        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isJustAdded
                            ? 'bg-amber-600 text-white shadow-amber-500/30'
                            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white shadow-orange-500/25'
                        }`}
                      >
                        <ShoppingBag className="w-5 h-5" /> {inCartQty > 0 ? `Update Cart Quantity (${modalQty})` : `Add ${modalQty} Pack${modalQty > 1 ? 'es' : ''} to Cart (${formatCurrency(finalPrice * modalQty)})`}
                      </button>
                    </div>

                  </div>
                </div>

                {/* Bottom Itemized Breakdown Table */}
                {selectedBox.contents && selectedBox.contents.length > 0 && (
                  <div className="border-t border-slate-200 pt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-orange-600" /> Itemized Cracker Contents ({selectedBox.contents.length} Varieties Included)
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium">Assorted Factory Sealed Pack</span>
                    </div>

                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-4 w-12 text-center">S.No</th>
                            <th className="py-2.5 px-4">Item Name / Cracker Description</th>
                            <th className="py-2.5 px-4 text-right">Quantity Included</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/80">
                          {selectedBox.contents.map((item, idx) => (
                            <tr key={idx} className="hover:bg-white transition-colors">
                              <td className="py-2.5 px-4 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                              <td className="py-2.5 px-4 font-bold text-slate-800">{item.name}</td>
                              <td className="py-2.5 px-4 text-right font-extrabold text-orange-600">{item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })()}

    </section>
  );
}
