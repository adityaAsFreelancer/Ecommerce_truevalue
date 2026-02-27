import React, { useEffect } from 'react';
import { CheckCircle, Receipt, Truck, Map, ShoppingBasket, Printer, Mail, HelpCircle, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/home/HomeNavbar';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';

const OrderConfirmationPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { orders } = useUser();

    // Get the most recent order (first in the list)
    const order = orders && orders.length > 0 ? orders[0] : null;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-8">
                <div className="text-center space-y-8 bg-white p-12 rounded-[48px] shadow-3xl border border-gray-100 max-w-lg mx-4 animate-in zoom-in-95 duration-700">
                    <div className="size-28 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-gray-100">
                        <ShoppingBasket size={48} className="text-gray-300 stroke-[1.5]" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">No Orders Found</h2>
                        <p className="text-gray-400 font-bold italic leading-relaxed">It looks like you haven't placed any orders yet.</p>
                    </div>
                    <Link
                        to="/products"
                        className="w-full bg-primary text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary-hover hover:scale-[1.03] active:scale-[0.98] transition-all shadow-2xl shadow-primary/30 uppercase tracking-[0.2em] text-xs"
                    >
                        Start Shopping Now
                    </Link>
                </div>
            </div>
        );
    }

    const id = order.id || order._id || 'TV-PENDING';
    const items = order.items || order.orderItems || [];
    const total = order.total || order.totalPrice || 0;

    // Calculate derived values if missing
    const subtotal = order.subtotal || (items.length > 0 ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0);
    const tax = order.tax || order.taxPrice || (total - subtotal);

    return (
        <div className="min-h-screen bg-white font-display flex flex-col transition-colors duration-500 selection:bg-primary/20">
            <HomeNavbar />

            <main className="flex-1 max-w-[1280px] mx-auto px-4 md:px-8 py-16 w-full mb-32">
                {/* Success Message Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center text-center py-20 relative overflow-hidden"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />

                    <div className="size-32 bg-primary text-white rounded-[40px] flex items-center justify-center mb-10 shadow-4xl shadow-primary/30 ring-8 ring-primary/5 animate-in slide-in-from-top-12 duration-1000">
                        <CheckCircle size={56} strokeWidth={2.5} />
                    </div>

                    <h1 className="text-gray-900 text-5xl md:text-8xl font-black leading-none tracking-tighter mb-6 italic uppercase animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Order <span className="text-primary">Confirmed!</span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-2xl font-bold italic flex items-center gap-3 justify-center max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-500">
                        <Mail size={24} className="text-primary flex-shrink-0" />
                        Order details sent! Please check your email inbox.
                    </p>
                </motion.div>

                {/* Core Details Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
                    <div className="flex flex-col gap-3 rounded-[40px] p-10 border border-gray-100 bg-white shadow-premium group hover:border-primary/20 transition-all duration-500">
                        <div className="flex items-center gap-4 text-gray-400 mb-2">
                            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Receipt size={24} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Order Number</p>
                        </div>
                        <p className="text-gray-900 text-4xl font-black tracking-tighter italic uppercase">#{id}</p>
                    </div>

                    <div className="flex flex-col gap-3 rounded-[40px] p-10 border border-gray-100 bg-white shadow-premium group hover:border-primary/20 transition-all duration-500">
                        <div className="flex items-center gap-4 text-gray-400 mb-2">
                            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Truck size={24} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Arriving By</p>
                        </div>
                        <p className="text-gray-900 text-4xl font-black tracking-tighter italic uppercase">OCT 24, 2026</p>
                    </div>

                    <div className="flex flex-col gap-3 rounded-[40px] p-10 border border-gray-900 bg-gray-900 text-white shadow-3xl group transition-all duration-500 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4 text-gray-400 mb-2">
                            <div className="size-12 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Clock size={24} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Current Status</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-white text-4xl font-black tracking-tighter italic uppercase">Processing</p>
                            <div className="size-3 bg-primary rounded-full animate-ping" />
                        </div>
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-16 border-y border-dashed border-gray-200 mb-24 animate-in fade-in duration-1000 delay-1000">
                    <Link
                        to={`/order-tracking/${id}`}
                        className="bg-primary text-white font-black px-12 py-6 rounded-[28px] flex items-center justify-center gap-4 min-w-[280px] hover:bg-primary-hover hover:-translate-y-1.5 active:translate-y-0 active:scale-95 transition-all shadow-4xl shadow-primary/30 uppercase tracking-[0.2em] text-xs"
                    >
                        <Map size={24} />
                        Track Order Now
                    </Link>
                    <Link
                        to="/products"
                        className="bg-white border-2 border-gray-100 text-gray-900 font-black px-12 py-6 rounded-[28px] flex items-center justify-center gap-4 min-w-[280px] hover:border-gray-900 hover:shadow-2xl hover:shadow-gray-100 transition-all uppercase tracking-[0.2em] text-xs"
                    >
                        <ShoppingBasket size={24} />
                        Continue Shopping
                    </Link>
                </div>

                {/* Order Summary Grid */}
                <div className="bg-white rounded-[48px] border border-gray-100 overflow-hidden shadow-premium animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-1000">
                    <div className="flex items-center justify-between px-10 py-10 border-b border-gray-50 bg-gray-50/30">
                        <h2 className="text-gray-900 text-3xl font-black uppercase tracking-tighter italic">Order Summary</h2>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-3 text-primary hover:text-white hover:bg-primary text-[10px] font-black uppercase tracking-[0.3em] transition-all bg-white px-6 py-3 rounded-2xl border border-primary/20 shadow-sm"
                        >
                            <Printer size={18} />
                            Print Bill
                        </button>
                    </div>

                    <div className="p-10 lg:p-16 flex flex-col lg:flex-row gap-20">
                        <div className="flex-1 space-y-10">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-8 group pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="size-32 bg-gray-50 rounded-[28px] overflow-hidden border border-gray-50 flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-700">
                                        <img src={item.images ? item.images[0].url : item.img} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h4 className="text-gray-900 font-black text-2xl tracking-tighter italic uppercase leading-none group-hover:text-primary transition-colors">{item.name}</h4>
                                        <div className="flex items-center gap-4">
                                            <span className="text-primary font-black text-[9px] uppercase tracking-[0.3em] bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 shadow-sm">Units: {item.quantity}</span>
                                            <span className="text-gray-400 font-black text-[9px] uppercase tracking-[0.3em]">ID: {item.sku || 'TV-UNIT'}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-900 font-black text-3xl tracking-tighter italic">{t('common', 'currency')}{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Calculations */}
                        <div className="w-full lg:w-[400px] space-y-8 p-10 bg-gray-50/50 rounded-[40px] border border-gray-100 shadow-inner h-fit">
                            <div className="space-y-5">
                                <div className="flex justify-between items-center italic">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 text-xl font-black tracking-tighter">{t('common', 'currency')}{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center italic">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Delivery Charge</span>
                                    <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px] bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">FREE</span>
                                </div>
                                <div className="flex justify-between items-center italic">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Tax</span>
                                    <span className="text-gray-900 text-xl font-black tracking-tighter">{t('common', 'currency')}{tax.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-dashed border-gray-200">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Total Amount</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-primary text-xl font-black italic -mb-2">{t('common', 'currency')}</span>
                                        <span className="text-6xl font-black tracking-tighter text-gray-900">{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Help */}
                <div className="mt-24 text-center space-y-10 bg-gray-900 rounded-[48px] p-16 text-white shadow-3xl shadow-gray-900/40 relative overflow-hidden group animate-in fade-in duration-1000 delay-1000">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-1000" />

                    <div className="relative z-10 space-y-4">
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic flex items-center justify-center gap-5">
                            <HelpCircle size={32} className="text-primary" />
                            Customer Support
                        </h3>
                        <p className="text-gray-500 text-lg font-bold italic leading-relaxed max-w-2xl mx-auto">
                            Need help? Our specialists are available 24/7. Send an email to <button className="text-primary font-black hover:underline px-2">support@truevalue.com</button> or call <span className="text-white">1-800-TRUE-VAL</span>.
                        </p>
                    </div>

                    <div className="flex justify-center gap-12 pt-4 relative z-10 border-t border-white/5 pt-10">
                        <button className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-colors italic">Privacy Policy</button>
                        <button className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-colors italic">Delivery FAQ</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderConfirmationPage;
