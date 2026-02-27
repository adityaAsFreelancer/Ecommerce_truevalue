import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, Edit, Trash2,
    MoreVertical, ChevronLeft, ChevronRight,
    Package, AlertCircle, CheckCircle, ExternalLink
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import showAlert from '../../utils/swal';
import { useUser } from '../../context/UserContext';
import { api } from '../../utils/api';
import { TableSkeleton } from '../../components/common/Loaders';

const AdminProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });

    const fetchProducts = async (page = 1) => {
        if (user?.role !== 'admin') {
            console.warn('ADMIN_PRODUCT_LIST: Unauthorized access attempt blocked in component.');
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await api(`/products?page=${page}&limit=10&search=${searchTerm}`);
            setProducts(response.data);
            setPagination({
                page: response.page || 1,
                pages: response.pages || 1
            });
        } catch (error) {
            console.error('Fetch Products Error:', error);
            showAlert.error({ title: 'Error', text: 'Failed to fetch inventory data.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [searchTerm]);

    const handleDelete = async (id) => {
        const confirmed = await showAlert.danger({
            title: 'Delete this product?',
            text: 'This will permanently remove the product from inventory.',
            confirmButtonText: 'Yes, Delete',
        });
        if (!confirmed) return;

        try {
            await api(`/products/${id}`, { method: 'DELETE' });
            showAlert.success({ title: '✅ Deleted!', text: 'Product removed from inventory.' });
            fetchProducts(pagination.page);
        } catch (error) {
            showAlert.error({ title: 'Error', text: 'Failed to delete product.' });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Inventory Assets</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Global Stock & SKU Management</p>
                </div>
                <button
                    onClick={() => navigate('/admin/products/new')}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
                >
                    <Plus size={18} strokeWidth={3} />
                    Deploy New Asset
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-premium flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search SKU, Name, or Category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <button className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3">
                    <Filter size={18} />
                    Advanced Filters
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Asset</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset Value</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stock Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Modified</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <TableSkeleton rows={5} cols={6} />
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Package size={48} className="text-gray-100" />
                                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">No matching inventory assets found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="size-16 rounded-2xl bg-gray-50 border border-gray-100 p-2 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={product.images?.[0] || 'https://via.placeholder.com/100'}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-black text-gray-900 text-base leading-tight uppercase italic">{product.name}</p>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">SKU: TV-{product._id.slice(-6).toUpperCase()}-X</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            {product.category?.name || 'General Hub'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-0.5">
                                            <p className="font-black text-gray-900 text-base">₹{product.price}</p>
                                            <p className="text-[9px] font-black text-gray-300 uppercase line-through italic">₹{product.mrp || product.price * 1.2}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {product.countInStock > 10 ? (
                                                <div className="flex items-center gap-2 text-emerald-500">
                                                    <CheckCircle size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{product.countInStock} Units</span>
                                                </div>
                                            ) : product.countInStock > 0 ? (
                                                <div className="flex items-center gap-2 text-orange-500">
                                                    <AlertCircle size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Low: {product.countInStock} Units</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-500">
                                                    <AlertCircle size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Exhausted</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                                            {new Date(product.updatedAt || product.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                                className="p-2.5 bg-gray-50 text-gray-400 hover:bg-primary hover:text-white rounded-xl transition-all"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product._id)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 bg-gray-50/50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Showing Logistics Batch {pagination.page} of {pagination.pages}</p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => fetchProducts(pagination.page - 1)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary disabled:opacity-30 transition-all cursor-pointer"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            disabled={pagination.page === pagination.pages}
                            onClick={() => fetchProducts(pagination.page + 1)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary disabled:opacity-30 transition-all cursor-pointer"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductList;
