import React, { useState, useEffect } from 'react';
import HomeNavbar from '../components/home/HomeNavbar';
import { Calculator, ShoppingBag, ArrowRight, RefreshCcw, Plus, Minus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ProjectCalculatorPage() {
    const [items] = useState([
        { id: 'p1', name: 'Premium Organic Fertilizer', price: 450, unit: 'bag' },
        { id: 'p2', name: 'High-Yield Hybrid Seeds', price: 120, unit: 'packet' },
        { id: 'p3', name: 'Advanced Irrigation Kit', price: 2999, unit: 'set' },
        { id: 'p4', name: 'Protective Garden Mesh', price: 850, unit: 'roll' },
        { id: 'p5', name: 'Eco-Friendly Pest Control', price: 350, unit: 'bottle' },
    ]);
    const [selected, setSelected] = useState({});

    // Deep scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const handleChange = (id, qty) => {
        const val = Math.max(0, parseInt(qty) || 0);
        setSelected(prev => ({ ...prev, [id]: val }));
    };

    const resetCalculator = () => {
        setSelected({});
    };

    const total = items.reduce((sum, item) => {
        const qty = selected[item.id] || 0;
        return sum + qty * item.price;
    }, 0);

    return (
        <div className="min-h-screen bg-white font-display text-gray-900 selection:bg-primary/20 flex flex-col">
            <HomeNavbar />

            <main className="flex-1 max-w-[1440px] mx-auto px-4 md:px-8 py-12 w-full mb-20">
                {/* Header Side */}
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-6 duration-1000">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-[0.3em] border border-primary/10">
                                <Calculator size={14} />
                                Resource Estimation
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
                                Project <span className="text-primary">Calculator</span>
                            </h1>
                            <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                                Blueprint your harvest. Estimate total procurement costs by selecting required units for your agricultural projects.
                            </p>
                        </div>

                        {/* Totals Card (Mobile) */}
                        <div className="lg:hidden p-8 bg-gray-900 rounded-[32px] text-white space-y-6 shadow-2xl">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Estimated Total</span>
                                <button onClick={resetCalculator} className="text-primary hover:text-white transition-colors">
                                    <RefreshCcw size={18} />
                                </button>
                            </div>
                            <div className="text-5xl font-black tracking-tighter">₹{total.toLocaleString()}</div>
                            <Link to="/products" className="w-full h-14 bg-primary text-white flex items-center justify-center gap-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                                <ShoppingBag size={16} /> Procure Assets
                            </Link>
                        </div>

                        {/* Items Table */}
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden">
                            <div className="grid grid-cols-1 divide-y divide-gray-50">
                                {items.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                                <Plus size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black tracking-tight text-gray-900 uppercase group-hover:text-primary transition-colors">{item.name}</h3>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">₹{item.price} / {item.unit}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 ml-auto md:ml-0">
                                            <div className="flex items-center bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
                                                <button
                                                    onClick={() => handleChange(item.id, (selected[item.id] || 0) - 1)}
                                                    className="size-12 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={selected[item.id] || ''}
                                                    onChange={e => handleChange(item.id, e.target.value)}
                                                    className="w-16 bg-transparent text-center font-black text-lg outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    placeholder="0"
                                                />
                                                <button
                                                    onClick={() => handleChange(item.id, (selected[item.id] || 0) + 1)}
                                                    className="size-12 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                            <div className="w-24 text-right">
                                                <p className="text-lg font-black tracking-tighter text-gray-900">₹{((selected[item.id] || 0) * item.price).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[40px] bg-gray-50 border border-gray-100 flex items-start gap-6">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                                <Info size={24} />
                            </div>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed italic">
                                Note: These are baseline estimates based on current marketplace values. Actual costs may vary slightly depending on real-time availability and volume discounts.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar Totals (Desktop) */}
                    <aside className="w-full lg:w-[400px] sticky top-28 animate-in fade-in slide-in-from-right-6 duration-1000">
                        <div className="bg-gray-900 rounded-[48px] p-10 text-white space-y-10 shadow-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-1000" />

                            <div className="space-y-2 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Operation Manifest</span>
                                    <button onClick={resetCalculator} className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-primary hover:bg-white/10 transition-all">
                                        <RefreshCcw size={16} />
                                    </button>
                                </div>
                                <h2 className="text-2xl font-black tracking-tight uppercase italic">Procurement Total</h2>
                            </div>

                            <div className="space-y-1 pt-4 relative z-10">
                                <div className="text-7xl font-black tracking-tighter flex items-start gap-2">
                                    <span className="text-primary text-3xl mt-2 italic">₹</span>
                                    {total.toLocaleString()}
                                </div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest pl-1">Excluding potential dynamic tax</p>
                            </div>

                            <div className="space-y-4 pt-6 relative z-10">
                                <Link
                                    to="/products"
                                    className="w-full h-20 bg-primary text-white flex items-center justify-center gap-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all group/btn"
                                >
                                    <ShoppingBag size={22} className="group-hover/btn:rotate-12 transition-transform" />
                                    Begin Procurement
                                    <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                                </Link>
                                <button
                                    onClick={() => showAlert({ title: 'Export Success', text: 'Manifest exported as PDF protocol.', icon: 'success' })}
                                    className="w-full h-16 bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                                >
                                    Download Manifest
                                </button>
                            </div>

                            <div className="text-[9px] font-bold text-gray-600 uppercase text-center leading-relaxed pt-2 opacity-50">
                                Secure transaction protocol V4.2 <br />
                                TrueValue Logistics
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
