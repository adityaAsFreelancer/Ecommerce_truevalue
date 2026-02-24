import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, Package, Truck, CheckCircle,
    Clock, AlertCircle, MapPin, Phone,
    Mail, User, Calendar, IndianRupee,
    Hash, ExternalLink, ArrowRight, Printer
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import showAlert from '../../utils/swal';
import { useUser } from '../../context/UserContext';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        const fetchOrder = async () => {
            if (user?.role !== 'admin') {
                console.warn('ADMIN_ORDER_DETAILS: Unauthorized access attempt blocked in component.');
                setLoading(false);
                return;
            }
            try {
                const response = await api(`/admin/orders/${id}`);
                setOrder(response.data || response);
            } catch (error) {
                console.error('Fetch Order Error:', error);
                showAlert({ title: 'Error', text: 'Failed to retrieve deployment details.', icon: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleUpdateStatus = async (newStatus) => {
        try {
            await api(`/admin/orders/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });
            showAlert({ title: 'Status Updated', text: `Deployment #${id} set to ${newStatus}.`, icon: 'success' });
            setOrder(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            showAlert({ title: 'Error', text: 'Status update protocol failed.', icon: 'error' });
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20 flex-col gap-6">
            <div className="animate-spin size-12 border-[6px] border-primary/20 border-t-primary rounded-full" />
            <p className="font-black text-gray-400 uppercase tracking-widest text-xs italic">Decrypting Log Entry...</p>
        </div>
    );

    if (!order) return (
        <div className="text-center p-20">
            <Hash size={48} className="text-gray-100 mx-auto mb-4" />
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Log entry not found in central database</p>
            <Link to="/admin/orders" className="text-primary font-black uppercase text-xs tracking-widest mt-6 block">Back to Manifest</Link>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/admin/orders')} className="size-12 bg-gray-50 text-gray-400 rounded-2xl hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Deployment #{order._id}</h1>
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                order.status === 'Processing' ? 'bg-primary/10 text-primary border-primary/20' :
                                    'bg-gray-50 text-gray-500 border-gray-100'
                                }`}>
                                {order.status || 'Pending'}
                            </span>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Logged on {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-4 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all">
                        <Printer size={20} />
                    </button>
                    <div className="relative group">
                        <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest">
                            Update Phase
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleUpdateStatus(status)}
                                    className="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-primary transition-all"
                                >
                                    Mark as {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Items & Timeline */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Items */}
                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium">
                        <div className="flex items-center gap-4 mb-8">
                            <Package className="text-primary" size={20} />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Asset Manifest</h3>
                        </div>
                        <div className="space-y-6">
                            {order.orderItems?.map((item, index) => (
                                <div key={item._id || index} className="flex items-center gap-6 p-4 hover:bg-gray-50/50 rounded-2xl transition-all group">
                                    <div className="size-20 bg-gray-50 border border-gray-100 rounded-2xl p-2 overflow-hidden flex-shrink-0">
                                        <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-gray-900 text-lg uppercase italic truncate leading-none mb-1">{item.name}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty: {item.qty} Units @ ₹{item.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900 text-xl tracking-tight">₹{(item.price * item.qty).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 pt-10 border-t border-gray-50 flex justify-between items-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Resource Value</p>
                            <p className="text-3xl font-black text-gray-900 tracking-tighter italic">₹{order.totalPrice?.toLocaleString()}</p>
                        </div>
                    </section>

                    {/* Timeline (Mock for now or integrate if exists) */}
                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium">
                        <div className="flex items-center gap-4 mb-8">
                            <Clock className="text-primary" size={20} />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Deployment Timeline</h3>
                        </div>
                        <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-50">
                            {[
                                { status: 'Deployment Initialized', time: order.createdAt, desc: 'Signal received and manifest logged.' },
                                { status: order.status, time: new Date().toISOString(), desc: `Current asset state is ${order.status}.`, current: true }
                            ].map((step, idx) => (
                                <div key={idx} className="flex gap-6 relative">
                                    <div className={`size-9 rounded-xl flex items-center justify-center relative z-10 ${step.current ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-gray-100 text-gray-300'}`}>
                                        {step.current ? <ArrowRight size={18} /> : <CheckCircle size={18} />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className={`font-black text-sm uppercase tracking-widest ${step.current ? 'text-gray-900' : 'text-gray-400'}`}>{step.status}</p>
                                        <p className="text-[10px] font-bold text-gray-300 uppercase">{new Date(step.time).toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Customer */}
                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium space-y-8">
                        <div className="flex items-center gap-4">
                            <User className="text-primary" size={20} />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Client Profile</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Name</p>
                                    <p className="font-black text-gray-900 uppercase italic">{order.user?.name || 'Guest User'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
                                    <Mail size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Node Address</p>
                                    <p className="font-black text-gray-900 truncate">{order.user?.email || 'No Email'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Signal Link</p>
                                    <p className="font-black text-gray-900">{order.user?.phone || 'Not Available'}</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3">
                            Contact Client
                            <ExternalLink size={14} />
                        </button>
                    </section>

                    {/* Shipping */}
                    <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium space-y-8 text-gray-900">
                        <div className="flex items-center gap-4">
                            <MapPin className="text-primary" size={20} />
                            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Drop Zone</h3>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coordinates</p>
                                <p className="font-black uppercase tracking-tight italic leading-relaxed">
                                    {order.shippingAddress?.address}<br />
                                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode} - {order.shippingAddress?.country}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Operational Mode</p>
                                <p className="font-black text-primary uppercase italic text-sm">{order.paymentMethod}</p>
                            </div>
                        </div>
                        <button className="w-full py-4 border-2 border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center justify-center gap-3">
                            Track via External Hub
                            <Truck size={14} />
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
