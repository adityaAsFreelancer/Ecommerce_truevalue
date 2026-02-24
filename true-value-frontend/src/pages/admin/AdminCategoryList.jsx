import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit, Trash2,
    Grid, Archive, Tag
} from 'lucide-react';
import showAlert from '../../utils/swal';
import { useUser } from '../../context/UserContext';
import { api } from '../../utils/api';

const AdminCategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    // 'categories' = root categories | 'subcategories' = all subcategories
    const [view, setView] = useState('categories');

    const fetchCategories = async () => {
        if (user?.role !== 'admin') {
            console.warn('ADMIN_CATEGORY_LIST: Unauthorized access attempt blocked in component.');
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await api('/categories');
            setCategories(response.data || response);
        } catch (error) {
            console.error('Fetch Categories Error:', error);
            showAlert({ title: 'Error', text: 'Failed to fetch categories.', icon: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleCreateCategory = (parentId = null) => {
        showAlert({
            title: parentId ? 'Create Subcategory' : 'Create Main Category',
            html: `
                <div class="space-y-4 text-left">
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                        <input id="swal-name" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" placeholder="Category Name">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                        <input id="swal-desc" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" placeholder="Category Description">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Parent Category</label>
                        <select id="swal-parent" class="swal2-select !w-full !m-0 !rounded-xl !border-2 !border-gray-100 !text-sm !font-bold">
                            <option value="">None (Main Category)</option>
                            ${categories.filter(c => !c.parent).map(c => `<option value="${c._id}" ${c._id === parentId ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Image URL</label>
                        <input id="swal-image" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" placeholder="https://...">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Create Category',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                if (!name) { showAlert.showValidationMessage('Name is required'); return false; }
                return {
                    name,
                    description: document.getElementById('swal-desc').value || '',
                    parent: document.getElementById('swal-parent').value || null,
                    image: document.getElementById('swal-image').value
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api('/categories', { method: 'POST', body: JSON.stringify(result.value) });
                    showAlert({ title: 'Created', text: 'Category created successfully.', icon: 'success' });
                    fetchCategories();
                } catch {
                    showAlert({ title: 'Error', text: 'Failed to create category.', icon: 'error' });
                }
            }
        });
    };

    const handleEditCategory = (category) => {
        showAlert({
            title: 'Edit Category',
            html: `
                <div class="space-y-4 text-left">
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                        <input id="swal-name" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" value="${category.name}" placeholder="Category Name">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                        <input id="swal-desc" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" value="${category.description || ''}" placeholder="Category Description">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Parent Category</label>
                        <select id="swal-parent" class="swal2-select !w-full !m-0 !rounded-xl !border-2 !border-gray-100 !text-sm !font-bold">
                            <option value="">None (Main Category)</option>
                            ${categories.filter(c => !c.parent && c._id !== category._id).map(c => `<option value="${c._id}" ${c._id === category.parent ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Image URL</label>
                        <input id="swal-image" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" value="${category.image || ''}" placeholder="https://...">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                if (!name) { showAlert.showValidationMessage('Name is required'); return false; }
                return {
                    name,
                    description: document.getElementById('swal-desc').value || '',
                    parent: document.getElementById('swal-parent').value || null,
                    image: document.getElementById('swal-image').value
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api(`/categories/${category._id}`, { method: 'PUT', body: JSON.stringify(result.value) });
                    showAlert({ title: 'Saved', text: 'Category updated successfully.', icon: 'success' });
                    fetchCategories();
                } catch {
                    showAlert({ title: 'Error', text: 'Failed to update category.', icon: 'error' });
                }
            }
        });
    };

    const handleDelete = async (id) => {
        const confirmed = await showAlert.confirm({
            title: 'Delete Category?',
            text: 'This will affect all linked products and potentially delete subcategories.',
            icon: 'warning'
        });
        if (confirmed) {
            try {
                await api(`/categories/${id}`, { method: 'DELETE' });
                showAlert({ title: 'Deleted', text: 'Category removed successfully.', icon: 'success' });
                fetchCategories();
            } catch {
                showAlert({ title: 'Error', text: 'Failed to delete category.', icon: 'error' });
            }
        }
    };

    const rootCategories = categories.filter(c => !c.parent);
    const subCategories = categories.filter(c => !!c.parent);

    const filteredRoots = rootCategories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredSubs = subCategories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getParentName = (sub) => {
        const parent = categories.find(c => c._id === sub.parent);
        return parent ? parent.name : '—';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Category Management</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Manage product categories and subcategories</p>
                </div>
                <button
                    onClick={() => handleCreateCategory(view === 'subcategories' ? (rootCategories[0]?._id || null) : null)}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
                >
                    <Plus size={18} strokeWidth={3} />
                    {view === 'subcategories' ? 'Add Sub-Category' : 'Add Category'}
                </button>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden">

                {/* Toolbar */}
                <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 group max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-all" size={18} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex items-center p-1 bg-gray-50 rounded-2xl gap-1 shrink-0">
                        <button
                            onClick={() => { setView('categories'); setSearchTerm(''); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${view === 'categories'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-gray-400 hover:text-gray-700'
                                }`}
                        >
                            <Grid size={14} strokeWidth={2.5} />
                            Categories
                            <span className={`px-1.5 py-0.5 rounded-lg text-[9px] font-black ${view === 'categories' ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {rootCategories.length}
                            </span>
                        </button>
                        <button
                            onClick={() => { setView('subcategories'); setSearchTerm(''); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${view === 'subcategories'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-gray-400 hover:text-gray-700'
                                }`}
                        >
                            <Tag size={14} strokeWidth={2.5} />
                            Sub-Categories
                            <span className={`px-1.5 py-0.5 rounded-lg text-[9px] font-black ${view === 'subcategories' ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {subCategories.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* ── CATEGORIES VIEW ── */}
                {view === 'categories' && (
                    <div className="divide-y divide-gray-50">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => <div key={i} className="p-8 h-20 animate-pulse bg-gray-50/50" />)
                        ) : filteredRoots.length === 0 ? (
                            <div className="p-20 text-center">
                                <Archive size={48} className="text-gray-100 mx-auto mb-4" />
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">No categories found</p>
                            </div>
                        ) : filteredRoots.map((root) => (
                            <div key={root._id} className="group">
                                {/* Root row */}
                                <div className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="size-14 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
                                            {root.image
                                                ? <img src={root.image} alt={root.name} className="w-full h-full object-contain" />
                                                : <Grid className="text-gray-300" size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">{root.name}</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Main Category • {categories.filter(c => c.parent === root._id).length} Subcategories
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                                                Updated: {new Date(root.updatedAt || root.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleCreateCategory(root._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-xl transition-all text-[9px] font-black uppercase tracking-widest"
                                        >
                                            <Plus size={14} strokeWidth={3} />
                                            Sub-category
                                        </button>
                                        <button onClick={() => handleEditCategory(root)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-primary hover:text-white rounded-xl transition-all">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(root._id)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Nested subcategories */}
                                <div className="bg-gray-50/30 pl-24 pr-8 divide-y divide-gray-50/50">
                                    {categories.filter(c => c.parent === root._id).map((sub) => (
                                        <div key={sub._id} className="py-4 flex items-center justify-between text-sm group/sub">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-[2px] bg-gray-200" />
                                                <div>
                                                    <span className="font-bold text-gray-600 uppercase tracking-wider">{sub.name}</span>
                                                    <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                                                        Updated: {new Date(sub.updatedAt || sub.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditCategory(sub)} className="p-1.5 text-gray-400 hover:text-primary transition-colors"><Edit size={14} /></button>
                                                <button onClick={() => handleDelete(sub._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── SUB-CATEGORIES VIEW ── */}
                {view === 'subcategories' && (
                    <div className="divide-y divide-gray-50">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => <div key={i} className="p-6 h-16 animate-pulse bg-gray-50/50" />)
                        ) : filteredSubs.length === 0 ? (
                            <div className="p-20 text-center">
                                <Archive size={48} className="text-gray-100 mx-auto mb-4" />
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">No sub-categories found</p>
                            </div>
                        ) : filteredSubs.map((sub) => (
                            <div key={sub._id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                        <Tag className="text-primary" size={16} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 uppercase tracking-tight">{sub.name}</p>
                                        <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-0.5">
                                            Under: <span className="text-primary">{getParentName(sub)}</span>
                                        </p>
                                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">
                                            Updated: {new Date(sub.updatedAt || sub.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditCategory(sub)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-primary hover:text-white rounded-xl transition-all">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(sub._id)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategoryList;
