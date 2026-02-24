import React, { useState } from 'react';
import {
    Search, BookOpen, Clock, User, ArrowRight,
    Filter, LayoutGrid, List, ChevronRight, GraduationCap,
    Lightbulb, Sparkles, Target, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeNavbar from '../components/home/HomeNavbar';
import { articles } from '../data/siteData';

const TipsAdvicePage = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const categories = ['All', 'Kitchen', 'Gardening', 'Electrical', 'Painting', 'Flooring'];

    const filteredArticles = articles.filter(article => {
        const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 font-display flex flex-col transition-colors duration-500 selection:bg-primary/20">
            <HomeNavbar />

            <main className="flex-1 max-w-[1440px] mx-auto px-6 py-16 md:py-24 w-full space-y-16">
                {/* Hero Section */}
                <div
                    className="relative overflow-hidden rounded-[4rem] bg-[#111811] text-white p-12 md:p-24 shadow-4xl animate-in fade-in slide-in-from-top-12 duration-1000"
                >
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-0" />

                    <div className="relative z-10 max-w-3xl space-y-10">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic border border-primary/20 shadow-xl shadow-primary/5">
                            <GraduationCap size={16} />
                            Tactical DIY Academy
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
                            Operational <span className="text-primary italic">Intel</span> for Every Build.
                        </h1>
                        <p className="text-gray-400 text-xl font-bold italic leading-relaxed max-w-2xl">
                            Deploy expert techniques and precision protocols for your home infrastructure. Transmission from our master contractors.
                        </p>

                        <div className="flex w-full max-w-xl bg-white/5 backdrop-blur-2xl rounded-[28px] border border-white/10 p-3 shadow-premium group transition-all focus-within:ring-4 focus-within:ring-primary/10">
                            <div className="flex items-center pl-6 text-primary">
                                <Search size={24} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tactical guides, intel, and protocols..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-base font-bold text-white placeholder-gray-600 px-6 outline-none"
                            />
                        </div>
                    </div>

                    {/* Scanning overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-40" />
                </div>

                {/* Filter & View Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 animate-in fade-in duration-1000 delay-300">
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-10 h-16 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] transition-all italic shrink-0 ${activeCategory === cat ? 'bg-primary text-gray-900 shadow-4xl shadow-primary/30 scale-[1.05]' : 'bg-white border border-gray-100 text-gray-400 hover:text-gray-600 hover:shadow-premium'}`}
                            >
                                {cat === 'All' ? 'Global Grid' : cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-[24px] border border-gray-100 shadow-premium self-end">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`size-12 rounded-xl transition-all flex items-center justify-center ${viewMode === 'grid' ? 'bg-[#111811] text-primary shadow-xl' : 'text-gray-300 hover:text-gray-500'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`size-12 rounded-xl transition-all flex items-center justify-center ${viewMode === 'list' ? 'bg-[#111811] text-primary shadow-xl' : 'text-gray-300 hover:text-gray-500'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {/* Articles Grid */}
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" : "flex flex-col gap-10"}>
                    <AnimatePresence mode="popLayout">
                        {filteredArticles.map((article, idx) => (
                            <motion.div
                                key={article.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                                className={`group bg-white rounded-[4rem] border border-gray-50 overflow-hidden hover:shadow-premium transition-all relative ${viewMode === 'list' ? 'flex flex-col xl:flex-row h-auto' : 'flex flex-col'}`}
                            >
                                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-full xl:w-[480px] h-[320px] xl:h-auto' : 'aspect-[1.4/1]'}`}>
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <div className="absolute top-8 left-8">
                                        <span className="px-6 py-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] text-[9px] font-black uppercase tracking-[0.3em] text-gray-900 shadow-3xl border border-white/20 italic">
                                            {article.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                                        <div className="size-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-4xl shadow-primary/40">
                                            <Target size={24} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 md:p-14 flex-1 flex flex-col space-y-8">
                                    <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
                                        <span className="flex items-center gap-2"><Clock size={16} className="text-primary" /> {article.readTime} mission</span>
                                        <div className="size-1.5 bg-gray-100 rounded-full" />
                                        <span className="flex items-center gap-2"><User size={16} className="text-primary" /> Master {article.author.split(' ')[0]}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight group-hover:text-primary transition-colors italic uppercase">
                                        {article.title}
                                    </h3>
                                    <p className="text-base text-gray-400 leading-relaxed line-clamp-2 italic font-bold">
                                        "{article.excerpt}"
                                    </p>

                                    <div className="pt-10 flex items-center justify-between border-t border-gray-50 mt-auto">
                                        <span className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">{article.date}</span>
                                        <button className="text-primary text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 group/btn italic group-hover:gap-6 transition-all">
                                            Access Full Intel
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredArticles.length === 0 && (
                    <div className="text-center py-32 space-y-8 animate-in zoom-in duration-1000">
                        <div className="size-32 bg-gray-100 rounded-[32px] flex items-center justify-center mx-auto text-gray-300 shadow-inner">
                            <BookOpen size={64} strokeWidth={1} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Intel Data Missing</h3>
                            <p className="text-gray-400 font-bold italic text-lg max-w-md mx-auto">Sector yields zero results. Re-encrypt your search parameters or restore global filters.</p>
                        </div>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                            className="px-12 py-5 bg-[#111811] text-primary rounded-[20px] font-black uppercase tracking-[0.4em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-black/20"
                        >
                            Reset Global Scan
                        </button>
                    </div>
                )}

                {/* Tactical Call to Action */}
                <div className="py-24 bg-gray-900 rounded-[5rem] p-12 md:p-24 text-center space-y-12 relative overflow-hidden shadow-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10 space-y-8">
                        <div className="size-20 bg-primary/20 rounded-[28px] flex items-center justify-center text-primary mx-auto border border-primary/20 shadow-inner">
                            <Zap size={40} className="fill-current" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                            Operationalize Your <span className="text-primary italic">Build</span>
                        </h2>
                        <p className="text-gray-400 text-xl font-bold italic max-w-3xl mx-auto leading-relaxed">
                            Join 2M+ Pro DIYers receiving weekly intelligence drops. Optimize your home infrastructure today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                            <input
                                type="email"
                                placeholder="Satellite Data Receipt (Email)"
                                className="h-20 px-10 bg-white/5 border border-white/10 rounded-[28px] text-white font-bold italic placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-primary/20 w-full max-w-md"
                            />
                            <button className="h-20 px-12 bg-primary text-white font-black rounded-[28px] uppercase tracking-[0.3em] text-[11px] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-primary/30">
                                Synchronize Intel
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TipsAdvicePage;
