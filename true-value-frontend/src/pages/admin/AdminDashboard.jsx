import React, { useState, useEffect } from 'react';
import {
    TrendingUp, ShoppingBag, Users, IndianRupee,
    ArrowUpRight, Package, Clock,
    CheckCircle, AlertTriangle, Megaphone, Send,
    UserPlus, History
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { api } from '../../utils/api';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { PageSpinner, TableSkeleton } from '../../components/common/Loaders';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [broadcast, setBroadcast] = useState({ title: '', message: '', type: 'admin' });
    const [isSending, setIsSending] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (user?.role !== 'admin') return;
            try {
                const analytics = await api('/admin/analytics');
                const orders = await api('/admin/orders?limit=5');
                const users = await api('/admin/users?limit=5');

                setStats(analytics.data);
                setRecentOrders(orders.data || []);
                setRecentUsers(users.data || []);
            } catch (error) {
                console.error('Dashboard Fetch Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleSendBroadcast = async (e) => {
        e.preventDefault();
        if (!broadcast.title || !broadcast.message) return;
        setIsSending(true);
        try {
            await api('/notifications/broadcast', {
                method: 'POST',
                body: JSON.stringify(broadcast)
            });
            const showAlert = (await import('../../utils/swal')).default;
            showAlert.success({ title: '📢 Sent!', text: 'Broadcast notification sent to all users.' });
            setBroadcast({ title: '', message: '', type: 'admin' });
        } catch (error) {
            console.error('Broadcast Error:', error);
        } finally {
            setIsSending(false);
        }
    };

    if (loading) return <PageSpinner message="Loading Dashboard..." />;

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
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Strategic Command Center</p>
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
                {/* Revenue Growth Graph */}
                <div className="lg:col-span-8 bg-white rounded-[40px] border border-gray-100 shadow-premium p-10 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Revenue Insights</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Daily sales performance (Last 7 Days)</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="size-2 bg-primary rounded-full" />
                                <span className="text-[9px] font-black uppercase text-gray-400">Sales</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.graphData || []}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5EC401" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#5EC401" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString('en-IN', { weekday: 'short' })}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
                                    tickFormatter={(val) => `₹${val}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#5EC401" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Operations & Utilities */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-gray-900 p-10 rounded-[40px] text-white flex flex-col justify-between h-80 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-40 bg-primary/10 rounded-full translate-x-12 -translate-y-12 blur-[100px] group-hover:bg-primary/20 transition-colors duration-1000" />
                        <div className="relative z-10 space-y-6">
                            <CheckCircle size={32} className="text-primary" />
                            <div className="space-y-2">
                                <h4 className="text-3xl font-black tracking-tighter uppercase italic leading-none">System Status: Active</h4>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Infrastructure health is optimal.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                <Megaphone size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Broadcast Alert</h4>
                            </div>
                        </div>
                        <form onSubmit={handleSendBroadcast} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Alert Title"
                                value={broadcast.title}
                                onChange={(e) => setBroadcast({ ...broadcast, title: e.target.value })}
                                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300"
                            />
                            <textarea
                                placeholder="Message..."
                                value={broadcast.message}
                                onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                                className="w-full px-5 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300 h-20 resize-none"
                            />
                            <button
                                disabled={isSending}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                            >
                                {isSending ? 'Sending...' : 'Push to All Users'}
                                <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Recent Activity Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-10">
                {/* Recent Orders Table */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-10 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic flex items-center gap-3">
                                <History className="text-primary" />
                                Recent Orders
                            </h3>
                        </div>
                        <button className="text-[10px] font-black uppercase text-primary border-b-2 border-primary/20 hover:border-primary transition-all">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Order ID</th>
                                    <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
                                    <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Amount</th>
                                    <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                                        <td className="py-5 font-black text-xs text-gray-900 uppercase italic">#{order._id.slice(-6)}</td>
                                        <td className="py-5">
                                            <div className="text-xs font-bold text-gray-900">{order.user?.name || 'Guest'}</div>
                                            <div className="text-[9px] text-gray-400 font-bold uppercase">{order.user?.email}</div>
                                        </td>
                                        <td className="py-5 text-xs font-black text-gray-900">₹{order.totalPrice}</td>
                                        <td className="py-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                                    order.status === 'Processing' ? 'bg-orange-50 text-orange-600' :
                                                        'bg-gray-50 text-gray-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* New Users Table */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-10 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic flex items-center gap-3">
                                <UserPlus className="text-primary" />
                                New Registrations
                            </h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Member</th>
                                    <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Email</th>
                                    <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Joined</th>
                                    <th className="pb-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentUsers.map((u) => (
                                    <tr key={u._id} className="group hover:bg-gray-50/50 transition-all">
                                        <td className="py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-xs uppercase">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="text-xs font-black text-gray-900">{u.name}</div>
                                            </div>
                                        </td>
                                        <td className="py-5 text-xs font-bold text-gray-400">{u.email}</td>
                                        <td className="py-5 text-[10px] font-black text-gray-900 uppercase">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
