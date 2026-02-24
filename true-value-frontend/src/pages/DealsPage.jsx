import React, { useState, useEffect } from 'react';
import {
    Tag, Timer, Sparkles, Gift, Percent,
    ChevronRight, Copy, Check, Scissors, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeNavbar from '../components/home/HomeNavbar';
import { deals } from '../data/siteData';
import showAlert from '../utils/swal';
import { Link } from 'react-router-dom';

const DealsPage = () => {
    const [clippedCoupons, setClippedCoupons] = useState({});

    // Deep scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const handleClip = (id) => {
        setClippedCoupons(prev => ({ ...prev, [id]: true }));
        showAlert({
            title: "Coupon Clipped!",
            text: "Discount will be applied at checkout.",
            icon: "success",
            toast: true,
            position: 'top-end',
            timer: 3000
        });
    };

    return (
        <div className="min-h-screen bg-white font-display flex flex-col selection:bg-primary/20">
            <HomeNavbar />

            <main className="flex-1 max-w-[1440px] mx-auto px-4 md:px-8 py-12 w-full space-y-20">
                {/* Header Section */}
                <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-primary/10">
                        <Sparkles size={12} />
                        Exclusive Offers
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight max-w-4xl mx-auto">
                        Big Savings on <span className="text-primary">Premium</span> Quality.
                    </h1>
                    <p className="text-gray-400 font-medium max-w-xl mx-auto text-lg">
                        The Weekly Ad is here. Grab exclusive coupons and flash sales before they're gone.
                    </p>
                </div>

                {/* Featured Sale Banner */}
                <div
                    className="relative overflow-hidden rounded-[48px] bg-gray-900 p-8 md:p-16 text-white shadow-3xl flex flex-col lg:flex-row items-center gap-12 border border-gray-800 animate-in fade-in zoom-in-95 duration-1000"
                >
                    <div className="relative z-10 space-y-10 flex-1">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center size-14 bg-white/10 rounded-2xl backdrop-blur-md">
                                <Percent size={32} className="text-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Season Premiere Sale</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">Ultimate Fresh Harvest</h2>
                        <div className="flex flex-wrap items-center gap-10">
                            <div className="flex flex-col">
                                <span className="text-7xl font-black text-primary leading-none">40%</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Off All Organic Produce</span>
                            </div>
                            <div className="w-px h-16 bg-white/10 hidden md:block" />
                            <div className="flex flex-col gap-2">
                                <div className="bg-white/10 px-6 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                                    <span className="text-xs font-black uppercase tracking-widest">Code: HARVEST40</span>
                                </div>
                                <span className="text-xs font-medium text-gray-400">Valid on fruits, vegetables, and greens.</span>
                            </div>
                        </div>
                        <Link
                            to="/products"
                            className="inline-flex h-16 px-12 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 items-center gap-3 cursor-pointer"
                        >
                            <ShoppingBag size={20} />
                            Shop The Sale
                        </Link>
                    </div>

                    <div className="relative z-10 w-full lg:w-1/3 aspect-square bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 flex items-center justify-center p-12 overflow-hidden">
                        <div className="text-center space-y-6">
                            <Timer size={100} className="mx-auto text-primary animate-pulse" />
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Ending Soon</p>
                                <div className="flex gap-6 justify-center">
                                    <div className="flex flex-col"><span className="text-4xl font-black">04</span><span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Hrs</span></div>
                                    <div className="flex flex-col"><span className="text-4xl font-black">22</span><span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Min</span></div>
                                    <div className="flex flex-col"><span className="text-4xl font-black">45</span><span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Sec</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-primary/10 blur-[120px] rounded-full -mr-20 -mt-20 opacity-50" />
                </div>

                {/* Coupons Grid */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                <Scissors className="rotate-45" size={24} />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
                                Digital Coupons
                            </h3>
                        </div>
                        <button className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer border-b-2 border-transparent hover:border-primary">View All Coupons</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {deals.map((deal, idx) => (
                            <div
                                key={deal.id}
                                className="group relative bg-white rounded-[40px] border border-dashed border-gray-200 p-8 hover:border-primary/30 transition-all overflow-hidden hover:shadow-2xl hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                        <Tag size={32} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="px-3 py-1 bg-primary/10 text-[8px] font-black uppercase tracking-widest rounded-lg text-primary mb-2">
                                            Ending Soon
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-bold tracking-wider">{deal.expiry}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{deal.type}</p>
                                    <h4 className="text-2xl font-black text-gray-900 tracking-tight leading-tight uppercase group-hover:text-primary transition-colors">
                                        {deal.title}
                                    </h4>
                                    {deal.minPurchase && (
                                        <p className="text-xs text-gray-400 font-medium">Min. order ₹{deal.minPurchase}</p>
                                    )}
                                </div>

                                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Coupon Code</span>
                                        <span className="text-lg font-black tracking-tighter text-gray-900 uppercase">{deal.code || 'Auto-Apply'}</span>
                                    </div>
                                    <button
                                        onClick={() => handleClip(deal.id)}
                                        className={`h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${clippedCoupons[deal.id] ? 'bg-gray-100 text-gray-400 active:scale-100' : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95'}`}
                                        disabled={clippedCoupons[deal.id]}
                                    >
                                        {clippedCoupons[deal.id] ? <><Check size={14} /> Clipped</> : 'Clip to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Ad Preview */}
                <div
                    className="relative rounded-[48px] bg-gray-50/50 p-8 md:p-16 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-1000"
                >
                    <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                        <div className="w-full lg:w-1/2">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <img
                                    src="https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&w=800&q=80"
                                    className="relative rounded-[40px] shadow-3xl group-hover:-rotate-2 transition-transform duration-700 w-full object-cover"
                                    alt="Weekly Flyer"
                                />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 bg-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none scale-0 group-hover:scale-100 duration-500">
                                    <ChevronRight size={32} className="text-primary" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 space-y-8">
                            <div className="space-y-4">
                                <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-premium">
                                    <Gift size={32} />
                                </div>
                                <h3 className="text-5xl font-black text-gray-900 tracking-tighter leading-none uppercase">This Week's Flyer</h3>
                            </div>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                Check out the interactive flyer for your local store. Browse hundreds of items on sale now and plan your harvest list.
                            </p>
                            <div className="space-y-4 pt-4">
                                <Link to="/products" className="flex items-center gap-6 group cursor-pointer w-fit">
                                    <div className="size-12 bg-white text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-premium group-hover:shadow-primary/20">
                                        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                    <span className="font-black text-xs uppercase tracking-widest text-gray-900 group-hover:text-primary transition-colors">Digital Ad Viewer</span>
                                </Link>
                                <div className="flex items-center gap-6 group cursor-pointer w-fit opacity-50 grayscale">
                                    <div className="size-12 bg-white text-gray-400 rounded-2xl flex items-center justify-center">
                                        <ChevronRight size={20} />
                                    </div>
                                    <span className="font-black text-xs uppercase tracking-widest text-gray-900">Download PDF version</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DealsPage;
