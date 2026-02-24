import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Timer, ChevronRight, Zap, ShoppingCart } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const FlashSalesSection = ({ products }) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: '04',
        minutes: '52',
        seconds: '18'
    });
    const { t } = useLanguage();

    // Mock countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let s = parseInt(prev.seconds) - 1;
                let m = parseInt(prev.minutes);
                let h = parseInt(prev.hours);

                if (s < 0) {
                    s = 59;
                    m -= 1;
                }
                if (m < 0) {
                    m = 59;
                    h -= 1;
                }
                if (h < 0) h = 0;

                return {
                    hours: h.toString().padStart(2, '0'),
                    minutes: m.toString().padStart(2, '0'),
                    seconds: s.toString().padStart(2, '0')
                };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Flash sale products (limit to 4 for visual impact)
    const flashProducts = products.slice(0, 4);

    return (
        <section className="py-20 px-4 md:px-10 overflow-hidden relative">
            <div className="max-w-[1440px] mx-auto bg-gray-900 rounded-[64px] p-8 md:p-16 text-white shadow-3xl relative overflow-hidden group">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-50" />
                <div className="absolute -bottom-24 -left-24 size-96 bg-primary/20 rounded-full blur-[120px] group-hover:bg-primary/30 transition-colors duration-1000" />

                <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                    {/* Flash Sale Info */}
                    <div className="w-full lg:w-1/3 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 animate-pulse">
                                    <Flame size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">{t('flashSale', 'title')}</h2>
                                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">{t('flashSale', 'protocol')}</p>
                                </div>
                            </div>
                            <p className="text-gray-400 font-bold text-lg leading-relaxed italic">
                                {t('flashSale', 'tagline')}
                            </p>
                        </div>

                        {/* Countdown Timer */}
                        <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 shadow-inner group-hover:border-primary/20 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <Timer size={16} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{t('flashSale', 'countdown')}</span>
                            </div>
                            <div className="flex gap-4 justify-between">
                                <div className="flex flex-col items-center">
                                    <span className="text-5xl font-black tracking-tighter text-white">{timeLeft.hours}</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary mt-2">{t('flashSale', 'hours')}</span>
                                </div>
                                <span className="text-4xl font-black text-gray-700 mt-2">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-5xl font-black tracking-tighter text-white">{timeLeft.minutes}</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary mt-2">{t('flashSale', 'mins')}</span>
                                </div>
                                <span className="text-4xl font-black text-gray-700 mt-2">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-5xl font-black tracking-tighter text-white">{timeLeft.seconds}</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary mt-2">{t('flashSale', 'secs')}</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/products"
                            className="inline-flex h-16 w-full px-8 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 items-center justify-center gap-4 group/btn"
                        >
                            <Zap size={18} className="group-hover/btn:rotate-12 transition-transform" />
                            {t('flashSale', 'intercept')}
                            <ChevronRight size={18} className="ml-auto group-hover/btn:translate-x-1.5 transition-transform" />
                        </Link>
                    </div>

                    {/* Flash Products Grid */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                        {flashProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8 }}
                                className="bg-white rounded-[40px] p-6 group/card relative overflow-hidden shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                            >
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20">
                                        <Percent size={12} className="stroke-[3]" />
                                        -35%
                                    </div>
                                </div>

                                <div className="aspect-square rounded-3xl overflow-hidden mb-6 relative group/img">
                                    <img src={product.img || product.images?.[0]} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" alt={product.name} />
                                    <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button className="p-4 bg-white text-gray-900 rounded-full shadow-2xl scale-0 group-hover/img:scale-100 transition-transform duration-500 delay-100">
                                            <ShoppingCart size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-1">{product.category}</p>
                                        <h4 className="text-gray-900 font-black text-xl tracking-tight leading-none uppercase italic truncate">{product.name}</h4>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div className="space-y-1">
                                            <p className="text-gray-400 text-xs font-bold line-through">₹{((product.price || 0) * 1.35).toFixed(0)}</p>
                                            <p className="text-gray-900 font-black text-2xl tracking-tighter leading-none">₹{product.price}</p>
                                        </div>
                                        <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/card:bg-primary group-hover/card:text-white transition-all transform group-hover/card:rotate-90 duration-500">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Percent = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="19" y1="5" x2="5" y2="19"></line>
        <circle cx="6.5" cy="6.5" r="2.5"></circle>
        <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
);

export default FlashSalesSection;
