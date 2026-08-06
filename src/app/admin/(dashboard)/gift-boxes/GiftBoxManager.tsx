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
            <Gift className="w-7 h-7 text-amber-600" /> Gift Box Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage multi-item family crackers gift boxes, image arrays, and included item quantities.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Gift Box
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
                    {box.is_featured ? '⭐ Featured Box' : 'Gift Box'}
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
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" /> {editingBox ? 'Edit Gift Box' : 'Create New Gift Box'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gift Box Name *</label>
                  <input
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Diwali Mega Celebration Box"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Slug *</label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="diwali-mega-box"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Complete family cracker assortment with 45+ varieties..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Box Discount (%)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Multiple Images List */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <label className="block font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-600" /> Gift Box Images Array
                </label>

                <div className="flex flex-wrap gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 group">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:scale-110 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <label className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl cursor-pointer shrink-0">
                    {uploadingImg ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Or paste image URL"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addCustomImage}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Included Contents Breakdown */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <label className="block font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-amber-600" /> Included Items Breakdown ({contents.length})
                </label>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {contents.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded text-[11px]">{item.quantity}</span>
                        <button type="button" onClick={() => removeContentItem(idx)} className="text-red-500 hover:text-red-700 cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    placeholder="Item name (e.g. 1000 Sound Cracker)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    placeholder="Qty (e.g. 1 Box / 10 Pcs)"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    className="w-36 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addContentItem}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl shrink-0 cursor-pointer"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>Active on Storefront</span>
                </label>

                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>Featured Badge</span>
                </label>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl font-bold text-xs flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-md shadow-orange-500/20"
              >
                {loading ? 'Saving Gift Box...' : editingBox ? 'Update Gift Box' : 'Create Gift Box'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
