import React, { useState, useEffect } from 'react';
import {
    TrendingUp, ShoppingBag, Users, IndianRupee,
    ArrowUpRight, ArrowDownRight, Package, Clock,
    ExternalLink, Eye, CheckCircle, AlertTriangle
} from 'lucide-react';
import { api } from '../../utils/api';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (user?.role !== 'admin') {
                console.warn('ADMIN_DASHBOARD: Unauthorized access attempt blocked in component.');
                setLoading(false);
                return;
            }
            try {
                const analytics = await api('/admin/analytics');
                const orders = await api('/admin/orders');
                setStats(analytics.data);
                // Ensure latest orders are on top (backend should handle, but frontend safeguard)
                const sortedOrders = (orders.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecentOrders(sortedOrders.slice(0, 5));
            } catch (error) {
                console.error('Dashboard Fetch Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <div className="h-10 bg-gray-100 rounded-xl w-64 animate-pulse" />
                <div className="h-4 bg-gray-50 rounded-lg w-48 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 h-48 animate-pulse" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 bg-white rounded-[40px] border border-gray-100 h-[500px] animate-pulse" />
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-900 rounded-[40px] h-80 animate-pulse" />
                    <div className="bg-white rounded-[40px] border border-gray-100 h-64 animate-pulse" />
                </div>
            </div>
        </div>
    );

    const statCards = [
        { label: 'Total Revenue', value: `₹${stats?.revenue?.toLocaleString() || '0'}`, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+12.5%' },
        { label: 'Total Orders', value: stats?.orders || '0', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10', trend: '+8.2%' },
        { label: 'Active Users', value: stats?.users || '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+14.1%' },
        { label: 'Growth Rate', value: '24.8%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50', trend: '+2.4%' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex-col gap-2 flex">
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Admin Dashboard</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Overview of Orders, Users, and Revenue</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-premium hover:shadow-2xl transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon size={24} strokeWidth={2.5} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                <ArrowUpRight size={12} />
                                {stat.trend}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest leading-none">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Recent Orders */}
                <div className="lg:col-span-8 bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Recent Orders</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Latest customer purchases</p>
                        </div>
                        <button className="px-6 py-3 bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all">View All Orders</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Total</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6 font-black text-xs text-gray-900 tracking-tight uppercase">#{order.id || order._id}</td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-0.5">
                                                <p className="font-black text-sm text-gray-900 leading-none">{order.user?.name || 'Guest User'}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{order.shippingAddress?.city}, {order.shippingAddress?.state || order.shippingAddress?.country}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-base text-gray-900">₹{order.totalPrice?.toLocaleString()}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-500' :
                                                order.status === 'Processing' ? 'bg-primary/10 text-primary' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Operations Health */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-gray-900 p-10 rounded-[40px] text-white flex flex-col justify-between h-80 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-40 bg-primary/10 rounded-full translate-x-12 -translate-y-12 blur-[100px] group-hover:bg-primary/20 transition-colors duration-1000" />
                        <div className="relative z-10 space-y-6">
                            <CheckCircle size={32} className="text-primary" />
                            <div className="space-y-2">
                                <h4 className="text-3xl font-black tracking-tighter uppercase italic leading-none">System Status: Online</h4>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">All backend systems are synchronized and running normally.</p>
                            </div>
                        </div>
                        <button className="relative z-10 w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-3">
                            Run Diagnostics
                            <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="size-3 bg-red-500 rounded-full animate-pulse" />
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Action Required</h4>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900 leading-tight">Stock Exhaustion</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Premium Bundle low in hub B-4</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                                    <Clock size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900 leading-tight">Verification Pending</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">3 New Vendors awaiting auth</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-4 text-primary text-[10px] font-black uppercase tracking-[0.2em] bg-primary/5 hover:bg-primary/10 rounded-2xl transition-all">Command Overview</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
