import React, { useState, useEffect } from 'react';
import {
    Search, ShoppingCart, Bell, CheckCircle2, Truck, Home,
    Phone, Star, Receipt, MapPin, Plus, Minus, Target, ChevronLeft,
    Package, User, HelpCircle, FileText, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeNavbar from '../components/home/HomeNavbar';
import { articles } from '../data/siteData';
import showAlert from '../utils/swal';
import { useUser } from '../context/UserContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { PageSpinner } from '../components/common/Loaders';

const OrderTrackingPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

    const handleReturnSubmit = async () => {
        if (!returnReason) {
            showAlert({ title: "Inquiry Failed", text: "Please provide a valid protocol deviation reason.", icon: "error" });
            return;
        }

        setIsSubmittingReturn(true);
        try {
            await api('/returns', {
                method: 'POST',
                body: JSON.stringify({
                    orderId: orderId,
                    reason: returnReason
                })
            });
            showAlert({
                title: 'Return Initialized',
                text: 'Your return request has been logged into the manifest. Pickup will be scheduled.',
                icon: 'success'
            });
            setIsReturnModalOpen(false);
        } catch (error) {
            console.error('Return Error:', error);
            showAlert({ title: 'Logistics Error', text: error.message || 'Unable to communicate with Returns Gateway.', icon: 'error' });
        } finally {
            setIsSubmittingReturn(false);
        }
    };

    // Deep scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                const data = await api(`/orders/${orderId}`);
                setOrder(data);

                // Calculate progress based on status
                const statusMap = {
                    'Pending': 20,
                    'Processing': 40,
                    'Shipped': 70,
                    'Out for Delivery': 90,
                    'Delivered': 100
                };
                setProgress(statusMap[data.status] || 15);
            } catch (error) {
                console.error('Fetch Order Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) return (
        <div className="min-h-screen bg-white">
            <HomeNavbar />
            <PageSpinner message="Loading Order Tracking..." />
        </div>
    );

    if (!order) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white gap-4 p-8 text-center uppercase italic">
            <Package size={64} className="text-gray-100 mb-4" />
            <h2 className="text-2xl font-black tracking-tighter">Manifest Not Found</h2>
            <p className="text-gray-400 text-xs font-bold tracking-[0.2em]">Deployment hash #{orderId} is currently unmapped.</p>
            <Link to="/profile" className="mt-8 px-10 py-5 bg-gray-900 text-white font-black rounded-2xl shadow-2xl shadow-gray-900/10 text-[10px] tracking-widest uppercase">Back to Hub</Link>
        </div>
    );

    // Default or Fallback order for exploration if no orderId
    const currentOrder = order || {
        _id: "TV-SAMPLE-823",
        items: [
            { id: 1, name: "Premium Organic Harvest Bundle", quantity: 1, sku: "TV-FB-01", price: 1299, images: ["https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"] }
        ],
        shippingAddress: {
            label: "Primary Hub",
            street: "4528 Sunset Blvd",
            city: "Los Angeles",
            state: "CA",
            zip: "90027"
        },
        status: 'In Transit',
        timeline: [
            { status: 'Order Placed', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { status: 'Confirmed', timestamp: new Date(Date.now() - 1800000).toISOString() }
        ]
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Order Placed': return CheckCircle2;
            case 'Confirmed': return CheckCircle2;
            case 'Packed': return Package;
            case 'Shipped': return Truck;
            case 'Out for Delivery': return MapPin;
            case 'Delivered': return Home;
            default: return Package;
        }
    };

    return (
        <div className="min-h-screen bg-white font-display flex flex-col selection:bg-primary/20 overflow-hidden">
            <HomeNavbar />

            <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
                {/* Sidebar Info */}
                <aside className="w-full lg:w-[480px] bg-white border-r border-gray-100 flex flex-col overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-left-4 duration-700">
                    {/* Header Logistics */}
                    <div className="p-8 pb-4 space-y-6">
                        <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <Link to="/profile" className="hover:text-primary transition-colors flex items-center gap-2">
                                <ChevronLeft size={12} />
                                Operations
                            </Link>
                            <span className="opacity-30">/</span>
                            <span className="text-gray-900">Manifest #{order.id || order._id}</span>
                        </nav>

                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">Delivery Today</h1>
                                <p className="text-primary text-xs font-black uppercase tracking-[0.3em]">Estimated Window: 4:00 - 4:45 PM</p>
                            </div>
                            <button
                                onClick={() => showAlert({ title: 'Manifest', text: 'Generating digital manifest...', icon: 'success' })}
                                className="size-12 bg-gray-50 text-gray-900 rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
                            >
                                <Receipt size={20} />
                            </button>
                        </div>

                        {/* Telemetry Progress */}
                        <div className="space-y-4 pt-4">
                            <div className="flex justify-between items-center bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="relative flex h-3 w-3">
                                        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></div>
                                        <div className="relative inline-flex rounded-full h-3 w-3 bg-primary"></div>
                                    </div>
                                    <span className="text-gray-900 font-black text-[11px] uppercase tracking-widest">Fleet Active</span>
                                </div>
                                <span className="text-primary font-black text-xs tracking-widest">{progress}% LOGISTICS SYNC</span>
                            </div>
                            <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 2, ease: "circOut" }}
                                    className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(94,196,1,0.4)]"
                                />
                            </div>
                            <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em]">Real-time telemetry updated 45s ago</p>
                        </div>
                    </div>

                    <div className="px-8"> <hr className="border-gray-50" /> </div>

                    {/* Logistics Timeline */}
                    <section className="p-8 space-y-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Operations Protocol</p>
                        <div className="space-y-0 relative">
                            {order.timeline?.map((step, idx) => {
                                const Icon = getStatusIcon(step.status);
                                const isLast = idx === order.timeline.length - 1;
                                const isCurrent = isLast && order.status !== 'Delivered';

                                return (
                                    <div key={idx} className="relative flex gap-6 min-h-[90px] group">
                                        <div className="flex flex-col items-center">
                                            <div className={`z-10 size-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 
                                                ${!isCurrent ? 'bg-primary/5 border-primary/20 text-primary shadow-lg shadow-primary/5 scale-110' :
                                                    'bg-primary border-primary text-white shadow-2xl shadow-primary/30 scale-125'}`}
                                            >
                                                <Icon size={18} strokeWidth={isCurrent ? 3 : 2} />
                                            </div>
                                            {!isLast && (
                                                <div className="w-0.5 flex-1 transition-all duration-1000 my-2 bg-primary" />
                                            )}
                                        </div>
                                        <div className="pb-8 space-y-1 pt-1">
                                            <h4 className={`text-lg font-black tracking-tight uppercase ${isCurrent ? 'text-primary' : 'text-gray-900'} transition-colors duration-500`}>
                                                {step.status}
                                            </h4>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                                                {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {order.status !== 'Delivered' && (
                                <div className="relative flex gap-6 min-h-[90px] group opacity-40">
                                    <div className="flex flex-col items-center">
                                        <div className="z-10 size-10 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-300">
                                            <Home size={18} />
                                        </div>
                                    </div>
                                    <div className="pb-8 space-y-1 pt-1">
                                        <h4 className="text-lg font-black tracking-tight uppercase text-gray-300">Pending Delivery</h4>
                                        <p className="text-gray-300 text-[10px] font-black uppercase">Final Logistics Phase</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Driver Intelligence */}
                    <div className="mx-8 p-6 rounded-[32px] bg-gray-900 text-white flex items-center gap-6 group hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500 border border-gray-800">
                        <div
                            className="size-20 rounded-[24px] bg-cover bg-center border-4 border-white/5 group-hover:scale-105 transition-transform duration-700"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop")' }}
                        />
                        <div className="flex-1 space-y-1">
                            <p className="text-white font-black text-xl tracking-tighter">Marcus Johnson</p>
                            <div className="flex items-center gap-2">
                                <div className="flex text-primary">
                                    <Star size={12} fill="currentColor" />
                                </div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">4.9 • Fleet Unit: RA-X82</p>
                            </div>
                        </div>
                        <button
                            onClick={() => showAlert({ title: 'Dispatch Auth', text: 'Connecting to fleet unit RA-X82...', icon: 'success' })}
                            className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20 cursor-pointer"
                        >
                            <Phone size={24} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Items Section */}
                    <section className="p-8 space-y-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Inventory Units</p>
                        <div className="space-y-8">
                            {order.orderItems?.map(item => (
                                <div key={item.id || item._id} className="flex items-center gap-6 group">
                                    <div className="size-24 bg-gray-50 rounded-[28px] overflow-hidden border border-gray-100 p-4 flex-shrink-0 group-hover:shadow-lg transition-all duration-500">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-700" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-gray-900 font-black text-base leading-tight tracking-tight uppercase italic">{item.name}</p>
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">QTY: {item.qty}</p>
                                    </div>
                                    <p className="text-gray-900 font-black text-lg tracking-tighter">₹{item.price}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-gray-50 space-y-6">
                            <div className="flex justify-between items-start group">
                                <div className="space-y-2">
                                    <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">Drop Point</p>
                                    <p className="text-gray-900 font-black text-sm uppercase tracking-widest italic leading-relaxed group-hover:text-primary transition-colors">
                                        {order.address ? (
                                            <>
                                                {order.address}<br />
                                                {order.city}, {order.state} {order.postalCode}
                                            </>
                                        ) : (
                                            "Protocol breach: Data unavailable."
                                        )}
                                    </p>
                                </div>
                                <Link to="/addresses" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline pt-1">Secure Update</Link>
                            </div>
                        </div>
                    </section>

                    <div className="p-8 mt-auto flex flex-col gap-4 group">
                        {order.status === 'Delivered' && (
                            <button
                                onClick={() => setIsReturnModalOpen(true)}
                                className="w-full py-6 bg-gray-50 border border-gray-100 rounded-[24px] text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all active:scale-[0.98] cursor-pointer shadow-sm group-hover:shadow-2xl transition-all duration-500"
                            >
                                Request Logistics Return
                            </button>
                        )}
                        <button
                            onClick={() => showAlert({ title: 'System Access', text: 'Retrieving secure cryptographic invoice...', icon: 'success' })}
                            className="w-full py-6 bg-gray-50 border border-gray-100 rounded-[24px] text-gray-400 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all active:scale-[0.98] cursor-pointer shadow-sm group-hover:shadow-2xl transition-all duration-500"
                        >
                            Access Full Manifest
                        </button>
                    </div>
                </aside>

                {/* Satellite View Implementation */}
                <div className="flex-1 relative bg-gray-50 overflow-hidden animate-in fade-in duration-1000">
                    {/* High-Fi Map Visualization */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 hover:scale-100"
                        style={{
                            backgroundImage: 'url("https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2566&auto=format&fit=crop")',
                            filter: 'grayscale(1) contrast(1.5) brightness(0.7)'
                        }}
                    >
                        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    </div>

                    {/* Vector Overlay */}
                    <svg className="absolute inset-0 w-full h-full p-20 pointer-events-none drop-shadow-[0_0_30px_rgba(94,196,1,0.3)]" viewBox="0 0 1000 1000">
                        <defs>
                            <linearGradient id="vectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#5EC401" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#5EC401" stopOpacity="1" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 4, ease: "circInOut" }}
                            d="M200,800 C400,700 300,400 500,500 S700,300 800,200"
                            fill="none"
                            stroke="url(#vectorGradient)"
                            strokeDasharray="20 20"
                            strokeLinecap="round"
                            strokeWidth="10"
                            filter="url(#glow)"
                        />

                        {/* Node: Logistics Center */}
                        <g transform="translate(200, 800)">
                            <circle r="16" fill="#5EC401" fillOpacity="0.1" />
                            <circle r="6" fill="#5EC401" />
                            <text x="25" y="8" className="fill-white font-black uppercase tracking-[0.2em] text-[12px]">Origin Hub</text>
                        </g>

                        {/* Node: Active Unit */}
                        <g transform="translate(500, 500)">
                            <motion.circle
                                animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                r="25" fill="#5EC401"
                            />
                            <motion.circle
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                r="12" fill="#5EC401"
                            />
                            <text x="35" y="8" className="fill-primary font-black uppercase tracking-[0.3em] text-[14px] italic">Unit RA-X82</text>
                        </g>

                        {/* Node: Designated Target */}
                        <g transform="translate(800, 200)">
                            <motion.path
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                d="M0,0 L-20,-40 L20,-40 Z" fill="#111827"
                            />
                            <circle r="20" fill="#111827" fillOpacity="0.1" />
                            <text x="35" y="-15" className="fill-gray-900 font-black uppercase tracking-[0.3em] text-[14px] italic">Designated Target</text>
                        </g>
                    </svg>

                    {/* Telemetry Dashboard Controls */}
                    <div className="absolute top-10 right-10 flex flex-col gap-4">
                        {[Target, Search, Plus, Minus].map((Icon, i) => (
                            <button
                                key={i}
                                className="size-14 bg-gray-900/80 backdrop-blur-2xl rounded-2xl shadow-3xl flex items-center justify-center text-white/50 hover:text-primary transition-all active:scale-90 border border-white/10 group cursor-pointer"
                            >
                                <Icon size={22} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                            </button>
                        ))}
                    </div>

                    {/* Mobile Operations Badge */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 lg:hidden w-[90%] max-w-[400px]">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-gray-900/95 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-3xl space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Unit Telemetry</span>
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-primary text-[10px] font-black uppercase tracking-widest">Live Sync</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">ETA Window</p>
                                    <p className="text-white text-4xl font-black tracking-tighter italic uppercase">19 MINS</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-primary text-sm font-black uppercase tracking-tighter">Approaching Zone 4</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Data Overlay */}
                    <div className="absolute top-10 left-10 hidden lg:block">
                        <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="size-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">Satellite Data Link: Active</span>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Air Temp</p>
                                    <p className="text-white font-black text-xs">24°C / 75°F</p>
                                </div>
                                <div>
                                    <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Fleet Velocity</p>
                                    <p className="text-white font-black text-xs">42 km/h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderTrackingPage;
