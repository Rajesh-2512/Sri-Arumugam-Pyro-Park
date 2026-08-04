'use client';

import { useState, useMemo } from 'react';
import type { Product, Category } from '@/types/product';
import { createProduct, updateProduct, deleteProduct, uploadProductImage } from '@/services/product.actions';
import { formatCurrency, getProductImage, getAllProductImages } from '@/lib/utils';
import { Plus, Edit2, Trash2, X, Upload, Flame, CheckCircle2, AlertCircle, Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, RotateCcw } from 'lucide-react';

interface Props {
  products: Product[];
  categories: Category[];
}

export default function ProductManager({ products, categories }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Search & Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'all' || p.category_id === selectedCategory;
        const matchesStatus =
          selectedStatus === 'all' ||
          (selectedStatus === 'active' && p.is_active) ||
          (selectedStatus === 'disabled' && !p.is_active);

        return matchesSearch && matchesCat && matchesStatus;
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;
        let valA: any = a[sortColumn as keyof Product];
        let valB: any = b[sortColumn as keyof Product];

        if (sortColumn === 'category') {
          valA = a.categories?.name || '';
          valB = b.categories?.name || '';
        }

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedStatus, sortColumn, sortDirection]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSortColumn(null);
    setSortDirection('asc');
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-600 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-600 font-bold" />
    );
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setImageUrls([]);
    setCustomUrlInput('');
    setMessage(null);
    setIsOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setImageUrls(getAllProductImages(product.image_url));
    setCustomUrlInput('');
    setMessage(null);
    setIsOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadProductImage(formData);
    setUploadingImage(false);

    if (result.success && result.url) {
      setImageUrls((prev) => [...prev, result.url!]);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to upload image' });
    }
  };

  const handleAddCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setImageUrls((prev) => [...prev, customUrlInput.trim()]);
    setCustomUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set('image_url', JSON.stringify(imageUrls));

    let res;
    if (editingProduct) {
      res = await updateProduct(editingProduct.id, formData);
    } else {
      res = await createProduct(formData);
    }

    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: editingProduct ? 'Product updated!' : 'Product created!' });
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 1000);
    } else {
      setMessage({ type: 'error', text: typeof res.error === 'string' ? res.error : 'Validation failed' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await deleteProduct(id);
    if (!res.success) {
      alert('Delete failed: ' + res.error);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 overflow-hidden">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products Management</h1>
          <p className="text-xs text-slate-500 font-medium">Add, edit, or search and filter crackers from your catalog</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
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
            placeholder="Search by item name or slug..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:bg-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="disabled">Disabled Only</option>
        </select>

        {/* Reset Filters */}
        {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || sortColumn) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-bold px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}

        <span className="ml-auto text-slate-400 text-[11px] font-bold">
          Showing {filteredProducts.length} of {products.length} items
        </span>
      </div>

      {/* Products Table with Clickable Sort Headers & Internal Scroll */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto flex-1 h-full">
          <table className="w-full text-left text-xs text-slate-700 relative">
            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200 shadow-2xs">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Item</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="py-3.5 px-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Category</span>
                    {renderSortIcon('category')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3.5 px-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Base Price</span>
                    {renderSortIcon('price')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('discount')}
                  className="py-3.5 px-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Discount</span>
                    {renderSortIcon('discount')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('stock')}
                  className="py-3.5 px-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Stock</span>
                    {renderSortIcon('stock')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('is_active')}
                  className="py-3.5 px-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    {renderSortIcon('is_active')}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const imgUrl = getProductImage(p.image_url);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {imgUrl ? (
                            <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-500">
                              <Flame className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">/slug: {p.slug}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{p.categories?.name || 'Uncategorized'}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(p.price)}</td>
                    <td className="py-3.5 px-4 font-extrabold text-red-600">{p.discount}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${p.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${p.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        {p.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/80 transition-all cursor-pointer hover:scale-110 shadow-2xs active:scale-95"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 transition-all cursor-pointer hover:scale-110 shadow-2xs active:scale-95"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No products found matching your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create / Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Crackers Product'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  name="name"
                  defaultValue={editingProduct?.name || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Slug (unique, lowercase) *</label>
                <input
                  name="slug"
                  defaultValue={editingProduct?.slug || ''}
                  placeholder="flower-pot-special"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={editingProduct?.price || ''}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Discount (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="discount"
                    defaultValue={editingProduct?.discount || 0}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={editingProduct?.stock ?? 100}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    name="category_id"
                    defaultValue={editingProduct?.category_id || 'none'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="none">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingProduct?.description || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Multi-Image Upload Area */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Product Images ({imageUrls.length})</label>
                
                {/* Existing Image Thumbnails */}
                {imageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {imageUrls.map((url, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group/thumb">
                        <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute inset-0 bg-red-600/70 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-amber-500 text-white text-[8px] font-black text-center py-0.5 uppercase">Main</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload & URL Input */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-2 text-xs"
                  >
                    <Upload className="w-4 h-4 text-amber-600" /> {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </label>
                  <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
                    <input
                      type="text"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomUrl(); } }}
                      placeholder="Or paste image URL..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUrl}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="is_active"
                  value="true"
                  defaultChecked={editingProduct ? editingProduct.is_active : true}
                  id="is_active"
                  className="w-4 h-4 rounded text-amber-500 bg-slate-50 border-slate-300"
                />
                <label htmlFor="is_active" className="font-bold text-slate-700">
                  Active (Visible on public storefront)
                </label>
              </div>

              {message && (
                <div className={`p-3 rounded-xl font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-orange-500/20 hover:scale-[1.01]"
              >
                {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
