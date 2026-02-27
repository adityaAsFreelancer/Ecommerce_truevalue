import React, { useState, useEffect } from 'react';
import {
    Tag, Plus, Trash2, Power, Calendar,
    Percent, BadgeIndianRupee, Loader2, Search,
    X, CheckCircle, AlertCircle
} from 'lucide-react';
import { api } from '../../utils/api';
import showAlert from '../../utils/swal';
import GlobalLoader from '../../components/common/GlobalLoader';
import { CardSkeleton } from '../../components/common/Loaders';

const AdminCouponManager = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: '',
        maxDiscount: '',
        expiryDate: '',
        usageLimit: ''
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await api('/marketing/coupons');
            setCoupons(response.data);
        } catch (error) {
            console.error('Fetch Coupons Error:', error);
            showAlert.error({ title: 'Error', text: 'Failed to fetch coupons' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api('/marketing/coupons', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showAlert.success({ title: 'Success', text: 'Coupon created successfully' });
            setIsModalOpen(false);
            fetchCoupons();
            setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                minOrderValue: '',
                maxDiscount: '',
                expiryDate: '',
                usageLimit: '',
                description: ''
            });
        } catch (error) {
            showAlert.error({ title: 'Error', text: error.message || 'Failed to create coupon' });
        }
    };

    const handleToggle = async (id) => {
        try {
            await api(`/marketing/${id}`, { method: 'PUT' });
            fetchCoupons();
        } catch (error) {
            showAlert.error({ title: 'Error', text: 'Failed to update coupon status' });
        }
    };

    const handleDelete = async (id) => {
        const result = await showAlert.danger({
            title: 'Delete Coupon?',
            text: "This token will be permanently revoked from the distribution network.",
            confirmButtonText: 'Yes, Delete Token'
        });

        if (result.isConfirmed) {
            try {
                await api(`/marketing/${id}`, { method: 'DELETE' });
                showAlert.success({ title: 'Deleted!', text: 'Coupon has been removed.' });
                fetchCoupons();
            } catch (error) {
                showAlert.error({ title: 'Error', text: 'Failed to delete coupon' });
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Coupon System</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Create and manage discount tokens</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                    <Plus size={18} className="stroke-[3]" />
                    Generate New Coupon
                </button>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full">
                        <CardSkeleton count={3} />
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-[40px] border border-gray-100 text-center shadow-premium">
                        <Tag size={48} className="text-gray-100 mx-auto mb-4" />
                        <p className="text-gray-400 font-black tracking-widest text-xs uppercase">No active vouchers found</p>
                    </div>
                ) : coupons.map((coupon) => (
                    <div
                        key={coupon._id}
                        className={`bg-white rounded-[40px] border-2 transition-all duration-500 overflow-hidden group shadow-premium hover:shadow-2xl relative ${coupon.isActive ? 'border-gray-50' : 'border-red-50 bg-red-50/5 opacity-75'}`}
                    >
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic group-hover:text-primary transition-colors">{coupon.code}</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-2xl ${coupon.isActive ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                    {coupon.isActive ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Calendar size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Tag size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Min Order: ₹{coupon.minOrderValue}</span>
                                </div>
                                {coupon.usageLimit && (
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Loader2 size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Used: {coupon.usedCount} / {coupon.usageLimit}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => handleToggle(coupon._id)}
                                    className={`flex-1 py-4 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all overflow-hidden relative group/btn ${coupon.isActive ? 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Power size={14} />
                                        <span>{coupon.isActive ? 'Deactivate' : 'Activate'} Token</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all group/del"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white w-full max-w-xl rounded-[48px] p-10 md:p-12 border border-white/50 shadow-4xl relative z-10 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">New Voucher Key</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Voucher Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="EX: SAVE50"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-sm uppercase placeholder:text-gray-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Voucher Type</label>
                                    <select
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-sm uppercase focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <option value="percentage">Percentage %</option>
                                        <option value="fixed">Fixed ₹</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount Value</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Value"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Voucher Description</label>
                                <input
                                    type="text"
                                    placeholder="EX: Valid on orders above ₹500"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-sm placeholder:text-gray-300 focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Min Order Amount (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Min Order"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.minOrderValue}
                                        onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Usage Cap</label>
                                    <input
                                        type="number"
                                        placeholder="Unlimited"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-primary shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all"
                            >
                                Generate Coupon Now
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <GlobalLoader loading={loading && coupons.length > 0} message="Syncing Coupons..." />
        </div>
    );
};

export default AdminCouponManager;
