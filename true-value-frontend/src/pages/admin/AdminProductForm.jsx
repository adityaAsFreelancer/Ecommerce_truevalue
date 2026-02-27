import React, { useState, useEffect } from 'react';
import {
    Save, X, Upload, Plus, Trash2,
    Image as ImageIcon, ChevronLeft, Info,
    DollarSign, Package, Tag, Layers, CheckCircle2
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import showAlert from '../../utils/swal';
import { useUser } from '../../context/UserContext';
import { PageSpinner, MiniSpinner } from '../../components/common/Loaders';
import { api } from '../../utils/api';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const { user } = useUser();
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        mrp: '',
        category: '', // Matches backend model
        subCategory: '', // Added for UI logic
        brand: '',
        countInStock: 0,
        images: [],
        features: [],
        specifications: {},
        isFeature: false,
        isDeal: false,
        discount: 0
    });

    const [uploading, setUploading] = useState(false);
    // Blob URLs shown instantly before upload completes
    const [pendingPreviews, setPendingPreviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.role !== 'admin') {
                console.warn('ADMIN_PRODUCT_FORM: Unauthorized access attempt blocked in component.');
                setLoading(false);
                return;
            }
            try {
                const cats = await api('/categories');
                setCategories(cats.data || cats);

                if (isEditMode) {
                    const response = await api(`/products/${id}`);
                    const product = response.data || response;

                    setFormData({
                        ...product,
                        category: product.category?._id || product.category || '',
                        subCategory: product.subCategory || '',
                        price: product.price || '',
                        mrp: product.mrp || '',
                        countInStock: product.countInStock || 0,
                        images: product.images || [],
                    });
                }
            } catch (error) {
                console.error('Fetch Error:', error);
                showAlert.error({ title: 'Error', text: 'Failed to load asset data.' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEditMode]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // 1. Instant local previews using blob URLs
        const blobUrls = files.map(file => URL.createObjectURL(file));
        setPendingPreviews(prev => [...prev, ...blobUrls]);

        setUploading(true);
        try {
            const uploadFormData = new FormData();
            files.forEach(file => uploadFormData.append('images', file));

            const response = await fetch('http://localhost:5000/api/upload/multiple', {
                method: 'POST',
                body: uploadFormData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('truevalue_token')}`
                }
            });
            const data = await response.json();

            if (data.success) {
                // 2. Store full absolute URLs so preview works on Vite's port too
                const newImages = data.data.map(img =>
                    img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`
                );
                setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
                // 3. Clear the blob previews — server URLs take over
                setPendingPreviews(prev => prev.filter(u => !blobUrls.includes(u)));
                // Revoke blob URLs to free memory
                blobUrls.forEach(u => URL.revokeObjectURL(u));
            } else {
                // Upload failed — remove pending previews
                setPendingPreviews(prev => prev.filter(u => !blobUrls.includes(u)));
                blobUrls.forEach(u => URL.revokeObjectURL(u));
                showAlert.error({ title: 'Upload Failed', text: data.message || 'Could not upload images.' });
                return;
            }
        } catch (error) {
            console.error('Upload Error:', error);
            setPendingPreviews(prev => prev.filter(u => !blobUrls.includes(u)));
            blobUrls.forEach(u => URL.revokeObjectURL(u));
            showAlert.error({ title: 'Upload Failed', text: 'Could not upload images. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const endpoint = isEditMode ? `/products/${id}` : '/products';
            const method = isEditMode ? 'PUT' : 'POST';

            await api(endpoint, {
                method,
                body: JSON.stringify({
                    ...formData,
                    category: formData.subCategory || formData.category, // Use subcat if available, else root
                    price: Number(formData.price),
                    mrp: Number(formData.mrp),
                    countInStock: Number(formData.countInStock),
                    discount: Number(formData.discount)
                })
            });

            showAlert.success({
                title: isEditMode ? 'Product Updated' : 'Product Created',
                text: `"${formData.name}" has been ${isEditMode ? 'updated' : 'added'} successfully.`
            });
            navigate('/admin/products');
        } catch (error) {
            console.error('Submit Error:', error);
            showAlert.error({ title: 'Save Failed', text: 'Could not save product. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <PageSpinner message="Deciphering Asset Data..." />;

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/admin/products" className="size-12 bg-gray-50 text-gray-400 rounded-2xl hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                            {isEditMode ? 'Edit Product' : 'Add New Product'}
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Product Management</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-8 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-3 px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                        {submitting ? <MiniSpinner color="white" /> : <Save size={18} />}
                        {isEditMode ? 'Update Product' : 'Save Product'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Info */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium space-y-8">
                        <div className="flex items-center gap-4">
                            <Info className="text-primary" size={20} />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Product Details</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Product Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Tata Salt 1kg, Amul Butter 500g"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={5}
                                    placeholder="Describe the product — ingredients, usage, weight, etc."
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormData(prev => ({ ...prev, category: val, subCategory: '' }));
                                        }}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.filter(c => !c.parent).map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Sub-Category</label>
                                    <select
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleInputChange}
                                        disabled={!formData.category}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer disabled:opacity-30"
                                    >
                                        <option value="">Select Sub-Category</option>
                                        {categories.filter(c => c.parent === formData.category).map(sub => (
                                            <option key={sub._id} value={sub._id}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Brand</label>
                                <input
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Amul, Tata, Patanjali"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium space-y-8">
                        <div className="flex items-center gap-4">
                            <ImageIcon className="text-primary" size={20} />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Product Images</h3>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Uploaded images (server URLs) */}
                            {formData.images.map((img, idx) => (
                                <div key={`uploaded-${idx}`} className="relative aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden group">
                                    <img
                                        src={img}
                                        alt={`Product ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={e => { e.target.style.opacity = '0.3'; }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {/* Pending previews (blob URLs — uploading) */}
                            {pendingPreviews.map((blobUrl, idx) => (
                                <div key={`pending-${idx}`} className="relative aspect-square bg-gray-50 rounded-2xl border-2 border-primary/30 overflow-hidden flex items-center justify-center">
                                    <img src={blobUrl} alt="Uploading..." className="w-full h-full object-cover opacity-60 absolute inset-0" />
                                    <div className="relative z-10">
                                        <MiniSpinner size={32} color="#5EC401" />
                                    </div>
                                </div>
                            ))}
                            <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden relative">
                                {uploading ? (
                                    <MiniSpinner size={32} color="#5EC401" />
                                ) : (
                                    <>
                                        <Upload className="text-gray-300 group-hover:text-primary transition-colors" size={32} />
                                        <span className="text-[10px] font-black text-gray-400 group-hover:text-primary uppercase tracking-widest">Upload Image</span>
                                    </>
                                )}
                                <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                            </label>
                        </div>
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium space-y-8">
                        <div className="flex items-center gap-4">
                            <DollarSign className="text-primary" size={20} />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Pricing</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Selling Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-xl text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">MRP (₹)</label>
                                <input
                                    type="number"
                                    name="mrp"
                                    value={formData.mrp}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-base text-gray-400 focus:ring-2 focus:ring-primary/20 transition-all italic"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Discount (%)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-base text-primary focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium space-y-8">
                        <div className="flex items-center gap-4">
                            <Package className="text-primary" size={20} />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Inventory</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="countInStock"
                                    value={formData.countInStock}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-base text-gray-900 focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-white hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/20 select-none group">
                                    <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isFeature ? 'bg-primary border-primary text-white' : 'border-gray-200 bg-white'}`}>
                                        {formData.isFeature && <CheckCircle2 size={16} strokeWidth={3} />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="isFeature"
                                        checked={formData.isFeature}
                                        onChange={handleInputChange}
                                        className="hidden"
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Featured Product</span>
                                </label>

                                <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-white hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/20 select-none group">
                                    <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isDeal ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 bg-white'}`}>
                                        {formData.isDeal && <Tag size={16} strokeWidth={3} />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="isDeal"
                                        checked={formData.isDeal}
                                        onChange={handleInputChange}
                                        className="hidden"
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Special Deal</span>
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </form>
    );
};

export default AdminProductForm;
