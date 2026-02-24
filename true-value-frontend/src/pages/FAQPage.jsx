import React, { useState } from 'react';
import HomeNavbar from '../components/home/HomeNavbar';
import {
    Search, Package, CreditCard, Star, Wrench,
    ChevronDown, Headphones, Zap, ShieldCheck,
    MessageCircle, ArrowRight, Info, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FAQPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState({ '0-0': true });

    const faqData = [
        {
            category: 'Order Logistics',
            icon: Package,
            questions: [
                {
                    q: 'How do I synchronize my order tracking?',
                    a: "Access the tracking terminal in your dashboard or use the unique hash provided in your dispatch confirmation email. Real-time geospatial updates are available once the carrier initializes the sequence."
                },
                {
                    q: 'Operational deployment timelines?',
                    a: 'Standard hardware logistics complete in 3-5 objective business days. Priority transmission (1-2 days) is available at checkout for verified sectors. Heavy infrastructure (lumber, equipment) follows freight protocols (7-10 days).'
                },
                {
                    q: 'Pro-level bulk manifests?',
                    a: 'Yes. Volume optimizations are available for contractor-level deployments. Access the Pro Desk terminal or use the "Bulk Manifest" protocol on resource pages for orders exceeding 50 units.'
                }
            ]
        },
        {
            category: 'Settlements & Tax',
            icon: CreditCard,
            questions: [
                {
                    q: 'Accepted settlement protocols?',
                    a: 'All major credit channels (Visa, MC, AMEX), PayPal, Apple Pay, and the TrueValue Secure Commercial Card. Pro-nodes support Net-30 invoicing upon credit validation.'
                },
                {
                    q: 'Exemption status registration?',
                    a: "Transmit your state-issued exemption certificate via the 'Security Settings' portal. Upon validation (approx. 24 hours), tax-shield protocols will activate for all future manifests."
                }
            ]
        },
        {
            category: 'Logistics Rewards',
            icon: Star,
            questions: [
                {
                    q: 'Yield generation and redemption?',
                    a: 'Pro nodes generate 2 yield units per $1 spent. Units can be liquidated at checkout for manifest discounts. 500 units = $5 credit. Units expire after 12 months of sector inactivity.'
                }
            ]
        },
        {
            category: 'Tactical Support',
            icon: Wrench,
            questions: [
                {
                    q: 'Accessing assembly blueprints?',
                    a: "Resource pages feature 'Technical Specifications' where PDF blueprints can be retrieved. High-tier power tools include video tactical walkthroughs on our field intel channel."
                }
            ]
        }
    ];

    const toggleItem = (key) => {
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const filteredFAQ = searchQuery
        ? faqData.map(section => ({
            ...section,
            questions: section.questions.filter(
                item =>
                    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.a.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(section => section.questions.length > 0)
        : faqData;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-display flex flex-col transition-colors duration-500 selection:bg-primary/20">
            <HomeNavbar />

            <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col px-6 py-16 lg:py-24 space-y-16">
                {/* Page Heading */}
                <div className="space-y-8 animate-in fade-in slide-in-from-top-12 duration-1000 text-center md:text-left">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic border border-primary/20 shadow-xl shadow-primary/5">
                        <HelpCircle size={16} className="animate-pulse" />
                        Intelligence Database
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                        Tactical <span className="text-primary italic">FAQ</span>
                    </h1>
                    <p className="text-gray-400 text-xl font-bold italic leading-relaxed max-w-2xl mx-auto md:mx-0">
                        Synchronize with our knowledge grid. Verified answers for logistics, settlements, and technical deployments.
                    </p>
                </div>

                {/* Search Bar Terminal */}
                <div className="animate-in fade-in duration-1000 delay-300">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none text-primary">
                            <Search size={32} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full h-24 pl-22 pr-8 bg-white border border-gray-100 rounded-[32px] shadow-premium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-xl font-bold text-gray-900 placeholder:text-gray-200 italic"
                            placeholder="Scan intelligence grid for keywords..."
                        />
                        {/* Scanning beam effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000" />
                    </div>
                </div>

                {/* FAQ Grid */}
                <div className="space-y-20">
                    {filteredFAQ.map((section, sectionIdx) => (
                        <section key={sectionIdx} className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${sectionIdx * 150}ms` }}>
                            <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
                                <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/5 shadow-inner">
                                    <section.icon size={28} />
                                </div>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-gray-900">{section.category}</h2>
                            </div>

                            <div className="grid gap-6">
                                {section.questions.map((item, itemIdx) => {
                                    const key = `${sectionIdx}-${itemIdx}`;
                                    const isOpen = openItems[key];

                                    return (
                                        <div
                                            key={key}
                                            className={`rounded-[2.5rem] border transition-all duration-500 ${isOpen ? 'bg-white border-primary/20 shadow-premium' : 'bg-transparent border-gray-100 hover:border-gray-200 hover:bg-white'}`}
                                        >
                                            <button
                                                onClick={() => toggleItem(key)}
                                                className="flex items-center justify-between p-8 md:p-10 w-full text-left"
                                            >
                                                <span className={`text-xl font-black italic tracking-tight uppercase leading-none transition-colors ${isOpen ? 'text-primary' : 'text-gray-900'}`}>{item.q}</span>
                                                <div className={`size-12 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-primary text-white rotate-180 shadow-3xl shadow-primary/30' : 'bg-gray-50 text-gray-300'}`}>
                                                    <ChevronDown size={24} strokeWidth={3} />
                                                </div>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-10 pb-10 text-gray-400 font-bold italic text-base leading-relaxed border-t border-gray-50 pt-8 mt-2 mx-2">
                                                            {item.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}

                    {filteredFAQ.length === 0 && (
                        <div className="text-center py-32 space-y-8 animate-in zoom-in duration-700">
                            <div className="size-24 bg-gray-100 rounded-[24px] flex items-center justify-center mx-auto text-gray-300">
                                <Info size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black italic tracking-tighter uppercase">Data Not Found</h3>
                                <p className="text-gray-400 font-bold italic">Sector zero for "{searchQuery}". Try localized keywords.</p>
                            </div>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-primary font-black uppercase tracking-[0.3em] text-[10px] italic underline underline-offset-8"
                            >
                                Reset Intel Grid
                            </button>
                        </div>
                    )}
                </div>

                {/* Tactical Support Hub */}
                <div className="py-24 bg-[#111811] rounded-[4rem] p-12 md:p-20 text-center space-y-12 relative overflow-hidden shadow-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />

                    <div className="relative z-10 space-y-10">
                        <div className="size-20 bg-primary/20 rounded-[28px] flex items-center justify-center text-primary mx-auto border border-white/5 shadow-inner">
                            <Headphones size={40} />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                                Request Live <span className="text-primary italic">Frequency</span>
                            </h2>
                            <p className="text-gray-500 text-xl font-bold italic max-w-2xl mx-auto leading-relaxed">
                                Can't identify the solution in our grid? Synchronize with an expert operator for immediate tactical instructions.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8 justify-center pt-6">
                            <Link
                                to="/contact"
                                className="h-20 px-16 bg-primary text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-primary/30 flex items-center gap-4"
                            >
                                <MessageCircle size={20} />
                                Start Protocol
                            </Link>
                            <Link
                                to="/contact"
                                className="h-20 px-16 bg-white/5 text-white border border-white/10 rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all italic flex items-center gap-4"
                            >
                                <Headphones size={20} className="text-primary" />
                                Voice Intel
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="py-12 flex flex-col items-center gap-6 animate-in fade-in duration-1000 delay-1000">
                    <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-gray-200 shadow-premium border border-gray-50">
                        <ShieldCheck size={32} />
                    </div>
                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.4em] italic">Knowledge Core v4.0 . Secured Deployment</p>
                </div>
            </main>
        </div>
    );
};

export default FAQPage;
