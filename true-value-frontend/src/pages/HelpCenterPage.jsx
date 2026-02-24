import React, { useState } from 'react';
import {
    Search, Package, RefreshCw, User, Wrench,
    TrendingUp, ChevronRight, MessageCircle, Mail,
    ArrowRight, LifeBuoy, Zap, ShieldCheck, Globe,
    ArrowUpRight, HelpCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomeNavbar from '../components/home/HomeNavbar';

const HelpCenterPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        {
            icon: Package,
            title: 'Order Intelligence',
            description: 'Tracking sequences, modifications, and cancel protocols.',
            path: '/tracking-search'
        },
        {
            icon: RefreshCw,
            title: 'Logistics Revoke',
            description: 'Returns policy and reverse supply-chain initiation.',
            path: '/shipping-policy'
        },
        {
            icon: User,
            title: 'Node Account',
            description: 'Credential resets and profile authority management.',
            path: '/profile'
        },
        {
            icon: Wrench,
            title: 'Technical Advisory',
            description: 'Interface troubleshooting and data synchronization.',
            path: '/faq'
        }
    ];

    const trendingArticles = [
        { id: 1, title: 'How do I synchronize my delivery coordinates?', path: '/tracking-search' },
        { id: 2, title: 'What is the 30-day logistics recall protocol?', path: '/shipping-policy' },
        { id: 3, title: 'Modifying deployment address post-purchase', path: '/shipping-policy' },
        { id: 4, title: 'Applying crypto-promotion strings', path: '/faq' }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/faq');
    };

    return (
        <div className="bg-gray-50 text-gray-900 min-h-screen font-display flex flex-col transition-colors duration-500 selection:bg-primary/20">
            <HomeNavbar />

            <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-16 md:py-24 space-y-24">
                {/* Search Hero Section */}
                <section className="relative max-w-5xl mx-auto text-center space-y-12 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic border border-primary/20 shadow-xl shadow-primary/5 mx-auto">
                        <LifeBuoy size={16} className="animate-pulse" />
                        Infrastructure Support Node
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                            Operational <span className="text-primary italic">Support</span>
                        </h2>
                        <p className="text-gray-400 text-xl font-bold italic max-w-2xl mx-auto leading-relaxed">
                            How can our tactical team assist your deployment today? Synchronize with our knowledge base.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto group">
                        <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none text-primary">
                            <Search size={28} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full h-24 pl-20 pr-48 bg-white border border-gray-100 rounded-[32px] shadow-premium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-xl font-bold text-gray-900 placeholder:text-gray-300 italic"
                            placeholder="Scan help articles, orders, or technical protocols..."
                            type="text"
                        />
                        <div className="absolute inset-y-3 right-3 flex items-center">
                            <button
                                type="submit"
                                className="bg-[#111811] text-white px-10 h-full rounded-[24px] font-black hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase tracking-[0.3em] shadow-4xl shadow-black/20"
                            >
                                Initiate Scan
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic">Frequency:</span>
                        <Link to="/order-tracking" className="text-[10px] font-black text-primary hover:text-gray-900 transition-colors uppercase tracking-[0.3em] italic underline decoration-primary/30 underline-offset-8">Track Flow</Link>
                        <Link to="/shipping-policy" className="text-[10px] font-black text-primary hover:text-gray-900 transition-colors uppercase tracking-[0.3em] italic underline decoration-primary/30 underline-offset-8">Recall Policy</Link>
                        <Link to="/faq" className="text-[10px] font-black text-primary hover:text-gray-900 transition-colors uppercase tracking-[0.3em] italic underline decoration-primary/30 underline-offset-8">Node Issues</Link>
                    </div>
                </section>

                {/* Category Grid Section */}
                <section className="relative space-y-12 animate-in fade-in duration-1000 delay-300">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                        <h3 className="text-4xl font-black italic tracking-tighter uppercase text-gray-900">Knowledge Sectors</h3>
                        <Link to="/faq" className="text-[10px] font-black text-primary flex items-center gap-4 hover:gap-6 transition-all uppercase tracking-[0.3em] italic group">
                            Full Terminal Access <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                to={category.path}
                                className="group bg-white p-12 rounded-[4rem] border border-gray-50 shadow-premium hover:shadow-4xl hover:-translate-y-2 transition-all text-left flex flex-col h-full"
                            >
                                <div className="size-16 bg-primary/5 rounded-[22px] flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-primary/5 shadow-inner">
                                    <category.icon size={32} />
                                </div>
                                <h4 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors italic uppercase tracking-tighter leading-none">
                                    {category.title}
                                </h4>
                                <p className="text-gray-400 font-bold italic text-sm leading-relaxed mb-10">
                                    {category.description}
                                </p>
                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic group-hover:text-primary transition-colors italic">Sector Locked</span>
                                    <ArrowUpRight size={18} className="text-gray-200 group-hover:text-primary transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Trending Articles Section */}
                <section className="relative grid grid-cols-1 lg:grid-cols-3 gap-20 py-16">
                    <div className="lg:col-span-2 space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000 delay-500">
                        <div className="flex items-center gap-6">
                            <div className="size-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow- premium shadow-primary/20">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase text-gray-900">Priority Data</h3>
                        </div>

                        <div className="space-y-6">
                            {trendingArticles.map((article, idx) => (
                                <Link
                                    key={article.id}
                                    to={article.path}
                                    className="block p-10 bg-white border border-gray-50 rounded-[3rem] hover:border-primary/20 hover:shadow- premium transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-8">
                                            <span className="text-4xl font-black text-gray-100 italic group-hover:text-primary/20 transition-colors">
                                                {String(article.id).padStart(2, '0')}
                                            </span>
                                            <span className="text-xl font-black text-gray-900 italic uppercase tracking-tighter group-hover:text-primary transition-colors">
                                                {article.title}
                                            </span>
                                        </div>
                                        <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                            <ChevronRight size={24} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Operational Support Sidebar */}
                    <div className="bg-gray-900 rounded-[5rem] p-12 md:p-16 flex flex-col justify-between shadow-4xl text-white relative overflow-hidden animate-in fade-in slide-in-from-right-12 duration-1000 delay-500" data-aos="fade-left">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />

                        <div className="relative z-10 space-y-10">
                            <div className="space-y-4">
                                <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center text-primary shadow-inner">
                                    <HelpCircle size={32} />
                                </div>
                                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Live Intel</h3>
                                <p className="text-gray-400 font-bold italic text-lg leading-relaxed">
                                    Can't find your deployment parameters? Our support grid is active 24/7 for project assistance.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <Link
                                    to="/contact"
                                    className="w-full h-20 flex items-center justify-center gap-4 bg-primary text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 shadow-4xl shadow-primary/30 transition-all group"
                                >
                                    <MessageCircle size={22} className="group-hover:animate-bounce" />
                                    Initiate Live Link
                                </Link>
                                <Link
                                    to="/contact"
                                    className="w-full h-20 flex items-center justify-center gap-4 bg-white/5 text-white border border-white/10 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all italic"
                                >
                                    <Mail size={22} className="text-primary" />
                                    Data Transmission
                                </Link>
                            </div>
                        </div>

                        <div className="relative z-10 mt-16 pt-10 border-t border-white/10">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 mb-3 italic">
                                Tactical Latency
                            </p>
                            <div className="flex items-end gap-3">
                                <p className="text-5xl font-black italic text-white leading-none">&lt; 120</p>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">sec frequency</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Secure Footer */}
                <div className="py-24 text-center space-y-10 animate-in fade-in duration-1000 delay-700">
                    <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">
                        <Link to="/terms-of-use" className="hover:text-primary hover:underline decoration-primary transition-colors">Terms of Ops</Link>
                        <Link to="/privacy-policy" className="hover:text-primary hover:underline decoration-primary transition-colors">Privacy Node</Link>
                        <Link to="/contact" className="hover:text-primary hover:underline decoration-primary transition-colors">Deploy Support</Link>
                        <Link to="/faq" className="hover:text-primary hover:underline decoration-primary transition-colors">Access Grid</Link>
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        <div className="size-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                            <ShieldCheck size={28} />
                        </div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.5em] italic">© T-VALUE SECURE . ALL NODES PROTECTED</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HelpCenterPage;
