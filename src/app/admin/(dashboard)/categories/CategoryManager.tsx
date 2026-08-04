'use client';

import { useState, useMemo } from 'react';
import type { Category } from '@/types/product';
import { createCategory, updateCategory, deleteCategory } from '@/services/category.actions';
import { Plus, Edit2, Trash2, X, FolderTree, Search, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Search & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<'name' | 'description' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (col: 'name' | 'description') => {
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

  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          cat.name.toLowerCase().includes(query) ||
          (cat.description && cat.description.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;
        let valA = (a[sortColumn] || '').toLowerCase();
        let valB = (b[sortColumn] || '').toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [categories, searchQuery, sortColumn, sortDirection]);

  const renderSortIcon = (col: 'name' | 'description') => {
    if (sortColumn !== col) return <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-600 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-600 font-bold" />
    );
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let res;
    if (editingCategory) {
      res = await updateCategory(editingCategory.id, name, description);
    } else {
      res = await createCategory(name, description);
    }

    setLoading(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const res = await deleteCategory(id);
    if (!res.success) alert('Delete failed: ' + res.error);
  };

  return (
    <div className="flex flex-col h-full space-y-4 overflow-hidden">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Category Management</h1>
          <p className="text-xs text-slate-500 font-medium">Organize crackers into groups like Sparklers, Rockets, Flower Pots</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Top Filter & Search Controls Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3 shrink-0 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {(searchQuery || sortColumn) && (
          <button
            onClick={() => { setSearchQuery(''); setSortColumn(null); }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-bold px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}

        <span className="ml-auto text-slate-400 text-[11px] font-bold">
          Showing {filteredCategories.length} of {categories.length} categories
        </span>
      </div>

      {/* Categories Table View with Internal Scroll */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto flex-1 h-full">
          <table className="w-full text-left text-xs text-slate-700 relative">
            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200/80 shadow-2xs">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-4 px-6 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Category Name</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('description')}
                  className="py-4 px-6 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Description</span>
                    {renderSortIcon('description')}
                  </div>
                </th>
                <th className="py-4 px-6 text-right bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
                          <FolderTree className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">{cat.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {cat.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600 max-w-md">
                      {cat.description || <span className="text-slate-400 italic">No description provided</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60 transition-all font-bold flex items-center gap-1.5 text-xs shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5 cursor-pointer" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 transition-all font-bold flex items-center gap-1.5 text-xs shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5 cursor-pointer" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ground Chakkars"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Spinning colorful ground wheels..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-orange-500/20 hover:scale-[1.01]"
              >
                {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
