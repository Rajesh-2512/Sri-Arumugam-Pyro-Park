'use client';

import { useState } from 'react';
import type { GiftBox, GiftBoxItemContent } from '@/types/giftbox';
import { createGiftBox, updateGiftBox, deleteGiftBox } from '@/services/giftbox.actions';
import { uploadProductImage } from '@/services/product.actions';
import { Gift, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon, X, Loader2, Star, Eye, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Props {
  initialGiftBoxes: GiftBox[];
}

export default function GiftBoxManager({ initialGiftBoxes }: Props) {
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>(initialGiftBoxes);
  const [isOpen, setIsOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<GiftBox | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(2999);
  const [discount, setDiscount] = useState(80);
  const [stock, setStock] = useState(100);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [contents, setContents] = useState<GiftBoxItemContent[]>([
    { name: 'Multi-Color Sky Shots (12 Shots)', quantity: '1 Box' },
    { name: 'Electric Sparklers (10cm)', quantity: '2 Boxes' },
    { name: 'Ground Chakkars Special', quantity: '10 Pcs' },
    { name: 'Flower Pots Deluxe', quantity: '5 Pcs' },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');

  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openCreateModal = () => {
    setEditingBox(null);
    setName('');
    setSlug('');
    setDescription('');
    setPrice(2999);
    setDiscount(80);
    setStock(100);
    setIsActive(true);
    setIsFeatured(false);
    setImages(['/carousel-2.png']);
    setContents([
      { name: 'Multi-Color Sky Shots', quantity: '1 Box' },
      { name: 'Electric Sparklers 10cm', quantity: '2 Boxes' },
      { name: 'Ground Chakkars Deluxe', quantity: '10 Pcs' },
      { name: 'Flower Pots Giant', quantity: '5 Pcs' },
    ]);
    setMessage(null);
    setIsOpen(true);
  };

  const openEditModal = (box: GiftBox) => {
    setEditingBox(box);
    setName(box.name);
    setSlug(box.slug);
    setDescription(box.description || '');
    setPrice(box.price);
    setDiscount(box.discount || 0);
    setStock(box.stock || 100);
    setIsActive(box.is_active);
    setIsFeatured(box.is_featured);
    setImages(box.images || []);
    setContents(box.contents || []);
    setMessage(null);
    setIsOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingBox) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadProductImage(formData);
    setUploadingImg(false);

    if (res.success && res.url) {
      setImages((prev) => [...prev, res.url!]);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to upload image' });
    }
  };

  const addCustomImage = () => {
    if (!customImageUrl.trim()) return;
    setImages((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const addContentItem = () => {
    if (!newItemName.trim()) return;
    setContents((prev) => [...prev, { name: newItemName.trim(), quantity: newItemQty.trim() || '1 Box' }]);
    setNewItemName('');
    setNewItemQty('');
  };

  const removeContentItem = (idx: number) => {
    setContents((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      price: Number(price),
      discount: Number(discount),
      stock: Number(stock),
      images,
      contents,
      is_active: isActive,
      is_featured: isFeatured,
    };

    let res;
    if (editingBox) {
      res = await updateGiftBox(editingBox.id, payload);
    } else {
      res = await createGiftBox(payload);
    }

    setLoading(false);

    if (res.success) {
      setMessage({ type: 'success', text: editingBox ? 'Gift box updated!' : 'Gift box created!' });
      setTimeout(() => {
        setIsOpen(false);
        window.location.reload();
      }, 1000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string, boxName: string) => {
    if (!confirm(`Are you sure you want to delete gift box "${boxName}"?`)) return;

    const res = await deleteGiftBox(id);
    if (res.success) {
      setGiftBoxes((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert(res.error || 'Failed to delete gift box');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Gift className="w-7 h-7 text-amber-600" /> Combo Box Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage multi-item family crackers combo boxes, image arrays, and included item quantities.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Combo Box
        </button>
      </div>

      {/* Gift Boxes Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {giftBoxes.map((box) => (
          <div
            key={box.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    {box.is_featured ? '⭐ Featured Combo' : 'Combo Box'}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{box.name}</h3>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openEditModal(box)}
                    className="p-2 text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-xl transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(box.id, box.name)}
                    className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2">{box.description || 'No description provided.'}</p>

              {/* Price & Items Summary */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">MRP Price</span>
                  <span className="font-extrabold text-slate-900">{formatCurrency(box.price)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Discount</span>
                  <span className="font-extrabold text-emerald-600">{box.discount}% OFF</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Varieties</span>
                  <span className="font-extrabold text-amber-600">{box.contents?.length || 0} Items</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className={`font-bold ${box.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                {box.is_active ? '🟢 Active on Storefront' : '🔴 Disabled'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{box.stock} in stock</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-6xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Gift className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {editingBox ? `Edit Combo Box: ${editingBox.name}` : 'Create New Combo Box Pack'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure combo box pricing, cracker varieties included, and product images
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              
              {/* Spacious 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN (6-Cols): Combo Specifications & Media */}
                <div className="lg:col-span-6 space-y-4">
                  
                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">Combo Box Name *</label>
                    <input
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Diwali Mega Celebration Box"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-black text-slate-700 uppercase mb-1">MRP Price (₹) *</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-black focus:bg-white focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-black text-slate-700 uppercase mb-1">Discount (%)</label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-black text-emerald-600 focus:bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-slate-700 uppercase mb-1">Stock Qty</label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-black focus:bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 uppercase mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Complete family cracker assortment with 45+ varieties..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Multiple Images List */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-200/80">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <label className="block font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-amber-600" /> Combo Box Images ({images.length})
                      </label>
                    </div>

                    {images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-2xl bg-white border-2 border-amber-300 overflow-hidden shrink-0 group shadow-2xs">
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Delete Image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {idx === 0 && (
                              <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-white font-black text-[9px] text-center py-0.5 uppercase">
                                MAIN
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <label className="px-4 py-2 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 font-extrabold rounded-xl cursor-pointer shrink-0 transition-colors shadow-2xs">
                        {uploadingImg ? 'Uploading...' : 'Upload Image'}
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                      <input
                        type="url"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="Or paste image URL"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={addCustomImage}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl cursor-pointer shadow-2xs transition-colors shrink-0"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-1 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                      />
                      <span>Active on Storefront</span>
                    </label>

                    <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                      />
                      <span>Featured Badge</span>
                    </label>
                  </div>

                </div>

                {/* RIGHT COLUMN (6-Cols): Included Items Builder Desk */}
                <div className="lg:col-span-6 space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200/80 h-full flex flex-col">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
                    <label className="block font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Package className="w-4.5 h-4.5 text-amber-600" /> Included Cracker Varieties Breakdown ({contents.length})
                    </label>
                    <span className="text-[11px] text-amber-700 font-extrabold bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {contents.length} Varieties Inside
                    </span>
                  </div>

                  {/* Add New Variety Bar */}
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-2xs shrink-0">
                    <span className="text-[11px] font-extrabold text-slate-600 uppercase block">Add Cracker Variety</span>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        placeholder="Variety Name (e.g. 12 Shot Sky Shots)"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                      />
                      <input
                        placeholder="Qty (e.g. 1 Box / 10 Pcs)"
                        value={newItemQty}
                        onChange={(e) => setNewItemQty(e.target.value)}
                        className="w-full sm:w-36 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={addContentItem}
                        className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shrink-0 cursor-pointer shadow-2xs transition-all"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Included Items Scrollable List */}
                  <div className="space-y-2 max-h-[340px] min-h-[220px] overflow-y-auto pr-1 flex-1">
                    {contents.length === 0 ? (
                      <div className="h-full flex items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white text-slate-400 font-bold text-xs">
                        No cracker varieties added yet. Use the bar above to add items to this combo box.
                      </div>
                    ) : (
                      contents.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200/80 text-xs shadow-2xs hover:border-amber-300 transition-colors">
                          <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-xl text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => removeContentItem(idx)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>

              </div>

              {message && (
                <div className={`p-4 rounded-2xl font-bold text-xs flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-95"
                >
                  {loading ? 'Saving Gift Box...' : editingBox ? 'Save Combo Box Changes' : 'Create Combo Box Now'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
