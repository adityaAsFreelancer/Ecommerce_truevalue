import React, { useState, useEffect } from 'react';
import {
    Search, ChevronRight, FileText, Database, Settings,
    Share2, Cookie, Shield, CheckCircle, Truck,
    CreditCard, Mail, Download, Trash2, ArrowUp,
    ShieldAlert, Globe, Lock, Key, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HomeNavbar from '../components/home/HomeNavbar';
import { motion, AnimatePresence } from 'framer-motion';

const PrivacyPolicyPage = () => {
    const [activeSection, setActiveSection] = useState('intro');
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sidebarLinks = [
        { id: 'intro', icon: FileText, label: 'Protocols' },
        { id: 'collection', icon: Database, label: 'Data Retrieval' },
        { id: 'usage', icon: Settings, label: 'Grid Utilization' },
        { id: 'sharing', icon: Share2, label: 'Third-Party Node' },
        { id: 'cookies', icon: Cookie, label: 'Trace Tracking' },
        { id: 'rights', icon: Shield, label: 'Legal Authority' }
    ];

    const dataTypes = [
        { icon: CheckCircle, title: 'Identity Matrix: Credentialed Name, title, and sector birth.' },
        { icon: CheckCircle, title: 'Contact Coordinates: Deployment address, billing terminal, and encrypted mail.' },
        { icon: CheckCircle, title: 'Manifest History: Details of project resources and settlement cycles.' },
        { icon: CheckCircle, title: 'Technical Intel: IP hash, terminal type, and hardware specifications.' }
    ];

    const thirdParties = [
        { icon: Truck, label: 'Logistics partners (UPS, FedEx, Tactical Couriers)' },
        { icon: CreditCard, label: 'Settlement processors (Stripe, PayPal)' },
        { icon: Mail, label: 'Intelligence platforms for DIY frequency broadcast' }
    ];

    const cookieTypes = [
        { title: 'Structural', description: 'Core functional nodes required for platform stability.' },
        { title: 'Diagnostic', description: 'Monitoring platform health and interface efficiency.' },
        { title: 'Targeting', description: 'Suggesting relevant resources for your build manifest.' }
    ];

    return (
        <div className="bg-gray-50 text-gray-900 min-h-screen font-display flex flex-col transition-colors duration-500 selection:bg-primary/20">
            <HomeNavbar />

            <main className="max-w-[1440px] mx-auto w-full px-6 py-12 md:py-24 space-y-16">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-12 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic border border-primary/20 shadow-xl shadow-primary/5">
                            <Lock size={16} />
                            Data Security Protocol v4.0
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                            Privacy <span className="text-primary italic">Node</span>
                        </h1>
                        <p className="text-gray-400 text-xl font-bold italic max-w-2xl leading-relaxed">
                            Full transparency on data retrieval, grid utilization, and sector rights. Your intellectual property is our primary directive.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-20 items-start">
                    {/* Sticky Sidebar Terminal */}
                    <aside className="hidden xl:block w-80 sticky top-[100px] animate-in slide-in-from-left-8 duration-1000">
                        <div className="p-10 rounded-[3rem] bg-white border border-gray-50 shadow-premium space-y-12">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 italic">
                                    Sector Index
                                </h4>
                                <nav className="flex flex-col gap-3">
                                    {sidebarLinks.map((link) => (
                                        <a
                                            key={link.id}
                                            href={`#${link.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActiveSection(link.id);
                                                document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={`group flex items-center justify-between p-5 rounded-2xl transition-all ${activeSection === link.id
                                                ? 'bg-[#111811] text-primary shadow-4xl shadow-primary/20 scale-[1.05]'
                                                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <link.icon
                                                    size={22}
                                                    className={`transition-colors ${activeSection === link.id ? 'text-primary' : 'group-hover:text-primary'}`}
                                                />
                                                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{link.label}</span>
                                            </div>
                                            {activeSection === link.id && <ChevronRight size={18} />}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            <div className="pt-10 border-t border-gray-50">
                                <div className="p-8 bg-primary rounded-[32px] text-white space-y-6 shadow-4xl shadow-primary/20 relative overflow-hidden group">
                                    <div className="absolute -top-10 -right-10 size-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                    <ShieldAlert size={40} className="relative z-10" />
                                    <h5 className="text-xl font-black italic uppercase tracking-tighter leading-tight relative z-10">Intel Sync Required?</h5>
                                    <p className="text-sm font-bold italic leading-relaxed text-white/80 relative z-10">
                                        Coordinate with our Security Officer for data audits.
                                    </p>
                                    <Link
                                        to="/contact"
                                        className="w-full h-14 bg-white text-primary rounded-xl font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all relative z-10"
                                    >
                                        Contact Officer
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Content Matrix */}
                    <article className="flex-1 space-y-24 pb-24">
                        {/* Section: Overview */}
                        <section id="intro" className="scroll-mt-[120px] space-y-12 animate-in fade-in duration-1000 delay-300">
                            <div className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-white border border-gray-50 shadow-premium">
                                <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] italic mb-1">
                                        Last Verified Cycle: Oct 2023
                                    </p>
                                    <p className="text-gray-400 font-bold italic text-sm">
                                        Effective immediately for all localized nodes and fleet members.
                                    </p>
                                </div>
                            </div>
                            <div className="prose prose-xl max-w-none text-gray-500 font-bold italic leading-relaxed space-y-8">
                                <p>
                                    At TrueValue, we acknowledge the strategic priority of your personal data hashes. Our directive is built on categorical transparency and absolute respect for your authority. This protocol outlines how we retrieve, shield, and utilize your intel across our primary command nodes and digital interfaces.
                                </p>
                            </div>
                        </section>

                        {/* Section: Data Retrieval */}
                        <section id="collection" className="scroll-mt-[120px] space-y-10 group">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <div className="size-14 rounded-2xl bg-[#111811] text-primary flex items-center justify-center font-black italic group-hover:scale-110 transition-transform shadow-xl">01</div>
                                Data Retrieval
                            </h2>
                            <div className="space-y-8 text-gray-500 font-bold italic leading-relaxed">
                                <p>
                                    We intercept data provided directly to our nodes when you process a manifest, join the Rewards grid, or subscribe to tactical frequency broadcasts.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    {dataTypes.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-white border border-gray-50 group hover:border-primary/20 hover:shadow-premium transition-all"
                                        >
                                            <div className="size-12 rounded-xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                                                <item.icon size={22} />
                                            </div>
                                            <span className="text-base font-black text-gray-900 italic uppercase tracking-tighter leading-none">{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Section: Grid Utilization */}
                        <section id="usage" className="scroll-mt-[120px] space-y-10 group">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <div className="size-14 rounded-2xl bg-[#111811] text-primary flex items-center justify-center font-black italic group-hover:scale-110 transition-transform shadow-xl">02</div>
                                Grid Utilization
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="p-10 bg-white rounded-[3.5rem] border border-gray-50 shadow-premium space-y-6 hover:shadow-4xl transition-all">
                                    <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 border border-primary/5 shadow-inner">
                                        <Truck size={32} />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter leading-tight">Manifest Fulfillment</h4>
                                    <p className="text-gray-400 font-bold italic leading-relaxed">
                                        Settlement processing, logistics deployment, and managing reverse supply-chains for your build projects.
                                    </p>
                                </div>
                                <div className="p-10 bg-[#111811] rounded-[3.5rem] border border-black shadow-4xl space-y-6 text-white group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <div className="size-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary mb-4 border border-white/5 shadow-inner">
                                        <Eye size={32} />
                                    </div>
                                    <h4 className="text-2xl font-black text-primary italic uppercase tracking-tighter leading-tight">Sync Optimization</h4>
                                    <p className="text-gray-400 font-bold italic leading-relaxed">
                                        Algorithmic suggestion of specific resources, paints, or building matrices based on your historical build data and interests.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section: Third-Party Node */}
                        <section id="sharing" className="scroll-mt-[120px] space-y-10 group">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <div className="size-14 rounded-2xl bg-[#111811] text-primary flex items-center justify-center font-black italic group-hover:scale-110 transition-transform shadow-xl">03</div>
                                Third-Party Node
                            </h2>
                            <div className="p-10 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 space-y-8">
                                <p className="text-gray-500 font-bold italic leading-relaxed">
                                    Intel sale is strictly prohibited. However, we may synchronize your data with verified tactical partners to facilitate our primary mission:
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {thirdParties.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 px-8 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <item.icon className="text-primary" size={20} />
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 italic">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Section: Trace Tracking */}
                        <section id="cookies" className="scroll-mt-[120px] space-y-10 group">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <div className="size-14 rounded-2xl bg-[#111811] text-primary flex items-center justify-center font-black italic group-hover:scale-110 transition-transform shadow-xl">04</div>
                                Trace Tracking
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {cookieTypes.map((cookie, index) => (
                                    <div
                                        key={index}
                                        className="text-center p-10 bg-white rounded-[2.5rem] border border-gray-50 shadow-premium hover:shadow-4xl transition-all space-y-6"
                                    >
                                        <div className="size-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mx-auto border border-primary/5">
                                            <Cookie size={32} />
                                        </div>
                                        <div className="space-y-3">
                                            <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary italic leading-none">{cookie.title}</h5>
                                            <p className="text-xs text-gray-400 font-bold italic">{cookie.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section: Legal Authority */}
                        <section id="rights" className="scroll-mt-[120px] space-y-10 group pb-24 border-b border-gray-100">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <div className="size-14 rounded-2xl bg-[#111811] text-primary flex items-center justify-center font-black italic group-hover:scale-110 transition-transform shadow-xl">05</div>
                                Legal Authority
                            </h2>
                            <p className="text-gray-500 font-bold italic leading-relaxed max-w-2xl">
                                Under global data protection protocols, you retain absolute authority over your hashes. Use the following commands for manual intel management:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <button className="flex items-center justify-between p-10 bg-white rounded-[3rem] border border-gray-50 shadow-premium group/btn hover:shadow-4xl hover:border-primary/20 transition-all text-left">
                                    <div className="flex items-center gap-6">
                                        <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover/btn:bg-primary group-hover/btn:text-white transition-all shadow-inner">
                                            <Download size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black italic tracking-tighter uppercase">Request Full Export</h4>
                                            <p className="text-xs text-gray-400 font-bold italic">Retrieve all localized sector data.</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-gray-100 group-hover/btn:text-primary transition-colors group-hover/btn:translate-x-2" size={24} />
                                </button>
                                <button className="flex items-center justify-between p-10 bg-white rounded-[3rem] border border-gray-50 shadow-premium group/btn hover:shadow-4xl hover:border-gray-900/20 transition-all text-left">
                                    <div className="flex items-center gap-6">
                                        <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover/btn:bg-gray-900 group-hover/btn:text-white transition-all shadow-inner">
                                            <Trash2 size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black italic tracking-tighter uppercase">Node Terminate</h4>
                                            <p className="text-xs text-gray-400 font-bold italic">Permanently erase profile and history.</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-gray-100 group-hover/btn:text-gray-900 transition-colors group-hover/btn:translate-x-2" size={24} />
                                </button>
                            </div>
                        </section>

                        {/* Footer Intelligence */}
                        <div className="py-24 bg-[#111811] rounded-[4rem] p-12 md:p-20 text-center space-y-12 relative overflow-hidden shadow-4xl text-white">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
                            <div className="relative z-10 space-y-10">
                                <div className="size-20 bg-primary/20 rounded-[28px] flex items-center justify-center text-primary mx-auto border border-white/5 shadow-inner">
                                    <Shield size={40} className="fill-current" />
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                                        Policy <span className="text-primary italic">Intelligence</span>
                                    </h2>
                                    <p className="text-gray-500 text-xl font-bold italic max-w-2xl mx-auto leading-relaxed">
                                        Questions regarding your data encryption? Coordinate with our specialized Security Team for immediate frequency response.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-8 justify-center pt-6">
                                    <a href="mailto:privacy@truevalue.com" className="h-20 px-12 bg-primary text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-primary/30 flex items-center gap-4">
                                        <Mail size={22} />
                                        privacy@truevalue.com
                                    </a>
                                    <p className="text-gray-600 font-black italic text-[10px] uppercase tracking-[0.3em] flex items-center italic">
                                        Legal Node . 8600 West Bryn Mawr Ave . Chicago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </main>

            {/* Tactical Footer */}
            <footer className="py-24 text-center space-y-10 animate-in fade-in duration-1000 delay-1000">
                <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">
                    <Link to="/terms-of-use" className="hover:text-primary transition-colors">Tactical Terms</Link>
                    <Link to="/shipping-policy" className="hover:text-primary transition-colors">Logistics Cycle</Link>
                    <Link to="/contact" className="hover:text-primary transition-colors">Deploy Hub</Link>
                </div>
                <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em] italic">© 2023 T-VALUE . ALL NODES ENCRYPTED</p>
            </footer>

            {/* Launch to Orbit (Back to top) */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={scrollToTop}
                        className="fixed bottom-12 right-12 size-18 bg-[#111811] text-primary rounded-[20px] shadow-4xl shadow-black/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50 border border-white/10 group"
                    >
                        <ArrowUp size={28} strokeWidth={3} className="group-hover:-translate-y-2 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PrivacyPolicyPage;
