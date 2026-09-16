'use client';

import { useState } from 'react';
import type { Category, WalkInProduct } from '@/types/product';
import { createWalkInProduct, deleteWalkInProduct, updateWalkInProduct } from '@/services/walk-in-product.actions';
import { uploadProductImage } from '@/services/product.actions';
import { formatCurrency, getAllProductImages } from '@/lib/utils';
import { Edit2, Plus, Store, Trash2, Upload, X } from 'lucide-react';

interface Props {
  products: WalkInProduct[];
  categories: Category[];
}

export default function WalkInProductManager({ products, categories }: Props) {
  const [editingProduct, setEditingProduct] = useState<WalkInProduct | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const openCreate = () => {
    setEditingProduct(null);
    setImageUrls([]);
    setCustomUrlInput('');
    setMessage(null);
    setIsOpen(true);
  };

  const openEdit = (product: WalkInProduct) => {
    setEditingProduct(product);
    setImageUrls(getAllProductImages(product.image_url));
    setCustomUrlInput('');
    setMessage(null);
    setIsOpen(true);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    formData.set('image_url', JSON.stringify(imageUrls));
    const result = editingProduct
      ? await updateWalkInProduct(editingProduct.id, formData)
      : await createWalkInProduct(formData);
    setLoading(false);

    if (!result.success) {
      setMessage(result.error || 'Unable to save product.');
      return;
    }

    setIsOpen(false);
    window.location.reload();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadProductImage(formData);
    setUploadingImage(false);
    if (result.success && result.url) setImageUrls((current) => [...current, result.url!]);
    else setMessage(result.error || 'Failed to upload image.');
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this walk-in product?')) return;
    const result = await deleteWalkInProduct(id);
    if (!result.success) setMessage(result.error || 'Unable to delete product.');
    else window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Walk-in POS Prices</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Separate prices for counter sales. These do not change online product prices.</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Walk-in Product
        </button>
      </div>

      {message && <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">{message}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase tracking-wider font-black">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Walk-in Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Store className="w-4 h-4" /></div>
                      <div><p className="font-black text-slate-900">{product.name}</p><p className="text-[11px] text-slate-500">{product.description || 'No description'}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{product.categories?.name || 'Uncategorized'}</td>
                  <td className="px-5 py-4 font-black text-emerald-700">{formatCurrency(product.price)}</td>
                  <td className="px-5 py-4 font-bold text-slate-700">{product.stock}</td>
                  <td className="px-5 py-4"><span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${product.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{product.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(product)} title="Edit" className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer"><Edit2 className="w-4 h-4" /></button><button onClick={() => remove(product.id)} title="Delete" className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-medium">No walk-in products yet. Add the first counter price.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <form onSubmit={submit} className="w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between"><div><h2 className="text-lg font-black text-slate-900">{editingProduct ? 'Edit Walk-in Product' : 'Add Walk-in Product'}</h2><p className="text-xs text-slate-500 mt-1">This price is used only by POS billing.</p></div><button type="button" onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 cursor-pointer"><X className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              <div className="lg:col-span-7 space-y-4">
                <label className="block font-black text-slate-700 uppercase">Product Name *<input name="name" defaultValue={editingProduct?.name || ''} required className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900" /></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="font-black text-slate-700 uppercase">Walk-in Price *<input name="price" type="number" min="0" step="0.01" defaultValue={editingProduct?.price ?? 0} required className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900" /></label>
                  <label className="font-black text-slate-700 uppercase">Stock Quantity *<input name="stock" type="number" min="0" step="1" defaultValue={editingProduct?.stock ?? 100} required className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900" /></label>
                </div>
                <label className="block font-black text-slate-700 uppercase">Product Discount %<input name="discount" type="number" min="0" max="100" step="0.5" defaultValue={editingProduct?.discount ?? 0} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900" /></label>
                <label className="block font-black text-slate-700 uppercase">Category<select name="category_id" defaultValue={editingProduct?.category_id || 'none'} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900"><option value="none">-- Select Category (Uncategorized) --</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                <label className="block font-black text-slate-700 uppercase">Description<textarea name="description" rows={5} defaultValue={editingProduct?.description || ''} placeholder="Enter detailed product description, safety instructions, or box specifications..." className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900" /></label>
                <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-extrabold text-slate-800"><input name="is_active" type="checkbox" value="true" defaultChecked={editingProduct?.is_active ?? true} className="h-4 w-4 accent-emerald-600" /> Active (Visible in POS billing)</label>
              </div>
              <div className="lg:col-span-5 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3"><span className="font-extrabold uppercase tracking-wider text-slate-900"><Upload className="mr-2 inline w-4 h-4 text-emerald-600" /> Product Media ({imageUrls.length})</span></div>
                <div className="h-44 rounded-2xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center overflow-hidden">{imageUrls.length > 0 ? <img src={imageUrls[0]} alt="Main preview" className="w-full h-full object-contain p-2" /> : <div className="text-center text-slate-400"><Upload className="mx-auto mb-2 h-8 w-8 text-slate-300" /><span className="block text-xs font-bold">No image uploaded yet</span></div>}</div>
                {imageUrls.length > 0 && <div className="grid grid-cols-4 gap-2">{imageUrls.map((url, index) => <div key={url} className="relative aspect-square overflow-hidden rounded-xl border-2 border-emerald-300 bg-white"><img src={url} alt={`Image ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => setImageUrls((current) => current.filter((_, currentIndex) => currentIndex !== index))} className="absolute inset-0 flex items-center justify-center bg-red-600/80 text-white opacity-0 hover:opacity-100 cursor-pointer"><Trash2 className="h-4 w-4" /></button></div>)}</div>}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="walk-in-image-upload" /><label htmlFor="walk-in-image-upload" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white py-3 font-extrabold text-emerald-900"><Upload className="h-4 w-4" /> {uploadingImage ? 'Uploading Image...' : 'Upload Image File'}</label>
                <div className="flex gap-2"><input type="text" value={customUrlInput} onChange={(event) => setCustomUrlInput(event.target.value)} placeholder="Or paste image URL..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900" /><button type="button" onClick={() => { if (customUrlInput.trim()) { setImageUrls((current) => [...current, customUrlInput.trim()]); setCustomUrlInput(''); } }} className="rounded-xl bg-emerald-600 px-3 py-2 font-black text-white cursor-pointer">Add URL</button></div>
              </div>
            </div>
            <div className="flex justify-end gap-3"><button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer">Cancel</button><button type="submit" disabled={loading} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black disabled:opacity-60 cursor-pointer">{loading ? 'Saving...' : 'Save Product'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
