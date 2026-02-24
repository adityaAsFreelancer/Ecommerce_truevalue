import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Eye, Truck, CheckCircle,
    Clock, AlertCircle, ChevronLeft, ChevronRight,
    MapPin, User, IndianRupee, MoreVertical, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import showAlert from '../../utils/swal';
import { useUser } from '../../context/UserContext';

const AdminOrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = async (page = 1) => {
        if (user?.role !== 'admin') {
            console.warn('ADMIN_ORDER_LIST: Unauthorized access attempt blocked in component.');
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await api(`/admin/orders?page=${page}&limit=10&search=${searchTerm}`);
            setOrders(response.data);
            setPagination({
                page: response.page || 1,
                pages: response.pages || 1
            });
        } catch (error) {
            console.error('Fetch Orders Error:', error);
            showAlert({ title: 'Error', text: 'Failed to retrieve logistics manifest.', icon: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, searchTerm]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            // Call admin-specific status update protocol
            await api(`/admin/orders/${orderId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });
            showAlert({ title: 'Status Updated', text: `Order #${orderId} set to ${newStatus}.`, icon: 'success' });
            fetchOrders();
        } catch (error) {
            showAlert({ title: 'Error', text: 'Protocol update failed.', icon: 'error' });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-50 text-emerald-500 border-emerald-100';
            case 'Shipped': return 'bg-blue-50 text-blue-500 border-blue-100';
            case 'Processing': return 'bg-primary/10 text-primary border-primary/20';
            case 'Pending': return 'bg-orange-50 text-orange-500 border-orange-100';
            case 'Cancelled': return 'bg-red-50 text-red-500 border-red-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Order Management</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Track and manage all customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-4 bg-gray-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Export Orders</button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-premium flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search Hash, Client, or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <div className="flex items-center gap-4">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status === 'All' ? '' : status)}
                            className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${(status === 'All' && !statusFilter) || statusFilter === status
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Total</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-8"><div className="h-10 bg-gray-100 rounded-xl w-full" /></td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center uppercase italic">
                                        <Truck size={48} className="text-gray-100 mx-auto mb-4" />
                                        <p className="text-gray-400 font-black tracking-widest text-xs">No customer orders detected</p>
                                    </td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-black text-gray-900 text-sm tracking-tight uppercase">#{order._id}</p>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary">
                                                <User size={18} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-black text-gray-900 text-sm italic uppercase">{order.user?.name || 'Guest User'}</p>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{order.user?.email || 'No Email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-0.5">
                                            <p className="font-black text-gray-900 text-base">₹{order.totalPrice?.toLocaleString()}</p>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{order.paymentMethod}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusColor(order.status || 'Pending')}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                className="p-2.5 bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white rounded-xl transition-all"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <div className="relative group/menu">
                                                <button className="p-2.5 bg-gray-50 text-gray-400 hover:bg-primary hover:text-white rounded-xl transition-all">
                                                    <MoreVertical size={16} />
                                                </button>
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 overflow-hidden">
                                                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleUpdateStatus(order._id, status)}
                                                            className="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-primary transition-all"
                                                        >
                                                            Mark as {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 bg-gray-50/50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Showing Page {pagination.page} of {pagination.pages}</p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => fetchOrders(pagination.page - 1)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary disabled:opacity-30 transition-all cursor-pointer"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            disabled={pagination.page === pagination.pages}
                            onClick={() => fetchOrders(pagination.page + 1)}
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

export default AdminOrderList;
